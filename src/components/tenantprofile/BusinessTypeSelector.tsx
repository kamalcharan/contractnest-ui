// src/components/tenantprofile/BusinessTypeSelector.tsx
import React from 'react';
import { Building2, ShoppingCart } from 'lucide-react';
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
  
  // Map business type IDs to icons
  const getIcon = (iconName: string, isSelected: boolean) => {
    const iconColor = isSelected ? colors.brand.primary : colors.utility.secondaryText;
    
    switch (iconName) {
      case 'Building2':
        return <Building2 size={32} style={{ color: iconColor }} />;
      case 'ShoppingCart':
        return <ShoppingCart size={32} style={{ color: iconColor }} />;
      default:
        return <Building2 size={32} style={{ color: iconColor }} />;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {businessTypes.map((type) => {
        const isSelected = value === type.id;
        
        return (
          <div
            key={type.id}
            className={cn(
              "border rounded-lg p-6 cursor-pointer transition-all relative shadow-sm",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: isSelected ? colors.brand.primary : colors.utility.secondaryText + '20',
              borderWidth: isSelected ? '2px' : '1px'
            }}
            onClick={() => !disabled && onChange(type.id)}
            onMouseEnter={(e) => {
              if (!disabled && !isSelected) {
                e.currentTarget.style.borderColor = colors.brand.primary + '60';
                e.currentTarget.style.boxShadow = `0 4px 6px -1px ${colors.utility.secondaryText}20`;
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled && !isSelected) {
                e.currentTarget.style.borderColor = colors.utility.secondaryText + '20';
                e.currentTarget.style.boxShadow = `0 1px 3px 0 ${colors.utility.secondaryText}10`;
              }
            }}
          >
            {isSelected && (
              <div 
                className="absolute top-4 right-4 h-6 w-6 rounded-full flex items-center justify-center text-white transition-colors"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.00001 6.58579L10.2929 0.292893C10.6834 -0.097631 11.3166 -0.097631 11.7071 0.292893C12.0976 0.683418 12.0976 1.31658 11.7071 1.70711L4.70711 8.70711C4.31658 9.09763 3.68342 9.09763 3.29289 8.70711L0.292893 5.70711C-0.097631 5.31658 -0.097631 4.68342 0.292893 4.29289C0.683418 3.90237 1.31658 3.90237 1.70711 4.29289L4.00001 6.58579Z" fill="currentColor"/>
                </svg>
              </div>
            )}
            
            <div className="flex flex-col space-y-4">
              <div className="p-3">
                {getIcon(type.icon, isSelected)}
              </div>
              
              <div>
                <h3 
                  className="font-semibold text-lg transition-colors"
                  style={{
                    color: isSelected ? colors.brand.primary : colors.utility.primaryText
                  }}
                >
                  {type.name}
                </h3>
                <p 
                  className="text-sm mt-1 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {type.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BusinessTypeSelector;