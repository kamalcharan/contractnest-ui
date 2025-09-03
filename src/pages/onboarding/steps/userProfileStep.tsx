//src/pages/onboarding/steps/userProfileStep.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import ProfileInfoSection from '@/components/users/user-profile/PersonalInfoSection';
import { Clock } from 'lucide-react';

interface OnboardingStepContext {
  onComplete: (data?: Record<string, any>) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

const UserProfileStep: React.FC = () => {
  const { onComplete } = useOutletContext<OnboardingStepContext>();
  const { isDarkMode, currentTheme } = useTheme();
  const { user } = useAuth();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [updating, setUpdating] = useState(false);

  // Adapter functions to match ProfileInfoSection interface
  const handleUpdate = async (data: any): Promise<boolean> => {
    setUpdating(true);
    try {
      // Complete the onboarding step with the profile data
      await onComplete({
        first_name: data.first_name,
        last_name: data.last_name,
        ...(data.country_code && data.mobile_number && {
          phone_country_code: data.country_code,
          phone_number: data.mobile_number,
          phone_formatted: `${data.country_code} ${data.mobile_number}`
        })
      });
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAvatar = async (avatarUrl: string): Promise<boolean> => {
    // For onboarding, we can include avatar in the step data
    // or handle separately if needed
    return true;
  };

  const handleRemoveAvatar = async (): Promise<boolean> => {
    return true;
  };

  const handleValidateMobile = async (mobile: string, countryCode: string): Promise<boolean> => {
    // Add mobile validation logic if needed
    return true;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: colors.utility.primaryText }}
            >
              Complete Your Profile
            </h2>
            <p 
              className="text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              Let's add a few more details to personalize your experience
            </p>
          </div>

          {/* Use existing ProfileInfoSection */}
          <ProfileInfoSection
            profile={user}
            onUpdate={handleUpdate}
            onUpdateAvatar={handleUpdateAvatar}
            onRemoveAvatar={handleRemoveAvatar}
            onValidateMobile={handleValidateMobile}
            updating={updating}
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
                  <strong>Why we need this:</strong> Your profile helps team members identify you and enables features like SMS notifications for important contract updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileStep;