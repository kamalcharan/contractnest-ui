// src/vani/pages/AnalyticsPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  VaNiMetricCard, 
  VaNiList, 
  VaNiListItem, 
  VaNiListHeader 
} from '../components/shared';
import { 
  realisticBusinessEvents,
  realisticEventJobs,
  realisticContracts,
  businessIntelligence,
  businessContextTemplates
} from '../utils/fakeData';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Zap,
  Mail,
  Smartphone,
  Bell,
  Monitor,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Building,
  Activity,
  Download,
  RefreshCw,
  Filter,
  Eye,
  ArrowRight,
  PieChart,
  LineChart
} from 'lucide-react';

interface AnalyticsData {
  // Communication metrics
  totalMessages: number;
  deliveryRate: number;
  readRate: number;
  responseRate: number;
  avgCostPerMessage: number;
  totalCommunicationCost: number;
  
  // Channel performance
  channelPerformance: {
    channel: string;
    sent: number;
    delivered: number;
    failed: number;
    cost: number;
    deliveryRate: number;
    avgCostPerMessage: number;
  }[];
  
  // Template effectiveness
  templatePerformance: {
    templateId: string;
    templateName: string;
    usageCount: number;
    deliveryRate: number;
    responseRate: number;
    avgCost: number;
    eventTypes: string[];
  }[];
  
  // Business event conversion
  eventConversion: {
    eventType: string;
    totalEvents: number;
    automatedJobs: number;
    automationRate: number;
    avgJobsPerEvent: number;
    successRate: number;
  }[];
  
  // Time-based trends
  communicationTrends: {
    date: string;
    messages: number;
    deliveryRate: number;
    cost: number;
  }[];
  
  // Customer engagement
  customerEngagement: {
    customerId: string;
    customerName: string;
    contractId: string;
    totalMessages: number;
    deliveryRate: number;
    responseRate: number;
    totalCost: number;
    lastEngagement: string;
  }[];
  
  // ROI metrics
  businessImpact: {
    totalRevenue: number;
    communicationCost: number;
    roi: number;
    costPerContract: number;
    revenuePerMessage: number;
  };
}

