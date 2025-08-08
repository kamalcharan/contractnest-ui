// src/components/contacts/forms/ContactClassificationSelector.tsx
import React, { useState, useEffect } from 'react';
import { Info, Check, Loader2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import ContactService from '../../../services/contactService';
import { CONTACT_CLASSIFICATIONS } from '../../../utils/constants/contacts';
import { useToast } from '@/components/ui/use-toast';
import { captureException } from '@/utils/sentry';

// Create service instance
const contactService = new ContactService();

// Types
type ContactClassificationType = string;

interface ContactClassificationSelectorProps {
  value: ContactClassificationType[];
  onChange: (classifications: ContactClassificationType[]) => void;
  disabled?: boolean;
  industry?: string;
  className?: string;
  required?: boolean;
  maxSelections?: number;
}

interface ClassificationOption {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  industry?: string[];
}

// Classifications from your constants with UI metadata
const DEFAULT_CLASSIFICATIONS: ClassificationOption[] = [
  {
    id: CONTACT_CLASSIFICATIONS.BUYER,
    label: 'Buyer',
    description: 'Purchases services/products from us',
    color: 'blue',
    icon: '🛒',
    industry: ['all']
  },
  {
    id: CONTACT_CLASSIFICATIONS.SELLER,
    label: 'Seller',
    description: 'Sells services/products to us',
    color: 'green',
    icon: '💰',
    industry: ['all']
  },
  {
    id: CONTACT_CLASSIFICATIONS.VENDOR,
    label: 'Vendor',
    description: 'Supplies products/services to us',
    color: 'purple',
    icon: '📦',
    industry: ['all']
  },
  {
    id: CONTACT_CLASSIFICATIONS.PARTNER,
    label: 'Partner',
    description: 'Business collaboration partner',
    color: 'orange',
    icon: '🤝',
    industry: ['all']
  }
];

const ContactClassificationSelector: React.FC<ContactClassificationSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  industry = 'all',
  className = '',
  required = true,
  maxSelections = 5
}) => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  
  // State
  const [classifications, setClassifications] = useState<ClassificationOption[]>(DEFAULT_CLASSIFICATIONS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Load classifications from API (optional - can be removed if only using constants)
  const loadClassifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const constants = await contactService.getContactConstants();
      
      if (constants.classifications && constants.classifications.length > 0) {
        // Map API classifications to our format, but only use the ones from our constants
        const validClassifications = Object.values(CONTACT_CLASSIFICATIONS);
        const apiClassifications: ClassificationOption[] = constants.classifications
          .filter((cls: string) => validClassifications.includes(cls))
          .map((cls: string) => {
            // Find the matching default classification
            const defaultClass = DEFAULT_CLASSIFICATIONS.find(c => c.id === cls);
            return defaultClass || {
              id: cls,
              label: cls.charAt(0).toUpperCase() + cls.slice(1),
              description: `${cls.charAt(0).toUpperCase() + cls.slice(1)} classification`,
              color: 'gray',
              icon: '📋',
              industry: ['all']
            };
          });
        
        if (apiClassifications.length > 0) {
          setClassifications(apiClassifications);
        }
      }
    } catch (err: any) {
      console.error('Error loading classifications:', err);
      captureException(err, {
        tags: { component: 'ContactClassificationSelector', action: 'loadClassifications' }
      });
      // Just use default classifications on error
    } finally {
      setLoading(false);
    }
  };

  // Load classifications on mount (optional)
  useEffect(() => {
    loadClassifications();
  }, []);

  // Toggle classification selection
  const toggleClassification = (classificationId: string) => {
    if (disabled) return;
    
    const isSelected = value.includes(classificationId);
    let newSelections: string[];
    
    if (isSelected) {
      // Deselect - but ensure at least one remains if required
      newSelections = value.filter(c => c !== classificationId);
      if (required && newSelections.length === 0) {
        toast({
          variant: "destructive",
          title: "Required Field",
          description: "At least one classification must be selected"
        });
        return;
      }
    } else {
      // Select - but respect max selections
      if (value.length >= maxSelections) {
        toast({
          variant: "destructive",
          title: "Maximum Reached",
          description: `You can only select up to ${maxSelections} classifications`
        });
        return;
      }
      newSelections = [...value, classificationId];
    }
    
    onChange(newSelections);
  };

  // Get classification button classes based on state
  const getClassificationClasses = (classification: ClassificationOption, isSelected: boolean) => {
    const baseClasses = "w-full p-3 rounded-lg border-2 transition-all text-left relative";
    
    if (disabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed bg-muted border-border text-muted-foreground`;
    }

    if (isSelected) {
      const colorMap = {
        blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 dark:border-blue-400',
        green: 'bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-400',
        purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-500 dark:border-purple-400',
        orange: 'bg-orange-50 dark:bg-orange-950/20 border-orange-500 dark:border-orange-400',
        gray: 'bg-gray-50 dark:bg-gray-950/20 border-gray-500 dark:border-gray-400'
      };
      
      return `${baseClasses} ${colorMap[classification.color as keyof typeof colorMap] || colorMap.gray} cursor-pointer`;
    } else {
      return `${baseClasses} bg-card border-border hover:border-primary/50 cursor-pointer`;
    }
  };

  // Retry loading
  const handleRetry = () => {
    loadClassifications();
  };

  return (
    <div className={`rounded-lg shadow-sm border p-4 bg-card border-border ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Classification {required && <span className="text-destructive">*</span>}
        </h3>
        <div className="relative">
          <button 
            className="p-1 rounded-full hover:bg-accent transition-colors text-muted-foreground"
            onClick={() => setShowInfo(!showInfo)}
            type="button"
          >
            <Info className="h-4 w-4" />
          </button>
          {showInfo && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-md z-10 whitespace-nowrap pointer-events-none text-xs bg-popover text-popover-foreground shadow-md border">
              Select how this contact relates to your business
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover"></div>
            </div>
          )}
        </div>
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 rounded-md border bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm text-destructive">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 flex items-center gap-1 text-xs hover:underline text-destructive"
                type="button"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="p-3 rounded-lg border-2 bg-muted border-border">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-muted-foreground/20"></div>
                  <div className="flex-1">
                    <div className="h-4 rounded mb-1 bg-muted-foreground/20"></div>
                    <div className="h-3 rounded w-3/4 bg-muted-foreground/10"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classifications List */}
      {!loading && (
        <div className="space-y-3">
          {classifications.map((classification) => {
            const isSelected = value.includes(classification.id);
            
            return (
              <button
                key={classification.id}
                onClick={() => toggleClassification(classification.id)}
                disabled={disabled}
                className={getClassificationClasses(classification, isSelected)}
                type="button"
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                    classification.color === 'blue' ? 'bg-blue-500' :
                    classification.color === 'green' ? 'bg-green-500' :
                    classification.color === 'purple' ? 'bg-purple-500' :
                    classification.color === 'orange' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`}>
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div className="pr-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{classification.icon}</span>
                    <span className="font-medium text-foreground">
                      {classification.label}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {classification.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selection Info */}
      <div className="mt-4 space-y-2">
        {/* Validation Message */}
        {required && value.length === 0 && (
          <div className="p-2 rounded-md border bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              Please select at least one classification
            </p>
          </div>
        )}

        {/* Max Selections Warning */}
        {value.length >= maxSelections && (
          <div className="p-2 rounded-md border bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              Maximum {maxSelections} classifications allowed
            </p>
          </div>
        )}

        {/* Selection Summary */}
        {value.length > 0 && (
          <div className="p-2 rounded-md border bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
            <p className="text-xs text-green-800 dark:text-green-200">
              <strong>{value.length}</strong> classification{value.length !== 1 ? 's' : ''} selected
              {maxSelections > 1 && ` (${maxSelections - value.length} remaining)`}
            </p>
          </div>
        )}
      </div>

      {/* Selected Classifications Preview */}
      {value.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 text-foreground">Selected:</h4>
          <div className="flex flex-wrap gap-2">
            {value.map((selectedId) => {
              const classification = classifications.find(c => c.id === selectedId);
              if (!classification) return null;
              
              return (
                <span
                  key={selectedId}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                    classification.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300' :
                    classification.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300' :
                    classification.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300' :
                    classification.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300' :
                    'bg-gray-100 dark:bg-gray-900/20 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{classification.icon}</span>
                  {classification.label}
                  {!disabled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleClassification(selectedId);
                      }}
                      className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-2 rounded-md bg-muted">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Classifications help organize your contacts and enable better filtering. 
          You can select multiple classifications that best describe your business relationship.
        </p>
      </div>
    </div>
  );
};

export default ContactClassificationSelector;