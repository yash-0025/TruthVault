
'use client';
import { useState, useEffect } from 'react';
import { useGrantAccess, useRevokeAccess, fetchProofData } from '@/lib/sui';
import { Shield, Clock, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AccessControl({ proofObjectId }: { proofObjectId?: string }) {
  const [viewerAddress, setViewerAddress] = useState('');
  const [duration, setDuration] = useState(30);
  const [actualProofObjectId, setActualProofObjectId] = useState<string>('');
  const [approvedViewers, setApprovedViewers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [grantStatus, setGrantStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const grantAccess = useGrantAccess();
  const revokeAccess = useRevokeAccess();

  const loadProofObjectId = async () => {
    const storedObjectId = localStorage.getItem('proof_object_id');
    const objectId = proofObjectId || storedObjectId || '';
    setActualProofObjectId(objectId);
    
    // Load approved viewers
    if (objectId) {
      await loadApprovedViewers(objectId);
    }
  };

  const loadApprovedViewers = async (objectId: string) => {
    try {
      const proof = await fetchProofData(objectId);
      if (proof && proof.approved_viewers) {
        const viewers = Array.isArray(proof.approved_viewers) ? proof.approved_viewers : [];
        setApprovedViewers(viewers);
        console.log("✅ Loaded approved viewers:", viewers);
      }
    } catch (err) {
      console.error("❌ Failed to load approved viewers:", err);
    }
  };

  useEffect(() => {
    loadProofObjectId();

    const handleFileUploaded = () => {
      console.log("🔄 AccessControl: File changed, reloading...");
      loadProofObjectId();
    };

    const handleProofMinted = () => {
      console.log("🔄 AccessControl: New proof minted, reloading...");
      loadProofObjectId();
    };

    window.addEventListener('fileUploaded', handleFileUploaded);
    window.addEventListener('proofMinted', handleProofMinted);
    
    return () => {
      window.removeEventListener('fileUploaded', handleFileUploaded);
      window.removeEventListener('proofMinted', handleProofMinted);
    };
  }, [proofObjectId]);

  const handleGrant = async () => {
    if (!viewerAddress) {
      alert('Please enter viewer address');
      return;
    }
    
    // Validate address format
    if (!viewerAddress.startsWith('0x') || viewerAddress.length !== 66) {
      alert('Invalid Sui address format. Address must start with 0x and be 66 characters long.');
      return;
    }
    
    if (!actualProofObjectId) {
      alert('Proof object ID not found. Please mint a proof NFT first.');
      return;
    }
    
    setIsLoading(true);
    setGrantStatus('idle');
    
    try {
      await grantAccess(actualProofObjectId, viewerAddress, duration);
      
      // Wait for transaction to be indexed
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Reload approved viewers
      await loadApprovedViewers(actualProofObjectId);
      
      setGrantStatus('success');
      setViewerAddress('');
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('accessGranted'));
      
      setTimeout(() => setGrantStatus('idle'), 5000);
    } catch (err: any) {
      console.error("❌ Failed to grant access:", err);
      setGrantStatus('error');
      setTimeout(() => setGrantStatus('idle'), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (viewerToRevoke: string) => {
    if (!actualProofObjectId) {
      alert('Proof object ID not found.');
      return;
    }

    if (!confirm(`Are you sure you want to revoke access for ${formatAddress(viewerToRevoke)}?\n\nThey will no longer be able to decrypt your health data.`)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the revoke function (it's already a hook at component level)
      await revokeAccess(actualProofObjectId, viewerToRevoke);
      
      // Wait for transaction to be indexed
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Reload approved viewers
      await loadApprovedViewers(actualProofObjectId);
      
      alert('✅ Access revoked successfully! The viewer can no longer decrypt your data.');
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('accessRevoked'));
      
    } catch (err: any) {
      console.error("❌ Failed to revoke access:", err);
      alert('❌ Failed to revoke access: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Grant temporary view access to institutions (banks, insurance, employers).
        All medical data is encrypted - only authorized viewers can decrypt and view the information.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-xs text-blue-800">
          🔒 <strong>Privacy Note:</strong> Your health reports and assessment results are encrypted using threshold encryption.
          Only you (the owner) can decrypt by default. When you grant access, the viewer will be able to decrypt using their wallet.
        </p>
      </div>

      {grantStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-green-800 font-semibold">Access granted successfully!</p>
            <p className="text-xs text-green-700 mt-1">
              The viewer can now decrypt and view your health data. They may need to refresh the page.
            </p>
          </div>
        </div>
      )}

      {grantStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800 font-semibold">Failed to grant access</p>
            <p className="text-xs text-red-700 mt-1">
              Please try again. Make sure the address is valid and you have enough gas.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Viewer Address (Sui Wallet)
          </label>
          <input
            type="text"
            value={viewerAddress}
            onChange={(e) => setViewerAddress(e.target.value.trim())}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the complete Sui wallet address (66 characters starting with 0x)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
          >
            <option value={7}>7 days (~7 epochs)</option>
            <option value={30}>30 days (~30 epochs)</option>
            <option value={90}>90 days (~90 epochs)</option>
            <option value={180}>6 months (~180 epochs)</option>
          </select>
        </div>

        <button
          onClick={handleGrant}
          disabled={isLoading || !actualProofObjectId}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Granting Access...' : 'Grant Access'}
        </button>
      </div>
      
      {actualProofObjectId && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Proof Object ID:</strong> <code className="text-xs break-all">{actualProofObjectId}</code>
          </p>
        </div>
      )}

      {!actualProofObjectId && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            ⚠️ No proof found. Please mint a proof NFT first to grant access.
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Active Permissions
        </h4>
        
        {approvedViewers.length > 0 ? (
          <div className="space-y-2">
            {approvedViewers.map((viewer, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">{formatAddress(viewer)}</p>
                    <p className="text-xs text-green-700">Can decrypt and view data</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <button
                      onClick={() => handleRevoke(viewer)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Revoke access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
            No approved viewers yet. Grant access above to allow others to view your encrypted data.
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-3">
          💡 Tip: Approved viewers can check <a href="https://suiscan.xyz/testnet" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Sui Explorer</a> for the full list
        </p>
      </div>
    </div>
  );
}