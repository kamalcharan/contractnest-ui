// src/vani/pages/ServiceSchedulePage.tsx
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
  realisticEventJobs,
  businessIntelligence,
  type BusinessEvent
} from '../utils/fakeData';
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Filter,
  Search,
  Download,
  RefreshCw,
  BarChart3,
  FileText,
  Building,
  Wrench,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ExternalLink,
  MessageSquare,
  Timer,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ServiceScheduleFilters {
  status?: string;
  technician?: string;
  contractType?: string;
  dateRange?: 'today' | 'week' | 'month' | 'custom';
  priority?: string;
}

interface ServiceEvent extends BusinessEvent {
  technicianInfo?: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    completedServices: number;
  };
  estimatedDuration?: string;
  actualDuration?: string;
  completionNotes?: string;
  customerFeedback?: {
    rating: number;
    comment: string;
  };
}

const ServiceSchedulePage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState<ServiceScheduleFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState<'list' | 'calendar' | 'technician'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Process service events from business events
  const serviceEvents: ServiceEvent[] = useMemo(() => {
    return realisticBusinessEvents
      .filter(event => event.eventType === 'service_due' || event.eventType === 'emergency_service')
      .map(event => ({
        ...event,
        technicianInfo: {
          name: event.metadata.technician || 'Service Team',
          phone: '+919876543213',
          email: `${(event.metadata.technician || 'service').toLowerCase().replace(' ', '.')}@company.com`,
          rating: 4.2 + Math.random() * 0.8,
          completedServices: Math.floor(Math.random() * 50) + 20
        },
        estimatedDuration: event.metadata.estimatedDuration || '2 hours',
        actualDuration: event.status === 'completed' ? 
          `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 6)}hrs` : undefined,
        completionNotes: event.status === 'completed' ? 
          `Service completed successfully. ${event.eventType === 'emergency_service' ? 'Emergency resolved.' : 'Regular maintenance performed.'}` : undefined,
        customerFeedback: event.status === 'completed' ? {
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          comment: 'Service was completed on time and professionally.'
        } : undefined
      }));
  }, []);

  // Filter service events
  const filteredServiceEvents = useMemo(() => {
    return serviceEvents.filter(event => {
      // Text search
      if (searchTerm && !event.entityName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !event.contactName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !event.technicianInfo?.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status && event.status !== filters.status) {
        return false;
      }
      
      // Technician filter
      if (filters.technician && event.technicianInfo?.name !== filters.technician) {
        return false;
      }
      
      // Priority filter
      if (filters.priority) {
        const priorityRange = filters.priority;
        if (priorityRange === 'high' && event.priority < 7) return false;
        if (priorityRange === 'medium' && (event.priority < 4 || event.priority > 6)) return false;
        if (priorityRange === 'low' && event.priority > 3) return false;
      }
      
      return true;
    });
  }, [serviceEvents, searchTerm, filters]);

  // Calculate service metrics
  const serviceMetrics = useMemo(() => {
    const totalServices = serviceEvents.length;
    const completedServices = serviceEvents.filter(s => s.status === 'completed').length;
    const scheduledServices = serviceEvents.filter(s => s.status === 'planned').length;
    const inProgressServices = serviceEvents.filter(s => s.status === 'in_progress').length;
    const overdueServices = serviceEvents.filter(s => 
      s.status === 'planned' && new Date(s.eventDate) < new Date()
    ).length;
    
    const emergencyServices = serviceEvents.filter(s => s.eventType === 'emergency_service').length;
    const avgRating = serviceEvents
      .filter(s => s.customerFeedback)
      .reduce((sum, s) => sum + (s.customerFeedback?.rating || 0), 0) / 
      serviceEvents.filter(s => s.customerFeedback).length || 0;
    
    const completionRate = totalServices > 0 ? (completedServices / totalServices) * 100 : 0;
    
    // Technician workload
    const technicianWorkload = serviceEvents.reduce((acc, event) => {
      const techName = event.technicianInfo?.name || 'Unknown';
      if (!acc[techName]) {
        acc[techName] = { total: 0, completed: 0, scheduled: 0 };
      }
      acc[techName].total++;
      if (event.status === 'completed') acc[techName].completed++;
      if (event.status === 'planned') acc[techName].scheduled++;
      return acc;
    }, {} as Record<string, { total: number; completed: number; scheduled: number }>);

    return {
      totalServices,
      completedServices,
      scheduledServices,
      inProgressServices,
      overdueServices,
      emergencyServices,
      avgRating,
      completionRate,
      technicianWorkload
    };
  }, [serviceEvents]);

  // Get unique technicians for filter
  const availableTechnicians = useMemo(() => {
    const technicians = new Set(serviceEvents.map(s => s.technicianInfo?.name).filter(Boolean));
    return Array.from(technicians);
  }, [serviceEvents]);

  // Handlers
  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Service schedule refreshed', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleServiceAction = (action: string, service: ServiceEvent) => {
    console.log(`${action} service:`, service.id);
    toast.success(`${action} action triggered for ${service.entityName}`, {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleViewContract = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/vani/events/${eventId}`);
  };

  const handleScheduleService = () => {
    navigate('/services/schedule/new');
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24*60*60*1000).toDateString();
    
    let prefix = '';
    if (isToday) prefix = 'Today, ';
    else if (isTomorrow) prefix = 'Tomorrow, ';
    
    return prefix + date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get priority color
  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return colors.semantic.error;
    if (priority >= 6) return colors.semantic.warning;
    if (priority >= 4) return colors.brand.primary;
    return colors.semantic.success;
  };

  // Get service type icon
  const getServiceTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'emergency_service':
        return <AlertCircle className="w-4 h-4" />;
      case 'service_due':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Metric cards data
  const metrics = [
    {
      value: serviceMetrics.totalServices.toString(),
      label: 'Total Services',
      subtitle: 'This month',
      icon: <Wrench className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 12.5,
        period: 'vs last month'
      },
      businessContext: {
        entityType: 'services' as const,
        relatedCount: serviceMetrics.scheduledServices,
        actionable: serviceMetrics.overdueServices > 0,
        urgency: serviceMetrics.overdueServices > 0 ? 'high' as const : 'low' as const
      }
    },
    {
      value: `${serviceMetrics.completionRate.toFixed(1)}%`,
      label: 'Completion Rate',
      subtitle: 'On-time completion',
      icon: <Target className="w-5 h-5" />,
      status: serviceMetrics.completionRate >= 95 ? 'success' as const : 'warning' as const,
      secondaryMetric: {
        value: serviceMetrics.avgRating.toFixed(1),
        label: 'Avg Rating'
      }
    },
    {
      value: serviceMetrics.overdueServices.toString(),
      label: 'Overdue Services',
      subtitle: 'Requiring attention',
      icon: <AlertCircle className="w-5 h-5" />,
      status: serviceMetrics.overdueServices === 0 ? 'success' as const : 'critical' as const,
      businessContext: {
        entityType: 'services' as const,
        actionable: serviceMetrics.overdueServices > 0,
        urgency: serviceMetrics.overdueServices > 2 ? 'critical' as const : 'medium' as const
      }
    },
    {
      value: serviceMetrics.emergencyServices.toString(),
      label: 'Emergency Services',
      subtitle: 'High priority',
      icon: <Timer className="w-5 h-5" />,
      status: serviceMetrics.emergencyServices === 0 ? 'success' as const : 'warning' as const,
      cost: `${Object.keys(serviceMetrics.technicianWorkload).length} technicians active`
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
            Service Schedule
          </h1>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Operations management for service events and technician scheduling
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center space-x-1 p-1 border rounded-lg" style={{ borderColor: `${colors.utility.primaryText}20` }}>
            {(['list', 'calendar', 'technician'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedView === view ? '' : ''
                }`}
                style={{
                  backgroundColor: selectedView === view 
                    ? colors.brand.primary 
                    : 'transparent',
                  color: selectedView === view 
                    ? '#FFF' 
                    : colors.utility.primaryText
                }}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

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
            onClick={handleScheduleService}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Service</span>
          </button>
        </div>
      </div>

      {/* Service Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <VaNiMetricCard
            key={index}
            metric={metric}
            variant="business"
            loading={loading}
            onClick={index === 2 ? () => console.log('View overdue services') : undefined}
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
                placeholder="Search by customer, technician, or service type..."
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
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Technician Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Technician
                </label>
                <select
                  value={filters.technician || ''}
                  onChange={(e) => setFilters({ ...filters, technician: e.target.value || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Technicians</option>
                  {availableTechnicians.map((tech) => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Priority
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Priorities</option>
                  <option value="high">High (7-10)</option>
                  <option value="medium">Medium (4-6)</option>
                  <option value="low">Low (1-3)</option>
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

      {/* Service Schedule List */}
      {selectedView === 'list' && (
        <Card
          className="transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}20`
          }}
        >
          <VaNiListHeader
            title={`Service Schedule (${filteredServiceEvents.length})`}
            description="Scheduled and completed service events"
            showMetrics={true}
            metrics={{
              total: serviceMetrics.totalServices,
              pending: serviceMetrics.scheduledServices,
              completed: serviceMetrics.completedServices,
              failed: serviceMetrics.overdueServices
            }}
            actions={
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => console.log('Export schedule')}
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
            }
          />

          <CardContent className="p-0">
            {filteredServiceEvents.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: colors.utility.secondaryText }} />
                <p style={{ color: colors.utility.secondaryText }}>
                  {searchTerm || Object.keys(filters).length > 0 
                    ? 'No services match your search criteria.' 
                    : 'No services scheduled.'
                  }
                </p>
              </div>
            ) : (
              <VaNiList variant="business" spacing="compact" className="p-4">
                {filteredServiceEvents.map((service) => {
                  const contract = realisticContracts.find(c => c.id === service.metadata.contractId);
                  const relatedJobs = businessIntelligence.getJobsByBusinessEvent(service.id);
                  
                  return (
                    <VaNiListItem
                      key={service.id}
                      variant="business"
                      onClick={() => handleViewEvent(service.id)}
                      businessContext={{
                        priority: service.priority,
                        urgency: service.priority >= 8 ? 'critical' : service.priority >= 6 ? 'high' : 'medium',
                        entityType: service.entityType,
                        moduleSource: service.sourceModule,
                        hasActions: true
                      }}
                      onSecondaryAction={() => service.metadata.contractId && handleViewContract(service.metadata.contractId)}
                      secondaryActionLabel="View Contract"
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        borderColor: `${colors.utility.primaryText}15`
                      }}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Service Type Icon */}
                        <div 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${getPriorityColor(service.priority)}20` }}
                        >
                          <div style={{ color: getPriorityColor(service.priority) }}>
                            {getServiceTypeIcon(service.eventType)}
                          </div>
                        </div>

                        {/* Service Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 
                              className="font-medium truncate"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {service.entityName}
                            </h3>
                            <VaNiStatusBadge status={service.status as any} variant="event" size="sm" />
                            {service.eventType === 'emergency_service' && (
                              <span
                                className="px-2 py-0.5 text-xs rounded-full font-medium"
                                style={{
                                  backgroundColor: `${colors.semantic.error}20`,
                                  color: colors.semantic.error
                                }}
                              >
                                EMERGENCY
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm" style={{ color: colors.utility.secondaryText }}>
                            <div className="flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span>{service.contactName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(service.eventDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{service.technicianInfo?.name}</span>
                            </div>
                            {service.estimatedDuration && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{service.estimatedDuration}</span>
                              </div>
                            )}
                          </div>

                          {/* Service Details */}
                          <div className="mt-2 flex items-center space-x-4 text-xs">
                            {service.metadata.serviceNumber && (
                              <span 
                                className="px-2 py-1 rounded"
                                style={{ 
                                  backgroundColor: `${colors.brand.primary}20`,
                                  color: colors.brand.primary 
                                }}
                              >
                                Service {service.metadata.serviceNumber}/{service.metadata.totalServices}
                              </span>
                            )}
                            {contract && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewContract(contract.id);
                                }}
                                className="flex items-center space-x-1 hover:opacity-80"
                                style={{ color: colors.brand.secondary }}
                              >
                                <FileText className="w-3 h-3" />
                                <span>Contract {contract.id}</span>
                              </button>
                            )}
                            {relatedJobs.length > 0 && (
                              <span 
                                className="px-2 py-1 rounded"
                                style={{ 
                                  backgroundColor: `${colors.semantic.success}20`,
                                  color: colors.semantic.success 
                                }}
                              >
                                {relatedJobs.length} comm. jobs
                              </span>
                            )}
                          </div>

                          {/* Completion Info */}
                          {service.status === 'completed' && (
                            <div className="mt-2 p-2 border rounded" style={{ borderColor: `${colors.semantic.success}40`, backgroundColor: `${colors.semantic.success}10` }}>
                              <div className="flex items-center justify-between text-xs">
                                <span style={{ color: colors.utility.primaryText }}>
                                  Completed in {service.actualDuration}
                                </span>
                                {service.customerFeedback && (
                                  <div className="flex items-center space-x-1">
                                    <span style={{ color: colors.semantic.warning }}>
                                      {'★'.repeat(service.customerFeedback.rating)}
                                    </span>
                                    <span style={{ color: colors.utility.secondaryText }}>
                                      ({service.customerFeedback.rating}/5)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Technician Contact */}
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                              style={{ 
                                backgroundColor: `${colors.brand.primary}20`,
                                color: colors.brand.primary 
                              }}
                            >
                              {service.technicianInfo?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p 
                                className="text-sm font-medium"
                                style={{ color: colors.utility.primaryText }}
                              >
                                {service.technicianInfo?.name}
                              </p>
                              <div className="flex items-center space-x-2 text-xs">
                                <span style={{ color: colors.semantic.warning }}>
                                  ★{service.technicianInfo?.rating.toFixed(1)}
                                </span>
                                <span style={{ color: colors.utility.secondaryText }}>
                                  {service.technicianInfo?.completedServices} services
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${service.technicianInfo?.phone}`);
                              }}
                              className="p-1 transition-colors hover:opacity-80"
                              style={{ color: colors.utility.secondaryText }}
                              title="Call Technician"
                            >
                              <Phone className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${service.technicianInfo?.email}`);
                              }}
                              className="p-1 transition-colors hover:opacity-80"
                              style={{ color: colors.utility.secondaryText }}
                              title="Email Technician"
                            >
                              <Mail className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </VaNiListItem>
                  );
                })}
              </VaNiList>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technician View */}
      {selectedView === 'technician' && (
        <Card
          className="transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}20`
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: colors.utility.primaryText }}>
              Technician Workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(serviceMetrics.technicianWorkload).map(([techName, workload]) => {
                const techServices = serviceEvents.filter(s => s.technicianInfo?.name === techName);
                const avgRating = techServices.reduce((sum, s) => sum + (s.technicianInfo?.rating || 0), 0) / techServices.length;
                
                return (
                  <Card
                    key={techName}
                    className="p-4"
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}20`
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-medium"
                        style={{ 
                          backgroundColor: `${colors.brand.primary}20`,
                          color: colors.brand.primary 
                        }}
                      >
                        {techName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {techName}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs">
                          <span style={{ color: colors.semantic.warning }}>
                            ★{avgRating.toFixed(1)}
                          </span>
                          <span style={{ color: colors.utility.secondaryText }}>
                            {workload.total} services
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Completed:</span>
                        <span style={{ color: colors.semantic.success }}>{workload.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Scheduled:</span>
                        <span style={{ color: colors.semantic.warning }}>{workload.scheduled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Success Rate:</span>
                        <span style={{ color: colors.utility.primaryText }}>
                          {workload.total > 0 ? ((workload.completed / workload.total) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions for Calendar/Technician Views */}
      {selectedView !== 'list' && (
        <Card
          className="transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}20`
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setSelectedView('list')}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: `${colors.brand.primary}40`,
                  backgroundColor: `${colors.brand.primary}10`,
                  color: colors.brand.primary
                }}
              >
                <ArrowRight className="w-4 h-4" />
                <span>Switch to List View</span>
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceSchedulePage;