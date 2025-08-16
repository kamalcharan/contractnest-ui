// src/vani/pages/AccountsReceivablePage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  VaNiMetricCard, 
  VaNiList, 
  VaNiListItem, 
  VaNiListHeader,
  VaNiStatusBadge 
} from '../components/shared';
import { 
  realisticBusinessEvents,
  realisticContracts,
  businessIntelligence,
  type BusinessEvent
} from '../utils/fakeData';
import { 
  DollarSign,
  AlertCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Building,
  FileText,
  Phone,
  Mail,
  MessageSquare,
  Download,
  RefreshCw,
  Filter,
  Search,
  Target,
  BarChart3,
  CreditCard,
  Banknote,
  Timer,
  ExternalLink,
  Send,
  ArrowRight,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AccountReceivable {
  id: string;
  contractId: string;
  contractName: string;
  customerName: string;
  customerContact: {
    email: string;
    phone: string;
  };
  
  // Payment details
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  
  // Status tracking
  status: 'current' | 'overdue' | 'paid' | 'disputed' | 'written_off';
  daysOverdue: number;
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  
  // Payment history
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  totalPaid: number;
  remainingBalance: number;
  
  // Communication tracking
  remindersSent: number;
  lastReminderDate?: string;
  lastContactDate?: string;
  nextActionDate: string;
  
  // Business context
  businessEventId?: string;
  servicesPending: number;
  contractValue: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
  
  // Collection details
  collectionStage: 'normal' | 'reminder' | 'escalation' | 'legal' | 'collection_agency';
  assignedTo?: string;
  notes?: string;
}

const AccountsReceivablePage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState<{
    status?: string;
    agingBucket?: string;
    customerName?: string;
    amountRange?: string;
  }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReceivables, setSelectedReceivables] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'daysOverdue' | 'customerName'>('daysOverdue');

  // Generate accounts receivable data from business events and contracts
  const accountsReceivable: AccountReceivable[] = useMemo(() => {
    const paymentEvents = realisticBusinessEvents.filter(e => e.eventType === 'payment_due');
    
    return paymentEvents.map((event, index) => {
      const contract = realisticContracts.find(c => c.id === event.metadata.contractId);
      const dueDate = new Date(event.metadata.dueDate || event.eventDate);
      const today = new Date();
      const daysOverdue = Math.max(0, Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      let agingBucket: '0-30' | '31-60' | '61-90' | '90+';
      if (daysOverdue <= 30) agingBucket = '0-30';
      else if (daysOverdue <= 60) agingBucket = '31-60';
      else if (daysOverdue <= 90) agingBucket = '61-90';
      else agingBucket = '90+';
      
      let status: 'current' | 'overdue' | 'paid' | 'disputed' | 'written_off';
      if (event.status === 'completed') status = 'paid';
      else if (daysOverdue > 0) status = 'overdue';
      else status = 'current';
      
      let collectionStage: 'normal' | 'reminder' | 'escalation' | 'legal' | 'collection_agency';
      if (daysOverdue === 0) collectionStage = 'normal';
      else if (daysOverdue <= 30) collectionStage = 'reminder';
      else if (daysOverdue <= 60) collectionStage = 'escalation';
      else collectionStage = 'legal';
      
      const amount = event.metadata.amount || 10000 + (index * 5000);
      const totalPaid = status === 'paid' ? amount : Math.max(0, amount - (index * 1000));
      const remainingBalance = amount - totalPaid;
      
      return {
        id: `ar_${event.id}`,
        contractId: event.metadata.contractId || event.entityId,
        contractName: contract?.name || event.entityName,
        customerName: event.contactName,
        customerContact: {
          email: event.contactChannels.email || `contact@${event.contactName.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: event.contactChannels.phone || '+919876543210'
        },
        
        invoiceNumber: event.metadata.invoiceNumber || `INV-2025-${String(index + 1).padStart(3, '0')}`,
        amount,
        dueDate: event.metadata.dueDate || event.eventDate,
        issueDate: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
        
        status,
        daysOverdue,
        agingBucket,
        
        lastPaymentDate: contract?.paymentsReceived > 0 ? new Date(Date.now() - (90 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
        lastPaymentAmount: contract?.paymentsReceived > 0 ? amount * 0.8 : undefined,
        totalPaid,
        remainingBalance,
        
        remindersSent: event.status === 'reminded' ? 2 : daysOverdue > 0 ? 1 : 0,
        lastReminderDate: event.status === 'reminded' ? new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
        lastContactDate: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
        nextActionDate: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString(),
        
        businessEventId: event.id,
        servicesPending: contract?.totalServices ? contract.totalServices - contract.servicesCompleted : 0,
        contractValue: contract?.totalValue || amount * 4,
        paymentFrequency: contract?.paymentFrequency || 'quarterly',
        
        collectionStage,
        assignedTo: daysOverdue > 30 ? 'Collections Team' : 'Accounts Team',
        notes: daysOverdue > 60 ? 'Customer contacted, requested payment plan' : undefined
      };
    });
  }, []);

  // Filter and sort receivables
  const filteredReceivables = useMemo(() => {
    let filtered = accountsReceivable.filter(ar => {
      // Text search
      if (searchTerm && !ar.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !ar.contractName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !ar.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status && ar.status !== filters.status) {
        return false;
      }
      
      // Aging bucket filter
      if (filters.agingBucket && ar.agingBucket !== filters.agingBucket) {
        return false;
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'amount':
          return b.remainingBalance - a.remainingBalance;
        case 'daysOverdue':
          return b.daysOverdue - a.daysOverdue;
        case 'customerName':
          return a.customerName.localeCompare(b.customerName);
        default:
          return b.daysOverdue - a.daysOverdue;
      }
    });

    return filtered;
  }, [accountsReceivable, searchTerm, filters, sortBy]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = accountsReceivable.reduce((sum, ar) => sum + ar.remainingBalance, 0);
    const overdue = accountsReceivable.filter(ar => ar.status === 'overdue').reduce((sum, ar) => sum + ar.remainingBalance, 0);
    const current = accountsReceivable.filter(ar => ar.status === 'current').reduce((sum, ar) => sum + ar.remainingBalance, 0);
    const overdueCount = accountsReceivable.filter(ar => ar.status === 'overdue').length;
    const totalCount = accountsReceivable.length;
    
    const agingBreakdown = {
      '0-30': accountsReceivable.filter(ar => ar.agingBucket === '0-30').reduce((sum, ar) => sum + ar.remainingBalance, 0),
      '31-60': accountsReceivable.filter(ar => ar.agingBucket === '31-60').reduce((sum, ar) => sum + ar.remainingBalance, 0),
      '61-90': accountsReceivable.filter(ar => ar.agingBucket === '61-90').reduce((sum, ar) => sum + ar.remainingBalance, 0),
      '90+': accountsReceivable.filter(ar => ar.agingBucket === '90+').reduce((sum, ar) => sum + ar.remainingBalance, 0)
    };

    const averageDaysOutstanding = totalCount > 0 
      ? accountsReceivable.reduce((sum, ar) => sum + ar.daysOverdue, 0) / totalCount 
      : 0;

    return {
      total,
      overdue,
      current,
      overdueCount,
      totalCount,
      overduePercentage: total > 0 ? (overdue / total) * 100 : 0,
      agingBreakdown,
      averageDaysOutstanding
    };
  }, [accountsReceivable]);

  // Handlers
  const handleRefresh = async () => {
    toast.success('Receivables data refreshed', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleSendReminder = (receivableId: string) => {
    toast.success('Payment reminder sent', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedReceivables.length} receivables`, {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleViewContract = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };

  const handleViewBusinessEvent = (eventId: string) => {
    navigate(`/vani/events/${eventId}`);
  };

  const handleCreateCollectionJob = (receivable: AccountReceivable) => {
    navigate(`/vani/jobs/create?eventId=${receivable.businessEventId}&type=collection`);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get urgency level
  const getUrgencyLevel = (daysOverdue: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (daysOverdue === 0) return 'low';
    if (daysOverdue <= 30) return 'medium';
    if (daysOverdue <= 60) return 'high';
    return 'critical';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.semantic.success;
      case 'current': return colors.brand.primary;
      case 'overdue': return colors.semantic.error;
      case 'disputed': return colors.semantic.warning;
      case 'written_off': return colors.utility.secondaryText;
      default: return colors.utility.primaryText;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Accounts Receivable
          </h1>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Payment tracking and collection management across all contracts
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/vani/analytics/collections')}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={() => navigate('/vani/jobs/create?type=collection')}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Send className="w-4 h-4" />
            <span>Send Reminders</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            value: formatCurrency(metrics.total),
            label: 'Total Outstanding',
            subtitle: `${metrics.totalCount} invoices`,
            icon: <DollarSign className="w-5 h-5" />,
            trend: {
              direction: 'down' as const,
              percentage: 8.2,
              period: 'vs last month'
            },
            status: 'normal' as const
          },
          {
            value: formatCurrency(metrics.overdue),
            label: 'Overdue Amount',
            subtitle: `${metrics.overdueCount} overdue`,
            icon: <AlertCircle className="w-5 h-5" />,
            trend: {
              direction: 'up' as const,
              percentage: 15.3,
              period: 'vs last month'
            },
            status: metrics.overduePercentage > 25 ? 'critical' as const : 'warning' as const,
            businessContext: {
              urgency: metrics.overduePercentage > 25 ? 'critical' as const : 'high' as const,
              actionable: true,
              relatedCount: metrics.overdueCount
            }
          },
          {
            value: `${metrics.overduePercentage.toFixed(1)}%`,
            label: 'Overdue Percentage',
            subtitle: 'Of total receivables',
            icon: <TrendingUp className="w-5 h-5" />,
            status: metrics.overduePercentage > 25 ? 'critical' as const : metrics.overduePercentage > 15 ? 'warning' as const : 'success' as const
          },
          {
            value: `${metrics.averageDaysOutstanding.toFixed(0)} days`,
            label: 'Avg Days Outstanding',
            subtitle: 'Collection period',
            icon: <Timer className="w-5 h-5" />,
            trend: {
              direction: metrics.averageDaysOutstanding > 45 ? 'up' as const : 'down' as const,
              percentage: 5.7,
              period: 'vs last month'
            }
          }
        ].map((metric, index) => (
          <VaNiMetricCard
            key={index}
            metric={metric}
            variant="business"
            onClick={index === 1 ? () => navigate('/vani/analytics/collections') : undefined}
          />
        ))}
      </div>

      {/* Aging Analysis */}
      <Card
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.utility.primaryText }}>
            Aging Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(metrics.agingBreakdown).map(([bucket, amount]) => {
              const percentage = metrics.total > 0 ? (amount / metrics.total) * 100 : 0;
              const getBucketColor = (bucket: string) => {
                switch (bucket) {
                  case '0-30': return colors.semantic.success;
                  case '31-60': return colors.semantic.warning;
                  case '61-90': return colors.semantic.error;
                  case '90+': return colors.semantic.error;
                  default: return colors.utility.primaryText;
                }
              };
              
              return (
                <div 
                  key={bucket}
                  className="p-4 border rounded-lg"
                  style={{
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: `${getBucketColor(bucket)}40`
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: colors.utility.primaryText }}>
                      {bucket} Days
                    </span>
                    <span className="text-xs" style={{ color: getBucketColor(bucket) }}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-lg font-bold" style={{ color: getBucketColor(bucket) }}>
                    {formatCurrency(amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: colors.utility.secondaryText }}
              />
              <input
                type="text"
                placeholder="Search by customer, contract, or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              <option value="daysOverdue">Sort by Days Overdue</option>
              <option value="amount">Sort by Amount</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="customerName">Sort by Customer</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'ring-2' : ''
              }`}
              style={{
                borderColor: `${colors.utility.primaryText}20`,
                backgroundColor: showFilters ? `${colors.brand.primary}10` : colors.utility.primaryBackground,
                color: showFilters ? colors.brand.primary : colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: `${colors.utility.primaryText}20` }}>
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Statuses</option>
                  <option value="current">Current</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid">Paid</option>
                  <option value="disputed">Disputed</option>
                </select>
              </div>

              {/* Aging Bucket Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Aging Bucket
                </label>
                <select
                  value={filters.agingBucket || ''}
                  onChange={(e) => setFilters({ ...filters, agingBucket: e.target.value || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Ages</option>
                  <option value="0-30">0-30 Days</option>
                  <option value="31-60">31-60 Days</option>
                  <option value="61-90">61-90 Days</option>
                  <option value="90+">90+ Days</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchTerm('');
                  }}
                  className="w-full p-2 border rounded-lg transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.secondaryText
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receivables List */}
      <Card
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <VaNiListHeader
          title={`Receivables (${filteredReceivables.length})`}
          description={selectedReceivables.length > 0 ? `${selectedReceivables.length} selected` : undefined}
          actions={
            selectedReceivables.length > 0 ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('Send Reminders')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.brand.primary}40`,
                    backgroundColor: `${colors.brand.primary}10`,
                    color: colors.brand.primary
                  }}
                >
                  <Send className="w-3 h-3" />
                  <span>Send Reminders</span>
                </button>
                <button
                  onClick={() => handleBulkAction('Export')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm" style={{ color: colors.utility.secondaryText }}>
                  <input
                    type="checkbox"
                    checked={selectedReceivables.length === filteredReceivables.length && filteredReceivables.length > 0}
                    onChange={() => {
                      if (selectedReceivables.length === filteredReceivables.length) {
                        setSelectedReceivables([]);
                      } else {
                        setSelectedReceivables(filteredReceivables.map(ar => ar.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span>Select All</span>
                </label>
              </div>
            )
          }
        />

        <CardContent className="p-0">
          {filteredReceivables.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4" style={{ color: colors.utility.secondaryText }} />
              <p style={{ color: colors.utility.secondaryText }}>
                {searchTerm || Object.keys(filters).length > 0 
                  ? 'No receivables match your search criteria.' 
                  : 'No outstanding receivables found.'
                }
              </p>
            </div>
          ) : (
            <VaNiList variant="business" spacing="compact" className="p-4">
              {filteredReceivables.map((receivable) => (
                <VaNiListItem
                  key={receivable.id}
                  variant="business"
                  onClick={() => handleViewContract(receivable.contractId)}
                  businessContext={{
                    priority: receivable.daysOverdue > 60 ? 10 : receivable.daysOverdue > 30 ? 8 : 5,
                    urgency: getUrgencyLevel(receivable.daysOverdue),
                    entityType: 'payment',
                    hasActions: true
                  }}
                  onSecondaryAction={() => handleCreateCollectionJob(receivable)}
                  secondaryActionLabel="Send Reminder"
                  style={{
                    backgroundColor: selectedReceivables.includes(receivable.id)
                      ? `${colors.brand.primary}10`
                      : colors.utility.primaryBackground,
                    borderColor: selectedReceivables.includes(receivable.id)
                      ? `${colors.brand.primary}40`
                      : `${colors.utility.primaryText}15`
                  }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedReceivables.includes(receivable.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedReceivables([...selectedReceivables, receivable.id]);
                        } else {
                          setSelectedReceivables(selectedReceivables.filter(id => id !== receivable.id));
                        }
                      }}
                      className="rounded"
                    />

                    {/* Status Indicator */}
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getStatusColor(receivable.status) }}
                    />

                    {/* Receivable Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 
                          className="font-medium truncate"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {receivable.customerName}
                        </h3>
                        <span
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor: `${getStatusColor(receivable.status)}20`,
                            color: getStatusColor(receivable.status)
                          }}
                        >
                          {receivable.status.toUpperCase()}
                        </span>
                        {receivable.daysOverdue > 0 && (
                          <span
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{
                              backgroundColor: `${colors.semantic.error}20`,
                              color: colors.semantic.error
                            }}
                          >
                            {receivable.daysOverdue} days overdue
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs" style={{ color: colors.utility.secondaryText }}>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{receivable.invoiceNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due {formatDate(receivable.dueDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Building className="w-3 h-3" />
                          <span>{receivable.contractName}</span>
                        </div>
                        {receivable.remindersSent > 0 && (
                          <div className="flex items-center space-x-1">
                            <Send className="w-3 h-3" />
                            <span>{receivable.remindersSent} reminders sent</span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar for Payment */}
                      <div className="mt-2">
                        <div 
                          className="w-full h-1 rounded-full"
                          style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              backgroundColor: colors.semantic.success,
                              width: `${(receivable.totalPaid / receivable.amount) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="text-right">
                      <div 
                        className="text-lg font-bold"
                        style={{ 
                          color: receivable.status === 'overdue' 
                            ? colors.semantic.error 
                            : colors.utility.primaryText 
                        }}
                      >
                        {formatCurrency(receivable.remainingBalance)}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        of {formatCurrency(receivable.amount)}
                      </div>
                      {receivable.totalPaid > 0 && (
                        <div 
                          className="text-xs"
                          style={{ color: colors.semantic.success }}
                        >
                          {formatCurrency(receivable.totalPaid)} paid
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1">
                      {receivable.businessEventId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewBusinessEvent(receivable.businessEventId!);
                          }}
                          className="p-1 transition-colors hover:opacity-80"
                          style={{ color: colors.utility.secondaryText }}
                          title="View Payment Event"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendReminder(receivable.id);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.brand.primary }}
                        title="Send Payment Reminder"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewContract(receivable.contractId);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.utility.secondaryText }}
                        title="View Contract"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </VaNiListItem>
              ))}
            </VaNiList>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsReceivablePage;