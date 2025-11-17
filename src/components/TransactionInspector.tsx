'use client';
import { useState } from 'react';
import { Search, Copy, CheckCircle } from 'lucide-react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

export default function TransactionInspector() {
  const [digest, setDigest] = useState('');
  const [txData, setTxData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inspect = async () => {
    if (!digest) {
      alert('Please enter a transaction digest');
      return;
    }

    setIsLoading(true);
    setTxData(null);

    try {
      const sui = new SuiClient({ url: getFullnodeUrl('testnet') });
      
      const tx = await sui.getTransactionBlock({
        digest,
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        },
      });

      setTxData(tx);
    } catch (err: any) {
      setTxData({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const copyJSON = () => {
    if (txData) {
      navigator.clipboard.writeText(JSON.stringify(txData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Extract grant_access call details
  const extractGrantDetails = () => {
    if (!txData || txData.error) return null;

    try {
      const tx = txData.transaction?.data?.transaction;
      if (!tx) return null;

      // Look for moveCall in transaction
      const kind = tx.kind;
      if (kind === 'ProgrammableTransaction') {
        const commands = tx.transactions || [];
        
        for (const cmd of commands) {
          if (cmd.MoveCall) {
            const moveCall = cmd.MoveCall;
            
            if (moveCall.function === 'grant_access') {
              return {
                package: moveCall.package,
                module: moveCall.module,
                function: moveCall.function,
                arguments: moveCall.arguments,
                typeArguments: moveCall.type_arguments,
              };
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to extract grant details:', err);
    }

    return null;
  };

  const grantDetails = extractGrantDetails();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Transaction Inspector</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Inspect a "grant_access" transaction to see exactly what was stored on-chain.
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Transaction Digest (after granting access)"
          value={digest}
          onChange={(e) => setDigest(e.target.value.trim())}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
        />

        <button
          onClick={inspect}
          disabled={isLoading || !digest}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {isLoading ? 'Inspecting...' : 'Inspect Transaction'}
        </button>
      </div>

      {txData && (
        <div className="mt-6 space-y-4">
          {txData.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">❌ Error: {txData.error}</p>
            </div>
          ) : (
            <>
              {/* Transaction Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-green-900 mb-2">
                  ✅ Transaction Found
                </h4>
                <div className="text-xs text-green-800 space-y-1">
                  <div>
                    <strong>Digest:</strong> <code>{digest.slice(0, 20)}...</code>
                  </div>
                  <div>
                    <strong>Status:</strong> {txData.effects?.status?.status || 'Unknown'}
                  </div>
                </div>
              </div>

              {/* Grant Access Details */}
              {grantDetails && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-blue-900 mb-3">
                    🔐 Grant Access Call
                  </h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <strong className="text-blue-800">Function:</strong>
                      <code className="block bg-white p-2 rounded mt-1 text-blue-900">
                        {grantDetails.module}::{grantDetails.function}
                      </code>
                    </div>
                    <div>
                      <strong className="text-blue-800">Arguments:</strong>
                      <pre className="bg-white p-2 rounded mt-1 text-blue-900 overflow-auto">
                        {JSON.stringify(grantDetails.arguments, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Object Changes */}
              {txData.objectChanges && txData.objectChanges.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-purple-900 mb-3">
                    📦 Object Changes
                  </h4>
                  <div className="space-y-2">
                    {txData.objectChanges.map((change: any, idx: number) => (
                      <div key={idx} className="bg-white rounded p-2 text-xs">
                        <div><strong>Type:</strong> {change.type}</div>
                        {change.objectId && (
                          <div><strong>Object ID:</strong> <code>{change.objectId}</code></div>
                        )}
                        {change.objectType && (
                          <div><strong>Object Type:</strong> <code>{change.objectType}</code></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full JSON */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-gray-900">📋 Full Transaction Data</h4>
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
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96 text-gray-700">
                  {JSON.stringify(txData, null, 2)}
                </pre>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-yellow-900 mb-2">
                  🔍 What to Look For
                </h4>
                <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
                  <li>Check "Grant Access Call" shows the correct viewer address</li>
                  <li>Look at "Object Changes" - should show the Proof object being modified</li>
                  <li>Copy the JSON and search for "approved_viewers" or viewer address</li>
                  <li>Compare with the Proof object data on Sui Explorer</li>
                </ol>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}