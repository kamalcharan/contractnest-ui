// src/components/billing/BillingStatsGrid.tsx - Theme Enabled Version with Complete Safety
import React from 'react';
import { AlertTriangle, Clock, Calendar, CheckCircle, DollarSign } from 'lucide-react';

interface BillingStatsGridProps {
  billingStats?: {
    overdue?: { count: number; amount: number };
    dueThisWeek?: { count: number; amount: number };
    dueThisMonth?: { count: number; amount: number };
    paidThisMonth?: { count: number; amount: number };
    totalOutstanding?: number;
  } | null;
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
  // CRITICAL: Add comprehensive safety check for billingStats
  if (!billingStats || typeof billingStats !== 'object') {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="text-center py-8">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-medium text-foreground mb-2">No billing data available</h3>
          <p className="text-sm text-muted-foreground">
            Billing statistics will appear here once invoices are created.
          </p>
        </div>
      </div>
    );
  }

  // CRITICAL: Ensure all required properties exist with comprehensive fallbacks
  const safeStats = {
    overdue: billingStats.overdue || { count: 0, amount: 0 },
    dueThisWeek: billingStats.dueThisWeek || { count: 0, amount: 0 },
    dueThisMonth: billingStats.dueThisMonth || { count: 0, amount: 0 },
    paidThisMonth: billingStats.paidThisMonth || { count: 0, amount: 0 },
    totalOutstanding: billingStats.totalOutstanding || 0
  };

  // CRITICAL: Additional safety check for individual stat objects
  Object.keys(safeStats).forEach(key => {
    if (key !== 'totalOutstanding') {
      const stat = safeStats[key as keyof typeof safeStats];
      if (typeof stat === 'object' && stat !== null) {
        if (typeof stat.count !== 'number') stat.count = 0;
        if (typeof stat.amount !== 'number') stat.amount = 0;
      }
    }
  });

  const formatAmount = (amount: number) => {
    // CRITICAL: Ensure amount is a valid number
    const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    
    if (currency === 'INR' || currency === 'all') {
      // Indian formatting
      if (validAmount >= 100000) {
        return `${currencySymbol}${(validAmount / 100000).toFixed(1)}L`;
      } else if (validAmount >= 1000) {
        return `${currencySymbol}${(validAmount / 1000).toFixed(1)}K`;
      }
      return `${currencySymbol}${validAmount.toLocaleString()}`;
    } else {
      // International formatting
      if (validAmount >= 1000) {
        return `${currencySymbol}${(validAmount / 1000).toFixed(1)}K`;
      }
      return `${currencySymbol}${validAmount.toLocaleString()}`;
    }
  };

  const stats = [
    {
      id: 'overdue',
      label: 'Overdue',
      count: safeStats.overdue.count,
      amount: safeStats.overdue.amount,
      description: 'Past due invoices',
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/30',
      iconBg: 'bg-white/80 dark:bg-red-950/50',
      priority: 'high'
    },
    {
      id: 'dueThisWeek',
      label: 'Due This Week',
      count: safeStats.dueThisWeek.count,
      amount: safeStats.dueThisWeek.amount,
      description: 'Payment due soon',
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
      iconBg: 'bg-white/80 dark:bg-orange-950/50',
      priority: 'medium'
    },
    {
      id: 'dueThisMonth',
      label: 'Due This Month',
      count: safeStats.dueThisMonth.count,
      amount: safeStats.dueThisMonth.amount,
      description: 'Monthly due invoices',
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
      iconBg: 'bg-white/80 dark:bg-blue-950/50',
      priority: 'normal'
    },
    {
      id: 'paidThisMonth',
      label: 'Paid This Month',
      count: safeStats.paidThisMonth.count,
      amount: safeStats.paidThisMonth.amount,
      description: 'Successfully collected',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30',
      iconBg: 'bg-white/80 dark:bg-green-950/50',
      priority: 'success'
    }
  ];

  const totalInvoices = stats.reduce((sum, stat) => sum + (stat.count || 0), 0);
  const totalAmount = stats.reduce((sum, stat) => sum + (stat.amount || 0), 0);

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Billing Overview</h3>
          <p className="text-sm text-muted-foreground">
            {totalInvoices} total invoices • {formatAmount(totalAmount)} total value
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatAmount(safeStats.totalOutstanding)}
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
                <div className={`p-2 rounded-lg ${stat.iconBg} ${stat.color}`}>
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
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  Action Required
                </div>
              )}
              
              {stat.priority === 'medium' && stat.count > 0 && (
                <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
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
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
              {safeStats.overdue.count + safeStats.dueThisWeek.count}
            </div>
            <div className="text-xs text-muted-foreground">Urgent</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {safeStats.paidThisMonth.count}
            </div>
            <div className="text-xs text-muted-foreground">Paid</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {formatAmount(safeStats.totalOutstanding)}
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
            <span className="font-medium text-foreground">
              {Math.round((safeStats.paidThisMonth.amount / totalAmount) * 100)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((safeStats.paidThisMonth.amount / totalAmount) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingStatsGrid;