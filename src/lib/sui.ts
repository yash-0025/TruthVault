// import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
// import { Transaction } from '@mysten/sui/transactions';

// export function useMintProof() {
//   const account = useCurrentAccount();
//   const { mutate: sign } = useSignAndExecuteTransaction();

//   return async (blobId: string, policyId: string, result: string, proof: string) => {
//     if (!account) {
//       console.error("❌ No account connected");
//       return;
//     }

//     console.log("🎨 Preparing mint transaction...");

//     const tx = new Transaction();
//     const enc = (s: string) => new TextEncoder().encode(s);

//     const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID!;

//     tx.moveCall({
//       target: `${packageId}::truth_nft::mint`,
//       arguments: [
//         tx.pure.vector('u8', Array.from(enc(blobId))),
//         tx.pure.vector('u8', Array.from(enc(policyId))),
//         tx.pure.vector('u8', Array.from(enc(result))),
//         tx.pure.vector('u8', Array.from(enc(proof))),
//       ],
//     });

//     console.log("📤 Signing transaction...");

//     sign(
//       { transaction: tx },
//       {
//         onSuccess: (r) => {
//           console.log("✅ Transaction successful!");
//           console.log("Digest:", r.digest);
//           localStorage.setItem('last_proof', r.digest);
          
//           // Trigger event to update ProofCard
//           window.dispatchEvent(new Event('proofMinted'));
          
//           alert('🎉 Proof NFT minted successfully!');
//         },
//         onError: (err) => {
//           console.error("❌ Transaction failed:", err);
//           alert('Transaction failed: ' + err.message);
//         },
//       }
//     );
//   };
// }


import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

export function useMintProof() {
  const account = useCurrentAccount();
  const { mutate: sign } = useSignAndExecuteTransaction();

  return async (blobId: string, policyId: string, result: string, proof: string) => {
    if (!account) {
      console.error("❌ No account connected");
      return;
    }

    console.log("🎨 Preparing mint transaction...");

    const tx = new Transaction();
    const enc = (s: string) => new TextEncoder().encode(s);

    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID!;

    tx.moveCall({
      target: `${packageId}::truth_nft::mint`,
      arguments: [
        tx.pure.vector('u8', Array.from(enc(blobId))),
        tx.pure.vector('u8', Array.from(enc(policyId))),
        tx.pure.vector('u8', Array.from(enc(result))),
        tx.pure.vector('u8', Array.from(enc(proof))),
      ],
    });

    console.log("📤 Signing transaction...");

    sign(
      { transaction: tx },
      {
        onSuccess: (r) => {
          console.log("✅ Transaction successful!");
          console.log("Digest:", r.digest);
          
          // Store with timestamp
          localStorage.setItem('last_proof', r.digest);
          localStorage.setItem('proof_timestamp', Date.now().toString());
          
          // Trigger event to update ProofCard
          window.dispatchEvent(new Event('proofMinted'));
          
          alert('🎉 Proof NFT minted successfully!');
        },
        onError: (err) => {
          console.error("❌ Transaction failed:", err);
          alert('Transaction failed: ' + err.message);
        },
      }
    );
  };
}