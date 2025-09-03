import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  FileCheck, 
  Bell, 
  Users, 
  TrendingUp,
  Clock
} from 'lucide-react';

interface OnboardingStepContext {
  onComplete: (data?: Record<string, any>) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

const WelcomeStep: React.FC = () => {
  const { onComplete } = useOutletContext<OnboardingStepContext>();
  const { isDarkMode, currentTheme } = useTheme();
  const { user, currentTenant } = useAuth();
  
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Auto-mark welcome as viewed when component mounts
  useEffect(() => {
    // Welcome doesn't need any data, just mark it as viewed
    // Don't call onComplete here as it will conflict with the Continue button
  }, []);

  const features = [
    {
      icon: FileCheck,
      title: 'Digital Contracts',
      description: 'Replace paper and spreadsheets with smart digital agreements'
    },
    {
      icon: Bell,
      title: 'Automated Reminders',
      description: 'Never miss a milestone, payment, or service date again'
    },
    {
      icon: Users,
      title: 'Collaborative Workflow',
      description: 'Seamlessly work with partners, vendors, and clients'
    },
    {
      icon: TrendingUp,
      title: 'Track Performance',
      description: 'Real-time visibility into SLAs, receivables, and profitability'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-6">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ 
                backgroundColor: colors.brand.primary + '20',
                color: colors.brand.primary
              }}
            >
              <Sparkles className="w-8 h-8" />
            </div>
            
            <h1 
              className="text-3xl font-bold mb-3"
              style={{ color: colors.utility.primaryText }}
            >
              Thank You for Joining ContractNest, {user?.first_name || 'there'}!
            </h1>
            
            <p 
              className="text-lg mb-2 font-semibold"
              style={{ color: colors.brand.primary }}
            >
              Turn Service Commitments Into Profitable Relationships
            </p>
            
            <p 
              className="text-base max-w-2xl mx-auto"
              style={{ color: colors.utility.secondaryText }}
            >
              Transform scattered service agreements into an automated, collaborative exchange. 
              From healthcare equipment maintenance to manufacturing service contracts - 
              digitize, automate, and scale your service relationships.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex gap-3 p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: colors.utility.secondaryBackground,
                    borderColor: colors.utility.primaryText + '20'
                  }}
                >
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: colors.brand.primary + '15',
                      color: colors.brand.primary
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="font-semibold mb-1 text-sm"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-xs"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Statistics */}
          <div 
            className="rounded-lg p-4 mb-6"
            style={{ 
              backgroundColor: colors.brand.primary + '10',
              borderLeft: `3px solid ${colors.brand.primary}`
            }}
          >
            <h3 
              className="text-base font-semibold mb-3"
              style={{ color: colors.utility.primaryText }}
            >
              Why Businesses Choose ContractNest
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div 
                  className="text-xl font-bold"
                  style={{ color: colors.brand.primary }}
                >
                  68%
                </div>
                <p 
                  className="text-xs"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Reduction in missed SLAs
                </p>
              </div>
              <div className="text-center">
                <div 
                  className="text-xl font-bold"
                  style={{ color: colors.brand.primary }}
                >
                  2+ Hours
                </div>
                <p 
                  className="text-xs"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Saved daily
                </p>
              </div>
              <div className="text-center">
                <div 
                  className="text-xl font-bold"
                  style={{ color: colors.brand.primary }}
                >
                  15 Days
                </div>
                <p 
                  className="text-xs"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Faster payments
                </p>
              </div>
            </div>
          </div>

          {/* Setup Info */}
          <div 
            className="text-center p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <Clock 
              className="w-6 h-6 mx-auto mb-2"
              style={{ color: colors.utility.secondaryText }}
            />
            <p 
              className="text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              This setup will take about 15-20 minutes. You can pause and resume anytime.
            </p>
            <p 
              className="text-sm mt-2 font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              Click "Continue" below to begin setting up your workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;