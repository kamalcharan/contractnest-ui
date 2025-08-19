// src/pages/catalog/EditServicePage.tsx
// 🎨 Service editing page wrapper with navigation and error handling

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import ServiceForm from '../../components/catalog/service/ServiceForm';
import { useServiceCatalogItem } from '../../hooks/queries/useServiceCatalogQueries';
import { toast } from 'react-hot-toast';

interface EditServicePageProps {
  className?: string;
}

const EditServicePage: React.FC<EditServicePageProps> = ({ className = '' }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  // Fetch service data
  const { data: service, isLoading, isError, error } = useServiceCatalogItem(serviceId || '');

  // Redirect if no serviceId
  useEffect(() => {
    if (!serviceId) {
      toast.error('Service ID is required');
      navigate('/catalog');
    }
  }, [serviceId, navigate]);

  // Handle navigation
  const handleBack = () => {
    navigate('/catalog');
  };

  const handleSaveSuccess = () => {
    toast.success('Service updated successfully!');
    navigate('/catalog');
  };

  const handleViewService = () => {
    navigate(`/catalog/service/${serviceId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center ${className}`}
        style={{ backgroundColor: colors.utility.secondaryBackground }}
      >
        <div className="text-center">
          <Loader2 
            className="h-12 w-12 animate-spin mx-auto mb-4"
            style={{ color: colors.brand.primary }}
          />
          <h2 
            className="text-xl font-semibold mb-2"
            style={{ color: colors.utility.primaryText }}
          >
            Loading Service
          </h2>
          <p 
            className="text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            Please wait while we fetch the service details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !service) {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center ${className}`}
        style={{ backgroundColor: colors.utility.secondaryBackground }}
      >
        <div className="text-center max-w-md mx-auto px-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: colors.semantic.error + '20' }}
          >
            <AlertCircle className="w-10 h-10" style={{ color: colors.semantic.error }} />
          </div>
          
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: colors.utility.primaryText }}
          >
            Service Not Found
          </h2>
          
          <p 
            className="text-sm mb-6 leading-relaxed"
            style={{ color: colors.utility.secondaryText }}
          >
            {error?.message || 
             "The service you're trying to edit doesn't exist or has been removed. Please check the service ID and try again."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all hover:scale-105 duration-200"
              style={{
                backgroundColor: colors.brand.primary,
                color: 'white'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg transition-all hover:scale-105 duration-200 border"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                color: colors.utility.primaryText,
                backgroundColor: 'transparent'
              }}
            >
              Try Again
            </button>
          </div>

          {/* Service ID for debugging */}
          {serviceId && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.utility.secondaryText + '20' }}>
              <p 
                className="text-xs font-mono"
                style={{ color: colors.utility.secondaryText }}
              >
                Service ID: {serviceId}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Success state - render ServiceForm
  return (
    <div className={className}>
      <ServiceForm
        mode="edit"
        serviceId={serviceId}
        onBack={handleBack}
        onSave={handleSaveSuccess}
      />
      
      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleViewService}
            className="p-3 rounded-full shadow-lg transition-all hover:scale-110 duration-200"
            style={{
              backgroundColor: colors.semantic.info,
              color: 'white'
            }}
            title="View Service Details"
          >
            <ArrowLeft className="w-5 h-5 transform rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServicePage;