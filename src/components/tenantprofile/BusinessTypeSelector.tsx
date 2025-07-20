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
  const { isDarkMode } = useTheme();
  
  // Map business type IDs to icons
  const getIcon = (iconName: string, isSelected: boolean) => {
    const color = isSelected ? "currentColor" : "currentColor"; // Use theme colors
    
    switch (iconName) {
      case 'Building2':
        return <Building2 size={32} className={isSelected ? "text-primary" : "text-muted-foreground"} />;
      case 'ShoppingCart':
        return <ShoppingCart size={32} className={isSelected ? "text-primary" : "text-muted-foreground"} />;
      default:
        return <Building2 size={32} className={isSelected ? "text-primary" : "text-muted-foreground"} />;
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
              "bg-card border rounded-lg p-6 cursor-pointer transition-all relative shadow-sm",
              isSelected ? "border-primary" : "border-border",
              disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:shadow"
            )}
            onClick={() => !disabled && onChange(type.id)}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
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
                <h3 className={cn(
                  "font-semibold text-lg",
                  isSelected ? "text-primary" : ""
                )}>
                  {type.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BusinessTypeSelector;