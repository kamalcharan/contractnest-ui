// src/components/VaNi/bbb/SuccessModal.tsx
// File 9/13 - BBB Profile Success Modal Component

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  CheckCircle, 
  Sparkles,
  Search,
  Users,
  ArrowRight,
  Trophy
} from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  keywords: string[];
  businessName: string;
  autoNavigateDelay?: number; // in milliseconds, default 3000
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  keywords,
  businessName,
  autoNavigateDelay = 3000
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(Math.floor(autoNavigateDelay / 1000));

  useEffect(() => {
    if (!isOpen) return;

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-navigate
    const navigateTimeout = setTimeout(() => {
      navigate('/vani/dashboard');
    }, autoNavigateDelay);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(navigateTimeout);
    };
  }, [isOpen, autoNavigateDelay, navigate]);

  const handleNavigateNow = () => {
    navigate('/vani/dashboard');
  };

  if (!isOpen) return null;

  const accomplishments = [
    {
      icon: CheckCircle,
      text: 'Profile created',
      color: colors.semantic.success
    },
    {
      icon: Sparkles,
      text: 'AI description generated',
      color: colors.brand.primary
    },
    {
      icon: Search,
      text: 'Semantic clusters created',
      color: colors.brand.secondary
    },
    {
      icon: Users,
      text: 'Now searchable in directory',
      color: colors.semantic.info
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity"
        style={{ backdropFilter: 'blur(6px)' }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-scale-in"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            border: `2px solid ${colors.semantic.success}`,
            animation: 'scale-in 0.3s ease-out'
          }}
        >
          {/* Success Header */}
          <div
            className="p-8 text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.semantic.success}20 0%, ${colors.brand.primary}20 100%)`,
              borderBottom: `1px solid ${colors.utility.primaryText}15`
            }}
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="relative"
                style={{
                  animation: 'bounce-in 0.6s ease-out'
                }}
              >
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: `${colors.semantic.success}40`
                  }}
                />
                <div
                  className="relative p-6 rounded-full"
                  style={{
                    backgroundColor: `${colors.semantic.success}20`,
                    border: `3px solid ${colors.semantic.success}`
                  }}
                >
                  <Trophy className="w-16 h-16" style={{ color: colors.semantic.success }} />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: colors.utility.primaryText }}
            >
              🎉 Success!
            </h2>
            <p
              className="text-lg mb-2"
              style={{ color: colors.utility.primaryText }}
            >
              Your profile has been added to the
            </p>
            <p
              className="text-xl font-bold"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              BBB Bagyanagar Directory!
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Accomplishments Checklist */}
            <div
              className="p-5 rounded-lg"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                border: `1px solid ${colors.utility.primaryText}15`
              }}
            >
              <h3
                className="text-sm font-semibold mb-4 flex items-center space-x-2"
                style={{ color: colors.utility.primaryText }}
              >
                <CheckCircle className="w-5 h-5" style={{ color: colors.semantic.success }} />
                <span>What We've Accomplished</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {accomplishments.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg transition-all"
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        animation: `slide-in-right 0.4s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div
                        className="p-2 rounded-full"
                        style={{
                          backgroundColor: `${item.color}20`
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: colors.utility.primaryText }}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Discoverability Section */}
            <div
              className="p-5 rounded-lg"
              style={{
                backgroundColor: `${colors.semantic.info}15`,
                border: `1px solid ${colors.semantic.info}40`
              }}
            >
              <div className="flex items-start space-x-3">
                <Search className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.semantic.info }} />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.utility.primaryText }}>
                    Members can find {businessName} by searching:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.slice(0, 6).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `${colors.semantic.success}20`,
                          color: colors.semantic.success,
                          border: `1px solid ${colors.semantic.success}40`,
                          animation: `fade-in 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                    {keywords.length > 6 && (
                      <span
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `${colors.brand.primary}20`,
                          color: colors.brand.primary,
                          border: `1px solid ${colors.brand.primary}40`
                        }}
                      >
                        +{keywords.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <button
              onClick={handleNavigateNow}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                boxShadow: `0 4px 12px ${colors.brand.primary}40`
              }}
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Auto-redirect Notice */}
            <p
              className="text-center text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              Automatically redirecting to dashboard in{' '}
              <span className="font-bold" style={{ color: colors.brand.primary }}>
                {countdown}
              </span>
              {' '}second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default SuccessModal;