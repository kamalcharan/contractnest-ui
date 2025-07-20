// src/components/businessmodel/tenants/pricing/PlanComparison.tsx

import React, { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import { PricingPlan } from '@/lib/constants/pricing';
import { getCurrencySymbol } from '@/utils/constants/currencies';

interface PlanComparisonProps {
  plans: PricingPlan[];
  currency: string;
  currentPlanId?: string;
  onSubscribe: (planId: string) => void;
  onStartTrial: (planId: string) => void;
}

const PlanComparison: React.FC<PlanComparisonProps> = ({
  plans,
  currency,
  currentPlanId,
  onSubscribe,
  onStartTrial
}) => {
  const [selectedPlanType, setSelectedPlanType] = useState<'Per User' | 'Per Contract'>(
    // Default to the type of the first plan, or 'Per User' if no plans
    plans.length > 0 ? plans[0].plan_type : 'Per User'
  );
  
  // Filter plans by selected type
  const filteredPlans = plans.filter(plan => plan.plan_type === selectedPlanType);
  
  // Get the appropriate tier price for the selected currency
  const getTierPrice = (plan: PricingPlan): number => {
    // Just use the first tier for display on the comparison
    const firstTier = plan.tiers[0];
    return firstTier.currencyPrices[currency] || firstTier.basePrice;
  };
  
  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    return `${getCurrencySymbol(currency)}${price.toFixed(2)}`;
  };
  
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
  
  // Get all unique features across plans
  const getAllFeatures = (): string[] => {
    const featureSet = new Set<string>();
    
    filteredPlans.forEach(plan => {
      plan.features.forEach(feature => {
        featureSet.add(feature.featureId);
      });
    });
    
    return Array.from(featureSet);
  };
  
  // Get all unique notification methods across plans
  const getAllNotificationMethods = (): string[] => {
    const methodsSet = new Set<string>();
    
    filteredPlans.forEach(plan => {
      plan.notifications.forEach(notification => {
        methodsSet.add(notification.method);
      });
    });
    
    return Array.from(methodsSet);
  };
  
  // Find feature in plan
  const findFeatureInPlan = (plan: PricingPlan, featureId: string) => {
    return plan.features.find(f => f.featureId === featureId);
  };
  
  // Find notification in plan
  const findNotificationInPlan = (plan: PricingPlan, method: string) => {
    return plan.notifications.find(n => n.method === method);
  };
  
  // Get special feature price
  const getFeaturePrice = (feature: any): string => {
    if (!feature || !feature.additionalPrice) return 'Included';
    const price = feature.currencyPrices && feature.currencyPrices[currency] 
      ? feature.currencyPrices[currency] 
      : feature.additionalPrice;
    return `+${formatPrice(price)}/${feature.pricingPeriod}`;
  };
  
  return (
    <div className="overflow-hidden">
      {/* Plan Type Toggle */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setSelectedPlanType('Per User')}
            className={`px-4 py-2 text-sm font-medium ${
              selectedPlanType === 'Per User'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            } rounded-l-md border border-gray-200 dark:border-gray-600`}
          >
            User-based
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlanType('Per Contract')}
            className={`px-4 py-2 text-sm font-medium ${
              selectedPlanType === 'Per Contract'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            } rounded-r-md border border-gray-200 dark:border-gray-600`}
          >
            Contract-based
          </button>
        </div>
      </div>
      
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left bg-muted/10 border-b border-r border-border"></th>
              {filteredPlans.map(plan => (
                <th 
                  key={plan.id} 
                  className={`p-4 text-center bg-muted/10 border-b border-r border-border min-w-[200px] ${
                    plan.id === currentPlanId ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="font-bold text-lg">{plan.name}</div>
                  <div className="text-sm text-muted-foreground">{plan.description}</div>
                </th>
              ))}
            </tr>
            <tr>
              <th className="p-4 text-left bg-muted/5 border-b border-r border-border">Pricing</th>
              {filteredPlans.map(plan => (
                <th 
                  key={plan.id} 
                  className={`p-4 text-center bg-muted/5 border-b border-r border-border ${
                    plan.id === currentPlanId ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="text-2xl font-bold">{formatPrice(getTierPrice(plan))}</div>
                  <div className="text-sm text-muted-foreground">
                    per {plan.plan_type === 'Per User' ? 'user' : 'contract'}/month
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {plan.id === currentPlanId ? (
                      <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs inline-block dark:bg-green-900/30 dark:text-green-400">
                        Current Plan
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onSubscribe(plan.id)}
                          className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Subscribe
                        </button>
                        {plan.trialDuration > 0 && (
                          <button
                            onClick={() => onStartTrial(plan.id)}
                            className="block w-full px-4 py-2 border border-border bg-background hover:bg-muted transition-colors rounded-md text-sm"
                          >
                            {plan.trialDuration}-day Trial
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic Features */}
            <tr>
              <td 
                colSpan={filteredPlans.length + 1} 
                className="p-4 font-medium bg-muted/10 border-b border-border"
              >
                Features
              </td>
            </tr>
            {getAllFeatures().map(featureId => (
              <tr key={featureId}>
                <td className="p-4 border-b border-r border-border">
                  <div className="font-medium">{getFeatureName(featureId)}</div>
                  {featureId === 'vani' && (
                    <div className="text-xs text-muted-foreground">AI-powered assistant</div>
                  )}
                  {featureId === 'marketplace' && (
                    <div className="text-xs text-muted-foreground">Access to integrated marketplace</div>
                  )}
                </td>
                {filteredPlans.map(plan => {
                  const feature = findFeatureInPlan(plan, featureId);
                  return (
                    <td 
                      key={plan.id} 
                      className={`p-4 text-center border-b border-r border-border ${
                        plan.id === currentPlanId ? 'bg-primary/5' : ''
                      }`}
                    >
                      {feature ? (
                        <div>
                          {feature.enabled ? (
                            <>
                              <div className="flex justify-center">
                                <span className="inline-flex items-center">
                                  <Check className="h-5 w-5 text-green-500 mr-1" />
                                  <span>{feature.limit}</span>
                                </span>
                              </div>
                              {feature.additionalPrice && (
                                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                  {getFeaturePrice(feature)}
                                </div>
                              )}
                            </>
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </div>
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Notification Credits */}
            <tr>
              <td 
                colSpan={filteredPlans.length + 1} 
                className="p-4 font-medium bg-muted/10 border-b border-border"
              >
                Notification Credits
              </td>
            </tr>
            {getAllNotificationMethods().map(method => (
              <tr key={method}>
                <td className="p-4 border-b border-r border-border">
                  <div className="font-medium">{method} Credits</div>
                </td>
                {filteredPlans.map(plan => {
                  const notification = findNotificationInPlan(plan, method);
                  return (
                    <td 
                      key={plan.id} 
                      className={`p-4 text-center border-b border-r border-border ${
                        plan.id === currentPlanId ? 'bg-primary/5' : ''
                      }`}
                    >
                      {notification ? (
                        notification.enabled ? (
                          <div className="flex justify-center">
                            <span className="inline-flex items-center">
                              <Check className="h-5 w-5 text-green-500 mr-1" />
                              <span>{notification.creditsPerUnit}</span>
                            </span>
                          </div>
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Support & Terms */}
            <tr>
              <td 
                colSpan={filteredPlans.length + 1} 
                className="p-4 font-medium bg-muted/10 border-b border-border"
              >
                General Terms
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border">
                <div className="font-medium">Trial Period</div>
              </td>
              {filteredPlans.map(plan => (
                <td 
                  key={plan.id} 
                  className={`p-4 text-center border-b border-r border-border ${
                    plan.id === currentPlanId ? 'bg-primary/5' : ''
                  }`}
                >
                  {plan.trialDuration > 0 ? (
                    <span>{plan.trialDuration} days</span>
                  ) : (
                    <span className="text-muted-foreground">No trial</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-r border-border">
                <div className="font-medium">Support</div>
              </td>
              {filteredPlans.map(plan => (
                <td 
                  key={plan.id} 
                  className={`p-4 text-center border-b border-r border-border ${
                    plan.id === currentPlanId ? 'bg-primary/5' : ''
                  }`}
                >
                  {plan.id === 'plan_1' && <span>Email Support</span>}
                  {plan.id === 'plan_2' && <span>Priority Email & Chat</span>}
                  {plan.id === 'plan_3' && <span>24/7 Priority Support</span>}
                  {!['plan_1', 'plan_2', 'plan_3'].includes(plan.id) && <span>Email Support</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Help Text */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-md border border-blue-100 dark:border-blue-900/20">
        <div className="flex items-start">
          <HelpCircle className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Need a custom plan? Contact our sales team for a personalized solution that fits your specific business requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanComparison;