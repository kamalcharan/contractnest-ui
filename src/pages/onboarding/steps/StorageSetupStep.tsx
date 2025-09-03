import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Upload, Database, Check, Info, Loader2, HardDrive, CheckCircle } from 'lucide-react';
import { useStorageManagement } from '@/hooks/useStorageManagement';

interface OnboardingStepContext {
  onComplete: (data?: Record<string, any>) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

const StorageSetupStep: React.FC = () => {
  const { onComplete, onSkip } = useOutletContext<OnboardingStepContext>();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const { 
    storageSetupComplete,
    setupStorage,
    isSubmitting: isSettingUp
  } = useStorageManagement();
  
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  // Check if storage is already set up
  useEffect(() => {
    if (storageSetupComplete) {
      setSetupCompleted(true);
    }
  }, [storageSetupComplete]);

  const handleSetupStorage = async () => {
    // Prevent multiple clicks
    if (localSubmitting || isSettingUp || setupCompleted) {
      return;
    }

    setLocalSubmitting(true);
    setSetupError(null);
    
    try {
      const success = await setupStorage();
      if (success) {
        setSetupCompleted(true);
        // Wait a moment to show success state
        setTimeout(() => {
          onComplete({ 
            storageSetup: true,
            setupDate: new Date().toISOString()
          });
        }, 1000);
      } else {
        setSetupError('Storage setup failed. Please try again.');
      }
    } catch (error) {
      setSetupError('An error occurred during setup. Please try again.');
      console.error('Storage setup error:', error);
    } finally {
      setLocalSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (!localSubmitting && !isSettingUp) {
      onSkip();
    }
  };

  const isProcessing = localSubmitting || isSettingUp;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {/* Step Icon */}
          <div className="text-center mb-6">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all"
              style={{ 
                backgroundColor: setupCompleted ? colors.semantic.success + '20' : colors.brand.primary + '20',
                color: setupCompleted ? colors.semantic.success : colors.brand.primary
              }}
            >
              {setupCompleted ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <HardDrive className="w-8 h-8" />
              )}
            </div>
            {setupCompleted && (
              <p 
                className="text-sm font-medium"
                style={{ color: colors.semantic.success }}
              >
                Storage setup complete!
              </p>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Upload Files Card */}
            <div 
              className="rounded-lg border p-6"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.primaryText + '20'
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.brand.primary + '10' }}
                >
                  <Upload 
                    className="w-6 h-6" 
                    style={{ color: colors.brand.primary }}
                  />
                </div>
              </div>
              <h3 
                className="text-lg font-semibold mb-2 text-center"
                style={{ color: colors.utility.primaryText }}
              >
                Upload Files
              </h3>
              <p 
                className="text-sm mb-4 text-center"
                style={{ color: colors.utility.secondaryText }}
              >
                Store all your important files securely
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check 
                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" 
                    style={{ color: colors.semantic.success }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Contact photos and profiles
                  </span>
                </li>
                <li className="flex items-start">
                  <Check 
                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" 
                    style={{ color: colors.semantic.success }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Contract attachments
                  </span>
                </li>
                <li className="flex items-start">
                  <Check 
                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" 
                    style={{ color: colors.semantic.success }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Service documentation
                  </span>
                </li>
              </ul>
            </div>
            
            {/* Cloud Storage Card */}
            <div 
              className="rounded-lg border p-6"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.primaryText + '20'
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.brand.primary + '10' }}
                >
                  <Database 
                    className="w-6 h-6" 
                    style={{ color: colors.brand.primary }}
                  />
                </div>
              </div>
              <h3 
                className="text-lg font-semibold mb-2 text-center"
                style={{ color: colors.utility.primaryText }}
              >
                Cloud Storage
              </h3>
              <p 
                className="text-sm mb-4 text-center"
                style={{ color: colors.utility.secondaryText }}
              >
                Secure and reliable storage
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check 
                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" 
                    style={{ color: colors.semantic.success }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    40MB free storage space
                  </span>
                </li>
                <li className="flex items-start">
                  <Check 
                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" 
                    style={{ color: colors.semantic.success }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    5MB maximum file size
                  </span>
                </li>
                <li className="flex items-start">
                  <Check 
                    className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" 
                    style={{ color: colors.semantic.success }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Supports all file types
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Error Message */}
          {setupError && (
            <div 
              className="p-3 rounded-lg mb-4 text-sm"
              style={{
                backgroundColor: colors.semantic.error + '10',
                color: colors.semantic.error,
                border: `1px solid ${colors.semantic.error}30`
              }}
            >
              {setupError}
            </div>
          )}

          {/* Info Box */}
          {!setupCompleted && (
            <div 
              className="p-4 border rounded-lg flex items-start mb-8"
              style={{
                backgroundColor: colors.brand.primary + '10',
                borderColor: colors.brand.primary + '30'
              }}
            >
              <Info 
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" 
                style={{ color: colors.brand.primary }}
              />
              <div className="flex-1">
                <p 
                  className="text-sm"
                  style={{ color: colors.utility.primaryText }}
                >
                  <strong>Why set up storage?</strong> You'll need storage to upload your company logo, 
                  contact photos, and attach files to contracts. You can expand your storage anytime.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            {!setupCompleted ? (
              <>
                <button
                  onClick={handleSetupStorage}
                  disabled={isProcessing}
                  className="px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                  style={{
                    backgroundColor: isProcessing ? colors.utility.secondaryText : colors.brand.primary,
                    color: '#FFFFFF',
                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Setting up storage...
                    </>
                  ) : (
                    'Setup Storage Now'
                  )}
                </button>

                <div>
                  <button
                    onClick={handleSkip}
                    disabled={isProcessing}
                    className="text-sm transition-colors hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      color: colors.utility.secondaryText,
                      cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Skip for now (you can set this up later)
                  </button>
                </div>
              </>
            ) : (
              <p 
                className="text-sm"
                style={{ color: colors.utility.secondaryText }}
              >
                Click "Continue" to proceed to the next step
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageSetupStep;