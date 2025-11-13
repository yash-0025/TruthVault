// 'use client';

// import { useState } from 'react';
// import { useCurrentAccount } from '@mysten/dapp-kit';
// import { encryptCSV } from '@/lib/seal';

// // -----------------------------
// // SAFE PDF.JS LOADER (v5.4.394)
// // -----------------------------
// async function loadPDF() {
//   const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
//   const worker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
//   pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
//   return pdfjs;
// }

// export default function UploadForm() {
//   const [status, setStatus] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState<string | null>(null);
//   const account = useCurrentAccount();

//   // Check if already uploaded on component mount
//   useState(() => {
//     const existing = localStorage.getItem('original_file');
//     if (existing) {
//       setUploadedFile(existing);
//       setStatus('Previously uploaded: ' + existing);
//     }
//   });

//   // -----------------------------
//   // Extract text from CSV / TXT / PDF
//   // -----------------------------
//   const extractText = async (file: File): Promise<string> => {
//     if (file.type === 'text/csv' || file.type === 'text/plain') {
//       return await file.text();
//     }

//     if (file.type === 'application/pdf') {
//       const pdfjs = await loadPDF();
//       const buffer = await file.arrayBuffer();

//       const pdf = await pdfjs.getDocument({ data: buffer }).promise;
//       let txt = '';

//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         txt += content.items.map((it: any) => it.str).join(' ') + '\n';
//       }

//       return txt;
//     }

//     return await file.text();
//   };

//   // -----------------------------
//   // Handle file upload
//   // -----------------------------
//   const handleFile = async (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file || !account) {
//       setStatus('⚠️ Connect wallet & pick a file');
//       return;
//     }

//     setIsUploading(true);
//     setStatus('');

//     try {
//       setStatus('📖 Reading file...');
//       const text = await extractText(file);

//       // Extract numbers
//     //   const nums = text.match(/\d+\.?\d*/g) || [];
//     //   const csv = `age,glucose,bmi\n${nums[0] || 40},${nums[1] || 120},${nums[2] || 25}`;
//     // Extract more data points
//     const nums = text.match(/\d+\.?\d*/g) || [];
//     const csv = `age,glucose,bmi,bp_sys,bp_dia,cholesterol,heart_rate
//     ${nums[0] || 40},${nums[1] || 120},${nums[2] || 25},${nums[3] || 120},${nums[4] || 80},${nums[5] || 180},${nums[6] || 72}`;

//       setStatus('🔒 Encrypting...');
//       const { encryptedObject, policyId } = await encryptCSV(csv, account.address!);

//       setStatus('☁️ Uploading to Walrus...');
//       const res = await fetch('/api/walrus-upload', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           blob: Array.from(encryptedObject),
//           publisher: process.env.NEXT_PUBLIC_WALRUS_PUBLISHER!,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       const blobId = data.blobId;

//       // Save results
//       localStorage.setItem('blob_id', blobId);
//       localStorage.setItem('policy_id', policyId);
//       localStorage.setItem('user_csv', csv);
//       localStorage.setItem('original_file', file.name);

//       setUploadedFile(file.name);
//       setStatus(`✅ Uploaded! Blob: ${blobId.slice(0, 12)}...`);

//       // Trigger a custom event to notify other components
//       window.dispatchEvent(new Event('fileUploaded'));

//     } catch (err: any) {
//       setStatus('❌ Error: ' + err.message);
//       console.error(err);
//     }

//     setIsUploading(false);
//   };

//   const handleClear = () => {
//     localStorage.removeItem('blob_id');
//     localStorage.removeItem('policy_id');
//     localStorage.removeItem('user_csv');
//     localStorage.removeItem('original_file');
//     setUploadedFile(null);
//     setStatus('');
    
//     // Trigger event
//     window.dispatchEvent(new Event('fileUploaded'));
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
//       <h2 className="text-2xl font-bold mb-4">Upload Health Report</h2>

//       {!uploadedFile ? (
//         <>
//           <input
//             type="file"
//             accept=".csv,.pdf,.txt"
//             onChange={handleFile}
//             disabled={isUploading || !account}
//             className="block w-full text-sm p-2 border rounded mb-4 disabled:opacity-50 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//           />
          
//           {!account && (
//             <p className="text-sm text-amber-600 mb-2">⚠️ Connect wallet first</p>
//           )}
//         </>
//       ) : (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-semibold text-green-800">📄 {uploadedFile}</p>
//               <p className="text-xs text-green-600 mt-1">Ready to prove health</p>
//             </div>
//             <button
//               onClick={handleClear}
//               className="text-sm text-red-600 hover:text-red-800 font-medium"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       )}

//       {status && (
//         <p className="text-sm text-gray-700 break-words bg-gray-50 p-3 rounded">
//           {status}
//         </p>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { encryptCSV } from '@/lib/seal';

async function loadPDF() {
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  const worker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
}

export default function UploadForm() {
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const account = useCurrentAccount();

  useEffect(() => {
    // Check if already uploaded on mount
    const existing = localStorage.getItem('original_file');
    if (existing) {
      setUploadedFile(existing);
      setStatus('Previously uploaded: ' + existing);
    }
  }, []);

  const extractText = async (file: File): Promise<string> => {
    if (file.type === 'text/csv' || file.type === 'text/plain') {
      return await file.text();
    }

    if (file.type === 'application/pdf') {
      const pdfjs = await loadPDF();
      const buffer = await file.arrayBuffer();

      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      let txt = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        txt += content.items.map((it: any) => it.str).join(' ') + '\n';
      }

      return txt;
    }

    return await file.text();
  };

  const handleFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !account) {
      setStatus('⚠️ Connect wallet & pick a file');
      return;
    }

    setIsUploading(true);
    setStatus('');

    try {
      setStatus('📖 Reading file...');
      const text = await extractText(file);

      // Extract numbers
      const nums = text.match(/\d+\.?\d*/g) || [];
      const csv = `age,glucose,bmi,bp_sys,bp_dia,cholesterol,heart_rate\n${nums[0] || 40},${nums[1] || 120},${nums[2] || 25},${nums[3] || 120},${nums[4] || 80},${nums[5] || 180},${nums[6] || 72}`;

      setStatus('🔒 Encrypting...');
      const { encryptedObject, policyId } = await encryptCSV(csv, account.address!);

      setStatus('☁️ Uploading to Walrus...');
      const res = await fetch('/api/walrus-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blob: Array.from(encryptedObject),
          publisher: process.env.NEXT_PUBLIC_WALRUS_PUBLISHER!,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const blobId = data.blobId;

      // Save results
      localStorage.setItem('blob_id', blobId);
      localStorage.setItem('policy_id', policyId);
      localStorage.setItem('user_csv', csv);
      localStorage.setItem('original_file', file.name);

      setUploadedFile(file.name);
      setStatus(`✅ Uploaded! Blob: ${blobId.slice(0, 12)}...`);

      // Trigger event to notify other components
      window.dispatchEvent(new Event('fileUploaded'));

    } catch (err: any) {
      setStatus('❌ Error: ' + err.message);
      console.error(err);
    }

    setIsUploading(false);
  };

  const handleClear = () => {
    // Clear all stored data including proof
    localStorage.removeItem('blob_id');
    localStorage.removeItem('policy_id');
    localStorage.removeItem('user_csv');
    localStorage.removeItem('original_file');
    localStorage.removeItem('last_proof');
    localStorage.removeItem('proof_timestamp');
    
    setUploadedFile(null);
    setStatus('');
    
    console.log("🗑️ Cleared all data including previous proof");
    
    // Trigger event to update all components
    window.dispatchEvent(new Event('fileUploaded'));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">Upload Health Report</h2>

      {!uploadedFile ? (
        <>
          <input
            type="file"
            accept=".csv,.pdf,.txt"
            onChange={handleFile}
            disabled={isUploading || !account}
            className="block w-full text-sm p-2 border rounded mb-4 disabled:opacity-50 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          
          {!account && (
            <p className="text-sm text-amber-600 mb-2">⚠️ Connect wallet first</p>
          )}
        </>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-800">📄 {uploadedFile}</p>
              <p className="text-xs text-green-600 mt-1">Ready to prove health</p>
            </div>
            <button
              onClick={handleClear}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 hover:bg-red-50 rounded transition"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {status && (
        <p className="text-sm text-gray-700 break-words bg-gray-50 p-3 rounded">
          {status}
        </p>
      )}
    </div>
  );
}