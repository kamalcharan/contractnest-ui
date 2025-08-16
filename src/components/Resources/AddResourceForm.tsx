// src/components/Resources/AddResourceForm.tsx
// Inline form component for adding new resources


import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';
import { useCreateResource } from '@/hooks/queries/useResources';
import { 
  ResourceType,
  CreateResourceFormData,
  ResourceFormErrors,
  getResourceTypeBehavior,
  RESOURCE_COLORS,
  DEFAULT_CREATE_RESOURCE_DATA
} from '@/types/resources';
import { validateResourceForm, prepareResourceFormData } from '@/utils/helpers/resourceHelpers';

interface AddResourceFormProps {
  resourceType: ResourceType;
  nextSequence?: number;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
}

/**
 * Inline form for adding new resources
 * Only shown for manual entry resource types
 */
const AddResourceForm: React.FC<AddResourceFormProps> = ({
  resourceType,
  nextSequence,
  onSave,
  onCancel,
  className,
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get resource type behavior
  const behavior = getResourceTypeBehavior(resourceType);

  // Form state
  const [formData, setFormData] = useState<CreateResourceFormData>({
    resource_type_id: resourceType.id,
    name: '',
    display_name: '',
    hexcolor: RESOURCE_COLORS[0],
    sequence_no: nextSequence,
    // Add required fields that might be missing
    is_active: true,
    is_deletable: true,
    ...DEFAULT_CREATE_RESOURCE_DATA,
  });

  const [errors, setErrors] = useState<ResourceFormErrors>({});

  // Update sequence number when it changes
  useEffect(() => {
    if (nextSequence && nextSequence !== formData.sequence_no) {
      setFormData(prev => ({
        ...prev,
        sequence_no: nextSequence
      }));
    }
  }, [nextSequence]);

  // Mutation
  const createMutation = useCreateResource();

  // Handle field changes
  const handleFieldChange = (field: keyof CreateResourceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form data
      const { isValid, errors: validationErrors } = validateResourceForm(formData, 'create');
      
      if (!isValid) {
        setErrors(validationErrors);
        toast.error('Please fix the validation errors', {
          duration: 4000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#EF4444',
            color: '#FFF',
            fontSize: '14px'
          },
        });
        return;
      }

      // Clear errors
      setErrors({});

      // Prepare data with all required fields
      const cleanedData = { 
        ...formData,
        // Ensure required fields are present
        is_active: true,
        is_deletable: true,
        // Clean tags field
        tags: formData.tags && typeof formData.tags === 'object' && Object.keys(formData.tags).length === 0 
          ? undefined 
          : formData.tags
      };
      
      console.log('📤 Submitting resource data:', cleanedData);
      
      const preparedData = prepareResourceFormData(cleanedData, 'create');
      console.log('📤 Prepared data:', preparedData);
      
      await createMutation.mutateAsync({
        data: preparedData as CreateResourceFormData,
      });

      // Success callback
      onSave();
    } catch (error) {
      console.error('❌ Failed to create resource:', error);
      
      // Prevent maintenance page redirect by handling error here
      const errorMessage = error instanceof Error ? error.message : 'Failed to create resource';
      
      // Show manual error toast
      toast.error(errorMessage, {
        duration: 6000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });
      
      // Set general error
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
      
      // Don't re-throw the error to prevent app-level error handling
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      resource_type_id: resourceType.id,
      name: '',
      display_name: '',
      hexcolor: RESOURCE_COLORS[0],
      sequence_no: nextSequence,
      ...DEFAULT_CREATE_RESOURCE_DATA,
    });
    setErrors({});
    onCancel();
  };

  return (
    <div 
      className="rounded-lg shadow-sm border-2 transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.brand.primary
      }}
    >
      <div className="grid grid-cols-4 gap-4 px-4 py-3 items-start">
        {/* Name */}
        <div className="space-y-1">
          <Input
            placeholder="Resource name"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            disabled={createMutation.isPending}
            className={errors.name ? "border-red-500" : ""}
            style={{
              borderColor: errors.name 
                ? colors.semantic.error 
                : colors.utility.secondaryText + '40',
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText
            }}
          />
          {errors.name && (
            <p 
              className="text-xs transition-colors"
              style={{ color: colors.semantic.error }}
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Display Name */}
        <div className="space-y-1">
          <Input
            placeholder="Display name"
            value={formData.display_name}
            onChange={(e) => handleFieldChange('display_name', e.target.value)}
            disabled={createMutation.isPending}
            className={errors.display_name ? "border-red-500" : ""}
            style={{
              borderColor: errors.display_name 
                ? colors.semantic.error 
                : colors.utility.secondaryText + '40',
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText
            }}
          />
          {errors.display_name && (
            <p 
              className="text-xs transition-colors"
              style={{ color: colors.semantic.error }}
            >
              {errors.display_name}
            </p>
          )}
        </div>

        {/* Color */}
        <div className="space-y-1">
          {behavior.allowsColor ? (
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full border" 
                style={{ 
                  backgroundColor: formData.hexcolor || RESOURCE_COLORS[0],
                  borderColor: colors.utility.secondaryText + '40'
                }}
              />
              <Input
                type="color"
                value={formData.hexcolor || RESOURCE_COLORS[0]}
                onChange={(e) => handleFieldChange('hexcolor', e.target.value)}
                disabled={createMutation.isPending}
                className="w-12 h-8 p-0 border-0"
              />
            </div>
          ) : (
            <div 
              className="text-sm py-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Auto-assigned
            </div>
          )}
          {errors.hexcolor && (
            <p 
              className="text-xs transition-colors"
              style={{ color: colors.semantic.error }}
            >
              {errors.hexcolor}
            </p>
          )}
        </div>

        {/* Sequence & Actions */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Input
              type="number"
              placeholder="Sequence"
              value={formData.sequence_no?.toString() || ''}
              onChange={(e) => handleFieldChange('sequence_no', 
                e.target.value ? parseInt(e.target.value) : undefined
              )}
              disabled={createMutation.isPending}
              className={cn("flex-1", errors.sequence_no ? "border-red-500" : "")}
              style={{
                borderColor: errors.sequence_no 
                  ? colors.semantic.error 
                  : colors.utility.secondaryText + '40',
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText
              }}
            />
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={createMutation.isPending}
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                  color: '#FFFFFF'
                }}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sequence errors */}
          {errors.sequence_no && (
            <p 
              className="text-xs transition-colors"
              style={{ color: colors.semantic.error }}
            >
              {errors.sequence_no}
            </p>
          )}

          {/* General errors */}
          {errors.general && (
            <p 
              className="text-xs transition-colors"
              style={{ color: colors.semantic.error }}
            >
              {errors.general}
            </p>
          )}
        </div>
      </div>

      {/* Form Instructions */}
      <div 
        className="px-4 pb-3 text-xs transition-colors"
        style={{ color: colors.utility.secondaryText }}
      >
        <div className="flex items-center justify-between">
          <span>
            Creating new {resourceType.name.replace('_', ' ')} resource
          </span>
          <span>
            {behavior.isManualEntry ? 'Manual entry' : 'Contact-based'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddResourceForm;