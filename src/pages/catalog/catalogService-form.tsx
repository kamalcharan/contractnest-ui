// src/pages/catalog/catalogService-form.tsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, Clock } from 'lucide-react';

// Import components
import ServiceForm from '../../components/catalog/ServiceForm';

// Import hooks
import { useServiceCatalogItem } from '../../hooks/queries/useServiceCatalogQueries';

// Import utilities
import { analyticsService } from '@/services/analytics.service';
import { captureException } from '@/utils/sentry';

// Import types
import { Service } from '../../types/catalog/service';

const CatalogServiceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode, currentTheme } = useTheme();
  const { toast } = useToast();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Determine mode based on URL parameters
  const serviceId = searchParams.get('id');
  const mode = serviceId ? 'edit' : 'create';

  // API hooks - only fetch if in edit mode
  const { 
    data: serviceData, 
    isLoading, 
    error 
  } = useServiceCatalogItem(serviceId);

  // Get service data for edit mode
  const service = serviceData;

  // Track page view
  useEffect(() => {
    try {
      const pageName = mode === 'create' ? 'Create Service Page' : 'Edit Service Page';
      const pageId = mode === 'create' ? 'catalog/create' : 'catalog/edit';
      
      analyticsService.trackPageView(pageId, pageName, {
        mode,
        ...(serviceId && { service_id: serviceId })
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [mode, serviceId]);

  // Handle successful service creation/update
  const handleSuccess = (updatedService: Service) => {
    try {
      // Track analytics based on mode
      if (mode === 'create') {
        analyticsService.trackEvent('service_created', {
          service_id: updatedService.id,
          service_type: updatedService.service_type,
          has_pricing: updatedService.pricing_records && updatedService.pricing_records.length > 0,
          has_resources: updatedService.resource_requirements && updatedService.resource_requirements.length > 0
        });

        toast({
          title: "Service Created Successfully",
          description: `"${updatedService.service_name}" has been added to your catalog`,
        });
      } else {
        analyticsService.trackEvent('service_updated', {
          service_id: updatedService.id,
          service_type: updatedService.service_type,
          has_pricing: updatedService.pricing_records && updatedService.pricing_records.length > 0,
          has_resources: updatedService.resource_requirements && updatedService.resource_requirements.length > 0
        });

        toast({
          title: "Service Updated Successfully",
          description: `"${updatedService.service_name}" has been updated`,
        });
      }

      // Navigate to the service view page
      navigate(`/catalog/view?id=${updatedService.id}`, { replace: true });
    } catch (error) {
      console.error('Post-success handling error:', error);
      captureException(error, {
        tags: { 
          component: 'CatalogServiceFormPage', 
          action: 'handleSuccess',
          mode 
        }
      });
      
      // Still navigate even if analytics fail
      navigate(`/catalog/view?id=${updatedService.id}`, { replace: true });
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    try {
      // Track cancellation
      const eventName = mode === 'create' ? 'service_creation_cancelled' : 'service_edit_cancelled';
      analyticsService.trackEvent(eventName, {
        page: mode,
        ...(serviceId && { service_id: serviceId })
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }

    // Navigate back appropriately
    if (mode === 'edit' && serviceId) {
      // For edit mode, go back to service view
      navigate(`/catalog/view?id=${serviceId}`, { replace: true });
    } else {
      // For create mode, go to catalog list
      navigate('/catalog', { replace: true });
    }
  };

  // Loading state (only for edit mode)
  if (mode === 'edit' && isLoading) {
    return (
      <div 
        className="min-h-screen transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Clock 
              className="h-8 w-8 animate-spin mx-auto mb-4"
              style={{ color: colors.brand.primary }}
            />
            <p 
              className="text-lg transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Loading service data...
            </p>
            <p 
              className="text-sm mt-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Please wait while we fetch the service information
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state (only for edit mode)
  if (mode === 'edit' && (error || !service)) {
    return (
      <div 
        className="min-h-screen transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          <div className="min-h-screen flex items-center justify-center">
            <div 
              className="rounded-lg border p-12 text-center max-w-md w-full"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.semantic.error + '40'
              }}
            >
              <AlertTriangle 
                className="h-16 w-16 mx-auto mb-4"
                style={{ color: colors.semantic.error }}
              />
              <h3 
                className="text-lg font-medium mb-2"
                style={{ color: colors.semantic.error }}
              >
                Cannot Edit Service
              </h3>
              <p 
                className="mb-6 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {error?.message || "The service you're trying to edit doesn't exist or cannot be loaded."}
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => navigate('/catalog')}
                  className="px-4 py-2 rounded-md border transition-colors"
                  style={{
                    borderColor: colors.utility.primaryText + '40',
                    color: colors.utility.primaryText,
                    backgroundColor: 'transparent'
                  }}
                >
                  Back to Catalog
                </button>
                {serviceId && (
                  <button 
                    onClick={() => navigate(`/catalog/view?id=${serviceId}`)}
                    className="px-4 py-2 rounded-md transition-colors"
                    style={{
                      backgroundColor: colors.brand.primary,
                      color: '#ffffff'
                    }}
                  >
                    View Service
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render the form
  return (
    <div 
      className="min-h-screen transition-colors"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      <ServiceForm
        mode={mode}
        serviceId={serviceId || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CatalogServiceFormPage;