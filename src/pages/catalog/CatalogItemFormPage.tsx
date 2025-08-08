// src/pages/catalog/CatalogItemFormPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Clock, 
  Plus, 
  Trash2,
  Star,
  DollarSign,
  FileText,
  Settings,
  History,
  Bold,
  Italic,
  List,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Package,
  Wrench,
  Box,
  AlertTriangle,
  Loader2,
  Info,
  HelpCircle,
  Eye,
  CheckCircle
} from 'lucide-react';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

// Import services and hooks
import catalogService from '../../services/catalogService';
import { useCatalogList } from '../../hooks/useCatalogItems';

// Import types
import type {
  CatalogItemType,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
  CatalogItemDetailed,
  PricingType,
  SupportedCurrency
} from '../../types/catalogTypes';

// Import constants
import {
  CATALOG_ITEM_TYPES,
  CATALOG_TYPE_LABELS,
  CATALOG_TYPE_COLORS,
  CATALOG_TYPE_ICONS,
  CATALOG_ITEM_STATUS,
  CATALOG_ITEM_STATUS_LABELS,
  PRICING_TYPES,
  PRICING_TYPE_LABELS,
  BILLING_MODES,
  BILLING_MODE_LABELS,
  SUPPORTED_CURRENCIES,
  CURRENCY_SYMBOLS,
  RECOMMENDED_PRICING_BY_TYPE,
  CATALOG_VALIDATION_LIMITS,
  CATALOG_ERROR_MESSAGES,
  isValidCurrency,
  isValidPrice,
  isValidPricingType
} from '../../utils/constants/catalog';

// Form data interface
interface FormData extends CreateCatalogItemRequest {
  version_reason?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface CurrencyFormData {
  currency: SupportedCurrency;
  price: number;
  is_base_currency: boolean;
  tax_included: boolean;
  tax_rate_id?: string | null;
}

const CatalogItemFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { catalogType, itemId } = useParams<{ catalogType: string; itemId?: string }>();
  const location = useLocation();
  const { isDarkMode, currentTheme } = useTheme();
  const { toast } = useToast();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Determine mode and validate catalog type
  const mode = itemId ? 'edit' : 'add';
  const validCatalogType = catalogType as CatalogItemType;
  
  // Helper functions
  function getExamplesForType(type: CatalogItemType): string[] {
    switch (type) {
      case CATALOG_ITEM_TYPES.SERVICE:
        return ['IT Support Services', 'Consulting & Advisory', 'Maintenance Contracts', 'Training Programs', 'Cloud Solutions'];
      case CATALOG_ITEM_TYPES.EQUIPMENT:
        return ['Construction Tools', 'Medical Devices', 'Audio/Visual Equipment', 'Industrial Machinery', 'Laboratory Equipment'];
      case CATALOG_ITEM_TYPES.SPARE_PART:
        return ['Engine Components', 'Replacement Parts', 'Electronic Components', 'Wear Parts', 'Consumables'];
      case CATALOG_ITEM_TYPES.ASSET:
        return ['Vehicles & Fleet', 'Real Estate Properties', 'Manufacturing Equipment', 'IT Infrastructure', 'Office Equipment'];
      default:
        return [];
    }
  }

  function getCatalogRoute(type: CatalogItemType): string {
    const routeMap = {
      [CATALOG_ITEM_TYPES.SERVICE]: '/catalog/services',
      [CATALOG_ITEM_TYPES.EQUIPMENT]: '/catalog/equipments', 
      [CATALOG_ITEM_TYPES.ASSET]: '/catalog/assets',
      [CATALOG_ITEM_TYPES.SPARE_PART]: '/catalog/spare-parts'
    };
    return routeMap[type] || '/catalog/services';
  }

  function getCatalogInfo() {
    const typeKey = validCatalogType as keyof typeof CATALOG_TYPE_LABELS;
    return {
      singular: CATALOG_TYPE_LABELS[typeKey]?.slice(0, -1) || 'Item',
      plural: CATALOG_TYPE_LABELS[typeKey] || 'Items',
      icon: CATALOG_TYPE_ICONS[typeKey] || Package,
      color: CATALOG_TYPE_COLORS[typeKey] || 'gray',
      examples: getExamplesForType(validCatalogType)
    };
  }

  const catalogInfo = getCatalogInfo();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    type: validCatalogType,
    name: '',
    short_description: '',
    description_content: '',
    description_format: 'markdown',
    terms_content: '',
    terms_format: 'markdown',
    price_attributes: {
      type: RECOMMENDED_PRICING_BY_TYPE[validCatalogType]?.[0] || PRICING_TYPES.FIXED,
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

  const [currencies, setCurrencies] = useState<CurrencyFormData[]>([
    { currency: 'INR', price: 0, is_base_currency: true, tax_included: false }
  ]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [existingItem, setExistingItem] = useState<CatalogItemDetailed | null>(null);

  // Rich text editor state
  const [editorContent, setEditorContent] = useState({
    description: '',
    service_terms: ''
  });

  // Refs
  const formRef = useRef<HTMLDivElement>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout>();

  // Validate catalog type on mount
  useEffect(() => {
    if (!catalogType || !Object.values(CATALOG_ITEM_TYPES).includes(validCatalogType)) {
      toast({
        variant: "destructive",
        title: "Invalid catalog type",
        description: "Redirecting to services catalog..."
      });
      navigate('/catalog/services', { replace: true });
      return;
    }
  }, [catalogType, validCatalogType, navigate, toast]);

  // Load existing item for edit mode
  useEffect(() => {
    if (mode === 'edit' && itemId) {
      loadExistingItem();
    }
  }, [mode, itemId]);

  const loadExistingItem = async () => {
    try {
      setIsLoading(true);
      const item = await catalogService.getCatalogItem(itemId!);
      setExistingItem(item);
      
      // Populate form with existing data
      setFormData({
        type: item.type,
        name: item.name,
        short_description: item.short_description || '',
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

      setEditorContent({
        description: item.description_content || '',
        service_terms: item.terms_content || ''
      });

      // Load currencies from pricing list
      if (item.pricing_list && item.pricing_list.length > 0) {
        setCurrencies(item.pricing_list.map(p => ({
          currency: p.currency as SupportedCurrency,
          price: p.price,
          is_base_currency: p.is_base_currency || false,
          tax_included: p.tax_included || false,
          tax_rate_id: p.tax_rate_id
        })));
      }

      analyticsService.trackEvent('catalog_item_edit_loaded', {
        catalog_type: item.type,
        item_id: item.id
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load catalog item';
      captureException(error, {
        tags: { component: 'CatalogItemFormPage', action: 'loadExistingItem' },
        extra: { itemId, catalogType }
      });
      
      toast({
        variant: "destructive",
        title: "Error loading item",
        description: errorMessage
      });
      
      navigate(getCatalogRoute(validCatalogType), { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Track form changes for unsaved changes detection
  useEffect(() => {
    const hasChanges = mode === 'edit' ? checkForChanges() : (
      formData.name.trim() !== '' || 
      editorContent.description.trim() !== '' ||
      editorContent.service_terms.trim() !== ''
    );
    setHasUnsavedChanges(hasChanges);
  }, [formData, editorContent, currencies, mode]);

  const checkForChanges = (): boolean => {
    if (!existingItem) return false;
    
    return (
      formData.name !== existingItem.name ||
      formData.short_description !== (existingItem.short_description || '') ||
      editorContent.description !== (existingItem.description_content || '') ||
      editorContent.service_terms !== (existingItem.terms_content || '') ||
      formData.status !== existingItem.status ||
      JSON.stringify(currencies) !== JSON.stringify(existingItem.pricing_list?.map(p => ({
        currency: p.currency,
        price: p.price,
        is_base_currency: p.is_base_currency,
        tax_included: p.tax_included
      })))
    );
  };

  // Prevent navigation if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Rich Text Editor Component
  const RichTextEditor: React.FC<{
    value: string;
    onChange: (content: string) => void;
    placeholder: string;
    field: string;
    label: string;
    required?: boolean;
  }> = ({ value, onChange, placeholder, field, label, required = false }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const formatText = (command: string) => {
      document.execCommand(command, false, null);
      editorRef.current?.focus();
    };

    const insertLink = () => {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const content = e.currentTarget.innerHTML;
      onChange(content);
      clearFieldError(field);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    };

    const handleFocus = () => {
      setIsFocused(true);
      analyticsService.trackEvent('catalog_form_field_focus', {
        field_name: field,
        catalog_type: validCatalogType
      });
    };

    return (
      <div className="space-y-2">
        <label 
          className="block text-sm font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          {label} {required && <span style={{ color: colors.semantic.error }}>*</span>}
        </label>
        <div 
          className="border rounded-lg overflow-hidden transition-colors"
          style={{
            borderColor: errors[field] 
              ? colors.semantic.error
              : isFocused 
                ? colors.brand.primary
                : colors.utility.secondaryText + '40'
          }}
        >
          {/* Toolbar */}
          <div 
            className="flex items-center gap-1 p-2 border-b transition-colors"
            style={{
              borderColor: colors.utility.secondaryText + '20',
              backgroundColor: `${colors.utility.secondaryText}10`
            }}
          >
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="p-1.5 rounded transition-colors hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="p-1.5 rounded transition-colors hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <div 
              className="w-px h-6 mx-1"
              style={{ backgroundColor: colors.utility.secondaryText + '40' }}
            />
            <button
              type="button"
              onClick={() => formatText('insertUnorderedList')}
              className="p-1.5 rounded transition-colors hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={insertLink}
              className="p-1.5 rounded transition-colors hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </button>
            <div 
              className="w-px h-6 mx-1"
              style={{ backgroundColor: colors.utility.secondaryText + '40' }}
            />
            <button
              type="button"
              onClick={() => formatText('justifyLeft')}
              className="p-1.5 rounded transition-colors hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('justifyCenter')}
              className="p-1.5 rounded transition-colors hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('justifyRight')}
              className="p-1.5 rounded transition-colors hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Editor */}
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onInput={handleInput}
              onPaste={handlePaste}
              className="min-h-[120px] p-3 focus:outline-none prose prose-sm max-w-none transition-colors"
              style={{ 
                wordWrap: 'break-word',
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText
              }}
              suppressContentEditableWarning={true}
              dangerouslySetInnerHTML={{ __html: value }}
              role="textbox"
              aria-label={label}
              aria-multiline="true"
            />
            
            {/* Placeholder */}
            {!value && !isFocused && (
              <div 
                className="absolute top-3 left-3 pointer-events-none select-none transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {placeholder}
              </div>
            )}
          </div>
        </div>
        
        {errors[field] && (
          <div 
            className="flex items-center gap-2 text-sm"
            style={{ color: colors.semantic.error }}
          >
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {errors[field]}
          </div>
        )}
      </div>
    );
  };

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = CATALOG_ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.name.length < CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH) {
      newErrors.name = CATALOG_ERROR_MESSAGES.NAME_TOO_SHORT;
    } else if (formData.name.length > CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH) {
      newErrors.name = CATALOG_ERROR_MESSAGES.NAME_TOO_LONG;
    }
    
    if (!editorContent.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.short_description && formData.short_description.length > CATALOG_VALIDATION_LIMITS.SHORT_DESCRIPTION.MAX_LENGTH) {
      newErrors.short_description = 'Short description is too long';
    }
    
    // Currency validation
    const baseCurrencyCount = currencies.filter(c => c.is_base_currency).length;
    if (baseCurrencyCount === 0) {
      newErrors.currencies = 'Please select a base currency';
    } else if (baseCurrencyCount > 1) {
      newErrors.currencies = 'Only one base currency is allowed';
    }
    
    // Validate each currency
    currencies.forEach((curr, index) => {
      if (!isValidPrice(curr.price)) {
        newErrors[`price_${index}`] = CATALOG_ERROR_MESSAGES.INVALID_PRICE;
      }
      if (!isValidCurrency(curr.currency)) {
        newErrors[`currency_${index}`] = 'Invalid currency';
      }
    });
    
    // Version reason required for edits
    if (mode === 'edit' && !formData.version_reason?.trim()) {
      newErrors.version_reason = CATALOG_ERROR_MESSAGES.VERSION_REASON_REQUIRED;
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

  // Form handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    clearFieldError('name');
    
    analyticsService.trackEvent('catalog_form_name_changed', {
      catalog_type: validCatalogType,
      name_length: e.target.value.length
    });
  };

  const handleShortDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, short_description: e.target.value });
    clearFieldError('short_description');
  };

  const handleCurrencyChange = (index: number, field: keyof CurrencyFormData, value: any) => {
    setCurrencies(prev => prev.map((curr, i) => 
      i === index ? { ...curr, [field]: value } : curr
    ));
    
    clearFieldError(`${field}_${index}`);
    clearFieldError('currencies');
  };

  const handleSetBaseCurrency = (index: number) => {
    setCurrencies(prev => prev.map((curr, i) => ({
      ...curr,
      is_base_currency: i === index
    })));
    clearFieldError('currencies');
  };

  const handleAddCurrency = () => {
    const usedCurrencies = currencies.map(c => c.currency);
    const availableCurrencies = SUPPORTED_CURRENCIES.filter(c => !usedCurrencies.includes(c));
    
    if (availableCurrencies.length === 0) {
      toast({
        variant: "destructive",
        title: "No more currencies available",
        description: "All supported currencies have been added"
      });
      return;
    }

    setCurrencies(prev => [...prev, {
      currency: availableCurrencies[0],
      price: 0,
      is_base_currency: false,
      tax_included: false
    }]);

    analyticsService.trackEvent('catalog_form_currency_added', {
      catalog_type: validCatalogType,
      currency: availableCurrencies[0],
      total_currencies: currencies.length + 1
    });
  };

  const handleRemoveCurrency = (index: number) => {
    const currency = currencies[index];
    
    if (currencies.length === 1) {
      toast({
        variant: "destructive",
        title: "Cannot remove currency",
        description: "At least one currency is required"
      });
      return;
    }

    if (currency.is_base_currency && currencies.length > 1) {
      toast({
        variant: "destructive",
        title: "Cannot remove base currency",
        description: "Set another currency as base before removing this one"
      });
      return;
    }

    setCurrencies(prev => prev.filter((_, i) => i !== index));
    analyticsService.trackEvent('catalog_form_currency_removed', {
      catalog_type: validCatalogType,
      currency: currency.currency
    });
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      const errorCount = Object.keys(errors).length;
      toast({
        variant: "destructive",
        title: "Validation failed",
        description: `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting`
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const dataToSubmit = {
        ...formData,
        description_content: editorContent.description,
        terms_content: editorContent.service_terms,
        price_attributes: {
          ...formData.price_attributes,
          base_amount: currencies.find(c => c.is_base_currency)?.price || 0,
          currency: currencies.find(c => c.is_base_currency)?.currency || 'INR'
        }
      };

      let result: CatalogItemDetailed;
      
      if (mode === 'edit') {
        result = await catalogService.updateCatalogItem(itemId!, dataToSubmit as UpdateCatalogItemRequest);
        
        analyticsService.trackEvent('catalog_item_updated', {
          catalog_type: validCatalogType,
          item_id: itemId,
          has_version_reason: !!formData.version_reason
        });
      } else {
        result = await catalogService.createCatalogItem(dataToSubmit);
        
        analyticsService.trackEvent('catalog_item_created', {
          catalog_type: validCatalogType,
          item_id: result.id,
          currency_count: currencies.length
        });
      }

      // Update multi-currency pricing if needed
      if (currencies.length > 0) {
        await catalogService.updateMultiCurrencyPricing(result.id, {
          price_type: formData.price_attributes.type,
          currencies: currencies.map(c => ({
            currency: c.currency,
            price: c.price,
            is_base_currency: c.is_base_currency,
            tax_included: c.tax_included,
            tax_rate_id: c.tax_rate_id
          }))
        });
      }

      toast({
        title: "Success",
        description: `${catalogInfo.singular} ${mode === 'edit' ? 'updated' : 'created'} successfully`,
        action: (
          <button
            onClick={() => {
              navigate(getCatalogRoute(validCatalogType));
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors hover:opacity-90"
            style={{
              backgroundColor: colors.brand.primary,
              color: '#FFF'
            }}
          >
            <Eye className="h-3 w-3" />
            View List
          </button>
        )
      });
      
      // Reset unsaved changes flag
      setHasUnsavedChanges(false);
      
      // Navigate back to list
      navigate(getCatalogRoute(validCatalogType), { 
        state: { 
          message: `${catalogInfo.singular} ${mode === 'edit' ? 'updated' : 'created'} successfully`,
          itemId: result.id 
        } 
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${mode} ${catalogInfo.singular.toLowerCase()}`;
      
      captureException(error, {
        tags: { component: 'CatalogItemFormPage', action: 'handleSubmit' },
        extra: { 
          mode, 
          catalogType: validCatalogType, 
          itemId,
          formData: dataToSubmit 
        }
      });
      
      toast({
        variant: "destructive",
        title: `Failed to ${mode} ${catalogInfo.singular.toLowerCase()}`,
        description: errorMessage
      });
      
      analyticsService.trackEvent('catalog_item_submit_failed', {
        catalog_type: validCatalogType,
        mode,
        error: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      navigate(getCatalogRoute(validCatalogType));
    }
  };

  const handleConfirmExit = () => {
    setHasUnsavedChanges(false);
    navigate(getCatalogRoute(validCatalogType));
  };

  // Track page view
  useEffect(() => {
    analyticsService.trackPageView(`catalog-${mode}-form`, `Catalog ${mode} Form - ${catalogInfo.singular}`, {
      catalog_type: validCatalogType,
      mode
    });
  }, [mode, catalogInfo.singular, validCatalogType]);

  // Loading state
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
              Loading {catalogInfo.singular}...
            </p>
            <p 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Please wait while we fetch the data
            </p>
          </div>
        </div>
      </div>
    );
  }

  const Icon = catalogInfo.icon;

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center mb-4 transition-colors hover:opacity-80"
            style={{ color: colors.utility.secondaryText }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {catalogInfo.plural}
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl font-bold flex items-center gap-3 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                <Icon className="w-8 h-8" />
                {mode === 'add' ? 'Add New' : 'Edit'} {catalogInfo.singular}
              </h1>
              <p 
                className="mt-1 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Fill in the details below to {mode === 'add' ? 'create' : 'update'} your {catalogInfo.singular.toLowerCase()}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {mode === 'edit' && existingItem && (
                <div 
                  className="flex items-center text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Version {existingItem.version_number}
                </div>
              )}
              
              {hasUnsavedChanges && (
                <div 
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors"
                  style={{
                    backgroundColor: `${colors.semantic.warning}20`,
                    color: colors.semantic.warning
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.semantic.warning }}
                  />
                  Unsaved changes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div 
          ref={formRef} 
          className="rounded-xl shadow-sm border transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          <div className="p-8">
            
            {/* Section 1: Basic Information */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.brand.primary}20` }}
                >
                  <Info 
                    className="w-4 h-4"
                    style={{ color: colors.brand.primary }}
                  />
                </div>
                <h2 
                  className="text-xl font-semibold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Name */}
                  <div data-field="name">
                    <label 
                      className="block text-sm font-medium mb-2 transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {catalogInfo.singular} Name <span style={{ color: colors.semantic.error }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleNameChange}
                      className="w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2"
                      style={{
                        borderColor: errors.name 
                          ? colors.semantic.error
                          : colors.utility.secondaryText + '40',
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                      placeholder={`Enter ${catalogInfo.singular.toLowerCase()} name`}
                      maxLength={CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <div 
                        id="name-error" 
                        className="flex items-center gap-2 mt-2 text-sm"
                        style={{ color: colors.semantic.error }}
                      >
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        {errors.name}
                      </div>
                    )}
                    <div 
                      className="mt-1 text-xs transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {formData.name.length}/{CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH} characters
                    </div>
                  </div>

                  {/* Short Description */}
                  <div data-field="short_description">
                    <label 
                      className="block text-sm font-medium mb-2 transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Short Description
                    </label>
                    <textarea
                      value={formData.short_description}
                      onChange={handleShortDescriptionChange}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg transition-colors resize-none focus:outline-none focus:ring-2"
                      style={{
                        borderColor: errors.short_description 
                          ? colors.semantic.error
                          : colors.utility.secondaryText + '40',
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                      placeholder="Brief description for listings and previews"
                      maxLength={CATALOG_VALIDATION_LIMITS.SHORT_DESCRIPTION.MAX_LENGTH}
                    />
                    {errors.short_description && (
                      <div 
                        className="flex items-center gap-2 mt-2 text-sm"
                        style={{ color: colors.semantic.error }}
                      >
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        {errors.short_description}
                      </div>
                    )}
                  </div>

                  {/* Version Reason (Edit Mode) */}
                  {mode === 'edit' && (
                    <div data-field="version_reason">
                      <label 
                        className="block text-sm font-medium mb-2 transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        Version Reason <span style={{ color: colors.semantic.error }}>*</span>
                      </label>
                      <textarea
                        value={formData.version_reason || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, version_reason: e.target.value });
                          clearFieldError('version_reason');
                        }}
                        rows={2}
                        className="w-full px-4 py-3 border rounded-lg transition-colors resize-none focus:outline-none focus:ring-2"
                        style={{
                          borderColor: errors.version_reason 
                            ? colors.semantic.error
                            : colors.utility.secondaryText + '40',
                          backgroundColor: colors.utility.primaryBackground,
                          color: colors.utility.primaryText,
                          '--tw-ring-color': colors.brand.primary
                        } as React.CSSProperties}
                        placeholder="Describe what changed in this update"
                      />
                      {errors.version_reason && (
                        <div 
                          className="flex items-center gap-2 mt-2 text-sm"
                          style={{ color: colors.semantic.error }}
                        >
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          {errors.version_reason}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column - Examples */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <div 
                      className="p-4 border rounded-lg transition-colors"
                      style={{
                        backgroundColor: `${colors.brand.primary}10`,
                        borderColor: `${colors.brand.primary}40`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <HelpCircle 
                          className="h-4 w-4"
                          style={{ color: colors.brand.primary }}
                        />
                        <h4 
                          className="text-sm font-medium transition-colors"
                          style={{ color: colors.brand.primary }}
                        >
                          Common {catalogInfo.singular} Examples
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {catalogInfo.examples.map((example, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors hover:opacity-80 group"
                            style={{ backgroundColor: `${colors.brand.primary}20` }}
                            onClick={() => {
                              if (!formData.name) {
                                setFormData({ ...formData, name: example });
                                clearFieldError('name');
                              }
                            }}
                          >
                            <CheckCircle 
                              className="h-3 w-3 flex-shrink-0"
                              style={{ color: colors.brand.primary }}
                            />
                            <span 
                              className="text-sm transition-colors group-hover:opacity-80"
                              style={{ color: colors.brand.primary }}
                            >
                              {example}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p 
                        className="text-xs mt-3 transition-colors"
                        style={{ color: colors.brand.primary }}
                      >
                        💡 Click on any example to use it as your {catalogInfo.singular.toLowerCase()} name
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="mt-6" data-field="description">
                <RichTextEditor
                  value={editorContent.description}
                  onChange={(content) => setEditorContent({ ...editorContent, description: content })}
                  placeholder="Enter detailed description with formatting..."
                  field="description"
                  label="Description"
                  required
                />
              </div>

              {/* Service Terms - Full Width */}
              <div className="mt-6" data-field="service_terms">
                <RichTextEditor
                  value={editorContent.service_terms}
                  onChange={(content) => setEditorContent({ ...editorContent, service_terms: content })}
                  placeholder={`Enter ${catalogInfo.singular.toLowerCase()} terms and conditions...`}
                  field="service_terms"
                  label={`${catalogInfo.singular} Terms`}
                />
              </div>
            </div>

            {/* Section 2: Pricing Configuration */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.semantic.success}20` }}
                >
                  <DollarSign 
                    className="w-4 h-4"
                    style={{ color: colors.semantic.success }}
                  />
                </div>
                <h2 
                  className="text-xl font-semibold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Pricing Configuration
                </h2>
              </div>

              {/* Pricing Type */}
              <div className="mb-6">
                <label 
                  className="block text-sm font-medium mb-3 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Pricing Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {RECOMMENDED_PRICING_BY_TYPE[validCatalogType]?.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        price_attributes: { ...formData.price_attributes, type } 
                      })}
                      className="p-4 rounded-lg border-2 transition-all text-left"
                      style={{
                        borderColor: formData.price_attributes.type === type
                          ? colors.brand.primary
                          : colors.utility.secondaryText + '40',
                        backgroundColor: formData.price_attributes.type === type
                          ? `${colors.brand.primary}10`
                          : colors.utility.primaryBackground
                      }}
                    >
                      <div 
                        className="font-medium transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {PRICING_TYPE_LABELS[type]}
                      </div>
                      <div 
                        className="text-sm mt-1 transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {type === PRICING_TYPES.FIXED && 'One-time fixed cost'}
                        {type === PRICING_TYPES.UNIT_PRICE && 'Price per unit/item'}
                        {type === PRICING_TYPES.HOURLY && 'Price per hour'}
                        {type === PRICING_TYPES.DAILY && 'Price per day'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-Currency Pricing */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label 
                    className="block text-sm font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Multi-Currency Pricing
                  </label>
                  {currencies.length < SUPPORTED_CURRENCIES.length && (
                    <button
                      type="button"
                      onClick={handleAddCurrency}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors hover:opacity-80"
                      style={{
                        color: colors.brand.primary,
                        backgroundColor: `${colors.brand.primary}10`
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Currency
                    </button>
                  )}
                </div>

                {errors.currencies && (
                  <div 
                    className="mb-4 p-3 border rounded-md transition-colors"
                    style={{
                      backgroundColor: `${colors.semantic.error}10`,
                      borderColor: `${colors.semantic.error}40`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle 
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: colors.semantic.error }}
                      />
                      <p 
                        className="text-sm"
                        style={{ color: colors.semantic.error }}
                      >
                        {errors.currencies}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {currencies.map((currency, index) => (
                    <div key={index} className="relative">
                      <div 
                        className="flex items-center gap-4 p-4 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: `${colors.utility.secondaryText}10`,
                          borderColor: colors.utility.secondaryText + '40'
                        }}
                      >
                        {/* Currency Selector */}
                        <div className="w-32">
                          <select
                            value={currency.currency}
                            onChange={(e) => handleCurrencyChange(index, 'currency', e.target.value as SupportedCurrency)}
                            className="w-full px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-1 transition-colors"
                            style={{
                              borderColor: colors.utility.secondaryText + '40',
                              backgroundColor: colors.utility.primaryBackground,
                              color: colors.utility.primaryText,
                              '--tw-ring-color': colors.brand.primary
                            } as React.CSSProperties}
                          >
                            {SUPPORTED_CURRENCIES.map(curr => (
                              <option key={curr} value={curr}>
                                {curr}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Currency Symbol */}
                        <div 
                          className="text-lg font-semibold w-8 transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {CURRENCY_SYMBOLS[currency.currency]}
                        </div>

                        {/* Price Input */}
                        <div className="flex-1">
                          <input
                            type="number"
                            value={currency.price}
                            onChange={(e) => handleCurrencyChange(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 border rounded-md text-lg font-semibold focus:outline-none focus:ring-1 transition-colors"
                            style={{
                              borderColor: errors[`price_${index}`] 
                                ? colors.semantic.error 
                                : colors.utility.secondaryText + '40',
                              backgroundColor: colors.utility.primaryBackground,
                              color: colors.utility.primaryText,
                              '--tw-ring-color': colors.brand.primary
                            } as React.CSSProperties}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                          {errors[`price_${index}`] && (
                            <p 
                              className="mt-1 text-xs"
                              style={{ color: colors.semantic.error }}
                            >
                              {errors[`price_${index}`]}
                            </p>
                          )}
                        </div>

                        {/* Base Currency Button */}
                        <button
                          type="button"
                          onClick={() => handleSetBaseCurrency(index)}
                          className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: currency.is_base_currency
                              ? `${colors.semantic.warning}20`
                              : colors.utility.primaryBackground,
                            color: currency.is_base_currency
                              ? colors.semantic.warning
                              : colors.utility.primaryText,
                            borderColor: currency.is_base_currency
                              ? colors.semantic.warning
                              : colors.utility.secondaryText + '40',
                            border: '1px solid'
                          }}
                        >
                          <Star className={`w-3 h-3 ${currency.is_base_currency ? 'fill-current' : ''}`} />
                          {currency.is_base_currency ? 'Base' : 'Set Base'}
                        </button>

                        {/* Tax Included Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currency.tax_included}
                            onChange={(e) => handleCurrencyChange(index, 'tax_included', e.target.checked)}
                            className="rounded border-input text-primary focus:ring-primary"
                          />
                          <span 
                            className="text-sm transition-colors"
                            style={{ color: colors.utility.primaryText }}
                          >
                            Tax Inc.
                          </span>
                        </label>

                        {/* Remove Button */}
                        {currencies.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCurrency(index)}
                            className="p-2 rounded-md transition-colors hover:opacity-80"
                            style={{
                              color: colors.semantic.error,
                              backgroundColor: `${colors.semantic.error}10`
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Base Currency Indicator */}
                      {currency.is_base_currency && (
                        <div className="absolute -top-2 -right-2">
                          <div 
                            className="text-xs font-bold px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: colors.semantic.warning,
                              color: '#000'
                            }}
                          >
                            BASE
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Action Bar */}
          <div 
            className="sticky bottom-0 border-t px-8 py-4 rounded-b-xl transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.secondaryText + '20'
            }}
          >
            <div className="flex items-center justify-between">
              <div 
                className="text-sm transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                <span style={{ color: colors.semantic.error }}>*</span> Required fields
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium border rounded-lg transition-colors disabled:opacity-50 hover:opacity-80"
                  style={{
                    color: colors.utility.primaryText,
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: colors.utility.secondaryText + '40'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors hover:opacity-90"
                  style={{
                    color: '#FFF',
                    backgroundColor: colors.brand.primary,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === 'add' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {mode === 'add' ? `Create ${catalogInfo.singular}` : `Update ${catalogInfo.singular}`}
                    </>
                  )}
                </button>
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
        title="Unsaved Changes"
        description="You have unsaved changes that will be lost if you leave this page. Are you sure you want to continue?"
        confirmText="Leave Page"
        type="warning"
        icon={<AlertTriangle className="h-6 w-6" />}
      />
    </div>
  );
};

export default CatalogItemFormPage;