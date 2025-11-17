import { Upload, Lock, Cpu, Shield, Database, CheckCircle, QrCode, FileCheck, Wallet, ArrowRight, Share2, Users } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <Wallet className="w-12 h-12" />,
      title: "Connect Your Wallet",
      description: "Link your Sui wallet (like Slush) with one click. No email, no passwords, just your wallet.",
      tech: "Sui Blockchain Authentication",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02",
      icon: <Upload className="w-12 h-12" />,
      title: "Upload Health Report",
      description: "Upload your medical report in PDF, CSV, or TXT format. We accept any standard health document.",
      tech: "Multi-format Document Parser",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      icon: <Lock className="w-12 h-12" />,
      title: "Automatic Encryption",
      description: "Your data is instantly encrypted using Mysten Seal with threshold encryption. Only you hold the keys.",
      tech: "Mysten Seal (Threshold Encryption)",
      color: "from-orange-500 to-red-500"
    },
    {
      number: "04",
      icon: <Database className="w-12 h-12" />,
      title: "Decentralized Storage",
      description: "Encrypted data is stored on Walrus - a decentralized storage network. No single point of failure.",
      tech: "Walrus Decentralized Storage",
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "05",
      icon: <Cpu className="w-12 h-12" />,
      title: "AI Risk Analysis",
      description: "Nautilus AI analyzes your health metrics using zero-knowledge proofs. Your data stays private. [ZK proofs will be added in future]",
      tech: "Nautilus ZK-Proof AI",
      color: "from-indigo-500 to-purple-500"
    },
    {
      number: "06",
      icon: <Shield className="w-12 h-12" />,
      title: "Blockchain Verification",
      description: "Proof is minted as an NFT on Sui blockchain - immutable, verifiable, and yours forever.",
      tech: "Sui NFT Smart Contract",
      color: "from-pink-500 to-rose-500"
    },
    {
      number: "07",
      icon: <QrCode className="w-12 h-12" />,
      title: "Get Your QR Proof",
      description: "Receive a scannable QR code linking to your blockchain proof. Share it anywhere, anytime.",
      tech: "Universal Verification System",
      color: "from-yellow-500 to-orange-500"
    },
    {
      number: "08",
      icon: <Share2 className="w-12 h-12" />,
      title: "Share & Control Access",
      description: "Share proof links with institutions. Grant temporary access to decrypt data. You control who sees what.",
      tech: "Access Control & Sharing",
      color: "from-teal-500 to-cyan-500"
    },
    {
      number: "09",
      icon: <FileCheck className="w-12 h-12" />,
      title: "Use Everywhere",
      description: "Present your proof for loans, insurance, visas, or jobs. Instant verification, zero hassle.",
      tech: "Multi-purpose Acceptance",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const techStack = [
    {
      name: "Sui Blockchain",
      role: "Foundation Layer",
      description: "Ultra-fast, low-cost blockchain providing the foundation for TruthVault. All proofs are stored as NFTs with sub-second finality.",
      features: ["Sub-second transactions", "Minimal gas fees", "Object-centric storage", "Byzantine fault tolerant"],
      icon: "⛓️"
    },
    {
      name: "Mysten Seal",
      role: "Encryption Layer",
      description: "Threshold encryption technology ensuring your health data is encrypted before leaving your device. Only you control decryption.",
      features: ["Threshold encryption", "Multi-party computation", "No single point of failure", "Client-side encryption"],
      icon: "🔐"
    },
    {
      name: "Walrus Storage",
      role: "Storage Layer",
      description: "Decentralized blob storage network that keeps your encrypted health data distributed across multiple nodes for maximum reliability.",
      features: ["Decentralized storage", "99.9% availability", "Redundant backups", "Cost-efficient"],
      icon: "💾"
    },
    {
      name: "Nautilus AI",
      role: "Computation Layer",
      description: "Zero-knowledge proof AI that analyzes your health metrics without ever accessing your raw data. Privacy-preserving machine learning [ZK proofs will be added in future].",
      features: ["Zero-knowledge proofs", "Private computation", "AI risk assessment", "WASM-powered"],
      icon: "🤖"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Cpu className="w-4 h-4" />
            <span>Enterprise Security Meets Simplicity</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TruthVault</span> Works
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding the magic behind secure, private, and verifiable health proofs
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`bg-gradient-to-br ${step.color} w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                
                {/* Tech Badge */}
                <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                  <code className="text-xs">{step.tech}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Deep Dive */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600">
              Built on the most advanced Web3 infrastructure
            </p>
          </div>

          <div className="space-y-8">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="md:flex">
                  {/* Left Side - Icon & Name */}
                  <div className="md:w-1/3 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 flex flex-col justify-center items-center text-center border-r border-gray-200">
                    <div className="text-6xl mb-4">{tech.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tech.name}</h3>
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium">
                      {tech.role}
                    </span>
                  </div>

                  {/* Right Side - Details */}
                  <div className="md:w-2/3 p-8">
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">{tech.description}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      {tech.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow Diagram */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Data Journey
            </h2>
            <p className="text-xl text-gray-600">
              From upload to verification - every step is secure
            </p>
          </div>

          <div className="relative">
            {/* Flow Chart */}
            <div className="space-y-6">
              {[
                { title: "Your Device", desc: "Health report uploaded", color: "bg-blue-500" },
                { title: "Client-Side Encryption", desc: "Data encrypted with your wallet key", color: "bg-purple-500" },
                { title: "Walrus Storage", desc: "Encrypted blob stored on decentralized network", color: "bg-orange-500" },
                { title: "Nautilus AI", desc: "Zero-knowledge computation on encrypted data [ZK proofs will be added in future]", color: "bg-green-500" },
                { title: "Sui Blockchain", desc: "Proof minted as NFT with immutable record", color: "bg-indigo-500" },
                { title: "QR Code & Share Links", desc: "Shareable verification delivered to you with access control", color: "bg-pink-500" },
                { title: "Access Control", desc: "Grant temporary permissions to institutions to decrypt and view data", color: "bg-teal-500" }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="flex items-center space-x-4">
                    <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-4 shadow-md border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                  {idx < 5 && (
                    <div className="ml-6 h-8 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Guarantees */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Security Guarantees
            </h2>
            <p className="text-xl text-gray-300">
              Your privacy and security are non-negotiable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "End-to-End Encryption", desc: "Data encrypted on your device before upload" },
              { title: "Zero-Knowledge Proofs", desc: "ZK Proofs will be added in future. Currently only AI implemented" },
              { title: "Decentralized Storage", desc: "No single point of failure or control" },
              { title: "Your Keys, Your Data", desc: "Only you can decrypt your health records" },
              { title: "Immutable Proofs", desc: "Blockchain records cannot be altered" },
              { title: "Open Source", desc: "Transparent, auditable smart contracts" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <CheckCircle className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Experience It?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            See the technology in action with your own health data
          </p>
          <a
            href="/app"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            <span>Try TruthVault Now</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}