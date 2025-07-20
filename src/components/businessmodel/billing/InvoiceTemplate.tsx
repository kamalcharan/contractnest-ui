// src/components/businessmodel/billing/InvoiceTemplate.tsx

import React from 'react';
import { Invoice } from '@/utils/fakejson/BillingData';

interface InvoiceTemplateProps {
  invoice: Invoice;
  showActions?: boolean;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  showActions = false
}) => {
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
  
  // Calculate subtotal (without tax)
  const subtotal = invoice.items
    ? invoice.items.reduce((sum, item) => sum + item.amount, 0)
    : invoice.amount / 1.18; // Assuming 18% tax if items not provided
  
  // Calculate tax (18%)
  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal + taxAmount;
  
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Invoice Header */}
      <div className="p-8 border-b border-border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
            <p className="text-muted-foreground mt-1">{invoice.id}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">ContractNest</div>
            <p className="text-muted-foreground">123 Business Street</p>
            <p className="text-muted-foreground">Hyderabad, Telangana 500001</p>
            <p className="text-muted-foreground">India</p>
          </div>
        </div>
      </div>
      
      {/* Invoice Details */}
      <div className="p-8 border-b border-border">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-3">Bill To</h2>
            <div className="text-lg font-medium">{invoice.tenantName}</div>
            <p className="text-muted-foreground">Tenant ID: {invoice.tenantId}</p>
            <p className="text-muted-foreground">Plan: {invoice.planName}</p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-3">Invoice Date</h2>
                <p>{formatDate(invoice.createdAt)}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-3">Due Date</h2>
                <p>{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-3">Status</h2>
                <p className={`font-semibold ${
                  invoice.status === 'paid' ? 'text-green-600 dark:text-green-400' : 
                  invoice.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 
                  'text-red-600 dark:text-red-400'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </p>
              </div>
              {invoice.paidDate && (
                <div>
                  <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-3">Payment Date</h2>
                  <p>{formatDate(invoice.paidDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Invoice Items */}
      <div className="p-8">
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left pb-3 font-semibold">Description</th>
              <th className="text-right pb-3 font-semibold">Quantity</th>
              <th className="text-right pb-3 font-semibold">Unit Price</th>
              <th className="text-right pb-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items ? (
              invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="py-4">{item.description}</td>
                  <td className="py-4 text-right">{item.quantity}</td>
                  <td className="py-4 text-right">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-4 text-right">{formatCurrency(item.amount, invoice.currency)}</td>
                </tr>
              ))
            ) : (
              // Default item if not provided
              <tr className="border-b border-border">
                <td className="py-4">{invoice.planName} Subscription</td>
                <td className="py-4 text-right">1</td>
                <td className="py-4 text-right">{formatCurrency(subtotal, invoice.currency)}</td>
                <td className="py-4 text-right">{formatCurrency(subtotal, invoice.currency)}</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Invoice Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            <div className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Tax (18%):</span>
              <span className="font-medium">{formatCurrency(taxAmount, invoice.currency)}</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(total, invoice.currency)}</span>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="mt-12 text-sm text-muted-foreground pt-6 border-t border-border">
          <p>
            <span className="font-semibold">Payment Terms:</span> Payment due within 15 days of invoice date.
          </p>
          <p className="mt-2">
            <span className="font-semibold">Notes:</span> Thank you for your business! Please make payments to the bank account details provided separately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;