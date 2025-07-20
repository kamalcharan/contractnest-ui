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
import { analyticsService } from '@/services/analytics.service';

// Import mock data and types
import { Invoice, getInvoiceById } from '@/utils/fakejson/BillingData';

// Import components
import InvoiceTemplate from '@/components/businessmodel/billing/InvoiceTemplate';

const InvoiceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <Check className="h-4 w-4 mr-2" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <CalendarClock className="h-4 w-4 mr-2" />
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mr-2" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="flex items-center mb-8">
          <div className="mr-4 p-2 rounded-full bg-muted animate-pulse h-10 w-10"></div>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-card rounded-lg border border-border overflow-hidden animate-pulse h-96"></div>
          </div>
          <div className="col-span-1">
            <div className="bg-card rounded-lg border border-border overflow-hidden animate-pulse h-64"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // 404 state
  if (!invoice) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Invoice Not Found</h1>
            <p className="text-muted-foreground">The requested invoice does not exist or has been deleted</p>
          </div>
        </div>
        
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Receipt className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h2 className="text-lg font-medium mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground mb-6">The invoice you're looking for doesn't exist or may have been deleted.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Billing Dashboard
          </button>
        </div>
      </div>
    );
  }
  
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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-3">{invoice.id}</h1>
              {getStatusBadge(invoice.status)}
            </div>
            <p className="text-muted-foreground">
              {invoice.tenantName} - Issued on {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            className="p-2 rounded-md hover:bg-muted transition-colors"
            title="Download PDF"
          >
            <Download className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-muted transition-colors"
            title="Print Invoice"
          >
            <Printer className="h-5 w-5 text-muted-foreground" />
          </button>
          {invoice.status !== 'paid' && (
            <button
              onClick={handleSendReminder}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title="Send Reminder"
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
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
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 border-b border-border">
              <h2 className="text-lg font-semibold">Payment Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <div className="font-medium">{getStatusBadge(invoice.status)}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Amount</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Due Date</div>
                <div className="font-medium">{formatDate(invoice.dueDate)}</div>
              </div>
              
              {invoice.paidDate && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Paid Date</div>
                  <div className="font-medium">{formatDate(invoice.paidDate)}</div>
                </div>
              )}
              
              <div className="pt-4 border-t border-border">
                {invoice.status !== 'paid' ? (
                  <button
                    onClick={handleMarkAsPaid}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </button>
                ) : (
                  <div className="text-center text-green-600 dark:text-green-400 text-sm">
                    This invoice has been paid
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tenant Information */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 border-b border-border">
              <h2 className="text-lg font-semibold">Tenant Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Building className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{invoice.tenantName}</div>
                  <div className="text-sm text-muted-foreground">Tenant ID: {invoice.tenantId}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{invoice.planName}</div>
                  <div className="text-sm text-muted-foreground">Plan ID: {invoice.planId}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action History */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/20 border-b border-border">
              <h2 className="text-lg font-semibold">Activity</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-start text-sm">
                  <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                    <FileDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div>Invoice created</div>
                    <div className="text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</div>
                  </div>
                </div>
                
                {invoice.status === 'paid' && invoice.paidDate && (
                  <div className="flex items-start text-sm">
                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div>Payment received</div>
                      <div className="text-xs text-muted-foreground">{formatDate(invoice.paidDate)}</div>
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