'use client';
import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';

interface ShareProofProps {
  proofObjectId?: string;
  transactionDigest?: string;
}

export default function ShareProof({ proofObjectId, transactionDigest }: ShareProofProps) {
  const [copied, setCopied] = useState(false);
  const [displayObjectId, setDisplayObjectId] = useState<string | null>(null);
  const [displayDigest, setDisplayDigest] = useState<string | null>(null);
  const account = useCurrentAccount();

  const loadFromLocalStorage = () => {
    const storedObjectId = localStorage.getItem('proof_object_id');
    const storedDigest = localStorage.getItem('last_proof');
    setDisplayObjectId(proofObjectId || storedObjectId);
    setDisplayDigest(transactionDigest || storedDigest);
  };

  useEffect(() => {
    loadFromLocalStorage();

    // Listen for file upload/clear and proof mint events
    const handleFileUploaded = () => {
      console.log("🔄 ShareProof: File changed, reloading...");
      loadFromLocalStorage();
    };

    const handleProofMinted = () => {
      console.log("🔄 ShareProof: New proof minted, reloading...");
      loadFromLocalStorage();
    };

    window.addEventListener('fileUploaded', handleFileUploaded);
    window.addEventListener('proofMinted', handleProofMinted);
    
    return () => {
      window.removeEventListener('fileUploaded', handleFileUploaded);
      window.removeEventListener('proofMinted', handleProofMinted);
    };
  }, [proofObjectId, transactionDigest]);

  const shareUrl = displayDigest 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/view?tx=${displayDigest}`
    : displayObjectId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/view?id=${displayObjectId}`
    : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      label: 'Share Transaction Link',
      value: shareUrl || 'N/A',
      description: 'Share this link - viewers can access if you grant them permission',
    },
    {
      label: 'Transaction Digest',
      value: displayDigest || 'N/A',
      description: 'The transaction hash on Sui blockchain',
    },
    {
      label: 'Proof Object ID',
      value: displayObjectId || 'N/A',
      description: 'The unique object ID of your proof NFT',
    },
  ];

  if (!displayObjectId && !displayDigest) {
    return (
      <div>
        <p className="text-sm text-gray-500 text-center py-4">
          No proof found. Please mint a proof NFT first.
        </p>
      </div>
    );
  }

  return (
    <div>

      <p className="text-sm text-gray-600 mb-4">
        Share your health proof with institutions (banks, insurance, employers). 
        They can view the proof, but you must grant them access to decrypt the data.
      </p>

      <div className="space-y-3">
        {shareOptions.map((option, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {option.label}
                </label>
                <p className="text-xs text-gray-500 mb-2">{option.description}</p>
                <div className="bg-gray-50 p-2 rounded border">
                  <code className="text-xs text-gray-800 break-all">{option.value}</code>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(option.value)}
                className="ml-3 p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {shareUrl && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 How to Share:</h4>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Copy the "Share Transaction Link" above</li>
            <li>Send it to the institution (bank, insurance, employer)</li>
            <li>They can view the proof on the blockchain</li>
            <li>Use "Access Control" section to grant them permission to decrypt the data</li>
            <li>They can then view the decrypted health data</li>
          </ol>
        </div>
      )}

      {displayDigest && (
        <div className="mt-4">
          <a
            href={`https://suiscan.xyz/testnet/tx/${displayDigest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on Sui Explorer</span>
          </a>
        </div>
      )}
    </div>
  );
}
