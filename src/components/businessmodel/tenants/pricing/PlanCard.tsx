// src/components/businessmodel/tenants/pricing/PlanCard.tsx

import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { PricingPlan } from '@/lib/constants/pricing';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import FeatureList from './FeatureList';

interface PlanCardProps {
  plan: PricingPlan;
  isActive: boolean;
  currency: string;
  onSubscribe: () => void;
  onStartTrial: () => void;
  onManagePlan: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isActive,
  currency,
  onSubscribe,
  onStartTrial,
  onManagePlan
}) => {
  // Get the appropriate tier price for the selected currency
  const getTierPrice = (): number => {
    // Just use the first tier for display on the card
    const firstTier = plan.tiers[0];
    return firstTier.currencyPrices[currency] || firstTier.basePrice;
  };
  
  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    return `${getCurrencySymbol(currency)}${price.toFixed(2)}`;
  };
  
  const price = getTierPrice();
  
  return (
    <div 
      className={`bg-card rounded-lg border ${
        isActive ? 'border-primary' : 'border-border'
      } overflow-hidden transition-all hover:shadow-md relative`}
    >
      {/* Active Plan Badge */}
      {isActive && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
          Your Current Plan
        </div>
      )}
      
      {/* Plan Header */}
      <div className={`px-6 py-4 ${
        isActive ? 'bg-primary/10' : 'bg-muted/10'
      } border-b border-border`}>
        <h2 className="text-lg font-semibold">{plan.name}</h2>
      </div>
      
      {/* Plan Content */}
      <div className="p-6 space-y-4">
        <div className="text-center">
          <span className="text-3xl font-bold">
            {formatPrice(price)}
          </span>
          <span className="text-muted-foreground ml-1">
            /{plan.plan_type === 'Per User' ? 'user' : 'contract'}/month
          </span>
        </div>
        
        <div className="text-sm text-center text-muted-foreground">
          {plan.description}
        </div>
        
        {/* Features List */}
        <FeatureList 
          features={plan.features} 
          notifications={plan.notifications}
          currency={currency}
        />
        
        {/* Call to Action */}
        <div className="pt-4 space-y-2">
          {isActive ? (
            <>
              <button
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                onClick={onManagePlan}
              >
                Manage Plan
              </button>
              <button
                className="w-full px-4 py-2 border border-border bg-background hover:bg-muted transition-colors rounded-md text-sm"
                onClick={onSubscribe}
              >
                Upgrade
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                onClick={onSubscribe}
              >
                Subscribe
              </button>
              {plan.trialDuration > 0 && (
                <button
                  className="w-full px-4 py-2 border border-border bg-background hover:bg-muted transition-colors rounded-md text-sm"
                  onClick={onStartTrial}
                >
                  Start {plan.trialDuration}-day Free Trial
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;