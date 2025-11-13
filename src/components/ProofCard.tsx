// 'use client';
// import { QRCodeSVG } from 'qrcode.react';
// import { useState, useEffect } from 'react';

// export default function ProofCard() {
//   const [digest, setDigest] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for proof on mount
//     const checkProof = () => {
//       const storedDigest = localStorage.getItem('last_proof');
//       setDigest(storedDigest);
//       setIsLoading(false);
//     };

//     checkProof();

//     // Listen for new proofs
//     const handleProofMinted = () => {
//       checkProof();
//     };

//     window.addEventListener('proofMinted', handleProofMinted);
//     return () => window.removeEventListener('proofMinted', handleProofMinted);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="bg-gray-100 p-6 rounded-xl shadow-lg text-center">
//         <p className="text-gray-500">Checking for proof NFT...</p>
//       </div>
//     );
//   }

//   if (!digest) {
//     return (
//       <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl shadow-lg text-center border-2 border-dashed border-gray-300">
//         <div className="text-gray-400 mb-3">
//           <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//         </div>
//         <h3 className="text-lg font-semibold text-gray-600 mb-2">No Proof NFT Yet</h3>
//         <p className="text-sm text-gray-500">Complete the "Prove My Health" step to mint your proof NFT</p>
//       </div>
//     );
//   }

//   const url = `https://suiscan.xyz/testnet/tx/${digest}`;

//   return (
//     <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg">
//       <div className="text-center mb-4">
//         <h2 className="text-2xl font-bold mb-2">🎉 Proof NFT Minted!</h2>
//         <p className="text-sm opacity-90">Your health proof is now on-chain</p>
//       </div>

//       <div className="bg-white p-4 rounded-lg mb-4">
//         <QRCodeSVG 
//           value={url} 
//           size={160} 
//           className="mx-auto"
//           level="H"
//           includeMargin={true}
//         />
//       </div>

//       <div className="bg-white/20 backdrop-blur rounded-lg p-3 mb-4">
//         <p className="text-xs font-mono break-all">{digest}</p>
//       </div>

//       <div className="flex gap-2">
//         <a 
//           href={url} 
//           target="_blank" 
//           rel="noopener noreferrer" 
//           className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
//         >
//           View on Explorer
//         </a>
//         <button
//           onClick={() => navigator.clipboard.writeText(digest)}
//           className="bg-white/20 backdrop-blur text-white py-2 px-4 rounded-lg font-semibold hover:bg-white/30 transition"
//         >
//           Copy
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

export default function ProofCard() {
  const [digest, setDigest] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<string>('');

  const loadProof = () => {
    const storedDigest = localStorage.getItem('last_proof');
    const storedTime = localStorage.getItem('proof_timestamp');
    setDigest(storedDigest);
    setTimestamp(storedTime || '');
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial load
    loadProof();

    // Listen for new proofs
    const handleProofMinted = () => {
      console.log("🔄 ProofCard: New proof detected, reloading...");
      loadProof();
    };

    // Listen for clear events
    const handleFileUploaded = () => {
      console.log("🔄 ProofCard: File uploaded/cleared, checking state...");
      loadProof();
    };

    window.addEventListener('proofMinted', handleProofMinted);
    window.addEventListener('fileUploaded', handleFileUploaded);
    
    return () => {
      window.removeEventListener('proofMinted', handleProofMinted);
      window.removeEventListener('fileUploaded', handleFileUploaded);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-6 rounded-xl shadow-lg text-center">
        <p className="text-gray-500">Checking for proof NFT...</p>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl shadow-lg text-center border-2 border-dashed border-gray-300">
        <div className="text-gray-400 mb-3">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Proof NFT Yet</h3>
        <p className="text-sm text-gray-500">Complete the "Prove My Health" step to mint your proof NFT</p>
      </div>
    );
  }

  const url = `https://suiscan.xyz/testnet/tx/${digest}`;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">🎉 Proof NFT Minted!</h2>
        <p className="text-sm opacity-90">Your health proof is now on-chain</p>
        {timestamp && (
          <p className="text-xs opacity-75 mt-1">
            Minted: {new Date(parseInt(timestamp)).toLocaleString()}
          </p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg mb-4">
        <QRCodeSVG 
          value={url} 
          size={160} 
          className="mx-auto"
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="bg-white/20 backdrop-blur rounded-lg p-3 mb-4">
        <p className="text-xs font-mono break-all">{digest}</p>
      </div>

      <div className="flex gap-2">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
        >
          View on Explorer
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(digest);
            alert('✅ Digest copied!');
          }}
          className="bg-white/20 backdrop-blur text-white py-2 px-4 rounded-lg font-semibold hover:bg-white/30 transition"
        >
          Copy
        </button>
      </div>
    </div>
  );
}