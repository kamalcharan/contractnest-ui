// src/pages/catalog/create.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';

// Import components
import ServiceForm from '../../components/catalog/ServiceForm';

// Import utilities
import { analyticsService } from '@/services/analytics.service';
import { captureException } from '@/utils/sentry';

// Import types
import { Service } from '../../types/catalog/service';

const CreateServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const { toast } = useToast();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Track page view
  useEffect(() => {
    try {
      analyticsService.trackPageView('catalog/create', 'Create Service Page');
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  // Handle successful service creation
  const handleSuccess = (service: Service) => {
    try {
      // Track successful creation
      analyticsService.trackEvent('service_created', {
        service_id: service.id,
        service_type: service.service_type,
        has_pricing: service.pricing_records && service.pricing_records.length > 0,
        has_resources: service.resource_requirements && service.resource_requirements.length > 0
      });

      toast({
        title: "Service Created Successfully",
        description: `"${service.service_name}" has been added to your catalog`,
      });

      // Navigate to the new service view page
      navigate(`/catalog/view?id=${service.id}`, { replace: true });
    } catch (error) {
      console.error('Post-creation handling error:', error);
      captureException(error, {
        tags: { component: 'CreateServicePage', action: 'handleSuccess' }
      });
      
      // Still navigate even if analytics fail
      navigate(`/catalog/view?id=${service.id}`, { replace: true });
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    try {
      // Track cancellation
      analyticsService.trackEvent('service_creation_cancelled', {
        page: 'create'
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }

    // Navigate back to catalog
    navigate('/catalog', { replace: true });
  };

  return (
    <div 
      className="min-h-screen transition-colors"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      <ServiceForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreateServicePage;