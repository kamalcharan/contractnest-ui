// src/components/billing/BillingTab.tsx
import React, { useState } from 'react';
import { DollarSign, Plus, FileText } from 'lucide-react';
import BillingStatsGrid from './BillingStatsGrid';
import RecentBillingCard from './RecentBillingCard';
import BillingScheduleCard from './BillingScheduleCard';

interface BillingTabProps {
  contactId: string;
}

const BillingTab: React.FC<BillingTabProps> = ({ contactId }) => {
  const [activeCurrency, setActiveCurrency] = useState<string>('all');

  // Mock billing data - this would come from API
  const billingStats = {
    all: {
      overdue: { count: 2, amount: 25000 },
      dueThisWeek: { count: 1, amount: 15000 },
      dueThisMonth: { count: 3, amount: 45000 },
      paidThisMonth: { count: 5, amount: 85000 },
      totalOutstanding: 85000
    },
    USD: {
      overdue: { count: 1, amount: 300 }, // $300
      dueThisWeek: { count: 0, amount: 0 },
      dueThisMonth: { count: 1, amount: 500 },
      paidThisMonth: { count: 2, amount: 1200 },
      totalOutstanding: 800
    },
    INR: {
      overdue: { count: 1, amount: 20000 }, // ₹20,000
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
    all: { label: 'All', symbol: '₹', total: '1.55L' },
    USD: { label: 'USD', symbol: '$', total: '2K' },
    INR: { label: 'INR', symbol: '₹', total: '1.35L' },
    EUR: { label: 'EUR', symbol: '€', total: '0' }
  };

  const currentStats = billingStats[activeCurrency as keyof typeof billingStats];
  const totalInvoices = Object.values(currentStats).reduce((sum, stat) => {
    return sum + (typeof stat === 'object' && 'count' in stat ? stat.count : 0);
  }, 0);

  // If no billing data exists for any currency, show empty state
  const hasAnyBilling = Object.values(billingStats).some(stats => 
    Object.values(stats).some(stat => 
      typeof stat === 'object' && 'count' in stat && stat.count > 0
    )
  );

  if (!hasAnyBilling) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No billing information</h3>
            <p className="text-muted-foreground mb-6">
              Invoices and billing history with this contact will appear here.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </button>
              <button className="flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                <FileText className="mr-2 h-4 w-4" />
                + Contract
              </button>
            </div>
          </div>
        </div>
        
        <div className="xl:col-span-1">
          <BillingScheduleCard contactId={contactId} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Currency Tabs */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(currencyConfig).map(([currency, config]) => (
            <button
              key={currency}
              onClick={() => setActiveCurrency(currency)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeCurrency === currency
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
              `}
            >
              {config.label}: {config.symbol}{config.total}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Content Area - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Billing Statistics Grid */}
          <BillingStatsGrid 
            billingStats={currentStats} 
            contactId={contactId}
            currency={activeCurrency}
            currencySymbol={currencyConfig[activeCurrency as keyof typeof currencyConfig].symbol}
          />
          
          {/* Recent Billing Activity */}
          <RecentBillingCard 
            contactId={contactId} 
            currency={activeCurrency}
          />
        </div>
        
        {/* Right Sidebar - 1/3 width */}
        <div className="xl:col-span-1 space-y-6">
          {/* Billing Schedule Card */}
          <BillingScheduleCard contactId={contactId} />
          
          {/* Quick Actions */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </button>
              <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
                Record Payment
              </button>
              <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
                View Statements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;