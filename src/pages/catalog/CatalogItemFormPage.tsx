// src/pages/catalog/CatalogItemFormPage.tsx
// ✅ COMPLETE FIX - All edit mode issues resolved

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Loader2, AlertTriangle, ArrowLeft, X, Save, Lock, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

// Import services
import catalogService from '../../services/catalogService';

// Import types and constants  
import type {
  CatalogItemType,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
  CatalogItemDetailed,
  PriceAttributes,
  TaxConfig
} from '../../types/catalogTypes';

import {
  CATALOG_ITEM_TYPES,
  CATALOG_TYPE_LABELS,
  CATALOG_ITEM_STATUS,
  PRICING_TYPES,
  PRICING_TYPE_LABELS,
  PRICING_TYPE_DESCRIPTIONS,
  BILLING_MODES,
  RECOMMENDED_PRICING_BY_TYPE,
  CATALOG_VALIDATION,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  WARNING_MESSAGES,
  LOADING_MESSAGES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  catalogTypeToApi
} from '../../utils/constants/catalog';

// Import new components
import RequiredFieldsProgress, { RequiredField } from '../../components/ui/RequiredFieldsProgress';
import CurrencyPricingRepeater, { CurrencyPrice } from '../../components/catalog/currency/CurrencyPricingRepeater';
import RichTextEditor from '../../components/ui/RichTextEditor';
import NumberInput from '../../components/ui/NumberInput';
import ExamplesPanel from '../../components/catalog/form/shared/ExamplesPanel';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

// Form data interface
interface FormData extends Omit<CreateCatalogItemRequest, 'short_description'> {
  version_reason?: string;
}

interface FormErrors {
  [key: string]: string;
}

const CatalogItemFormPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { type, itemId } = useParams<{ type: string; itemId?: string }>();
  const location = useLocation();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Map route type to catalog type
  const mapRouteToCatalogType = (routeType: string): CatalogItemType => {
    const mapping: Record<string, CatalogItemType> = {
      'services': 'service',
      'equipments': 'equipment',
      'assets': 'asset',
      'spare-parts': 'spare_part'
    };
    return mapping[routeType] || 'service';
  };
  
  // ✅ FIXED: Determine mode and validate catalog type
  const mode = itemId ? 'edit' : 'add';
  const catalogType = mapRouteToCatalogType(type || 'services');
  const isEditMode = mode === 'edit';
  
  // Helper functions
  function getCatalogRoute(catalogTypeParam: CatalogItemType): string {
    const routeMap = {
      [CATALOG_ITEM_TYPES.SERVICE]: '/catalog/services',
      [CATALOG_ITEM_TYPES.EQUIPMENT]: '/catalog/equipments', 
      [CATALOG_ITEM_TYPES.ASSET]: '/catalog/assets',
      [CATALOG_ITEM_TYPES.SPARE_PART]: '/catalog/spare-parts'
    };
    return routeMap[catalogTypeParam] || '/catalog/services';
  }

  function getCatalogInfo() {
    const typeKey = catalogType as keyof typeof CATALOG_TYPE_LABELS;
    return {
      singular: CATALOG_TYPE_LABELS[typeKey]?.slice(0, -1) || 'Item',
      plural: CATALOG_TYPE_LABELS[typeKey] || 'Items'
    };
  }

  const catalogInfo = getCatalogInfo();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    type: catalogType,
    name: '',
    description_content: '',
    description_format: 'markdown',
    terms_content: '',
    terms_format: 'markdown',
    price_attributes: {
      type: RECOMMENDED_PRICING_BY_TYPE[catalogType]?.[0] || PRICING_TYPES.FIXED,
      base_amount: 0,
      currency: 'INR',
      billing_mode: BILLING_MODES.MANUAL
    },
    tax_config: {
      use_tenant_default: true,
      specific_tax_rates: []
    },
    status: CATALOG_ITEM_STATUS.ACTIVE,
    is_live: true,
    metadata: {},
    specifications: {},
    variant_attributes: {}
  });

  const [currencies, setCurrencies] = useState<CurrencyPrice[]>([
    { 
      id: 'inr-default',
      currency: 'INR', 
      price: 0, 
      taxIncluded: false, 
      isBaseCurrency: true 
    }
  ]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [existingItem, setExistingItem] = useState<CatalogItemDetailed | null>(null);

  // ✅ FIXED: Rich text editor state - properly populate existing data
  const [editorContent, setEditorContent] = useState({
    description: '',
    service_terms: ''
  });

  // ✅ FIXED: Track if data has been loaded for edit mode
  const [dataLoaded, setDataLoaded] = useState(!isEditMode);

  // Refs
  const formRef = useRef<HTMLDivElement>(null);

  // ✅ FIXED: Required fields for progress tracking
  const requiredFields: RequiredField[] = [
    {
      id: 'name',
      label: 'Name',
      isRequired: true,
      isCompleted: formData.name.trim().length >= CATALOG_VALIDATION.LIMITS.NAME.MIN_LENGTH,
      hasError: !!errors.name,
      errorMessage: errors.name
    },
    {
      id: 'description',
      label: 'Description',
      isRequired: true,
      isCompleted: editorContent.description.trim().length > 0,
      hasError: !!errors.description,
      errorMessage: errors.description
    },
    {
      id: 'currencies',
      label: 'Base Currency',
      isRequired: true,
      isCompleted: currencies.length > 0 && currencies.some(c => c.isBaseCurrency),
      hasError: !!errors.currencies || !!errors.baseCurrency,
      errorMessage: errors.currencies || errors.baseCurrency
    }
  ];

  // Validate catalog type on mount
  useEffect(() => {
    if (!type) {
      toast.error(ERROR_MESSAGES.INVALID_DATA);
      navigate('/catalog/services', { replace: true });
      return;
    }
    
    if (!Object.values(CATALOG_ITEM_TYPES).includes(catalogType)) {
      toast.error(ERROR_MESSAGES.INVALID_DATA);
      navigate('/catalog/services', { replace: true });
      return;
    }
  }, [type, catalogType, navigate]);

  // ✅ FIXED: Load existing item for edit mode
  useEffect(() => {
    if (isEditMode && itemId) {
      loadExistingItem();
    }
  }, [isEditMode, itemId]);

  const loadExistingItem = async () => {
    try {
      setIsLoading(true);
      
      console.log('🔄 Loading existing item with ID:', itemId);
      
      // ✅ FIXED: Use the correct API method
      const response = await catalogService.getCatalogItemById(itemId!);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load item');
      }
      
      const item = response.data;
      setExistingItem(item);
      
      console.log('✅ Loaded existing item:', item);
      
      // ✅ FIXED: Populate form with existing data properly
      setFormData({
        type: item.type,
        name: item.name,
        description_content: item.description_content || '',
        description_format: item.description_format || 'markdown',
        terms_content: item.terms_content || '',
        terms_format: item.terms_format || 'markdown',
        price_attributes: item.price_attributes || {
          type: PRICING_TYPES.FIXED,
          base_amount: 0,
          currency: 'INR',
          billing_mode: BILLING_MODES.MANUAL
        },
        tax_config: item.tax_config || {
          use_tenant_default: true,
          specific_tax_rates: []
        },
        status: item.status,
        is_live: item.is_live,
        metadata: item.metadata || {},
        specifications: item.specifications || {},
        variant_attributes: item.variant_attributes || {}
      });

      // ✅ FIXED: Set rich text editor content with existing data
      setEditorContent({
        description: item.description_content || '',
        service_terms: item.terms_content || ''
      });

      // ✅ FIXED: Load currencies from pricing list
      if (item.pricing_list && item.pricing_list.length > 0) {
        const loadedCurrencies = item.pricing_list.map((p, index) => ({
          id: `${p.currency}-${index}`,
          currency: p.currency,
          price: p.price,
          taxIncluded: p.tax_included || false,
          isBaseCurrency: p.is_base_currency || false
        }));
        setCurrencies(loadedCurrencies);
        console.log('✅ Loaded currencies:', loadedCurrencies);
      }

      // ✅ FIXED: Mark data as loaded
      setDataLoaded(true);
      console.log('✅ Edit mode data fully loaded');

    } catch (error) {
      console.error('❌ Error loading existing item:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.CATALOG_LOAD_FAILED;
      toast.error(errorMessage);
      navigate(getCatalogRoute(catalogType), { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: Track form changes properly
  useEffect(() => {
    if (!dataLoaded) return; // Don't track changes until data is loaded
    
    const hasChanges = isEditMode ? checkForChanges() : (
      formData.name.trim() !== '' || 
      editorContent.description.trim() !== '' ||
      editorContent.service_terms.trim() !== '' ||
      currencies.length > 1 ||
      currencies[0]?.price !== 0
    );
    setHasUnsavedChanges(hasChanges);
  }, [formData, editorContent, currencies, isEditMode, dataLoaded]);

  const checkForChanges = (): boolean => {
    if (!existingItem) return false;
    
    return (
      formData.name !== existingItem.name ||
      editorContent.description !== (existingItem.description_content || '') ||
      editorContent.service_terms !== (existingItem.terms_content || '') ||
      formData.status !== existingItem.status ||
      JSON.stringify(currencies) !== JSON.stringify(existingItem.pricing_list?.map((p, index) => ({
        id: `${p.currency}-${index}`,
        currency: p.currency,
        price: p.price,
        taxIncluded: p.tax_included,
        isBaseCurrency: p.is_base_currency
      })))
    );
  };

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = CATALOG_VALIDATION.MESSAGES.NAME_REQUIRED;
    } else if (formData.name.length < CATALOG_VALIDATION.LIMITS.NAME.MIN_LENGTH) {
      newErrors.name = CATALOG_VALIDATION.MESSAGES.NAME_TOO_SHORT;
    } else if (formData.name.length > CATALOG_VALIDATION.LIMITS.NAME.MAX_LENGTH) {
      newErrors.name = CATALOG_VALIDATION.MESSAGES.NAME_TOO_LONG;
    }
    
    if (!editorContent.description.trim()) {
      newErrors.description = CATALOG_VALIDATION.MESSAGES.DESCRIPTION_REQUIRED;
    }
    
    // Currency validation
    const baseCurrencyCount = currencies.filter(c => c.isBaseCurrency).length;
    if (baseCurrencyCount === 0) {
      newErrors.baseCurrency = CATALOG_VALIDATION.MESSAGES.BASE_CURRENCY_REQUIRED;
    } else if (baseCurrencyCount > 1) {
      newErrors.baseCurrency = 'Only one base currency is allowed';
    }
    
    setErrors(newErrors);
    
    // Scroll to first error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[data-field="${firstErrorField}"]`) as HTMLElement;
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // ✅ FIXED: Form handlers with proper edit mode restrictions
  const handleNameChange = (value: string) => {
    // ✅ FIXED: Prevent name changes in edit mode
    if (isEditMode) {
      toast.warning('Service name cannot be modified in edit mode', { duration: 3000 });
      return;
    }
    setFormData({ ...formData, name: value });
    clearFieldError('name');
  };

  const handleDescriptionChange = (content: string) => {
    setEditorContent({ ...editorContent, description: content });
    clearFieldError('description');
  };

  const handleServiceTermsChange = (content: string) => {
    setEditorContent({ ...editorContent, service_terms: content });
  };

  const handleCurrenciesChange = (newCurrencies: CurrencyPrice[]) => {
    setCurrencies(newCurrencies);
    clearFieldError('currencies');
    clearFieldError('baseCurrency');
    clearFieldError('currency');
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      const errorCount = Object.keys(errors).length;
      toast.error(`Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        description_content: editorContent.description,
        terms_content: editorContent.service_terms,
        price_attributes: {
          ...formData.price_attributes,
          base_amount: currencies.find(c => c.isBaseCurrency)?.price || 0,
          currency: currencies.find(c => c.isBaseCurrency)?.currency || 'INR'
        },
        currencies: !isEditMode && currencies.length > 0 ? currencies : undefined
      } as any;

      toast.loading(isEditMode ? 'Updating item...' : 'Creating item...', { 
        id: 'catalog-submit',
        duration: 0 
      });

      let result: CatalogItemDetailed;
      
      if (isEditMode) {
        // ✅ FIXED: Add version reason for edits
        const updateData = {
          ...dataToSubmit,
          version_reason: formData.version_reason || 'Updated via form'
        };
        
        result = await catalogService.updateCatalogItem(itemId!, updateData as UpdateCatalogItemRequest);
        
        // Update pricing separately for edits
        if (currencies.length > 0) {
          try {
            await catalogService.updateMultiCurrencyPricing(result.id, {
              price_type: formData.price_attributes.type,
              currencies: currencies.map(c => ({
                currency: c.currency,
                price: c.price,
                is_base_currency: c.isBaseCurrency,
                tax_included: c.taxIncluded,
                tax_rate_id: null
              }))
            });
          } catch (pricingError) {
            console.warn('Pricing update failed during edit:', pricingError);
            toast.warning('Item updated but pricing update failed. You can update pricing later.', {
              duration: 4000
            });
          }
        }
      } else {
        result = await catalogService.createCatalogItem(dataToSubmit);
      }

      const successMessage = isEditMode ? 'Item updated successfully!' : 'Item created successfully!';
      
      toast.success(successMessage, { 
        id: 'catalog-submit', 
        duration: 2000 
      });

      setHasUnsavedChanges(false);
      
      // Navigate back to list with refresh signal
      navigate(getCatalogRoute(catalogType), { 
        state: { 
          message: successMessage,
          itemId: result.id,
          shouldRefresh: true
        } 
      });
      
    } catch (error) {
      console.error('Catalog operation failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
        toast.error('An item with this name already exists. Please choose a different name.', {
          id: 'catalog-submit',
          duration: 4000
        });
      } else if (errorMessage.includes('validation')) {
        toast.error('Please check your input and try again.', {
          id: 'catalog-submit',
          duration: 3000
        });
      } else {
        toast.error(
          isEditMode ? 'Failed to update item. Please try again.' : 'Failed to create item. Please try again.',
          { id: 'catalog-submit', duration: 3000 }
        );
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      navigate(getCatalogRoute(catalogType));
    }
  };

  const handleConfirmExit = () => {
    setHasUnsavedChanges(false);
    navigate(getCatalogRoute(catalogType));
  };

  // Calculate form validation state
  const isFormValid = Object.keys(errors).length === 0 && 
    requiredFields.filter(f => f.isRequired).every(f => f.isCompleted);

  // ✅ FIXED: Loading state - show different messages for create vs edit
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center space-y-4">
          <Loader2 
            className="h-8 w-8 animate-spin mx-auto"
            style={{ color: colors.brand.primary }}
          />
          <div className="space-y-2">
            <p 
              className="text-lg font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {isEditMode ? 'Loading item details...' : LOADING_MESSAGES.CATALOG_ITEM}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {/* ✅ FIXED: Sticky Top Action Bar - Shows edit mode properly */}
      <div 
        className="sticky top-0 z-40 border-b transition-colors backdrop-blur-sm"
        style={{
          backgroundColor: colors.utility.secondaryBackground + 'F0',
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* ✅ FIXED: Breadcrumb - Shows correct edit mode */}
          <button 
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex items-center mb-3 transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            style={{ color: colors.utility.secondaryText }}
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back to {catalogInfo.plural}
          </button>
          
          {/* ✅ FIXED: Header with Actions - Shows edit mode properly */}
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold flex items-center gap-3 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                <span className="text-2xl">
                  {catalogType === 'service' ? '🛎️' : 
                   catalogType === 'equipment' ? '⚙️' : 
                   catalogType === 'spare_part' ? '🔧' : '🏢'}
                </span>
                {/* ✅ FIXED: Title shows edit vs add correctly */}
                {isEditMode ? (
                  <>
                    <Edit3 className="w-6 h-6" style={{ color: colors.brand.primary }} />
                    Edit {catalogInfo.singular}
                  </>
                ) : (
                  `Add New ${catalogInfo.singular}`
                )}
              </h1>
              
              {/* ✅ FIXED: Show item name in edit mode */}
              {isEditMode && existingItem && (
                <p 
                  className="text-lg mt-1 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  "{existingItem.name}"
                </p>
              )}
              
              <div className="flex items-center gap-4 mt-2">
                {/* Required Fields Progress */}
                <RequiredFieldsProgress 
                  fields={requiredFields}
                  compact={true}
                  showPercentage={true}
                />
                
                {/* Unsaved changes indicator */}
                {hasUnsavedChanges && (
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-colors"
                    style={{
                      backgroundColor: `${colors.semantic.warning}20`,
                      color: colors.semantic.warning
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: colors.semantic.warning }}
                    />
                    {WARNING_MESSAGES.UNSAVED_CHANGES}
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                style={{
                  color: colors.brand.primary,
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: colors.brand.primary
                }}
              >
                <X className="w-4 h-4 mr-2 inline" />
                {FORM_LABELS.CANCEL}
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="px-6 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:opacity-90 text-white"
                style={{
                  backgroundColor: isFormValid ? colors.brand.primary : colors.utility.secondaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditMode ? LOADING_MESSAGES.UPDATING : LOADING_MESSAGES.CREATING}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {/* ✅ FIXED: Button text shows edit vs create */}
                    {isEditMode ? `${FORM_LABELS.UPDATE} ${catalogInfo.singular}` : `${FORM_LABELS.CREATE} ${catalogInfo.singular}`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          
          {/* ✅ FIXED: Row 1 - Name (30%) + Examples (70%) */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* ✅ FIXED: Name Field - Read-only in edit mode */}
            <div className="lg:col-span-3">
              <div 
                className="rounded-xl shadow-sm border transition-colors"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: colors.utility.secondaryText + '20'
                }}
              >
                <div className="p-6">
                  <h2 
                    className="text-lg font-semibold mb-6 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Basic Information
                  </h2>
                  
                  {/* ✅ FIXED: Name Field - Read-only in edit mode */}
                  <div data-field="name">
                    <label 
                      className="block text-sm font-medium mb-2 transition-colors flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {FORM_LABELS.NAME}
                      <span style={{ color: colors.semantic.error }}>*</span>
                      {/* ✅ FIXED: Show lock icon in edit mode */}
                      {isEditMode && (
                        <Lock 
                          className="w-4 h-4" 
                          style={{ color: colors.utility.secondaryText }}
                          title="Name cannot be changed in edit mode"
                        />
                      )}
                    </label>
                    
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      disabled={isSubmitting || isEditMode} // ✅ FIXED: Disabled in edit mode
                      className="w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderColor: errors.name 
                          ? colors.semantic.error
                          : colors.utility.secondaryText + '40',
                        backgroundColor: isEditMode 
                          ? colors.utility.secondaryText + '10' // ✅ FIXED: Different bg for read-only
                          : colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                      placeholder={isEditMode ? 'Name cannot be changed' : FORM_PLACEHOLDERS.NAME}
                      maxLength={CATALOG_VALIDATION.LIMITS.NAME.MAX_LENGTH}
                      readOnly={isEditMode} // ✅ FIXED: Read-only in edit mode
                    />
                    
                    {/* ✅ FIXED: Show read-only message in edit mode */}
                    {isEditMode && (
                      <div 
                        className="flex items-center gap-2 mt-2 text-sm"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        <Lock className="h-4 w-4 flex-shrink-0" />
                        Service name cannot be modified in edit mode
                      </div>
                    )}
                    
                    {errors.name && (
                      <div 
                        className="flex items-center gap-2 mt-2 text-sm"
                        style={{ color: colors.semantic.error }}
                      >
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        {errors.name}
                      </div>
                    )}
                    
                    {!isEditMode && (
                      <div 
                        className="mt-1 text-xs transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {formData.name.length}/{CATALOG_VALIDATION.LIMITS.NAME.MAX_LENGTH} characters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ FIXED: Examples Panel - Hidden in edit mode */}
            {!isEditMode && (
              <div className="lg:col-span-7">
                <div 
                  className="rounded-xl shadow-sm border transition-colors"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: colors.utility.secondaryText + '20'
                  }}
                >
                  <div className="p-6">
                    <ExamplesPanel
                      catalogType={catalogType}
                      onExampleClick={handleNameChange}
                      currentValue={formData.name}
                      trackingContext={`catalog_${mode}_form`}
                      className="mb-0"
                      layout="horizontal"
                      compact={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Row 2 - Content & Documentation (50%) + Pricing (50%) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Content & Documentation Card - 50% */}
            <div 
              className="rounded-xl shadow-sm border transition-colors"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div className="p-6">
                <h2 
                  className="text-lg font-semibold mb-6 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Content & Documentation
                </h2>
                
                <div className="space-y-6">
                  {/* ✅ FIXED: Description Editor - Shows existing content */}
                  <div data-field="description">
                    <RichTextEditor
                      value={editorContent.description} // ✅ FIXED: Uses loaded content
                      onChange={handleDescriptionChange}
                      label={`${catalogInfo.singular} ${FORM_LABELS.DESCRIPTION}`}
                      placeholder={FORM_PLACEHOLDERS.DESCRIPTION}
                      required
                      error={errors.description}
                      disabled={isSubmitting}
                      minHeight={187}
                      maxHeight={500}
                      maxLength={CATALOG_VALIDATION.LIMITS.DESCRIPTION.MAX_LENGTH}
                      showCharCount
                      allowFullscreen
                      toolbarButtons={[
                        'bold', 'italic', 'underline', 'divider',
                        'bulletList', 'orderedList', 'quote', 'divider',
                        'link', 'divider',
                        'alignLeft', 'alignCenter', 'alignRight'
                      ]}
                      onFocus={() => clearFieldError('description')}
                    />
                  </div>

                  {/* ✅ FIXED: Service Terms Editor - Shows existing content */}
                  <div>
                    <RichTextEditor
                      value={editorContent.service_terms} // ✅ FIXED: Uses loaded content
                      onChange={handleServiceTermsChange}
                      label={FORM_LABELS.SERVICE_TERMS}
                      placeholder={FORM_PLACEHOLDERS.SERVICE_TERMS}
                      disabled={isSubmitting}
                      minHeight={150}
                      maxHeight={437}
                      maxLength={CATALOG_VALIDATION.LIMITS.SERVICE_TERMS.MAX_LENGTH}
                      showCharCount
                      allowFullscreen
                      toolbarButtons={[
                        'bold', 'italic', 'divider',
                        'bulletList', 'orderedList', 'divider',
                        'link', 'divider',
                        'alignLeft', 'alignCenter', 'alignRight'
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing Configuration - 50% */}
            <div className="space-y-6">
              {/* Pricing Type Card */}
              <div 
                className="rounded-xl shadow-sm border transition-colors"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: colors.utility.secondaryText + '20'
                }}
              >
                <div className="p-6">
                  <h3 
                    className="text-lg font-semibold mb-4 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Pricing configuration
                  </h3>
                  
                  {/* Pricing Type Selection */}
                  <div className="space-y-4">
                    <label 
                      className="block text-sm font-medium transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Pricing Type
                      <span style={{ color: colors.semantic.error }}>*</span>
                    </label>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {RECOMMENDED_PRICING_BY_TYPE[catalogType].map((pricingType) => (
                        <button
                          key={pricingType}
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            price_attributes: { 
                              ...formData.price_attributes, 
                              type: pricingType 
                            } 
                          })}
                          disabled={isSubmitting}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left hover:opacity-80 disabled:opacity-50`}
                          style={{
                            borderColor: formData.price_attributes.type === pricingType
                              ? colors.brand.primary
                              : colors.utility.secondaryText + '40',
                            backgroundColor: formData.price_attributes.type === pricingType
                              ? `${colors.brand.primary}10`
                              : colors.utility.secondaryBackground
                          }}
                        >
                          <div 
                            className="font-medium text-sm transition-colors"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {PRICING_TYPE_LABELS[pricingType]}
                          </div>
                          <div 
                            className="text-xs mt-1 transition-colors"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            {PRICING_TYPE_DESCRIPTIONS[pricingType]}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Currency Pricing Card */}
              <div 
                className="rounded-xl shadow-sm border transition-colors"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: colors.utility.secondaryText + '20'
                }}
              >
                <div className="p-6">
                  <h3 
                    className="text-lg font-semibold mb-4 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Currency pricing
                  </h3>
                  
                  {/* ✅ FIXED: Currency pricing shows loaded data */}
                  <CurrencyPricingRepeater
                    currencies={currencies} // ✅ FIXED: Shows loaded currencies
                    onChange={handleCurrenciesChange}
                    errors={{}}
                    onClearError={clearFieldError}
                    disabled={isSubmitting}
                    label=""
                    required={true}
                    backgroundColor={colors.utility.primaryBackground}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={handleConfirmExit}
        title={WARNING_MESSAGES.UNSAVED_CHANGES}
        description={WARNING_MESSAGES.LEAVING_PAGE}
        confirmText="Leave Page"
        type="warning"
        icon={<AlertTriangle className="h-6 w-6" />}
      />
    </div>
  );
};

export default CatalogItemFormPage;