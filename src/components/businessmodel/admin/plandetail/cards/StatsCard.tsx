// src/components/businessmodel/admin/plandetail/cards/StatsCard.tsx

import React from 'react';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

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
      color: colors.semantic.success
    },
    {
      label: 'Trial Tenants',
      value: formatNumber(stats.trialTenants),
      icon: Clock,
      color: colors.brand.primary
    },
    {
      label: 'Monthly Revenue',
      value: formatPrice(stats.monthlyRevenue, selectedCurrency),
      icon: DollarSign,
      color: colors.brand.primary
    },
    {
      label: 'Conversion Rate',
      value: formatPercentage(stats.conversionRate),
      icon: TrendingUp,
      color: colors.brand.tertiary || colors.brand.primary
    },
    {
      label: 'Total Subscribers',
      value: formatNumber(stats.totalSubscribers),
      icon: Users,
      color: colors.brand.secondary
    },
    {
      label: 'Avg Revenue Per User',
      value: formatPrice(stats.averageRevenuePerUser, selectedCurrency),
      icon: DollarSign,
      color: colors.semantic.success
    },
    {
      label: 'Churn Rate',
      value: formatPercentage(stats.churnRate),
      icon: TrendingUp,
      color: colors.semantic.error
    },
    {
      label: 'Lifetime Value',
      value: formatPrice(stats.lifetimeValue, selectedCurrency),
      icon: DollarSign,
      color: colors.semantic.warning || '#f59e0b'
    }
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div 
        className="rounded-lg border overflow-hidden transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <div 
          className="px-6 py-4 border-b transition-colors"
          style={{
            backgroundColor: colors.utility.primaryBackground + '20',
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          <h2 
            className="text-lg font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Plan Statistics
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center pb-2 border-b transition-colors"
              style={{ borderColor: colors.utility.primaryText + '20' }}
            >
              <div 
                className="h-4 rounded w-24 animate-pulse"
                style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
              ></div>
              <div 
                className="h-4 rounded w-16 animate-pulse"
                style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg border overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20'
      }}
    >
      <div 
        className="px-6 py-4 border-b transition-colors"
        style={{
          backgroundColor: colors.utility.primaryBackground + '20',
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <h2 
          className="text-lg font-semibold transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Plan Statistics
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {statItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <div 
                key={index} 
                className="flex justify-between items-center pb-3 border-b last:border-b-0 last:pb-0 transition-colors"
                style={{ borderColor: colors.utility.primaryText + '20' }}
              >
                <div className="flex items-center">
                  <IconComponent 
                    className="h-4 w-4 mr-2 transition-colors" 
                    style={{ color: item.color }}
                  />
                  <span 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {item.label}
                  </span>
                </div>
                <span 
                  className="font-medium transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Additional insights section */}
        <div 
          className="mt-6 pt-4 border-t transition-colors"
          style={{ borderColor: colors.utility.primaryText + '20' }}
        >
          <div 
            className="text-xs text-center transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Statistics updated every hour
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;