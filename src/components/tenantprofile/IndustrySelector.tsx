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
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get icon component from name
  const getIconComponent = (iconName: string, isSelected: boolean) => {
    const IconComponent = (LucideIcons as Record<string, React.ComponentType<any>>)[iconName] || 
      LucideIcons.Circle;
    
    return <IconComponent size={24} className={isSelected ? "text-primary" : "text-muted-foreground"} />;
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
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <Search size={18} />
        </div>
        <input
          type="search"
          placeholder="Search industries..."
          className="pl-10 w-full p-2 border border-border rounded-md bg-card"
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
                "bg-card border rounded-lg p-4 cursor-pointer transition-all relative shadow-sm",
                isSelected ? "border-primary" : "border-border",
                disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:shadow"
              )}
              onClick={() => !disabled && onChange(industry.id)}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.00001 6.58579L10.2929 0.292893C10.6834 -0.097631 11.3166 -0.097631 11.7071 0.292893C12.0976 0.683418 12.0976 1.31658 11.7071 1.70711L4.70711 8.70711C4.31658 9.09763 3.68342 9.09763 3.29289 8.70711L0.292893 5.70711C-0.097631 5.31658 -0.097631 4.68342 0.292893 4.29289C0.683418 3.90237 1.31658 3.90237 1.70711 4.29289L4.00001 6.58579Z" fill="currentColor"/>
                  </svg>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "p-2 rounded-full",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}>
                  {getIconComponent(industry.icon, isSelected)}
                </div>
                
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium",
                    isSelected ? "text-primary" : ""
                  )}>
                    {industry.name}
                  </h3>
                  {industry.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
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
        <div className="text-center p-6 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No industries match your search.</p>
        </div>
      )}
    </div>
  );
};

export default IndustrySelector;