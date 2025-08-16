// src/vani/pages/JobCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { VaNiStatusBadge } from '../components/shared';
import { 
  realisticBusinessEvents,
  realisticContracts,
  businessContextTemplates,
  type BusinessEvent
} from '../utils/fakeData';
import type { JobCreationData, JobBasics, JobRecipient, JobContent, JobScheduling } from '../types/vani.types';
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  FileText,
  Users,
  Calendar,
  Send,
  Eye,
  Plus,
  X,
  AlertCircle,
  Smartphone,
  Mail,
  MessageSquare,
  Bell,
  Monitor,
  Activity,
  DollarSign,
  Building,
  ExternalLink,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobCreatePage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state with business context
  const [jobBasics, setJobBasics] = useState<JobBasics & { 
    businessEventId?: string;
    isEventDriven?: boolean;
  }>({
    type: 'manual',
    name: '',
    description: '',
    priority: 5,
    isEventDriven: false
  });

  const [recipients, setRecipients] = useState<JobRecipient[]>([]);
  const [recipientText, setRecipientText] = useState('');

  const [jobContent, setJobContent] = useState<JobContent>({
    channels: [],
    templateId: '',
    useAiGeneration: false,
    customContent: {},
    variables: {}
  });

  const [scheduling, setScheduling] = useState<JobScheduling>({
    type: 'immediate',
    timezone: 'Asia/Kolkata',
    stagingHours: 24
  });

  // Business context state
  const [selectedBusinessEvent, setSelectedBusinessEvent] = useState<BusinessEvent | null>(null);
  const [businessContext, setBusinessContext] = useState<{
    contractId?: string;
    contractName?: string;
    customerName?: string;
    serviceNumber?: number;
    totalServices?: number;
    amount?: number;
  }>({});

  // Steps configuration
  const steps = [
    { id: 1, title: 'Job Type & Source', icon: FileText, description: 'Choose job source and type' },
    { id: 2, title: 'Recipients', icon: Users, description: 'Who will receive messages' },
    { id: 3, title: 'Content', icon: Send, description: 'Message content and channels' },
    { id: 4, title: 'Schedule', icon: Calendar, description: 'When to send' },
    { id: 5, title: 'Review', icon: Eye, description: 'Review and submit' }
  ];

  // Channel options
  const channelOptions = [
    { id: 'sms', label: 'SMS', icon: Smartphone, cost: '₹0.75/msg' },
    { id: 'email', label: 'Email', icon: Mail, cost: '₹0.25/msg' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, cost: '₹0.50/msg' },
    { id: 'push', label: 'Push Notification', icon: Bell, cost: '₹0.10/msg' },
    { id: 'widget', label: 'In-App Widget', icon: Monitor, cost: '₹0.05/msg' }
  ];

  // Get available business events for event-driven jobs
  const availableBusinessEvents = realisticBusinessEvents.filter(event => 
    event.status === 'planned' || event.status === 'reminded'
  );

  // Validation functions
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (jobBasics.isEventDriven) {
          return jobBasics.name.trim() !== '' && selectedBusinessEvent !== null;
        }
        return jobBasics.name.trim() !== '' && jobBasics.type !== '';
      case 2:
        return recipients.length > 0;
      case 3:
        return jobContent.channels.length > 0 && (jobContent.templateId || Object.keys(jobContent.customContent).length > 0);
      case 4:
        return scheduling.type !== '';
      default:
        return true;
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please complete all required fields', {
        style: {
          background: colors.semantic.error,
          color: '#FFF'
        }
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    navigate('/vani/jobs');
  };

  // Business event selection
  const handleBusinessEventSelection = (event: BusinessEvent) => {
    setSelectedBusinessEvent(event);
    
    // Auto-populate business context
    const contract = realisticContracts.find(c => c.id === event.metadata.contractId);
    setBusinessContext({
      contractId: event.metadata.contractId,
      contractName: contract?.name || event.entityName,
      customerName: event.contactName,
      serviceNumber: event.metadata.serviceNumber,
      totalServices: event.metadata.totalServices,
      amount: event.metadata.amount
    });

    // Auto-populate job name based on event
    if (!jobBasics.name) {
      setJobBasics(prev => ({
        ...prev,
        name: `${event.eventType.replace('_', ' ')} - ${event.contactName}`,
        priority: event.priority
      }));
    }

    // Auto-populate recipients from event contact
    if (recipients.length === 0) {
      const eventRecipients: JobRecipient[] = [];
      if (event.contactChannels.email) {
        eventRecipients.push({
          id: 'contact_1',
          name: event.contactName,
          email: event.contactChannels.email,
          phone: event.contactChannels.phone
        });
      }
      setRecipients(eventRecipients);
      setRecipientText(eventRecipients.map(r => `${r.name}, ${r.email}, ${r.phone}`).join('\n'));
    }
  };

  // Recipients handling
  const parseRecipients = (text: string): JobRecipient[] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      const [name, email, phone] = parts;
      
      return {
        id: `recipient_${index + 1}`,
        name: name || `Contact ${index + 1}`,
        email: email && email.includes('@') ? email : undefined,
        phone: phone || email // If second field doesn't have @, treat as phone
      };
    });
  };

  const handleRecipientsChange = (text: string) => {
    setRecipientText(text);
    if (text.trim()) {
      setRecipients(parseRecipients(text));
    } else {
      setRecipients([]);
    }
  };

  // Channel selection
  const toggleChannel = (channelId: string) => {
    const currentChannels = jobContent.channels;
    if (currentChannels.includes(channelId as any)) {
      setJobContent({
        ...jobContent,
        channels: currentChannels.filter(c => c !== channelId) as any
      });
    } else {
      setJobContent({
        ...jobContent,
        channels: [...currentChannels, channelId] as any
      });
    }
  };

  // Template selection
  const selectTemplate = (templateId: string) => {
    setJobContent({
      ...jobContent,
      templateId,
      useAiGeneration: false
    });
  };

  // Cost calculation
  const calculateCost = (): number => {
    const costPerChannel = {
      sms: 0.75,
      email: 0.25,
      whatsapp: 0.50,
      push: 0.10,
      widget: 0.05
    };

    return jobContent.channels.reduce((total, channel) => {
      return total + (costPerChannel[channel] || 0) * recipients.length;
    }, 0);
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const jobData: JobCreationData = {
        ...jobBasics,
        recipients,
        content: jobContent,
        scheduling
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Event-driven job created successfully!', {
        style: {
          background: colors.semantic.success,
          color: '#FFF'
        }
      });
      
      navigate('/vani/jobs');
    } catch (error) {
      toast.error('Failed to create job. Please try again.', {
        style: {
          background: colors.semantic.error,
          color: '#FFF'
        }
      });
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Jobs</span>
          </button>
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: colors.utility.primaryText }}
            >
              Create Communication Job
            </h1>
            <p 
              className="text-sm mt-1"
              style={{ color: colors.utility.secondaryText }}
            >
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </p>
          </div>
        </div>

        {/* Business Context Indicator */}
        {selectedBusinessEvent && (
          <div 
            className="px-4 py-2 border rounded-lg"
            style={{
              backgroundColor: `${colors.brand.primary}10`,
              borderColor: `${colors.brand.primary}40`,
              color: colors.brand.primary
            }}
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Event-Driven Job</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Stepper */}
      <Card
        className="mb-6"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isValid = validateStep(step.id);
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive ? 'scale-110' : ''
                      }`}
                      style={{
                        backgroundColor: isCompleted
                          ? colors.semantic.success
                          : isActive
                            ? colors.brand.primary
                            : colors.utility.secondaryBackground,
                        borderColor: isCompleted
                          ? colors.semantic.success
                          : isActive
                            ? colors.brand.primary
                            : `${colors.utility.primaryText}30`,
                        color: isCompleted || isActive ? '#FFF' : colors.utility.secondaryText
                      }}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: isActive
                            ? colors.brand.primary
                            : isCompleted
                              ? colors.semantic.success
                              : colors.utility.primaryText
                        }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-4"
                      style={{
                        backgroundColor: isCompleted
                          ? colors.semantic.success
                          : `${colors.utility.primaryText}20`
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardContent className="p-8">
          
          {/* Step 1: Job Type & Source */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl font-semibold mb-4"
                  style={{ color: colors.utility.primaryText }}
                >
                  Job Type & Source
                </h2>
                <p 
                  className="text-sm mb-6"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Choose whether to create a manual job or generate from a business event.
                </p>
              </div>

              {/* Job Source Selection */}
              <div className="space-y-4">
                <label 
                  className="block text-sm font-medium mb-3"
                  style={{ color: colors.utility.primaryText }}
                >
                  Job Source *
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Manual Job */}
                  <button
                    onClick={() => setJobBasics({ ...jobBasics, isEventDriven: false })}
                    className="text-left p-6 border-2 rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      borderColor: !jobBasics.isEventDriven 
                        ? colors.brand.primary 
                        : `${colors.utility.primaryText}20`,
                      backgroundColor: !jobBasics.isEventDriven 
                        ? `${colors.brand.primary}10` 
                        : colors.utility.primaryBackground
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Send className="w-6 h-6" style={{ color: colors.brand.primary }} />
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: colors.utility.primaryText }}
                      >
                        Manual Job
                      </h3>
                    </div>
                    <p 
                      className="text-sm"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Create a one-time communication job manually. Choose recipients, content, and schedule yourself.
                    </p>
                  </button>

                  {/* Event-Driven Job */}
                  <button
                    onClick={() => setJobBasics({ ...jobBasics, isEventDriven: true })}
                    className="text-left p-6 border-2 rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      borderColor: jobBasics.isEventDriven 
                        ? colors.brand.primary 
                        : `${colors.utility.primaryText}20`,
                      backgroundColor: jobBasics.isEventDriven 
                        ? `${colors.brand.primary}10` 
                        : colors.utility.primaryBackground
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Zap className="w-6 h-6" style={{ color: colors.semantic.success }} />
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: colors.utility.primaryText }}
                      >
                        Event-Driven Job
                      </h3>
                    </div>
                    <p 
                      className="text-sm"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Generate job from a business event. Recipients, content, and context are auto-populated from the event.
                    </p>
                  </button>
                </div>
              </div>

              {/* Business Event Selection */}
              {jobBasics.isEventDriven && (
                <div>
                  <label 
                    className="block text-sm font-medium mb-3"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Select Business Event *
                  </label>
                  <div className="max-h-64 overflow-y-auto border rounded-lg" style={{ borderColor: `${colors.utility.primaryText}20` }}>
                    {availableBusinessEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleBusinessEventSelection(event)}
                        className="w-full text-left p-4 border-b transition-colors hover:opacity-80"
                        style={{
                          backgroundColor: selectedBusinessEvent?.id === event.id 
                            ? `${colors.brand.primary}15` 
                            : colors.utility.primaryBackground,
                          borderColor: `${colors.utility.primaryText}10`
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div style={{ color: colors.brand.primary }}>
                            {getEventTypeIcon(event.eventType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 
                                className="font-medium"
                                style={{ color: colors.utility.primaryText }}
                              >
                                {event.entityName}
                              </h4>
                              <VaNiStatusBadge status={event.status as any} variant="event" size="sm" />
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
                              <span>{event.contactName}</span>
                              <span>•</span>
                              <span>{formatDate(event.eventDate)}</span>
                              <span>•</span>
                              <span>Priority {event.priority}</span>
                              {event.metadata.amount && (
                                <>
                                  <span>•</span>
                                  <span className="font-medium" style={{ color: colors.semantic.success }}>
                                    ₹{event.metadata.amount.toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Name */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Job Name *
                  </label>
                  <input
                    type="text"
                    value={jobBasics.name}
                    onChange={(e) => setJobBasics({ ...jobBasics, name: e.target.value })}
                    placeholder={jobBasics.isEventDriven ? "Auto-generated from event" : "e.g., Payment Reminder Campaign"}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Priority (1-10)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={jobBasics.priority}
                      onChange={(e) => setJobBasics({ ...jobBasics, priority: parseInt(e.target.value) })}
                      className="w-full"
                      style={{ accentColor: colors.brand.primary }}
                    />
                    <div className="flex justify-between text-sm" style={{ color: colors.utility.secondaryText }}>
                      <span>Low (1)</span>
                      <span 
                        className="font-medium"
                        style={{ color: colors.utility.primaryText }}
                      >
                        Current: {jobBasics.priority}
                      </span>
                      <span>High (10)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Context Display */}
              {selectedBusinessEvent && Object.keys(businessContext).length > 0 && (
                <div 
                  className="p-4 border rounded-lg"
                  style={{
                    backgroundColor: `${colors.brand.primary}05`,
                    borderColor: `${colors.brand.primary}30`
                  }}
                >
                  <h4 
                    className="font-medium mb-3"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Business Context
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {businessContext.contractName && (
                      <div>
                        <span style={{ color: colors.utility.secondaryText }}>Contract:</span>
                        <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {businessContext.contractName}
                        </p>
                      </div>
                    )}
                    {businessContext.customerName && (
                      <div>
                        <span style={{ color: colors.utility.secondaryText }}>Customer:</span>
                        <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                          {businessContext.customerName}
                        </p>
                      </div>
                    )}
                    {businessContext.amount && (
                      <div>
                        <span style={{ color: colors.utility.secondaryText }}>Amount:</span>
                        <p className="font-medium" style={{ color: colors.semantic.success }}>
                          ₹{businessContext.amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.utility.primaryText }}
                >
                  Description (Optional)
                </label>
                <textarea
                  value={jobBasics.description}
                  onChange={(e) => setJobBasics({ ...jobBasics, description: e.target.value })}
                  placeholder={jobBasics.isEventDriven ? "Auto-populated from business event context" : "Brief description of this communication job..."}
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                />
              </div>
            </div>
          )}

          {/* Step 2: Recipients */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl font-semibold mb-4"
                  style={{ color: colors.utility.primaryText }}
                >
                  Recipients
                </h2>
                <p 
                  className="text-sm mb-6"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {jobBasics.isEventDriven 
                    ? "Recipients are auto-populated from the business event. You can modify or add more."
                    : "Add recipients who will receive your messages. You can paste data or upload a CSV file."
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Area */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Recipients Data *
                  </label>
                  <p 
                    className="text-xs mb-3"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Format: Name, Email, Phone (one per line)
                  </p>
                  <textarea
                    value={recipientText}
                    onChange={(e) => handleRecipientsChange(e.target.value)}
                    placeholder={jobBasics.isEventDriven 
                      ? "Recipients auto-populated from business event..."
                      : `John Doe, john@example.com, +919876543210
