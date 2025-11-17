// src/components/VaNi/bbb/JoinBBBModal.tsx
// File 3/13 - BBB Directory Join Modal Component

import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { X, Lock, Users, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface JoinBBBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (branch: string) => void;
}

const JoinBBBModal: React.FC<JoinBBBModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Hardcoded password for MVP
  const CORRECT_PASSWORD = 'bagyanagar';
  const BBB_BRANCH = 'bagyanagar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('Please enter the password', {
        style: { background: colors.semantic.error, color: '#FFF' }
      });
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password.toLowerCase() === CORRECT_PASSWORD) {
      toast.success('Password verified! Welcome to BBB Directory', {
        style: { background: colors.semantic.success, color: '#FFF' },
        duration: 3000
      });
      setPassword('');
      onSuccess(BBB_BRANCH);
    } else {
      toast.error('Incorrect password. Please contact the group admin for access.', {
        style: { background: colors.semantic.error, color: '#FFF' },
        duration: 4000
      });
    }

    setIsVerifying(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        style={{ backdropFilter: 'blur(4px)' }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            border: `1px solid ${colors.utility.primaryText}20`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:opacity-80"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.secondaryText
            }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div
            className="p-6 border-b"
            style={{
              borderColor: `${colors.utility.primaryText}15`,
              background: `linear-gradient(135deg, ${colors.brand.primary}10 0%, ${colors.brand.secondary}10 100%)`
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="p-3 rounded-full"
                style={{
                  backgroundColor: `${colors.brand.primary}20`
                }}
              >
                <Users className="w-8 h-8" style={{ color: colors.brand.primary }} />
              </div>
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.utility.primaryText }}
                >
                  Join BBB Directory
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Bagyanagar Business Network
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* BBB Subset Model Explanation */}
            <div
              className="p-5 rounded-lg border-l-4"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderLeftColor: colors.brand.primary
              }}
            >
              <h3
                className="font-semibold text-lg mb-3 flex items-center space-x-2"
                style={{ color: colors.utility.primaryText }}
              >
                <CheckCircle className="w-5 h-5" style={{ color: colors.semantic.success }} />
                <span>BBB Subset Model</span>
              </h3>
              <p
                className="mb-4 leading-relaxed"
                style={{ color: colors.utility.secondaryText }}
              >
                The BBB (Bagyanagar Business Network) model allows you to create exclusive WhatsApp groups
                that function as subsets of ContractNest with their own custom intents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Core Intents */}
                <div>
                  <h4
                    className="font-semibold mb-2 text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Core ContractNest Intents (Default)
                  </h4>
                  <ul className="space-y-1">
                    {['Service inquiries', 'Contract status', 'Payment reminders', 'General support'].map((intent, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <span style={{ color: colors.brand.primary }}>•</span>
                        <span style={{ color: colors.utility.secondaryText }}>{intent}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BBB Intents */}
                <div>
                  <h4
                    className="font-semibold mb-2 text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    BBB Group Exclusive Intents
                  </h4>
                  <ul className="space-y-1">
                    {['Activate with "Hi BBB"', 'Network-specific queries', 'Member-only content', 'Community discussions'].map((intent, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <span style={{ color: colors.semantic.success }}>•</span>
                        <span style={{ color: colors.utility.secondaryText }}>{intent}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Example */}
              <div
                className="mt-4 p-3 rounded-lg"
                style={{
                  backgroundColor: `${colors.semantic.success}15`,
                  border: `1px solid ${colors.semantic.success}40`
                }}
              >
                <p className="text-sm font-semibold mb-2" style={{ color: colors.utility.primaryText }}>
                  Example: Triggering BBB Intent
                </p>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5" style={{ color: colors.semantic.success }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.utility.primaryText }}>
                      User sends: "Hi BBB"
                    </p>
                    <p className="text-xs mt-1" style={{ color: colors.utility.secondaryText }}>
                      Bot switches to BBB-specific context and intents
                    </p>
                  </div>
                </div>
              </div>

              {/* Exit Note */}
              <div
                className="mt-3 p-3 rounded-lg"
                style={{
                  backgroundColor: `${colors.semantic.info}15`,
                  border: `1px solid ${colors.semantic.info}40`
                }}
              >
                <p className="text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" style={{ color: colors.semantic.info }} />
                  <span style={{ color: colors.utility.secondaryText }}>
                    When completed, type <strong style={{ color: colors.utility.primaryText }}>"Exit BBB"</strong> to return to ContractNest mode
                  </span>
                </p>
              </div>
            </div>

            {/* Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.utility.primaryText }}
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Enter Group Password *</span>
                  </div>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password provided by admin"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: `${colors.utility.secondaryText}40`,
                    backgroundColor: colors.utility.secondaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                  disabled={isVerifying}
                />
                <p className="text-xs mt-2" style={{ color: colors.utility.secondaryText }}>
                  Contact the group admin if you don't have the password
                </p>
              </div>

              {/* Contact Info */}
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  border: `1px solid ${colors.utility.primaryText}15`
                }}
              >
                <p className="text-sm mb-2" style={{ color: colors.utility.secondaryText }}>
                  In case you want any help or clarifications, you can contact your fellow group member:
                </p>
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-full"
                    style={{
                      backgroundColor: `${colors.brand.primary}20`
                    }}
                  >
                    <Phone className="w-4 h-4" style={{ color: colors.brand.primary }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.utility.primaryText }}>
                      Charan Kamal
                    </p>
                    <a
                      href="tel:+919949701175"
                      className="text-sm hover:underline"
                      style={{ color: colors.brand.primary }}
                    >
                      +91 9949701175
                    </a>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Join BBB Directory</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinBBBModal;