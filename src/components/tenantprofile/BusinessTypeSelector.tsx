// src/components/tenantprofile/BusinessTypeSelector.tsx - Enhanced with Detailed Personas
import React, { useState } from 'react';
import { ShoppingCart, Wrench, Info, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { businessTypes } from '@/utils/constants/businessTypes';
import { cn } from '@/lib/utils';

interface BusinessTypeSelectorProps {
  value: string;
  onChange: (businessTypeId: string) => void;
  disabled?: boolean;
}

const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart':
        return ShoppingCart;
      case 'Wrench':
        return Wrench;
      default:
        return ShoppingCart;
    }
  };

  const selectedType = businessTypes.find(type => type.id === value);

  return (
    <div className="space-y-6">
      {/* Persona Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businessTypes.map((type) => {
          const Icon = getIcon(type.icon);
          const isSelected = value === type.id;
          const isHovered = hoveredType === type.id;
          
          return (
            <div
              key={type.id}
              className={cn(
                "relative rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg",
                disabled && "cursor-not-allowed opacity-50",
                isSelected && "ring-2 ring-offset-2"
              )}
              style={{
                borderColor: isSelected ? type.color : colors.utility.primaryText + '20',
                backgroundColor: colors.utility.secondaryBackground,
                '--tw-ring-color': type.color,
                '--tw-ring-offset-color': colors.utility.primaryBackground
              } as React.CSSProperties}
              onClick={() => !disabled && onChange(type.id)}
              onMouseEnter={() => !disabled && setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        backgroundColor: (isSelected || isHovered) ? type.color + '20' : colors.utility.primaryText + '10',
                        color: (isSelected || isHovered) ? type.color : colors.utility.secondaryText
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 
                        className="font-semibold text-lg transition-colors"
                        style={{ 
                          color: isSelected ? type.color : colors.utility.primaryText 
                        }}
                      >
                        {type.name}
                      </h3>
                      <p 
                        className="text-sm transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {type.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: type.color }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Role Explanation */}
                <div 
                  className="p-3 rounded-lg mb-4 transition-all"
                  style={{
                    backgroundColor: (isSelected || isHovered) ? type.color + '10' : colors.utility.primaryText + '05',
                    border: `1px solid ${(isSelected || isHovered) ? type.color + '20' : colors.utility.primaryText + '10'}`
                  }}
                >
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: colors.utility.primaryText }}
                  >
                    <strong>As a {type.name.split(' ')[0]}:</strong> {type.helpText.substring(0, 150)}...
                  </p>
                </div>

                {/* Quick Examples */}
                <div>
                  <h4 
                    className="font-medium text-sm mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Example Relationships:
                  </h4>
                  <ul className="space-y-1">
                    {type.examples.slice(0, 2).map((example, index) => (
                      <li 
                        key={index}
                        className="text-xs flex items-start transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: type.color }}
                        />
                        {example}
                      </li>
                    ))}
                  </ul>
                  {type.examples.length > 2 && (
                    <p 
                      className="text-xs mt-2 font-medium"
                      style={{ color: type.color }}
                    >
                      +{type.examples.length - 2} more examples
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Information for Selected Type */}
      {selectedType && (
        <div 
          className="rounded-lg border p-6 transition-all"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: selectedType.color + '30',
            borderLeft: `4px solid ${selectedType.color}`
          }}
        >
          <div className="flex items-start mb-4">
            <Info 
              className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0"
              style={{ color: selectedType.color }}
            />
            <div>
              <h3 
                className="font-semibold text-lg mb-2"
                style={{ color: colors.utility.primaryText }}
              >
                You've selected: {selectedType.name}
              </h3>
              <p 
                className="text-sm mb-4 leading-relaxed"
                style={{ color: colors.utility.primaryText }}
              >
                {selectedType.helpText}
              </p>
            </div>
          </div>

          {/* All Examples */}
          <div className="mb-4">
            <h4 
              className="font-medium mb-3"
              style={{ color: colors.utility.primaryText }}
            >
              Complete Examples for {selectedType.name}s:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {selectedType.examples.map((example, index) => (
                <div 
                  key={index}
                  className="text-sm flex items-start p-2 rounded transition-colors"
                  style={{ 
                    color: colors.utility.primaryText,
                    backgroundColor: selectedType.color + '05'
                  }}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full mr-3 mt-2 flex-shrink-0"
                    style={{ backgroundColor: selectedType.color }}
                  />
                  {example}
                </div>
              ))}
            </div>
          </div>

          {/* Platform Impact */}
          <div 
            className="p-4 rounded-lg"
            style={{
              backgroundColor: selectedType.color + '08',
              border: `1px solid ${selectedType.color}20`
            }}
          >
            <h4 
              className="font-medium text-sm mb-3"
              style={{ color: colors.utility.primaryText }}
            >
              How this customizes your ContractNest experience:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedType.id === 'buyer' ? (
                <>
                  <div className="text-sm">
                    <div 
                      className="font-medium mb-1"
                      style={{ color: selectedType.color }}
                    >
                      Dashboard & Tools
                    </div>
                    <div style={{ color: colors.utility.secondaryText }}>
                      Service request tracking, vendor management, SLA monitoring
                    </div>
                  </div>
                  <div className="text-sm">
                    <div 
                      className="font-medium mb-1"
                      style={{ color: selectedType.color }}
                    >
                      Key Workflows
                    </div>
                    <div style={{ color: colors.utility.secondaryText }}>
                      Invoice approval, vendor evaluation, compliance tracking
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm">
                    <div 
                      className="font-medium mb-1"
                      style={{ color: selectedType.color }}
                    >
                      Dashboard & Tools
                    </div>
                    <div style={{ color: colors.utility.secondaryText }}>
                      Client relationship management, service delivery tracking
                    </div>
                  </div>
                  <div className="text-sm">
                    <div 
                      className="font-medium mb-1"
                      style={{ color: selectedType.color }}
                    >
                      Key Workflows
                    </div>
                    <div style={{ color: colors.utility.secondaryText }}>
                      Service scheduling, billing management, performance metrics
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p 
          className="text-xs"
          style={{ color: colors.utility.secondaryText }}
        >
          Choose the role that best describes your organization's primary function in service contracts. 
          You can change this later in your business profile settings.
        </p>
      </div>
    </div>
  );
};

export default BusinessTypeSelector;