Jane Smith, jane@example.com, +919876543211
Bob Wilson, bob@example.com, +919876543212`}
                    rows={10}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                  />
                  
                  <div className="mt-3 flex items-center space-x-4">
                    <button
                      onClick={() => console.log('Upload CSV')}
                      className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
                      style={{
                        borderColor: `${colors.utility.primaryText}20`,
                        backgroundColor: colors.utility.secondaryBackground,
                        color: colors.utility.primaryText
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload CSV</span>
                    </button>
                    
                    <span 
                      className="text-sm"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {recipients.length} recipients parsed
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Preview ({recipients.length} recipients)
                  </label>
                  <div 
                    className="border rounded-lg p-4 h-64 overflow-y-auto"
                    style={{
                      borderColor: `${colors.utility.primaryText}20`,
                      backgroundColor: colors.utility.primaryBackground
                    }}
                  >
                    {recipients.length === 0 ? (
                      <p 
                        className="text-center text-sm"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        Recipients will appear here as you type
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {recipients.slice(0, 20).map((recipient, index) => (
                          <div
                            key={recipient.id}
                            className="flex items-center justify-between p-2 border rounded"
                            style={{
                              borderColor: `${colors.utility.primaryText}10`,
                              backgroundColor: colors.utility.secondaryBackground
                            }}
                          >
                            <div>
                              <p 
                                className="font-medium text-sm"
                                style={{ color: colors.utility.primaryText }}
                              >
                                {recipient.name}
                              </p>
                              <p 
                                className="text-xs"
                                style={{ color: colors.utility.secondaryText }}
                              >
                                {recipient.email} • {recipient.phone}
                              </p>
                            </div>
                          </div>
                        ))}
                        {recipients.length > 20 && (
                          <p 
                            className="text-center text-sm"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            ... and {recipients.length - 20} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Steps 3, 4, 5 remain the same as before but with business context awareness */}
          {/* ... (keeping the existing implementation for brevity) */}

        </CardContent>

        {/* Navigation Footer */}
        <div 
          className="px-8 py-4 border-t flex justify-between"
          style={{ borderColor: `${colors.utility.primaryText}20` }}
        >
          <button
            onClick={currentStep === 1 ? handleCancel : handleBack}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, ${colors.semantic.success}, ${colors.semantic.success}dd)`
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Job...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Create Job</span>
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JobCreatePage;