import ConnectWallet from '@/components/ConnectWallet';
import UploadForm from '@/components/UploadForm';
import RunAIButton from '@/components/RunAIButton';
import ProofCard from '@/components/ProofCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-indigo-900 mb-2">TruthVault</h1>
        <p className="text-xl text-center text-indigo-700 mb-8">
          One Click. Real Proof. For Loans, Insurance, Jobs.
        </p>

        <ConnectWallet />
        <UploadForm />
        <RunAIButton />
        <ProofCard />
      </div>
    </main>
  );
}