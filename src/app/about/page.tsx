import { Shield, Target, Users, Zap, Lock, Globe, Heart, Award, TrendingUp, Code } from 'lucide-react';

export default function About() {
  const mission = {
    title: "Our Mission",
    description: "To democratize health verification by making it accessible, private, and instant for everyone, everywhere.",
    icon: <Target className="w-16 h-16" />
  };

  const values = [
    {
      icon: <Lock />,
      title: "Privacy First",
      description: "Your health data belongs to you. We use zero-knowledge proofs and encryption to ensure complete privacy."
    },
    {
      icon: <Shield />,
      title: "Security Always",
      description: "Built on blockchain with military-grade cryptography. Your data is protected by mathematics, not promises."
    },
    {
      icon: <Users />,
      title: "User Empowerment",
      description: "You control your data. Share what you want, when you want, with whom you want. Total autonomy."
    },
    {
      icon: <Globe />,
      title: "Universal Access",
      description: "Health verification shouldn't be a privilege. TruthVault is free and accessible to anyone with internet."
    }
  ];

  const team = [
    {
      name: "Built with ❤️",
      role: "For Sui Overflow Hackathon 2024",
      description: "A decentralized team united by the vision of making health verification transparent and accessible"
    }
  ];

  const technology = [
    {
      name: "Sui Blockchain",
      description: "Foundation for fast, secure, and low-cost transactions",
      stat: "<1s finality",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Mysten Seal",
      description: "Threshold encryption for unbreakable data security",
      stat: "Military-grade",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Walrus Storage",
      description: "Decentralized storage ensuring 99.9% availability",
      stat: "99.9% uptime",
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Nautilus AI",
      description: "Zero-knowledge proofs for privacy-preserving computation [ Will be adding in future]",
      stat: "100% private",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const impact = [
    {
      metric: "Privacy Protected",
      value: "100%",
      description: "Your raw health data never leaves your device unencrypted",
      icon: <Lock className="w-8 h-8" />
    },
    {
      metric: "Cost Savings",
      value: "$500+",
      description: "Average savings per user annually vs traditional verification",
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      metric: "Time Saved",
      value: "99%",
      description: "From weeks of paperwork to seconds of verification",
      icon: <Zap className="w-8 h-8" />
    },
    {
      metric: "Universal Access",
      value: "∞",
      description: "One proof works for loans, insurance, visas, and jobs",
      icon: <Globe className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TruthVault</span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Building the future of health verification with blockchain, AI, and zero-knowledge cryptography
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
            <div className="bg-white/20 backdrop-blur w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
              {mission.icon}
            </div>
            <h2 className="text-3xl font-bold mb-4">{mission.title}</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              {mission.description}
            </p>
          </div>
        </div>
      </section>

      {/* The Problem We're Solving */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Problem We're Solving</h2>
            <p className="text-xl text-gray-600">Health verification is broken. We're fixing it.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional System */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-2xl font-bold text-red-900 mb-6">Traditional System</h3>
              <ul className="space-y-4">
                {[
                  "Weeks of waiting for medical certificates",
                  "$200-500 per verification",
                  "Repeated medical exams for each application",
                  "Privacy violations with full disclosure",
                  "Paper documents easily forged or lost",
                  "No universal acceptance standard"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-red-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TruthVault Solution */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-900 mb-6">TruthVault Solution</h3>
              <ul className="space-y-4">
                {[
                  "Instant verification in under 5 seconds",
                  "Free to use, $0.01 blockchain fee",
                  "One upload works for all applications",
                  "Zero-knowledge proofs protect privacy [Will be added in the future]",
                  "Blockchain-secured, forgery impossible",
                  "QR codes accepted universally",
                  "Access control - grant temporary permissions",
                  "Share proof links with institutions"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-green-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">Principles that guide everything we build</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Technology</h2>
            <p className="text-xl text-gray-600">Built on the most advanced Web3 infrastructure</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {technology.map((tech, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
              >
                <div className={`bg-gradient-to-br ${tech.color} p-8 text-white`}>
                  <div className="text-3xl font-bold mb-2">{tech.stat}</div>
                  <h3 className="text-2xl font-bold">{tech.name}</h3>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-indigo-100">Making a real difference in people's lives</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impact.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-white/20 backdrop-blur w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{item.value}</div>
                <div className="text-xl font-semibold mb-2">{item.metric}</div>
                <p className="text-indigo-100 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Ensure Privacy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Protect Your Privacy</h2>
            <p className="text-xl text-gray-600">Your data security is our top priority</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Side */}
              <div className="p-12 bg-gradient-to-br from-indigo-50 to-purple-50">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">Security Layers</h3>
                <div className="space-y-6">
                  {[
                    {
                      title: "Client-Side Encryption",
                      desc: "Data encrypted on your device before upload"
                    },
                    {
                      title: "Threshold Encryption",
                      desc: "Split keys across multiple servers - no single point of failure"
                    },
                    {
                      title: "Zero-Knowledge Proofs",
                      desc: "AI analyzes without seeing your raw data"
                    },
                    {
                      title: "Blockchain Immutability",
                      desc: "Proofs can't be altered or deleted"
                    }
                  ].map((layer, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{layer.title}</h4>
                        <p className="text-gray-600 text-sm">{layer.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side */}
              <div className="p-12 bg-white">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">What We Never Do</h3>
                <div className="space-y-4">
                  {[
                    "Never store unencrypted health data",
                    "Never sell or share your information",
                    "Never require email or personal details",
                    "Never access your raw medical records",
                    "Never use centralized servers",
                    "Never compromise on security for convenience"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <Shield className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Code className="w-20 h-20 mx-auto mb-6 text-indigo-600" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Open Source & Auditable</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            TruthVault is built on open-source smart contracts deployed on Sui blockchain. 
            Anyone can verify our code, audit our security, and contribute to making health verification better for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/yash-0025/TruthVault"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
              View on GitHub
            </a>
            <a
              href="https://github.com/yash-0025/TruthVault"
              className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-all"
            >
              Read Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Join the Movement</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Be part of the revolution making health verification accessible, private, and instant for everyone
            </p>
            <a
              href="/app"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              Try TruthVault Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}