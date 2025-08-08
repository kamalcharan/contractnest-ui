// src/components/billing/BillingTab.tsx - Complete Original Design with Error Handling
import React, { useState } from 'react';
import { DollarSign, Plus, FileText, AlertCircle, Archive, Calendar } from 'lucide-react';
import BillingStatsGrid from './BillingStatsGrid';
import RecentBillingCard from './RecentBillingCard';
import BillingScheduleCard from './BillingScheduleCard';

interface BillingTabProps {
  contactId: string;
  contactStatus?: 'active' | 'inactive' | 'archived';
}

const BillingTab: React.FC<BillingTabProps> = ({ 
  contactId, 
  contactStatus = 'active' 
}) => {
  const [activeCurrency, setActiveCurrency] = useState<string>('all');

  // Mock billing data with complete structure - this would come from API
  const mockBillingData = {
    all: {
      overdue: { count: 2, amount: 25000 },
      dueThisWeek: { count: 1, amount: 15000 },
      dueThisMonth: { count: 3, amount: 45000 },
      paidThisMonth: { count: 5, amount: 85000 },
      totalOutstanding: 85000
    },
    USD: {
      overdue: { count: 1, amount: 300 },
      dueThisWeek: { count: 0, amount: 0 },
      dueThisMonth: { count: 1, amount: 500 },
      paidThisMonth: { count: 2, amount: 1200 },
      totalOutstanding: 800
    },
    INR: {
      overdue: { count: 1, amount: 20000 },
      dueThisWeek: { count: 1, amount: 15000 },
      dueThisMonth: { count: 2, amount: 35000 },
      paidThisMonth: { count: 3, amount: 65000 },
      totalOutstanding: 70000
    },
    EUR: {
      overdue: { count: 0, amount: 0 },
      dueThisWeek: { count: 0, amount: 0 },
      dueThisMonth: { count: 0, amount: 0 },
      paidThisMonth: { count: 0, amount: 0 },
      totalOutstanding: 0
    }
  };

  const currencyConfig = {
    all: { label: 'All Currencies', symbol: '₹', total: '1.55L', color: 'bg-primary text-primary-foreground' },
    USD: { label: 'USD', symbol: '$', total: '2K', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
    INR: { label: 'INR', symbol: '₹', total: '1.35L', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' },
    EUR: { label: 'EUR', symbol: '€', total: '0', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800' }
  };

  // Get current stats with absolute safety
  const getCurrentStats = () => {
    const stats = mockBillingData[activeCurrency as keyof typeof mockBillingData];
    
    // Return safe default if stats don't exist
    if (!stats || typeof stats !== 'object') {
      return {
        overdue: { count: 0, amount: 0 },
        dueThisWeek: { count: 0, amount: 0 },
        dueThisMonth: { count: 0, amount: 0 },
        paidThisMonth: { count: 0, amount: 0 },
        totalOutstanding: 0
      };
    }

    // Ensure all properties exist
    return {
      overdue: stats.overdue || { count: 0, amount: 0 },
      dueThisWeek: stats.dueThisWeek || { count: 0, amount: 0 },
      dueThisMonth: stats.dueThisMonth || { count: 0, amount: 0 },
      paidThisMonth: stats.paidThisMonth || { count: 0, amount: 0 },
      totalOutstanding: stats.totalOutstanding || 0
    };
  };

  const currentStats = getCurrentStats();
  
  // Calculate if we have any data
  const totalInvoices = Object.values(currentStats).reduce((sum, stat) => {
    if (typeof stat === 'object' && 'count' in stat) {
      return sum + (stat.count || 0);
    }
    return sum;
  }, 0);

  // Check if contact is restricted
  const isContactRestricted = contactStatus === 'inactive' || contactStatus === 'archived';

  // Check if we have any billing data at all
  const hasAnyBilling = Object.values(mockBillingData).some(stats => 
    Object.values(stats).some(stat => 
      typeof stat === 'object' && 'count' in stat && (stat.count || 0) > 0
    )
  );

  // Check if current currency has data
  const hasCurrentCurrencyData = totalInvoices > 0;

  // If no billing data exists for any currency, show empty state
  if (!hasAnyBilling) {
    return (
      <div className="space-y-6">
        {/* Status Banner for restricted contacts */}
        {isContactRestricted && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Contact {contactStatus === 'archived' ? 'Archived' : 'Inactive'}
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {contactStatus === 'archived' 
                    ? 'This contact is archived. No new billing operations can be performed.' 
                    : 'This contact is inactive. Limited billing operations are available.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {/* Empty State */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No billing information
                </h3>
                <p className="text-muted-foreground mb-6">
                  Invoices, quotes, and billing history with this contact will appear here once you start creating them.
                </p>
                
                {!isContactRestricted && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Invoice
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                      <FileText className="mr-2 h-4 w-4" />
                      Create Quote
                    </button>
                  </div>
                )}
                
                {isContactRestricted && (
                  <div className="text-sm text-muted-foreground">
                    Activate the contact to enable billing operations
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="xl:col-span-1">
            <BillingScheduleCard contactId={contactId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner for restricted contacts */}
      {isContactRestricted && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Contact {contactStatus === 'archived' ? 'Archived' : 'Inactive'}
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {contactStatus === 'archived' 
                  ? 'This contact is archived. Billing data is read-only.' 
                  : 'This contact is inactive. Some billing operations may be restricted.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Currency Filter Tabs */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground">Billing Overview</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{totalInvoices} invoices</span>
            </div>
          </div>
          
          {/* Currency Tabs */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(currencyConfig).map(([currency, config]) => {
              const stats = mockBillingData[currency as keyof typeof mockBillingData];
              const hasData = stats && Object.values(stats).some(stat => 
                typeof stat === 'object' && 'count' in stat && (stat.count || 0) > 0
              );
              
              return (
                <button
                  key={currency}
                  onClick={() => setActiveCurrency(currency)}
                  disabled={!hasData && currency !== 'all'}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors border
                    ${activeCurrency === currency
                      ? config.color
                      : hasData 
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border'
                        : 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{config.label}</span>
                    <span className="text-xs opacity-75">
                      {config.symbol}{config.total}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Content Area - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {hasCurrentCurrencyData ? (
            <>
              {/* Billing Statistics Grid - Now with safe data */}
              <BillingStatsGrid 
                billingStats={currentStats} 
                contactId={contactId}
                currency={activeCurrency}
                currencySymbol={currencyConfig[activeCurrency as keyof typeof currencyConfig]?.symbol || '₹'}
              />
              
              {/* Recent Billing Activity */}
              <RecentBillingCard 
                contactId={contactId} 
                currency={activeCurrency}
              />
            </>
          ) : (
            /* No data for selected currency */
            <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-medium text-foreground mb-2">
                No {activeCurrency === 'all' ? 'billing' : activeCurrency.toUpperCase()} data
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeCurrency === 'all' 
                  ? 'No billing activity found for this contact.'
                  : `No invoices or quotes in ${activeCurrency.toUpperCase()} currency.`
                }
              </p>
            </div>
          )}
        </div>
        
        {/* Right Sidebar - 1/3 width */}
        <div className="xl:col-span-1 space-y-6">
          {/* Billing Schedule Card */}
          <BillingScheduleCard contactId={contactId} />
          
          {/* Quick Actions */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {!isContactRestricted ? (
                <>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm text-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Quote
                  </button>
                  <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm text-foreground">
                    Record Payment
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <Archive className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {contactStatus === 'archived' 
                      ? 'No actions available for archived contacts'
                      : 'Limited actions for inactive contacts'
                    }
                  </p>
                </div>
              )}
              
              {/* Always available actions */}
              <div className="pt-3 border-t border-border space-y-2">
                <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm text-foreground">
                  <Calendar className="mr-2 h-4 w-4 inline" />
                  View Statements
                </button>
                <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm text-foreground">
                  Export Billing Data
                </button>
              </div>
            </div>
          </div>
          
          {/* Billing Analytics Card */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold text-foreground mb-4">Billing Insights</h3>
            <div className="space-y-4">
              {/* Total Outstanding */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Outstanding</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {currencyConfig[activeCurrency as keyof typeof currencyConfig]?.symbol}
                  {currentStats.totalOutstanding >= 1000 
                    ? `${(currentStats.totalOutstanding / 1000).toFixed(1)}K` 
                    : currentStats.totalOutstanding.toLocaleString()
                  }
                </span>
              </div>
              
              {/* Average Invoice Size */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Invoice</span>
                <span className="font-semibold text-foreground">
                  {currencyConfig[activeCurrency as keyof typeof currencyConfig]?.symbol}
                  {totalInvoices > 0 
                    ? Math.round((currentStats.overdue.amount + currentStats.dueThisWeek.amount + currentStats.dueThisMonth.amount + currentStats.paidThisMonth.amount) / totalInvoices).toLocaleString()
                    : '0'
                  }
                </span>
              </div>
              
              {/* Collection Efficiency */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Collection Rate</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {totalInvoices > 0 
                    ? Math.round((currentStats.paidThisMonth.count / totalInvoices) * 100)
                    : 0
                  }%
                </span>
              </div>
              
              {/* Payment Trend */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Payment Performance</span>
                  <span>
                    {currentStats.overdue.count === 0 ? 'Excellent' : 
                     currentStats.overdue.count <= 1 ? 'Good' : 'Needs Attention'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      currentStats.overdue.count === 0 ? 'bg-green-500' :
                      currentStats.overdue.count <= 1 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.max((currentStats.paidThisMonth.count / Math.max(totalInvoices, 1)) * 100, 20)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Help & Resources */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold text-foreground mb-4">Help & Resources</h3>
            <div className="space-y-3 text-sm">
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-primary/5 rounded-md transition-colors">
                • Setting up recurring billing
              </button>
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-primary/5 rounded-md transition-colors">
                • Managing overdue invoices
              </button>
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-primary/5 rounded-md transition-colors">
                • Export billing reports
              </button>
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-primary/5 rounded-md transition-colors">
                • Payment reminder settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;