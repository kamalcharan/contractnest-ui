// src/components/contacts/ContactTypeSelector.tsx
import React from 'react';
import { User, Building2, Users, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CONTACT_FORM_TYPES } from '../../utils/constants/contacts';

interface ContactTypeSelectorProps {
  value: 'individual' | 'corporate';
  onChange: (type: 'individual' | 'corporate') => void;
  disabled?: boolean;
  variant?: 'tabs' | 'cards' | 'radio';
  size?: 'sm' | 'md' | 'lg';
  showDescriptions?: boolean;
  className?: string;
}

const ContactTypeSelector: React.FC<ContactTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  variant = 'tabs',
  size = 'md',
  showDescriptions = true,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  
  const getColors = () => ({
    primary: isDarkMode ? '#3b82f6' : '#2563eb',
    background: isDarkMode ? '#1f2937' : '#ffffff',
    border: isDarkMode ? '#4b5563' : '#d1d5db',
    text: isDarkMode ? '#f9fafb' : '#111827',
    textMuted: isDarkMode ? '#9ca3af' : '#6b7280',
    hover: isDarkMode ? '#374151' : '#f3f4f6',
    selected: isDarkMode ? '#1e40af' : '#2563eb'
  });
  
  const colors = getColors();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'px-3 py-2',
          text: 'text-sm',
          icon: 'h-4 w-4',
          gap: 'gap-2'
        };
      case 'lg':
        return {
          padding: 'px-6 py-4',
          text: 'text-lg',
          icon: 'h-6 w-6',
          gap: 'gap-4'
        };
      default:
        return {
          padding: 'px-4 py-3',
          text: 'text-base',
          icon: 'h-5 w-5',
          gap: 'gap-3'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const contactTypes = [
    {
      id: CONTACT_FORM_TYPES.INDIVIDUAL,
      label: 'Individual',
      icon: User,
      shortDesc: 'A single person contact',
      longDesc: 'Perfect for freelancers, consultants, or individual business relationships',
      examples: ['John Smith', 'Sarah Johnson', 'Dr. Michael Brown'],
      useCases: ['Freelancers', 'Consultants', 'Individual clients', 'Personal contacts']
    },
    {
      id: CONTACT_FORM_TYPES.CORPORATE,
      label: 'Corporate',
      icon: Building2,
      shortDesc: 'A company or organization',
      longDesc: 'Ideal for businesses, organizations, or any entity with multiple contact persons',
      examples: ['Acme Corporation', 'Tech Solutions Inc.', 'Global Services Ltd.'],
      useCases: ['Companies', 'Organizations', 'Vendors', 'Partners']
    }
  ];

  // Tab variant
  if (variant === 'tabs') {
    return (
      <div className={`rounded-lg shadow-sm border ${className}`} style={{ backgroundColor: colors.background, borderColor: colors.border }}>
        <div style={{ borderBottom: `1px solid ${colors.border}` }}>
          <div className="flex">
            {contactTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = value === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => !disabled && onChange(type.id as 'individual' | 'corporate')}
                  disabled={disabled}
                  className={`
                    flex items-center ${sizeClasses.gap} ${sizeClasses.padding} font-medium ${sizeClasses.text} 
                    border-b-2 transition-all duration-200 flex-1
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-10'}
                  `}
                  style={{
                    borderBottomColor: isSelected ? colors.primary : 'transparent',
                    color: isSelected ? colors.primary : colors.textMuted,
                    backgroundColor: isSelected ? `${colors.primary}08` : 'transparent'
                  }}
                >
                  <IconComponent className={sizeClasses.icon} />
                  <span>{type.label}</span>
                  {isSelected && <CheckCircle className="h-4 w-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
        
        {showDescriptions && (
          <div className={sizeClasses.padding} style={{ backgroundColor: `${colors.primary}05` }}>
            <div className="text-sm" style={{ color: colors.textMuted }}>
              {contactTypes.find(type => type.id === value)?.shortDesc}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Cards variant
  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        {contactTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = value === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => !disabled && onChange(type.id as 'individual' | 'corporate')}
              disabled={disabled}
              className={`
                relative p-6 rounded-lg border-2 transition-all duration-200 text-left
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                ${isSelected ? 'shadow-lg' : 'hover:shadow-sm'}
              `}
              style={{
                backgroundColor: isSelected ? `${colors.primary}08` : colors.background,
                borderColor: isSelected ? colors.primary : colors.border
              }}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div 
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
              
              {/* Icon and title */}
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: isSelected ? colors.primary : `${colors.primary}20`,
                    color: isSelected ? 'white' : colors.primary
                  }}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                    {type.label}
                  </h3>
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    {type.shortDesc}
                  </p>
                </div>
              </div>
              
              {showDescriptions && (
                <>
                  {/* Long description */}
                  <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                    {type.longDesc}
                  </p>
                  
                  {/* Examples */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textMuted }}>
                      Examples
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.slice(0, 2).map((example, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: `${colors.primary}15`,
                            color: colors.primary
                          }}
                        >
                          {example}
                        </span>
                      ))}
                      {type.examples.length > 2 && (
                        <span 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: `${colors.primary}15`,
                            color: colors.primary
                          }}
                        >
                          +{type.examples.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Use cases */}
                  <div>
                    <h4 className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textMuted }}>
                      Best for
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {type.useCases.slice(0, 3).map((useCase, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 rounded text-xs border"
                          style={{ 
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.textMuted
                          }}
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Radio variant
  if (variant === 'radio') {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="text-sm font-medium" style={{ color: colors.text }}>Contact Type</h3>
        
        {contactTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = value === type.id;
          
          return (
            <label
              key={type.id}
              className={`
                flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
                ${isSelected ? 'shadow-sm' : ''}
              `}
              style={{
                backgroundColor: isSelected ? `${colors.primary}05` : colors.background,
                borderColor: isSelected ? colors.primary : colors.border
              }}
            >
              {/* Radio input */}
              <input
                type="radio"
                name="contactType"
                value={type.id}
                checked={isSelected}
                onChange={(e) => !disabled && onChange(e.target.value as 'individual' | 'corporate')}
                disabled={disabled}
                className="mt-1"
                style={{ accentColor: colors.primary }}
              />
              
              {/* Icon */}
              <div 
                className="p-2 rounded-md mt-0.5"
                style={{ 
                  backgroundColor: `${colors.primary}15`,
                  color: colors.primary
                }}
              >
                <IconComponent className="h-4 w-4" />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: colors.text }}>
                    {type.label}
                  </span>
                  {isSelected && (
                    <CheckCircle className="h-4 w-4" style={{ color: colors.primary }} />
                  )}
                </div>
                
                {showDescriptions && (
                  <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                    {type.shortDesc}
                  </p>
                )}
                
                {showDescriptions && size === 'lg' && (
                  <div className="mt-2">
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      Examples: {type.examples.slice(0, 2).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    );
  }

  return null;
};

// Export additional helper components for specific use cases

// Compact inline selector
export const CompactContactTypeSelector: React.FC<Omit<ContactTypeSelectorProps, 'variant' | 'showDescriptions'>> = (props) => (
  <ContactTypeSelector {...props} variant="tabs" showDescriptions={false} size="sm" />
);

// Full featured card selector
export const DetailedContactTypeSelector: React.FC<Omit<ContactTypeSelectorProps, 'variant' | 'showDescriptions' | 'size'>> = (props) => (
  <ContactTypeSelector {...props} variant="cards" showDescriptions={true} size="lg" />
);

// Simple radio selector
export const RadioContactTypeSelector: React.FC<Omit<ContactTypeSelectorProps, 'variant'>> = (props) => (
  <ContactTypeSelector {...props} variant="radio" />
);

export default ContactTypeSelector;