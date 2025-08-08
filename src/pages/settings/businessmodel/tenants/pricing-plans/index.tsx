// src/pages/settings/businessmodel/tenants/pricing-plans/index.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsService } from '@/services/analytics.service';

// Import components
import PlanCard from '@/components/businessmodel/tenants/pricing/PlanCard';

// Import types and fake data
import { PricingPlan } from '@/utils/constants/pricing';
import { fakePricingPlans } from '@/utils/fakejson/PricingPlans';
import { getCurrencySymbol } from '@/utils/constants/currencies';

const PricingPlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // State for plans and filters
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState<'Per User' | 'Per Contract'>('Per User');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('INR');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('businessmodel/tenants/pricing-plans', 'Pricing Plans');
  }, []);
  
  // Fetch plans - in a real app this would be an API call
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get visible plans only
      const visiblePlans = fakePricingPlans.filter(
        plan => plan.isVisible && !plan.isArchived
      );
      
      setPlans(visiblePlans as PricingPlan[]);

      // Simulate active plan (would come from user's subscription info)
      // For demo, let's pretend the user has the Premium Plan
      setActivePlanId('plan_2');
      
      setLoading(false);
    };
    
    fetchPlans();
  }, []);
  
  // Handle plan type toggle
  const handlePlanTypeChange = (type: 'Per User' | 'Per Contract') => {
    setSelectedPlanType(type);
  };
  
  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };
  
  // Handle subscribe action
  const handleSubscribe = (planId: string) => {
    navigate(`/businessmodel/tenants/pricing-plans/${planId}/subscribe?currency=${selectedCurrency}`);
  };
  
  // Handle trial action
  const handleStartTrial = (planId: string) => {
    navigate(`/businessmodel/tenants/pricing-plans/${planId}/trial?currency=${selectedCurrency}`);
  };
  
  // Handle upgrade/manage plan
  const handleManagePlan = () => {
    navigate('/businessmodel/tenants/subscription');
  };
  
  // Filter plans by selected type
  const filteredPlans = plans.filter(plan => 
    plan.plan_type === selectedPlanType && 
    plan.supportedCurrencies.includes(selectedCurrency)
  );
  
  // Loading state
  if (loading) {
    return (
      <div 
        className="p-6 transition-colors"
        style={{ backgroundColor: `${colors.utility.secondaryText}20` }}
      >
        <div 
          className="h-8 rounded w-48 mb-4 animate-pulse"
          style={{ backgroundColor: `${colors.utility.secondaryText}40` }}
        ></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="rounded-lg border overflow-hidden animate-pulse"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <div 
                className="h-12"
                style={{ backgroundColor: `${colors.utility.secondaryText}40` }}
              ></div>
              <div className="p-6 space-y-4">
                <div 
                  className="h-6 rounded w-32"
                  style={{ backgroundColor: `${colors.utility.secondaryText}40` }}
                ></div>
                <div 
                  className="h-24 rounded"
                  style={{ backgroundColor: `${colors.utility.secondaryText}40` }}
                ></div>
                <div 
                  className="h-8 rounded"
                  style={{ backgroundColor: `${colors.utility.secondaryText}40` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="p-6 transition-colors"
      style={{ backgroundColor: `${colors.utility.secondaryText}10` }}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Choose Your Plan
        </h1>
        <p 
          className="transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          Select the pricing plan that best fits your needs
        </p>
      </div>
      
      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Plan Type Toggle */}
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => handlePlanTypeChange('Per User')}
            className="px-4 py-2 text-sm font-medium rounded-l-md border transition-colors hover:opacity-80"
            style={{
              backgroundColor: selectedPlanType === 'Per User' 
                ? colors.brand.primary 
                : colors.utility.primaryBackground,
              color: selectedPlanType === 'Per User' 
                ? 'white' 
                : colors.utility.primaryText,
              borderColor: `${colors.utility.primaryText}30`
            }}
            onMouseEnter={(e) => {
              if (selectedPlanType !== 'Per User') {
                e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlanType !== 'Per User') {
                e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
              }
            }}
          >
            User-based
          </button>
          <button
            type="button"
            onClick={() => handlePlanTypeChange('Per Contract')}
            className="px-4 py-2 text-sm font-medium rounded-r-md border transition-colors hover:opacity-80"
            style={{
              backgroundColor: selectedPlanType === 'Per Contract' 
                ? colors.brand.primary 
                : colors.utility.primaryBackground,
              color: selectedPlanType === 'Per Contract' 
                ? 'white' 
                : colors.utility.primaryText,
              borderColor: `${colors.utility.primaryText}30`
            }}
            onMouseEnter={(e) => {
              if (selectedPlanType !== 'Per Contract') {
                e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlanType !== 'Per Contract') {
                e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
              }
            }}
          >
            Contract-based
          </button>
        </div>
        
        {/* Currency Selector */}
        <div className="flex items-center space-x-2">
          <span 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Currency:
          </span>
          <select
            value={selectedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition-colors"
            style={{
              borderColor: `${colors.utility.secondaryText}40`,
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText,
              '--tw-ring-color': colors.brand.primary
            } as React.CSSProperties}
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>
      </div>
      
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPlans.length > 0 ? (
          filteredPlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={plan.id === activePlanId}
              currency={selectedCurrency}
              onSubscribe={() => handleSubscribe(plan.id)}
              onStartTrial={() => handleStartTrial(plan.id)}
              onManagePlan={handleManagePlan}
            />
          ))
        ) : (
          <div className="col-span-3 py-12 text-center">
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              No plans available for the selected criteria.
            </p>
            <button
              onClick={() => handlePlanTypeChange(selectedPlanType === 'Per User' ? 'Per Contract' : 'Per User')}
              className="mt-4 px-4 py-2 rounded-md transition-colors hover:opacity-90"
              style={{
                backgroundColor: colors.brand.primary,
                color: 'white'
              }}
            >
              View {selectedPlanType === 'Per User' ? 'Contract' : 'User'}-based Plans
            </button>
          </div>
        )}
      </div>
      
      {/* Help Section */}
      <div 
        className="mt-12 p-6 rounded-lg border transition-colors"
        style={{
          backgroundColor: `${colors.brand.primary}10`,
          borderColor: `${colors.brand.primary}20`
        }}
      >
        <div className="flex items-start">
          <HelpCircle 
            className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5"
            style={{ color: colors.brand.primary }}
          />
          <div>
            <h3 
              className="font-medium mb-1 transition-colors"
              style={{ color: colors.brand.primary }}
            >
              Need Help Choosing?
            </h3>
            <p 
              className="text-sm transition-colors"
              style={{ color: colors.brand.primary }}
            >
              Our team can help you select the right plan for your business needs. 
              Contact us for a personalized consultation.
            </p>
            <button 
              className="mt-3 px-4 py-2 rounded-md transition-colors hover:opacity-90 text-sm"
              style={{
                backgroundColor: colors.brand.primary,
                color: 'white'
              }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlansPage;