// src/components/businessmodel/admin/plandetail/cards/PlanInformationCard.tsx

import React from 'react';
import { FileText } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import { useTheme } from '@/contexts/ThemeContext';

interface PlanInformationCardProps {
  planType: string;
  trialDuration: number;
  supportedCurrencies: string[];
  defaultCurrencyCode: string;
  createdAt: string;
  updatedAt: string;
  activeVersion?: {
    version_number: string;
    effective_date: string;
  } | null;
}

const PlanInformationCard: React.FC<PlanInformationCardProps> = ({
  planType,
  trialDuration,
  supportedCurrencies = [],
  defaultCurrencyCode,
  createdAt,
  updatedAt,
  activeVersion
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className="rounded-lg border overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20'
      }}
    >
      <div 
        className="px-6 py-4 border-b flex items-center transition-colors"
        style={{
          backgroundColor: colors.utility.primaryBackground + '20',
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <FileText 
          className="h-5 w-5 mr-2 transition-colors" 
          style={{ color: colors.utility.secondaryText }}
        />
        <h2 
          className="text-lg font-semibold transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Plan Information
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Type */}
          <div>
            <h3 
              className="text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Plan Type
            </h3>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {planType}
            </p>
          </div>
          
          {/* Trial Duration */}
          <div>
            <h3 
              className="text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Trial Duration
            </h3>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {trialDuration > 0 ? `${trialDuration} days` : 'No trial'}
            </p>
          </div>
          
          {/* Default Currency */}
          <div>
            <h3 
              className="text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Default Currency
            </h3>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {getCurrencySymbol(defaultCurrencyCode)} {defaultCurrencyCode}
            </p>
          </div>
          
          {/* Supported Currencies */}
          <div>
            <h3 
              className="text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Supported Currencies
            </h3>
            <div className="flex flex-wrap gap-1">
              {supportedCurrencies.map(currency => (
                <span 
                  key={currency} 
                  className="px-2 py-1 text-xs rounded-full transition-colors"
                  style={{
                    backgroundColor: currency === defaultCurrencyCode 
                      ? colors.brand.primary
                      : colors.utility.primaryBackground + '80',
                    color: currency === defaultCurrencyCode 
                      ? '#FFFFFF'
                      : colors.utility.secondaryText
                  }}
                >
                  {getCurrencySymbol(currency)} {currency}
                  {currency === defaultCurrencyCode && ' (Default)'}
                </span>
              ))}
            </div>
          </div>
          
          {/* Created Date */}
          <div>
            <h3 
              className="text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Created
            </h3>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {/* Last Updated */}
          <div>
            <h3 
              className="text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Last Updated
            </h3>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>
          
          {/* Active Version */}
          <div className="md:col-span-2">
            <h3 
              className="text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Active Version
            </h3>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {activeVersion ? (
                <>
                  v{activeVersion.version_number} 
                  <span 
                    className="ml-2 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    (Since {new Date(activeVersion.effective_date).toLocaleDateString()})
                  </span>
                </>
              ) : (
                'No active version'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanInformationCard;