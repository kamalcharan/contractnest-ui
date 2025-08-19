// src/pages/catalog/CreateServicePage.tsx
// 🎨 Create service page wrapper with navigation, error handling, and success flows

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Eye,
  Edit,
  Share,
  Copy
} from 'lucide-react';
import ServiceForm from '../../components/catalog/service/ServiceForm';
import { useCreateServiceCatalogItem } from '../../hooks/mutations/useServiceCatalogMutations';
import type { CreateServiceData } from '../../hooks/mutations/useServiceCatalogMutations';

interface CreateServicePageProps {
  // Navigation
  onBack?: () => void;
  onServiceCreated?: (serviceId: string, serviceData: CreateServiceData) => void;
  onViewService?: (serviceId: string) => void;
  onEditService?: (serviceId: string) => void;
  
  // Pre-fill data (optional)
  initialData?: Partial<CreateServiceData>;
  
  // Context
  fromPage?: 'catalog' | 'dashboard' | 'quick-action';
  
  // Styling
  className?: string;
}

const CreateServicePage: React.FC<CreateServicePageProps> = ({
  onBack,
  onServiceCreated,
  onViewService,
  onEditService,
  initialData,
  fromPage = 'catalog',
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // State management
  const [creationState, setCreationState] = useState<'form' | 'success' | 'error'>('form');
  const [createdService, setCreatedService] = useState<{id: string, data: CreateServiceData} | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mutations
  const createServiceMutation = useCreateServiceCatalogItem();

  // Handle successful service creation
  const handleServiceSave = async (serviceData: CreateServiceData) => {
    try {
      setError(null);
      
      // Create the service
      const response = await createServiceMutation.mutateAsync(serviceData);
      
      // Get service ID from API response
      const serviceId = response.data?.id || `service-${Date.now()}`;
      
      setCreatedService({ id: serviceId, data: serviceData });
      setCreationState('success');
      
      // Notify parent component
      onServiceCreated?.(serviceId, serviceData);
      
    } catch (err) {
      console.error('Failed to create service:', err);
      setError(err instanceof Error ? err.message : 'Failed to create service');
      setCreationState('error');
    }
  };

  // Handle navigation back
  const handleBack = () => {
    if (creationState === 'form') {
      onBack?.();
    } else {
      // From success/error state, go back to catalog
      onBack?.();
    }
  };

  // Handle retry
  const handleRetry = () => {
    setCreationState('form');
    setError(null);
    setCreatedService(null);
  };

  // Handle post-creation actions
  const handleViewCreatedService = () => {
    if (createdService) {
      onViewService?.(createdService.id);
    }
  };

  const handleEditCreatedService = () => {
    if (createdService) {
      onEditService?.(createdService.id);
    }
  };

  const handleShareService = () => {
    if (createdService) {
      // In a real app, this would generate a shareable link
      const shareUrl = `${window.location.origin}/catalog/service/${createdService.id}`;
      navigator.clipboard.writeText(shareUrl);
      // Could show a toast notification here
    }
  };

  const handleCreateAnother = () => {
    setCreationState('form');
    setCreatedService(null);
    setError(null);
  };

  // Get page title based on context
  const getPageTitle = () => {
    switch (fromPage) {
      case 'dashboard':
        return 'Quick Service Creation';
      case 'quick-action':
        return 'New Service';
      case 'catalog':
      default:
        return 'Create New Service';
    }
  };

  // Get back button text based on context
  const getBackButtonText = () => {
    switch (fromPage) {
      case 'dashboard':
        return 'Back to Dashboard';
      case 'quick-action':
        return 'Cancel';
      case 'catalog':
      default:
        return 'Back to Catalog';
    }
  };

  // Success state
  if (creationState === 'success' && createdService) {
    return (
      <div 
        className={`min-h-screen ${className}`}
        style={{ backgroundColor: colors.utility.secondaryBackground }}
      >
        {/* Header */}
        <div 
          className="border-b"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-sm transition-all hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
            >
              <ArrowLeft className="w-4 h-4" />
              {getBackButtonText()}
            </button>
          </div>
        </div>

        {/* Success Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            {/* Success Icon */}
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: colors.semantic.success + '20' }}
            >
              <CheckCircle 
                className="w-12 h-12"
                style={{ color: colors.semantic.success }}
              />
            </div>

            {/* Success Message */}
            <h1 
              className="text-3xl font-bold mb-4"
              style={{ color: colors.utility.primaryText }}
            >
              Service Created Successfully!
            </h1>
            
            <p 
              className="text-lg mb-8"
              style={{ color: colors.utility.secondaryText }}
            >
              Your service "{createdService.data.serviceName}" has been created and is ready to use.
            </p>

            {/* Service Summary Card */}
            <div 
              className="max-w-md mx-auto p-6 rounded-xl border mb-8"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.semantic.success + '40'
              }}
            >
              <div className="text-left">
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.utility.primaryText }}
                >
                  {createdService.data.serviceName}
                </h3>
                
                <div 
                  className="text-2xl font-bold mb-2"
                  style={{ color: colors.semantic.success }}
                >
                  {createdService.data.pricingConfig.currency === 'INR' ? '₹' : 
                   createdService.data.pricingConfig.currency === 'USD' ? '$' : 
                   createdService.data.pricingConfig.currency === 'EUR' ? '€' : 
                   createdService.data.pricingConfig.currency === 'GBP' ? '£' : createdService.data.pricingConfig.currency}
                  {createdService.data.pricingConfig.basePrice}
                  <span 
                    className="text-sm font-normal ml-2"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {createdService.data.pricingConfig.pricingModel === 'FIXED' ? 'fixed' : `per ${createdService.data.pricingConfig.pricingModel.toLowerCase()}`}
                  </span>
                </div>
                
                <p 
                  className="text-sm line-clamp-2"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {createdService.data.description}
                </p>
                
                {createdService.data.requiredResources && createdService.data.requiredResources.length > 0 && (
                  <div className="mt-3">
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: colors.semantic.info + '20',
                        color: colors.semantic.info
                      }}
                    >
                      {createdService.data.requiredResources.length} resource{createdService.data.requiredResources.length !== 1 ? 's' : ''} required
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleViewCreatedService}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105 duration-200"
                style={{ backgroundColor: colors.brand.primary }}
              >
                <Eye className="w-5 h-5" />
                View Service
              </button>
              
              <button
                onClick={handleEditCreatedService}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 duration-200 border"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  backgroundColor: 'transparent'
                }}
              >
                <Edit className="w-5 h-5" />
                Edit Service
              </button>
              
              <button
                onClick={handleShareService}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 duration-200 border"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  backgroundColor: 'transparent'
                }}
              >
                <Share className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Create Another */}
            <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.utility.secondaryText + '20' }}>
              <button
                onClick={handleCreateAnother}
                className="flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 duration-200"
                style={{
                  backgroundColor: colors.semantic.success + '20',
                  color: colors.semantic.success
                }}
              >
                <Copy className="w-4 h-4" />
                Create Another Service
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (creationState === 'error') {
    return (
      <div 
        className={`min-h-screen ${className}`}
        style={{ backgroundColor: colors.utility.secondaryBackground }}
      >
        {/* Header */}
        <div 
          className="border-b"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-sm transition-all hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
            >
              <ArrowLeft className="w-4 h-4" />
              {getBackButtonText()}
            </button>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            {/* Error Icon */}
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: colors.semantic.error + '20' }}
            >
              <AlertCircle 
                className="w-12 h-12"
                style={{ color: colors.semantic.error }}
              />
            </div>

            {/* Error Message */}
            <h1 
              className="text-3xl font-bold mb-4"
              style={{ color: colors.utility.primaryText }}
            >
              Service Creation Failed
            </h1>
            
            <p 
              className="text-lg mb-2"
              style={{ color: colors.utility.secondaryText }}
            >
              We encountered an error while creating your service.
            </p>

            {error && (
              <div 
                className="max-w-md mx-auto p-4 rounded-lg mb-8"
                style={{
                  backgroundColor: colors.semantic.error + '10',
                  border: `1px solid ${colors.semantic.error}40`
                }}
              >
                <p 
                  className="text-sm"
                  style={{ color: colors.semantic.error }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105 duration-200"
                style={{ backgroundColor: colors.brand.primary }}
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <button
                onClick={handleBack}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 duration-200 border"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  backgroundColor: 'transparent'
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                {getBackButtonText()}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form state (default)
  return (
    <div className={`${className}`}>
      <ServiceForm
        mode="create"
        onBack={handleBack}
        onSave={() => {}}
      />
    </div>
  );
};

export default CreateServicePage;