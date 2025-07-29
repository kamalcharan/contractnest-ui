// src/components/billing/RecentBillingCard.tsx
import React from 'react';
import { Clock, FileText, Send, CheckCircle, AlertTriangle, Eye, Download } from 'lucide-react';

interface RecentBillingCardProps {
  contactId: string;
  currency: string;
}

const RecentBillingCard: React.FC<RecentBillingCardProps> = ({ contactId, currency }) => {
  // Mock recent billing data - this would come from API
  const recentBilling = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      type: 'invoice',
      status: 'paid',
      amount: 25000,
      currency: 'INR',
      dueDate: '2024-01-10',
      paidDate: '2024-01-08',
      description: 'Monthly service fee - January 2024',
      lastActivity: '2024-01-08T14:30:00Z'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      type: 'invoice',
      status: 'overdue',
      amount: 15000,
      currency: 'INR',
      dueDate: '2024-01-05',
      description: 'Website maintenance - Q4 2023',
      lastActivity: '2024-01-14T16:45:00Z'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      type: 'invoice',
      status: 'sent',
      amount: 300,
      currency: 'USD',
      dueDate: '2024-01-20',
      description: 'Consulting services - January',
      lastActivity: '2024-01-12T09:15:00Z'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      type: 'quote',
      status: 'draft',
      amount: 45000,
      currency: 'INR',
      description: 'Annual support contract - 2024',
      lastActivity: '2024-01-10T11:20:00Z'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2023-089',
      type: 'invoice',
      status: 'paid',
      amount: 85000,
      currency: 'INR',
      dueDate: '2023-12-25',
      paidDate: '2023-12-20',
      description: 'Project milestone payment',
      lastActivity: '2023-12-20T10:00:00Z'
    }
  ];

  // Filter by currency if not 'all'
  const filteredBilling = currency === 'all' 
    ? recentBilling 
    : recentBilling.filter(bill => bill.currency === currency.toUpperCase());

  const getStatusConfig = (status: string, type: string) => {
    if (type === 'quote') {
      return {
        label: 'Quote',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        icon: FileText
      };
    }

    switch (status) {
      case 'draft':
        return { 
          label: 'Draft', 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
          icon: FileText 
        };
      case 'sent':
        return { 
          label: 'Sent', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100',
          icon: Send 
        };
      case 'overdue':
        return { 
          label: 'Overdue', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          icon: AlertTriangle 
        };
      case 'paid':
        return { 
          label: 'Paid', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          icon: CheckCircle 
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
          icon: FileText 
        };
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbols = { INR: '₹', USD: '$', EUR: '€' };
    const symbol = symbols[currency as keyof typeof symbols] || currency;
    
    if (currency === 'INR') {
      if (amount >= 100000) {
        return `${symbol}${(amount / 100000).toFixed(1)}L`;
      } else if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)}K`;
      }
      return `${symbol}${amount.toLocaleString()}`;
    } else {
      if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)}K`;
      }
      return `${symbol}${amount.toLocaleString()}`;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Recent Billing Activity</h3>
        {currency !== 'all' && (
          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
            {currency.toUpperCase()}
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {filteredBilling.map((billing) => {
          const statusConfig = getStatusConfig(billing.status, billing.type);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={billing.id} className="p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">
                      {billing.invoiceNumber}
                    </h4>
                    <span className={`
                      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                      ${statusConfig.color} ${statusConfig.bgColor}
                    `}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 text-sm">
                    <div>
                      <span className="font-semibold text-green-600">
                        {formatAmount(billing.amount, billing.currency)}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {billing.dueDate && (
                        <>Due: {formatDate(billing.dueDate)}</>
                      )}
                      {billing.paidDate && (
                        <>Paid: {formatDate(billing.paidDate)}</>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(billing.lastActivity)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {billing.description}
                  </p>
                </div>
                
                <div className="flex gap-1 ml-4">
                  <button 
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="View invoice"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Overdue warning */}
              {billing.status === 'overdue' && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      Overdue by {Math.ceil((new Date().getTime() - new Date(billing.dueDate!).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredBilling.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No billing activity in {currency.toUpperCase()}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:underline">
          View all invoices
        </button>
      </div>
    </div>
  );
};

export default RecentBillingCard;