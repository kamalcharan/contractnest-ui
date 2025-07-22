// src/pages/settings/businessmodel/tenants/pricing-plans/index.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';

// Import components
import PlanCard from '@/components/businessmodel/tenants/pricing/PlanCard';

// Import types and fake data
import { PricingPlan } from '@/utils/constants/pricing';
import { fakePricingPlans } from '@/utils/fakejson/PricingPlans';
import { getCurrencySymbol } from '@/utils/constants/currencies';

const PricingPlansPage: React.FC = () => {
  const navigate = useNavigate();
  
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
      <div className="p-6 bg-muted/20">
        <div className="h-8 bg-muted rounded w-48 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
              <div className="h-12 bg-muted"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground">
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
            onClick={() => handlePlanTypeChange('Per Contract')}
            className={`px-4 py-2 text-sm font-medium ${
              selectedPlanType === 'Per Contract'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            } rounded-r-md border border-gray-200 dark:border-gray-600`}
          >
            Contract-based
          </button>
        </div>
        
        {/* Currency Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Currency:</span>
          <select
            value={selectedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-md bg-background"
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
            <p className="text-muted-foreground">
              No plans available for the selected criteria.
            </p>
            <button
              onClick={() => handlePlanTypeChange(selectedPlanType === 'Per User' ? 'Per Contract' : 'Per User')}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View {selectedPlanType === 'Per User' ? 'Contract' : 'User'}-based Plans
            </button>
          </div>
        )}
      </div>
      
      {/* Help Section */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-100 dark:border-blue-900/20">
        <div className="flex items-start">
          <HelpCircle className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
              Need Help Choosing?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Our team can help you select the right plan for your business needs. 
              Contact us for a personalized consultation.
            </p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlansPage;