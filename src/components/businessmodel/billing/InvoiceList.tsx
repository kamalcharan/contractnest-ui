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
import { useTheme } from '@/contexts/ThemeContext';
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
  const { isDarkMode, currentTheme } = useTheme();
  
  // State for filtering, sorting and dropdown menus
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [sort, setSort] = useState<{ field: keyof Invoice; direction: 'asc' | 'desc' }>({
    field: 'createdAt',
    direction: 'desc'
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
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
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: `${colors.semantic.success}20`,
              color: colors.semantic.success
            }}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: `${colors.semantic.warning}20`,
              color: colors.semantic.warning
            }}
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: `${colors.semantic.error}20`,
              color: colors.semantic.error
            }}
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </span>
        );
      default:
        return (
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors"
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
  
  // Handle status filter
  const handleStatusFilter = (status: 'all' | 'paid' | 'pending' | 'overdue') => {
    setStatusFilter(status);
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div 
        className="border border-opacity-20 rounded-lg overflow-hidden animate-pulse transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText
        }}
      >
        <div 
          className="p-4 border-b border-opacity-20 transition-colors"
          style={{ borderColor: colors.utility.primaryText }}
        >
          <div 
            className="h-8 rounded w-64"
            style={{ backgroundColor: `${colors.utility.primaryText}20` }}
          ></div>
        </div>
        {Array(5).fill(0).map((_, index) => (
          <div 
            key={index} 
            className="border-b border-opacity-20 p-4 transition-colors"
            style={{ borderColor: colors.utility.primaryText }}
          >
            <div className="flex justify-between">
              <div className="space-y-2">
                <div 
                  className="h-4 rounded w-24"
                  style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                ></div>
                <div 
                  className="h-4 rounded w-32"
                  style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                ></div>
              </div>
              <div 
                className="h-8 rounded w-20"
                style={{ backgroundColor: `${colors.utility.primaryText}20` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div 
      className="border border-opacity-20 rounded-lg overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText
      }}
    >
      {/* Search and Filter Bar */}
      <div 
        className="p-4 border-b border-opacity-20 transition-colors"
        style={{ borderColor: colors.utility.primaryText }}
      >
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-md border border-opacity-20 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
              style={{
                borderColor: colors.utility.primaryText,
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search 
                className="h-4 w-4"
                style={{ color: colors.utility.secondaryText }}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === 'all'
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: statusFilter === 'all' 
                  ? colors.brand.primary 
                  : `${colors.utility.primaryText}10`,
                color: statusFilter === 'all' 
                  ? 'white' 
                  : colors.utility.primaryText
              }}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === 'paid'
                  ? ''
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: statusFilter === 'paid'
                  ? `${colors.semantic.success}20`
                  : `${colors.utility.primaryText}10`,
                color: statusFilter === 'paid'
                  ? colors.semantic.success
                  : colors.utility.primaryText
              }}
            >
              Paid
            </button>
            <button
              onClick={() => handleStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === 'pending'
                  ? ''
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: statusFilter === 'pending'
                  ? `${colors.semantic.warning}20`
                  : `${colors.utility.primaryText}10`,
                color: statusFilter === 'pending'
                  ? colors.semantic.warning
                  : colors.utility.primaryText
              }}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilter('overdue')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                statusFilter === 'overdue'
                  ? ''
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: statusFilter === 'overdue'
                  ? `${colors.semantic.error}20`
                  : `${colors.utility.primaryText}10`,
                color: statusFilter === 'overdue'
                  ? colors.semantic.error
                  : colors.utility.primaryText
              }}
            >
              Overdue
            </button>
          </div>
        </div>
      </div>
      
      {/* Table Header */}
      <div 
        className="hidden md:flex text-xs font-medium uppercase tracking-wider border-b border-opacity-20 transition-colors"
        style={{
          color: colors.utility.secondaryText,
          borderColor: colors.utility.primaryText
        }}
      >
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
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            No invoices found matching your criteria
          </p>
        </div>
      ) : (
        <>
          {sortedInvoices.map(invoice => (
            <div 
              key={invoice.id} 
              className="border-b border-opacity-20 transition-colors"
              style={{ borderColor: colors.utility.primaryText }}
            >
              {/* Desktop View */}
              <div className="hidden md:flex items-center">
                <div className="px-6 py-4 w-1/6">
                  <div 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {invoice.id}
                  </div>
                  <div 
                    className="text-xs transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {formatDate(invoice.createdAt)}
                  </div>
                </div>
                <div 
                  className="px-6 py-4 w-1/5 truncate transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {invoice.tenantName}
                </div>
                <div 
                  className="px-6 py-4 w-1/5 truncate transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {invoice.planName}
                </div>
                <div 
                  className="px-6 py-4 w-1/6 font-medium transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatCurrency(invoice.amount, invoice.currency)}
                </div>
                <div 
                  className="px-6 py-4 w-1/6 text-sm transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {formatDate(invoice.dueDate)}
                </div>
                <div className="px-6 py-4 w-1/6 text-center">
                  {getStatusBadge(invoice.status)}
                </div>
                <div className="px-6 py-4 w-20 text-center relative">
                  <button 
                    onClick={() => toggleDropdown(invoice.id)}
                    className="p-1 rounded-full hover:opacity-80 transition-colors"
                    style={{ backgroundColor: `${colors.utility.primaryText}10` }}
                  >
                    <MoreHorizontal 
                      className="h-4 w-4"
                      style={{ color: colors.utility.secondaryText }}
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {dropdownOpen === invoice.id && (
                    <div 
                      className="absolute right-4 mt-2 w-48 rounded-md shadow-lg z-10 border border-opacity-20 transition-colors"
                      style={{
                        backgroundColor: colors.utility.secondaryBackground,
                        borderColor: colors.utility.primaryText
                      }}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => onViewInvoice(invoice.id)}
                          className="flex items-center w-full px-4 py-2 text-sm hover:opacity-80 transition-colors"
                          style={{ color: colors.utility.primaryText }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${colors.utility.primaryText}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:opacity-80 transition-colors"
                          style={{ color: colors.utility.primaryText }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${colors.utility.primaryText}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </button>
                        {invoice.status !== 'paid' && (
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm hover:opacity-80 transition-colors"
                            style={{ color: colors.utility.primaryText }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${colors.utility.primaryText}10`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
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
                    <div 
                      className="font-medium transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {invoice.id}
                    </div>
                    <div 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {invoice.tenantName}
                    </div>
                    <div 
                      className="text-xs mt-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {formatDate(invoice.createdAt)}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  <div 
                    className="transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Plan:
                  </div>
                  <div 
                    className="transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {invoice.planName}
                  </div>
                  
                  <div 
                    className="transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Amount:
                  </div>
                  <div 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </div>
                  
                  <div 
                    className="transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Due Date:
                  </div>
                  <div 
                    className="transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {formatDate(invoice.dueDate)}
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => onViewInvoice(invoice.id)}
                    className="p-2 rounded-md hover:opacity-80 transition-colors"
                    style={{ backgroundColor: `${colors.utility.primaryText}10` }}
                    title="View Details"
                  >
                    <Eye 
                      className="h-4 w-4"
                      style={{ color: colors.utility.secondaryText }}
                    />
                  </button>
                  <button
                    className="p-2 rounded-md hover:opacity-80 transition-colors"
                    style={{ backgroundColor: `${colors.utility.primaryText}10` }}
                    title="Download PDF"
                  >
                    <Download 
                      className="h-4 w-4"
                      style={{ color: colors.utility.secondaryText }}
                    />
                  </button>
                  {invoice.status !== 'paid' && (
                    <button
                      className="p-2 rounded-md hover:opacity-80 transition-colors"
                      style={{ backgroundColor: `${colors.utility.primaryText}10` }}
                      title="Send Reminder"
                    >
                      <Mail 
                        className="h-4 w-4"
                        style={{ color: colors.utility.secondaryText }}
                      />
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