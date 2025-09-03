// src/pages/catalog/edit.tsx
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

const EditServicePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode, currentTheme } = useTheme();
  const { toast } = useToast();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get service ID from URL params
  const serviceId = searchParams.get('id');

  // API hooks
 // const { data: serviceData, isLoading, error } = useService(serviceId || '');

  // Get service data
  const service = serviceData?.data;

  // Track page view
  useEffect(() => {
    if (serviceId) {
      try {
        analyticsService.trackPageView('catalog/edit', 'Edit Service Page', {
          service_id: serviceId
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    }
  }, [serviceId]);

  // Redirect if no service ID
  useEffect(() => {
    if (!serviceId) {
      toast({
        variant: "destructive",
        title: "Missing Service ID",
        description: "No service ID provided for editing"
      });
      navigate('/catalog', { replace: true });
    }
  }, [serviceId, navigate, toast]);

  // Handle successful service update
  const handleSuccess = (updatedService: Service) => {
    try {
      // Track successful update
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

      // Navigate to the service view page
      navigate(`/catalog/view?id=${updatedService.id}`, { replace: true });
    } catch (error) {
      console.error('Post-update handling error:', error);
      captureException(error, {
        tags: { component: 'EditServicePage', action: 'handleSuccess' }
      });
      
      // Still navigate even if analytics fail
      navigate(`/catalog/view?id=${updatedService.id}`, { replace: true });
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    try {
      // Track cancellation
      analyticsService.trackEvent('service_edit_cancelled', {
        service_id: serviceId,
        page: 'edit'
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }

    // Navigate back to service view page or catalog
    if (serviceId) {
      navigate(`/catalog/view?id=${serviceId}`, { replace: true });
    } else {
      navigate('/catalog', { replace: true });
    }
  };

  // Loading state
  if (isLoading) {
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

  // Error state
  if (error || !service) {
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
        mode="edit"
        serviceId={serviceId || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditServicePage;