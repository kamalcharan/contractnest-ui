// src/pages/settings/storage/storagecomplete/index.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { useStorageManagement } from '@/hooks/useStorageManagement';
import { formatFileSize } from '@/utils/constants/storageConstants';
import { analyticsService } from '@/services/analytics.service';

const StorageCompletePage: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Storage Management</h1>
          <p className="text-muted-foreground">Configure your file storage</p>
        </div>
      </div>
      
      {/* Storage Setup Complete Content */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="text-center mb-12">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-semibold">Storage Setup Complete</h2>
          <p className="text-muted-foreground mt-2">Your cloud storage is ready to use</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : storageStats ? (
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span className="font-medium">Initial Storage Space:</span>
                <span>{formatFileSize(storageStats.quota)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium">Used Space:</span>
                <span>{formatFileSize(storageStats.used)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium">Available Space:</span>
                <span>{formatFileSize(storageStats.available)}</span>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${storageStats.usagePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8 flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Your files are stored securely in the cloud. You can manage your storage and purchase more space at any 
            time from Settings → Storage.
          </p>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors min-w-[200px]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageCompletePage;