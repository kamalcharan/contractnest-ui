// src/vani/pages/ChannelsConfigPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  VaNiStatusBadge,
  VaNiList,
  VaNiListItem,
  VaNiListHeader
} from '../components/shared';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { 
  realisticBusinessEvents,
  businessContextTemplates
} from '../utils/fakeData';
import { 
  Smartphone,
  Mail,
  MessageSquare,
  Bell,
  Monitor,
  Settings,
  Plus,
  Edit,
  Trash2,
  TestTube,
  Save,
  X,
  Check,
  AlertCircle,
  Key,
  Globe,
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
  Eye,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ChannelProvider {
  id: string;
  name: string;
  type: 'sms' | 'email' | 'whatsapp' | 'push' | 'widget';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'configuring' | 'testing';
  
  // Configuration
  config: {
    apiKey?: string;
    apiSecret?: string;
    senderId?: string;
    webhookUrl?: string;
    baseUrl?: string;
    accountSid?: string;
    phoneNumber?: string;
    businessAccountId?: string;
    appId?: string;
    [key: string]: any;
  };
  
  // Usage and metrics
  usage: {
    dailyLimit: number;
    monthlyLimit: number;
    dailyUsed: number;
    monthlyUsed: number;
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    successRate: number;
    avgCost: number;
    lastUsed?: string;
  };
  
  // Business context
  businessRules: {
    allowedEventTypes: string[];
    maxRecipientsPerJob: number;
    cooldownMinutes: number;
    priorityThreshold: number;
  };
  
  createdAt: string;
  updatedAt: string;
}

interface ChannelTemplate {
  id: string;
  name: string;
  channelType: 'sms' | 'email' | 'whatsapp' | 'push' | 'widget';
  eventType: string;
  subject?: string;
  content: string;
  variables: string[];
  businessContext: {
    contractTypes: string[];
    customerSegments: string[];
    urgencyLevels: string[];
  };
  usage: {
    jobsUsed: number;
    successRate: number;
    lastUsed?: string;
  };
  isActive: boolean;
  createdAt: string;
}

const ChannelsConfigPage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<'providers' | 'templates' | 'testing' | 'analytics'>('providers');
  const [selectedProvider, setSelectedProvider] = useState<ChannelProvider | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChannelTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [testingChannel, setTestingChannel] = useState<string>('');

  // Mock channel providers data
  const channelProviders: ChannelProvider[] = [
    {
      id: 'twilio_sms',
      name: 'Twilio SMS',
      type: 'sms',
      provider: 'Twilio',
      status: 'active',
      config: {
        accountSid: 'AC****************************',
        apiKey: 'SK****************************',
        apiSecret: '********************************',
        phoneNumber: '+12345678901',
        webhookUrl: 'https://api.contractnest.com/webhooks/twilio'
      },
      usage: {
        dailyLimit: 10000,
        monthlyLimit: 250000,
        dailyUsed: 1247,
        monthlyUsed: 23456,
        totalSent: 145678,
        totalDelivered: 142345,
        totalFailed: 3333,
        successRate: 97.7,
        avgCost: 0.75,
        lastUsed: '2025-08-15T14:30:00Z'
      },
      businessRules: {
        allowedEventTypes: ['service_due', 'payment_due', 'emergency_service'],
        maxRecipientsPerJob: 1000,
        cooldownMinutes: 5,
        priorityThreshold: 7
      },
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2025-08-15T14:30:00Z'
    },
    {
      id: 'sendgrid_email',
      name: 'SendGrid Email',
      type: 'email',
      provider: 'SendGrid',
      status: 'active',
      config: {
        apiKey: 'SG.****************************',
        senderId: 'noreply@contractnest.com',
        baseUrl: 'https://api.sendgrid.com/v3',
        webhookUrl: 'https://api.contractnest.com/webhooks/sendgrid'
      },
      usage: {
        dailyLimit: 50000,
        monthlyLimit: 1000000,
        dailyUsed: 3456,
        monthlyUsed: 67890,
        totalSent: 567890,
        totalDelivered: 555432,
        totalFailed: 12458,
        successRate: 97.8,
        avgCost: 0.25,
        lastUsed: '2025-08-15T15:15:00Z'
      },
      businessRules: {
        allowedEventTypes: ['service_due', 'payment_due', 'contract_renewal', 'emergency_service'],
        maxRecipientsPerJob: 5000,
        cooldownMinutes: 1,
        priorityThreshold: 5
      },
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2025-08-15T15:15:00Z'
    },
    {
      id: 'whatsapp_business',
      name: 'WhatsApp Business',
      type: 'whatsapp',
      provider: 'Meta',
      status: 'configuring',
      config: {
        businessAccountId: 'WABA**********************',
        phoneNumber: '+919876543210',
        apiKey: 'EAAG****************************',
        webhookUrl: 'https://api.contractnest.com/webhooks/whatsapp',
        verifyToken: 'contractnest_webhook_verify'
      },
      usage: {
        dailyLimit: 1000,
        monthlyLimit: 10000,
        dailyUsed: 45,
        monthlyUsed: 1234,
        totalSent: 5678,
        totalDelivered: 5234,
        totalFailed: 444,
        successRate: 92.2,
        avgCost: 0.50,
        lastUsed: '2025-08-15T12:00:00Z'
      },
      businessRules: {
        allowedEventTypes: ['service_due', 'emergency_service'],
        maxRecipientsPerJob: 100,
        cooldownMinutes: 15,
        priorityThreshold: 8
      },
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-08-15T12:00:00Z'
    },
    {
      id: 'firebase_push',
      name: 'Firebase Push Notifications',
      type: 'push',
      provider: 'Google Firebase',
      status: 'active',
      config: {
        projectId: 'contractnest-app',
        privateKey: '-----BEGIN PRIVATE KEY-----\n****\n-----END PRIVATE KEY-----',
        clientEmail: 'firebase-adminsdk@contractnest-app.iam.gserviceaccount.com',
        serviceAccountKeyFile: 'firebase-service-account.json'
      },
      usage: {
        dailyLimit: 100000,
        monthlyLimit: 2000000,
        dailyUsed: 2345,
        monthlyUsed: 45678,
        totalSent: 234567,
        totalDelivered: 198765,
        totalFailed: 35802,
        successRate: 84.7,
        avgCost: 0.10,
        lastUsed: '2025-08-15T16:00:00Z'
      },
      businessRules: {
        allowedEventTypes: ['service_due', 'payment_due', 'emergency_service'],
        maxRecipientsPerJob: 10000,
        cooldownMinutes: 0,
        priorityThreshold: 6
      },
      createdAt: '2024-12-15T10:00:00Z',
      updatedAt: '2025-08-15T16:00:00Z'
    }
  ];

  // Mock channel templates
  const channelTemplates: ChannelTemplate[] = [
    {
      id: 'sms_service_reminder',
      name: 'SMS Service Reminder',
      channelType: 'sms',
      eventType: 'service_due',
      content: 'Service reminder: {{serviceDate}} at {{serviceTime}}. Technician: {{technician}}. Service {{serviceNumber}}/{{totalServices}}. Contract: {{contractId}}',
      variables: ['serviceDate', 'serviceTime', 'technician', 'serviceNumber', 'totalServices', 'contractId'],
      businessContext: {
        contractTypes: ['hvac_maintenance', 'security_system', 'cleaning_service'],
        customerSegments: ['enterprise', 'sme', 'residential'],
        urgencyLevels: ['low', 'medium', 'high']
      },
      usage: {
        jobsUsed: 456,
        successRate: 97.8,
        lastUsed: '2025-08-15T14:30:00Z'
      },
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: 'email_service_reminder',
      name: 'Email Service Reminder',
      channelType: 'email',
      eventType: 'service_due',
      subject: '{{serviceType}} Scheduled - Service #{{serviceNumber}} of {{totalServices}}',
      content: `<p>Dear {{customerName}},</p>

<p>Your {{serviceType}} is scheduled for <strong>{{serviceDate}}</strong> at <strong>{{serviceTime}}</strong>.</p>

<h3>Service Details:</h3>
<ul>
<li>Service Number: {{serviceNumber}} of {{totalServices}}</li>
<li>Technician: {{technician}}</li>
<li>Estimated Duration: {{estimatedDuration}}</li>
<li>Contract: {{contractId}}</li>
</ul>

<p>Please ensure access to the service area. Contact us if you need to reschedule.</p>

<p>Best regards,<br>Service Team</p>`,
      variables: ['customerName', 'serviceType', 'serviceDate', 'serviceTime', 'serviceNumber', 'totalServices', 'technician', 'estimatedDuration', 'contractId'],
      businessContext: {
        contractTypes: ['hvac_maintenance', 'security_system', 'it_support'],
        customerSegments: ['enterprise', 'sme'],
        urgencyLevels: ['low', 'medium', 'high']
      },
      usage: {
        jobsUsed: 789,
        successRate: 98.5,
        lastUsed: '2025-08-15T15:15:00Z'
      },
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: 'whatsapp_payment_reminder',
      name: 'WhatsApp Payment Reminder',
      channelType: 'whatsapp',
      eventType: 'payment_due',
      content: `💰 *Payment Reminder*

💳 *Amount:* ₹{{amount}}
📅 *Due Date:* {{dueDate}}
📄 *Contract:* {{contractId}}

Please process payment to avoid service interruption. Pay online or contact us.

Reply *PAY* for payment link or *HELP* for assistance.`,
      variables: ['amount', 'dueDate', 'contractId'],
      businessContext: {
        contractTypes: ['hvac_maintenance', 'security_system', 'cleaning_service', 'it_support'],
        customerSegments: ['sme', 'residential'],
        urgencyLevels: ['medium', 'high']
      },
      usage: {
        jobsUsed: 234,
        successRate: 94.2,
        lastUsed: '2025-08-15T12:00:00Z'
      },
      isActive: true,
      createdAt: '2025-01-15T10:00:00Z'
    }
  ];

  // Filter providers by type
  const providersByType = useMemo(() => {
    return channelProviders.reduce((acc, provider) => {
      if (!acc[provider.type]) acc[provider.type] = [];
      acc[provider.type].push(provider);
      return acc;
    }, {} as Record<string, ChannelProvider[]>);
  }, []);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const totalSent = channelProviders.reduce((sum, p) => sum + p.usage.totalSent, 0);
    const totalDelivered = channelProviders.reduce((sum, p) => sum + p.usage.totalDelivered, 0);
    const totalFailed = channelProviders.reduce((sum, p) => sum + p.usage.totalFailed, 0);
    const totalCost = channelProviders.reduce((sum, p) => sum + (p.usage.totalSent * p.usage.avgCost), 0);
    
    return {
      totalSent,
      totalDelivered,
      totalFailed,
      successRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
      totalCost,
      activeProviders: channelProviders.filter(p => p.status === 'active').length,
      totalProviders: channelProviders.length
    };
  }, []);

  // Channel icons
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'sms': return <Smartphone className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'whatsapp': return <MessageSquare className="w-5 h-5" />;
      case 'push': return <Bell className="w-5 h-5" />;
      case 'widget': return <Monitor className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
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

  // Handlers
  const handleTestChannel = async (providerId: string) => {
    setTestingChannel(providerId);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTestingChannel('');
    toast.success('Channel test completed successfully!', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleSaveProvider = () => {
    toast.success('Provider configuration saved!', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
    setIsEditing(false);
  };

  const handleSaveTemplate = () => {
    toast.success('Template saved successfully!', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
    setIsEditing(false);
  };

  const handleTemplateContentChange = (content: string) => {
    if (selectedTemplate) {
      setSelectedTemplate({
        ...selectedTemplate,
        content
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.utility.primaryText }}>
            Channel Configuration
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.utility.secondaryText }}>
            Configure SMS, Email, WhatsApp providers and manage communication templates
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/vani/analytics')}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>View Analytics</span>
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Provider</span>
          </button>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Active Providers', value: `${overallMetrics.activeProviders}/${overallMetrics.totalProviders}`, icon: Zap, color: colors.semantic.success },
          { label: 'Messages Sent', value: overallMetrics.totalSent.toLocaleString(), icon: Activity, color: colors.brand.primary },
          { label: 'Success Rate', value: `${overallMetrics.successRate.toFixed(1)}%`, icon: Check, color: colors.semantic.success },
          { label: 'Failed Messages', value: overallMetrics.totalFailed.toLocaleString(), icon: AlertCircle, color: colors.semantic.error },
          { label: 'Total Cost', value: `₹${(overallMetrics.totalCost / 1000).toFixed(0)}K`, icon: DollarSign, color: colors.semantic.warning }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="p-4"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6" style={{ color: metric.color }} />
                <div>
                  <p className="text-xl font-bold" style={{ color: colors.utility.primaryText }}>
                    {metric.value}
                  </p>
                  <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                    {metric.label}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
        <CardHeader className="pb-0">
          <div className="flex space-x-1">
            {[
              { id: 'providers', label: 'Providers', icon: Settings },
              { id: 'templates', label: 'Templates', icon: Edit },
              { id: 'testing', label: 'Testing', icon: TestTube },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div className="space-y-6">
              {Object.entries(providersByType).map(([type, providers]) => (
                <div key={type}>
                  <h3 
                    className="text-lg font-semibold mb-4 flex items-center space-x-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {getChannelIcon(type)}
                    <span className="capitalize">{type} Providers</span>
                  </h3>
                  
                  <VaNiList variant="business" spacing="normal">
                    {providers.map((provider) => (
                      <VaNiListItem
                        key={provider.id}
                        variant="business"
                        onClick={() => setSelectedProvider(provider)}
                        businessContext={{
                          priority: provider.status === 'error' ? 8 : 5,
                          urgency: provider.status === 'error' ? 'high' : 'low',
                          hasActions: true
                        }}
                        style={{
                          backgroundColor: selectedProvider?.id === provider.id 
                            ? `${colors.brand.primary}10` 
                            : colors.utility.primaryBackground,
                          borderColor: `${colors.utility.primaryText}15`
                        }}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Provider Icon */}
                          <div 
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${colors.brand.primary}20` }}
                          >
                            <div style={{ color: colors.brand.primary }}>
                              {getChannelIcon(provider.type)}
                            </div>
                          </div>

                          {/* Provider Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 
                                className="font-medium"
                                style={{ color: colors.utility.primaryText }}
                              >
                                {provider.name}
                              </h4>
                              <VaNiStatusBadge status={provider.status as any} variant="channel" size="sm" />
                              <span
                                className="px-2 py-0.5 text-xs rounded-full"
                                style={{
                                  backgroundColor: `${colors.brand.secondary}20`,
                                  color: colors.brand.secondary
                                }}
                              >
                                {provider.provider}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span style={{ color: colors.utility.secondaryText }}>Daily Usage:</span>
                                <p style={{ color: colors.utility.primaryText }}>
                                  {provider.usage.dailyUsed.toLocaleString()}/{provider.usage.dailyLimit.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <span style={{ color: colors.utility.secondaryText }}>Success Rate:</span>
                                <p style={{ 
                                  color: provider.usage.successRate >= 95 
                                    ? colors.semantic.success 
                                    : provider.usage.successRate >= 90 
                                      ? colors.semantic.warning 
                                      : colors.semantic.error 
                                }}>
                                  {provider.usage.successRate.toFixed(1)}%
                                </p>
                              </div>
                              <div>
                                <span style={{ color: colors.utility.secondaryText }}>Avg Cost:</span>
                                <p style={{ color: colors.utility.primaryText }}>
                                  ₹{provider.usage.avgCost.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <span style={{ color: colors.utility.secondaryText }}>Last Used:</span>
                                <p style={{ color: colors.utility.primaryText }}>
                                  {provider.usage.lastUsed ? formatDate(provider.usage.lastUsed) : 'Never'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestChannel(provider.id);
                              }}
                              disabled={testingChannel === provider.id}
                              className="p-2 transition-colors hover:opacity-80 disabled:opacity-50"
                              style={{ color: colors.brand.primary }}
                              title="Test Connection"
                            >
                              {testingChannel === provider.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <TestTube className="w-4 h-4" />
                              )}
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProvider(provider);
                                setIsEditing(true);
                              }}
                              className="p-2 transition-colors hover:opacity-80"
                              style={{ color: colors.utility.secondaryText }}
                              title="Edit Configuration"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </VaNiListItem>
                    ))}
                  </VaNiList>
                </div>
              ))}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Templates List */}
                <div>
                  <VaNiListHeader
                    title="Communication Templates"
                    description={`${channelTemplates.length} templates available`}
                    actions={
                      <button
                        onClick={() => {
                          setSelectedTemplate(null);
                          setIsEditing(true);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                        style={{
                          borderColor: `${colors.brand.primary}40`,
                          backgroundColor: `${colors.brand.primary}10`,
                          color: colors.brand.primary
                        }}
                      >
                        <Plus className="w-3 h-3" />
                        <span>New Template</span>
                      </button>
                    }
                  />
                  
                  <VaNiList variant="business" spacing="compact">
                    {channelTemplates.map((template) => (
                      <VaNiListItem
                        key={template.id}
                        variant="business"
                        onClick={() => setSelectedTemplate(template)}
                        businessContext={{
                          priority: 5,
                          urgency: 'low',
                          hasActions: true
                        }}
                        style={{
                          backgroundColor: selectedTemplate?.id === template.id 
                            ? `${colors.brand.primary}10` 
                            : colors.utility.primaryBackground,
                          borderColor: `${colors.utility.primaryText}15`
                        }}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Channel Icon */}
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${colors.brand.primary}20` }}
                          >
                            <div style={{ color: colors.brand.primary }}>
                              {getChannelIcon(template.channelType)}
                            </div>
                          </div>

                          {/* Template Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 
                                className="font-medium text-sm"
                                style={{ color: colors.utility.primaryText }}
                              >
                                {template.name}
                              </h4>
                              <span
                                className="px-2 py-0.5 text-xs rounded-full capitalize"
                                style={{
                                  backgroundColor: `${colors.brand.secondary}20`,
                                  color: colors.brand.secondary
                                }}
                              >
                                {template.channelType}
                              </span>
                              <span
                                className="px-2 py-0.5 text-xs rounded-full"
                                style={{
                                  backgroundColor: template.isActive 
                                    ? `${colors.semantic.success}20` 
                                    : `${colors.utility.secondaryText}20`,
                                  color: template.isActive 
                                    ? colors.semantic.success 
                                    : colors.utility.secondaryText
                                }}
                              >
                                {template.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs" style={{ color: colors.utility.secondaryText }}>
                              <span>{template.eventType.replace('_', ' ')}</span>
                              <span>•</span>
                              <span>{template.usage.jobsUsed} jobs used</span>
                              <span>•</span>
                              <span>{template.usage.successRate.toFixed(1)}% success</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTemplate(template);
                                setIsEditing(true);
                              }}
                              className="p-1 transition-colors hover:opacity-80"
                              style={{ color: colors.utility.secondaryText }}
                              title="Edit Template"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(template.content);
                                toast.success('Template copied!', {
                                  style: { background: colors.semantic.success, color: '#FFF' }
                                });
                              }}
                              className="p-1 transition-colors hover:opacity-80"
                              style={{ color: colors.utility.secondaryText }}
                              title="Copy Template"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </VaNiListItem>
                    ))}
                  </VaNiList>
                </div>

                {/* Template Editor */}
                <div>
                  {selectedTemplate ? (
                    <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                      <CardHeader>
                        <CardTitle 
                          className="flex items-center justify-between"
                          style={{ color: colors.utility.primaryText }}
                        >
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(selectedTemplate.channelType)}
                            <span>{selectedTemplate.name}</span>
                          </div>
                          
                          {isEditing ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setIsEditing(false)}
                                className="p-1 transition-colors hover:opacity-80"
                                style={{ color: colors.utility.secondaryText }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleSaveTemplate}
                                className="p-1 transition-colors hover:opacity-80"
                                style={{ color: colors.semantic.success }}
                              >
                                <Save className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="p-1 transition-colors hover:opacity-80"
                              style={{ color: colors.brand.primary }}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Template Subject (for email) */}
                          {selectedTemplate.channelType === 'email' && selectedTemplate.subject && (
                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                                Subject Line
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={selectedTemplate.subject}
                                  onChange={(e) => setSelectedTemplate({
                                    ...selectedTemplate,
                                    subject: e.target.value
                                  })}
                                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                                  style={{
                                    borderColor: colors.utility.secondaryText + '40',
                                    backgroundColor: colors.utility.primaryBackground,
                                    color: colors.utility.primaryText,
                                    '--tw-ring-color': colors.brand.primary
                                  } as React.CSSProperties}
                                />
                              ) : (
                                <p 
                                  className="p-3 border rounded-lg"
                                  style={{
                                    borderColor: `${colors.utility.primaryText}20`,
                                    backgroundColor: colors.utility.secondaryBackground,
                                    color: colors.utility.primaryText
                                  }}
                                >
                                  {selectedTemplate.subject}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Template Content */}
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                              Message Content
                            </label>
                            {isEditing ? (
                              <RichTextEditor
                                value={selectedTemplate.content}
                                onChange={handleTemplateContentChange}
                                placeholder="Enter your template content..."
                                minHeight={200}
                                maxHeight={400}
                                showCharCount={true}
                                allowFullscreen={true}
                                outputFormat={selectedTemplate.channelType === 'email' ? 'html' : 'markdown'}
                                toolbarButtons={
                                  selectedTemplate.channelType === 'email' 
                                    ? ['bold', 'italic', 'underline', 'bulletList', 'orderedList', 'table', 'color']
                                    : ['bold', 'italic']
                                }
                              />
                            ) : (
                              <div 
                                className="p-3 border rounded-lg min-h-[200px] whitespace-pre-wrap"
                                style={{
                                  borderColor: `${colors.utility.primaryText}20`,
                                  backgroundColor: colors.utility.secondaryBackground,
                                  color: colors.utility.primaryText
                                }}
                                dangerouslySetInnerHTML={
                                  selectedTemplate.channelType === 'email' 
                                    ? { __html: selectedTemplate.content }
                                    : undefined
                                }
                              >
                                {selectedTemplate.channelType !== 'email' && selectedTemplate.content}
                              </div>
                            )}
                          </div>

                          {/* Template Variables */}
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                              Available Variables
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {selectedTemplate.variables.map((variable) => (
                                <span
                                  key={variable}
                                  className="px-2 py-1 text-xs rounded-full cursor-pointer transition-colors hover:opacity-80"
                                  style={{
                                    backgroundColor: `${colors.brand.primary}20`,
                                    color: colors.brand.primary
                                  }}
                                  onClick={() => {
                                    navigator.clipboard.writeText(`{{${variable}}}`);
                                    toast.success(`{{${variable}}} copied!`, {
                                      style: { background: colors.semantic.success, color: '#FFF' }
                                    });
                                  }}
                                  title="Click to copy"
                                >
                                  {`{{${variable}}}`}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Usage Statistics */}
                          <div 
                            className="p-3 border rounded-lg"
                            style={{
                              backgroundColor: `${colors.brand.primary}05`,
                              borderColor: `${colors.brand.primary}30`
                            }}
                          >
                            <h4 className="font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                              Usage Statistics
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span style={{ color: colors.utility.secondaryText }}>Jobs Used:</span>
                                <p style={{ color: colors.utility.primaryText }}>
                                  {selectedTemplate.usage.jobsUsed}
                                </p>
                              </div>
                              <div>
                                <span style={{ color: colors.utility.secondaryText }}>Success Rate:</span>
                                <p style={{ color: colors.semantic.success }}>
                                  {selectedTemplate.usage.successRate.toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                      <CardContent className="p-8 text-center">
                        <Edit className="w-12 h-12 mx-auto mb-4" style={{ color: colors.utility.secondaryText }} />
                        <h3 className="text-lg font-semibold mb-2" style={{ color: colors.utility.primaryText }}>
                          Select a Template
                        </h3>
                        <p style={{ color: colors.utility.secondaryText }}>
                          Choose a template from the list to view and edit its content.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Testing Tab */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div 
                className="p-4 border rounded-lg"
                style={{
                  backgroundColor: `${colors.semantic.info}10`,
                  borderColor: `${colors.semantic.info}40`
                }}
              >
                <h3 className="font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Channel Testing Center
                </h3>
                <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                  Test your channel configurations with sample business events to ensure proper delivery.
                </p>
              </div>

              {/* Test Configuration */}
              <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.utility.primaryText }}>
                    Send Test Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                          Test Channel
                        </label>
                        <select
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: colors.utility.secondaryText + '40',
                            backgroundColor: colors.utility.primaryBackground,
                            color: colors.utility.primaryText,
                            '--tw-ring-color': colors.brand.primary
                          } as React.CSSProperties}
                        >
                          <option value="">Select a channel...</option>
                          {channelProviders.filter(p => p.status === 'active').map(provider => (
                            <option key={provider.id} value={provider.id}>
                              {provider.name} ({provider.type.toUpperCase()})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                          Business Event Type
                        </label>
                        <select
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: colors.utility.secondaryText + '40',
                            backgroundColor: colors.utility.primaryBackground,
                            color: colors.utility.primaryText,
                            '--tw-ring-color': colors.brand.primary
                          } as React.CSSProperties}
                        >
                          <option value="">Select event type...</option>
                          <option value="service_due">Service Due</option>
                          <option value="payment_due">Payment Due</option>
                          <option value="contract_renewal">Contract Renewal</option>
                          <option value="emergency_service">Emergency Service</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                          Test Recipient
                        </label>
                        <input
                          type="text"
                          placeholder="test@example.com or +919876543210"
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: colors.utility.secondaryText + '40',
                            backgroundColor: colors.utility.primaryBackground,
                            color: colors.utility.primaryText,
                            '--tw-ring-color': colors.brand.primary
                          } as React.CSSProperties}
                        />
                      </div>

                      <button
                        onClick={() => handleTestChannel('test')}
                        disabled={testingChannel === 'test'}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
                        style={{
                          background: `linear-gradient(to right, ${colors.semantic.success}, ${colors.semantic.success}dd)`
                        }}
                      >
                        {testingChannel === 'test' ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Sending Test...</span>
                          </>
                        ) : (
                          <>
                            <TestTube className="w-4 h-4" />
                            <span>Send Test Message</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                        Test Results
                      </label>
                      <div 
                        className="p-4 border rounded-lg min-h-[200px]"
                        style={{
                          borderColor: `${colors.utility.primaryText}20`,
                          backgroundColor: colors.utility.secondaryBackground,
                          color: colors.utility.secondaryText
                        }}
                      >
                        Test results will appear here...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {channelProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}20`
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        {getChannelIcon(provider.type)}
                        <h4 className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {provider.name}
                        </h4>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Messages Sent:</span>
                          <span style={{ color: colors.utility.primaryText }}>
                            {provider.usage.totalSent.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Success Rate:</span>
                          <span style={{ 
                            color: provider.usage.successRate >= 95 
                              ? colors.semantic.success 
                              : colors.semantic.warning 
                          }}>
                            {provider.usage.successRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Total Cost:</span>
                          <span style={{ color: colors.utility.primaryText }}>
                            ₹{(provider.usage.totalSent * provider.usage.avgCost).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelsConfigPage;