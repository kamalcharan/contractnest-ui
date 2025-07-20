// src/components/businessmodel/tenants/subscription/SubscriptionDetails.tsx

import React from 'react';
import { ArrowUp, Users, CheckCircle } from 'lucide-react';
import { PricingPlan } from '@/lib/constants/pricing';
import { getCurrencySymbol } from '@/utils/constants/currencies';

interface SubscriptionDetailsProps {
  subscription: {
    id: string;
    planId: string;
    plan: PricingPlan | null;
    status: 'active' | 'trial' | 'canceled' | 'expired';
    currentTier: any;
    startDate: string;
    renewalDate: string;
    billingCycle: 'monthly' | 'quarterly' | 'annually';
    currency: string;
    units: number; // users or contracts depending on plan type
    amountPerBilling: number;
    trialEnds?: string;
  };
  onUpgrade: () => void;
  onAddUnits: () => void;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  subscription,
  onUpgrade,
  onAddUnits
}) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return `${getCurrencySymbol(subscription.currency)}${amount.toFixed(2)}`;
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate time remaining in trial if applicable
  const getTrialRemaining = (): string | null => {
    if (subscription.status !== 'trial' || !subscription.trialEnds) return null;
    
    const now = new Date();
    const trialEnd = new Date(subscription.trialEnds);
    const diffTime = Math.abs(trialEnd.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} days remaining` : 'Ends today';
  };
  
  // Get unit name based on plan type
  const getUnitName = (): string => {
    if (!subscription.plan) return 'units';
    return subscription.plan.plan_type === 'Per User' ? 'users' : 'contracts';
  };
  
  // Get current tier info
  const getTierInfo = (): { min: number; max: number | null } => {
    if (!subscription.currentTier) {
      return { min: 1, max: null };
    }
    return {
      min: subscription.currentTier.range.min,
      max: subscription.currentTier.range.max
    };
  };
  
  const tierInfo = getTierInfo();
  const trialRemaining = getTrialRemaining();
  
  if (!subscription.plan) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 text-center">
        <p className="text-muted-foreground">Subscription information not available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className={`px-6 py-4 border-b border-border ${
        subscription.status === 'trial' 
          ? 'bg-amber-50 dark:bg-amber-900/10' 
          : 'bg-primary/10'
      }`}>
        <h2 className="text-lg font-semibold">Current Plan</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center">
              {subscription.plan.name}
              {subscription.status === 'active' && (
                <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
              )}
            </h3>
            <p className="text-muted-foreground">{subscription.plan.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : subscription.status === 'trial'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                {trialRemaining && ` (${trialRemaining})`}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)} Billing
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                {subscription.plan.plan_type}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Current Billing</div>
            <div className="text-2xl font-bold">
              {formatCurrency(subscription.amountPerBilling)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                /{subscription.billingCycle}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Next renewal: {formatDate(subscription.renewalDate)}
            </div>
          </div>
        </div>
        
        {/* Usage Summary */}
        <div className="mt-6 bg-muted/10 p-4 rounded-md border border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Current Usage</div>
              <div className="text-lg font-medium">
                {subscription.units} {getUnitName()}
              </div>
              {tierInfo.max && (
                <div className="text-sm text-muted-foreground">
                  Tier: {tierInfo.min}-{tierInfo.max} {getUnitName()}
                </div>
              )}
              {!tierInfo.max && (
                <div className="text-sm text-muted-foreground">
                  Tier: {tierInfo.min}+ {getUnitName()}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onUpgrade}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </button>
              <button
                onClick={onAddUnits}
                className="px-4 py-2 border border-border bg-background hover:bg-muted transition-colors rounded-md inline-flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Add {getUnitName()}
              </button>
            </div>
          </div>
        </div>
        
        {/* Trial Banner */}
        {subscription.status === 'trial' && (
          <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-md border border-amber-100 dark:border-amber-900/20">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-medium">Trial Period Active:</span> Your trial will end on {subscription.trialEnds ? formatDate(subscription.trialEnds) : 'soon'}.
              Subscribe to continue using all features after your trial ends.
            </p>
            <button
              onClick={onUpgrade}
              className="mt-2 px-3 py-1 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetails;