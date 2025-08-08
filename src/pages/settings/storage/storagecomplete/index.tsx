// src/pages/settings/storage/storagecomplete/index.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { useStorageManagement } from '@/hooks/useStorageManagement';
import { formatFileSize } from '@/utils/constants/storageConstants';
import { analyticsService } from '@/services/analytics.service';
import { useTheme } from '@/contexts/ThemeContext';

const StorageCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const { 
    isLoading, 
    storageStats,
    storageSetupComplete,
    fetchStorageStats 
  } = useStorageManagement();
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('settings/storage/complete', 'Storage Setup Complete');
  }, []);
  
  // Fetch storage stats on load
  useEffect(() => {
    fetchStorageStats();
  }, [fetchStorageStats]);
  
  // Redirect if storage not set up
  useEffect(() => {
    if (!isLoading && !storageSetupComplete) {
      navigate('/settings/storage/storagesetup');
    }
  }, [storageSetupComplete, isLoading, navigate]);
  
  // Handle continue button
  const handleContinue = () => {
    navigate('/settings/storage/storagemanagement');
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/settings');
  };
  
  return (
    <div 
      className="p-6 transition-colors duration-200 min-h-screen"
      style={{
        background: isDarkMode 
          ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
          : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
      }}
    >
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full transition-colors hover:opacity-80"
          style={{ backgroundColor: colors.utility.secondaryBackground + '80' }}
        >
          <ArrowLeft 
            className="h-5 w-5 transition-colors" 
            style={{ color: colors.utility.secondaryText }}
          />
        </button>
        <div>
          <h1 
            className="text-2xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Storage Management
          </h1>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Configure your file storage
          </p>
        </div>
      </div>
      
      {/* Storage Setup Complete Content */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="text-center mb-12">
          <div 
            className="inline-flex justify-center items-center w-20 h-20 rounded-full mb-6 transition-colors"
            style={{ backgroundColor: colors.semantic.success + '20' }}
          >
            <CheckCircle 
              className="w-12 h-12 transition-colors" 
              style={{ color: colors.semantic.success }}
            />
          </div>
          <h2 
            className="text-3xl font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Storage Setup Complete
          </h2>
          <p 
            className="mt-2 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Your cloud storage is ready to use
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div 
              className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full transition-colors"
              style={{ borderColor: colors.brand.primary }}
            ></div>
          </div>
        ) : storageStats ? (
          <div 
            className="rounded-lg border p-6 mb-8 transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span 
                  className="font-medium transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Initial Storage Space:
                </span>
                <span 
                  className="transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatFileSize(storageStats.quota)}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <span 
                  className="font-medium transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Used Space:
                </span>
                <span 
                  className="transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatFileSize(storageStats.used)}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <span 
                  className="font-medium transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Available Space:
                </span>
                <span 
                  className="transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatFileSize(storageStats.available)}
                </span>
              </div>
              
              <div className="pt-4">
                <div 
                  className="flex justify-between text-xs mb-1 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div 
                  className="w-full rounded-full h-2.5"
                  style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
                >
                  <div 
                    className="h-2.5 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${storageStats.usagePercentage}%`,
                      background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div 
          className="border rounded-md p-4 mb-8 flex items-start transition-colors"
          style={{
            backgroundColor: colors.brand.primary + '10',
            borderColor: colors.brand.primary + '30'
          }}
        >
          <Info 
            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 transition-colors" 
            style={{ color: colors.brand.primary }}
          />
          <p 
            className="text-sm transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Your files are stored securely in the cloud. You can manage your storage and purchase more space at any 
            time from Settings → Storage.
          </p>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-6 py-3 rounded-md transition-colors hover:opacity-90 min-w-[200px]"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
              color: '#FFFFFF'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageCompletePage;