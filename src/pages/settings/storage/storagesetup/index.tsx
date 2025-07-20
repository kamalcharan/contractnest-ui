// src/pages/settings/storage/storagesetup/index.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Database, Check, Info, Loader2 } from 'lucide-react';
import { useStorageManagement } from '@/hooks/useStorageManagement';
import { formatFileSize } from '@/utils/constants/storageConstants';
import { analyticsService } from '@/services/analytics.service';

const StorageSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    isSubmitting, 
    storageSetupComplete, 
    storageStats,
    setupStorage
  } = useStorageManagement();
  
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('settings/storage/setup', 'Storage Setup');
  }, []);
  
  // Redirect if storage already setup - only after loading is complete
  useEffect(() => {
    // Wait for loading to complete and ensure we have stats before redirecting
    if (!isLoading && storageSetupComplete && storageStats) {
      navigate('/settings/storage/storagemanagement');
    }
  }, [storageSetupComplete, isLoading, storageStats, navigate]);
  
  // Handle setup storage
  const handleSetupStorage = async () => {
    setIsSettingUp(true);
    try {
      const success = await setupStorage();
      if (success) {
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          navigate('/settings/storage/storagemanagement');
        }, 500);
      }
    } finally {
      setIsSettingUp(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/settings');
  };
  
  // Show loading while checking storage status
  if (isLoading) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  // Show setup in progress overlay
  if (isSettingUp) {
    return (
      <div className="p-6 bg-muted/20">
        {/* Page Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            disabled={true}
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Storage Management</h1>
            <p className="text-muted-foreground">Configure your file storage</p>
          </div>
        </div>
        
        {/* Setup in Progress */}
        <div className="max-w-2xl mx-auto mt-20">
          <div className="text-center">
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Setting Up Your Storage</h2>
            <p className="text-muted-foreground">
              Please wait while we configure your cloud storage. This may take a few moments...
            </p>
            
            {/* Progress steps */}
            <div className="mt-8 max-w-sm mx-auto text-left space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm">Initializing storage space</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                </div>
                <span className="text-sm text-muted-foreground">Creating folder structure</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                </div>
                <span className="text-sm text-muted-foreground">Configuring permissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
      
      {/* Setup Content */}
      <div className="max-w-3xl mx-auto mt-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold">Setup Cloud Storage</h2>
          <p className="text-muted-foreground mt-2">Configure storage to upload and manage your files</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Upload Files Card */}
          <div className="bg-card rounded-lg border border-border p-6 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Files</h3>
            <p className="text-muted-foreground mb-4">Store all your important files securely</p>
            
            <ul className="text-left space-y-2 w-full">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Contact photos and profile images</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Contract attachments and supporting docs</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Service images and marketing materials</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Organized file management system</span>
              </li>
            </ul>
          </div>
          
          {/* Cloud Storage Card */}
          <div className="bg-card rounded-lg border border-border p-6 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cloud Storage</h3>
            <p className="text-muted-foreground mb-4">Secure and reliable storage</p>
            
            <ul className="text-left space-y-2 w-full">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">40MB free storage space</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">5MB maximum file size</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Supports PDF, images, and documents</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Optional storage expansions available</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleSetupStorage}
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors min-w-[200px] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              'Setup Storage'
            )}
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            You can manage your storage space and purchase more at any time from the settings page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorageSetupPage;