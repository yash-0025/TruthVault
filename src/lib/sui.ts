
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

export function useMintProof() {
  const account = useCurrentAccount();
  const { mutate: sign } = useSignAndExecuteTransaction();

  return async (blobId: string, policyId: string, resultBlobId: string, resultPolicyId: string, proof: string) => {
    if (!account) return;

    const tx = new Transaction();
    const enc = (s: string) => new TextEncoder().encode(s);
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID!;

    tx.moveCall({
      target: `${packageId}::truth_nft::mint`,
      arguments: [
        tx.pure.vector('u8', Array.from(enc(blobId))),
        tx.pure.vector('u8', Array.from(enc(policyId))),
        tx.pure.vector('u8', Array.from(enc(resultBlobId))),
        tx.pure.vector('u8', Array.from(enc(resultPolicyId))),
        tx.pure.vector('u8', Array.from(enc(proof))),
      ],
    });

    sign(
      { transaction: tx },
      {
        onSuccess: async (r) => {
          localStorage.setItem('last_proof', r.digest);
          localStorage.setItem('proof_timestamp', Date.now().toString());
          
          try {
            const proofObjectId = await getProofObjectIdFromTransaction(r.digest);
            if (proofObjectId) {
              localStorage.setItem('proof_object_id', proofObjectId);
              console.log("✅ Proof Object ID:", proofObjectId);
            }
          } catch (err) {
            console.error("⚠️ Could not get proof object ID:", err);
          }
          
          window.dispatchEvent(new Event('proofMinted'));
          alert('🎉 Private Proof NFT minted successfully!');
        },
        onError: (err) => {
          console.error("❌ Transaction failed:", err);
          alert('Transaction failed: ' + err.message);
        },
      }
    );
  };
}

export async function getProofObjectIdFromTransaction(
  digest: string,
  retries = 30,
  interval = 2000
): Promise<string | null> {
  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

  for (let i = 0; i < retries; i++) {
    try {
      const tx = await suiClient.getTransactionBlock({
        digest,
        options: {
          showObjectChanges: true,
          showEffects: true,
        },
      });

      const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID!;
      const proofType = `${packageId}::truth_nft::Proof`;

      const createdObjects = tx.objectChanges?.filter(
        (c) => c.type === 'created' && c.objectType === proofType
      );

      if (createdObjects?.length) {
        const obj = createdObjects[0];
        if ('objectId' in obj) return obj.objectId;
      }

      return null;
    } catch (err: any) {
      if (err?.message?.includes("Could not find the referenced transaction")) {
        console.log(`⏳ Indexing delay: retry ${i + 1}/${retries}...`);
        await new Promise((res) => setTimeout(res, interval));
        continue;
      }
      throw err;
    }
  }

  console.error("❌ Timeout: transaction still not indexed");
  return null;
}

export async function fetchProofData(objectId: string) {
  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
  
  try {
    const object = await suiClient.getObject({
      id: objectId,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });

    if (object.data?.content && 'fields' in object.data.content) {
      const fields = object.data.content.fields as any;
      
      // CRITICAL FIX: Parse approved_viewers from VecSet
      let approvedViewers: string[] = [];
      
      console.log("🔍 Raw approved_viewers:", JSON.stringify(fields.approved_viewers, null, 2));
      
      if (fields.approved_viewers) {
        const raw = fields.approved_viewers;
        
        // EXACT structure: {type: "...", fields: {contents: [...]}}
        if (raw.fields && raw.fields.contents && Array.isArray(raw.fields.contents)) {
          approvedViewers = raw.fields.contents;
          console.log("✅ Parsed from fields.contents:", approvedViewers);
        }
        // Fallback: {contents: [...]}
        else if (raw.contents && Array.isArray(raw.contents)) {
          approvedViewers = raw.contents;
          console.log("✅ Parsed from direct contents:", approvedViewers);
        }
        // Fallback: direct array
        else if (Array.isArray(raw)) {
          approvedViewers = raw;
          console.log("✅ Parsed as direct array:", approvedViewers);
        }
        else {
          console.error("⚠️ Unknown VecSet format:", raw);
        }
      }
      
      console.log("✅ Final parsed approved_viewers:", approvedViewers);
      
      return {
        objectId,
        owner: fields.owner,
        blob_id: fields.blob_id,
        policy_id: fields.policy_id,
        result_blob_id: fields.result_blob_id,
        result_policy_id: fields.result_policy_id,
        proof_hash: fields.proof_hash,
        created_at: fields.created_at,
        approved_viewers: approvedViewers,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching proof data:", error);
    throw error;
  }
}

export function useGrantAccess() {
  const account = useCurrentAccount();
  const { mutate: sign } = useSignAndExecuteTransaction();

  return async (proofObjectId: string, viewerAddress: string, durationEpochs: number = 30) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    return new Promise<void>((resolve, reject) => {
      const tx = new Transaction();
      const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID!;

      console.log("🔐 Granting access:", {
        proofObjectId,
        viewerAddress,
        durationEpochs,
      });

      tx.moveCall({
        target: `${packageId}::truth_nft::grant_access`,
        arguments: [
          tx.object(proofObjectId),
          tx.pure.address(viewerAddress),
          tx.pure.u64(durationEpochs),
        ],
      });

      sign(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("✅ Access granted successfully:", result);
            resolve();
          },
          onError: (err) => {
            console.error("❌ Failed to grant access:", err);
            reject(err);
          },
        }
      );
    });
  };
}

export function useRevokeAccess() {
  const account = useCurrentAccount();
  const { mutate: sign } = useSignAndExecuteTransaction();

  return async (proofObjectId: string, viewerAddress: string) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    return new Promise<void>((resolve, reject) => {
      const tx = new Transaction();
      const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID!;

      console.log("🔓 Revoking access:", {
        proofObjectId,
        viewerAddress,
      });

      tx.moveCall({
        target: `${packageId}::truth_nft::revoke_access`,
        arguments: [
          tx.object(proofObjectId),
          tx.pure.address(viewerAddress),
        ],
      });

      sign(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("✅ Access revoked successfully:", result);
            resolve();
          },
          onError: (err) => {
            console.error("❌ Failed to revoke access:", err);
            reject(err);
          },
        }
      );
    });
  };
}