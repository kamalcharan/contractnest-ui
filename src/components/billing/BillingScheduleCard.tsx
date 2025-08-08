// src/components/billing/BillingScheduleCard.tsx - Theme Enabled Version
import React from 'react';
import { Calendar, Clock, RefreshCw, AlertCircle, Settings } from 'lucide-react';

interface BillingScheduleCardProps {
  contactId: string;
}

const BillingScheduleCard: React.FC<BillingScheduleCardProps> = ({ contactId }) => {
  // Mock billing schedule data - this would come from API
  const upcomingBilling = [
    {
      id: '1',
      title: 'Monthly Service Fee',
      amount: 25000,
      currency: 'INR',
      dueDate: '2024-02-01',
      type: 'recurring',
      frequency: 'monthly',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Annual Support Contract',
      amount: 150000,
      currency: 'INR',
      dueDate: '2024-03-15',
      type: 'one-time',
      status: 'pending_confirmation'
    },
    {
      id: '3',
      title: 'Quarterly Consulting',
      amount: 500,
      currency: 'USD',
      dueDate: '2024-04-01',
      type: 'recurring',
      frequency: 'quarterly',
      status: 'confirmed'
    }
  ];

  const formatAmount = (amount: number, currency: string) => {
    const symbols = { INR: '₹', USD: '$', EUR: '€' };
    const symbol = symbols[currency as keyof typeof symbols] || currency;
    
    if (currency === 'INR') {
      if (amount >= 100000) {
        return `${symbol}${(amount / 100000).toFixed(1)}L`;
      } else if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)}K`;
      }
    } else {
      if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)}K`;
      }
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: Clock
        };
      case 'pending_confirmation':
        return {
          label: 'Pending',
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          icon: AlertCircle
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: Clock
        };
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-semibold text-foreground">Billing Schedule</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        View and manage future client billing. Manually billed items require confirmation 
        before invoicing, while automatically billed items generate an invoice on a set date.
      </p>
      
      {/* Upcoming Billing Items */}
      <div className="space-y-3 mb-4">
        {upcomingBilling.map((billing) => {
          const statusConfig = getStatusConfig(billing.status);
          const StatusIcon = statusConfig.icon;
          const daysUntil = getDaysUntilDue(billing.dueDate);
          
          return (
            <div key={billing.id} className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {billing.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatAmount(billing.amount, billing.currency)}
                    </span>
                    {billing.type === 'recurring' && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        {billing.frequency}
                      </span>
                    )}
                  </div>
                </div>
                
                <span className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
                  ${statusConfig.color} ${statusConfig.bgColor} ${statusConfig.borderColor}
                `}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Due: {formatDate(billing.dueDate)}</span>
                <span className={daysUntil < 0 ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                  {daysUntil > 0 ? `${daysUntil} days` : daysUntil === 0 ? 'Today' : `${Math.abs(daysUntil)} days overdue`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Help Links */}
      <div className="space-y-2 text-sm border-t border-border pt-4">
        <div className="text-primary hover:underline cursor-pointer">
          • Creating and scheduling invoice
        </div>
        <div className="text-primary hover:underline cursor-pointer">
          • One-off changes to the billing schedule
        </div>
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {upcomingBilling.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-xs text-muted-foreground">Confirmed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
              {upcomingBilling.filter(b => b.status === 'pending_confirmation').length}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>
      
      {/* Settings */}
      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
          <Settings className="h-4 w-4" />
          Billing Settings
        </button>
      </div>
    </div>
  );
};

export default BillingScheduleCard;