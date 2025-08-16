// src/vani/pages/JobDetailsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
  realisticContracts,
  businessIntelligence,
  type EventDrivenJob,
  type BusinessEvent
} from '../utils/fakeData';
import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Download,
  RefreshCw,
  Calendar,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Smartphone,
  Mail,
  MessageSquare,
  Bell,
  Monitor,
  Eye,
  Edit,
  Trash2,
  FileText,
  Building,
  ExternalLink,
  Activity,
  Zap,
  TrendingUp,
  Timer,
  Target,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'recipients' | 'business' | 'logs' | 'settings'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Load job data from realistic data
  const job = useMemo(() => {
    return realisticEventJobs.find(j => j.id === id);
  }, [id]);

  const businessEvent = useMemo(() => {
    if (!job) return null;
    return realisticBusinessEvents.find(e => e.id === job.businessEventId);
  }, [job]);

  const contract = useMemo(() => {
    if (!businessEvent) return null;
    return realisticContracts.find(c => c.id === businessEvent.metadata.contractId);
  }, [businessEvent]);

  const relatedJobs = useMemo(() => {
    if (!job) return [];
    return realisticEventJobs.filter(j => 
      j.businessEventId === job.businessEventId && j.id !== job.id
    );
  }, [job]);

  // Mock recipient results for demonstration (using job data)
  const recipientResults = useMemo(() => {
    if (!job) return [];
    
    return job.recipients.details.map((recipient, index) => ({
      id: recipient.id,
      name: recipient.name,
      email: recipient.email,
      phone: recipient.phone,
      businessRole: recipient.businessRole,
      channels: job.channels.reduce((acc, channel) => {
        const channelStatus = job.executionStatus[channel];
        acc[channel] = {
          status: channelStatus?.status || 'pending',
          deliveredAt: channelStatus?.deliveredAt,
          sentAt: channelStatus?.sentAt,
          error: channelStatus?.error,
          cost: channelStatus?.cost || 0
        };
        return acc;
      }, {} as Record<string, any>)
    }));
  }, [job]);

  // Mock execution timeline based on job status
  const executionTimeline = useMemo(() => {
    if (!job) return [];
    
    const timeline = [
      {
        step: 'Job Created from Business Event',
        status: 'completed',
        timestamp: job.createdAt,
        description: `Generated from ${businessEvent?.eventType || 'business event'} for ${businessEvent?.contactName || 'customer'}`
      },
      {
        step: 'Recipients Processed',
        status: 'completed',
        timestamp: job.createdAt,
        description: `${job.recipients.total} recipients loaded from business context`
      },
      {
        step: 'Content Generated',
        status: 'completed',
        timestamp: job.createdAt,
        description: `Message content prepared using template ${job.templateId}`
      }
    ];

    if (job.scheduledAt) {
      timeline.push({
        step: 'Job Scheduled',
        status: 'completed',
        timestamp: job.scheduledAt,
        description: `Scheduled for execution at ${new Date(job.triggerDate).toLocaleString()}`
      });
    }

    if (job.executedAt) {
      timeline.push({
        step: 'Execution Started',
        status: 'completed',
        timestamp: job.executedAt,
        description: 'Message delivery initiated across all channels'
      });

      job.channels.forEach(channel => {
        const channelStatus = job.executionStatus[channel];
        if (channelStatus) {
          timeline.push({
            step: `${channel.toUpperCase()} Delivery`,
            status: channelStatus.status === 'delivered' ? 'completed' : 
                   channelStatus.status === 'failed' ? 'failed' : 'in_progress',
            timestamp: channelStatus.sentAt || job.executedAt!,
            description: channelStatus.status === 'delivered' 
              ? `${job.recipients.total} messages delivered successfully`
              : channelStatus.status === 'failed'
                ? `Delivery failed: ${channelStatus.error || 'Unknown error'}`
                : `${job.recipients.successful}/${job.recipients.total} delivered`
          });
        }
      });
    }

    if (job.completedAt) {
      timeline.push({
        step: 'Job Completed',
        status: 'completed',
        timestamp: job.completedAt,
        description: `All deliveries completed with ${job.successRate}% success rate`
      });
    }

    return timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [job, businessEvent]);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    toast.success('Job data refreshed', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleJobAction = (action: string) => {
    toast.success(`${action} action triggered`, {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleBack = () => {
    navigate('/vani/jobs');
  };

  const handleViewBusinessEvent = () => {
    if (businessEvent) {
      navigate(`/vani/events/${businessEvent.id}`);
    }
  };

  const handleViewContract = () => {
    if (contract) {
      navigate(`/contracts/${contract.id}`);
    }
  };

  // Channel icons
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      case 'widget': return <Monitor className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  // Status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" style={{ color: colors.semantic.success }} />;
      case 'failed':
        return <XCircle className="w-4 h-4" style={{ color: colors.semantic.error }} />;
      case 'in_progress':
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
      year: 'numeric',
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
              The communication job you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
              style={{ background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})` }}
            >
              Back to Jobs
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
            <span>Back</span>
          </button>
          
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold" style={{ color: colors.utility.primaryText }}>
                {job.jobName}
              </h1>
              <VaNiStatusBadge status={job.status as any} size="lg" />
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${colors.brand.primary}20`,
                  color: colors.brand.primary
                }}
              >
                {job.jobType}
              </div>
            </div>
            <p className="text-sm mt-1" style={{ color: colors.utility.secondaryText }}>
              Job ID: {job.id} • Created {formatDate(job.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80 disabled:opacity-50"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Business Event Link */}
          {businessEvent && (
            <button
              onClick={handleViewBusinessEvent}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
              style={{
                borderColor: `${colors.brand.primary}40`,
                backgroundColor: `${colors.brand.primary}10`,
                color: colors.brand.primary
              }}
            >
              <Activity className="w-4 h-4" />
              <span>View Source Event</span>
            </button>
          )}

          {/* Contract Link */}
          {contract && (
            <button
              onClick={handleViewContract}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
              style={{
                borderColor: `${colors.semantic.success}40`,
                backgroundColor: `${colors.semantic.success}10`,
                color: colors.semantic.success
              }}
            >
              <FileText className="w-4 h-4" />
              <span>View Contract</span>
            </button>
          )}

          {(job.status === 'failed' || job.status === 'cancelled') && (
            <button
              onClick={() => handleJobAction('retry')}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
              style={{
                borderColor: `${colors.semantic.success}40`,
                backgroundColor: `${colors.semantic.success}10`,
                color: colors.semantic.success
              }}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          )}

          <button
            onClick={() => handleJobAction('duplicate')}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8" style={{ color: colors.brand.primary }} />
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.utility.primaryText }}>
                  {job.recipients.total}
                </p>
                <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                  Recipients
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8" style={{ color: colors.semantic.success }} />
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.utility.primaryText }}>
                  {job.recipients.successful}
                </p>
                <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                  Delivered
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8" style={{ color: colors.semantic.warning }} />
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.utility.primaryText }}>
                  {job.successRate}%
                </p>
                <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                  Success Rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8" style={{ color: colors.semantic.success }} />
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.utility.primaryText }}>
                  {job.cost}
                </p>
                <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                  Total Cost
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card style={{ backgroundColor: colors.utility.secondaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
        <CardHeader className="pb-0">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'business', label: 'Business Context', icon: Building },
              { id: 'recipients', label: 'Recipients', icon: Users },
              { id: 'logs', label: 'Execution Logs', icon: Clock },
              { id: 'settings', label: 'Settings', icon: Edit }
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.utility.primaryText }}>Job Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Type:</span>
                        <span style={{ color: colors.utility.primaryText }}>{job.jobType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Priority:</span>
                        <span style={{ color: colors.utility.primaryText }}>{job.priority}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Source Module:</span>
                        <span style={{ color: colors.brand.primary }}>{job.sourceModule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.utility.secondaryText }}>Channels:</span>
                        <div className="flex space-x-2">
                          {job.channels.map((channel) => (
                            <div key={channel} className="flex items-center space-x-1">
                              {getChannelIcon(channel)}
                              <span style={{ color: colors.utility.primaryText }}>{channel}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {job.scheduledAt && (
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Scheduled:</span>
                          <span style={{ color: colors.utility.primaryText }}>{formatDate(job.scheduledAt)}</span>
                        </div>
                      )}
                      {job.executedAt && (
                        <div className="flex justify-between">
                          <span style={{ color: colors.utility.secondaryText }}>Executed:</span>
                          <span style={{ color: colors.utility.primaryText }}>{formatDate(job.executedAt)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Execution Timeline */}
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.utility.primaryText }}>Execution Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {executionTimeline.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          {getStatusIcon(step.status)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                              {step.step}
                            </p>
                            <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                              {step.description}
                            </p>
                            <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                              {formatDate(step.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Business Context Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              {/* Source Business Event */}
              {businessEvent && (
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center space-x-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Activity className="w-5 h-5" />
                      <span>Source Business Event</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="p-4 border rounded-lg cursor-pointer transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: `${colors.brand.primary}10`,
                        borderColor: `${colors.brand.primary}40`
                      }}
                      onClick={handleViewBusinessEvent}
                    >
                      <div className="flex items-center space-x-4">
                        <div style={{ color: colors.brand.primary }}>
                          {getEventTypeIcon(businessEvent.eventType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium" style={{ color: colors.utility.primaryText }}>
                              {businessEvent.entityName}
                            </h3>
                            <VaNiStatusBadge status={businessEvent.status as any} variant="event" size="sm" />
                            <span
                              className="px-2 py-0.5 text-xs rounded-full"
                              style={{
                                backgroundColor: `${colors.semantic.info}20`,
                                color: colors.semantic.info
                              }}
                            >
                              {businessEvent.sourceModule}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm" style={{ color: colors.utility.secondaryText }}>
                            <span>{businessEvent.contactName}</span>
                            <span>•</span>
                            <span>{formatDate(businessEvent.eventDate)}</span>
                            <span>•</span>
                            <span>Priority {businessEvent.priority}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contract Information */}
              {contract && (
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center space-x-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <FileText className="w-5 h-5" />
                      <span>Contract Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Contract Name:</span>
                        <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {contract.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Customer:</span>
                        <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {contract.customerName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Contract Value:</span>
                        <p className="font-medium" style={{ color: colors.semantic.success }}>
                          ₹{contract.totalValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Status:</span>
                        <VaNiStatusBadge status={contract.status as any} size="sm" />
                      </div>
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Services Progress:</span>
                        <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {contract.servicesCompleted}/{contract.totalServices} completed
                        </p>
                      </div>
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Payment Progress:</span>
                        <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {contract.paymentsReceived}/{contract.totalPayments} received
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: `${colors.utility.primaryText}20` }}>
                      <button
                        onClick={handleViewContract}
                        className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
                        style={{
                          borderColor: `${colors.brand.primary}40`,
                          backgroundColor: `${colors.brand.primary}10`,
                          color: colors.brand.primary
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Full Contract Details</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Business Context Details */}
              <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.utility.primaryText }}>Job Business Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {job.businessContext.contractId && (
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Contract ID:</span>
                        <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {job.businessContext.contractId}
                        </p>
                      </div>
                    )}
                    {job.businessContext.serviceNumber && (
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Service Number:</span>
                        <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {job.businessContext.serviceNumber} of {job.businessContext.totalServices}
                        </p>
                      </div>
                    )}
                    {job.businessContext.amount && (
                      <div>
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Amount:</span>
                        <p className="font-medium" style={{ color: colors.semantic.success }}>
                          ₹{job.businessContext.amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center space-x-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Zap className="w-5 h-5" />
                      <span>Related Jobs ({relatedJobs.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VaNiList variant="business" spacing="compact">
                      {relatedJobs.map((relatedJob) => (
                        <VaNiListItem
                          key={relatedJob.id}
                          variant="compact"
                          onClick={() => navigate(`/vani/jobs/${relatedJob.id}`)}
                          style={{
                            backgroundColor: colors.utility.secondaryBackground,
                            borderColor: `${colors.utility.primaryText}15`
                          }}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <VaNiStatusBadge status={relatedJob.status as any} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p 
                                className="font-medium truncate text-sm"
                                style={{ color: colors.utility.primaryText }}
                              >
                                {relatedJob.jobName}
                              </p>
                              <p 
                                className="text-xs truncate"
                                style={{ color: colors.utility.secondaryText }}
                              >
                                {relatedJob.jobType} • {relatedJob.recipients.total} recipients • {relatedJob.cost}
                              </p>
                            </div>
                            <div className="text-right">
                              <p 
                                className="text-sm font-medium"
                                style={{ color: colors.utility.primaryText }}
                              >
                                {relatedJob.successRate}%
                              </p>
                            </div>
                          </div>
                        </VaNiListItem>
                      ))}
                    </VaNiList>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Recipients Tab */}
          {activeTab === 'recipients' && (
            <div className="space-y-4">
              <VaNiListHeader
                title={`Recipients (${recipientResults.length})`}
                actions={
                  <button
                    onClick={() => console.log('Export recipients')}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                    style={{
                      borderColor: `${colors.utility.primaryText}20`,
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText
                    }}
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                }
              />
              
              <VaNiList variant="jobs" spacing="compact">
                {recipientResults.map((recipient) => (
                  <VaNiListItem
                    key={recipient.id}
                    variant="default"
                    clickable={false}
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}15`
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                            {recipient.name}
                          </p>
                          <span 
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: `${colors.brand.secondary}20`,
                              color: colors.brand.secondary
                            }}
                          >
                            {recipient.businessRole}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                          {recipient.email} • {recipient.phone}
                        </p>
                      </div>
                      
                      <div className="flex space-x-4">
                        {Object.entries(recipient.channels).map(([channel, result]) => (
                          <div key={channel} className="text-center">
                            <div className="flex items-center space-x-1 mb-1">
                              {getChannelIcon(channel)}
                              <VaNiStatusBadge status={result.status as any} size="sm" />
                            </div>
                            {result.cost > 0 && (
                              <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                                ₹{result.cost}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </VaNiListItem>
                ))}
              </VaNiList>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <p style={{ color: colors.utility.secondaryText }}>
                Detailed execution logs and delivery tracking information.
              </p>
              <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                <CardContent className="p-4">
                  <pre className="text-sm whitespace-pre-wrap" style={{ color: colors.utility.primaryText }}>
{`[${formatDate(job.createdAt)}] Job created from business event: ${businessEvent?.id}
[${formatDate(job.createdAt)}] Business context loaded: Contract ${job.businessContext.contractId}
[${formatDate(job.createdAt)}] Recipients processed: ${job.recipients.total} from business event
[${formatDate(job.createdAt)}] Template ${job.templateId} selected for ${job.channels.join(', ')}
${job.scheduledAt ? `[${formatDate(job.scheduledAt)}] Job scheduled for execution\n` : ''}${job.executedAt ? `[${formatDate(job.executedAt)}] Execution started
${job.channels.map(channel => {
  const status = job.executionStatus[channel];
  return status ? `[${formatDate(status.sentAt || job.executedAt!)}] ${channel.toUpperCase()}: ${status.status} - Cost: ₹${status.cost}` : '';
}).filter(Boolean).join('\n')}` : ''}
${job.completedAt ? `[${formatDate(job.completedAt)}] Job completed with ${job.successRate}% success rate` : ''}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.utility.primaryText }}>
                    Job Settings
                  </h3>
                  <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                    Manage job configuration and actions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}20` }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.utility.primaryText }}>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <button
                      onClick={() => handleJobAction('duplicate')}
                      className="w-full flex items-center space-x-2 p-3 border rounded-lg transition-colors hover:opacity-80"
                      style={{
                        borderColor: `${colors.utility.primaryText}20`,
                        backgroundColor: colors.utility.secondaryBackground,
                        color: colors.utility.primaryText
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicate Job</span>
                    </button>
                    
                    <button
                      onClick={() => handleJobAction('export')}
                      className="w-full flex items-center space-x-2 p-3 border rounded-lg transition-colors hover:opacity-80"
                      style={{
                        borderColor: `${colors.utility.primaryText}20`,
                        backgroundColor: colors.utility.secondaryBackground,
                        color: colors.utility.primaryText
                      }}
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Results</span>
                    </button>

                    <button
                      onClick={handleViewBusinessEvent}
                      className="w-full flex items-center space-x-2 p-3 border rounded-lg transition-colors hover:opacity-80"
                      style={{
                        borderColor: `${colors.brand.primary}40`,
                        backgroundColor: `${colors.brand.primary}10`,
                        color: colors.brand.primary
                      }}
                    >
                      <Activity className="w-4 h-4" />
                      <span>View Source Event</span>
                    </button>
                    <button onClick={() => navigate(`/vani/templates/${job.templateId}`)}>
                    <FileText className="w-4 h-4" />
                    <span>View Template</span>
                    </button>
                    <button
                    onClick={() => navigate(`/vani/jobs/${job.id}/communications`)}
                    className="flex items-center space-x-2 px-4 py-2 border rounded-lg"
                    >
                    <MessageSquare className="w-4 h-4" />
                     <span>View Messages</span>
                    </button>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.semantic.error}40` }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.semantic.error }}>Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <button
                      onClick={() => handleJobAction('delete')}
                      className="w-full flex items-center space-x-2 p-3 border rounded-lg transition-colors hover:opacity-80"
                      style={{
                        borderColor: `${colors.semantic.error}40`,
                        backgroundColor: `${colors.semantic.error}10`,
                        color: colors.semantic.error
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Job</span>
                    </button>
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

export default JobDetailsPage;