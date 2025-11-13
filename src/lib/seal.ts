import { SealClient } from '@mysten/seal';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

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

// export async function encryptCSV(csv: string, address: string) {
//   const data = new TextEncoder().encode(csv);
//   const pkg = process.env.NEXT_PUBLIC_PACKAGE_ID!;  // String

//   const { encryptedObject } = await seal.encrypt({
//     threshold: 2,
//     packageId: pkg,
//     id: address,  // Fixed: string for address
//     data,
//   });

//   return { encryptedObject, policyId: address };
// }

export async function encryptCSV(csv: string, address: string) {
  console.log("encryptCSV() called");

  const data = new TextEncoder().encode(csv);
  const pkg = process.env.NEXT_PUBLIC_PACKAGE_ID!;

  // Take the first 32 hex characters (16 bytes)
  const truncatedHex = address.replace("0x", "").slice(0, 32);

  // Seal EXPECTS a string beginning with "0x"
  const policyId = "0x" + truncatedHex;

  console.log("Using policyId:", policyId, "length:", policyId.length);

  const { encryptedObject } = await seal.encrypt({
    threshold: 1,      // important!
    packageId: pkg,
    id: policyId,      // <-- MUST BE STRING STARTING WITH 0x
    data,
  });

  return {
    encryptedObject,
    policyId,          // return hex form for tracking
  };
}

