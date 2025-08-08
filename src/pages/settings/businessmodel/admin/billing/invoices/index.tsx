// src/pages/settings/businessmodel/admin/billing/invoices/index.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Printer, 
  Check, 
  AlertCircle,
  CalendarClock,
  FileDown,
  Receipt,
  Building,
  CreditCard
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsService } from '@/services/analytics.service';

// Import mock data and types
import { Invoice, getInvoiceById } from '@/utils/fakejson/BillingData';

// Import components
import InvoiceTemplate from '@/components/businessmodel/billing/InvoiceTemplate';

const InvoiceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView(`settings/businessmodel/admin/billing/invoices/${id}`, 'Invoice Detail');
  }, [id]);
  
  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get invoice by ID
      const invoiceData = getInvoiceById(id || '');
      setInvoice(invoiceData || null);
      
      setLoading(false);
    };
    
    fetchInvoice();
  }, [id]);
  
  // Handle Back
  const handleBack = () => {
    navigate('/settings/businessmodel/admin/billing');
  };
  
  // Handle Mark as Paid
  const handleMarkAsPaid = () => {
    if (invoice && invoice.status !== 'paid') {
      setInvoice({
        ...invoice,
        status: 'paid',
        paidDate: new Date().toISOString()
      });
    }
  };
  
  // Handle Send Reminder
  const handleSendReminder = () => {
    // In a real implementation, this would trigger an email/notification
    alert(`Reminder sent to ${invoice?.tenantName}`);
  };
  
  // Format currency
  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${colors.semantic.success}20`,
              color: colors.semantic.success
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${colors.semantic.warning || '#F59E0B'}20`,
              color: colors.semantic.warning || '#F59E0B'
            }}
          >
            <CalendarClock className="h-4 w-4 mr-2" />
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${colors.semantic.error}20`,
              color: colors.semantic.error
            }}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Overdue
          </span>
        );
      default:
        return (
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${colors.utility.secondaryText}20`,
              color: colors.utility.secondaryText
            }}
          >
            {status}
          </span>
        );
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div 
        className="p-6 transition-colors"
        style={{ backgroundColor: `${colors.utility.secondaryText}10` }}
      >
        <div className="flex items-center mb-8">
          <div 
            className="mr-4 p-2 rounded-full animate-pulse h-10 w-10"
            style={{ backgroundColor: `${colors.utility.secondaryText}40` }}
          ></div>
          <div 
            className="h-8 rounded w-48 animate-pulse"
            style={{ backgroundColor: `${colors.utility.secondaryText}40` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <div 
              className="rounded-lg border overflow-hidden animate-pulse h-96"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            ></div>
          </div>
          <div className="col-span-1">
            <div 
              className="rounded-lg border overflow-hidden animate-pulse h-64"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
  
  // 404 state
  if (!invoice) {
    return (
      <div 
        className="p-6 transition-colors"
        style={{ backgroundColor: `${colors.utility.secondaryText}10` }}
      >
        <div className="flex items-center mb-8">
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
              Invoice Not Found
            </h1>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              The requested invoice does not exist or has been deleted
            </p>
          </div>
        </div>
        
        <div 
          className="text-center py-12 rounded-lg border transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}20`
          }}
        >
          <Receipt 
            className="h-16 w-16 mx-auto opacity-50 mb-4"
            style={{ color: colors.utility.secondaryText }}
          />
          <h2 
            className="text-lg font-medium mb-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Invoice Not Found
          </h2>
          <p 
            className="mb-6 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            The invoice you're looking for doesn't exist or may have been deleted.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-md transition-colors hover:opacity-90"
            style={{
              backgroundColor: colors.brand.primary,
              color: 'white'
            }}
          >
            Back to Billing Dashboard
          </button>
        </div>
      </div>
    );
  }
  
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
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold mr-3 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {invoice.id}
              </h1>
              {getStatusBadge(invoice.status)}
            </div>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {invoice.tenantName} - Issued on {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            className="p-2 rounded-md transition-colors hover:opacity-80"
            style={{ backgroundColor: `${colors.utility.secondaryText}20` }}
            title="Download PDF"
          >
            <Download 
              className="h-5 w-5"
              style={{ color: colors.utility.secondaryText }}
            />
          </button>
          <button
            className="p-2 rounded-md transition-colors hover:opacity-80"
            style={{ backgroundColor: `${colors.utility.secondaryText}20` }}
            title="Print Invoice"
          >
            <Printer 
              className="h-5 w-5"
              style={{ color: colors.utility.secondaryText }}
            />
          </button>
          {invoice.status !== 'paid' && (
            <button
              onClick={handleSendReminder}
              className="p-2 rounded-md transition-colors hover:opacity-80"
              style={{ backgroundColor: `${colors.utility.secondaryText}20` }}
              title="Send Reminder"
            >
              <Mail 
                className="h-5 w-5"
                style={{ color: colors.utility.secondaryText }}
              />
            </button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Template */}
        <div className="col-span-1 lg:col-span-2">
          <InvoiceTemplate invoice={invoice} />
        </div>
        
        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Payment Information */}
          <div 
            className="rounded-lg border overflow-hidden transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <div 
              className="px-6 py-4 border-b transition-colors"
              style={{
                backgroundColor: `${colors.utility.secondaryText}10`,
                borderBottomColor: `${colors.utility.primaryText}20`
              }}
            >
              <h2 
                className="text-lg font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Payment Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div 
                  className="text-sm mb-1 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Status
                </div>
                <div className="font-medium">{getStatusBadge(invoice.status)}</div>
              </div>
              
              <div>
                <div 
                  className="text-sm mb-1 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Amount
                </div>
                <div 
                  className="text-2xl font-bold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatCurrency(invoice.amount, invoice.currency)}
                </div>
              </div>
              
              <div>
                <div 
                  className="text-sm mb-1 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Due Date
                </div>
                <div 
                  className="font-medium transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatDate(invoice.dueDate)}
                </div>
              </div>
              
              {invoice.paidDate && (
                <div>
                  <div 
                    className="text-sm mb-1 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Paid Date
                  </div>
                  <div 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {formatDate(invoice.paidDate)}
                  </div>
                </div>
              )}
              
              <div 
                className="pt-4 border-t transition-colors"
                style={{ borderTopColor: `${colors.utility.primaryText}20` }}
              >
                {invoice.status !== 'paid' ? (
                  <button
                    onClick={handleMarkAsPaid}
                    className="w-full px-4 py-2 rounded-md transition-colors hover:opacity-90 flex items-center justify-center"
                    style={{
                      backgroundColor: colors.semantic.success,
                      color: 'white'
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </button>
                ) : (
                  <div 
                    className="text-center text-sm transition-colors"
                    style={{ color: colors.semantic.success }}
                  >
                    This invoice has been paid
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tenant Information */}
          <div 
            className="rounded-lg border overflow-hidden transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <div 
              className="px-6 py-4 border-b transition-colors"
              style={{
                backgroundColor: `${colors.utility.secondaryText}10`,
                borderBottomColor: `${colors.utility.primaryText}20`
              }}
            >
              <h2 
                className="text-lg font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Tenant Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Building 
                  className="h-5 w-5 mr-3 mt-0.5"
                  style={{ color: colors.utility.secondaryText }}
                />
                <div>
                  <div 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {invoice.tenantName}
                  </div>
                  <div 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Tenant ID: {invoice.tenantId}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <CreditCard 
                  className="h-5 w-5 mr-3 mt-0.5"
                  style={{ color: colors.utility.secondaryText }}
                />
                <div>
                  <div 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {invoice.planName}
                  </div>
                  <div 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Plan ID: {invoice.planId}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action History */}
          <div 
            className="rounded-lg border overflow-hidden transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <div 
              className="px-6 py-4 border-b transition-colors"
              style={{
                backgroundColor: `${colors.utility.secondaryText}10`,
                borderBottomColor: `${colors.utility.primaryText}20`
              }}
            >
              <h2 
                className="text-lg font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Activity
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-start text-sm">
                  <div 
                    className="h-6 w-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    style={{ backgroundColor: `${colors.brand.primary}20` }}
                  >
                    <FileDown 
                      className="h-3.5 w-3.5"
                      style={{ color: colors.brand.primary }}
                    />
                  </div>
                  <div>
                    <div 
                      className="transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Invoice created
                    </div>
                    <div 
                      className="text-xs transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {formatDate(invoice.createdAt)}
                    </div>
                  </div>
                </div>
                
                {invoice.status === 'paid' && invoice.paidDate && (
                  <div className="flex items-start text-sm">
                    <div 
                      className="h-6 w-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                      style={{ backgroundColor: `${colors.semantic.success}20` }}
                    >
                      <Check 
                        className="h-3.5 w-3.5"
                        style={{ color: colors.semantic.success }}
                      />
                    </div>
                    <div>
                      <div 
                        className="transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        Payment received
                      </div>
                      <div 
                        className="text-xs transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {formatDate(invoice.paidDate)}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* More activity items could be added here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;