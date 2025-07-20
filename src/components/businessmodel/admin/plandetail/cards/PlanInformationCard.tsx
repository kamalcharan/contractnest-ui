// src/components/businessmodel/admin/plandetail/cards/PlanInformationCard.tsx

import React from 'react';
import { FileText } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';

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
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 bg-muted/20 border-b border-border flex items-center">
        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Plan Information</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Type */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Plan Type</h3>
            <p className="text-foreground">{planType}</p>
          </div>
          
          {/* Trial Duration */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Trial Duration</h3>
            <p className="text-foreground">
              {trialDuration > 0 ? `${trialDuration} days` : 'No trial'}
            </p>
          </div>
          
          {/* Default Currency */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Default Currency</h3>
            <p className="text-foreground">
              {getCurrencySymbol(defaultCurrencyCode)} {defaultCurrencyCode}
            </p>
          </div>
          
          {/* Supported Currencies */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Supported Currencies</h3>
            <div className="flex flex-wrap gap-1">
              {supportedCurrencies.map(currency => (
                <span 
                  key={currency} 
                  className={`px-2 py-1 text-xs rounded-full ${
                    currency === defaultCurrencyCode 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {getCurrencySymbol(currency)} {currency}
                  {currency === defaultCurrencyCode && ' (Default)'}
                </span>
              ))}
            </div>
          </div>
          
          {/* Created Date */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Created</h3>
            <p className="text-foreground">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {/* Last Updated */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Last Updated</h3>
            <p className="text-foreground">
              {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>
          
          {/* Active Version */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Version</h3>
            <p className="text-foreground">
              {activeVersion ? (
                <>
                  v{activeVersion.version_number} 
                  <span className="text-muted-foreground ml-2">
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