const AnalyticsPage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  
  // State
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'channels' | 'templates' | 'events' | 'customers'>('overview');
  const [loading, setLoading] = useState(false);

  // Calculate comprehensive analytics data
  const analyticsData: AnalyticsData = useMemo(() => {
    // Communication metrics
    const allJobs = realisticEventJobs;
    const totalMessages = allJobs.reduce((sum, job) => sum + job.recipients.total, 0);
    const deliveredMessages = allJobs.reduce((sum, job) => sum + job.recipients.successful, 0);
    const failedMessages = allJobs.reduce((sum, job) => sum + job.recipients.failed, 0);
    const totalCost = allJobs.reduce((sum, job) => sum + parseFloat(job.cost.replace('₹', '')), 0);
    
    const deliveryRate = totalMessages > 0 ? (deliveredMessages / totalMessages) * 100 : 0;
    const readRate = deliveryRate * 0.75; // Simulated read rate
    const responseRate = readRate * 0.35; // Simulated response rate
    
    // Channel performance
    const channelStats = ['email', 'sms', 'whatsapp', 'push', 'widget'].map(channel => {
      const channelJobs = allJobs.filter(job => job.channels.includes(channel as any));
      const sent = channelJobs.reduce((sum, job) => sum + job.recipients.total, 0);
      const delivered = channelJobs.reduce((sum, job) => sum + job.recipients.successful, 0);
      const failed = channelJobs.reduce((sum, job) => sum + job.recipients.failed, 0);
      const channelCost = channelJobs.reduce((sum, job) => {
        const jobCost = parseFloat(job.cost.replace('₹', ''));
        return sum + (jobCost / job.channels.length); // Distribute cost across channels
      }, 0);
      
      return {
        channel,
        sent,
        delivered,
        failed,
        cost: channelCost,
        deliveryRate: sent > 0 ? (delivered / sent) * 100 : 0,
        avgCostPerMessage: sent > 0 ? channelCost / sent : 0
      };
    }).filter(ch => ch.sent > 0);

    // Template performance
    const templateStats = businessContextTemplates.map(template => {
      const templateJobs = allJobs.filter(job => job.templateId === template.id);
      const totalSent = templateJobs.reduce((sum, job) => sum + job.recipients.total, 0);
      const totalDelivered = templateJobs.reduce((sum, job) => sum + job.recipients.successful, 0);
      const totalCost = templateJobs.reduce((sum, job) => sum + parseFloat(job.cost.replace('₹', '')), 0);
      
      return {
        templateId: template.id,
        templateName: template.name,
        usageCount: templateJobs.length,
        deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
        responseRate: (totalDelivered * 0.4), // Simulated response rate
        avgCost: templateJobs.length > 0 ? totalCost / templateJobs.length : 0,
        eventTypes: template.eventTypes
      };
    }).filter(t => t.usageCount > 0);

    // Event conversion rates
    const eventTypes = [...new Set(realisticBusinessEvents.map(e => e.eventType))];
    const eventConversion = eventTypes.map(eventType => {
      const events = realisticBusinessEvents.filter(e => e.eventType === eventType);
      const jobs = allJobs.filter(job => {
        const event = realisticBusinessEvents.find(e => e.id === job.businessEventId);
        return event?.eventType === eventType;
      });
      
      const totalEvents = events.length;
      const automatedJobs = jobs.length;
      const successfulJobs = jobs.filter(job => job.status === 'completed').length;
      
      return {
        eventType,
        totalEvents,
        automatedJobs,
        automationRate: totalEvents > 0 ? (automatedJobs / totalEvents) * 100 : 0,
        avgJobsPerEvent: totalEvents > 0 ? automatedJobs / totalEvents : 0,
        successRate: automatedJobs > 0 ? (successfulJobs / automatedJobs) * 100 : 0
      };
    });

    // Time-based trends (simulated for last 30 days)
    const communicationTrends = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      return {
        date: date.toISOString().split('T')[0],
        messages: Math.floor(Math.random() * 50) + 20,
        deliveryRate: 85 + Math.random() * 15,
        cost: Math.floor(Math.random() * 200) + 100
      };
    });

    // Customer engagement
    const customerEngagement = realisticContracts.map(contract => {
      const customerJobs = allJobs.filter(job => job.businessContext.contractId === contract.id);
      const totalMessages = customerJobs.reduce((sum, job) => sum + job.recipients.total, 0);
      const deliveredMessages = customerJobs.reduce((sum, job) => sum + job.recipients.successful, 0);
      const totalCost = customerJobs.reduce((sum, job) => sum + parseFloat(job.cost.replace('₹', '')), 0);
      
      return {
        customerId: contract.customerId,
        customerName: contract.customerName,
        contractId: contract.id,
        totalMessages,
        deliveryRate: totalMessages > 0 ? (deliveredMessages / totalMessages) * 100 : 0,
        responseRate: deliveredMessages * 0.4, // Simulated
        totalCost,
        lastEngagement: customerJobs.length > 0 ? 
          Math.max(...customerJobs.map(j => new Date(j.createdAt).getTime())).toString() : 
          new Date().toISOString()
      };
    }).filter(c => c.totalMessages > 0);

    // Business impact
    const totalRevenue = realisticContracts.reduce((sum, contract) => sum + contract.totalValue, 0);
    const businessImpact = {
      totalRevenue,
      communicationCost: totalCost,
      roi: totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0,
      costPerContract: realisticContracts.length > 0 ? totalCost / realisticContracts.length : 0,
      revenuePerMessage: totalMessages > 0 ? totalRevenue / totalMessages : 0
    };

    return {
      totalMessages,
      deliveryRate,
      readRate,
      responseRate,
      avgCostPerMessage: totalMessages > 0 ? totalCost / totalMessages : 0,
      totalCommunicationCost: totalCost,
      channelPerformance: channelStats,
      templatePerformance: templateStats,
      eventConversion,
      communicationTrends,
      customerEngagement,
      businessImpact
    };
  }, [selectedPeriod]);

  // Key metrics for cards
  const keyMetrics = [
    {
      value: analyticsData.totalMessages.toLocaleString(),
      label: 'Total Messages',
      subtitle: 'Across all channels',
      icon: <MessageSquare className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 15.2,
        period: 'vs last period'
      },
      cost: `₹${analyticsData.totalCommunicationCost.toFixed(2)} total cost`
    },
    {
      value: `${analyticsData.deliveryRate.toFixed(1)}%`,
      label: 'Delivery Rate',
      subtitle: 'Messages delivered successfully',
      icon: <Target className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 3.5,
        period: 'vs last period'
      },
      secondaryMetric: {
        value: `${analyticsData.readRate.toFixed(1)}%`,
        label: 'Read Rate'
      }
    },
    {
      value: `${analyticsData.responseRate.toFixed(1)}%`,
      label: 'Response Rate',
      subtitle: 'Customer engagement',
      icon: <TrendingUp className="w-5 h-5" />,
      trend: {
        direction: 'up' as const,
        percentage: 8.2,
        period: 'vs last period'
      }
    },
    {
      value: `₹${analyticsData.avgCostPerMessage.toFixed(2)}`,
      label: 'Cost per Message',
      subtitle: 'Average communication cost',
      icon: <DollarSign className="w-5 h-5" />,
      trend: {
        direction: 'down' as const,
        percentage: 5.1,
        period: 'vs last period'
      },
      secondaryMetric: {
        value: `${analyticsData.businessImpact.roi.toFixed(1)}%`,
        label: 'ROI'
      }
    }
  ];

  // Channel icons
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      case 'widget': return <Monitor className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Event type icons
  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'service_due': return <Calendar className="w-4 h-4" />;
      case 'payment_due': return <DollarSign className="w-4 h-4" />;
      case 'contract_renewal': return <FileText className="w-4 h-4" />;
      case 'emergency_service': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Handlers
  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  const handleViewDetails = (type: string, id?: string) => {
    switch (type) {
      case 'template':
        navigate(`/vani/templates/${id}`);
        break;
      case 'customer':
        navigate(`/contracts/${id}`);
        break;
      case 'events':
        navigate('/vani/events');
        break;
      default:
        break;
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
            Communication Analytics
          </h1>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Performance insights across all business communications and automation
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Period Selector */}
          <div className="flex items-center space-x-1 p-1 border rounded-lg" style={{ borderColor: `${colors.utility.primaryText}20` }}>
            {[
              { key: '7d', label: '7D' },
              { key: '30d', label: '30D' },
              { key: '90d', label: '90D' },
              { key: '1y', label: '1Y' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-3 py-1 text-sm rounded transition-colors`}
                style={{
                  backgroundColor: selectedPeriod === period.key 
                    ? colors.brand.primary 
                    : 'transparent',
                  color: selectedPeriod === period.key 
                    ? '#FFF' 
                    : colors.utility.primaryText
                }}
              >
                {period.label}
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
            onClick={handleExport}
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
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <VaNiMetricCard
            key={index}
            metric={metric}
            variant="business"
            loading={loading}
          />
        ))}
      </div>

      {/* View Selector */}
      <Card
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-1">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'channels', label: 'Channel Performance', icon: MessageSquare },
              { key: 'templates', label: 'Template Effectiveness', icon: FileText },
              { key: 'events', label: 'Event Conversion', icon: Zap },
              { key: 'customers', label: 'Customer Engagement', icon: Users }
            ].map((view) => {
              const Icon = view.icon;
              const isActive = selectedView === view.key;
              
              return (
                <button
                  key={view.key}
                  onClick={() => setSelectedView(view.key as any)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive ? `${colors.brand.primary}15` : 'transparent',
                    color: isActive ? colors.brand.primary : colors.utility.secondaryText
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{view.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="xl:col-span-2">
          <Card
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.utility.primaryText }}>
                {selectedView === 'overview' && 'Communication Overview'}
                {selectedView === 'channels' && 'Channel Performance Analysis'}
                {selectedView === 'templates' && 'Template Effectiveness'}
                {selectedView === 'events' && 'Business Event Conversion'}
                {selectedView === 'customers' && 'Customer Engagement Metrics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* Overview */}
              {selectedView === 'overview' && (
                <div className="space-y-6">
                  {/* Communication Trends Chart Placeholder */}
                  <div 
                    className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center"
                    style={{ borderColor: `${colors.utility.primaryText}30` }}
                  >
                    <div className="text-center">
                      <LineChart className="w-12 h-12 mx-auto mb-2" style={{ color: colors.utility.secondaryText }} />
                      <p style={{ color: colors.utility.secondaryText }}>
                        Communication Trends Chart
                      </p>
                      <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                        Daily message volume and delivery rates over time
                      </p>
                    </div>
                  </div>

                  {/* Business Impact Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className="p-4 border rounded-lg text-center"
                      style={{
                        backgroundColor: `${colors.semantic.success}10`,
                        borderColor: `${colors.semantic.success}30`
                      }}
                    >
                      <p className="text-2xl font-bold" style={{ color: colors.semantic.success }}>
                        ₹{(analyticsData.businessImpact.totalRevenue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                        Total Revenue Impact
                      </p>
                    </div>
                    <div 
                      className="p-4 border rounded-lg text-center"
                      style={{
                        backgroundColor: `${colors.brand.primary}10`,
                        borderColor: `${colors.brand.primary}30`
                      }}
                    >
                      <p className="text-2xl font-bold" style={{ color: colors.brand.primary }}>
                        {analyticsData.businessImpact.roi.toFixed(1)}%
                      </p>
                      <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                        Communication ROI
                      </p>
                    </div>
                    <div 
                      className="p-4 border rounded-lg text-center"
                      style={{
                        backgroundColor: `${colors.semantic.warning}10`,
                        borderColor: `${colors.semantic.warning}30`
                      }}
                    >
                      <p className="text-2xl font-bold" style={{ color: colors.semantic.warning }}>
                        ₹{analyticsData.businessImpact.costPerContract.toFixed(0)}
                      </p>
                      <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                        Cost per Contract
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Channel Performance */}
              {selectedView === 'channels' && (
                <VaNiList variant="business" spacing="normal">
                  {analyticsData.channelPerformance.map((channel) => (
                    <VaNiListItem
                      key={channel.channel}
                      variant="business"
                      clickable={false}
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        borderColor: `${colors.utility.primaryText}15`
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${colors.brand.primary}20` }}
                          >
                            <div style={{ color: colors.brand.primary }}>
                              {getChannelIcon(channel.channel)}
                            </div>
                          </div>
                          <div>
                            <h3 
                              className="font-medium capitalize"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {channel.channel}
                            </h3>
                            <p 
                              className="text-sm"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              {channel.sent.toLocaleString()} sent • {channel.delivered.toLocaleString()} delivered
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.semantic.success }}
                            >
                              {channel.deliveryRate.toFixed(1)}%
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Delivery Rate
                            </p>
                          </div>
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.semantic.warning }}
                            >
                              ₹{channel.avgCostPerMessage.toFixed(2)}
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Avg Cost/Msg
                            </p>
                          </div>
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.utility.primaryText }}
                            >
                              ₹{channel.cost.toFixed(0)}
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Total Cost
                            </p>
                          </div>
                        </div>
                      </div>
                    </VaNiListItem>
                  ))}
                </VaNiList>
              )}

              {/* Template Performance */}
              {selectedView === 'templates' && (
                <VaNiList variant="business" spacing="normal">
                  {analyticsData.templatePerformance.map((template) => (
                    <VaNiListItem
                      key={template.templateId}
                      variant="business"
                      onClick={() => handleViewDetails('template', template.templateId)}
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        borderColor: `${colors.utility.primaryText}15`
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4 flex-1">
                          <div 
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${colors.brand.secondary}20` }}
                          >
                            <FileText className="w-5 h-5" style={{ color: colors.brand.secondary }} />
                          </div>
                          <div className="flex-1">
                            <h3 
                              className="font-medium"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {template.templateName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm" style={{ color: colors.utility.secondaryText }}>
                              <span>{template.usageCount} uses</span>
                              <span>•</span>
                              <span>₹{template.avgCost.toFixed(2)} avg cost</span>
                              <span>•</span>
                              <span>{template.eventTypes.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 text-center">
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.semantic.success }}
                            >
                              {template.deliveryRate.toFixed(1)}%
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Delivery Rate
                            </p>
                          </div>
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.brand.primary }}
                            >
                              {template.responseRate.toFixed(1)}%
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Response Rate
                            </p>
                          </div>
                        </div>
                      </div>
                    </VaNiListItem>
                  ))}
                </VaNiList>
              )}

              {/* Event Conversion */}
              {selectedView === 'events' && (
                <VaNiList variant="business" spacing="normal">
                  {analyticsData.eventConversion.map((event) => (
                    <VaNiListItem
                      key={event.eventType}
                      variant="business"
                      onClick={() => handleViewDetails('events')}
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        borderColor: `${colors.utility.primaryText}15`
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4 flex-1">
                          <div 
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${colors.semantic.info}20` }}
                          >
                            <div style={{ color: colors.semantic.info }}>
                              {getEventTypeIcon(event.eventType)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 
                              className="font-medium capitalize"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {event.eventType.replace('_', ' ')}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm" style={{ color: colors.utility.secondaryText }}>
                              <span>{event.totalEvents} events</span>
                              <span>•</span>
                              <span>{event.automatedJobs} jobs generated</span>
                              <span>•</span>
                              <span>{event.avgJobsPerEvent.toFixed(1)} jobs/event</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 text-center">
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.brand.primary }}
                            >
                              {event.automationRate.toFixed(1)}%
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Automation Rate
                            </p>
                          </div>
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.semantic.success }}
                            >
                              {event.successRate.toFixed(1)}%
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Success Rate
                            </p>
                          </div>
                        </div>
                      </div>
                    </VaNiListItem>
                  ))}
                </VaNiList>
              )}

              {/* Customer Engagement */}
              {selectedView === 'customers' && (
                <VaNiList variant="business" spacing="normal">
                  {analyticsData.customerEngagement.slice(0, 10).map((customer) => (
                    <VaNiListItem
                      key={customer.customerId}
                      variant="business"
                      onClick={() => handleViewDetails('customer', customer.contractId)}
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        borderColor: `${colors.utility.primaryText}15`
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4 flex-1">
                          <div 
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${colors.semantic.success}20` }}
                          >
                            <Building className="w-5 h-5" style={{ color: colors.semantic.success }} />
                          </div>
                          <div className="flex-1">
                            <h3 
                              className="font-medium"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {customer.customerName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm" style={{ color: colors.utility.secondaryText }}>
                              <span>{customer.totalMessages} messages</span>
                              <span>•</span>
                              <span>₹{customer.totalCost.toFixed(0)} cost</span>
                              <span>•</span>
                              <span>Contract {customer.contractId}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.semantic.success }}
                            >
                              {customer.deliveryRate.toFixed(1)}%
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Delivery
                            </p>
                          </div>
                          <div>
                            <p 
                              className="text-lg font-bold"
                              style={{ color: colors.brand.primary }}
                            >
                              {customer.responseRate.toFixed(1)}%
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Response
                            </p>
                          </div>
                          <div>
                            <p 
                              className="text-sm"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              {formatDate(customer.lastEngagement)}
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              Last Contact
                            </p>
                          </div>
                        </div>
                      </div>
                    </VaNiListItem>
                  ))}
                </VaNiList>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Insights */}
        <div className="space-y-6">
          
          {/* Top Performing Channels */}
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
                <TrendingUp className="w-5 h-5" />
                <span>Top Channels</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.channelPerformance
                  .sort((a, b) => b.deliveryRate - a.deliveryRate)
                  .slice(0, 3)
                  .map((channel, index) => (
                    <div key={channel.channel} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <span 
                            className="text-lg font-bold"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            #{index + 1}
                          </span>
                          {getChannelIcon(channel.channel)}
                        </div>
                        <span 
                          className="capitalize"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {channel.channel}
                        </span>
                      </div>
                      <span 
                        className="font-medium"
                        style={{ color: colors.semantic.success }}
                      >
                        {channel.deliveryRate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Insights */}
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
                <Eye className="w-5 h-5" />
                <span>Key Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="p-3 border rounded-lg"
                  style={{
                    backgroundColor: `${colors.semantic.success}10`,
                    borderColor: `${colors.semantic.success}30`
                  }}
                >
                  <h4 
                    className="font-medium mb-1"
                    style={{ color: colors.semantic.success }}
                  >
                    High Engagement
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Service reminders have {analyticsData.templatePerformance
                      .find(t => t.templateName.includes('Service'))?.deliveryRate.toFixed(1) || '95'}% delivery rate
                  </p>
                </div>
                
                <div 
                  className="p-3 border rounded-lg"
                  style={{
                    backgroundColor: `${colors.brand.primary}10`,
                    borderColor: `${colors.brand.primary}30`
                  }}
                >
                  <h4 
                    className="font-medium mb-1"
                    style={{ color: colors.brand.primary }}
                  >
                    Cost Optimization
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    WhatsApp messages show 15% higher engagement than email
                  </p>
                </div>
                
                <div 
                  className="p-3 border rounded-lg"
                  style={{
                    backgroundColor: `${colors.semantic.warning}10`,
                    borderColor: `${colors.semantic.warning}30`
                  }}
                >
                  <h4 
                    className="font-medium mb-1"
                    style={{ color: colors.semantic.warning }}
                  >
                    Opportunity
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {analyticsData.eventConversion
                      .filter(e => e.automationRate < 80).length} event types can be better automated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card
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
                onClick={() => navigate('/vani/templates')}
                className="w-full flex items-center space-x-3 p-3 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: `${colors.utility.primaryText}20`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <FileText className="w-4 h-4" />
                <span>Optimize Templates</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
              
              <button
                onClick={() => navigate('/vani/channels')}
                className="w-full flex items-center space-x-3 p-3 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: `${colors.utility.primaryText}20`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Configure Channels</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
              
              <button
                onClick={() => navigate('/vani/events')}
                className="w-full flex items-center space-x-3 p-3 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: `${colors.utility.primaryText}20`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <Activity className="w-4 h-4" />
                <span>View Business Events</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;