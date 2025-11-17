'use client';
import { useState, useEffect } from 'react';
import { useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { fetchAndDecrypt, createSessionKey } from '@/lib/seal';
import { fetchProofData } from '@/lib/sui';
import { SessionKey } from '@mysten/seal';
import { Eye, Lock, Download, Loader2, RefreshCw, Key } from 'lucide-react';

interface ViewDataProps {
  proofObjectId?: string;
  transactionDigest?: string;
}

export default function ViewData({ proofObjectId, transactionDigest }: ViewDataProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<string | null>(null);
  const [resultData, setResultData] = useState<string | null>(null);
  const [proofInfo, setProofInfo] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const [storedObjectId, setStoredObjectId] = useState<string | null>(null);
  const [storedDigest, setStoredDigest] = useState<string | null>(null);

  const account = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setStoredObjectId(localStorage.getItem("proof_object_id"));
      setStoredDigest(localStorage.getItem("last_proof"));
    }
  }, []);

  // Listen for events
  useEffect(() => {
    const handleFileUploaded = () => {
      console.log("🔄 ViewData: File changed, clearing all state...");
      clearState();
      // Also clear stored IDs
      setStoredObjectId(null);
      setStoredDigest(null);
    };

    const handleProofMinted = () => {
      console.log("🔄 ViewData: New proof minted, clearing state...");
      clearState();
    };
    
    const handleAccessGranted = () => {
      console.log("🔄 ViewData: Access granted, refreshing...");
      refreshProofData();
    };

    window.addEventListener('fileUploaded', handleFileUploaded);
    window.addEventListener('proofMinted', handleProofMinted);
    window.addEventListener('accessGranted', handleAccessGranted);
    
    return () => {
      window.removeEventListener('fileUploaded', handleFileUploaded);
      window.removeEventListener('proofMinted', handleProofMinted);
      window.removeEventListener('accessGranted', handleAccessGranted);
    };
  }, [proofObjectId, storedObjectId, storedDigest]);

  const clearState = () => {
    setHealthData(null);
    setResultData(null);
    setProofInfo(null);
    setError(null);
    setSessionKey(null);
    setNeedsAuth(false);
  };

  const refreshProofData = async () => {
    if (!account) return;
    
    setIsRefreshing(true);
    try {
      let objectId = proofObjectId || storedObjectId;
      
      if (!objectId && (storedDigest || transactionDigest)) {
        const { getProofObjectIdFromTransaction } = await import('@/lib/sui');
        const digest = transactionDigest || storedDigest!;
        objectId = await getProofObjectIdFromTransaction(digest);
        
        if (objectId) {
          localStorage.setItem('proof_object_id', objectId);
          setStoredObjectId(objectId);
        }
      }

      if (objectId) {
        const proof = await fetchProofData(objectId);
        if (proof) {
          setProofInfo(proof);
          console.log("✅ Proof data refreshed");
        }
      }
    } catch (err) {
      console.error("❌ Failed to refresh:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Create SessionKey
  const handleCreateSession = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔑 Creating session key...");
      
      // Create a signer object compatible with Seal SDK
      const signer = {
        signPersonalMessage: async (message: Uint8Array) => {
          const result = await signPersonalMessage({
            message,
          });
          return { signature: result.signature };
        }
      };

      const newSessionKey = await createSessionKey(account.address, signer);
      setSessionKey(newSessionKey);
      setNeedsAuth(false);
      
      console.log("✅ Session key created");
      alert('✅ Session key created! You can now decrypt data.');
      
    } catch (err: any) {
      console.error("❌ Failed to create session:", err);
      setError('Failed to create session key: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!sessionKey) {
      setNeedsAuth(true);
      setError('You need to create a session key first. Click "Create Session Key" button.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHealthData(null);
    setResultData(null);

    try {
      let objectId: string | undefined = proofObjectId;

      if (!objectId) {
        objectId = storedObjectId || undefined;

        if (!objectId && (storedDigest || transactionDigest)) {
          const { getProofObjectIdFromTransaction } = await import('@/lib/sui');
          const digest = transactionDigest || storedDigest!;
          const fetchedObjectId = await getProofObjectIdFromTransaction(digest);

          if (fetchedObjectId) {
            objectId = fetchedObjectId;
            localStorage.setItem('proof_object_id', fetchedObjectId);
            setStoredObjectId(fetchedObjectId);
          }
        }
      }

      if (!objectId) {
        throw new Error('Proof object ID not found');
      }

      console.log("📥 Fetching proof data...");
      const proof = await fetchProofData(objectId);
      if (!proof) throw new Error('Proof NFT not found');

      console.log("📋 Proof owner:", proof.owner);
      console.log("👤 Current user:", account.address);
      console.log("👥 Approved viewers:", proof.approved_viewers);

      const isOwner = proof.owner.toLowerCase() === account.address.toLowerCase();
      const approvedViewers = Array.isArray(proof.approved_viewers) ? proof.approved_viewers : [];
      const isApproved = approvedViewers.some(addr => 
        addr.toLowerCase() === account.address.toLowerCase()
      );

      console.log("✅ Is Owner:", isOwner);
      console.log("✅ Is Approved:", isApproved);
      console.log("✅ Has Access:", isOwner || isApproved);

      // Set proof info BEFORE checking authorization
      setProofInfo(proof);

      if (!isOwner && !isApproved) {
        throw new Error(
          'You are not authorized to view this data.\n\n' +
          'The owner must grant access to your wallet address:\n' +
          account.address + '\n\n' +
          'Current approved viewers: ' + 
          (approvedViewers.length > 0 ? approvedViewers.join(', ') : 'None')
        );
      }

      // Validate blob IDs
      if (!proof.blob_id || !proof.policy_id) {
        throw new Error('Invalid health data blob ID or policy ID');
      }
      if (!proof.result_blob_id || !proof.result_policy_id) {
        throw new Error('Invalid result blob ID or policy ID');
      }

      console.log("🔓 Decrypting health data...");
      const decryptedHealthData = await fetchAndDecrypt(
        proof.blob_id, 
        proof.policy_id,
        sessionKey
      );
      setHealthData(decryptedHealthData);

      console.log("🔓 Decrypting result data...");
      const decryptedResult = await fetchAndDecrypt(
        proof.result_blob_id, 
        proof.result_policy_id,
        sessionKey
      );
      setResultData(decryptedResult);

      console.log("✅ All data decrypted successfully!");

    } catch (err: any) {
      console.error("❌ Error:", err);
      let errorMessage = err.message || 'Failed to view data';
      
      if (errorMessage.includes('Failed to fetch blob from Walrus')) {
        errorMessage += '\n\nCheck:\n• Blob ID is valid\n• Walrus URLs are correct\n• Network connection';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadData = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const displayObjectId = proofObjectId || storedObjectId;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-900">View Your Health Data</h3>
        </div>
        {proofInfo && (
          <button
            onClick={refreshProofData}
            disabled={isRefreshing}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Decrypt and view your encrypted health report. <strong>Both owners and viewers</strong> need to create a session key (valid 30 min) to decrypt data.
      </p>

      {/* Important Note for Viewers */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-xs text-yellow-800">
          <strong>📌 Important:</strong> If you're a viewer, make sure the owner has granted you access first. 
          Then create your own session key with YOUR wallet to decrypt the data.
        </p>
      </div>

      {displayObjectId && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-xs text-gray-600">
            <strong>Proof Object ID:</strong> <code className="break-all">{displayObjectId}</code>
          </p>
        </div>
      )}

      {!account && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800">⚠️ Please connect your wallet</p>
        </div>
      )}

      {/* Session Key Status */}
      {account && !sessionKey && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-blue-900 mb-1">Authorization Required</h4>
              <p className="text-xs text-blue-800 mb-3">
                You need to create a session key to decrypt data. This requires signing a message with your wallet.
              </p>
              <button
                onClick={handleCreateSession}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Session Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {sessionKey && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-800">
            ✅ <strong>Session Key Active:</strong> You can now decrypt data (valid for 30 minutes)
          </p>
        </div>
      )}

      <button
        onClick={handleView}
        disabled={isLoading || !account || !sessionKey}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Decrypting...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>View & Decrypt Data</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 whitespace-pre-wrap font-semibold">❌ {error}</p>
        </div>
      )}

      {/* Only show success if no error */}
      {proofInfo && !error && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            ✅ <strong>Access Verified:</strong> You have permission to view this data
          </p>
          <p className="text-xs text-green-700 mt-1">
            Owner: {proofInfo.owner.slice(0, 10)}...{proofInfo.owner.slice(-8)}
          </p>
          {proofInfo.approved_viewers && proofInfo.approved_viewers.length > 0 && (
            <p className="text-xs text-green-700 mt-1">
              Approved Viewers: {proofInfo.approved_viewers.length}
            </p>
          )}
        </div>
      )}

      {healthData && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-900">📊 Health Report Data</h4>
            <button
              onClick={() => downloadData(healthData, 'health-report.csv')}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          <pre className="text-xs text-blue-800 whitespace-pre-wrap font-mono bg-white p-3 rounded border max-h-40 overflow-auto">
            {healthData}
          </pre>
        </div>
      )}

      {resultData && (
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-purple-900">🏥 Health Assessment Result</h4>
            <button
              onClick={() => downloadData(resultData, 'health-assessment.txt')}
              className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          <pre className="text-xs text-purple-800 whitespace-pre-wrap font-mono bg-white p-3 rounded border max-h-96 overflow-auto">
            {resultData}
          </pre>
        </div>
      )}

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> If access was just granted, click "Refresh" before decrypting. Session keys are valid for 30 minutes and work for BOTH owners and viewers.
        </p>
      </div>
    </div>
  );
}