import ConnectWallet from '@/components/ConnectWallet';
import UploadForm from '@/components/UploadForm';
import RunAIButton from '@/components/RunAIButton';
import ProofCard from '@/components/ProofCard';
import AccessControl from '@/components/AccessControl';
import ViewData from '@/components/ViewData';
import ShareProof from '@/components/ShareProof';
import { Shield, Upload, Zap, Share2, Eye, Lock } from 'lucide-react';
// import ProofDebugger from '@/components/ProofDebugger';
// import TransactionInspector from '@/components/TransactionInspector';
// import CompleteDiagnostic from '@/components/CompleteDiagonistic';

export default function AppPage() {
  const steps = [
    { number: 1, title: 'Connect Wallet', icon: <Shield className="w-5 h-5" />, component: 'wallet' },
    { number: 2, title: 'Upload Report', icon: <Upload className="w-5 h-5" />, component: 'upload' },
    { number: 3, title: 'Prove Health', icon: <Zap className="w-5 h-5" />, component: 'prove' },
    { number: 4, title: 'Share & Control', icon: <Share2 className="w-5 h-5" />, component: 'share' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>Health Verification Platform</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              TruthVault
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Store Once. Prove Forever. Your health verification for loans, insurance, visas, and jobs.
          </p>
        </div>

        {/* Progress Steps Indicator */}
        <div className="mb-12 hidden md:block">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg mb-2">
                      {step.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{step.title}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-1 bg-gradient-to-r from-indigo-300 to-purple-300 mx-4 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Main Workflow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Connect Wallet */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
              </div>
              <ConnectWallet />
            </section>

            {/* Step 2: Upload Form */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Health Report</h2>
              </div>
              <UploadForm />
            </section>

            {/* Step 3: Prove Health */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Prove Your Health</h2>
              </div>
              <RunAIButton />
            </section>

            {/* Proof Card */}
            <ProofCard />
          </div>

          {/* Right Column - Actions & Management */}
          <div className="space-y-6">
            {/* View Data Section */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">View Your Data</h3>
                </div>
              </div>
              <div className="p-6">
                <ViewData />
              </div>
            </section>

            {/* Share Proof Section */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Share Your Proof</h3>
                </div>
              </div>
              <div className="p-6">
                <ShareProof />
              </div>
            </section>

            {/* Access Control Section */}
            <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Access Control</h3>
                </div>
              </div>
              <div className="p-6">
                <AccessControl />
              </div>
            </section>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Quick Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">1.</span>
              <span>Upload PDF, CSV, or TXT health reports</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">2.</span>
              <span>Your data is encrypted before upload</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">3.</span>
              <span>Share proof links and control access</span>
            </div>
          </div>
        </div>
{/*         <TransactionInspector />
        <CompleteDiagnostic />
        <ProofDebugger /> */}
      </div>
    </main>
  );
}