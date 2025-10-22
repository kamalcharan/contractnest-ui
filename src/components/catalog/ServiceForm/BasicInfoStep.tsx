// src/components/catalog/ServiceForm/BasicInfoStep.tsx
// ✅ FIXED: Image buffering - upload on submit, not on select

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  AlertTriangle,
  Hash,
  Type
} from 'lucide-react';

// Import RichTextEditor
import RichTextEditor from '../../ui/RichTextEditor';

// Import types
import { ServiceBasicInfo, ServiceValidationErrors } from '../../../types/catalog/service';
import { generateSKU } from '../../../utils/catalog/validationSchemas';

interface BasicInfoStepProps {
  data: ServiceBasicInfo;
  errors: ServiceValidationErrors;
  isValidating: boolean;
  onChange: (data: ServiceBasicInfo) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  errors,
  isValidating,
  onChange
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Local state for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize preview from existing image URL (for edit mode)
  useEffect(() => {
    if (data.image_url && !data.image) {
      // Edit mode: show existing image
      setImagePreview(data.image_url);
    } else if (data.image) {
      // New file selected: create object URL for preview
      const objectUrl = URL.createObjectURL(data.image);
      setImagePreview(objectUrl);

      // Cleanup object URL on unmount or when image changes
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      // No image
      setImagePreview(null);
    }
  }, [data.image, data.image_url]);

  // Update form data
  const updateField = useCallback((field: keyof ServiceBasicInfo, value: any) => {
    const updatedData = {
      ...data,
      [field]: value
    };
    onChange(updatedData);
  }, [data, onChange]);

  // Auto-generate SKU from service name
  const handleServiceNameChange = useCallback((value: string) => {
    updateField('service_name', value);
    
    // Auto-generate SKU if it's empty
    if (!data.sku && value) {
      const generatedSKU = generateSKU(value);
      updateField('sku', generatedSKU);
    }
  }, [data.sku, updateField]);

  // ✅ NEW: Buffer image file (don't upload yet)
  const handleImageSelect = useCallback((file: File) => {
    console.log('🖼️ Image selected (buffered):', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    if (!file || !file.type.startsWith('image/')) {
      console.error('❌ Invalid file type. Please select an image.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ File too large. Maximum size is 10MB.');
      return;
    }

    // Store File object in form data (will be uploaded on submit)
    updateField('image', file);
    
    console.log('✅ Image buffered successfully. Will upload on form submit.');
  }, [updateField]);

  // Handle file input change
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  }, [handleImageSelect]);

  // Handle drag and drop
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  }, [handleImageSelect]);

  // ✅ NEW: Remove image (clears both buffered file and existing URL)
  const handleRemoveImage = useCallback(() => {
    console.log('🗑️ Removing image');
    
    // Clear preview
    setImagePreview(null);
    
    // If there's an existing image URL, mark it for deletion
    if (data.image_url) {
      // Track the old image for deletion on submit
      updateField('old_image_url', data.image_url);
      if (data.metadata?.image_file_id) {
        updateField('old_image_file_id', data.metadata.image_file_id);
      }
    }
    
    // Clear image data
    updateField('image', null);
    updateField('image_url', '');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [data.image_url, data.metadata, updateField]);

  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-6">
      {/* Card 1: Wizard Header */}
      <div 
        className="border rounded-lg p-6"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <div className="text-center">
          <h2 
            className="text-xl font-semibold mb-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Basic Service Information
          </h2>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Provide the basic details about your service
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 2: Basic Information */}
        <div 
          className="border rounded-lg p-6"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          <div className="space-y-6">
            {/* Service Name */}
            <div>
              <label 
                className="block text-sm font-medium mb-2 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Service Name <span style={{ color: colors.semantic.error }}>*</span>
              </label>
              <div className="relative">
                <Type 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: colors.utility.secondaryText }}
                />
                <input
                  type="text"
                  value={data.service_name}
                  onChange={(e) => handleServiceNameChange(e.target.value)}
                  placeholder="Enter service name (e.g., Website Development)"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.service_name ? 'border-red-500' : ''
                  }`}
                  style={{
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: errors.service_name 
                      ? colors.semantic.error 
                      : colors.utility.primaryText + '40',
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary + '40'
                  } as React.CSSProperties}
                />
              </div>
              {errors.service_name && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle 
                    className="h-4 w-4"
                    style={{ color: colors.semantic.error }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: colors.semantic.error }}
                  >
                    {errors.service_name}
                  </span>
                </div>
              )}
            </div>

            {/* SKU */}
            <div>
              <label 
                className="block text-sm font-medium mb-2 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                SKU (Service Code)
              </label>
              <div className="relative">
                <Hash 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: colors.utility.secondaryText }}
                />
                <input
                  type="text"
                  value={data.sku}
                  onChange={(e) => updateField('sku', e.target.value.toUpperCase())}
                  placeholder="Auto-generated or enter custom SKU"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.sku ? 'border-red-500' : ''
                  }`}
                  style={{
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: errors.sku 
                      ? colors.semantic.error 
                      : colors.utility.primaryText + '40',
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary + '40'
                  } as React.CSSProperties}
                />
              </div>
              {errors.sku && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle 
                    className="h-4 w-4"
                    style={{ color: colors.semantic.error }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: colors.semantic.error }}
                  >
                    {errors.sku}
                  </span>
                </div>
              )}
              <p 
                className="text-xs mt-1 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Unique identifier for this service (auto-generated from name)
              </p>
            </div>

            {/* Service Image Upload - Buffered */}
            <div>
              <label 
                className="block text-sm font-medium mb-2 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Service Image <span className="text-xs">(Optional)</span>
              </label>
              
              <div 
                className={`border-2 border-dashed rounded-lg transition-all ${
                  isDragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                style={{
                  borderColor: imagePreview 
                    ? colors.semantic.success + '60'
                    : colors.utility.primaryText + '40',
                  backgroundColor: isDragging 
                    ? colors.brand.primary + '10'
                    : colors.utility.primaryBackground
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Service preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          type="button"
                          onClick={openFileDialog}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <Upload className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    {/* Show indicator if image is buffered (not uploaded yet) */}
                    {data.image && !data.image_url && (
                      <div 
                        className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: colors.semantic.warning + '20',
                          color: colors.semantic.warning,
                          border: `1px solid ${colors.semantic.warning}`
                        }}
                      >
                        Will upload on save
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="p-6 text-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={openFileDialog}
                  >
                    <ImageIcon 
                      className="h-8 w-8 mx-auto mb-2"
                      style={{ color: colors.utility.secondaryText }}
                    />
                    <p 
                      className="text-sm mb-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Add Service Image
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Drag and drop or click to browse
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <p 
                className="text-xs mt-2 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Recommended: PNG, JPG up to 10MB. Image will be uploaded when you save the service.
              </p>
            </div>
          </div>
        </div>

        {/* Service Preview */}
        <div 
          className="border rounded-lg p-6"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          <h3 
            className="text-lg font-semibold mb-4 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Service Preview
          </h3>
          <div 
            className="border rounded-lg p-4 transition-colors"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            {/* Preview Image */}
            <div className="mb-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Service preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <div 
                  className="w-full h-32 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: colors.utility.secondaryBackground }}
                >
                  <ImageIcon 
                    className="h-8 w-8"
                    style={{ color: colors.utility.secondaryText }}
                  />
                </div>
              )}
            </div>

            {/* Preview Content */}
            <div>
              <h4 
                className="font-semibold text-lg mb-1 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {data.service_name || 'Service Name'}
              </h4>
              {data.sku && (
                <p 
                  className="text-xs mb-2 font-mono transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  SKU: {data.sku}
                </p>
              )}
              <div 
                className="text-sm transition-colors line-clamp-3"
                style={{ color: colors.utility.secondaryText }}
                dangerouslySetInnerHTML={{ 
                  __html: data.description || 'Service description will appear here...' 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Content & Terms */}
      <div 
        className="border rounded-lg p-6"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <div className="space-y-6">
          {/* Service Description */}
          <RichTextEditor
            value={data.description}
            onChange={(value) => updateField('description', value)}
            label="Service Description"
            placeholder="Describe your service in detail..."
            required={true}
            error={errors.description}
            maxLength={5000}
            showCharCount={true}
            allowFullscreen={true}
            toolbarButtons={['bold', 'italic', 'underline', 'bulletList', 'orderedList', 'color', 'table', 'quote', 'link']}
            minHeight={150}
            maxHeight={400}
            trackingContext="service_catalog"
            trackingMetadata={{ field: 'description', serviceId: data.service_name }}
          />

          {/* Terms & Conditions */}
          <RichTextEditor
            value={data.terms || ''}
            onChange={(value) => updateField('terms', value)}
            label="Terms & Conditions (Optional)"
            placeholder="Enter any specific terms and conditions for this service..."
            required={false}
            error={errors.terms}
            maxLength={2000}
            showCharCount={true}
            allowFullscreen={true}
            toolbarButtons={['bold', 'italic', 'underline', 'bulletList', 'orderedList', 'color', 'table', 'quote']}
            minHeight={120}
            maxHeight={250}
            trackingContext="service_catalog"
            trackingMetadata={{ field: 'terms', serviceId: data.service_name }}
          />
        </div>
      </div>

      {/* Validation Summary */}
      {isValidating && Object.keys(errors).length > 0 && (
        <div 
          className="border rounded-lg p-4"
          style={{
            backgroundColor: colors.semantic.error + '10',
            borderColor: colors.semantic.error + '40'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle 
              className="h-5 w-5"
              style={{ color: colors.semantic.error }}
            />
            <h3 
              className="font-medium"
              style={{ color: colors.semantic.error }}
            >
              Please fix the following errors:
            </h3>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li 
                key={field}
                className="text-sm"
                style={{ color: colors.semantic.error }}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BasicInfoStep;