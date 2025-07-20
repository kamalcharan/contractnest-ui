// src/components/businessmodel/tenants/pricing/FeatureList.tsx

import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { PlanFeature, PlanNotification } from '@/lib/constants/pricing';
import { getCurrencySymbol } from '@/utils/constants/currencies';

interface FeatureListProps {
  features: PlanFeature[];
  notifications: PlanNotification[];
  currency: string;
  compact?: boolean;
}

const FeatureList: React.FC<FeatureListProps> = ({
  features,
  notifications,
  currency,
  compact = false
}) => {
  // Helper to get feature name from ID
  const getFeatureName = (featureId: string): string => {
    switch (featureId) {
      case 'contacts':
        return 'Contacts';
      case 'contracts':
        return 'Contracts';
      case 'documents':
        return 'Document Storage';
      case 'vani':
        return 'VaNi AI Assistant';
      case 'marketplace':
        return 'Marketplace Access';
      case 'finance':
        return 'Finance Tools';
      case 'appointments':
        return 'Appointments';
      default:
        return featureId.charAt(0).toUpperCase() + featureId.slice(1);
    }
  };
  
  // Format currency
  const formatPrice = (price: number | undefined): string => {
    if (!price) return '';
    return `${getCurrencySymbol(currency)}${price.toFixed(2)}`;
  };
  
  // Get special feature price
  const getFeaturePrice = (feature: PlanFeature): number | undefined => {
    if (!feature.additionalPrice) return undefined;
    return feature.currencyPrices && feature.currencyPrices[currency] 
      ? feature.currencyPrices[currency] 
      : feature.additionalPrice;
  };
  
  return (
    <div className={`space-y-${compact ? '1' : '2'}`}>
      {/* Standard Features */}
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          {feature.enabled ? (
            <CheckCircle className={`h-4 w-4 mr-2 text-green-500 ${compact ? '' : 'mt-0.5'}`} />
          ) : (
            <X className={`h-4 w-4 mr-2 text-muted-foreground ${compact ? '' : 'mt-0.5'}`} />
          )}
          <div>
            <span className={`${compact ? 'text-xs' : 'text-sm'}`}>
              {getFeatureName(feature.featureId)}
            </span>
            <span className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground ml-1`}>
              ({feature.limit})
            </span>
            
            {/* Special feature price */}
            {feature.additionalPrice && (
              <span className={`block ${compact ? 'text-xs' : 'text-xs'} text-amber-600 dark:text-amber-400`}>
                +{formatPrice(getFeaturePrice(feature))}
                /{feature.pricingPeriod}
              </span>
            )}
          </div>
        </div>
      ))}
      
      {/* Notification Credits - show just a few in standard view */}
      <div className="border-t border-border pt-2 mt-2">
        <div className={`${compact ? 'text-xs' : 'text-sm'} font-medium mb-1`}>
          Included Credits:
        </div>
        
        {notifications.slice(0, compact ? 2 : 3).map((notification, index) => (
          <div key={index} className="flex items-start">
            <CheckCircle className={`h-4 w-4 mr-2 text-green-500 ${compact ? '' : 'mt-0.5'}`} />
            <div className={`${compact ? 'text-xs' : 'text-sm'}`}>
              {notification.creditsPerUnit} {notification.method} Credits
            </div>
          </div>
        ))}
        
        {notifications.length > 3 && !compact && (
          <div className="text-xs text-muted-foreground mt-1">
            +{notifications.length - 3} more notification types
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureList;