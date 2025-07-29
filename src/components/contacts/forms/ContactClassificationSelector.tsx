// src/components/contacts/forms/ContactClassificationSelector.tsx - Right Sidebar Version
import React from 'react';
import { Info, Check } from 'lucide-react';
import { 
  DOMAIN_CLASSIFICATIONS, 
  getClassificationsForIndustry 
} from '../../../utils/constants/contacts';

type ContactClassificationType = string; // Made flexible for domain-specific types

interface ContactClassificationSelectorProps {
  value: ContactClassificationType[];
  onChange: (classifications: ContactClassificationType[]) => void;
  disabled?: boolean;
  industry?: string; // Industry from business profile or settings
  className?: string; // For positioning (right sidebar)
}

const ContactClassificationSelector: React.FC<ContactClassificationSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  industry = 'default',
  className = ''
}) => {
  // Get industry-specific classifications
  const classifications = getClassificationsForIndustry(industry);

  const toggleClassification = (classificationId: string) => {
    if (disabled) return;
    
    const isSelected = value.includes(classificationId);
    if (isSelected) {
      onChange(value.filter(c => c !== classificationId));
    } else {
      onChange([...value, classificationId]);
    }
  };

  // Get color classes for classification
  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      blue: isSelected 
        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
        : 'border-border hover:border-blue-300',
      green: isSelected 
        ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
        : 'border-border hover:border-green-300',
      purple: isSelected 
        ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' 
        : 'border-border hover:border-purple-300',
      orange: isSelected 
        ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' 
        : 'border-border hover:border-orange-300'
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className={`bg-card rounded-lg shadow-sm border border-border p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-semibold">Classification</h3>
        <div className="relative group">
          <button className="p-1 rounded-full hover:bg-muted transition-colors">
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
            Select how this contact relates to your business
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      
      {/* Industry Context Info */}
      {industry !== 'default' && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-400">
            📋 Classifications for <strong>{industry.charAt(0).toUpperCase() + industry.slice(1)}</strong> industry
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        {classifications.map((classification) => {
          const isSelected = value.includes(classification.id);
          
          return (
            <button
              key={classification.id}
              onClick={() => toggleClassification(classification.id)}
              disabled={disabled}
              className={`
                w-full p-3 rounded-lg border-2 transition-all text-left relative
                ${getColorClasses(classification.color, isSelected)}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-current flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              
              <div className="pr-8"> {/* Space for the check icon */}
                <div className={`font-medium mb-1 ${isSelected ? 'text-current' : 'text-foreground'}`}>
                  {classification.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {classification.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Validation Message */}
      {value.length === 0 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
          <p className="text-xs text-yellow-800 dark:text-yellow-400">
            Please select at least one classification
          </p>
        </div>
      )}

      {/* Selection Summary */}
      {value.length > 0 && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:border-green-800">
          <p className="text-xs text-green-800 dark:text-green-400">
            <strong>{value.length}</strong> classification{value.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactClassificationSelector;