// src/pages/settings/businessmodel/admin/billing/index.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Plus, Printer, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
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
    <div 
      className="p-6 transition-colors"
      style={{ backgroundColor: `${colors.utility.secondaryText}10` }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full transition-colors hover:opacity-80"
            style={{ backgroundColor: `${colors.utility.secondaryText}20` }}
          >
            <ArrowLeft 
              className="h-5 w-5"
              style={{ color: colors.utility.secondaryText }}
            />
          </button>
          <div>
            <h1 
              className="text-2xl font-bold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Billing Dashboard
            </h1>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Manage invoices and payment status
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-md transition-colors hover:opacity-80"
            style={{ backgroundColor: `${colors.utility.secondaryText}20` }}
            title="Refresh data"
          >
            <RefreshCw 
              className="h-5 w-5"
              style={{ color: colors.utility.secondaryText }}
            />
          </button>
          
          <button
            onClick={handleCreateInvoice}
            className="px-4 py-2 rounded-md transition-colors hover:opacity-90 inline-flex items-center"
            style={{
              backgroundColor: colors.brand.primary,
              color: 'white'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>
      
      {/* Environment Badge */}
      <div className="mb-6">
        <div 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm"
          style={{
            backgroundColor: isLive 
              ? `${colors.semantic.success}20`
              : `${colors.semantic.warning || '#F59E0B'}20`,
            color: isLive 
              ? colors.semantic.success 
              : (colors.semantic.warning || '#F59E0B')
          }}
        >
          <div 
            className="w-2 h-2 rounded-full mr-2"
            style={{
              backgroundColor: isLive ? colors.semantic.success : (colors.semantic.warning || '#F59E0B')
            }}
          ></div>
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
          ].map((period, index, array) => (
            <button
              key={period.value}
              type="button"
              onClick={() => handlePeriodChange(period.value as PeriodOption)}
              className={`px-4 py-2 text-sm font-medium border transition-colors hover:opacity-80 ${
                index === 0 ? 'rounded-l-md' : ''
              } ${
                index === array.length - 1 ? 'rounded-r-md' : ''
              }`}
              style={{
                backgroundColor: selectedPeriod === period.value 
                  ? colors.brand.primary 
                  : colors.utility.primaryBackground,
                color: selectedPeriod === period.value 
                  ? 'white' 
                  : colors.utility.primaryText,
                borderColor: `${colors.utility.primaryText}30`
              }}
              onMouseEnter={(e) => {
                if (selectedPeriod !== period.value) {
                  e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPeriod !== period.value) {
                  e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
                }
              }}
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
          <h2 
            className="text-xl font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Invoices
          </h2>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1.5 rounded-md border text-sm inline-flex items-center transition-colors hover:opacity-80"
              style={{
                borderColor: `${colors.utility.secondaryText}40`,
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button 
              className="px-3 py-1.5 rounded-md border text-sm inline-flex items-center transition-colors hover:opacity-80"
              style={{
                borderColor: `${colors.utility.secondaryText}40`,
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              className="px-3 py-1.5 rounded-md border text-sm inline-flex items-center transition-colors hover:opacity-80"
              style={{
                borderColor: `${colors.utility.secondaryText}40`,
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.utility.secondaryText}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
              }}
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
        <div 
          className="mt-8 p-4 border rounded-md transition-colors"
          style={{
            backgroundColor: `${colors.semantic.warning || '#F59E0B'}10`,
            borderColor: `${colors.semantic.warning || '#F59E0B'}30`,
            color: colors.semantic.warning || '#F59E0B'
          }}
        >
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