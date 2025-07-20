// src/components/businessmodel/billing/InvoiceList.tsx

import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Download, 
  Eye, 
  Mail, 
  MoreHorizontal,
  Search,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Invoice } from '@/utils/fakejson/BillingData';

interface InvoiceListProps {
  invoices: Invoice[];
  onViewInvoice: (invoiceId: string) => void;
  isLoading?: boolean;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onViewInvoice,
  isLoading = false
}) => {
  // State for filtering, sorting and dropdown menus
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [sort, setSort] = useState<{ field: keyof Invoice; direction: 'asc' | 'desc' }>({
    field: 'createdAt',
    direction: 'desc'
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  // Format currency
  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
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
  
  // Filter invoices based on search and status filter
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.planName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort invoices based on current sort settings
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const fieldA = a[sort.field];
    const fieldB = b[sort.field];
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sort.direction === 'asc' 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA);
    }
    
    // For numeric fields or dates
    if (fieldA && fieldB) {
      return sort.direction === 'asc'
        ? fieldA > fieldB ? 1 : -1
        : fieldA < fieldB ? 1 : -1;
    }
    
    return 0;
  });
  
  // Toggle sort for a field
  const toggleSort = (field: keyof Invoice) => {
    if (sort.field === field) {
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSort({
        field,
        direction: 'asc'
      });
    }
  };
  
  // Toggle dropdown for a specific invoice
  const toggleDropdown = (invoiceId: string) => {
    if (dropdownOpen === invoiceId) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(invoiceId);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };
  
  // Handle status filter
  const handleStatusFilter = (status: 'all' | 'paid' | 'pending' | 'overdue') => {
    setStatusFilter(status);
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
        <div className="p-4 border-b border-border">
          <div className="h-8 bg-muted rounded w-64"></div>
        </div>
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="border-b border-border p-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                statusFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 hover:bg-muted text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                statusFilter === 'paid'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-muted/50 hover:bg-muted text-foreground'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => handleStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                statusFilter === 'pending'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-muted/50 hover:bg-muted text-foreground'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilter('overdue')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                statusFilter === 'overdue'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-muted/50 hover:bg-muted text-foreground'
              }`}
            >
              Overdue
            </button>
          </div>
        </div>
      </div>
      
      {/* Table Header */}
      <div className="hidden md:flex text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
        <div className="px-6 py-3 w-1/6 cursor-pointer" onClick={() => toggleSort('id')}>
          <div className="flex items-center">
            Invoice ID
            {sort.field === 'id' && (
              sort.direction === 'asc' 
                ? <ArrowUp className="h-3 w-3 ml-1" /> 
                : <ArrowDown className="h-3 w-3 ml-1" />
            )}
          </div>
        </div>
        <div className="px-6 py-3 w-1/5 cursor-pointer" onClick={() => toggleSort('tenantName')}>
          <div className="flex items-center">
            Tenant
            {sort.field === 'tenantName' && (
              sort.direction === 'asc' 
                ? <ArrowUp className="h-3 w-3 ml-1" /> 
                : <ArrowDown className="h-3 w-3 ml-1" />
            )}
          </div>
        </div>
        <div className="px-6 py-3 w-1/5 cursor-pointer" onClick={() => toggleSort('planName')}>
          <div className="flex items-center">
            Plan
            {sort.field === 'planName' && (
              sort.direction === 'asc' 
                ? <ArrowUp className="h-3 w-3 ml-1" /> 
                : <ArrowDown className="h-3 w-3 ml-1" />
            )}
          </div>
        </div>
        <div className="px-6 py-3 w-1/6 cursor-pointer" onClick={() => toggleSort('amount')}>
          <div className="flex items-center">
            Amount
            {sort.field === 'amount' && (
              sort.direction === 'asc' 
                ? <ArrowUp className="h-3 w-3 ml-1" /> 
                : <ArrowDown className="h-3 w-3 ml-1" />
            )}
          </div>
        </div>
        <div className="px-6 py-3 w-1/6 cursor-pointer" onClick={() => toggleSort('dueDate')}>
          <div className="flex items-center">
            Due Date
            {sort.field === 'dueDate' && (
              sort.direction === 'asc' 
                ? <ArrowUp className="h-3 w-3 ml-1" /> 
                : <ArrowDown className="h-3 w-3 ml-1" />
            )}
          </div>
        </div>
        <div className="px-6 py-3 w-1/6 text-center">Status</div>
        <div className="px-6 py-3 w-20 text-center">Actions</div>
      </div>
      
      {/* Invoices List */}
      {sortedInvoices.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No invoices found matching your criteria</p>
        </div>
      ) : (
        <>
          {sortedInvoices.map(invoice => (
            <div key={invoice.id} className="border-b border-border">
              {/* Desktop View */}
              <div className="hidden md:flex items-center">
                <div className="px-6 py-4 w-1/6">
                  <div className="font-medium">{invoice.id}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</div>
                </div>
                <div className="px-6 py-4 w-1/5 truncate">{invoice.tenantName}</div>
                <div className="px-6 py-4 w-1/5 truncate">{invoice.planName}</div>
                <div className="px-6 py-4 w-1/6 font-medium">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </div>
                <div className="px-6 py-4 w-1/6 text-sm">{formatDate(invoice.dueDate)}</div>
                <div className="px-6 py-4 w-1/6 text-center">
                  {getStatusBadge(invoice.status)}
                </div>
                <div className="px-6 py-4 w-20 text-center relative">
                  <button 
                    onClick={() => toggleDropdown(invoice.id)}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {dropdownOpen === invoice.id && (
                    <div className="absolute right-4 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-border">
                      <div className="py-1">
                        <button
                          onClick={() => onViewInvoice(invoice.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </button>
                        {invoice.status !== 'paid' && (
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile View */}
              <div className="md:hidden p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm">{invoice.tenantName}</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(invoice.createdAt)}</div>
                  </div>
                  <div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  <div className="text-muted-foreground">Plan:</div>
                  <div>{invoice.planName}</div>
                  
                  <div className="text-muted-foreground">Amount:</div>
                  <div className="font-medium">{formatCurrency(invoice.amount, invoice.currency)}</div>
                  
                  <div className="text-muted-foreground">Due Date:</div>
                  <div>{formatDate(invoice.dueDate)}</div>
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => onViewInvoice(invoice.id)}
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {invoice.status !== 'paid' && (
                    <button
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      title="Send Reminder"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default InvoiceList;