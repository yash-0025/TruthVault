import { NextResponse } from 'next/server';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { walrus, WalrusFile } from '@mysten/walrus';

// export async function POST(req: Request) {
//   try {
//     const { blob, digest, publisher } = await req.json();
//     console.log("BACKEND RECEIVED publisher =", publisher);


//     const client = new SuiClient({ url: getFullnodeUrl('testnet') }).$extend(
//       walrus({
//         uploadRelay: { host: publisher },
//       }),
//     );

//     const file = WalrusFile.from({
//       contents: Uint8Array.from(blob),
//       identifier: 'health-report.csv',
//     });

//     const flow = client.walrus.writeFilesFlow({ files: [file] });

//     // encode happens in frontend — no need here
//     // register is already signed by user wallet — we receive digest

//     // 1) Upload to Walrus Storage Nodes
//     await flow.upload({ digest });

//     // 2) Certify on chain (server does not need to sign)
//     await flow.certify();

//     // 3) Blob ID
//     const files = await flow.listFiles();
//     const blobId = files[0]?.blobId;

//     return NextResponse.json({ blobId });

//   } catch (err: any) {
//      console.error("WALRUS UPLOAD ERROR:", err?.message, err);
//   return new NextResponse(JSON.stringify({ error: err?.message || 'unknown error' }), {
//     status: 500,
//     headers: { "Content-Type": "application/json" }
//   });
// }
// }


// export async function POST(req: Request) {
//   try {
//     const bodyText = await req.text();
//     console.log("RAW BODY:", bodyText);

//     let body;
//     try {
//       body = JSON.parse(bodyText);
//     } catch (e) {
//       console.error("❌ JSON PARSE FAILED");
//       return new NextResponse(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
//     }

//     const { blob, digest, publisher } = body;

//     console.log("SERVER publisher =", publisher);
//     console.log("SERVER digest =", digest);
//     console.log("SERVER blob length =", blob?.length);

//     if (!publisher) {
//       console.error("❌ Missing publisher!");
//       return NextResponse.json({ error: "Missing publisher" }, { status: 400 });
//     }

//     const client = new SuiClient({ url: getFullnodeUrl('testnet') }).$extend(
//       walrus({
//         uploadRelay: { host: publisher },
//       }),
//     );

//     console.log("Walrus client configured with host:", publisher);

//     const file = WalrusFile.from({
//       contents: Uint8Array.from(blob),
//       identifier: 'health-report.csv',
//     });

//     console.log("File created. Contents length:", file.contents.length);

//     const flow = client.walrus.writeFilesFlow({ files: [file] });
//     console.log("Flow created.");

//     // Upload
//     console.log("Uploading...");
//     await flow.upload({ digest });
//     console.log("Upload done.");

//     // Certify
//     console.log("Certifying...");
//     await flow.certify();
//     console.log("Certify done.");

//     // Get blob ID
//     const files = await flow.listFiles();
//     const blobId = files[0]?.blobId;
//     console.log("BlobID:", blobId);

//     return NextResponse.json({ blobId });

//   } catch (err: any) {
//     console.error("❌ WALRUS UPLOAD ERROR:", err?.message, err);
//     return new NextResponse(JSON.stringify({ error: err?.message || 'unknown error' }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// }


export async function POST(req: Request) {
  console.log("=== WALRUS UPLOAD API CALLED ===");

  try {
    const { blob, publisher } = await req.json();
    console.log("Blob length:", blob?.length);
    console.log("Publisher:", publisher);

    if (!blob || !publisher) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Convert blob to Uint8Array
    const data = new Uint8Array(blob);
    console.log("Data converted to Uint8Array, length:", data.length);

    // Correct Walrus API endpoint - no /v1/store suffix
    const walrusUrl = `${publisher}/v1/blobs`;
    console.log("Uploading to:", walrusUrl);

    const uploadResponse = await fetch(walrusUrl, {
      method: 'PUT',
      body: data,
    });

    console.log("Walrus response status:", uploadResponse.status);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Walrus error response:", errorText);
      throw new Error(`Walrus upload failed (${uploadResponse.status}): ${errorText}`);
    }

    const result = await uploadResponse.json();
    console.log("Walrus response:", JSON.stringify(result, null, 2));

    // Extract blobId from various possible response formats
    const blobId = result.newlyCreated?.blobObject?.blobId || 
                   result.alreadyCertified?.blobId ||
                   result.blobId;

    if (!blobId) {
      console.error("Full Walrus response:", result);
      throw new Error("No blobId found in Walrus response");
    }

    console.log("✅ Upload successful! BlobID:", blobId);

    return NextResponse.json({ blobId });

  } catch (err: any) {
    console.error("❌ UPLOAD ERROR:", err.message);
    console.error("Full error:", err);
    
    return NextResponse.json(
      { 
        error: err.message || 'Upload failed',
        details: err.cause?.message 
      },
      { status: 500 }
    );
  }
}