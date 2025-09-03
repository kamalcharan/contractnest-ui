// src/components/catalog/ServiceForm/BasicInfoStep.tsx
import React, { useState, useCallback, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  AlertTriangle,
  FileText,
  Hash,
  Type,
  Maximize2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Palette
} from 'lucide-react';

// Import types
import { ServiceBasicInfo, ServiceValidationErrors } from '../../../types/catalog/service';
import { generateSKU } from '../../../utils/catalog/validationSchemas';

interface BasicInfoStepProps {
  data: ServiceBasicInfo;
  errors: ServiceValidationErrors;
  isValidating: boolean;
  onChange: (data: ServiceBasicInfo) => void;
}

// Rich Text Editor Component with enhanced features
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  label: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  maxLength = 2000,
  label
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);
  const modalEditorRef = useRef<HTMLDivElement>(null);

  // Available fonts for selection
  const fonts = [
    { value: 'inherit', label: 'Default' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: '"Times New Roman", serif', label: 'Times New Roman' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: '"Courier New", monospace', label: 'Courier New' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
    { value: '"Trebuchet MS", sans-serif', label: 'Trebuchet MS' }
  ];

  // Available colors
  const textColors = [
    { value: 'inherit', label: 'Default', color: colors.utility.primaryText },
    { value: '#000000', label: 'Black', color: '#000000' },
    { value: '#333333', label: 'Dark Gray', color: '#333333' },
    { value: '#666666', label: 'Gray', color: '#666666' },
    { value: '#2563eb', label: 'Blue', color: '#2563eb' },
    { value: '#dc2626', label: 'Red', color: '#dc2626' },
    { value: '#16a34a', label: 'Green', color: '#16a34a' },
    { value: '#ea580c', label: 'Orange', color: '#ea580c' }
  ];

  // Format text with selection
  const formatText = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Handle editor content change
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Open modal editor
  const openModal = useCallback(() => {
    setModalValue(value);
    setIsModalOpen(true);
  }, [value]);

  // Apply modal changes
  const applyModalChanges = useCallback(() => {
    if (modalEditorRef.current) {
      const content = modalEditorRef.current.innerHTML;
      onChange(content);
      setIsModalOpen(false);
    }
  }, [onChange]);

  // Cancel modal changes
  const cancelModal = useCallback(() => {
    setIsModalOpen(false);
    setModalValue(value);
  }, [value]);

  // Calculate character count from HTML
  const getCharacterCount = useCallback((html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent?.length || 0;
  }, []);

  const characterCount = getCharacterCount(value);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label 
            className="block text-sm font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {label} <span style={{ color: colors.semantic.error }}>*</span>
          </label>
          <button
            type="button"
            onClick={openModal}
            className="flex items-center gap-2 px-3 py-1 text-xs border rounded-md hover:opacity-80 transition-colors"
            style={{
              borderColor: colors.brand.primary,
              color: colors.brand.primary,
              backgroundColor: colors.brand.primary + '10'
            }}
          >
            <Maximize2 className="h-3 w-3" />
            Expand
          </button>
        </div>

        {/* Toolbar */}
        <div 
          className="border-b flex items-center gap-1 p-2"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          {/* Font Selection */}
          <select
            onChange={(e) => formatText('fontName', e.target.value)}
            className="text-xs px-2 py-1 border rounded"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.primaryText + '40',
              color: colors.utility.primaryText
            }}
          >
            {fonts.map(font => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          {/* Text Formatting */}
          <button
            type="button"
            onClick={() => formatText('bold')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Bold"
          >
            <Bold className="h-3 w-3" style={{ color: colors.utility.primaryText }} />
          </button>
          <button
            type="button"
            onClick={() => formatText('italic')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Italic"
          >
            <Italic className="h-3 w-3" style={{ color: colors.utility.primaryText }} />
          </button>
          <button
            type="button"
            onClick={() => formatText('underline')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Underline"
          >
            <Underline className="h-3 w-3" style={{ color: colors.utility.primaryText }} />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => formatText('insertUnorderedList')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Bullet List"
          >
            <List className="h-3 w-3" style={{ color: colors.utility.primaryText }} />
          </button>
          <button
            type="button"
            onClick={() => formatText('insertOrderedList')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Numbered List"
          >
            <ListOrdered className="h-3 w-3" style={{ color: colors.utility.primaryText }} />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          {/* Text Color */}
          <select
            onChange={(e) => formatText('foreColor', e.target.value)}
            className="text-xs px-2 py-1 border rounded"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.primaryText + '40',
              color: colors.utility.primaryText
            }}
            title="Text Color"
          >
            {textColors.map(color => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: value }}
          className={`w-full px-4 py-3 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 transition-all overflow-y-auto ${
            error ? 'border-red-500' : ''
          }`}
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: error 
              ? colors.semantic.error 
              : colors.utility.primaryText + '40',
            color: colors.utility.primaryText,
            '--tw-ring-color': colors.brand.primary + '40',
            minHeight: '180px', // 6 lines
            maxHeight: '600px', // 20 lines
            resize: 'none'
          } as React.CSSProperties}
          data-placeholder={placeholder}
        />

        {/* Character Count */}
        <div className="flex justify-between items-center mt-2">
          <div>
            {error && (
              <div className="flex items-center gap-2">
                <AlertTriangle 
                  className="h-4 w-4"
                  style={{ color: colors.semantic.error }}
                />
                <span 
                  className="text-sm"
                  style={{ color: colors.semantic.error }}
                >
                  {error}
                </span>
              </div>
            )}
          </div>
          <span 
            className="text-xs transition-colors"
            style={{ 
              color: characterCount > maxLength 
                ? colors.semantic.error 
                : colors.utility.secondaryText 
            }}
          >
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>

      {/* Modal Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={cancelModal}
          />
          <div 
            className="relative w-full max-w-4xl h-full max-h-[80vh] m-4 rounded-lg shadow-lg flex flex-col"
            style={{ backgroundColor: colors.utility.primaryBackground }}
          >
            {/* Modal Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: colors.utility.primaryText + '20' }}
            >
              <h3 
                className="text-lg font-semibold"
                style={{ color: colors.utility.primaryText }}
              >
                Edit {label}
              </h3>
              <button
                onClick={cancelModal}
                className="p-2 hover:opacity-80 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-4 overflow-hidden">
              <div
                ref={modalEditorRef}
                contentEditable
                dangerouslySetInnerHTML={{ __html: modalValue }}
                className="w-full h-full border rounded-lg p-4 focus:outline-none focus:ring-2 overflow-y-auto"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: colors.utility.primaryText + '40',
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary + '40'
                } as React.CSSProperties}
                onInput={(e) => setModalValue(e.currentTarget.innerHTML)}
              />
            </div>

            {/* Modal Footer */}
            <div 
              className="flex items-center justify-between p-4 border-t"
              style={{ borderColor: colors.utility.primaryText + '20' }}
            >
              <span 
                className="text-sm"
                style={{ color: colors.utility.secondaryText }}
              >
                {getCharacterCount(modalValue)}/{maxLength} characters
              </span>
              <div className="flex gap-3">
                <button
                  onClick={cancelModal}
                  className="px-4 py-2 border rounded-md hover:opacity-80 transition-colors"
                  style={{
                    borderColor: colors.utility.primaryText + '40',
                    color: colors.utility.primaryText
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={applyModalChanges}
                  className="px-4 py-2 rounded-md hover:opacity-80 transition-colors"
                  style={{
                    backgroundColor: colors.brand.primary,
                    color: '#ffffff'
                  }}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  errors,
  isValidating,
  onChange
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Local state for image handling
  const [imagePreview, setImagePreview] = useState<string | null>(data.image_url || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle image upload
  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Update form data
      updateField('image', file);
      
      console.log('Image selected for upload:', file.name);
    }
  }, [updateField]);

  // Handle file input change
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

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
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  // Remove image
  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    updateField('image', null);
    updateField('image_url', '');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [updateField]);

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

            {/* Service Image Upload */}
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
                          onClick={openFileDialog}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <Upload className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          onClick={handleRemoveImage}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
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
                Recommended: PNG, JPG up to 10MB. Will be resized to 800x600px.
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
              <p 
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
            placeholder="Describe your service in detail..."
            error={errors.description}
            maxLength={1000}
            label="Service Description"
          />

          {/* Terms & Conditions */}
          <RichTextEditor
            value={data.terms || ''}
            onChange={(value) => updateField('terms', value)}
            placeholder="Enter any specific terms and conditions for this service..."
            error={errors.terms}
            maxLength={2000}
            label="Terms & Conditions (Optional)"
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