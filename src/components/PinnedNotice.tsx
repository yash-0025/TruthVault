import { AlertCircle, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PinnedNotice() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the notice
    const dismissed = localStorage.getItem('notice_dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('notice_dismissed', 'true');
  };

  const handleShow = () => {
    setIsVisible(true);
    setIsDismissed(false);
    localStorage.removeItem('notice_dismissed');
  };

  if (isDismissed && !isVisible) {
    return (
      <button
        onClick={handleShow}
        className="fixed bottom-6 right-6 z-50 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        title="Show Important Notice"
      >
        <AlertCircle className="w-5 h-5" />
      </button>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 animate-slideDown">
      {/* Compact Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            {/* Left: Icon + Message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-yellow-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-yellow-900 truncate">
                  ⚠️ Beta - Testnet Only | Basic AI Model | 
                  <a
                    href="https://github.com/yourusername/truthvault/tree/main/test-files"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 underline hover:text-yellow-800 inline-flex items-center gap-1"
                  >
                    Use Test Files
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-yellow-900 hover:text-yellow-800 p-1 rounded hover:bg-yellow-300/50 transition-colors"
                title={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDismiss}
                className="text-yellow-900 hover:text-yellow-800 p-1 rounded hover:bg-yellow-300/50 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="pb-3 border-t border-yellow-500/30 pt-3 animate-slideDown">
              <div className="space-y-2 text-sm text-yellow-900">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-700 font-bold mt-0.5 text-xs">→</span>
                  <p>
                    <strong>Sui Testnet:</strong> Currently deployed on testnet. All transactions use test tokens (no real value).
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-yellow-700 font-bold mt-0.5 text-xs">→</span>
                  <p>
                    <strong>Basic AI:</strong> Early-stage health risk model. Enhanced models coming in future releases.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-yellow-700 font-bold mt-0.5 text-xs">→</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>
                      <strong>Testing:</strong> Download mock health reports for testing:
                    </span>
                    <a
                      href="https://github.com/yourusername/truthvault/tree/main/test-files"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-yellow-700 hover:bg-yellow-800 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Test Files
                    </a>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-yellow-500/30">
                  <p className="text-xs text-yellow-800">
                    💡 Built for Sui Overflow Hackathon 2024 | 
                    <a
                      href="https://github.com/yourusername/truthvault/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 underline hover:text-yellow-900"
                    >
                      Report Issues
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}