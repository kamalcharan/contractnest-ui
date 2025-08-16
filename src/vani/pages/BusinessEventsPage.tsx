// src/vani/pages/BusinessEventsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
  realisticEventJobs,
  realisticContracts,
  businessIntelligence,
  type BusinessEvent,
  type EventDrivenJob
} from '../utils/fakeData';
import { 
  Activity, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Building,
  RefreshCw,
  Filter,
  Search,
  FileText,
  MessageSquare,
  Zap,
  BarChart3,
  ArrowRight,
  ExternalLink,
  Server,
  Database,
  Workflow
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EventFilters {
  sourceModule?: string;
  eventType?: string;
  status?: string;
  dateRange?: 'today' | 'week' | 'month' | 'all';
}

const BusinessEventsPage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('month');

  // Process business events data
  const filteredEvents = useMemo(() => {
    return realisticBusinessEvents.filter(event => {
      // Text search
      if (searchTerm && !event.entityName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !event.contactName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !event.eventType.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Source module filter
      if (filters.sourceModule && event.sourceModule !== filters.sourceModule) {
        return false;
      }
      
      // Event type filter
      if (filters.eventType && event.eventType !== filters.eventType) {
        return false;
      }
      
      // Status filter
      if (filters.status && event.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }, [realisticBusinessEvents, searchTerm, filters]);

  // Calculate business metrics
  const businessMetrics = useMemo(() => {
    const totalEvents = realisticBusinessEvents.length;
    const completedEvents = realisticBusinessEvents.filter(e => e.status === 'completed').length;
    const inProgressEvents = realisticBusinessEvents.filter(e => e.status === 'in_progress').length;
    const overduePayments = businessIntelligence.getAccountsReceivable().filter(ar => ar.daysOverdue > 0);
    const upcomingServices = businessIntelligence.getServiceSchedule().filter(s => s.status === 'planned');
    
    const totalJobsGenerated = realisticEventJobs.length;
    const successfulJobs = realisticEventJobs.filter(j => j.status === 'completed').length;
    const successRate = totalJobsGenerated > 0 ? (successfulJobs / totalJobsGenerated) * 100 : 0;
    
    const totalRevenue = overduePayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalContracts = realisticContracts.length;
    const activeContracts = realisticContracts.filter(c => c.status === 'active').length;

    return {
      totalEvents,
      completedEvents,
      inProgressEvents,
      overduePayments: overduePayments.length,
      upcomingServices: upcomingServices.length,
      successRate,
      totalRevenue,
      activeContracts,
      totalContracts
    };
  }, []);

  // Event type distribution
  const eventTypeDistribution = useMemo(() => {
    const distribution = realisticBusinessEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(distribution).map(([type, count]) => ({
      type,
      count,
      percentage: (count / realisticBusinessEvents.length) * 100
    }));
  }, []);

  // Module health status
  const moduleHealthStatus = useMemo(() => {
    const modules = ['contracts', 'invoicing', 'services'] as const;
    
    return modules.map(module => {
      const moduleEvents = realisticBusinessEvents.filter(e => e.sourceModule === module);
      const successfulEvents = moduleEvents.filter(e => e.status === 'completed');
      const failedEvents = moduleEvents.filter(e => e.status === 'failed');
      
      const healthScore = moduleEvents.length > 0 
        ? (successfulEvents.length / moduleEvents.length) * 100 
        : 100;
      
      return {
        module,
        totalEvents: moduleEvents.length,
        successfulEvents: successfulEvents.length,
        failedEvents: failedEvents.length,
        healthScore,
        status: healthScore >= 95 ? 'healthy' : healthScore >= 85 ? 'warning' : 'critical'
      };
    });
  }, []);

  // Handlers
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Business events refreshed', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleEventClick = (event: BusinessEvent) => {
    navigate(`/vani/events/${event.id}`);
  };

  const handleViewContract = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };

  const handleCreateEventRule = () => {
    navigate('/vani/rules/create');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get event type icon
  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'service_due': return <Calendar className="w-4 h-4" />;
      case 'payment_due': return <DollarSign className="w-4 h-4" />;
      case 'contract_renewal': return <FileText className="w-4 h-4" />;
      case 'emergency_service': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Get module icon
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'contracts': return <FileText className="w-4 h-4" />;
      case 'invoicing': return <DollarSign className="w-4 h-4" />;
      case 'services': return <Calendar className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  // Metric cards data
  const metrics = [
    {
      value: businessMetrics.totalEvents.toString(),
      label: 'Total Business Events',
      subtitle: 'Across all modules',
      icon: <Activity className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 15.2,
        period: 'vs last month'
      }
    },
    {
      value: `${businessMetrics.successRate.toFixed(1)}%`,
      label: 'Automation Success Rate',
      subtitle: 'Event-driven jobs completed',
      icon: <CheckCircle className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 3.1,
        period: 'vs last month'
      }
    },
    {
      value: businessMetrics.overduePayments.toString(),
      label: 'Overdue Payments',
      subtitle: 'Requiring attention',
      icon: <AlertCircle className="w-5 h-5" />,
      trend: {
        direction: 'down' as const,
        percentage: 8.5,
        period: 'vs last month'
      }
    },
    {
      value: `₹${(businessMetrics.totalRevenue / 1000).toFixed(0)}K`,
      label: 'Outstanding Revenue',
      subtitle: 'Pending collections',
      icon: <TrendingUp className="w-5 h-5" />,
      cost: `${businessMetrics.activeContracts}/${businessMetrics.totalContracts} contracts active`
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Business Events
          </h1>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Central nervous system for all business operations across modules
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80 disabled:opacity-50"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={handleCreateEventRule}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Workflow className="w-4 h-4" />
            <span>Create Event Rule</span>
          </button>
        </div>
      </div>

      {/* Business Intelligence Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <VaNiMetricCard
            key={index}
            metric={metric}
            loading={loading}
            onClick={index === 2 ? () => navigate('/vani/finance/receivables') : undefined}
          />
        ))}
      </div>

      {/* Search and Filters */}
      <Card
        className="transition-colors"
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
                placeholder="Search events by customer, contract, or event type..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t" style={{ borderColor: `${colors.utility.primaryText}20` }}>
              {/* Source Module Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Source Module
                </label>
                <select
                  value={filters.sourceModule || ''}
                  onChange={(e) => setFilters({ ...filters, sourceModule: e.target.value || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Modules</option>
                  <option value="contracts">Contracts</option>
                  <option value="invoicing">Invoicing</option>
                  <option value="services">Services</option>
                  <option value="crm">CRM</option>
                </select>
              </div>

              {/* Event Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Event Type
                </label>
                <select
                  value={filters.eventType || ''}
                  onChange={(e) => setFilters({ ...filters, eventType: e.target.value || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Types</option>
                  <option value="service_due">Service Due</option>
                  <option value="payment_due">Payment Due</option>
                  <option value="contract_renewal">Contract Renewal</option>
                  <option value="emergency_service">Emergency Service</option>
                </select>
              </div>

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
                  <option value="planned">Planned</option>
                  <option value="reminded">Reminded</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Business Events List */}
        <div className="xl:col-span-2">
          <Card
            className="h-full transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <VaNiListHeader
              title={`Business Events (${filteredEvents.length})`}
              description="Real-time events from all business modules"
              actions={
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/vani/analytics')}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                    style={{
                      borderColor: `${colors.utility.primaryText}20`,
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText
                    }}
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span>Analytics</span>
                  </button>
                </div>
              }
            />
            
            <CardContent className="p-0">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4" style={{ color: colors.utility.secondaryText }} />
                  <p style={{ color: colors.utility.secondaryText }}>
                    {searchTerm || Object.keys(filters).length > 0 
                      ? 'No events match your search criteria.' 
                      : 'No business events found.'
                    }
                  </p>
                </div>
              ) : (
                <VaNiList variant="jobs" spacing="compact" className="p-4">
                  {filteredEvents.map((event) => {
                    const relatedJobs = businessIntelligence.getJobsByBusinessEvent(event.id);
                    
                    return (
                      <VaNiListItem
                        key={event.id}
                        variant="default"
                        onClick={() => handleEventClick(event)}
                        style={{
                          backgroundColor: colors.utility.primaryBackground,
                          borderColor: `${colors.utility.primaryText}15`
                        }}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Event Type Icon */}
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${colors.brand.primary}20` }}
                          >
                            <div style={{ color: colors.brand.primary }}>
                              {getEventTypeIcon(event.eventType)}
                            </div>
                          </div>

                          {/* Event Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 
                                className="font-medium truncate"
                                style={{ color: colors.utility.primaryText }}
                              >
                                {event.entityName}
                              </h3>
                              <VaNiStatusBadge status={event.status as any} size="sm" />
                              <span
                                className="px-2 py-0.5 text-xs rounded-full"
                                style={{
                                  backgroundColor: `${colors.semantic.info}20`,
                                  color: colors.semantic.info
                                }}
                              >
                                {event.sourceModule}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs" style={{ color: colors.utility.secondaryText }}>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{event.contactName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(event.eventDate)}</span>
                              </div>
                              {event.metadata.contractId && (
                                <div className="flex items-center space-x-1">
                                  <FileText className="w-3 h-3" />
                                  <span>Contract #{event.metadata.contractId}</span>
                                </div>
                              )}
                              {event.metadata.serviceNumber && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Service {event.metadata.serviceNumber}/{event.metadata.totalServices}</span>
                                </div>
                              )}
                            </div>

                            {/* Business Context */}
                            <div className="mt-2 flex items-center space-x-2">
                              {event.metadata.amount && (
                                <span 
                                  className="text-sm font-medium"
                                  style={{ color: colors.semantic.success }}
                                >
                                  ₹{event.metadata.amount.toLocaleString()}
                                </span>
                              )}
                              {relatedJobs.length > 0 && (
                                <span 
                                  className="text-xs px-2 py-1 rounded"
                                  style={{ 
                                    backgroundColor: `${colors.brand.secondary}20`,
                                    color: colors.brand.secondary 
                                  }}
                                >
                                  {relatedJobs.length} jobs generated
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Priority & Actions */}
                          <div className="flex items-center space-x-3">
                            <div className="text-center">
                              <div 
                                className="text-lg font-bold"
                                style={{ 
                                  color: event.priority >= 8 
                                    ? colors.semantic.error 
                                    : event.priority >= 6 
                                      ? colors.semantic.warning 
                                      : colors.semantic.success 
                                }}
                              >
                                {event.priority}
                              </div>
                              <div 
                                className="text-xs"
                                style={{ color: colors.utility.secondaryText }}
                              >
                                Priority
                              </div>
                            </div>

                            {event.metadata.contractId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewContract(event.metadata.contractId!);
                                }}
                                className="p-1 transition-colors hover:opacity-80"
                                style={{ color: colors.utility.secondaryText }}
                                title="View Contract"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </VaNiListItem>
                    );
                  })}
                </VaNiList>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Module Health & Analytics */}
        <div className="space-y-6">
          
          {/* Module Health Status */}
          <Card
            className="transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <CardHeader>
              <CardTitle 
                className="flex items-center space-x-2"
                style={{ color: colors.utility.primaryText }}
              >
                <Server className="w-5 h-5" />
                <span>Module Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VaNiList variant="channels" spacing="normal">
                {moduleHealthStatus.map((module) => (
                  <VaNiListItem
                    key={module.module}
                    variant="compact"
                    clickable={false}
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}15`
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div style={{ color: colors.brand.primary }}>
                        {getModuleIcon(module.module)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p 
                            className="font-medium capitalize"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {module.module}
                          </p>
                          <VaNiStatusBadge 
                            status={module.status === 'healthy' ? 'active' : module.status === 'warning' ? 'configuring' : 'error'} 
                            variant="channel" 
                            size="sm" 
                          />
                        </div>
                        <p 
                          className="text-xs"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          {module.totalEvents} events • {module.healthScore.toFixed(1)}% success
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p 
                        className="text-sm font-medium"
                        style={{ 
                          color: module.healthScore >= 95 
                            ? colors.semantic.success 
                            : module.healthScore >= 85 
                              ? colors.semantic.warning 
                              : colors.semantic.error 
                        }}
                      >
                        {module.healthScore.toFixed(0)}%
                      </p>
                    </div>
                  </VaNiListItem>
                ))}
              </VaNiList>
            </CardContent>
          </Card>

          {/* Event Type Distribution */}
          <Card
            className="transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <CardHeader>
              <CardTitle 
                className="flex items-center space-x-2"
                style={{ color: colors.utility.primaryText }}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Event Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eventTypeDistribution.map(({ type, count, percentage }) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div style={{ color: colors.brand.primary }}>
                        {getEventTypeIcon(type)}
                      </div>
                      <span 
                        className="text-sm capitalize"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span 
                        className="font-medium text-sm"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {count}
                      </span>
                      <div 
                        className="w-12 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: `${colors.utility.primaryText}10` }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            backgroundColor: colors.brand.primary,
                            width: `${percentage}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card
            className="transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.utility.primaryText }}>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => navigate('/vani/webhooks')}
                className="w-full flex items-center space-x-3 p-3 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: `${colors.utility.primaryText}20`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <Zap className="w-4 h-4" />
                <span>Webhook Management</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
              
              <button
                onClick={() => navigate('/vani/finance/receivables')}
                className="w-full flex items-center space-x-3 p-3 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: `${colors.utility.primaryText}20`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <DollarSign className="w-4 h-4" />
                <span>Accounts Receivable</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
              
              <button
                onClick={() => navigate('/vani/operations/services')}
                className="w-full flex items-center space-x-3 p-3 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: `${colors.utility.primaryText}20`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <Calendar className="w-4 h-4" />
                <span>Service Schedule</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessEventsPage;