// src/components/businessmodel/admin/plandetail/cards/StatsCard.tsx

import React from 'react';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';

interface PlanStats {
  activeTenants?: number;
  trialTenants?: number;
  monthlyRevenue?: number;
  conversionRate?: number;
  totalSubscribers?: number;
  averageRevenuePerUser?: number;
  churnRate?: number;
  lifetimeValue?: number;
}

interface StatsCardProps {
  stats?: PlanStats;
  selectedCurrency: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  stats = {},
  selectedCurrency,
  isLoading = false
}) => {
  // Format price with currency symbol
  const formatPrice = (price: number | null | undefined, currencyCode: string) => {
    if (price === null || price === undefined) return `${getCurrencySymbol(currencyCode)} 0.00`;
    return `${getCurrencySymbol(currencyCode)} ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // Format percentage
  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0%';
    return `${value.toFixed(1)}%`;
  };

  // Format number with commas
  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0';
    return value.toLocaleString();
  };

  const statItems = [
    {
      label: 'Active Tenants',
      value: formatNumber(stats.activeTenants),
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: 'Trial Tenants',
      value: formatNumber(stats.trialTenants),
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      label: 'Monthly Revenue',
      value: formatPrice(stats.monthlyRevenue, selectedCurrency),
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      label: 'Conversion Rate',
      value: formatPercentage(stats.conversionRate),
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      label: 'Total Subscribers',
      value: formatNumber(stats.totalSubscribers),
      icon: Users,
      color: 'text-indigo-600'
    },
    {
      label: 'Avg Revenue Per User',
      value: formatPrice(stats.averageRevenuePerUser, selectedCurrency),
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      label: 'Churn Rate',
      value: formatPercentage(stats.churnRate),
      icon: TrendingUp,
      color: 'text-red-600'
    },
    {
      label: 'Lifetime Value',
      value: formatPrice(stats.lifetimeValue, selectedCurrency),
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 bg-muted/20 border-b border-border">
          <h2 className="text-lg font-semibold">Plan Statistics</h2>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center pb-2 border-b border-border">
              <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 bg-muted/20 border-b border-border">
        <h2 className="text-lg font-semibold">Plan Statistics</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {statItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <div 
                key={index} 
                className="flex justify-between items-center pb-3 border-b border-border last:border-b-0 last:pb-0"
              >
                <div className="flex items-center">
                  <IconComponent className={`h-4 w-4 mr-2 ${item.color}`} />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            );
          })}
        </div>
        
        {/* Additional insights section */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            Statistics updated every hour
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;