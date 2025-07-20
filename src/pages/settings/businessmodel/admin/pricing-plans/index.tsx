// src/pages/settings/businessmodel/admin/pricing-plans/index.tsx - CLEAN WORKING VERSION

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';
import { useBusinessModel } from '@/hooks/useBusinessModel';

// Import components
import SummaryCards from '@/components/businessmodel/dashboard/SummaryCards';
import PlanList, { PricingPlanSummary } from '@/components/businessmodel/dashboard/PlanList';

const PricingPlansAdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { 
    isLoading,
    plans, 
    loadPlans,
    archivePlan,
    error
  } = useBusinessModel();
  
  // Filter type for summary cards
  const [activeFilter, setActiveFilter] = useState<'all' | 'plans' | 'users' | 'renewals' | 'trials'>('all');
  
  // Summary data calculated from plans
  const [summaryData, setSummaryData] = useState({
    activePlans: 0,
    totalUsers: 0,
    renewalsSoon: 0,
    trialsEnding: 0
  });
  
  // Processed plans for the list component
  const [processedPlans, setProcessedPlans] = useState<PricingPlanSummary[]>([]);
  
  // Track component lifecycle properly
  const isMounted = useRef(true);
  const hasTrackedPageView = useRef(false);
  
  // Set up mounting status - only once
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Track page view only once
  useEffect(() => {
    if (!hasTrackedPageView.current) {
      analyticsService.trackPageView('settings/businessmodel/admin/pricing-plans', 'Plan Configuration');
      hasTrackedPageView.current = true;
    }
  }, []);
  
  // Process plans data with new field compatibility
  useEffect(() => {
    if (!isMounted.current) return;
    
    // Prevent processing if plans array is the same reference
    if (processedPlans.length === plans.length && plans.length > 0) {
      console.log('Plans data already processed, skipping duplicate processing');
      return;
    }
    
    try {
      console.log('Processing plans data, current count:', plans.length);
      
      // Handle both API formats for field names
      const activePlansCount = plans.filter(plan => {
        const isVisible = plan.isVisible ?? plan.is_visible ?? true;
        const isArchived = plan.isArchived ?? plan.is_archived ?? false;
        return !isArchived && isVisible;
      }).length;
      
      let totalUsersCount = 0;
      
      // Convert plans to format expected by PlanList component
      const formattedPlans = plans.map(plan => {
        // Add user count to total (if available)
        const subscriberCount = plan.subscriber_count || 0;
        totalUsersCount += subscriberCount;
        
        // Handle both field formats
        const isVisible = plan.isVisible ?? plan.is_visible ?? true;
        const isArchived = plan.isArchived ?? plan.is_archived ?? false;
        const planType = plan.planType || plan.plan_type || 'Per User';
        const updatedAt = plan.updatedAt || plan.updated_at;
        const createdAt = plan.createdAt || plan.created_at;
        
        // Handle version information from both formats
        const activeVersion = plan.activeVersion || plan.active_version;
        const versionNumber = activeVersion?.version_number || plan.version || '1.0';
        const featuresCount = activeVersion?.features?.length || plan.features?.length || 0;
        
        return {
          id: plan.id || plan.plan_id || '',
          name: plan.name || 'Untitled Plan',
          version: versionNumber,
          isActive: isVisible && !isArchived,
          planType: planType as 'Per User' | 'Per Contract',
          userCount: subscriberCount,
          featuresCount: featuresCount,
          lastUpdated: updatedAt ? new Date(updatedAt).toLocaleDateString() : 
                       createdAt ? new Date(createdAt).toLocaleDateString() : 
                       'Unknown'
        };
      });
      
      // Set processed plans
      setProcessedPlans(formattedPlans);
      
      // Calculate renewals and trials percentages
      const renewalsSoon = Math.floor(totalUsersCount * 0.15);
      const trialsEnding = Math.floor(totalUsersCount * 0.08);
      
      // Update summary data
      setSummaryData({
        activePlans: activePlansCount,
        totalUsers: totalUsersCount,
        renewalsSoon,
        trialsEnding
      });
      
      console.log('Plans processing completed:', {
        total: plans.length,
        active: activePlansCount,
        users: totalUsersCount
      });
    } catch (error) {
      console.error("Error processing plans data:", error);
    }
  }, [plans, processedPlans.length]);
  
  // Handle Back
  const handleBack = () => {
    navigate('/settings');
  };
  
  // Handle Create New Plan
  const handleCreatePlan = () => {
    navigate('/settings/businessmodel/admin/pricing-plans/create');
  };
  
  // Handle View Plan with robust ID handling
  const handleViewPlan = (planId: string) => {
    if (!planId) {
      console.error('handleViewPlan: No plan ID provided');
      return;
    }
    
    console.log('Navigating to plan details:', planId);
    
    try {
      navigate(`/settings/businessmodel/admin/pricing-plans/${planId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation attempt
      window.location.href = `/settings/businessmodel/admin/pricing-plans/${planId}`;
    }
  };
  
  // Handle Archive Plan with better error handling
  const handleArchivePlan = async (planId: string) => {
    const confirmed = window.confirm('Are you sure you want to archive this plan? This will hide it from all tenants.');
    
    if (confirmed) {
      try {
        console.log('Archiving plan:', planId);
        const success = await archivePlan(planId);
        if (success) {
          console.log('Plan archived successfully, refreshing list');
          await loadPlans();
        }
      } catch (error) {
        console.error('Error archiving plan:', error);
        // Error is already handled by the hook and toast is shown
      }
    }
  };
  
  // Handle summary card clicks
  const handleSummaryCardClick = (cardType: 'plans' | 'users' | 'renewals' | 'trials') => {
    setActiveFilter(prev => prev === cardType ? 'all' : cardType);
  };

  // Filter plans based on active filter
  const getFilteredPlans = () => {
    if (activeFilter === 'all') return processedPlans;
    
    switch(activeFilter) {
      case 'plans':
        return processedPlans.filter(plan => plan.isActive);
      case 'users':
        return processedPlans.filter(plan => plan.userCount > 0);
      case 'renewals':
        return processedPlans.slice(0, 2);
      case 'trials':
        return processedPlans.filter((_, idx) => idx === 3);
      default:
        return processedPlans;
    }
  };
  
  const filteredPlans = getFilteredPlans();

  // Handle error state from hook
  if (error) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={handleBack} 
              className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Plan Configuration</h1>
              <p className="text-muted-foreground">Error loading plans</p>
            </div>
          </div>
        </div>
        
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Plans</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => loadPlans()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Plan Configuration</h1>
            <p className="text-muted-foreground">Manage subscription plans and pricing structure</p>
          </div>
        </div>
        
        <button
          onClick={handleCreatePlan}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Plan
        </button>
      </div>
      
      {/* Summary Cards */}
      <SummaryCards
        activePlans={summaryData.activePlans}
        totalUsers={summaryData.totalUsers}
        renewalsSoon={summaryData.renewalsSoon}
        trialsEnding={summaryData.trialsEnding}
        onCardClick={handleSummaryCardClick}
      />
      
      {/* Active Filter Indicator */}
      {activeFilter !== 'all' && (
        <div className="mb-4">
          <div className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-md">
            <span className="text-sm font-medium mr-2">
              Filtered by: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            </span>
            <button 
              onClick={() => setActiveFilter('all')}
              className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center"
            >
              <span className="sr-only">Clear filter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Subscription Plans Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
        <PlanList
          plans={filteredPlans}
          onViewPlan={handleViewPlan}
          onArchivePlan={handleArchivePlan}
          isLoading={isLoading}
        />
      </div>
      
      {/* Debug info during development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-muted/10 rounded-lg border border-border">
          <h3 className="text-sm font-medium mb-2">Debug Info</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Plans loaded: {plans.length}</div>
            <div>Processed plans: {processedPlans.length}</div>
            <div>Filtered plans: {filteredPlans.length}</div>
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Active filter: {activeFilter}</div>
            <div>Error: {error || 'None'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPlansAdminPage;