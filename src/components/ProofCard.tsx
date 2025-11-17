"use client";
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect, useRef } from 'react';
import { Download, Copy, ExternalLink } from 'lucide-react';

export default function ProofCard() {
  const [digest, setDigest] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);

  const loadProof = () => {
    const storedDigest = localStorage.getItem('last_proof');
    const storedTime = localStorage.getItem('proof_timestamp');
    setDigest(storedDigest);
    setTimestamp(storedTime || '');
    setIsLoading(false);
  };

  useEffect(() => {
    loadProof();

    const handleProofMinted = () => {
      console.log("🔄 ProofCard: New proof detected, reloading...");
      loadProof();
    };

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

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    // Get the SVG element
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (larger for better quality)
    const scale = 4;
    const qrSize = 200 * scale; // QR code size
    const brandingHeight = 150 * scale; // Branding section height
    const totalHeight = qrSize + brandingHeight; // Total canvas height
    
    canvas.width = qrSize;
    canvas.height = totalHeight;

    // Create enhanced image with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, qrSize, totalHeight);

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      // Draw QR code at the top
      ctx.drawImage(img, 0, 0, qrSize, qrSize);

      // Add branding section at bottom (gradient background)
      const gradient = ctx.createLinearGradient(0, qrSize, 0, totalHeight);
      gradient.addColorStop(0, '#9333EA'); // purple-600
      gradient.addColorStop(1, '#EC4899'); // pink-600
      ctx.fillStyle = gradient;
      ctx.fillRect(0, qrSize, qrSize, brandingHeight);

      // Add TruthVault text
      ctx.fillStyle = 'white';
      ctx.font = `bold ${36 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TruthVault', qrSize / 2, qrSize + (50 * scale));

      // Add subtitle
      ctx.font = `${18 * scale}px sans-serif`;
      ctx.fillText('Health Verification Proof', qrSize / 2, qrSize + (90 * scale));

      // Add timestamp if available
      if (timestamp) {
        ctx.font = `${14 * scale}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        const date = new Date(parseInt(timestamp)).toLocaleDateString();
        ctx.fillText(date, qrSize / 2, qrSize + (120 * scale));
      }

      // Download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `truthvault-proof-${digest?.slice(0, 8)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        
        alert('✅ QR Code downloaded!');
      });

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      alert('❌ Failed to download QR code');
    };

    img.src = url;
  };

  const downloadProofPDF = () => {
    if (!digest) return;

    const content = `
╔════════════════════════════════════════════════════════╗
║                                                        ║
║              TRUTHVAULT HEALTH PROOF                   ║
║                                                        ║
╚════════════════════════════════════════════════════════╝

BLOCKCHAIN PROOF CERTIFICATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transaction Digest:
${digest}

Minted On:
${timestamp ? new Date(parseInt(timestamp)).toLocaleString() : 'N/A'}

Verification URL:
https://suiscan.xyz/testnet/tx/${digest}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VERIFICATION INSTRUCTIONS:
1. Scan the QR code with any smartphone
2. Or visit the verification URL above
3. View on-chain proof on Sui Explorer

This proof is:
✓ Immutably stored on Sui blockchain
✓ Cryptographically secured
✓ Universally verifiable
✓ Privacy-preserving

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For more information, visit: https://truth-vault.patelyash.in

Generated by TruthVault - Secure Health Verification
Powered by Sui, Seal, Walrus & Nautilus AI
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `truthvault-certificate-${digest.slice(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('✅ Certificate downloaded!');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-6 rounded-xl shadow-lg text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
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

      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg mb-4" ref={qrRef}>
        <QRCodeSVG 
          value={url} 
          size={160} 
          className="mx-auto"
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Transaction Digest */}
      <div className="bg-white/20 backdrop-blur rounded-lg p-3 mb-4">
        <p className="text-xs font-mono break-all">{digest}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center space-x-2 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Explorer</span>
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(digest);
            alert('✅ Digest copied!');
          }}
          className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur text-white py-2 px-4 rounded-lg font-semibold hover:bg-white/30 transition"
        >
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </button>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={downloadQRCode}
          className="flex items-center justify-center space-x-2 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          <Download className="w-4 h-4" />
          <span>QR Image</span>
        </button>
        <button
          onClick={downloadProofPDF}
          className="flex items-center justify-center space-x-2 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          <Download className="w-4 h-4" />
          <span>Certificate</span>
        </button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-center text-white/70 mt-4">
        Share this QR code for instant verification
      </p>
    </div>
  );
}
