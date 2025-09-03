//src/pages/onboarding/steps/ThemeSelectionStep.tsx

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import ThemePreferences from '@/components/users/user-profile/ThemePreferences';
import { Palette, Clock } from 'lucide-react';

interface OnboardingStepContext {
  onComplete: (data?: Record<string, any>) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

const ThemeSelectionStep: React.FC = () => {
  const { onComplete } = useOutletContext<OnboardingStepContext>();
  const { isDarkMode, currentTheme, currentThemeId } = useTheme();
  const { user } = useAuth();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const handleContinue = () => {
    // Save theme preferences as step completion data
    onComplete({
      theme_id: currentThemeId,
      dark_mode: isDarkMode,
      preferences_set: true
    });
  };

  // Dummy handlers since ThemePreferences handles its own updates
  const handleUpdate = async (data: any): Promise<boolean> => true;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ 
                backgroundColor: colors.brand.primary + '20',
                color: colors.brand.primary
              }}
            >
              <Palette className="w-8 h-8" />
            </div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: colors.utility.primaryText }}
            >
              Choose Your Theme
            </h2>
            <p 
              className="text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              Customize the look and feel of your workspace
            </p>
          </div>

          {/* Use existing ThemePreferences component */}
          <ThemePreferences
            profile={user}
            onUpdate={handleUpdate}
            updating={false}
          />

          {/* Info Box */}
          <div 
            className="mt-6 p-4 rounded-lg border"
            style={{
              backgroundColor: colors.brand.primary + '10',
              borderColor: colors.brand.primary + '30'
            }}
          >
            <div className="flex items-start">
              <Clock className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.brand.primary }} />
              <div>
                <p className="text-sm" style={{ color: colors.utility.primaryText }}>
                  Your theme changes are applied instantly and saved automatically. 
                  You can change these preferences anytime from your profile settings.
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectionStep;