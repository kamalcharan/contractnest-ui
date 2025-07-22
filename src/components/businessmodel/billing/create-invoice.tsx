// src/pages/settings/businessmodel/admin/billing/create-invoice.tsx
// FIXED: Added proper type imports and handling

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  Search, 
  Check, 
  ChevronDown,
  CreditCard,
  Clock,
  AlertCircle
} from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';

// Import mock data
import { fakeInvoices } from '@/utils/fakejson/BillingData';
import { fakePricingPlans, getPlanById } from '@/utils/fakejson/PricingPlans';
import { fakeTenants } from '@/utils/fakejson/TenantsData';

// FIXED: Import types from billing.ts
import type { PlanOption, TenantOption, InvoiceItem } from '@/types/billing';

// FIXED: Get tenant options from fake data with proper typing
const tenantOptions: TenantOption[] = fakeTenants.map((tenant: any) => ({
  id: tenant.id,
  name: tenant.name,
  email: tenant.email || `${tenant.name.toLowerCase().replace(/\s+/g, '')}@example.com`
}));

// FIXED: Get plans for dropdown from fake data with proper handling
const planOptions: PlanOption[] = fakePricingPlans
  .filter((plan: any) => !plan.is_archived && !plan.isArchived)
  .map((plan: any) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description || 'No description available' // FIXED: Fallback for undefined
  }));

const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [currency, setCurrency] = useState<string>('INR');
  const [dueDate, setDueDate] = useState<string>(
    // Default due date is 15 days from now
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  
  // State for tenant search
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  
  // State for tenant invoice history
  const [tenantInvoices, setTenantInvoices] = useState<any[]>([]);
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.18; // 18% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('settings/businessmodel/admin/billing/create-invoice', 'Create Invoice');
  }, []);
  
  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch tenant invoices when tenant selection changes
  useEffect(() => {
    if (tenantId) {
      // In a real implementation, this would be an API call
      // For now, we'll filter the mock data
      const invoicesForTenant = fakeInvoices.filter((invoice: any) => invoice.tenantId === tenantId);
      setTenantInvoices(invoicesForTenant);
    } else {
      setTenantInvoices([]);
    }
  }, [tenantId]);
  
  // Filter tenants based on search term
  const filteredTenants = tenantOptions.filter((tenant: TenantOption) => 
    tenant.name.toLowerCase().includes(tenantSearchTerm.toLowerCase()) ||
    tenant.id.toLowerCase().includes(tenantSearchTerm.toLowerCase())
  ).slice(0, 10); // Limit to 10 results for performance
  
  // Handle Back
  const handleBack = () => {
    navigate('/settings/businessmodel/admin/billing');
  };
  
  // Update item amount when quantity or unitPrice changes
  const updateItemAmount = (index: number, quantity: number, unitPrice: number) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = quantity;
    updatedItems[index].unitPrice = unitPrice;
    updatedItems[index].amount = quantity * unitPrice;
    setItems(updatedItems);
  };
  
  // Add a new item
  const addItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ]);
  };
  
  // Remove an item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };
  
  // Handle tenant selection
  const handleTenantSelect = (id: string, name: string) => {
    setTenantId(id);
    setTenantSearchTerm(name);
    setIsSearchDropdownOpen(false);
  };
  
  // Auto-fill plan details when a plan is selected
  const handlePlanChange = (planId: string) => {
    setPlanId(planId);
    
    if (planId) {
      const plan = getPlanById(planId);
      if (plan) {
        // Create an item based on the plan
        const updatedItems = [...items];
        
        // FIXED: Safe access to tier pricing with fallback
        const firstTier = plan.tiers?.[0];
        const tierPrice = firstTier?.base_price || firstTier?.basePrice || 0;
        
        updatedItems[0] = {
          description: `${plan.name} Subscription`,
          quantity: 1,
          unitPrice: tierPrice,
          amount: tierPrice
        };
        setItems(updatedItems);
        
        // FIXED: Set currency with fallback
        setCurrency(plan.default_currency_code || plan.defaultCurrencyCode || 'INR');
      }
    }
  };
  
  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId || !planId || items.some(item => !item.description)) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    // Generate new invoice ID
    const invoiceId = `INV-${String(fakeInvoices.length + 1).padStart(3, '0')}`;
    
    // Get tenant name from options
    const tenantName = tenantOptions.find((t: TenantOption) => t.id === tenantId)?.name || '';
    
    // Get plan name from options
    const planName = planOptions.find((p: PlanOption) => p.id === planId)?.name || '';
    
    // Create new invoice object
    const newInvoice = {
      id: invoiceId,
      tenantId,
      tenantName,
      planId,
      planName,
      amount: total,
      currency,
      status: 'pending' as const,
      dueDate: new Date(dueDate).toISOString(),
      paidDate: null,
      createdAt: new Date().toISOString(),
      items
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be an API call to create the invoice
    console.log('Created invoice:', newInvoice);
    
    setLoading(false);
    
    // Navigate to the new invoice
    navigate(`/settings/businessmodel/admin/billing/invoices/${invoiceId}`);
  };
  
  // Format currency
  const formatCurrency = (amount: number, currencyCode: string = currency): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <Check className="h-3 w-3 mr-1" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Create Invoice</h1>
          <p className="text-muted-foreground">Generate a new invoice for a tenant</p>
        </div>
      </div>
      
      {/* Invoice Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Billing Details */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 bg-muted/20 border-b border-border">
                <h2 className="text-lg font-semibold">Billing Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tenant Search */}
                  <div ref={searchDropdownRef} className="relative">
                    <label htmlFor="tenantSearch" className="block text-sm font-medium mb-1">
                      Tenant <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="tenantSearch"
                        type="text"
                        value={tenantSearchTerm}
                        onChange={(e) => {
                          setTenantSearchTerm(e.target.value);
                          setIsSearchDropdownOpen(true);
                          if (!e.target.value) {
                            setTenantId('');
                          }
                        }}
                        onFocus={() => setIsSearchDropdownOpen(true)}
                        placeholder="Search tenant by name"
                        className="w-full px-3 py-2 pl-10 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {/* Dropdown for tenant search */}
                    {isSearchDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredTenants.length === 0 ? (
                          <div className="py-2 px-3 text-sm text-muted-foreground">
                            {tenantSearchTerm ? 'No tenants found' : 'Type to search'}
                          </div>
                        ) : (
                          filteredTenants.map((tenant: TenantOption) => (
                            <div
                              key={tenant.id}
                              className="py-2 px-3 hover:bg-muted cursor-pointer text-sm"
                              onClick={() => handleTenantSelect(tenant.id, tenant.name)}
                            >
                              <div className="font-medium">{tenant.name}</div>
                              <div className="text-xs text-muted-foreground">ID: {tenant.id}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Plan Select */}
                  <div>
                    <label htmlFor="plan" className="block text-sm font-medium mb-1">
                      Plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="plan"
                      value={planId}
                      onChange={(e) => handlePlanChange(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    >
                      <option value="">Select a plan</option>
                      {planOptions.map((plan: PlanOption) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Currency Select */}
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium mb-1">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  
                  {/* Due Date */}
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>
                
                {/* Payment Method Section */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Payment Method
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-bank"
                        name="paymentMethod"
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        defaultChecked
                      />
                      <label htmlFor="payment-bank" className="ml-2 text-sm">
                        Bank Transfer
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-gateway"
                        name="paymentMethod"
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="payment-gateway" className="ml-2 text-sm">
                        Payment Gateway
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="payment-manual"
                        name="paymentMethod"
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="payment-manual" className="ml-2 text-sm">
                        Manual/Other
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Payment gateway integration allows tenants to pay online with credit card or other methods.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Invoice Items */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 bg-muted/20 border-b border-border flex justify-between items-center">
                <h2 className="text-lg font-semibold">Invoice Items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-primary hover:text-primary/80 transition-colors flex items-center text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const updatedItems = [...items];
                              updatedItems[index].description = e.target.value;
                              setItems(updatedItems);
                            }}
                            placeholder="Item description"
                            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const quantity = parseInt(e.target.value) || 0;
                              updateItemAmount(index, quantity, item.unitPrice);
                            }}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">
                              {currency === 'INR' ? '₹' : 
                               currency === 'USD' ? '$' : 
                               currency === 'EUR' ? '€' : 
                               currency === 'GBP' ? '£' : ''}
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => {
                                const unitPrice = parseFloat(e.target.value) || 0;
                                updateItemAmount(index, item.quantity, unitPrice);
                              }}
                              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                              required
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Invoice Summary */}
              <div className="p-6 border-t border-border">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (18%):</span>
                      <span className="font-medium">{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="col-span-1 space-y-6">
            {/* Action Card */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 bg-muted/20 border-b border-border">
                <h2 className="text-lg font-semibold">Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Invoice
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full px-4 py-2 border border-border bg-card hover:bg-muted transition-colors rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-md border border-blue-100 dark:border-blue-900/20">
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">About Invoicing</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Created invoices will be stored in the system but not automatically sent to tenants.
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                    You can later send invoices manually or set up automatic notifications for pending payments.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tenant Invoice History - only shown when a tenant is selected */}
            {tenantId && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="px-6 py-4 bg-muted/20 border-b border-border">
                  <h2 className="text-lg font-semibold">Tenant Invoice History</h2>
                </div>
                
                <div className="p-4">
                  {tenantInvoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No previous invoices found for this tenant.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {tenantInvoices.map((invoice: any) => (
                        <div key={invoice.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">{invoice.id}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(invoice.createdAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatCurrency(invoice.amount, invoice.currency)}
                              </div>
                              <div className="text-xs">
                                {getStatusBadge(invoice.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoicePage;