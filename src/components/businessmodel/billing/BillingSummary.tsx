// src/components/businessmodel/billing/BillingSummary.tsx

import React from 'react';
import { ArrowDown, ArrowUp, DollarSign, FileText, Clock, AlertCircle } from 'lucide-react';
import { BillingSummaryData } from '@/utils/fakejson/BillingData';
import { useTheme } from '@/contexts/ThemeContext';

interface BillingSummaryProps {
  data: BillingSummaryData;
  period: '7d' | '30d' | '90d' | 'ytd' | 'all';
  isLoading?: boolean;
}

const BillingSummary: React.FC<BillingSummaryProps> = ({
  data,
  period,
  isLoading = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate percentages
  const paidPercentage = Math.round((data.paidInvoicesCount / data.invoicesCount) * 100) || 0;
  const pendingPercentage = Math.round((data.pendingInvoicesCount / data.invoicesCount) * 100) || 0;
  const overduePercentage = Math.round((data.overdueInvoicesCount / data.invoicesCount) * 100) || 0;
  
  // Determine health indicator
  const getHealthStatus = () => {
    if (overduePercentage > 10) return 'critical';
    if (overduePercentage > 5 || pendingPercentage > 20) return 'warning';
    return 'good';
  };
  
  const healthStatus = getHealthStatus();
  
  // Period label
  const periodLabel = () => {
    switch (period) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case 'ytd': return 'Year to date';
      case 'all': return 'All time';
      default: return 'Last 30 days';
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div 
        className="rounded-lg border overflow-hidden animate-pulse transition-colors"
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
          <div 
            className="h-6 rounded w-48"
            style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
          ></div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="h-24 rounded"
              style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
            ></div>
            <div 
              className="h-24 rounded"
              style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
            ></div>
            <div 
              className="h-24 rounded"
              style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
            ></div>
          </div>
          <div 
            className="mt-6 h-12 rounded"
            style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
          ></div>
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
        className="px-6 py-4 border-b flex justify-between items-center transition-colors"
        style={{
          backgroundColor: colors.utility.primaryBackground + '20',
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <h2 
          className="text-lg font-semibold transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Billing Summary ({periodLabel()})
        </h2>
        
        <div className="flex items-center">
          <span 
            className="mr-2 text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Health:
          </span>
          <div 
            className="px-2 py-1 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: healthStatus === 'good'
                ? colors.semantic.success + '20'
                : healthStatus === 'warning'
                ? (colors.semantic.warning || '#f59e0b') + '20'
                : colors.semantic.error + '20',
              color: healthStatus === 'good'
                ? colors.semantic.success
                : healthStatus === 'warning'
                ? colors.semantic.warning || '#f59e0b'
                : colors.semantic.error
            }}
          >
            <div className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-1.5"
                style={{
                  backgroundColor: healthStatus === 'good'
                    ? colors.semantic.success
                    : healthStatus === 'warning'
                    ? colors.semantic.warning || '#f59e0b'
                    : colors.semantic.error
                }}
              ></div>
              {healthStatus === 'good' ? 'Good' : healthStatus === 'warning' ? 'Warning' : 'Critical'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Revenue */}
          <div 
            className="p-4 rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.utility.primaryBackground + '10',
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Total Revenue
                </p>
                <h3 
                  className="text-2xl font-bold mt-1 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatCurrency(data.totalRevenue)}
                </h3>
              </div>
              <div 
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: colors.semantic.success + '20' }}
              >
                <DollarSign 
                  className="h-5 w-5 transition-colors" 
                  style={{ color: colors.semantic.success }}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {data.percentageChange && data.percentageChange.revenue !== 0 && (
                <div 
                  className="flex items-center text-xs font-medium transition-colors"
                  style={{
                    color: data.percentageChange.revenue > 0 
                      ? colors.semantic.success
                      : colors.semantic.error
                  }}
                >
                  {data.percentageChange.revenue > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(data.percentageChange.revenue)}% from last period</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Outstanding Amount */}
          <div 
            className="p-4 rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.utility.primaryBackground + '10',
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Outstanding Amount
                </p>
                <h3 
                  className="text-2xl font-bold mt-1 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatCurrency(data.outstandingAmount)}
                </h3>
              </div>
              <div 
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: (colors.semantic.warning || '#f59e0b') + '20' }}
              >
                <Clock 
                  className="h-5 w-5 transition-colors" 
                  style={{ color: colors.semantic.warning || '#f59e0b' }}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {data.percentageChange && data.percentageChange.outstanding !== 0 && (
                <div 
                  className="flex items-center text-xs font-medium transition-colors"
                  style={{
                    color: data.percentageChange.outstanding < 0 
                      ? colors.semantic.success
                      : colors.semantic.error
                  }}
                >
                  {data.percentageChange.outstanding < 0 ? (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(data.percentageChange.outstanding)}% from last period</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Invoices Status */}
          <div 
            className="p-4 rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.utility.primaryBackground + '10',
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Invoices
                </p>
                <h3 
                  className="text-2xl font-bold mt-1 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {data.invoicesCount} total
                </h3>
              </div>
              <div 
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: colors.brand.primary + '20' }}
              >
                <FileText 
                  className="h-5 w-5 transition-colors" 
                  style={{ color: colors.brand.primary }}
                />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col items-center">
                <span 
                  className="font-medium transition-colors"
                  style={{ color: colors.semantic.success }}
                >
                  {data.paidInvoicesCount}
                </span>
                <span 
                  className="transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Paid
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span 
                  className="font-medium transition-colors"
                  style={{ color: colors.semantic.warning || '#f59e0b' }}
                >
                  {data.pendingInvoicesCount}
                </span>
                <span 
                  className="transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Pending
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span 
                  className="font-medium transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {data.overdueInvoicesCount}
                </span>
                <span 
                  className="transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Overdue
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Invoice Status Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Invoice Status Distribution
            </h4>
            <span 
              className="text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {data.invoicesCount} invoices total
            </span>
          </div>
          
          <div 
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
          >
            <div className="flex h-full">
              <div 
                className="h-full" 
                style={{ 
                  width: `${paidPercentage}%`,
                  backgroundColor: colors.semantic.success
                }}
                title={`Paid: ${data.paidInvoicesCount} (${paidPercentage}%)`}
              ></div>
              <div 
                className="h-full" 
                style={{ 
                  width: `${pendingPercentage}%`,
                  backgroundColor: colors.semantic.warning || '#f59e0b'
                }}
                title={`Pending: ${data.pendingInvoicesCount} (${pendingPercentage}%)`}
              ></div>
              <div 
                className="h-full" 
                style={{ 
                  width: `${overduePercentage}%`,
                  backgroundColor: colors.semantic.error
                }}
                title={`Overdue: ${data.overdueInvoicesCount} (${overduePercentage}%)`}
              ></div>
            </div>
          </div>
          
          <div 
            className="flex justify-between mt-2 text-xs transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colors.semantic.success }}
              ></div>
              <span>Paid ({paidPercentage}%)</span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colors.semantic.warning || '#f59e0b' }}
              ></div>
              <span>Pending ({pendingPercentage}%)</span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colors.semantic.error }}
              ></div>
              <span>Overdue ({overduePercentage}%)</span>
            </div>
          </div>
        </div>
        
        {/* Overdue Warning */}
        {data.overdueInvoicesCount > 0 && data.overdueDays && (
          <div 
            className="mt-4 p-3 rounded-md border flex items-start transition-colors"
            style={{
              backgroundColor: colors.semantic.error + '10',
              borderColor: colors.semantic.error + '40'
            }}
          >
            <AlertCircle 
              className="h-4 w-4 mr-2 mt-0.5 transition-colors" 
              style={{ color: colors.semantic.error }}
            />
            <div>
              <p 
                className="text-sm transition-colors"
                style={{ color: colors.semantic.error }}
              >
                <span className="font-medium">Warning:</span> {data.overdueInvoicesCount} invoice{data.overdueInvoicesCount > 1 ? 's are' : ' is'} overdue by an average of {data.overdueDays} days.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingSummary;