// src/vani/pages/JobCommunicationsPage.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  VaNiStatusBadge,
  VaNiList,
  VaNiListItem,
  VaNiListHeader
} from '../components/shared';
import { 
  realisticEventJobs,
  realisticBusinessEvents,
  businessContextTemplates,
  type EventDrivenJob
} from '../utils/fakeData';
import { 
  ArrowLeft,
  Mail,
  Smartphone,
  MessageSquare,
  Bell,
  Monitor,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Copy,
  Download,
  RefreshCw,
  Send,
  User,
  Calendar,
  FileText,
  BarChart3,
  Target,
  TrendingUp,
  Activity,
  Zap,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CommunicationMessage {
  id: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'widget';
  recipientId: string;
  recipientName: string;
  recipientContact: string;
  businessRole: string;
  
  // Content
  subject?: string;
  content: string;
  variables: Record<string, any>;
  templateId: string;
  templateName: string;
  
  // Delivery tracking
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read' | 'responded';
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  respondedAt?: string;
  
  // Cost and metrics
  cost: number;
  deliveryAttempts: number;
  errorMessage?: string;
  
  // Business context
  businessContext: {
    contractId: string;
    contractName: string;
    customerName: string;
    serviceNumber?: number;
    amount?: number;
    eventType: string;
  };
}

const JobCommunicationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // State
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<CommunicationMessage | null>(null);
  const [showContent, setShowContent] = useState(false);

  // Load job data
  const job = useMemo(() => {
    return realisticEventJobs.find(j => j.id === id);
  }, [id]);

  const businessEvent = useMemo(() => {
    if (!job) return null;
    return realisticBusinessEvents.find(e => e.id === job.businessEventId);
  }, [job]);

  // Generate detailed communication messages from job data
  const communicationMessages: CommunicationMessage[] = useMemo(() => {
    if (!job || !businessEvent) return [];

    const messages: CommunicationMessage[] = [];
    
    job.recipients.details.forEach((recipient, recipientIndex) => {
      job.channels.forEach((channel, channelIndex) => {
        const channelStatus = job.executionStatus[channel];
        const template = businessContextTemplates.find(t => t.id === job.templateId);
        
        // Generate realistic content based on template and business context
        let content = '';
        let subject = '';
        
        if (template) {
          const variables = {
            customerName: recipient.name,
            contractName: job.businessContext.contractName || 'Service Contract',
            serviceDate: new Date(businessEvent.eventDate).toLocaleDateString('en-IN'),
            serviceTime: new Date(businessEvent.eventDate).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            technician: businessEvent.metadata.technician || 'Service Team',
            serviceNumber: job.businessContext.serviceNumber || 1,
            totalServices: job.businessContext.totalServices || 1,
            contractId: job.businessContext.contractId || 'N/A',
            amount: job.businessContext.amount || 0,
            estimatedDuration: businessEvent.metadata.estimatedDuration || '2 hours'
          };

          if (channel === 'email') {
            subject = template.content.email?.subject
              ? Object.entries(variables).reduce((str, [key, value]) => 
                  str.replace(new RegExp(`{{${key}}}`, 'g'), String(value)), 
                  template.content.email.subject
                )
              : `${businessEvent.eventType.replace('_', ' ')} - ${businessEvent.contactName}`;
            
            content = template.content.email?.body
              ? Object.entries(variables).reduce((str, [key, value]) => 
                  str.replace(new RegExp(`{{${key}}}`, 'g'), String(value)), 
                  template.content.email.body
                )
              : generateDefaultEmailContent(businessEvent, variables);
          } else if (channel === 'sms') {
            content = template.content.sms?.body
              ? Object.entries(variables).reduce((str, [key, value]) => 
                  str.replace(new RegExp(`{{${key}}}`, 'g'), String(value)), 
                  template.content.sms.body
                )
              : generateDefaultSMSContent(businessEvent, variables);
          } else if (channel === 'whatsapp') {
            content = generateDefaultWhatsAppContent(businessEvent, variables);
          } else {
            content = `${businessEvent.eventType.replace('_', ' ')} notification for ${variables.customerName}`;
          }
        }

        messages.push({
          id: `msg_${recipientIndex}_${channelIndex}`,
          channel: channel as any,
          recipientId: recipient.id,
          recipientName: recipient.name,
          recipientContact: channel === 'email' ? recipient.email || '' : recipient.phone || '',
          businessRole: recipient.businessRole,
          
          subject,
          content,
          variables: {
            customerName: recipient.name,
            serviceDate: new Date(businessEvent.eventDate).toLocaleDateString('en-IN'),
            contractId: job.businessContext.contractId,
            amount: job.businessContext.amount
          },
          templateId: job.templateId || 'default',
          templateName: template?.name || 'Default Template',
          
          status: channelStatus?.status as any || 'pending',
          sentAt: channelStatus?.sentAt,
          deliveredAt: channelStatus?.deliveredAt,
          readAt: channelStatus?.status === 'delivered' ? 
            new Date(Date.now() + Math.random() * 3600000).toISOString() : undefined,
          
          cost: channelStatus?.cost || 0,
          deliveryAttempts: channelStatus?.status === 'failed' ? 2 : 1,
          errorMessage: channelStatus?.error,
          
          businessContext: {
            contractId: job.businessContext.contractId || '',
            contractName: job.businessContext.contractName || '',
            customerName: businessEvent.contactName,
            serviceNumber: job.businessContext.serviceNumber,
            amount: job.businessContext.amount,
            eventType: businessEvent.eventType
          }
        });
      });
    });

    return messages;
  }, [job, businessEvent]);

  // Helper functions to generate default content
  const generateDefaultEmailContent = (event: any, variables: any) => {
    switch (event.eventType) {
      case 'service_due':
        return `Dear ${variables.customerName},

Your ${event.metadata.serviceType || 'service'} is scheduled for ${variables.serviceDate} at ${variables.serviceTime}.

Service Details:
- Service Number: ${variables.serviceNumber} of ${variables.totalServices}
- Technician: ${variables.technician}
- Estimated Duration: ${variables.estimatedDuration}
- Contract: ${variables.contractId}

Please ensure access to the service area. Contact us if you need to reschedule.

Best regards,
Service Team`;
      
      case 'payment_due':
        return `Dear ${variables.customerName},

This is a friendly reminder that your payment of ₹${variables.amount} is due on ${variables.serviceDate}.

Payment Details:
- Contract: ${variables.contractId}
- Amount: ₹${variables.amount}
- Due Date: ${variables.serviceDate}

Please process the payment to avoid any service interruption.

Thank you,
Accounts Team`;
      
      default:
        return `Dear ${variables.customerName},

This is a notification regarding ${event.eventType.replace('_', ' ')} for contract ${variables.contractId}.

Best regards,
Service Team`;
    }
  };

  const generateDefaultSMSContent = (event: any, variables: any) => {
    switch (event.eventType) {
      case 'service_due':
        return `Service reminder: ${variables.serviceDate} at ${variables.serviceTime}. Technician: ${variables.technician}. Service ${variables.serviceNumber}/${variables.totalServices}. Contract: ${variables.contractId}`;
      
      case 'payment_due':
        return `Payment reminder: ₹${variables.amount} due on ${variables.serviceDate}. Contract: ${variables.contractId}. Please pay to avoid service interruption.`;
      
      default:
        return `${event.eventType.replace('_', ' ')} notification for ${variables.customerName}. Contract: ${variables.contractId}`;
    }
  };

  const generateDefaultWhatsAppContent = (event: any, variables: any) => {
    switch (event.eventType) {
      case 'service_due':
        return `🔧 *Service Reminder*

📅 *Date:* ${variables.serviceDate}
⏰ *Time:* ${variables.serviceTime}
👨‍🔧 *Technician:* ${variables.technician}
📋 *Service:* ${variables.serviceNumber} of ${variables.totalServices}
📄 *Contract:* ${variables.contractId}

Please ensure access to service area. Reply to confirm or reschedule.`;
      
      case 'payment_due':
        return `💰 *Payment Reminder*

💳 *Amount:* ₹${variables.amount}
📅 *Due Date:* ${variables.serviceDate}
📄 *Contract:* ${variables.contractId}

Please process payment to avoid service interruption. Pay online or contact us.`;
      
      default:
        return `📢 *${event.eventType.replace('_', ' ')}*

Customer: ${variables.customerName}
Contract: ${variables.contractId}

Contact us for more information.`;
    }
  };

  // Filter messages by channel
  const filteredMessages = useMemo(() => {
    if (selectedChannel === 'all') return communicationMessages;
    return communicationMessages.filter(msg => msg.channel === selectedChannel);
  }, [communicationMessages, selectedChannel]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = communicationMessages.length;
    const delivered = communicationMessages.filter(m => m.status === 'delivered').length;
    const failed = communicationMessages.filter(m => m.status === 'failed').length;
    const pending = communicationMessages.filter(m => m.status === 'pending' || m.status === 'sent').length;
    const read = communicationMessages.filter(m => m.readAt).length;
    const totalCost = communicationMessages.reduce((sum, m) => sum + m.cost, 0);

    return {
      total,
      delivered,
      failed,
      pending,
      read,
      totalCost,
      deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
      readRate: delivered > 0 ? (read / delivered) * 100 : 0
    };
  }, [communicationMessages]);

  // Channel icons
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      case 'widget': return <Monitor className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  // Status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'read':
      case 'responded':
        return <CheckCircle className="w-4 h-4" style={{ color: colors.semantic.success }} />;
      case 'failed':
        return <XCircle className="w-4 h-4" style={{ color: colors.semantic.error }} />;
      case 'sent':
      case 'pending':
        return <Clock className="w-4 h-4" style={{ color: colors.semantic.warning }} />;
      default:
        return <AlertCircle className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />;
    }
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

  // Handlers
  const handleBack = () => {
    navigate(`/vani/jobs/${id}`);
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleViewTemplate = (templateId: string) => {
    navigate(`/vani/templates/${templateId}`);
  };

  if (!job) {
    return (
      <div className="p-6">
        <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: colors.semantic.error }} />
            <h2 className="text-xl font-semibold mb-2" style={{ color: colors.utility.primaryText }}>
              Job Not Found
            </h2>
            <p className="mb-4" style={{ color: colors.utility.secondaryText }}>
              The communication job you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate('/vani/jobs')}
              className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
              style={{ background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})` }}
            >
              Back to Jobs
            </button>
            <button onClick={() => navigate(`/vani/templates/${message.templateId}`)}>
            <span>View Template →</span>
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.utility.primaryText }}>
              Communications
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.utility.secondaryText }}>
              {job.jobName} • {communicationMessages.length} messages sent
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => console.log('Export communications')}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={() => navigate(`/vani/jobs/${id}/analytics`)}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Sent', value: metrics.total, icon: Send, color: colors.utility.primaryText },
          { label: 'Delivered', value: metrics.delivered, icon: CheckCircle, color: colors.semantic.success },
          { label: 'Read', value: metrics.read, icon: Eye, color: colors.brand.primary },
          { label: 'Failed', value: metrics.failed, icon: XCircle, color: colors.semantic.error },
          { label: 'Total Cost', value: `₹${metrics.totalCost.toFixed(2)}`, icon: Target, color: colors.semantic.warning }
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="xl:col-span-2">
          <Card
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <VaNiListHeader
              title="Communication Messages"
              description={`${filteredMessages.length} messages • ${metrics.deliveryRate.toFixed(1)}% delivery rate`}
              actions={
                <div className="flex items-center space-x-2">
                  {/* Channel Filter */}
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-md"
                    style={{
                      borderColor: `${colors.utility.primaryText}20`,
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText
                    }}
                  >
                    <option value="all">All Channels</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="push">Push</option>
                    <option value="widget">Widget</option>
                  </select>
                </div>
              }
            />

            <CardContent className="p-0">
              <VaNiList variant="business" spacing="compact" className="p-4">
                {filteredMessages.map((message) => (
                  <VaNiListItem
                    key={message.id}
                    variant="business"
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowContent(true);
                    }}
                    businessContext={{
                      priority: message.status === 'failed' ? 8 : 5,
                      urgency: message.status === 'failed' ? 'high' : 'low',
                      entityType: message.channel,
                      hasActions: true
                    }}
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
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
                          {getChannelIcon(message.channel)}
                        </div>
                      </div>

                      {/* Message Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 
                            className="font-medium truncate text-sm"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {message.recipientName}
                          </h3>
                          <VaNiStatusBadge status={message.status as any} size="sm" />
                          <span
                            className="px-2 py-0.5 text-xs rounded-full capitalize"
                            style={{
                              backgroundColor: `${colors.brand.secondary}20`,
                              color: colors.brand.secondary
                            }}
                          >
                            {message.channel}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-xs" style={{ color: colors.utility.secondaryText }}>
                          <span>{message.recipientContact}</span>
                          <span>•</span>
                          <span>{message.businessRole}</span>
                          {message.sentAt && (
                            <>
                              <span>•</span>
                              <span>{formatDate(message.sentAt)}</span>
                            </>
                          )}
                        </div>

                        {/* Preview Content */}
                        <div className="mt-1">
                          <p 
                            className="text-xs truncate"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            {message.channel === 'email' ? message.subject : message.content.substring(0, 60) + '...'}
                          </p>
                        </div>
                      </div>

                      {/* Status & Cost */}
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusIcon(message.status)}
                          <span 
                            className="text-sm font-medium"
                            style={{ color: colors.utility.primaryText }}
                          >
                            ₹{message.cost.toFixed(2)}
                          </span>
                        </div>
                        {message.deliveryAttempts > 1 && (
                          <p 
                            className="text-xs"
                            style={{ color: colors.semantic.warning }}
                          >
                            {message.deliveryAttempts} attempts
                          </p>
                        )}
                      </div>
                    </div>
                  </VaNiListItem>
                ))}
              </VaNiList>
            </CardContent>
          </Card>
        </div>

        {/* Message Content Panel */}
        <div>
          {selectedMessage ? (
            <Card
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
                  {getChannelIcon(selectedMessage.channel)}
                  <span>{selectedMessage.channel.toUpperCase()} Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Recipient Info */}
                  <div 
                    className="p-3 border rounded-lg"
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}20`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: colors.utility.primaryText }}>
                        {selectedMessage.recipientName}
                      </span>
                      <VaNiStatusBadge status={selectedMessage.status as any} size="sm" />
                    </div>
                    <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                      {selectedMessage.recipientContact}
                    </p>
                    <p className="text-xs" style={{ color: colors.brand.primary }}>
                      {selectedMessage.businessRole}
                    </p>
                  </div>

                  {/* Message Content */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: colors.utility.primaryText }}>
                        Message Content
                      </span>
                      <button
                        onClick={() => handleCopyContent(selectedMessage.content)}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.utility.secondaryText }}
                        title="Copy Content"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {selectedMessage.subject && (
                      <div className="mb-3">
                        <span className="text-xs" style={{ color: colors.utility.secondaryText }}>Subject:</span>
                        <p 
                          className="text-sm font-medium"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {selectedMessage.subject}
                        </p>
                      </div>
                    )}
                    
                    <div 
                      className="p-3 border rounded-lg whitespace-pre-wrap text-sm"
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        borderColor: `${colors.utility.primaryText}20`,
                        color: colors.utility.primaryText
                      }}
                    >
                      {selectedMessage.content}
                    </div>
                  </div>

                  {/* Template Info */}
                  <div 
                    className="p-3 border rounded-lg"
                    style={{
                      backgroundColor: `${colors.brand.primary}05`,
                      borderColor: `${colors.brand.primary}30`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: colors.utility.primaryText }}>
                        Template Used
                      </span>
                      <button
                        onClick={() => handleViewTemplate(selectedMessage.templateId)}
                        className="text-xs hover:opacity-80"
                        style={{ color: colors.brand.primary }}
                      >
                        View Template →
                      </button>
                    </div>
                    <p className="text-sm" style={{ color: colors.utility.primaryText }}>
                      {selectedMessage.templateName}
                    </p>
                  </div>

                  {/* Delivery Timeline */}
                  <div>
                    <span className="text-sm font-medium mb-3 block" style={{ color: colors.utility.primaryText }}>
                      Delivery Timeline
                    </span>
                    <div className="space-y-2">
                      {[
                        { label: 'Sent', time: selectedMessage.sentAt, status: 'completed' },
                        { label: 'Delivered', time: selectedMessage.deliveredAt, status: selectedMessage.deliveredAt ? 'completed' : 'pending' },
                        { label: 'Read', time: selectedMessage.readAt, status: selectedMessage.readAt ? 'completed' : 'pending' }
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          {getStatusIcon(step.status)}
                          <span className="text-sm" style={{ color: colors.utility.primaryText }}>
                            {step.label}
                          </span>
                          {step.time && (
                            <span className="text-xs" style={{ color: colors.utility.secondaryText }}>
                              {formatDate(step.time)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Business Context */}
                  <div 
                    className="p-3 border rounded-lg"
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}20`
                    }}
                  >
                    <span className="text-sm font-medium mb-2 block" style={{ color: colors.utility.primaryText }}>
                      Business Context
                    </span>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Contract:</span>
                        <span style={{ color: colors.utility.primaryText }}>{selectedMessage.businessContext.contractId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Customer:</span>
                        <span style={{ color: colors.utility.primaryText }}>{selectedMessage.businessContext.customerName}</span>
                      </div>
                      {selectedMessage.businessContext.amount && (
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Amount:</span>
                          <span style={{ color: colors.semantic.success }}>₹{selectedMessage.businessContext.amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {selectedMessage.status === 'failed' && selectedMessage.errorMessage && (
                    <div 
                      className="p-3 border rounded-lg"
                      style={{
                        backgroundColor: `${colors.semantic.error}10`,
                        borderColor: `${colors.semantic.error}40`
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="w-4 h-4" style={{ color: colors.semantic.error }} />
                        <span className="text-sm font-medium" style={{ color: colors.semantic.error }}>
                          Delivery Failed
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: colors.utility.primaryText }}>
                        {selectedMessage.errorMessage}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: colors.utility.secondaryText }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.utility.primaryText }}>
                  Select a Message
                </h3>
                <p style={{ color: colors.utility.secondaryText }}>
                  Click on a message to view its content, delivery status, and business context.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCommunicationsPage;