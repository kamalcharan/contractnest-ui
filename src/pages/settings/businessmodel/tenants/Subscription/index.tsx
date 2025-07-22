// src/pages/settings/businessmodel/tenants/Subscription/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  TrendingUp,
  Package,
  Settings,
  Download,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { analyticsService } from '@/services/analytics.service';

// Types
interface Feature {
  name: string;
  included: boolean;
  limit?: number | string;
  additionalPrice?: number;
  currency?: string;
}

interface PricingTier {
  name: string;
  basePrice: number;
  unitPrice?: number;
  minUsers?: number;
  maxUsers?: number | null;
  currencyPrices?: Record<string, number>;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  tiers: PricingTier[];
  features: Feature[];
  isPopular?: boolean;
  currency: string;
  billingPeriod: 'monthly' | 'annually';
}

interface Subscription {
  id: string;
  plan: PricingPlan;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  amountPerBilling: number;
  currency: string;
  userCount: number;
  isTrialActive: boolean;
  trialEndDate?: string;
  autoRenew: boolean;
  paymentMethod?: {
    type: string;
    last4?: string;
    expiryDate?: string;
  };
}

interface UsageData {
  feature: string;
  used: number;
  limit: number | string;
  percentage: number;
}

// Mock data for demonstration
const mockPlan: PricingPlan = {
  id: 'plan_professional',
  name: 'Professional Plan',
  description: 'Perfect for growing businesses',
  currency: 'INR',
  billingPeriod: 'monthly',
  isPopular: true,
  tiers: [
    {
      name: 'Up to 10 users',
      basePrice: 2500,
      unitPrice: 250,
      minUsers: 1,
      maxUsers: 10,
      currencyPrices: {
        'INR': 2500,
        'USD': 30,
        'EUR': 28
      }
    }
  ],
  features: [
    { name: 'Unlimited Contracts', included: true },
    { name: 'Document Templates', included: true, limit: 50 },
    { name: 'API Access', included: true },
    { name: 'Priority Support', included: true },
    { name: 'Advanced Analytics', included: true },
    { name: 'Custom Branding', included: false, additionalPrice: 500, currency: 'INR' },
    { name: 'SSO Integration', included: false, additionalPrice: 1000, currency: 'INR' },
    { name: 'Audit Logs', included: true, limit: '6 months' }
  ]
};

const mockSubscription: Subscription = {
  id: 'sub_12345',
  plan: mockPlan,
  status: 'active',
  startDate: '2024-01-15T00:00:00Z',
  endDate: '2025-01-15T00:00:00Z',
  nextBillingDate: '2024-12-15T00:00:00Z',
  amountPerBilling: 8 * (mockPlan.tiers[0]?.currencyPrices?.['INR'] || mockPlan.tiers[0]?.basePrice || 0),
  currency: 'INR',
  userCount: 8,
  isTrialActive: false,
  autoRenew: true,
  paymentMethod: {
    type: 'credit_card',
    last4: '4242',
    expiryDate: '12/26'
  }
};

const mockUsageData: UsageData[] = [
  { feature: 'Active Users', used: 8, limit: 10, percentage: 80 },
  { feature: 'Contracts Created', used: 145, limit: 'Unlimited', percentage: 0 },
  { feature: 'Document Templates', used: 23, limit: 50, percentage: 46 },
  { feature: 'API Calls (Monthly)', used: 2340, limit: 5000, percentage: 47 },
  { feature: 'Storage Used', used: 2.3, limit: 10, percentage: 23 }
];

const SubscriptionIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTenant, user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription);
  const [usageData, setUsageData] = useState<UsageData[]>(mockUsageData);
  const [isLoading, setIsLoading] = useState(false);

  // Track page view
  useEffect(() => {
    analyticsService.trackPageView(
      'settings/businessmodel/tenants/subscription', 
      'Tenant Subscription Management'
    );
  }, []);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'INR'): string => {
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-4 w-4 mr-1" />
            Active
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="h-4 w-4 mr-1" />
            Trial
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-4 w-4 mr-1" />
            Cancelled
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <AlertCircle className="h-4 w-4 mr-1" />
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  // Get usage percentage color
  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    if (percentage >= 75) return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30';
    return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
  };

  // Navigation handlers
  const handleBack = () => {
    navigate('/settings/businessmodel/tenants');
  };

  const handleUpgrade = () => {
    navigate('/settings/businessmodel/tenants/pricing-plans');
  };

  const handleManagePayment = () => {
    navigate('/settings/businessmodel/tenants/subscription/payment');
  };

  const handleViewBilling = () => {
    navigate('/settings/businessmodel/tenants/subscription/billing');
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would download the latest invoice
    console.log('Downloading invoice...');
  };

  const handleCancelSubscription = () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? This action cannot be undone.'
    );
    
    if (confirmed) {
      setIsLoading(true);
      // In a real app, this would call the API
      setTimeout(() => {
        setSubscription(prev => ({ ...prev, status: 'cancelled', autoRenew: false }));
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleToggleAutoRenew = () => {
    setIsLoading(true);
    // In a real app, this would call the API
    setTimeout(() => {
      setSubscription(prev => ({ ...prev, autoRenew: !prev.autoRenew }));
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your current plan, billing, and usage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan Overview */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Current Plan</h2>
                {getStatusBadge(subscription.status)}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {subscription.plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {subscription.plan.description}
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{subscription.userCount} users</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Renews {formatDate(subscription.nextBillingDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatCurrency(subscription.amountPerBilling)} / month</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatCurrency(subscription.amountPerBilling)}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                  {subscription.plan.isPopular && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-renewal toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">Auto-renewal</div>
                  <div className="text-sm text-muted-foreground">
                    {subscription.autoRenew 
                      ? 'Your subscription will automatically renew' 
                      : 'Your subscription will not renew automatically'
                    }
                  </div>
                </div>
                <button
                  onClick={handleToggleAutoRenew}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    subscription.autoRenew ? 'bg-primary' : 'bg-muted'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    subscription.autoRenew ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 border-b border-border">
              <h2 className="text-lg font-semibold">Plan Features</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscription.plan.features
                  .filter((feature: Feature) => feature.included)
                  .map((feature: Feature, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{feature.name}</span>
                        {feature.limit && (
                          <span className="text-sm text-muted-foreground ml-2">
                            ({feature.limit})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Additional Features Available */}
              {subscription.plan.features.filter((f: Feature) => !f.included && f.additionalPrice).length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-medium mb-4">Additional Features Available</h3>
                  <div className="space-y-3">
                    {subscription.plan.features
                      .filter((f: Feature) => !f.included && f.additionalPrice)
                      .map((feature: Feature, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{feature.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">
                              {formatCurrency(feature.additionalPrice || 0, feature.currency || 'INR')}/month
                            </span>
                            <button className="text-primary hover:text-primary/80 text-sm font-medium">
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 border-b border-border">
              <h2 className="text-lg font-semibold">Usage Statistics</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {usageData.map((usage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{usage.feature}</span>
                      <span className="text-sm text-muted-foreground">
                        {usage.used} {usage.limit !== 'Unlimited' ? `/ ${usage.limit}` : ''}
                      </span>
                    </div>
                    {usage.limit !== 'Unlimited' && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            usage.percentage >= 90 ? 'bg-red-500' : 
                            usage.percentage >= 75 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                        />
                      </div>
                    )}
                    {usage.percentage >= 90 && usage.limit !== 'Unlimited' && (
                      <div className="flex items-center space-x-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Approaching limit - consider upgrading</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 border-b border-border">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            
            <div className="p-6 space-y-3">
              <button
                onClick={handleUpgrade}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </button>
              
              <button
                onClick={handleManagePayment}
                className="w-full px-4 py-2 border border-border bg-card hover:bg-muted transition-colors rounded-md flex items-center justify-center"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Payment
              </button>
              
              <button
                onClick={handleViewBilling}
                className="w-full px-4 py-2 border border-border bg-card hover:bg-muted transition-colors rounded-md flex items-center justify-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Billing History
              </button>
              
              <button
                onClick={handleDownloadInvoice}
                className="w-full px-4 py-2 border border-border bg-card hover:bg-muted transition-colors rounded-md flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </button>
            </div>
          </div>

          {/* Payment Method */}
          {subscription.paymentMethod && (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 bg-muted/20 border-b border-border">
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">
                      •••• •••• •••• {subscription.paymentMethod.last4}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {subscription.paymentMethod.expiryDate}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleManagePayment}
                  className="mt-4 text-primary hover:text-primary/80 text-sm font-medium flex items-center"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Update Payment Method
                </button>
              </div>
            </div>
          )}

          {/* Billing Information */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 border-b border-border">
              <h2 className="text-lg font-semibold">Billing Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Period</span>
                <span className="font-medium">
                  {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Billing</span>
                <span className="font-medium">{formatDate(subscription.nextBillingDate)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(subscription.amountPerBilling)}</span>
              </div>
              
              <div className="pt-4 border-t border-border">
                <button
                  onClick={handleViewBilling}
                  className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Full Billing History
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          {subscription.status === 'active' && (
            <div className="bg-card rounded-lg border border-destructive/20 overflow-hidden">
              <div className="px-6 py-4 bg-destructive/5 border-b border-destructive/20">
                <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Once you cancel your subscription, you will lose access to all paid features at the end of your current billing period.
                </p>
                
                <button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionIndexPage;