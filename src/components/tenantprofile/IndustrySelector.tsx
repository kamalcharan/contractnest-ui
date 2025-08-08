// src/components/tenantprofile/IndustrySelector.tsx
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { industries } from '@/utils/constants/industries';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface IndustrySelectorProps {
  value: string;
  onChange: (industryId: string) => void;
  disabled?: boolean;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get icon component from name
  const getIconComponent = (iconName: string, isSelected: boolean) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Circle;
    const iconColor = isSelected ? colors.brand.primary : colors.utility.secondaryText;
    
    return <IconComponent size={24} style={{ color: iconColor }} />;
  };
  
  // Filter industries based on search term
  const filteredIndustries = industries.filter(industry => 
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (industry.description && industry.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <div 
          className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          style={{ color: colors.utility.secondaryText }}
        >
          <Search size={18} />
        </div>
        <input
          type="search"
          placeholder="Search industries..."
          className="pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
          style={{
            borderColor: colors.utility.secondaryText + '40',
            backgroundColor: colors.utility.secondaryBackground,
            color: colors.utility.primaryText,
            '--tw-ring-color': colors.brand.primary
          } as React.CSSProperties}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
        />
      </div>
      
      {/* Industry grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIndustries.map((industry) => {
          const isSelected = value === industry.id;
          
          return (
            <div
              key={industry.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all relative shadow-sm",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: isSelected ? colors.brand.primary : colors.utility.secondaryText + '20',
                borderWidth: isSelected ? '2px' : '1px'
              }}
              onClick={() => !disabled && onChange(industry.id)}
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
              
              <div className="flex items-start space-x-3">
                <div 
                  className="p-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: isSelected 
                      ? colors.brand.primary + '10' 
                      : colors.utility.secondaryText + '10'
                  }}
                >
                  {getIconComponent(industry.icon, isSelected)}
                </div>
                
                <div className="flex-1">
                  <h3 
                    className="font-medium transition-colors"
                    style={{
                      color: isSelected ? colors.brand.primary : colors.utility.primaryText
                    }}
                  >
                    {industry.name}
                  </h3>
                  {industry.description && (
                    <p 
                      className="text-sm mt-1 line-clamp-2 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {industry.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredIndustries.length === 0 && (
        <div 
          className="text-center p-6 border border-dashed rounded-lg transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '30'
          }}
        >
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            No industries match your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default IndustrySelector;