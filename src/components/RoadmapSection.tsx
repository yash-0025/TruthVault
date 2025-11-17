import { CheckCircle, Clock, Rocket, Building2, Globe, Zap, Heart, Smartphone, Languages, Database, Code, Users, DollarSign, GitBranch } from 'lucide-react';

export default function RoadmapSection() {
  const phases = [
    {
      phase: "Phase 1",
      title: "MVP",
      status: "completed",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-900",
      description: "Core functionality and proof of concept",
      items: [
        { text: "Basic health report upload", completed: true, icon: <Zap className="w-4 h-4" /> },
        { text: "AI risk assessment", completed: true, icon: <Heart className="w-4 h-4" /> },
        { text: "Blockchain proof minting", completed: true, icon: <CheckCircle className="w-4 h-4" /> },
        { text: "QR code generation", completed: true, icon: <Code className="w-4 h-4" /> },
        { text: "Access control system", completed: true, icon: <Users className="w-4 h-4" /> },
        { text: "Share proof links", completed: true, icon: <Globe className="w-4 h-4" /> },
        { text: "View & decrypt data", completed: true, icon: <Database className="w-4 h-4" /> }
      ]
    },
    {
      phase: "Phase 2",
      title: "Enhanced Features",
      status: "planned",
      icon: <Clock className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-900",
      description: "Advanced capabilities and user experience improvements",
      items: [
        { text: "Multi-language support", completed: false, icon: <Languages className="w-4 h-4" /> },
        { text: "Advanced AI models (heart disease, cancer risk)", completed: false, icon: <Heart className="w-4 h-4" /> },
        { text: "Integration with hospital systems", completed: false, icon: <Building2 className="w-4 h-4" /> },
        { text: "Mobile app (iOS/Android)", completed: false, icon: <Smartphone className="w-4 h-4" /> }
      ]
    },
    {
      phase: "Phase 3",
      title: "Enterprise",
      status: "planned",
      icon: <Building2 className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-900",
      description: "Enterprise-grade solutions and scalability",
      items: [
        { text: "API for institutions", completed: false, icon: <Code className="w-4 h-4" /> },
        { text: "Batch processing", completed: false, icon: <Database className="w-4 h-4" /> },
        { text: "Custom risk models", completed: false, icon: <GitBranch className="w-4 h-4" /> },
        { text: "White-label solution", completed: false, icon: <Building2 className="w-4 h-4" /> }
      ]
    },
    {
      phase: "Phase 4",
      title: "Ecosystem",
      status: "planned",
      icon: <Globe className="w-8 h-8" />,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-900",
      description: "Building a global health verification ecosystem",
      items: [
        { text: "DAO governance", completed: false, icon: <Users className="w-4 h-4" /> },
        { text: "Token economics", completed: false, icon: <DollarSign className="w-4 h-4" /> },
        { text: "Developer SDK", completed: false, icon: <Code className="w-4 h-4" /> },
        { text: "Global partnerships", completed: false, icon: <Globe className="w-4 h-4" /> }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            In Progress
          </span>
        );
      case 'planned':
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            <Rocket className="w-4 h-4" />
            Planned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            <span>Building the Future</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Product Roadmap
          </h2>
          <p className="text-xl text-gray-600">
            Our journey from MVP to a global health verification ecosystem
          </p>
        </div>

        {/* Roadmap Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className={`${phase.bgColor} border-2 ${phase.borderColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-br ${phase.color} w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {phase.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${phase.textColor} opacity-75`}>{phase.phase}</p>
                    <h3 className={`text-2xl font-bold ${phase.textColor}`}>{phase.title}</h3>
                  </div>
                </div>
                {getStatusBadge(phase.status)}
              </div>

              {/* Description */}
              <p className={`text-sm ${phase.textColor} opacity-75 mb-6`}>{phase.description}</p>

              {/* Items */}
              <div className="space-y-3">
                {phase.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className={`flex items-center gap-3 ${
                      item.completed ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    <div className={`${item.completed ? 'bg-green-500' : 'bg-gray-300'} w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0`}>
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className={`flex items-center gap-2`}>
                      <div className={`${phase.textColor} opacity-75`}>
                        {item.icon}
                      </div>
                      <span className={`${phase.textColor} font-medium`}>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}