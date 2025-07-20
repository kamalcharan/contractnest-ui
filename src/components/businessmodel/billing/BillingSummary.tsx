// src/components/businessmodel/billing/BillingSummary.tsx

import React from 'react';
import { ArrowDown, ArrowUp, DollarSign, FileText, Clock, AlertCircle } from 'lucide-react';
import { BillingSummaryData } from '@/utils/fakejson/BillingData';

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
      <div className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
        <div className="px-6 py-4 bg-muted/20 border-b border-border">
          <div className="h-6 bg-muted rounded w-48"></div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
          <div className="mt-6 h-12 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 bg-muted/20 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold">Billing Summary ({periodLabel()})</h2>
        
        <div className="flex items-center">
          <span className="mr-2 text-sm text-muted-foreground">Health:</span>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            healthStatus === 'good'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : healthStatus === 'warning'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1.5 ${
                healthStatus === 'good'
                  ? 'bg-green-500'
                  : healthStatus === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}></div>
              {healthStatus === 'good' ? 'Good' : healthStatus === 'warning' ? 'Warning' : 'Critical'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Revenue */}
          <div className="bg-muted/10 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(data.totalRevenue)}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/30">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {data.percentageChange && data.percentageChange.revenue !== 0 && (
                <div className={`flex items-center text-xs font-medium ${
                  data.percentageChange.revenue > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
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
          <div className="bg-muted/10 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(data.outstandingAmount)}</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-full dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {data.percentageChange && data.percentageChange.outstanding !== 0 && (
                <div className={`flex items-center text-xs font-medium ${
                  data.percentageChange.outstanding < 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
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
          <div className="bg-muted/10 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Invoices</p>
                <h3 className="text-2xl font-bold mt-1">{data.invoicesCount} total</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/30">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col items-center">
                <span className="font-medium text-green-600 dark:text-green-400">{data.paidInvoicesCount}</span>
                <span className="text-muted-foreground">Paid</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-amber-600 dark:text-amber-400">{data.pendingInvoicesCount}</span>
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-red-600 dark:text-red-400">{data.overdueInvoicesCount}</span>
                <span className="text-muted-foreground">Overdue</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Invoice Status Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Invoice Status Distribution</h4>
            <span className="text-xs text-muted-foreground">{data.invoicesCount} invoices total</span>
          </div>
          
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="flex h-full">
              <div 
                className="bg-green-500 h-full" 
                style={{ width: `${paidPercentage}%` }}
                title={`Paid: ${data.paidInvoicesCount} (${paidPercentage}%)`}
              ></div>
              <div 
                className="bg-amber-500 h-full" 
                style={{ width: `${pendingPercentage}%` }}
                title={`Pending: ${data.pendingInvoicesCount} (${pendingPercentage}%)`}
              ></div>
              <div 
                className="bg-red-500 h-full" 
                style={{ width: `${overduePercentage}%` }}
                title={`Overdue: ${data.overdueInvoicesCount} (${overduePercentage}%)`}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span>Paid ({paidPercentage}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
              <span>Pending ({pendingPercentage}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>Overdue ({overduePercentage}%)</span>
            </div>
          </div>
        </div>
        
        {/* Overdue Warning */}
        {data.overdueInvoicesCount > 0 && data.overdueDays && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start dark:bg-red-900/20 dark:border-red-800">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm text-red-700 dark:text-red-300">
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