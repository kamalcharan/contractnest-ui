import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Upload, 
  Trash2,
  Palette,
  Bug,
  Clipboard
} from 'lucide-react';
import { TenantProfile } from '@/hooks/useTenantProfile';
import { countries } from '@/utils/constants/countries';

interface OrganizationDetailsFormProps {
  formData: TenantProfile;
  onUpdate: (field: keyof TenantProfile, value: any) => void;
  onLogoChange: (file: File | null) => void;
  disabled?: boolean;
}

const OrganizationDetailsForm: React.FC<OrganizationDetailsFormProps> = ({
  formData,
  onUpdate,
  onLogoChange,
  disabled = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logo_url || null);
  const [showDebugger, setShowDebugger] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  // Use Vite's import.meta.env for environment detection
  const isDev = import.meta.env ? 
    import.meta.env.MODE === 'development' || import.meta.env.DEV : 
    process.env.NODE_ENV === 'development';

  // Handle logo file selection
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      onLogoChange(file);
    }
  };
  
  // Clear logo
  const clearLogo = () => {
    setLogoPreview(null);
    onLogoChange(null);
    onUpdate('logo_url', null);
  };

  // Copy payload to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Common input styles
  const getInputStyles = () => ({
    borderColor: colors.utility.secondaryText + '40',
    backgroundColor: colors.utility.secondaryBackground,
    color: colors.utility.primaryText,
    '--tw-ring-color': colors.brand.primary
  } as React.CSSProperties);
  
  return (
    <div className="space-y-8">
      {/* Dev Mode Toggle - Only visible in development */}
      {isDev && (
        <div className="flex justify-end">
          <div 
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryText + '10'
            }}
          >
            <Bug 
              size={16} 
              style={{ color: colors.utility.secondaryText }}
            />
            <span 
              className="text-xs"
              style={{ color: colors.utility.secondaryText }}
            >
              Debug Mode
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showDebugger}
                onChange={() => setShowDebugger(!showDebugger)}
                className="sr-only peer"
              />
              <div 
                className="w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
                style={{
                  backgroundColor: showDebugger ? colors.brand.primary : colors.utility.secondaryText + '50',
                  borderColor: colors.utility.secondaryText + '30'
                }}
              />
            </label>
          </div>
        </div>
      )}
      
      {/* Debugger Panel - Only shown when toggle is on */}
      {showDebugger && (
        <div 
          className="p-4 border rounded-md space-y-2 transition-colors"
          style={{
            borderColor: colors.semantic.warning,
            backgroundColor: colors.semantic.warning + '05'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bug 
                style={{ color: colors.semantic.warning }} 
                size={20} 
              />
              <h3 
                className="font-medium"
                style={{ color: colors.utility.primaryText }}
              >
                Payload Debugger
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={copyToClipboard}
                className="text-sm px-2 py-1 flex items-center space-x-1 transition-colors hover:opacity-80"
                style={{ color: colors.utility.secondaryText }}
              >
                <Clipboard size={14} />
                <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <pre 
            className="text-xs p-3 border rounded overflow-auto max-h-60 transition-colors"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.secondaryText + '20',
              color: colors.utility.primaryText
            }}
          >
            {JSON.stringify(formData, null, 2)}
          </pre>
          
          <div 
            className="mt-2 p-2 border rounded text-xs transition-colors"
            style={{
              backgroundColor: colors.brand.primary + '05',
              borderColor: colors.brand.primary + '20',
              color: colors.utility.primaryText
            }}
          >
            <strong>Note:</strong> tenant_id will be added from the auth context via the x-tenant-id header.
          </div>
        </div>
      )}
      
      {/* Organization Logo */}
      <div className="space-y-4">
        <div 
          className="text-base font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Organization Logo
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Logo Preview */}
          <div 
            className="w-24 h-24 flex items-center justify-center rounded-lg overflow-hidden border transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.secondaryText + '20'
            }}
          >
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="w-full h-full object-contain"
              />
            ) : (
              <Building 
                style={{ color: colors.utility.secondaryText }} 
                size={32} 
              />
            )}
          </div>
          
          {/* Upload Controls */}
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              <button
                type="button" 
                className="flex items-center px-3 py-2 rounded-md border transition-all hover:opacity-90"
                style={{
                  backgroundColor: colors.brand.primary + '05',
                  borderColor: colors.brand.primary + '10',
                  color: colors.utility.primaryText
                }}
                onClick={() => document.getElementById('logo-upload')?.click()}
                disabled={disabled}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.brand.primary + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.brand.primary + '05';
                }}
              >
                <Upload 
                  className="mr-2 h-4 w-4"
                  style={{ color: colors.brand.primary }}
                />
                Upload Logo
              </button>
              
              {logoPreview && (
                <button
                  type="button"
                  className="flex items-center px-3 py-2 rounded-md border transition-all hover:opacity-90"
                  style={{
                    backgroundColor: colors.semantic.error + '05',
                    borderColor: colors.semantic.error + '10',
                    color: colors.semantic.error
                  }}
                  onClick={clearLogo}
                  disabled={disabled}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.semantic.error + '10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.semantic.error + '05';
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            
            <p 
              className="text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Recommended size: 512x512px. Max size: 5MB. Formats: PNG, JPG, SVG.
            </p>
            
            <input 
              id="logo-upload" 
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoSelect}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      
      {/* Organization Details */}
      <div className="space-y-6">
        <div>
          <div 
            className="text-base font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Organization Details
          </div>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Basic information about your organization
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <label 
              htmlFor="business_name" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Organization Name*
            </label>
            <input
              id="business_name"
              type="text"
              value={formData.business_name || ''}
              onChange={(e) => onUpdate('business_name', e.target.value)}
              placeholder="Enter your organization name"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
              required
            />
          </div>
          
          {/* Organization Email */}
          <div className="space-y-2">
            <label 
              htmlFor="business_email" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Email Address
            </label>
            <input
              id="business_email"
              type="email"
              value={formData.business_email || ''}
              onChange={(e) => onUpdate('business_email', e.target.value)}
              placeholder="contact@example.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
            />
          </div>
          
          {/* Phone Number (Country Code + Number) */}
          <div className="space-y-2">
            <label 
              htmlFor="business_phone" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Phone Number
            </label>
            <div className="flex space-x-2">
              <div className="w-24">
                <select
                  id="business_phone_country_code"
                  value={formData.business_phone_country_code || ''}
                  onChange={(e) => onUpdate('business_phone_country_code', e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                  style={getInputStyles()}
                  disabled={disabled}
                >
                  <option value="">Code</option>
                  {countries
                    .filter(country => country.phoneCode)
                    .sort((a, b) => {
                      // Special handling: Put India (+91) at the top
                      if (a.code === 'IN') return -1;
                      if (b.code === 'IN') return 1;
                      return (a.phoneCode || '').localeCompare(b.phoneCode || '');
                    })
                    .map(country => (
                      <option key={country.code} value={`+${country.phoneCode}`}>
                        +{country.phoneCode} {country.name.length > 15 ? country.name.substring(0, 15) + '...' : country.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="flex-1">
                <input
                  id="business_phone"
                  type="text"
                  value={formData.business_phone || ''}
                  onChange={(e) => onUpdate('business_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                  style={getInputStyles()}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
          
          {/* Website */}
          <div className="space-y-2">
            <label 
              htmlFor="website_url" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Website
            </label>
            <input
              id="website_url"
              type="text"
              value={formData.website_url || ''}
              onChange={(e) => onUpdate('website_url', e.target.value)}
              placeholder="https://example.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      
      {/* Address Information */}
      <div className="space-y-6">
        <div>
          <div 
            className="text-base font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Address Information
          </div>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Where your organization is located
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Line 1 */}
          <div className="space-y-2 md:col-span-2">
            <label 
              htmlFor="address_line1" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Address Line 1
            </label>
            <input
              id="address_line1"
              type="text"
              value={formData.address_line1 || ''}
              onChange={(e) => onUpdate('address_line1', e.target.value)}
              placeholder="Street address, P.O. box, company name"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
            />
          </div>
          
          {/* Address Line 2 */}
          <div className="space-y-2 md:col-span-2">
            <label 
              htmlFor="address_line2" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Address Line 2
            </label>
            <input
              id="address_line2"
              type="text"
              value={formData.address_line2 || ''}
              onChange={(e) => onUpdate('address_line2', e.target.value)}
              placeholder="Apartment, suite, unit, building, floor, etc."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
            />
          </div>
          
          {/* Country */}
          <div className="space-y-2">
            <label 
              htmlFor="country_code" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Country
            </label>
            <select
              id="country_code"
              value={formData.country_code || ''}
              onChange={(e) => onUpdate('country_code', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* State/Province */}
          <div className="space-y-2">
            <label 
              htmlFor="state_code" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              State/Province
            </label>
            <input
              id="state_code"
              type="text"
              value={formData.state_code || ''}
              onChange={(e) => onUpdate('state_code', e.target.value)}
              placeholder="State or province"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
            />
          </div>
          
          {/* City */}
          <div className="space-y-2">
            <label 
              htmlFor="city" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              City
            </label>
            <input
              id="city"
              type="text"
              value={formData.city || ''}
              onChange={(e) => onUpdate('city', e.target.value)}
              placeholder="City"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
            />
          </div>
          
          {/* Postal/Zip Code */}
          <div className="space-y-2">
            <label 
              htmlFor="postal_code" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Postal Code
            </label>
            <input
              id="postal_code"
              type="text"
              value={formData.postal_code || ''}
              onChange={(e) => onUpdate('postal_code', e.target.value)}
              placeholder="Postal or ZIP code"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
              style={getInputStyles()}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      
      {/* Brand Colors */}
      <div className="space-y-6">
        <div>
          <div 
            className="text-base font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Brand Colors
          </div>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Customize your application colors to match your brand
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Color */}
          <div className="space-y-2">
            <label 
              htmlFor="primary_color" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full border transition-colors"
                style={{ 
                  backgroundColor: formData.primary_color || '#4F46E5',
                  borderColor: colors.utility.secondaryText + '20'
                }}
              />
              <input
                id="primary_color"
                type="color"
                value={formData.primary_color || '#4F46E5'}
                onChange={(e) => onUpdate('primary_color', e.target.value)}
                className="w-16 h-10 p-1"
                disabled={disabled}
              />
            </div>
          </div>
          
          {/* Secondary Color */}
          <div className="space-y-2">
            <label 
              htmlFor="secondary_color" 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full border transition-colors"
                style={{ 
                  backgroundColor: formData.secondary_color || '#10B981',
                  borderColor: colors.utility.secondaryText + '20'
                }}
              />
              <input
                id="secondary_color"
                type="color"
                value={formData.secondary_color || '#10B981'}
                onChange={(e) => onUpdate('secondary_color', e.target.value)}
                className="w-16 h-10 p-1"
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailsForm;