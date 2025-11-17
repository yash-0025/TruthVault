'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import ViewData from '@/components/ViewData';
import { getProofObjectIdFromTransaction } from '@/lib/sui';
import { Loader2 } from 'lucide-react';

function ViewPageContent() {
  const searchParams = useSearchParams();
  const [proofObjectId, setProofObjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const txDigest = searchParams.get('tx');
  const objectId = searchParams.get('id');

  useEffect(() => {
    const loadProofId = async () => {
      if (objectId) {
        setProofObjectId(objectId);
        return;
      }

      if (txDigest) {
        setIsLoading(true);
        try {
          const id = await getProofObjectIdFromTransaction(txDigest);
          if (id) {
            setProofObjectId(id);
          } else {
            setError('Could not find proof object from transaction. The transaction may not be confirmed yet.');
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load proof from transaction');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProofId();
  }, [txDigest, objectId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-2">View Health Proof</h1>
        <p className="text-lg text-center text-indigo-700 mb-8">
          Access encrypted health data with proper authorization
        </p>

        <ConnectWallet />

        {isLoading && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
            <p className="text-sm text-gray-600">Loading proof from blockchain...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">❌ {error}</p>
          </div>
        )}

        {proofObjectId && (
          <ViewData proofObjectId={proofObjectId} transactionDigest={txDigest || undefined} />
        )}

        {!txDigest && !objectId && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <p className="text-sm text-gray-600 text-center">
              No proof specified. Please provide a transaction digest (?tx=...) or object ID (?id=...)
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <ViewPageContent />
    </Suspense>
  );
}
