// src/pages/settings/businessmodel/admin/billing/create-invoice.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, FileText } from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';

// Import mock data
import { fakeInvoices } from '@/utils/fakejson/BillingData';
import { fakePricingPlans, getPlanById } from '@/utils/fakejson/PricingPlans';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface TenantOption {
  id: string;
  name: string;
}

interface PlanOption {
  id: string;
  name: string;
  description: string;
}

// Mock tenant data - in a real app this would come from an API
const tenantOptions: TenantOption[] = [
  { id: 'tenant_1', name: 'Acme Inc.' },
  { id: 'tenant_2', name: 'Globex Corp' },
  { id: 'tenant_3', name: 'Initech' },
  { id: 'tenant_4', name: 'Umbrella Corp' },
  { id: 'tenant_5', name: 'Stark Industries' },
  { id: 'tenant_6', name: 'Wayne Enterprises' }
];

// Get plans for dropdown
const planOptions: PlanOption[] = fakePricingPlans
  .filter(plan => !plan.isArchived)
  .map(plan => ({
    id: plan.id,
    name: plan.name,
    description: plan.description
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
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.18; // 18% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('settings/businessmodel/admin/billing/create-invoice', 'Create Invoice');
  }, []);
  
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
  
  // Auto-fill plan details when a plan is selected
  const handlePlanChange = (planId: string) => {
    setPlanId(planId);
    
    if (planId) {
      const plan = getPlanById(planId);
      if (plan) {
        // Create an item based on the plan
        const updatedItems = [...items];
        updatedItems[0] = {
          description: `${plan.name} Subscription`,
          quantity: 1,
          unitPrice: plan.tiers[0]?.basePrice || 0,
          amount: plan.tiers[0]?.basePrice || 0
        };
        setItems(updatedItems);
        
        // Set currency
        setCurrency(plan.defaultCurrencyCode);
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
    
    // Create new invoice object
    const newInvoice = {
      id: invoiceId,
      tenantId,
      tenantName: tenantOptions.find(t => t.id === tenantId)?.name || '',
      planId,
      planName: planOptions.find(p => p.id === planId)?.name || '',
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
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
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
                  {/* Tenant Select */}
                  <div>
                    <label htmlFor="tenant" className="block text-sm font-medium mb-1">
                      Tenant <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="tenant"
                      value={tenantId}
                      onChange={(e) => setTenantId(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    >
                      <option value="">Select a tenant</option>
                      {tenantOptions.map(tenant => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </option>
                      ))}
                    </select>
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
                      {planOptions.map(plan => (
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoicePage;