// src/components/catalog/service/ServiceBasicInfo.tsx
// 🎨 Updated ServiceBasicInfo with integrated PricingInput and DurationInput components

import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { AlertTriangle, DollarSign, Info, Tag, Building, Hash, Package } from 'lucide-react';
import PricingInput, { type PricingData } from '../shared/PricingInput';
import DurationInput, { type DurationData } from '../shared/DurationInput';
import { useCategoriesForDropdown, useIndustriesForDropdown, useCurrenciesForDropdown, usePricingModelsForDropdown, useDefaultCurrency } from '../../../hooks/queries/useMasterDataQueries';

interface ServiceBasicInfoData {
  serviceName: string;
  sku?: string;
  description: string;
  categoryId: string;
  industryId?: string;
  pricing: PricingData;
  duration?: DurationData;
  tags: string[];
  isActive: boolean;
}

interface ServiceBasicInfoProps {
  data: ServiceBasicInfoData;
  onChange: (updates: Partial<ServiceBasicInfoData>) => void;
  isReadOnly?: boolean;
}

const ServiceBasicInfo: React.FC<ServiceBasicInfoProps> = ({
  data,
  onChange,
  isReadOnly = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const handleChange = (field: keyof ServiceBasicInfoData, value: any) => {
    onChange({ [field]: value });
  };

  // Master data hooks
  const categoriesQuery = useCategoriesForDropdown();
  const industriesQuery = useIndustriesForDropdown();
  const currenciesQuery = useCurrenciesForDropdown();
  const pricingModelsQuery = usePricingModelsForDropdown();
  const defaultCurrencyQuery = useDefaultCurrency();

  // Validation states
  const isNameValid = data.serviceName.trim().length >= 2;
  const isPricingValid = data.pricing.amount > 0;
  const isDescriptionValid = data.description.trim().length > 0;
  const isCategoryValid = data.categoryId.trim().length > 0;
  const isDurationValid = !data.duration || data.duration.totalMinutes > 0;

  const allValid = isNameValid && isPricingValid && isDescriptionValid && isCategoryValid && isDurationValid;

  return (
    <div 
      className="rounded-xl shadow-sm border transition-colors sticky top-24"
      style={{
        backgroundColor: colors.utility.primaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center border-2"
            style={{
              backgroundColor: `${colors.brand.primary}15`,
              borderColor: `${colors.brand.primary}40`,
              color: colors.brand.primary
            }}
          >
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 
              className="text-lg font-semibold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Service Details
            </h2>
            <p 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Define your service fundamentals
            </p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Service Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2 transition-colors flex items-center gap-2"
              style={{ color: colors.utility.primaryText }}
            >
              Service Name
              <span style={{ color: colors.semantic.error }}>*</span>
              {!isNameValid && data.serviceName.length > 0 && (
                <AlertTriangle 
                  className="w-4 h-4" 
                  style={{ color: colors.semantic.error }}
                />
              )}
            </label>
            <input
              type="text"
              value={data.serviceName}
              onChange={(e) => handleChange('serviceName', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: !isNameValid && data.serviceName.length > 0 
                  ? colors.semantic.error
                  : colors.utility.secondaryText + '40',
                backgroundColor: isReadOnly 
                  ? colors.utility.secondaryText + '10' 
                  : colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
              placeholder="e.g., Consultation, HVAC Maintenance, Discovery Call"
              maxLength={255}
            />
            <div className="flex items-center justify-between mt-1">
              <div 
                className="text-xs transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {data.serviceName.length}/255 characters
              </div>
              {!isNameValid && data.serviceName.length > 0 && (
                <div 
                  className="text-xs"
                  style={{ color: colors.semantic.error }}
                >
                  Name must be at least 2 characters
                </div>
              )}
            </div>
          </div>

          {/* SKU (Optional) */}
          <div>
            <label 
              className="block text-sm font-medium mb-2 transition-colors flex items-center gap-2"
              style={{ color: colors.utility.primaryText }}
            >
              <Hash className="w-4 h-4" />
              SKU (Optional)
            </label>
            <input
              type="text"
              value={data.sku || ''}
              onChange={(e) => handleChange('sku', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                backgroundColor: isReadOnly 
                  ? colors.utility.secondaryText + '10' 
                  : colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
              placeholder="e.g., SVC-001, CONSULT-BASIC"
              maxLength={50}
            />
          </div>

          {/* Category (Required) */}
          <div>
            <label 
              className="block text-sm font-medium mb-2 transition-colors flex items-center gap-2"
              style={{ color: colors.utility.primaryText }}
            >
              <Package className="w-4 h-4" />
              Category
              <span style={{ color: colors.semantic.error }}>*</span>
              {!isCategoryValid && data.categoryId.length > 0 && (
                <AlertTriangle 
                  className="w-4 h-4" 
                  style={{ color: colors.semantic.error }}
                />
              )}
            </label>
            <select
              value={data.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              disabled={isReadOnly || categoriesQuery.isLoading}
              className="w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: !isCategoryValid && data.categoryId.length > 0 
                  ? colors.semantic.error
                  : colors.utility.secondaryText + '40',
                backgroundColor: isReadOnly 
                  ? colors.utility.secondaryText + '10' 
                  : colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              <option value="">Select a category...</option>
              {categoriesQuery.data?.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {categoriesQuery.isLoading && (
              <div className="text-xs mt-1" style={{ color: colors.utility.secondaryText }}>
                Loading categories...
              </div>
            )}
            {categoriesQuery.error && (
              <div className="text-xs mt-1" style={{ color: colors.semantic.error }}>
                Failed to load categories
              </div>
            )}
          </div>

          {/* Industry (Optional) */}
          <div>
            <label 
              className="block text-sm font-medium mb-2 transition-colors flex items-center gap-2"
              style={{ color: colors.utility.primaryText }}
            >
              <Building className="w-4 h-4" />
              Industry (Optional)
            </label>
            <select
              value={data.industryId || ''}
              onChange={(e) => handleChange('industryId', e.target.value)}
              disabled={isReadOnly || industriesQuery.isLoading}
              className="w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                backgroundColor: isReadOnly 
                  ? colors.utility.secondaryText + '10' 
                  : colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              <option value="">Select an industry...</option>
              {industriesQuery.data?.map(industry => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
            {industriesQuery.isLoading && (
              <div className="text-xs mt-1" style={{ color: colors.utility.secondaryText }}>
                Loading industries...
              </div>
            )}
          </div>

          {/* Service Description */}
          <div>
            <label 
              className="block text-sm font-medium mb-2 transition-colors flex items-center gap-2"
              style={{ color: colors.utility.primaryText }}
            >
              Description
              <span style={{ color: colors.semantic.error }}>*</span>
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isReadOnly}
              rows={4}
              className="w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              style={{
                borderColor: !isDescriptionValid && data.description.length > 0 
                  ? colors.semantic.error
                  : colors.utility.secondaryText + '40',
                backgroundColor: isReadOnly 
                  ? colors.utility.secondaryText + '10' 
                  : colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
              placeholder="Describe what this service includes, what problems it solves, and any important details..."
              maxLength={1000}
            />
            <div 
              className="text-xs mt-1 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {data.description.length}/1000 characters
            </div>
          </div>

          {/* Pricing Configuration */}
          <div>
            <PricingInput
              value={data.pricing}
              onChange={(pricing) => handleChange('pricing', pricing)}
              required={true}
              availableCurrencies={currenciesQuery.data?.map(c => c.code) || ['USD', 'EUR']}
              availableTypes={pricingModelsQuery.data?.map(pm => pm.value) || ['fixed', 'hourly', 'daily', 'monthly', 'per-unit']}
              allowCustomType={false}
              label="Pricing Configuration"
              helpText="Set the base price for your service. You can add resource-based pricing later."
              showPreview={true}
              disabled={isReadOnly}
              error={!isPricingValid && data.pricing.amount !== undefined ? 'Valid pricing is required' : undefined}
              defaultCurrency={defaultCurrencyQuery.data?.code}
            />
          </div>

          {/* Duration Configuration (Optional) */}
          <div>
            <DurationInput
              value={data.duration || { value: 0, unit: 'minutes', totalMinutes: 0 }}
              onChange={(duration) => handleChange('duration', duration.totalMinutes > 0 ? duration : undefined)}
              required={false}
              min={1}
              max={60 * 24 * 7} // 1 week max
              availableUnits={['minutes', 'hours', 'days']}
              showPresets={true}
              label="Estimated Duration (Optional)"
              helpText="How long does this service typically take to complete?"
              showPreview={true}
              disabled={isReadOnly}
              variant="default"
            />
          </div>

          {/* Tags (Optional) */}
          <div>
            <label 
              className="block text-sm font-medium mb-2 transition-colors flex items-center gap-2"
              style={{ color: colors.utility.primaryText }}
            >
              <Tag className="w-4 h-4" />
              Tags (Optional)
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-lg" 
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: isReadOnly 
                    ? colors.utility.secondaryText + '10' 
                    : colors.utility.primaryBackground
                }}
              >
                {data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.brand.primary + '20',
                      color: colors.brand.primary
                    }}
                  >
                    {tag}
                    {!isReadOnly && (
                      <button
                        onClick={() => {
                          const newTags = data.tags.filter((_, i) => i !== index);
                          handleChange('tags', newTags);
                        }}
                        className="ml-1 hover:opacity-70"
                        style={{ color: colors.brand.primary }}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {!isReadOnly && (
                <input
                  type="text"
                  placeholder="Type a tag and press Enter..."
                  className="w-full px-3 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 text-sm"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const value = input.value.trim();
                      if (value && !data.tags.includes(value)) {
                        handleChange('tags', [...data.tags, value]);
                        input.value = '';
                      }
                    }
                  }}
                />
              )}
              <div className="text-xs" style={{ color: colors.utility.secondaryText }}>
                Add tags to help categorize and search for your service. Press Enter to add.
              </div>
            </div>
          </div>

          {/* Active Status Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                disabled={isReadOnly}
                className="w-4 h-4 rounded border-2 transition-all focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: data.isActive ? colors.brand.primary : colors.utility.primaryBackground,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
              <div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: colors.utility.primaryText }}
                >
                  Active Service
                </span>
                <p 
                  className="text-xs"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Active services are visible to clients and available for booking
                </p>
              </div>
            </label>
          </div>

          {/* Validation Summary */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: allValid 
                ? colors.semantic.success + '10' 
                : colors.semantic.warning + '10',
              borderColor: allValid 
                ? colors.semantic.success + '40' 
                : colors.semantic.warning + '40'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: allValid 
                    ? colors.semantic.success 
                    : colors.semantic.warning 
                }}
              />
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: allValid 
                    ? colors.semantic.success 
                    : colors.semantic.warning 
                }}
              >
                {allValid 
                  ? 'Service details are complete' 
                  : 'Please complete required fields'
                }
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: isNameValid ? colors.semantic.success : colors.semantic.error }}
                />
                <span style={{ color: colors.utility.secondaryText }}>
                  Service name ({isNameValid ? 'Valid' : 'Required'})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: isDescriptionValid ? colors.semantic.success : colors.semantic.error }}
                />
                <span style={{ color: colors.utility.secondaryText }}>
                  Description ({isDescriptionValid ? 'Valid' : 'Required'})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: isPricingValid ? colors.semantic.success : colors.semantic.error }}
                />
                <span style={{ color: colors.utility.secondaryText }}>
                  Pricing ({isPricingValid ? 'Valid' : 'Required'})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: isCategoryValid ? colors.semantic.success : colors.semantic.error }}
                />
                <span style={{ color: colors.utility.secondaryText }}>
                  Category ({isCategoryValid ? 'Valid' : 'Required'})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: isDurationValid ? colors.semantic.success : colors.semantic.info }}
                />
                <span style={{ color: colors.utility.secondaryText }}>
                  Duration ({data.duration ? 'Set' : 'Optional'})
                </span>
              </div>
            </div>
          </div>

          {/* Service Preview */}
          {allValid && (
            <div 
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.semantic.info + '05',
                borderColor: colors.semantic.info + '40'
              }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 mt-0.5" style={{ color: colors.semantic.info }} />
                <div className="flex-1">
                  <h4 
                    className="font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Service Preview
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div 
                      className="font-medium"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {data.serviceName}
                    </div>
                    <div 
                      className="text-lg font-bold"
                      style={{ color: colors.semantic.success }}
                    >
                      {data.pricing.currency === 'INR' ? '₹' : 
                       data.pricing.currency === 'USD' ? '$' : 
                       data.pricing.currency === 'EUR' ? '€' : 
                       data.pricing.currency === 'GBP' ? '£' : data.pricing.currency}{data.pricing.amount}
                      <span className="text-xs font-normal ml-1" style={{ color: colors.utility.secondaryText }}>
                        {data.pricing.type === 'FIXED' ? 'fixed price' :
                         data.pricing.type === 'HOURLY' ? 'per hour' :
                         data.pricing.type === 'DAILY' ? 'per day' :
                         data.pricing.type === 'MONTHLY' ? 'per month' :
                         data.pricing.type === 'PER_USE' ? 'per use' :
                         data.pricing.type?.toLowerCase()}
                      </span>
                    </div>
                    {data.duration && data.duration.totalMinutes > 0 && (
                      <div style={{ color: colors.utility.secondaryText }}>
                        Estimated duration: {data.duration.value} {data.duration.unit}
                      </div>
                    )}
                    <div 
                      className="mt-2 text-xs line-clamp-2"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {data.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceBasicInfo;