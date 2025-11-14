'use client';
import { useState, useEffect } from 'react';
import { runNautilusAI } from '@/lib/nautilus';
import { useMintProof } from '@/lib/sui';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function RunAIButton() {
  const [result, setResult] = useState('');
  const [csv, setCsv] = useState<string | null>(null);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const mintProof = useMintProof();
  const account = useCurrentAccount();

  const loadFromStorage = () => {
    const storedCsv = localStorage.getItem('user_csv');
    const storedBlobId = localStorage.getItem('blob_id');
    const storedPolicyId = localStorage.getItem('policy_id');
    
    setCsv(storedCsv);
    setBlobId(storedBlobId);
    setPolicyId(storedPolicyId);
    
    // Clear previous result if data was cleared
    if (!storedCsv) {
      setResult('');
    }
  };

  useEffect(() => {
    loadFromStorage();

    // Listen for file upload/clear events
    const handleFileUploaded = () => {
      console.log("🔄 RunAIButton: File changed, reloading data...");
      loadFromStorage();
    };

    window.addEventListener('fileUploaded', handleFileUploaded);
    return () => window.removeEventListener('fileUploaded', handleFileUploaded);
  }, [account]);

  const handleRun = async () => {
    if (!csv || !blobId || !policyId || !account) {
      alert('❌ Upload a report first and connect wallet');
      return;
    }

    setIsLoading(true);
    setResult(''); // Clear previous result

    try {
      console.log("🤖 Running Nautilus AI...");
      const { output, proof } = await runNautilusAI(csv);
      
      console.log("✅ AI Result:", output);
      setResult(output);

      console.log("🎨 Minting NFT...");
      await mintProof(blobId, policyId, output, proof);

    } catch (err: any) {
      console.error("❌ Error:", err);
      alert('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = csv && blobId && policyId && account;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">Prove My Health</h2>
      
      <button
        onClick={handleRun}
        disabled={!hasData || isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '⏳ Processing...' : '🚀 Prove My Health'}
      </button>

      {!hasData && (
        <p className="text-sm text-gray-500 text-center mt-3">
          {!account ? '⚠️ Connect wallet' : '⚠️ Upload a report first'}
        </p>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">✅ Health Analysis</h3>
          <pre className="text-xs text-green-700 whitespace-pre-wrap font-mono">{result}</pre>
        </div>
      )}
    </div>
  );
}