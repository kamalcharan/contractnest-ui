// src/vani/pages/ProcessRulesPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  VaNiList, 
  VaNiListItem, 
  VaNiListHeader,
  VaNiStatusBadge,
  VaNiMetricCard 
} from '../components/shared';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { 
  Plus, 
  Search, 
  Filter, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Calendar,
  DollarSign,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  MessageSquare,
  Mail,
  Smartphone,
  Bell,
  ArrowRight,
  Database,
  Workflow,
  Target,
  BarChart3,
  Code,
  GitBranch,
  Timer,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProcessRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: number;
  
  // Rule Matching Criteria
  sourceModule: 'contracts' | 'invoicing' | 'services' | 'crm' | 'support' | 'any';
  eventType: string; // 'service_due', 'payment_due', etc. or 'any'
  entityType: 'contract' | 'invoice' | 'service' | 'customer' | 'ticket' | 'any';
  
  // Conditions
  conditions: {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
    value: any;
  }[];
  
  // Actions/Jobs to Generate
  actions: {
    id: string;
    type: 'reminder' | 'followup' | 'escalation' | 'confirmation' | 'survey';
    name: string;
    channels: ('sms' | 'email' | 'whatsapp' | 'push' | 'widget')[];
    templateId: string;
    delay: number; // minutes
    conditions?: any;
  }[];
  
  // Scheduling
  reminderSchedule: {
    beforeDays: number[];
    onDay: boolean;
    afterDays: number[];
  };
  
  // Communication Rules
  communicationRules: {
    channels: string[];
    templates: Record<string, string>; // channel -> templateId
    escalationRules?: {
      noResponseDays: number;
      escalateTo: string[];
      escalationTemplate: string;
    };
  };
  
  // Statistics
  stats: {
    totalTriggered: number;
    successfulExecutions: number;
    lastTriggered?: string;
    avgExecutionTime: number; // minutes
    costPerExecution: number;
  };
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock data for process rules
const mockProcessRules: ProcessRule[] = [
  {
    id: 'rule_001',
    name: 'HVAC Service Reminder Automation',
    description: 'Automatically send service reminders for HVAC maintenance contracts',
    isActive: true,
    priority: 8,
    
    sourceModule: 'contracts',
    eventType: 'service_due',
    entityType: 'contract',
    
    conditions: [
      { field: 'metadata.serviceType', operator: 'contains', value: 'HVAC' },
      { field: 'priority', operator: 'greater_than', value: 5 }
    ],
    
    actions: [
      {
        id: 'action_001',
        type: 'reminder',
        name: '7-Day Reminder',
        channels: ['email'],
        templateId: 'service_reminder_hvac',
        delay: 0
      },
      {
        id: 'action_002',
        type: 'reminder',
        name: '3-Day SMS Reminder',
        channels: ['sms'],
        templateId: 'service_reminder_sms',
        delay: 4320 // 3 days later
      },
      {
        id: 'action_003',
        type: 'confirmation',
        name: 'Day Before Confirmation',
        channels: ['whatsapp'],
        templateId: 'service_confirmation_whatsapp',
        delay: 8640 // 6 days later (1 day before)
      }
    ],
    
    reminderSchedule: {
      beforeDays: [7, 3, 1],
      onDay: true,
      afterDays: []
    },
    
    communicationRules: {
      channels: ['email', 'sms', 'whatsapp'],
      templates: {
        email: 'service_reminder_hvac',
        sms: 'service_reminder_sms',
        whatsapp: 'service_confirmation_whatsapp'
      },
      escalationRules: {
        noResponseDays: 2,
        escalateTo: ['manager@client.com'],
        escalationTemplate: 'service_escalation'
      }
    },
    
    stats: {
      totalTriggered: 142,
      successfulExecutions: 138,
      lastTriggered: '2025-08-15T09:00:00Z',
      avgExecutionTime: 12,
      costPerExecution: 2.75
    },
    
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-08-01T14:30:00Z',
    createdBy: 'System Admin'
  },
  {
    id: 'rule_002',
    name: 'Payment Due Notifications',
    description: 'Automated payment reminders with escalation for overdue accounts',
    isActive: true,
    priority: 9,
    
    sourceModule: 'invoicing',
    eventType: 'payment_due',
    entityType: 'invoice',
    
    conditions: [
      { field: 'metadata.amount', operator: 'greater_than', value: 1000 }
    ],
    
    actions: [
      {
        id: 'action_004',
        type: 'reminder',
        name: '10-Day Email Reminder',
        channels: ['email'],
        templateId: 'payment_reminder_email',
        delay: 0
      },
      {
        id: 'action_005',
        type: 'reminder',
        name: '5-Day SMS Reminder',
        channels: ['sms'],
        templateId: 'payment_reminder_sms',
        delay: 7200 // 5 days later
      },
      {
        id: 'action_006',
        type: 'escalation',
        name: 'Overdue Escalation',
        channels: ['email'],
        templateId: 'payment_overdue_escalation',
        delay: 14400 // 10 days later (overdue)
      }
    ],
    
    reminderSchedule: {
      beforeDays: [10, 5, 1],
      onDay: false,
      afterDays: [1, 7] // Overdue follow-ups
    },
    
    communicationRules: {
      channels: ['email', 'sms'],
      templates: {
        email: 'payment_reminder_email',
        sms: 'payment_reminder_sms'
      },
      escalationRules: {
        noResponseDays: 1,
        escalateTo: ['collections@company.com'],
        escalationTemplate: 'payment_overdue_escalation'
      }
    },
    
    stats: {
      totalTriggered: 89,
      successfulExecutions: 85,
      lastTriggered: '2025-08-14T16:00:00Z',
      avgExecutionTime: 8,
      costPerExecution: 1.50
    },
    
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-08-10T11:15:00Z',
    createdBy: 'Finance Manager'
  },
  {
    id: 'rule_003',
    name: 'Emergency Service Response',
    description: 'Immediate notifications for emergency service requests',
    isActive: true,
    priority: 10,
    
    sourceModule: 'services',
    eventType: 'emergency_service',
    entityType: 'service',
    
    conditions: [
      { field: 'priority', operator: 'equals', value: 10 }
    ],
    
    actions: [
      {
        id: 'action_007',
        type: 'confirmation',
        name: 'Immediate SMS Alert',
        channels: ['sms'],
        templateId: 'emergency_service_alert',
        delay: 0
      },
      {
        id: 'action_008',
        type: 'followup',
        name: 'Completion Notification',
        channels: ['email', 'sms'],
        templateId: 'emergency_service_completion',
        delay: 240 // 4 hours later
      }
    ],
    
    reminderSchedule: {
      beforeDays: [],
      onDay: true,
      afterDays: []
    },
    
    communicationRules: {
      channels: ['sms', 'email'],
      templates: {
        sms: 'emergency_service_alert',
        email: 'emergency_service_completion'
      }
    },
    
    stats: {
      totalTriggered: 23,
      successfulExecutions: 23,
      lastTriggered: '2025-08-16T16:30:00Z',
      avgExecutionTime: 3,
      costPerExecution: 1.25
    },
    
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-08-16T17:00:00Z',
    createdBy: 'Operations Manager'
  },
  {
    id: 'rule_004',
    name: 'Contract Renewal Campaign',
    description: 'Multi-stage contract renewal reminders and follow-ups',
    isActive: false, // Disabled for demo
    priority: 6,
    
    sourceModule: 'contracts',
    eventType: 'contract_renewal',
    entityType: 'contract',
    
    conditions: [
      { field: 'metadata.currentRate', operator: 'greater_than', value: 10000 }
    ],
    
    actions: [
      {
        id: 'action_009',
        type: 'reminder',
        name: '90-Day Renewal Notice',
        channels: ['email'],
        templateId: 'contract_renewal_90day',
        delay: 0
      }
    ],
    
    reminderSchedule: {
      beforeDays: [90, 60, 30, 15],
      onDay: false,
      afterDays: []
    },
    
    communicationRules: {
      channels: ['email'],
      templates: {
        email: 'contract_renewal_90day'
      }
    },
    
    stats: {
      totalTriggered: 12,
      successfulExecutions: 11,
      lastTriggered: '2025-07-01T10:00:00Z',
      avgExecutionTime: 15,
      costPerExecution: 0.75
    },
    
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-07-15T09:30:00Z',
    createdBy: 'Sales Manager'
  }
];

const ProcessRulesPage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ProcessRule | null>(null);
  const [showRuleDetails, setShowRuleDetails] = useState(false);

  // Filter rules
  const filteredRules = useMemo(() => {
    return mockProcessRules.filter(rule => {
      // Text search
      if (searchTerm && !rule.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !rule.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Module filter
      if (selectedModule !== 'all' && rule.sourceModule !== selectedModule) {
        return false;
      }
      
      // Status filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'active' && !rule.isActive) return false;
        if (selectedStatus === 'inactive' && rule.isActive) return false;
      }
      
      return true;
    });
  }, [searchTerm, selectedModule, selectedStatus]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRules = mockProcessRules.length;
    const activeRules = mockProcessRules.filter(r => r.isActive).length;
    const totalTriggered = mockProcessRules.reduce((sum, r) => sum + r.stats.totalTriggered, 0);
    const successfulExecutions = mockProcessRules.reduce((sum, r) => sum + r.stats.successfulExecutions, 0);
    const totalCost = mockProcessRules.reduce((sum, r) => sum + (r.stats.totalTriggered * r.stats.costPerExecution), 0);
    const successRate = totalTriggered > 0 ? (successfulExecutions / totalTriggered) * 100 : 0;

    return {
      totalRules,
      activeRules,
      totalTriggered,
      successfulExecutions,
      totalCost,
      successRate
    };
  }, []);

  // Handlers
  const handleCreateRule = () => {
    setShowCreateModal(true);
  };

  const handleEditRule = (rule: ProcessRule) => {
    navigate(`/vani/rules/${rule.id}/edit`);
  };

  const handleViewRule = (rule: ProcessRule) => {
    setSelectedRule(rule);
    setShowRuleDetails(true);
  };

  const handleToggleRule = (rule: ProcessRule) => {
    toast.success(`Rule ${rule.isActive ? 'disabled' : 'enabled'}`, {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleDuplicateRule = (rule: ProcessRule) => {
    toast.success('Rule duplicated successfully', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleDeleteRule = (rule: ProcessRule) => {
    if (confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      toast.success('Rule deleted successfully', {
        style: { background: colors.semantic.success, color: '#FFF' }
      });
    }
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

  // Get module icon
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'contracts': return <FileText className="w-4 h-4" />;
      case 'invoicing': return <DollarSign className="w-4 h-4" />;
      case 'services': return <Calendar className="w-4 h-4" />;
      case 'crm': return <Users className="w-4 h-4" />;
      case 'support': return <MessageSquare className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  // Get action type icon
  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Bell className="w-3 h-3" />;
      case 'followup': return <ArrowRight className="w-3 h-3" />;
      case 'escalation': return <AlertCircle className="w-3 h-3" />;
      case 'confirmation': return <CheckCircle className="w-3 h-3" />;
      case 'survey': return <BarChart3 className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  // Metric cards data
  const metricCards = [
    {
      value: metrics.totalRules.toString(),
      label: 'Total Rules',
      subtitle: `${metrics.activeRules} active`,
      icon: <Workflow className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 12.5,
        period: 'vs last month'
      }
    },
    {
      value: `${metrics.successRate.toFixed(1)}%`,
      label: 'Success Rate',
      subtitle: 'Overall execution',
      icon: <Target className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 3.2,
        period: 'vs last month'
      }
    },
    {
      value: metrics.totalTriggered.toString(),
      label: 'Total Executions',
      subtitle: 'All time',
      icon: <Zap className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 28.4,
        period: 'vs last month'
      }
    },
    {
      value: `₹${metrics.totalCost.toFixed(0)}`,
      label: 'Total Cost',
      subtitle: 'Communication costs',
      icon: <DollarSign className="w-5 h-5" />,
      cost: `₹${(metrics.totalCost / metrics.totalTriggered).toFixed(2)} avg per execution`
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Process Rules
          </h1>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Configure event-driven automation rules for business process communications
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/vani/analytics/rules')}
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
            onClick={handleCreateRule}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <VaNiMetricCard
            key={index}
            metric={metric}
            variant="business"
            onClick={index === 1 ? () => navigate('/vani/analytics/rules') : undefined}
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
                placeholder="Search rules by name or description..."
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

            {/* Module Filter */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              <option value="all">All Modules</option>
              <option value="contracts">Contracts</option>
              <option value="invoicing">Invoicing</option>
              <option value="services">Services</option>
              <option value="crm">CRM</option>
              <option value="support">Support</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <Card
        className="transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <VaNiListHeader
          title={`Process Rules (${filteredRules.length})`}
          description="Event-driven automation rules for business communications"
          showMetrics={true}
          metrics={{
            total: metrics.totalRules,
            pending: metrics.totalRules - metrics.activeRules,
            completed: metrics.activeRules
          }}
        />

        <CardContent className="p-0">
          {filteredRules.length === 0 ? (
            <div className="p-8 text-center">
              <Workflow className="w-12 h-12 mx-auto mb-4" style={{ color: colors.utility.secondaryText }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.utility.primaryText }}>
                No Rules Found
              </h3>
              <p className="mb-4" style={{ color: colors.utility.secondaryText }}>
                {searchTerm || selectedModule !== 'all' || selectedStatus !== 'all'
                  ? 'No rules match your search criteria.'
                  : 'Create your first process rule to automate business communications.'
                }
              </p>
              {!searchTerm && selectedModule === 'all' && selectedStatus === 'all' && (
                <button
                  onClick={handleCreateRule}
                  className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                  }}
                >
                  Create Your First Rule
                </button>
              )}
            </div>
          ) : (
            <VaNiList variant="business" spacing="compact" className="p-4">
              {filteredRules.map((rule) => (
                <VaNiListItem
                  key={rule.id}
                  variant="business"
                  onClick={() => handleViewRule(rule)}
                  businessContext={{
                    priority: rule.priority,
                    urgency: rule.priority >= 9 ? 'critical' : rule.priority >= 7 ? 'high' : 'medium',
                    entityType: rule.sourceModule,
                    hasActions: true
                  }}
                  style={{
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: `${colors.utility.primaryText}15`,
                    opacity: rule.isActive ? 1 : 0.7
                  }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Module Icon */}
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${colors.brand.primary}20` }}
                    >
                      <div style={{ color: colors.brand.primary }}>
                        {getModuleIcon(rule.sourceModule)}
                      </div>
                    </div>

                    {/* Rule Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 
                          className="font-medium truncate"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {rule.name}
                        </h3>
                        <VaNiStatusBadge 
                          status={rule.isActive ? 'active' : 'inactive'} 
                          variant="channel" 
                          size="sm" 
                        />
                        <span
                          className="px-2 py-0.5 text-xs rounded-full capitalize"
                          style={{
                            backgroundColor: `${colors.semantic.info}20`,
                            color: colors.semantic.info
                          }}
                        >
                          {rule.sourceModule}
                        </span>
                      </div>
                      
                      <p 
                        className="text-sm truncate mb-2"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {rule.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs" style={{ color: colors.utility.secondaryText }}>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>{rule.stats.totalTriggered} executions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>{((rule.stats.successfulExecutions / rule.stats.totalTriggered) * 100).toFixed(1)}% success</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>₹{rule.stats.costPerExecution.toFixed(2)} avg cost</span>
                        </div>
                        {rule.stats.lastTriggered && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Last: {formatDate(rule.stats.lastTriggered)}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions Preview */}
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs" style={{ color: colors.utility.secondaryText }}>
                          Actions:
                        </span>
                        {rule.actions.slice(0, 3).map((action, index) => (
                          <div
                            key={action.id}
                            className="flex items-center space-x-1 px-2 py-0.5 rounded text-xs"
                            style={{
                              backgroundColor: `${colors.brand.secondary}15`,
                              color: colors.brand.secondary
                            }}
                          >
                            {getActionTypeIcon(action.type)}
                            <span>{action.type}</span>
                          </div>
                        ))}
                        {rule.actions.length > 3 && (
                          <span className="text-xs" style={{ color: colors.utility.secondaryText }}>
                            +{rule.actions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRule(rule);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: rule.isActive ? colors.semantic.warning : colors.semantic.success }}
                        title={rule.isActive ? 'Disable Rule' : 'Enable Rule'}
                      >
                        {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRule(rule);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.utility.secondaryText }}
                        title="Edit Rule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateRule(rule);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.utility.secondaryText }}
                        title="Duplicate Rule"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRule(rule);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.semantic.error }}
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </VaNiListItem>
              ))}
            </VaNiList>
          )}
        </CardContent>
      </Card>

      {/* Rule Details Modal */}
      {showRuleDetails && selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
            style={{ backgroundColor: colors.utility.secondaryBackground }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.utility.primaryText }}>
                    {selectedRule.name}
                  </h2>
                  <p style={{ color: colors.utility.secondaryText }}>
                    {selectedRule.description}
                  </p>
                </div>
                <button
                  onClick={() => setShowRuleDetails(false)}
                  className="p-2 hover:opacity-80"
                  style={{ color: colors.utility.secondaryText }}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rule Configuration */}
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.utility.primaryText }}>Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Source Module:</span>
                        <span style={{ color: colors.utility.primaryText }}>{selectedRule.sourceModule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Event Type:</span>
                        <span style={{ color: colors.utility.primaryText }}>{selectedRule.eventType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Entity Type:</span>
                        <span style={{ color: colors.utility.primaryText }}>{selectedRule.entityType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Priority:</span>
                        <span style={{ color: colors.utility.primaryText }}>{selectedRule.priority}/10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.utility.primaryText }}>Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Total Executions:</span>
                        <span style={{ color: colors.utility.primaryText }}>{selectedRule.stats.totalTriggered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Success Rate:</span>
                        <span style={{ color: colors.semantic.success }}>
                          {((selectedRule.stats.successfulExecutions / selectedRule.stats.totalTriggered) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Avg Execution Time:</span>
                        <span style={{ color: colors.utility.primaryText }}>{selectedRule.stats.avgExecutionTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Cost per Execution:</span>
                        <span style={{ color: colors.utility.primaryText }}>₹{selectedRule.stats.costPerExecution}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.utility.primaryText }}>
                  Automated Actions ({selectedRule.actions.length})
                </h3>
                <div className="space-y-3">
                  {selectedRule.actions.map((action) => (
                    <div
                      key={action.id}
                      className="p-4 border rounded-lg"
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        borderColor: `${colors.utility.primaryText}20`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div style={{ color: colors.brand.primary }}>
                            {getActionTypeIcon(action.type)}
                          </div>
                          <div>
                            <h4 className="font-medium" style={{ color: colors.utility.primaryText }}>
                              {action.name}
                            </h4>
                            <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                              {action.type} • {action.channels.join(', ')} • {action.delay > 0 ? `${Math.floor(action.delay / 1440)} days delay` : 'Immediate'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowRuleDetails(false)}
                  className="px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditRule(selectedRule)}
                  className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                  }}
                >
                  Edit Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessRulesPage;