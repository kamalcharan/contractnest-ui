// src/components/billing/BillingStatsGrid.tsx
import React from 'react';
import { AlertTriangle, Clock, Calendar, CheckCircle, DollarSign } from 'lucide-react';

interface BillingStatsGridProps {
  billingStats: {
    overdue: { count: number; amount: number };
    dueThisWeek: { count: number; amount: number };
    dueThisMonth: { count: number; amount: number };
    paidThisMonth: { count: number; amount: number };
    totalOutstanding: number;
  };
  contactId: string;
  currency: string;
  currencySymbol: string;
}

const BillingStatsGrid: React.FC<BillingStatsGridProps> = ({ 
  billingStats, 
  contactId, 
  currency,
  currencySymbol 
}) => {
  const formatAmount = (amount: number) => {
    if (currency === 'INR' || currency === 'all') {
      // Indian formatting
      if (amount >= 100000) {
        return `${currencySymbol}${(amount / 100000).toFixed(1)}L`;
      } else if (amount >= 1000) {
        return `${currencySymbol}${(amount / 1000).toFixed(1)}K`;
      }
      return `${currencySymbol}${amount.toLocaleString()}`;
    } else {
      // International formatting
      if (amount >= 1000) {
        return `${currencySymbol}${(amount / 1000).toFixed(1)}K`;
      }
      return `${currencySymbol}${amount.toLocaleString()}`;
    }
  };

  const stats = [
    {
      id: 'overdue',
      label: 'Overdue',
      count: billingStats.overdue.count,
      amount: billingStats.overdue.amount,
      description: 'Past due invoices',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-100',
      priority: 'high'
    },
    {
      id: 'dueThisWeek',
      label: 'Due This Week',
      count: billingStats.dueThisWeek.count,
      amount: billingStats.dueThisWeek.amount,
      description: 'Payment due soon',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      priority: 'medium'
    },
    {
      id: 'dueThisMonth',
      label: 'Due This Month',
      count: billingStats.dueThisMonth.count,
      amount: billingStats.dueThisMonth.amount,
      description: 'Monthly due invoices',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      priority: 'normal'
    },
    {
      id: 'paidThisMonth',
      label: 'Paid This Month',
      count: billingStats.paidThisMonth.count,
      amount: billingStats.paidThisMonth.amount,
      description: 'Successfully collected',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      priority: 'success'
    }
  ];

  const totalInvoices = stats.reduce((sum, stat) => sum + stat.count, 0);
  const totalAmount = stats.reduce((sum, stat) => sum + stat.amount, 0);

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Billing Overview</h3>
          <p className="text-sm text-muted-foreground">
            {totalInvoices} total invoices • {formatAmount(totalAmount)} total value
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">
            {formatAmount(billingStats.totalOutstanding)}
          </div>
          <div className="text-xs text-muted-foreground">Outstanding</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          
          return (
            <div 
              key={stat.id} 
              className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${stat.bgColor} ${stat.borderColor} ${stat.hoverColor}
                ${stat.count > 0 ? 'hover:shadow-md' : 'opacity-75'}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/80 ${stat.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {stat.count}
                  </div>
                  <div className="text-xs text-muted-foreground">invoices</div>
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="font-medium text-foreground mb-1 text-sm">
                  {stat.label}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {stat.description}
                </p>
                <div className={`text-sm font-semibold ${stat.color}`}>
                  {formatAmount(stat.amount)}
                </div>
              </div>
              
              {/* Priority indicator */}
              {stat.priority === 'high' && stat.count > 0 && (
                <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  Action Required
                </div>
              )}
              
              {stat.priority === 'medium' && stat.count > 0 && (
                <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                  <Clock className="h-3 w-3" />
                  Due Soon
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Outstanding Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-red-600">
              {billingStats.overdue.count + billingStats.dueThisWeek.count}
            </div>
            <div className="text-xs text-muted-foreground">Urgent</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {billingStats.paidThisMonth.count}
            </div>
            <div className="text-xs text-muted-foreground">Paid</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {formatAmount(billingStats.totalOutstanding)}
            </div>
            <div className="text-xs text-muted-foreground">Outstanding</div>
          </div>
        </div>
      </div>

      {/* Collection Rate */}
      {totalAmount > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Collection Rate</span>
            <span className="font-medium">
              {Math.round((billingStats.paidThisMonth.amount / totalAmount) * 100)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((billingStats.paidThisMonth.amount / totalAmount) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingStatsGrid;