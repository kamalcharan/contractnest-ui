// src/components/businessmodel/tenants/subscription/SubscriptionDetails.tsx

import React from 'react';
import { ArrowUp, Users, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { PricingPlan } from '@/utils/constants/pricing';
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

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
      <div 
        className="rounded-lg border p-6 text-center transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <p 
          className="transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          Subscription information not available
        </p>
      </div>
    );
  }
  
  return (
    <div 
      className="rounded-lg border overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: `${colors.utility.primaryText}20`
      }}
    >
      <div 
        className="px-6 py-4 border-b transition-colors"
        style={{
          backgroundColor: subscription.status === 'trial' 
            ? `${colors.semantic.warning || '#F59E0B'}10`
            : `${colors.brand.primary}10`,
          borderBottomColor: `${colors.utility.primaryText}20`
        }}
      >
        <h2 
          className="text-lg font-semibold transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Current Plan
        </h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h3 
              className="text-xl font-bold flex items-center transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {subscription.plan.name}
              {subscription.status === 'active' && (
                <CheckCircle 
                  className="ml-2 h-5 w-5"
                  style={{ color: colors.semantic.success }}
                />
              )}
            </h3>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {subscription.plan.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: subscription.status === 'active' 
                    ? `${colors.semantic.success}20`
                    : subscription.status === 'trial'
                    ? `${colors.semantic.warning || '#F59E0B'}20`
                    : `${colors.semantic.error}20`,
                  color: subscription.status === 'active' 
                    ? colors.semantic.success
                    : subscription.status === 'trial'
                    ? (colors.semantic.warning || '#F59E0B')
                    : colors.semantic.error
                }}
              >
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                {trialRemaining && ` (${trialRemaining})`}
              </span>
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${colors.brand.primary}20`,
                  color: colors.brand.primary
                }}
              >
                {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)} Billing
              </span>
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${colors.brand.secondary || colors.brand.primary}20`,
                  color: colors.brand.secondary || colors.brand.primary
                }}
              >
                {subscription.plan.plan_type}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Current Billing
            </div>
            <div 
              className="text-2xl font-bold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {formatCurrency(subscription.amountPerBilling)}
              <span 
                className="text-sm font-normal ml-1 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                /{subscription.billingCycle}
              </span>
            </div>
            <div 
              className="text-sm mt-1 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Next renewal: {formatDate(subscription.renewalDate)}
            </div>
          </div>
        </div>
        
        {/* Usage Summary */}
        <div 
          className="mt-6 p-4 rounded-md border transition-colors"
          style={{
            backgroundColor: `${colors.utility.secondaryText}10`,
            borderColor: `${colors.utility.primaryText}20`
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div 
                className="text-sm transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Current Usage
              </div>
              <div 
                className="text-lg font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {subscription.units} {getUnitName()}
              </div>
              {tierInfo.max && (
                <div 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Tier: {tierInfo.min}-{tierInfo.max} {getUnitName()}
                </div>
              )}
              {!tierInfo.max && (
                <div 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Tier: {tierInfo.min}+ {getUnitName()}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onUpgrade}
                className="px-4 py-2 rounded-md transition-colors inline-flex items-center hover:opacity-90"
                style={{
                  backgroundColor: colors.brand.primary,
                  color: 'white'
                }}
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </button>
              <button
                onClick={onAddUnits}
                className="px-4 py-2 border rounded-md inline-flex items-center transition-colors hover:opacity-90"
                style={{
                  borderColor: `${colors.utility.primaryText}20`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Add {getUnitName()}
              </button>
            </div>
          </div>
        </div>
        
        {/* Trial Banner */}
        {subscription.status === 'trial' && (
          <div 
            className="mt-4 p-4 rounded-md border transition-colors"
            style={{
              backgroundColor: `${colors.semantic.warning || '#F59E0B'}10`,
              borderColor: `${colors.semantic.warning || '#F59E0B'}20`
            }}
          >
            <p 
              className="text-sm transition-colors"
              style={{ color: colors.semantic.warning || '#F59E0B' }}
            >
              <span className="font-medium">Trial Period Active:</span> Your trial will end on {subscription.trialEnds ? formatDate(subscription.trialEnds) : 'soon'}.
              Subscribe to continue using all features after your trial ends.
            </p>
            <button
              onClick={onUpgrade}
              className="mt-2 px-3 py-1 text-xs rounded-md transition-colors hover:opacity-90"
              style={{
                backgroundColor: colors.semantic.warning || '#F59E0B',
                color: 'white'
              }}
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