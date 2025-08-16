// src/vani/pages/WebhookManagementPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  VaNiStatusBadge,
  VaNiList,
  VaNiListItem,
  VaNiListHeader,
  VaNiMetricCard
} from '../components/shared';
import { 
  realisticBusinessEvents,
  type BusinessEvent
} from '../utils/fakeData';
import { 
  Webhook,
  Server,
  Database,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Settings,
  Eye,
  Copy,
  Download,
  Zap,
  Activity,
  BarChart3,
  FileText,
  DollarSign,
  Calendar,
  Users,
  ExternalLink,
  Key,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  sourceModule: 'contracts' | 'invoicing' | 'services' | 'crm' | 'support';
  sourceSystem: string;
  
  // Authentication
  authType: 'none' | 'bearer' | 'basic' | 'signature';
  authConfig: {
    token?: string;
    username?: string;
    password?: string;
    secret?: string;
  };
  
  // Configuration
  status: 'active' | 'inactive' | 'error' | 'testing';
  events: string[];
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'linear' | 'exponential';
    retryDelays: number[];
  };
  
  // Metrics
  metrics: {
    totalEvents: number;
    successfulEvents: number;
    failedEvents: number;
    lastEventAt?: string;
    avgResponseTime: number;
    uptime: number;
  };
  
  // Health
  healthCheck: {
    lastCheck: string;
    status: 'healthy' | 'warning' | 'critical';
    responseTime: number;
    errorMessage?: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

interface WebhookLog {
  id: string;
  webhookId: string;
  eventType: string;
  sourceModule: string;
  
  // Request details
  method: 'POST' | 'PUT' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  payload: any;
  
  // Response details
  status: 'success' | 'failed' | 'pending' | 'retrying';
  statusCode?: number;
  responseTime?: number;
  responseBody?: any;
  errorMessage?: string;
  
  // Retry information
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: string;
  
  // Business context
  businessEventId?: string;
  entityType: string;
  entityId: string;
  customerName: string;
  
  timestamp: string;
}

const WebhookManagementPage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  
  // State
  const [activeTab, setActiveTab] = useState<'endpoints' | 'logs' | 'health' | 'settings'>('endpoints');
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    module: 'all',
    timeRange: '24h'
  });

  // Mock webhook endpoints data
  const webhookEndpoints: WebhookEndpoint[] = useMemo(() => [
    {
      id: 'webhook_001',
      name: 'Contracts Module Integration',
      url: 'https://api.vani.internal/webhooks/contracts',
      sourceModule: 'contracts',
      sourceSystem: 'ContractNest v2.1',
      
      authType: 'bearer',
      authConfig: {
        token: 'vani_****_contracts'
      },
      
      status: 'active',
      events: ['service_due', 'contract_renewal', 'contract_created', 'contract_updated'],
      retryPolicy: {
        maxRetries: 3,
        backoffStrategy: 'exponential',
        retryDelays: [5000, 15000, 45000]
      },
      
      metrics: {
        totalEvents: 1247,
        successfulEvents: 1232,
        failedEvents: 15,
        lastEventAt: '2025-08-15T14:30:00Z',
        avgResponseTime: 142,
        uptime: 99.8
      },
      
      healthCheck: {
        lastCheck: '2025-08-15T14:35:00Z',
        status: 'healthy',
        responseTime: 89
      },
      
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-08-15T14:30:00Z'
    },
    {
      id: 'webhook_002',
      name: 'Invoicing Module Integration',
      url: 'https://api.vani.internal/webhooks/invoicing',
      sourceModule: 'invoicing',
      sourceSystem: 'ContractNest Billing v2.1',
      
      authType: 'signature',
      authConfig: {
        secret: 'vani_hmac_****'
      },
      
      status: 'active',
      events: ['payment_due', 'payment_overdue', 'payment_received', 'invoice_created'],
      retryPolicy: {
        maxRetries: 5,
        backoffStrategy: 'exponential',
        retryDelays: [3000, 9000, 27000, 81000, 243000]
      },
      
      metrics: {
        totalEvents: 892,
        successfulEvents: 876,
        failedEvents: 16,
        lastEventAt: '2025-08-15T13:45:00Z',
        avgResponseTime: 203,
        uptime: 98.2
      },
      
      healthCheck: {
        lastCheck: '2025-08-15T14:30:00Z',
        status: 'healthy',
        responseTime: 156
      },
      
      createdAt: '2025-02-01T10:00:00Z',
      updatedAt: '2025-08-15T13:45:00Z'
    },
    {
      id: 'webhook_003',
      name: 'Services Module Integration',
      url: 'https://api.vani.internal/webhooks/services',
      sourceModule: 'services',
      sourceSystem: 'ContractNest Services v2.1',
      
      authType: 'bearer',
      authConfig: {
        token: 'vani_****_services'
      },
      
      status: 'error',
      events: ['service_completed', 'service_delayed', 'emergency_service', 'service_cancelled'],
      retryPolicy: {
        maxRetries: 3,
        backoffStrategy: 'linear',
        retryDelays: [10000, 20000, 30000]
      },
      
      metrics: {
        totalEvents: 456,
        successfulEvents: 423,
        failedEvents: 33,
        lastEventAt: '2025-08-15T12:15:00Z',
        avgResponseTime: 89,
        uptime: 92.8
      },
      
      healthCheck: {
        lastCheck: '2025-08-15T14:32:00Z',
        status: 'critical',
        responseTime: 0,
        errorMessage: 'Connection timeout after 30 seconds'
      },
      
      createdAt: '2025-03-01T10:00:00Z',
      updatedAt: '2025-08-15T12:15:00Z'
    },
    {
      id: 'webhook_004',
      name: 'CRM Module Integration',
      url: 'https://api.vani.internal/webhooks/crm',
      sourceModule: 'crm',
      sourceSystem: 'ContractNest CRM v1.8',
      
      authType: 'basic',
      authConfig: {
        username: 'vani_crm',
        password: '****'
      },
      
      status: 'testing',
      events: ['lead_created', 'customer_updated', 'opportunity_stage_changed'],
      retryPolicy: {
        maxRetries: 2,
        backoffStrategy: 'linear',
        retryDelays: [5000, 10000]
      },
      
      metrics: {
        totalEvents: 89,
        successfulEvents: 67,
        failedEvents: 22,
        lastEventAt: '2025-08-15T11:00:00Z',
        avgResponseTime: 234,
        uptime: 75.3
      },
      
      healthCheck: {
        lastCheck: '2025-08-15T14:28:00Z',
        status: 'warning',
        responseTime: 2340,
        errorMessage: 'Slow response time detected'
      },
      
      createdAt: '2025-07-01T10:00:00Z',
      updatedAt: '2025-08-15T11:00:00Z'
    }
  ], []);

  // Mock webhook logs from recent business events
  const webhookLogs: WebhookLog[] = useMemo(() => {
    return realisticBusinessEvents.slice(0, 15).map((event, index) => {
      const webhook = webhookEndpoints.find(w => w.sourceModule === event.sourceModule);
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      return {
        id: `log_${index + 1}`,
        webhookId: webhook?.id || 'webhook_001',
        eventType: event.eventType,
        sourceModule: event.sourceModule,
        
        method: 'POST',
        url: webhook?.url || '',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': webhook?.authType === 'bearer' ? 'Bearer ***' : 'Basic ***',
          'X-VaNi-Signature': webhook?.authType === 'signature' ? 'sha256=***' : undefined,
          'User-Agent': 'VaNi-Webhook/2.1.0'
        },
        payload: {
          tenantId: event.tenantId,
          sourceModule: event.sourceModule,
          eventType: event.eventType,
          entityType: event.entityType,
          entityId: event.entityId,
          contactName: event.contactName,
          eventDate: event.eventDate,
          metadata: event.metadata
        },
        
        status: isSuccess ? 'success' : (Math.random() > 0.5 ? 'failed' : 'retrying'),
        statusCode: isSuccess ? 200 : (Math.random() > 0.5 ? 500 : 429),
        responseTime: Math.floor(Math.random() * 500) + 50,
        responseBody: isSuccess ? { eventId: event.id, status: 'processed' } : undefined,
        errorMessage: !isSuccess ? 'Internal server error: Database connection timeout' : undefined,
        
        attempts: !isSuccess ? Math.floor(Math.random() * 3) + 1 : 1,
        maxAttempts: webhook?.retryPolicy.maxRetries || 3,
        nextRetryAt: !isSuccess && Math.random() > 0.5 ? 
          new Date(Date.now() + 30000).toISOString() : undefined,
        
        businessEventId: event.id,
        entityType: event.entityType,
        entityId: event.entityId,
        customerName: event.contactName,
        
        timestamp: event.createdAt
      };
    });
  }, [webhookEndpoints, realisticBusinessEvents]);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const totalEndpoints = webhookEndpoints.length;
    const activeEndpoints = webhookEndpoints.filter(w => w.status === 'active').length;
    const healthyEndpoints = webhookEndpoints.filter(w => w.healthCheck.status === 'healthy').length;
    const totalEvents = webhookEndpoints.reduce((sum, w) => sum + w.metrics.totalEvents, 0);
    const successfulEvents = webhookEndpoints.reduce((sum, w) => sum + w.metrics.successfulEvents, 0);
    const failedEvents = webhookEndpoints.reduce((sum, w) => sum + w.metrics.failedEvents, 0);
    const avgUptime = webhookEndpoints.reduce((sum, w) => sum + w.metrics.uptime, 0) / totalEndpoints;
    
    return {
      totalEndpoints,
      activeEndpoints,
      healthyEndpoints,
      totalEvents,
      successfulEvents,
      failedEvents,
      successRate: totalEvents > 0 ? (successfulEvents / totalEvents) * 100 : 0,
      avgUptime
    };
  }, [webhookEndpoints]);

  // Filter logs and endpoints
  const filteredLogs = useMemo(() => {
    return webhookLogs.filter(log => {
      if (filters.status !== 'all' && log.status !== filters.status) return false;
      if (filters.module !== 'all' && log.sourceModule !== filters.module) return false;
      return true;
    });
  }, [webhookLogs, filters]);

  // Handlers
  const handleCreateWebhook = () => {
    setShowCreateForm(true);
  };

  const handleTestWebhook = async (webhook: WebhookEndpoint) => {
    toast.success(`Testing webhook: ${webhook.name}`, {
      style: { background: colors.semantic.info, color: '#FFF' }
    });
    
    // Simulate test
    setTimeout(() => {
      toast.success('Webhook test successful!', {
        style: { background: colors.semantic.success, color: '#FFF' }
      });
    }, 2000);
  };

  const handleWebhookAction = (action: string, webhook: WebhookEndpoint) => {
    toast.success(`${action} webhook: ${webhook.name}`, {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleViewLogs = (webhook: WebhookEndpoint) => {
    setSelectedWebhook(webhook);
    setActiveTab('logs');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get module icon
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'contracts': return <FileText className="w-4 h-4" />;
      case 'invoicing': return <DollarSign className="w-4 h-4" />;
      case 'services': return <Calendar className="w-4 h-4" />;
      case 'crm': return <Users className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy':
      case 'success':
        return colors.semantic.success;
      case 'error':
      case 'critical':
      case 'failed':
        return colors.semantic.error;
      case 'testing':
      case 'warning':
      case 'retrying':
        return colors.semantic.warning;
      case 'inactive':
      case 'pending':
        return colors.utility.secondaryText;
      default:
        return colors.utility.primaryText;
    }
  };

  // Metric cards data
  const metrics = [
    {
      value: overallMetrics.totalEndpoints.toString(),
      label: 'Webhook Endpoints',
      subtitle: `${overallMetrics.activeEndpoints} active`,
      icon: <Webhook className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 0,
        period: ''
      }
    },
    {
      value: `${overallMetrics.successRate.toFixed(1)}%`,
      label: 'Success Rate',
      subtitle: 'Event processing',
      icon: <CheckCircle className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 2.1,
        period: 'vs last week'
      }
    },
    {
      value: overallMetrics.totalEvents.toLocaleString(),
      label: 'Events Processed',
      subtitle: 'Total received',
      icon: <Activity className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 15.3,
        period: 'vs last week'
      }
    },
    {
      value: `${overallMetrics.avgUptime.toFixed(1)}%`,
      label: 'Average Uptime',
      subtitle: 'System reliability',
      icon: <Server className="w-5 h-5" />,
      trend: {
        direction: 'flat' as const,
        percentage: 0.2,
        period: 'vs last week'
      }
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.utility.primaryText }}>
            Webhook Management
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.utility.secondaryText }}>
            Monitor and manage business event integrations from external modules
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => console.log('Refresh webhooks')}
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
            onClick={handleCreateWebhook}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Webhook</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <VaNiMetricCard
            key={index}
            metric={metric}
            variant="business"
          />
        ))}
      </div>

      {/* Tabs */}
      <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
        <CardHeader className="pb-0">
          <div className="flex space-x-1">
            {[
              { id: 'endpoints', label: 'Endpoints', icon: Webhook },
              { id: 'logs', label: 'Event Logs', icon: Activity },
              { id: 'health', label: 'Health Monitoring', icon: Server },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive ? `${colors.brand.primary}15` : 'transparent',
                    color: isActive ? colors.brand.primary : colors.utility.secondaryText
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Endpoints Tab */}
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <VaNiListHeader
                title={`Webhook Endpoints (${webhookEndpoints.length})`}
                description="External module integrations for receiving business events"
              />
              
              <VaNiList variant="business" spacing="compact">
                {webhookEndpoints.map((webhook) => (
                  <VaNiListItem
                    key={webhook.id}
                    variant="business"
                    onClick={() => setSelectedWebhook(webhook)}
                    businessContext={{
                      priority: webhook.status === 'error' ? 9 : 5,
                      urgency: webhook.status === 'error' ? 'critical' : 'low',
                      entityType: webhook.sourceModule,
                      moduleSource: webhook.sourceModule,
                      hasActions: true
                    }}
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}15`
                    }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Module Icon */}
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${colors.brand.primary}20` }}
                      >
                        <div style={{ color: colors.brand.primary }}>
                          {getModuleIcon(webhook.sourceModule)}
                        </div>
                      </div>

                      {/* Webhook Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium" style={{ color: colors.utility.primaryText }}>
                            {webhook.name}
                          </h3>
                          <VaNiStatusBadge 
                            status={webhook.status as any} 
                            variant="channel" 
                            size="sm" 
                          />
                          <VaNiStatusBadge 
                            status={webhook.healthCheck.status as any} 
                            variant="health" 
                            size="sm" 
                          />
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm" style={{ color: colors.utility.secondaryText }}>
                          <span>{webhook.sourceSystem}</span>
                          <span>•</span>
                          <span>{webhook.events.length} event types</span>
                          <span>•</span>
                          <span>{webhook.metrics.totalEvents} events processed</span>
                          <span>•</span>
                          <span>{webhook.metrics.avgResponseTime}ms avg</span>
                        </div>

                        <div className="mt-1 text-xs" style={{ color: colors.utility.secondaryText }}>
                          {webhook.url}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="text-right">
                        <div 
                          className="text-lg font-bold"
                          style={{ 
                            color: webhook.metrics.uptime >= 99 
                              ? colors.semantic.success 
                              : webhook.metrics.uptime >= 95 
                                ? colors.semantic.warning 
                                : colors.semantic.error 
                          }}
                        >
                          {webhook.metrics.uptime.toFixed(1)}%
                        </div>
                        <div className="text-xs" style={{ color: colors.utility.secondaryText }}>
                          Uptime
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestWebhook(webhook);
                          }}
                          className="p-2 border rounded-lg transition-colors hover:opacity-80"
                          style={{
                            borderColor: `${colors.brand.primary}40`,
                            backgroundColor: `${colors.brand.primary}10`,
                            color: colors.brand.primary
                          }}
                          title="Test Webhook"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewLogs(webhook);
                          }}
                          className="p-2 border rounded-lg transition-colors hover:opacity-80"
                          style={{
                            borderColor: `${colors.utility.primaryText}20`,
                            backgroundColor: colors.utility.primaryBackground,
                            color: colors.utility.primaryText
                          }}
                          title="View Logs"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </VaNiListItem>
                ))}
              </VaNiList>
            </div>
          )}

          {/* Event Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <VaNiListHeader
                title={`Event Logs (${filteredLogs.length})`}
                description="Recent webhook event processing logs"
                actions={
                  <div className="flex items-center space-x-2">
                    {/* Status Filter */}
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="px-3 py-1.5 text-sm border rounded-md"
                      style={{
                        borderColor: `${colors.utility.primaryText}20`,
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="retrying">Retrying</option>
                      <option value="pending">Pending</option>
                    </select>
                    
                    {/* Module Filter */}
                    <select
                      value={filters.module}
                      onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                      className="px-3 py-1.5 text-sm border rounded-md"
                      style={{
                        borderColor: `${colors.utility.primaryText}20`,
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText
                      }}
                    >
                      <option value="all">All Modules</option>
                      <option value="contracts">Contracts</option>
                      <option value="invoicing">Invoicing</option>
                      <option value="services">Services</option>
                      <option value="crm">CRM</option>
                    </select>
                  </div>
                }
              />
              
              <VaNiList variant="business" spacing="compact">
                {filteredLogs.map((log) => (
                  <VaNiListItem
                    key={log.id}
                    variant="business"
                    clickable={false}
                    businessContext={{
                      priority: log.status === 'failed' ? 8 : 5,
                      urgency: log.status === 'failed' ? 'high' : 'low',
                      entityType: log.sourceModule,
                      moduleSource: log.sourceModule
                    }}
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}15`
                    }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Status Icon */}
                      <div 
                        className="p-2 rounded-lg"
                        style={{ 
                          backgroundColor: log.status === 'success' 
                            ? `${colors.semantic.success}20`
                            : log.status === 'failed'
                              ? `${colors.semantic.error}20`
                              : `${colors.semantic.warning}20`
                        }}
                      >
                        {log.status === 'success' ? (
                          <CheckCircle className="w-4 h-4" style={{ color: colors.semantic.success }} />
                        ) : log.status === 'failed' ? (
                          <XCircle className="w-4 h-4" style={{ color: colors.semantic.error }} />
                        ) : (
                          <Clock className="w-4 h-4" style={{ color: colors.semantic.warning }} />
                        )}
                      </div>

                      {/* Log Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-medium" style={{ color: colors.utility.primaryText }}>
                            {log.eventType.replace('_', ' ')}
                          </h4>
                          <VaNiStatusBadge status={log.status as any} size="sm" />
                          <span
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{
                              backgroundColor: `${colors.brand.secondary}20`,
                              color: colors.brand.secondary
                            }}
                          >
                            {log.sourceModule}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs" style={{ color: colors.utility.secondaryText }}>
                          <span>{log.customerName}</span>
                          <span>•</span>
                          <span>{log.entityType} {log.entityId}</span>
                          <span>•</span>
                          <span>{formatDate(log.timestamp)}</span>
                          {log.responseTime && (
                            <>
                              <span>•</span>
                              <span>{log.responseTime}ms</span>
                            </>
                          )}
                        </div>

                        {log.errorMessage && (
                          <div className="mt-1">
                            <p className="text-xs" style={{ color: colors.semantic.error }}>
                              {log.errorMessage}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Retry Info */}
                      {log.attempts > 1 && (
                        <div className="text-right">
                          <p className="text-sm font-medium" style={{ color: colors.utility.primaryText }}>
                            {log.attempts}/{log.maxAttempts}
                          </p>
                          <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                            Attempts
                          </p>
                        </div>
                      )}

                      {/* Status Code */}
                      {log.statusCode && (
                        <div className="text-right">
                          <p 
                            className="text-sm font-mono"
                            style={{ 
                              color: log.statusCode < 300 
                                ? colors.semantic.success 
                                : colors.semantic.error 
                            }}
                          >
                            {log.statusCode}
                          </p>
                          <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                            Status
                          </p>
                        </div>
                      )}
                    </div>
                  </VaNiListItem>
                ))}
              </VaNiList>
            </div>
          )}

          {/* Health Monitoring Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webhookEndpoints.map((webhook) => (
                  <Card
                    key={webhook.id}
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: webhook.healthCheck.status === 'healthy' 
                        ? `${colors.semantic.success}40`
                        : webhook.healthCheck.status === 'critical'
                          ? `${colors.semantic.error}40`
                          : `${colors.semantic.warning}40`
                    }}
                  >
                    <CardHeader>
                      <CardTitle 
                        className="flex items-center space-x-2"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {getModuleIcon(webhook.sourceModule)}
                        <span>{webhook.sourceModule}</span>
                        <VaNiStatusBadge 
                          status={webhook.healthCheck.status as any} 
                          variant="health" 
                          size="sm" 
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Uptime:</span>
                          <span style={{ color: colors.utility.primaryText }}>
                            {webhook.metrics.uptime.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Response Time:</span>
                          <span style={{ color: colors.utility.primaryText }}>
                            {webhook.healthCheck.responseTime}ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Success Rate:</span>
                          <span style={{ color: colors.utility.primaryText }}>
                            {((webhook.metrics.successfulEvents / webhook.metrics.totalEvents) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Last Check:</span>
                          <span style={{ color: colors.utility.primaryText }}>
                            {formatDate(webhook.healthCheck.lastCheck)}
                          </span>
                        </div>
                        
                        {webhook.healthCheck.errorMessage && (
                          <div 
                            className="p-2 rounded text-xs"
                            style={{
                              backgroundColor: `${colors.semantic.error}10`,
                              color: colors.semantic.error
                            }}
                          >
                            {webhook.healthCheck.errorMessage}
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleTestWebhook(webhook)}
                          className="w-full flex items-center justify-center space-x-2 p-2 border rounded-lg transition-colors hover:opacity-80"
                          style={{
                            borderColor: `${colors.brand.primary}40`,
                            backgroundColor: `${colors.brand.primary}10`,
                            color: colors.brand.primary
                          }}
                        >
                          <Play className="w-3 h-3" />
                          <span>Test Now</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.utility.primaryText }}>
                  Webhook Configuration
                </h3>
                <p style={{ color: colors.utility.secondaryText }}>
                  Global settings for webhook processing and security.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.utility.primaryText }}>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span style={{ color: colors.utility.primaryText }}>Require Authentication</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: colors.utility.primaryText }}>Verify Signatures</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: colors.utility.primaryText }}>Rate Limiting</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.utility.primaryText }}>Processing Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2" style={{ color: colors.utility.primaryText }}>
                        Default Retry Attempts
                      </label>
                      <input 
                        type="number" 
                        defaultValue={3} 
                        className="w-full p-2 border rounded-lg"
                        style={{
                          borderColor: `${colors.utility.primaryText}20`,
                          backgroundColor: colors.utility.secondaryBackground,
                          color: colors.utility.primaryText
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2" style={{ color: colors.utility.primaryText }}>
                        Timeout (seconds)
                      </label>
                      <input 
                        type="number" 
                        defaultValue={30} 
                        className="w-full p-2 border rounded-lg"
                        style={{
                          borderColor: `${colors.utility.primaryText}20`,
                          backgroundColor: colors.utility.secondaryBackground,
                          color: colors.utility.primaryText
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookManagementPage;