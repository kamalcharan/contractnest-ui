// src/components/businessmodel/billing/InvoiceTemplate.tsx

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Invoice } from '@/utils/fakejson/BillingData';

interface InvoiceTemplateProps {
  invoice: Invoice;
  showActions?: boolean;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  showActions = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
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
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return colors.semantic.success;
      case 'pending':
        return colors.semantic.warning;
      case 'overdue':
        return colors.semantic.error;
      default:
        return colors.utility.secondaryText;
    }
  };
  
  return (
    <div 
      className="border border-opacity-20 rounded-lg overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText
      }}
    >
      {/* Invoice Header */}
      <div 
        className="p-8 border-b border-opacity-20 transition-colors"
        style={{ borderColor: colors.utility.primaryText }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 
              className="text-2xl font-bold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              INVOICE
            </h1>
            <p 
              className="mt-1 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {invoice.id}
            </p>
          </div>
          <div className="text-right">
            <div 
              className="text-xl font-bold transition-colors"
              style={{ color: colors.brand.primary }}
            >
              ContractNest
            </div>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              123 Business Street
            </p>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Hyderabad, Telangana 500001
            </p>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              India
            </p>
          </div>
        </div>
      </div>
      
      {/* Invoice Details */}
      <div 
        className="p-8 border-b border-opacity-20 transition-colors"
        style={{ borderColor: colors.utility.primaryText }}
      >
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 
              className="text-sm font-semibold uppercase mb-3 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Bill To
            </h2>
            <div 
              className="text-lg font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {invoice.tenantName}
            </div>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Tenant ID: {invoice.tenantId}
            </p>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Plan: {invoice.planName}
            </p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 
                  className="text-sm font-semibold uppercase mb-3 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Invoice Date
                </h2>
                <p 
                  className="transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatDate(invoice.createdAt)}
                </p>
              </div>
              <div>
                <h2 
                  className="text-sm font-semibold uppercase mb-3 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Due Date
                </h2>
                <p 
                  className="transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div>
                <h2 
                  className="text-sm font-semibold uppercase mb-3 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Status
                </h2>
                <p 
                  className="font-semibold transition-colors"
                  style={{ color: getStatusColor(invoice.status) }}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </p>
              </div>
              {invoice.paidDate && (
                <div>
                  <h2 
                    className="text-sm font-semibold uppercase mb-3 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Payment Date
                  </h2>
                  <p 
                    className="transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {formatDate(invoice.paidDate)}
                  </p>
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
            <tr 
              className="border-b border-opacity-20 transition-colors"
              style={{ borderColor: colors.utility.primaryText }}
            >
              <th 
                className="text-left pb-3 font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Description
              </th>
              <th 
                className="text-right pb-3 font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Quantity
              </th>
              <th 
                className="text-right pb-3 font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Unit Price
              </th>
              <th 
                className="text-right pb-3 font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items ? (
              invoice.items.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-opacity-20 transition-colors"
                  style={{ borderColor: colors.utility.primaryText }}
                >
                  <td 
                    className="py-4 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {item.description}
                  </td>
                  <td 
                    className="py-4 text-right transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {item.quantity}
                  </td>
                  <td 
                    className="py-4 text-right transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td 
                    className="py-4 text-right transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))
            ) : (
              // Default item if not provided
              <tr 
                className="border-b border-opacity-20 transition-colors"
                style={{ borderColor: colors.utility.primaryText }}
              >
                <td 
                  className="py-4 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {invoice.planName} Subscription
                </td>
                <td 
                  className="py-4 text-right transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  1
                </td>
                <td 
                  className="py-4 text-right transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatCurrency(subtotal, invoice.currency)}
                </td>
                <td 
                  className="py-4 text-right transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatCurrency(subtotal, invoice.currency)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Invoice Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div 
              className="flex justify-between border-b border-opacity-20 py-2 transition-colors"
              style={{ borderColor: colors.utility.primaryText }}
            >
              <span 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Subtotal:
              </span>
              <span 
                className="font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {formatCurrency(subtotal, invoice.currency)}
              </span>
            </div>
            <div 
              className="flex justify-between border-b border-opacity-20 py-2 transition-colors"
              style={{ borderColor: colors.utility.primaryText }}
            >
              <span 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Tax (18%):
              </span>
              <span 
                className="font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {formatCurrency(taxAmount, invoice.currency)}
              </span>
            </div>
            <div 
              className="flex justify-between pt-2 text-lg font-bold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              <span>Total:</span>
              <span>{formatCurrency(total, invoice.currency)}</span>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div 
          className="mt-12 text-sm pt-6 border-t border-opacity-20 transition-colors"
          style={{
            color: colors.utility.secondaryText,
            borderColor: colors.utility.primaryText
          }}
        >
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