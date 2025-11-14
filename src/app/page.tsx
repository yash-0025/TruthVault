import RoadmapSection from '@/components/RoadmapSection';
import { Shield, Lock, Zap, FileCheck, ArrowRight, CheckCircle, Cpu, Database, Award, Users, Globe, TrendingUp } from 'lucide-react';

export default function Homepage() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Blockchain Verified",
      description: "Your health proofs are immutably stored on Sui blockchain with cryptographic verification"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Encrypted Storage",
      description: "Data encrypted with Mysten Seal technology - only you control access to your health records"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Verification",
      description: "Generate verifiable health proofs in seconds using AI-powered risk assessment"
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Universal Acceptance",
      description: "QR-based proofs accepted for loans, insurance, visas, and employment verification"
    }
  ];

  const stats = [
    { value: "100%", label: "Encrypted" },
    { value: "<5s", label: "Proof Time" },
    { value: "∞", label: "Validity" },
    { value: "0", label: "Trust Issues" }
  ];

  const useCases = [
    { icon: <Award className="w-6 h-6" />, title: "Loan Applications", desc: "Instant health verification" },
    { icon: <Users className="w-6 h-6" />, title: "Insurance Claims", desc: "Transparent risk profiles" },
    { icon: <Globe className="w-6 h-6" />, title: "Visa Processing", desc: "Medical clearance proof" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Employment", desc: "Health fitness certificates" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
              <Cpu className="w-4 h-4" />
              <span>Powered by Sui, Seal, Walrus & Nautilus AI</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Store Once,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prove Forever
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              The only health verification platform you'll ever need. 
              One upload, infinite verifiable proofs for loans, insurance, visas, and jobs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/app"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/how-it-works"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                How It Works
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% private & encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Blockchain verified</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="text-4xl mb-2">📤</div>
                  <h3 className="font-bold text-lg mb-2">1. Upload Report</h3>
                  <p className="text-sm text-gray-600">PDF, CSV, or TXT health records</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="text-4xl mb-2">🤖</div>
                  <h3 className="font-bold text-lg mb-2">2. AI Analysis</h3>
                  <p className="text-sm text-gray-600">Instant risk assessment</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="font-bold text-lg mb-2">3. Get Proof</h3>
                  <p className="text-sm text-gray-600">NFT-based verification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-indigo-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose TruthVault?
            </h2>
            <p className="text-xl text-gray-600">
              The most secure and convenient way to manage health verifications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              One Proof, Infinite Uses
            </h2>
            <p className="text-xl text-gray-600">
              Your health verification accepted everywhere
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border border-gray-200 group hover:border-indigo-300"
              >
                <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {useCase.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built on Cutting-Edge Tech
            </h2>
            <p className="text-xl text-gray-600">
              Enterprise-grade security meets user-friendly design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Sui Blockchain", desc: "Fast, secure transactions", color: "from-blue-500 to-cyan-500" },
              { name: "Mysten Seal", desc: "End-to-end encryption", color: "from-purple-500 to-pink-500" },
              { name: "Walrus Storage", desc: "Decentralized data", color: "from-orange-500 to-red-500" },
              { name: "Nautilus AI", desc: "Zero-knowledge proofs", color: "from-green-500 to-emerald-500" }
            ].map((tech, idx) => (
              <div key={idx} className="text-center">
                <div className={`bg-gradient-to-br ${tech.color} w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {tech.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RoadmapSection />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join thousands storing their health records securely on the blockchain
            </p>
            <a
              href="/app"
              className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              <span>Start Now - It's Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-indigo-400" />
                <span className="text-xl font-bold text-white">TruthVault</span>
              </div>
              <p className="text-sm">Secure health verification for the modern world.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/app" className="hover:text-white">App</a></li>
                <li><a href="/how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="/use-cases" className="hover:text-white">Use Cases</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 TruthVault. All rights reserved. Built with ❤️ on Sui.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}