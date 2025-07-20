// src/pages/settings/businessmodel/tenants/subscription/index.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUp,
  Bell,
  Users,
  CreditCard,
  FileText,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';

// Import components
import SubscriptionDetails from '@/components/businessmodel/tenants/subscription/SubscriptionDetails';
import UsageProgressBar from '@/components/businessmodel/tenants/subscription/UsageProgressBar';

// Import types and fake data
import { PricingPlan } from '@/lib/constants/pricing';
import { fakePricingPlans, getPlanById } from '@/utils/fakejson/PricingPlans';
import { getCurrencySymbol } from '@/utils/constants/currencies';

// Define a mock subscription type
interface SubscriptionData {
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
}

// Define a mock usage type
interface UsageData {
  contacts: { used: number; limit: number };
  contracts: { used: number; limit: number };
  documents: { used: number; limit: number };
  smsCredits: { used: number; limit: number };
  emailCredits: { used: number; limit: number };
  whatsappCredits: { used: number; limit: number };
}

// Define a mock invoice type
interface InvoiceData {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  description: string;
}

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('businessmodel/tenants/subscription', 'Manage Subscription');
  }, []);
  
  // Fetch subscription data - in a real app this would be an API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, use Premium Plan (plan_2)
      const mockPlan = getPlanById('plan_2');
      
      if (mockPlan) {
        // Mock subscription data
        const mockSubscription: SubscriptionData = {
          id: 'sub_12345',
          planId: 'plan_2',
          plan: mockPlan,
          status: 'active',
          currentTier: mockPlan.tiers[0],
          startDate: '2025-03-15T00:00:00Z',
          renewalDate: '2025-06-15T00:00:00Z',
          billingCycle: 'monthly',
          currency: 'INR',
          units: 8, // 8 users
          amountPerBilling: 8 * (mockPlan.tiers[0].currencyPrices['INR'] || mockPlan.tiers[0].basePrice),
        };
        
        // Mock usage data
        const mockUsage: UsageData = {
          contacts: { used: 302, limit: 500 },
          contracts: { used: 89, limit: 200 },
          documents: { used: 36, limit: 50 },
          smsCredits: { used: 30, limit: 50 },
          emailCredits: { used: 115, limit: 200 },
          whatsappCredits: { used: 15, limit: 20 },
        };
        
        // Mock invoices
        const mockInvoices: InvoiceData[] = [
          {
            id: 'INV-001',
            amount: mockSubscription.amountPerBilling,
            status: 'paid',
            date: '2025-03-15T00:00:00Z',
            description: `Monthly Subscription - ${mockPlan.name} (8 users)`,
          },
          {
            id: 'INV-002',
            amount: mockSubscription.amountPerBilling,
            status: 'paid',
            date: '2025-04-15T00:00:00Z',
            description: `Monthly Subscription - ${mockPlan.name} (8 users)`,
          },
        ];
        
        setSubscription(mockSubscription);
        setUsageData(mockUsage);
        setInvoices(mockInvoices);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Handle add users/contracts
  const handleAddUnits = () => {
    const unitType = subscription?.plan?.plan_type === 'Per User' ? 'users' : 'contracts';
    navigate(`/businessmodel/tenants/subscription/add-${unitType.toLowerCase()}`);
  };
  
  // Handle upgrade plan
  const handleUpgradePlan = () => {
    navigate('/businessmodel/tenants/pricing-plans');
  };
  
  // Handle buy credits
  const handleBuyCredits = (type: string) => {
    navigate(`/businessmodel/tenants/subscription/credits/purchase?type=${type}`);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="h-8 bg-muted rounded w-48 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="h-32 bg-muted rounded animate-pulse"></div>
            <div className="h-64 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="col-span-1 space-y-4">
            <div className="h-48 bg-muted rounded animate-pulse"></div>
            <div className="h-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // No subscription state
  if (!subscription || !usageData) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Manage Subscription</h1>
          <p className="text-muted-foreground">
            View and manage your current subscription plan
          </p>
        </div>
        
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Active Subscription</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don't have an active subscription yet. Choose a plan to get started with ContractNest.
          </p>
          <button
            onClick={() => navigate('/businessmodel/tenants/pricing-plans')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Manage Subscription</h1>
        <p className="text-muted-foreground">
          View and manage your current subscription plan and usage
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Current Subscription Details */}
          <SubscriptionDetails 
            subscription={subscription}
            onUpgrade={handleUpgradePlan}
            onAddUnits={handleAddUnits}
          />
          
          {/* Feature Usage */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/10 border-b border-border">
              <h2 className="text-lg font-semibold">Feature Usage</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Basic Features</h3>
                  <UsageProgressBar 
                    used={usageData.contacts.used} 
                    limit={usageData.contacts.limit} 
                    label="Contacts" 
                  />
                  <UsageProgressBar 
                    used={usageData.contracts.used} 
                    limit={usageData.contracts.limit} 
                    label="Contracts" 
                  />
                  <UsageProgressBar 
                    used={usageData.documents.used} 
                    limit={usageData.documents.limit} 
                    label="Documents" 
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Credits</h3>
                  <UsageProgressBar 
                    used={usageData.smsCredits.used} 
                    limit={usageData.smsCredits.limit} 
                    label="SMS Credits" 
                  />
                  <UsageProgressBar 
                    used={usageData.emailCredits.used} 
                    limit={usageData.emailCredits.limit} 
                    label="Email Credits" 
                  />
                  <UsageProgressBar 
                    used={usageData.whatsappCredits.used} 
                    limit={usageData.whatsappCredits.limit} 
                    label="WhatsApp Credits" 
                  />
                  
                  <button
                    onClick={() => handleBuyCredits('all')}
                    className="mt-2 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                  >
                    Buy More Credits
                  </button>
                </div>
              </div>
              
              {/* Special Features */}
              {subscription.plan && subscription.plan.features.filter(f => f.additionalPrice).length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="font-medium mb-4">Special Features</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subscription.plan.features
                      .filter(f => f.additionalPrice)
                      .map((feature, index) => (
                        <div 
                          key={index} 
                          className="bg-muted/10 p-4 rounded-md border border-border flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">
                              {feature.featureId === 'vani' && 'VaNi AI Assistant'}
                              {feature.featureId === 'marketplace' && 'Marketplace Access'}
                              {feature.featureId === 'finance' && 'Financial Tools'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Billed {feature.pricingPeriod}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {getCurrencySymbol(subscription.currency)}
                              {feature.currencyPrices[subscription.currency] || feature.additionalPrice}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">
                              Active
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Usage Charts - Placeholder */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/10 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-semibold">Usage Analytics</h2>
              <button className="p-1 rounded-md hover:bg-muted transition-colors">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-48 bg-muted/20 rounded-md border border-dashed border-border">
                <p className="text-muted-foreground">Usage analytics charts will appear here</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/10 border-b border-border">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <button
                  onClick={handleUpgradePlan}
                  className="w-full px-4 py-2 text-left border border-border rounded-md hover:bg-muted transition-colors flex items-center"
                >
                  <ArrowUp className="h-4 w-4 mr-3 text-primary" />
                  <span>Upgrade Plan</span>
                </button>
                <button
                  onClick={handleAddUnits}
                  className="w-full px-4 py-2 text-left border border-border rounded-md hover:bg-muted transition-colors flex items-center"
                >
                  <Users className="h-4 w-4 mr-3 text-primary" />
                  <span>Add {subscription.plan?.plan_type === 'Per User' ? 'Users' : 'Contracts'}</span>
                </button>
                <button
                  onClick={() => handleBuyCredits('sms')}
                  className="w-full px-4 py-2 text-left border border-border rounded-md hover:bg-muted transition-colors flex items-center"
                >
                  <Bell className="h-4 w-4 mr-3 text-primary" />
                  <span>Buy Notification Credits</span>
                </button>
                <button
                  className="w-full px-4 py-2 text-left border border-border rounded-md hover:bg-muted transition-colors flex items-center"
                >
                  <CreditCard className="h-4 w-4 mr-3 text-primary" />
                  <span>Update Billing Details</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Billing History */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/10 border-b border-border">
              <h2 className="text-lg font-semibold">Billing History</h2>
            </div>
            <div className="divide-y divide-border">
              {invoices.length > 0 ? (
                invoices.map((invoice, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{invoice.id}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(invoice.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {getCurrencySymbol(subscription.currency)}{invoice.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 text-sm">
                      {invoice.description}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No invoices yet</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border">
              <button
                className="w-full px-4 py-2 text-sm bg-muted/50 hover:bg-muted transition-colors rounded-md"
                onClick={() => navigate('/businessmodel/tenants/billing/invoices')}
              >
                View All Invoices
              </button>
            </div>
          </div>
          
          {/* Alerts/Reminders */}
          {usageData.whatsappCredits.used / usageData.whatsappCredits.limit > 0.75 && (
            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-md border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                    WhatsApp Credits Running Low
                  </p>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    You have only {usageData.whatsappCredits.limit - usageData.whatsappCredits.used} WhatsApp notification credits remaining. 
                  </p>
                  <button
                    className="mt-2 px-3 py-1 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700"
                    onClick={() => handleBuyCredits('whatsapp')}
                  >
                    Purchase Credits
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;