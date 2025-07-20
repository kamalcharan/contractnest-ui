// src/pages/settings/businessmodel/admin/billing/index.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Plus, Printer, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { analyticsService } from '@/services/analytics.service';

// Import components
import BillingSummary from '@/components/businessmodel/billing/BillingSummary';
import InvoiceList from '@/components/businessmodel/billing/InvoiceList';

// Import mock data
import { 
  BillingSummaryData, 
  Invoice, 
  fakeBillingSummary, 
  fakeInvoices,
  getBillingSummaryByPeriod 
} from '@/utils/fakejson/BillingData';

type PeriodOption = '7d' | '30d' | '90d' | 'ytd' | 'all';

const BillingDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLive } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('30d');
  const [billingSummary, setBillingSummary] = useState<BillingSummaryData>(
    getBillingSummaryByPeriod(selectedPeriod)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(fakeInvoices);
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('settings/businessmodel/admin/billing', 'Billing Dashboard');
  }, []);
  
  // Simulate API fetch when period changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get data for selected period
      setBillingSummary(getBillingSummaryByPeriod(selectedPeriod));
      
      // In a real implementation, invoices would be filtered by the period
      setInvoices(fakeInvoices);
      
      setLoading(false);
    };
    
    fetchData();
  }, [selectedPeriod]);
  
  // Handle Back
  const handleBack = () => {
    navigate('/settings/businessmodel/admin');
  };
  
  // Handle Create Invoice
  const handleCreateInvoice = () => {
    navigate('/settings/businessmodel/admin/billing/create-invoice');
  };
  
  // Handle View Invoice Detail
  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/settings/businessmodel/admin/billing/invoices/${invoiceId}`);
  };
  
  // Handle Period Change
  const handlePeriodChange = (period: PeriodOption) => {
    setSelectedPeriod(period);
  };
  
  // Handle Refresh
  const handleRefresh = () => {
    // Refetch data
    setLoading(true);
    setTimeout(() => {
      setBillingSummary(getBillingSummaryByPeriod(selectedPeriod));
      setInvoices(fakeInvoices);
      setLoading(false);
    }, 500);
  };
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Billing Dashboard</h1>
            <p className="text-muted-foreground">Manage invoices and payment status</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
          </button>
          
          <button
            onClick={handleCreateInvoice}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>
      
      {/* Environment Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          isLive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isLive ? 'bg-green-500' : 'bg-amber-500'
          }`}></div>
          {isLive ? 'Live Environment' : 'Test Environment'}
        </div>
      </div>
      
      {/* Period selector */}
      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
            { value: 'ytd', label: 'Year to date' },
            { value: 'all', label: 'All time' }
          ].map((period) => (
            <button
              key={period.value}
              type="button"
              onClick={() => handlePeriodChange(period.value as PeriodOption)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedPeriod === period.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              } ${
                period.value === '7d' ? 'rounded-l-md' : ''
              } ${
                period.value === 'all' ? 'rounded-r-md' : ''
              } border border-gray-200 dark:border-gray-600`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Billing Summary */}
      <div className="mb-6">
        <BillingSummary 
          data={billingSummary}
          period={selectedPeriod}
          isLoading={loading}
        />
      </div>
      
      {/* Invoices Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invoices</h2>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1.5 rounded-md border border-input bg-background text-sm inline-flex items-center hover:bg-muted/50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button 
              className="px-3 py-1.5 rounded-md border border-input bg-background text-sm inline-flex items-center hover:bg-muted/50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              className="px-3 py-1.5 rounded-md border border-input bg-background text-sm inline-flex items-center hover:bg-muted/50 transition-colors"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>
        
        <InvoiceList 
          invoices={invoices}
          onViewInvoice={handleViewInvoice}
          isLoading={loading}
        />
      </div>
      
      {/* Environment note */}
      {!isLive && (
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
          <p className="text-sm flex items-center">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            You are in the Test Environment. Invoices generated here will not be sent to real customers.
          </p>
        </div>
      )}
    </div>
  );
};

export default BillingDashboardPage;