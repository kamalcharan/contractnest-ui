// src/components/integrations/IntegrationSetupModal.tsx
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectIntegrationParams, IntegrationProvider, TenantIntegration, TestConnectionParams, UpdateIntegrationParams } from '@/hooks/useIntegrations';
import DynamicFormField from './DynamicFormField';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';

interface IntegrationSetupModalProps {
  provider: IntegrationProvider;
  tenantIntegration?: TenantIntegration;
  onClose: () => void;
  onConnect: (params: ConnectIntegrationParams) => Promise<any>;
  onUpdate: (params: UpdateIntegrationParams) => Promise<any>;
  onTestConnection: (params: TestConnectionParams) => Promise<any>;
}

const IntegrationSetupModal: React.FC<IntegrationSetupModalProps> = ({
  provider,
  tenantIntegration,
  onClose,
  onConnect,
  onUpdate,
  onTestConnection
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  
  // Load initial data from existing integration
  useEffect(() => {
    try {
      if (tenantIntegration && tenantIntegration.credentials) {
        // Initialize form data for existing integration
        const fields = provider.config_schema?.fields || [];
        const initialData: Record<string, any> = {};
        
        fields.forEach(field => {
          // For non-sensitive fields, use the value from credentials if available
          if (!field.sensitive && tenantIntegration.credentials && tenantIntegration.credentials[field.name] !== undefined) {
            initialData[field.name] = tenantIntegration.credentials[field.name];
          } else if (field.default !== undefined) {
            initialData[field.name] = field.default;
          }
        });
        
        setFormData(initialData);
      } else {
        // New integration - initialize with defaults
        const fields = provider.config_schema?.fields || [];
        const initialData: Record<string, any> = {};
        
        fields.forEach(field => {
          if (field.default !== undefined) {
            initialData[field.name] = field.default;
          }
        });
        
        setFormData(initialData);
      }
    } catch (error) {
      console.error('Error initializing form data:', error);
      captureException(error, {
        tags: { component: 'IntegrationSetupModal', action: 'useEffect' }
      });
    }
  }, []); // Empty dependency array - only run once on mount
  
  // Update form field
  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear previous test result when form changes
    setTestResult(null);
  };
  
  // Check if all required fields are filled
  const areRequiredFieldsFilled = (): boolean => {
    const requiredFields = provider.config_schema?.fields?.filter(field => field.required) || [];
    
    if (tenantIntegration) {
      // For existing integrations, only check newly entered fields
      return requiredFields.every(field => {
        const newValue = formData[field.name];
        // If field is empty, it will use existing value, so consider it filled
        return newValue !== undefined || newValue === '';
      });
    } else {
      // For new integrations, all required fields must be filled
      return requiredFields.every(field => {
        const value = formData[field.name];
        return value !== undefined && value !== '' && value !== null;
      });
    }
  };
  
  // Test the connection
  const handleTestConnection = async () => {
    try {
      setIsTestingConnection(true);
      setTestResult(null);
      
      // For existing integrations, we need to merge existing credentials with form data
      let testCredentials = { ...formData };
      
      if (tenantIntegration && tenantIntegration.credentials) {
        // Merge existing credentials with new values
        // This allows testing with existing credentials even if fields are empty
        testCredentials = {
          ...tenantIntegration.credentials,
          ...Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== '' && value !== undefined)
          )
        };
      }
      
      // Track the test connection action
      try {
        if (analyticsService && typeof analyticsService.trackPageView === 'function') {
          analyticsService.trackPageView(
            `integration_test/${provider.name}`,
            `Integration Test - ${provider.display_name}`
          );
        }
      } catch (error) {
        console.error('Analytics error:', error);
      }
      
      const result = await onTestConnection({
        provider_id: provider.id,
        credentials: testCredentials,
        integration_id: tenantIntegration?.id // Pass integration ID for existing integrations
      });
      
      setTestResult(result);
      
      return result.success;
    } catch (error) {
      captureException(error, {
        tags: { component: 'IntegrationSetupModal', action: 'handleTestConnection' },
        extra: { provider_id: provider.id }
      });
      
      setTestResult({
        success: false,
        message: 'An error occurred while testing the connection'
      });
      
      return false;
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  // Submit the form (connect or update)
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate form data against required fields
      const requiredFields = provider.config_schema?.fields
        ?.filter(field => field.required)
        .map(field => field.name) || [];
      
      // For new integrations, check all required fields
      if (!tenantIntegration) {
        const missingFields = requiredFields.filter(fieldName => 
          !formData[fieldName] && formData[fieldName] !== false && formData[fieldName] !== 0
        );
        
        if (missingFields.length > 0) {
          const missingFieldNames = missingFields
            .map(name => {
              const field = provider.config_schema?.fields?.find(f => f.name === name);
              return field ? field.display_name : name;
            })
            .join(', ');
            
          setTestResult({
            success: false,
            message: `Missing required fields: ${missingFieldNames}`
          });
          
          return;
        }
      }
      
      // Test connection first
      const testPassed = await handleTestConnection();
      
      if (!testPassed) {
        return;
      }
      
      // Create new integration or update existing one
      if (tenantIntegration) {
        // For updates, only send changed fields
        const changedCredentials = Object.fromEntries(
          Object.entries(formData).filter(([_, value]) => value !== '' && value !== undefined)
        );
        
        await onUpdate({
          id: tenantIntegration.id,
          credentials: changedCredentials
        });
        
        // Track the update
        try {
          if (analyticsService && typeof analyticsService.trackPageView === 'function') {
            analyticsService.trackPageView(
              `integration_updated/${provider.name}`,
              `Integration Updated - ${provider.display_name}`
            );
          }
        } catch (error) {
          console.error('Analytics error:', error);
        }
      } else {
        await onConnect({
          master_integration_id: provider.id,
          credentials: formData
        });
        
        // Track the connection
        try {
          if (analyticsService && typeof analyticsService.trackPageView === 'function') {
            analyticsService.trackPageView(
              `integration_connected/${provider.name}`,
              `Integration Connected - ${provider.display_name}`
            );
          }
        } catch (error) {
          console.error('Analytics error:', error);
        }
      }
      
      onClose();
    } catch (error) {
      captureException(error, {
        tags: { component: 'IntegrationSetupModal', action: 'handleSubmit' },
        extra: { provider_id: provider.id }
      });
      
      setTestResult({
        success: false,
        message: 'An error occurred while saving the integration'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if test connection button should be disabled
  const isTestDisabled = (): boolean => {
    if (isTestingConnection || isSubmitting) return true;
    
    if (tenantIntegration) {
      // For existing integrations, always allow testing
      return false;
    } else {
      // For new integrations, check if required fields are filled
      return !areRequiredFieldsFilled();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">{provider.display_name} Integration</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="px-6 py-4 overflow-y-auto flex-grow">
          <p className="text-muted-foreground mb-6">{provider.description}</p>
          
          {/* Test Results */}
          {testResult && (
            <div className={cn(
              "p-4 rounded-md mb-6 flex items-start",
              testResult.success
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">
                  {testResult.success ? 'Connection successful' : 'Connection failed'}
                </p>
                <p>{testResult.message}</p>
              </div>
            </div>
          )}
          
          {/* Note for existing integrations */}
          {tenantIntegration && (
            <div className="p-4 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-md mb-6">
              <p className="text-sm">
                <strong>Note:</strong> For security reasons, sensitive fields like API keys are not shown. 
                Leave them blank to keep existing values, or enter new values to update them.
              </p>
            </div>
          )}
          
          {/* Dynamic Form */}
          <div className="space-y-4">
            {provider.config_schema?.fields?.map(field => (
              <DynamicFormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={value => handleFieldChange(field.name, value)}
              />
            ))}
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-between">
          <button
            onClick={handleTestConnection}
            disabled={isTestDisabled()}
            className={cn(
              "px-4 py-2 rounded-md text-sm",
              "border border-border hover:bg-muted transition-colors",
              isTestDisabled() && "opacity-50 cursor-not-allowed"
            )}
          >
            {isTestingConnection ? (
              <>
                <Loader2 size={14} className="inline mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm border border-primary text-primary hover:bg-primary/5 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                "px-4 py-2 rounded-md text-sm",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="inline mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                tenantIntegration ? 'Update Integration' : 'Connect Integration'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSetupModal;