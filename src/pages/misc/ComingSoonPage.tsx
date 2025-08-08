//src/pages/misc/ComingSoonPage.tsx - Theme Integrated Version

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Bell, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';
import toast from 'react-hot-toast';

interface ComingSoonPageProps {
  feature?: string;
  estimatedDate?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ 
  feature = 'This feature',
  estimatedDate
}) => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  useEffect(() => {
    analyticsService.trackMiscPageView('coming-soon', 'Coming Soon', { feature });
  }, [feature]);

  const handleGoBack = () => {
    analyticsService.trackMiscPageAction('coming-soon', 'go_back_clicked');
    navigate(-1);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email', {
        style: {
          background: colors.semantic.error,
          color: '#fff',
        },
      });
      return;
    }

    analyticsService.trackMiscPageAction('coming-soon', 'subscribe_clicked', { feature });
    
    // In a real app, this would call an API
    setSubscribed(true);
    toast.success('You\'ll be notified when this feature launches!', {
      style: {
        background: colors.semantic.success,
        color: '#fff',
      },
    });
  };

  return (
    <MiscPageLayout
      icon={<Rocket className="h-16 w-16" style={{ color: colors.brand.primary }} />}
      title={`${feature} is Coming Soon!`}
      description="We're working hard to bring you this exciting new feature."
      illustration="coming-soon"
      actions={[
        {
          label: 'Go Back',
          onClick: handleGoBack,
          variant: 'outline',
          icon: <ArrowLeft className="h-4 w-4" />
        }
      ]}
    >
      <div className="mt-8 max-w-md mx-auto">
        {estimatedDate && (
          <p 
            className="text-sm text-center mb-6 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Expected launch: <strong style={{ color: colors.utility.primaryText }}>{estimatedDate}</strong>
          </p>
        )}
        
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bell 
                className="h-5 w-5"
                style={{ color: colors.utility.secondaryText }}
              />
              <span 
                className="text-sm font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Get notified when it's ready
              </span>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.utility.primaryText + '40',
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary + '40'
                } as React.CSSProperties}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md hover:opacity-90 transition-colors font-medium"
                style={{
                  backgroundColor: colors.brand.primary,
                  color: '#ffffff'
                }}
              >
                Notify Me
              </button>
            </div>
          </form>
        ) : (
          <div 
            className="text-center p-4 rounded-md transition-colors"
            style={{
              backgroundColor: colors.brand.primary + '20',
              borderColor: colors.brand.primary + '40'
            }}
          >
            <p 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.brand.primary }}
            >
              ✓ You're on the list! We'll notify you at {email}
            </p>
          </div>
        )}
      </div>
    </MiscPageLayout>
  );
};

export default ComingSoonPage;