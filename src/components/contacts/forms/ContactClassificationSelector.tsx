// src/components/contacts/forms/ContactClassificationSelector.tsx - CLEAN VERSION
import React from 'react';
import { 
  Tag, 
  Info, 
  X, 
  AlertCircle,
  ShoppingCart,
  DollarSign,
  Package,
  Handshake,
  Users
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { CONTACT_CLASSIFICATION_CONFIG } from '@/utils/constants/contacts';

interface ContactClassification {
  id?: string;
  classification_value: string;
  classification_label: string;
}

interface ContactClassificationsSectionProps {
  value: ContactClassification[];
  onChange: (classifications: ContactClassification[]) => void;
  disabled?: boolean;
  showValidation?: boolean;
}

const ContactClassificationSelector: React.FC<ContactClassificationsSectionProps> = ({
  value,
  onChange,
  disabled = false,
  showValidation = true
}) => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();

  // Map classification IDs to icons
  const getClassificationIcon = (classificationId: string) => {
    const iconMap = {
      'buyer': ShoppingCart,
      'seller': DollarSign,
      'vendor': Package,
      'partner': Handshake,
      'team_member': Users
    };
    return iconMap[classificationId as keyof typeof iconMap] || Tag;
  };

  // Get color classes for each classification
  const getColorClasses = (classificationId: string, isSelected: boolean) => {
    const colorMap = {
      'buyer': {
        selected: 'bg-blue-500 text-white',
        unselected: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      },
      'seller': {
        selected: 'bg-green-500 text-white',
        unselected: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      },
      'vendor': {
        selected: 'bg-purple-500 text-white',
        unselected: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      },
      'partner': {
        selected: 'bg-orange-500 text-white',
        unselected: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
      },
      'team_member': {
        selected: 'bg-indigo-500 text-white',
        unselected: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
      }
    };
    
    const colors = colorMap[classificationId as keyof typeof colorMap];
    return colors ? (isSelected ? colors.selected : colors.unselected) : 'bg-gray-100 text-gray-700';
  };

  const classifications = CONTACT_CLASSIFICATION_CONFIG;

  // Toggle classification selection
  const toggleClassification = (classification: typeof classifications[0]) => {
    if (disabled) return;

    const exists = value.some(c => c.classification_value === classification.id);

    if (exists) {
      // Remove classification
      const newValue = value.filter(c => c.classification_value !== classification.id);
      onChange(newValue);
      
      toast({
        title: "Classification Removed",
        description: `${classification.label} has been removed`
      });
    } else {
      // Add classification
      const newClassification: ContactClassification = {
        id: `temp_${Date.now()}_${classification.id}`,
        classification_value: classification.id,
        classification_label: classification.label
      };

      onChange([...value, newClassification]);
      
      toast({
        title: "Classification Added",
        description: `${classification.label} has been added`
      });
    }
  };

  // Check if classification is selected
  const isSelected = (classificationId: string): boolean => {
    return value.some(c => c.classification_value === classificationId);
  };

  const remainingCount = classifications.length - value.length;

  return (
    <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Classification <span className="text-destructive">*</span>
        </h2>
        <div className="text-muted-foreground">
          <Info className="h-4 w-4" />
        </div>
      </div>

      {/* Info Message */}
      <div className="mb-4 p-3 rounded-md bg-sky-50 dark:bg-sky-900/10 text-sky-600 dark:text-sky-400">
        <p className="text-sm flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Select all classifications that apply to this contact
        </p>
      </div>

      {/* Classification Options */}
      <div className="space-y-3 mb-4">
        {classifications.map((classification) => {
          const selected = isSelected(classification.id);
          const IconComponent = getClassificationIcon(classification.id);
          
          return (
            <button
              key={`classification-${classification.id}`}
              onClick={() => toggleClassification(classification)}
              disabled={disabled}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left w-full
                ${selected 
                  ? 'border-primary shadow-md bg-white dark:bg-gray-800' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-sm bg-white dark:bg-gray-800'
                } 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2.5 rounded-lg transition-colors
                  ${getColorClasses(classification.id, selected)}
                `}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-sm text-foreground mb-1">
                    {classification.label}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {classification.description}
                  </div>
                </div>
                
                {selected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <strong className="text-foreground">{value.length}</strong> classification{value.length !== 1 ? 's' : ''} selected
          {remainingCount > 0 && (
            <span className="text-muted-foreground"> ({remainingCount} remaining)</span>
          )}
        </div>

        {/* Selected Classifications Display */}
        {value.length > 0 && (
          <>
            <div className="text-sm font-medium text-foreground">Selected:</div>
            <div className="flex flex-wrap gap-2">
              {value.map((classification, index) => {
                const IconComponent = getClassificationIcon(classification.classification_value);
                
                return (
                  <div
                    key={`selected-${classification.classification_value}-${index}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{classification.classification_label}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const configItem = classifications.find(c => c.id === classification.classification_value);
                        if (configItem) {
                          toggleClassification(configItem);
                        }
                      }}
                      className="ml-1 hover:text-destructive transition-colors"
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Tip when no classifications selected */}
        {value.length === 0 && (
          <div className="mt-4 p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span><strong>Tip:</strong> Classifications help organize your contacts and determine their role in your business relationships.</span>
            </p>
          </div>
        )}
      </div>

      {/* Validation Message */}
      {showValidation && value.length === 0 && (
        <div className="mt-4 p-3 rounded-md border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            At least one classification is required
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactClassificationSelector;