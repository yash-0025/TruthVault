'use client';
import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { fetchProofData } from '@/lib/sui';
import { Bug, RefreshCw, Copy, CheckCircle, XCircle } from 'lucide-react';

export default function ProofDebugger() {
  const [objectId, setObjectId] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const account = useCurrentAccount();

  useEffect(() => {
    const storedId = localStorage.getItem('proof_object_id');
    if (storedId) setObjectId(storedId);
  }, []);

  const debug = async () => {
    if (!objectId) {
      alert('Please enter a proof object ID');
      return;
    }

    setIsLoading(true);
    setDebugInfo(null);

    try {
      const proof = await fetchProofData(objectId);
      
      if (!proof) {
        throw new Error('Proof not found');
      }

      const info = {
        proof,
        currentUser: account?.address || 'Not connected',
        isOwner: account ? proof.owner.toLowerCase() === account.address.toLowerCase() : false,
        isApproved: account ? (proof.approved_viewers || []).some((addr: string) => 
          addr.toLowerCase() === account.address.toLowerCase()
        ) : false,
        hasAccess: false,
      };

      info.hasAccess = info.isOwner || info.isApproved;

      setDebugInfo(info);
    } catch (err: any) {
      setDebugInfo({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const copyJSON = () => {
    if (debugInfo) {
      navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bug className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-bold text-gray-900">Access Control Debugger</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Debug tool to see the actual on-chain access control data and check why access might be failing.
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Proof Object ID (0x...)"
          value={objectId}
          onChange={(e) => setObjectId(e.target.value.trim())}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
        />

        <button
          onClick={debug}
          disabled={isLoading || !objectId}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Debugging...</span>
            </>
          ) : (
            <>
              <Bug className="w-5 h-5" />
              <span>Debug Access Control</span>
            </>
          )}
        </button>
      </div>

      {debugInfo && (
        <div className="mt-6 space-y-4">
          {debugInfo.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">❌ Error: {debugInfo.error}</p>
            </div>
          ) : (
            <>
              {/* Current User Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-blue-900 mb-3">👤 Your Wallet</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Connected:</span>
                    <code className="bg-white px-2 py-1 rounded">
                      {debugInfo.currentUser === 'Not connected' ? (
                        <span className="text-red-600">❌ Not connected</span>
                      ) : (
                        <span className="text-green-600">
                          ✅ {debugInfo.currentUser.slice(0, 10)}...{debugInfo.currentUser.slice(-8)}
                        </span>
                      )}
                    </code>
                  </div>
                </div>
              </div>

              {/* Proof Owner */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-purple-900 mb-3">👑 Proof Owner</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-700">Owner Address:</span>
                    <code className="bg-white px-2 py-1 rounded text-purple-800">
                      {debugInfo.proof.owner.slice(0, 10)}...{debugInfo.proof.owner.slice(-8)}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-700">You are owner:</span>
                    {debugInfo.isOwner ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Approved Viewers */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-green-900 mb-3">👥 Approved Viewers</h4>
                
                {debugInfo.proof.approved_viewers && debugInfo.proof.approved_viewers.length > 0 ? (
                  <div className="space-y-2">
                    {debugInfo.proof.approved_viewers.map((viewer: string, idx: number) => (
                      <div key={idx} className="bg-white rounded p-2 flex items-center justify-between">
                        <code className="text-xs text-green-800">
                          {viewer.slice(0, 10)}...{viewer.slice(-8)}
                        </code>
                        {account && viewer.toLowerCase() === account.address.toLowerCase() && (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-green-700">You are approved:</span>
                      {debugInfo.isApproved ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-green-700 italic">
                    No approved viewers yet. The owner hasn't granted access to anyone.
                  </p>
                )}
              </div>

              {/* Access Status */}
              <div className={`border-2 rounded-lg p-4 ${
                debugInfo.hasAccess 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center gap-3">
                  {debugInfo.hasAccess ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-green-900">
                          ✅ You Have Access
                        </h4>
                        <p className="text-xs text-green-700 mt-1">
                          {debugInfo.isOwner 
                            ? 'You are the owner of this proof' 
                            : 'You are in the approved viewers list'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-red-900">
                          ❌ You Don't Have Access
                        </h4>
                        <p className="text-xs text-red-700 mt-1">
                          {debugInfo.currentUser === 'Not connected'
                            ? 'Connect your wallet first'
                            : 'The owner must grant access to your address'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Raw Data */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-gray-900">📋 Raw Data (JSON)</h4>
                  <button
                    onClick={copyJSON}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy JSON
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-60 text-gray-700">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>

              {/* Troubleshooting */}
              {!debugInfo.hasAccess && debugInfo.currentUser !== 'Not connected' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-yellow-900 mb-2">
                    🔧 Troubleshooting Steps
                  </h4>
                  <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
                    <li>Verify the owner granted access to YOUR wallet address</li>
                    <li>Check if your address matches exactly (including case)</li>
                    <li>Wait 5-10 seconds after granting, then refresh this page</li>
                    <li>Ask the owner to check the "Access Control" tab</li>
                    <li>Verify the transaction on Sui Explorer</li>
                  </ol>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}