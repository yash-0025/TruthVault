import { SealClient, SessionKey, EncryptedObject } from '@mysten/seal';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { fromHex } from '@mysten/bcs';

const sui = new SuiClient({ url: getFullnodeUrl('testnet') });

const testnetServers = [
  "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75",
  "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8",
];
const serverConfigs = testnetServers.map(id => ({ objectId: id, weight: 1 }));

const seal = new SealClient({
  suiClient: sui,
  serverConfigs,
  verifyKeyServers: false,
});

// Walrus URLs
const WALRUS_PUBLISHER = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER || 
  "https://publisher.walrus-testnet.walrus.space";

const WALRUS_AGGREGATOR = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR || 
  "https://aggregator.walrus-testnet.walrus.space";

/**
 * Encrypt CSV data using Seal
 */
export async function encryptCSV(csv: string, address: string) {
  const data = new TextEncoder().encode(csv);
  const pkg = process.env.NEXT_PUBLIC_PACKAGE_ID!;

  const truncatedHex = address.replace("0x", "").slice(0, 32);
  const policyId = "0x" + truncatedHex;

  const { encryptedObject } = await seal.encrypt({
    threshold: 1,
    packageId: pkg,
    id: policyId,
    data,
  });

  return {
    encryptedObject,
    policyId,
  };
}

/**
 * Create a SessionKey for decryption
 * User must sign this to authorize access
 */
export async function createSessionKey(
  userAddress: string,
  signer: any // wallet signer
): Promise<SessionKey> {
  const pkg = process.env.NEXT_PUBLIC_PACKAGE_ID!;
  
  const sessionKey = await SessionKey.create({
    address: userAddress,
    packageId: pkg,
    ttlMin: 30, // ✅ Fixed: Must be between 1-30 minutes (was 60)
    suiClient: sui,
  });

  // Get message to sign
  const message = sessionKey.getPersonalMessage();
  
  // User signs with their wallet
  const { signature } = await signer.signPersonalMessage(message);
  
  // Set signature to complete initialization
  sessionKey.setPersonalMessageSignature(signature);
  
  return sessionKey;
}

/**
 * Build transaction bytes for seal_approve
 * This validates access control on-chain
 */
async function buildTxBytes(policyId: string): Promise<Uint8Array> {
  const pkg = process.env.NEXT_PUBLIC_PACKAGE_ID!;
  
  const tx = new Transaction();
  
  // Call your Move contract's seal_approve function
  // Adjust module and function name based on your contract
  tx.moveCall({
    target: `${pkg}::truth_nft::seal_approve`,
    arguments: [
      tx.pure.vector("u8", fromHex(policyId)),
    ],
  });

  // Build transaction bytes (not for execution, just for validation)
  const txBytes = await tx.build({
    client: sui,
    onlyTransactionKind: true,
  });

  return txBytes;
}

/**
 * Decrypt data using Seal
 * Requires SessionKey and txBytes for access control validation
 */
export async function decryptData(
  encryptedData: Uint8Array,
  sessionKey: SessionKey,
  policyId: string
): Promise<string> {
  try {
    // Build transaction bytes for access validation
    const txBytes = await buildTxBytes(policyId);
    
    // Decrypt with proper parameters
    const decryptedData = await seal.decrypt({
      data: encryptedData,
      sessionKey,
      txBytes,
    });

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error("❌ Decryption failed:", error);
    throw new Error(`Failed to decrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch encrypted data from Walrus and decrypt it
 */
export async function fetchAndDecrypt(
  blobId: string,
  policyId: string,
  sessionKey: SessionKey,
  useAggregator: boolean = true
): Promise<string> {
  
  if (!blobId || blobId === '' || blobId === 'undefined') {
    throw new Error(`Invalid blob ID: "${blobId}"`);
  }
  if (!policyId || policyId === '' || policyId === 'undefined') {
    throw new Error(`Invalid policy ID: "${policyId}"`);
  }
  
  const baseUrl = useAggregator ? WALRUS_AGGREGATOR : WALRUS_PUBLISHER;
  const downloadUrl = `${baseUrl}/v1/blobs/${blobId}`;
  
  // console.log("🔍 Fetching from Walrus:", {
  //   blobId,
  //   policyId: policyId.slice(0, 10) + "...",
  //   url: downloadUrl,
  // });
  
  try {
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/octet-stream',
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      
      if (!useAggregator) {
        // console.log("⚠️ Publisher failed, trying aggregator...");
        return fetchAndDecrypt(blobId, policyId, sessionKey, true);
      }
      
      throw new Error(
        `Failed to fetch blob from Walrus (${response.status}): ${errorText}\n` +
        `Blob ID: ${blobId}\n` +
        `URL: ${downloadUrl}`
      );
    }

    const encryptedBlob = await response.arrayBuffer();
    const encryptedData = new Uint8Array(encryptedBlob);

    // console.log("✅ Fetched blob, size:", encryptedData.length, "bytes");
    
    // Decrypt with SessionKey
    const decrypted = await decryptData(encryptedData, sessionKey, policyId);
    // console.log("✅ Decrypted successfully");
    
    return decrypted;
    
  } catch (error) {
    console.error("❌ Fetch and decrypt error:", error);
    throw error;
  }
}

/**
 * Upload encrypted data to Walrus
 */
export async function uploadToWalrus(encryptedData: Uint8Array): Promise<string> {
  // console.log("📤 Uploading to Walrus, size:", encryptedData.length);
  
  const response = await fetch('/api/walrus-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      blob: Array.from(encryptedData),
      publisher: WALRUS_PUBLISHER,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload to Walrus');
  }

  const data = await response.json();
  
  if (!data.blobId) {
    throw new Error('Upload succeeded but no blob ID returned');
  }
  
  // console.log("✅ Uploaded to Walrus, blob ID:", data.blobId);
  return data.blobId;
}

// Export for use in components
export { seal, sui };
export const WALRUS_CONFIG = {
  publisher: WALRUS_PUBLISHER,
  aggregator: WALRUS_AGGREGATOR,
}; 