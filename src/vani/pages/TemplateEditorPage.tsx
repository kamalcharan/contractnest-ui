// src/vani/pages/TemplateEditorPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { VaNiStatusBadge } from '../components/shared';
import { 
  businessContextTemplates,
  realisticBusinessEvents,
  realisticContracts
} from '../utils/fakeData';
import { 
  ArrowLeft,
  Save,
  Eye,
  Copy,
  Trash2,
  Plus,
  X,
  FileText,
  Mail,
  Smartphone,
  MessageSquare,
  Bell,
  Monitor,
  Zap,
  Calendar,
  DollarSign,
  Building,
  User,
  AlertCircle,
  CheckCircle,
  Settings,
  Code,
  Palette,
  Type
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  example: string;
  category: 'customer' | 'contract' | 'service' | 'payment' | 'system';
  required: boolean;
}

interface TemplateContent {
  subject?: string;
  body: string;
  variables: string[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'service_reminders' | 'payment_reminders' | 'contract_notifications' | 'emergency_alerts' | 'surveys';
  eventTypes: string[];
  channels: Array<'email' | 'sms' | 'whatsapp' | 'push' | 'widget'>;
  content: {
    email?: TemplateContent;
    sms?: TemplateContent;
    whatsapp?: TemplateContent;
    push?: TemplateContent;
    widget?: TemplateContent;
  };
  variables: string[];
  isActive: boolean;
  usageCount?: number;
  lastUsed?: string;
  businessRules?: {
    triggerDays?: number[];
    escalationRules?: any;
  };
}

const TemplateEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const isEditing = !!id && id !== 'create';
  const isCreating = id === 'create';

  // State
  const [template, setTemplate] = useState<Template>({
    id: '',
    name: '',
    description: '',
    category: 'service_reminders',
    eventTypes: [],
    channels: ['email'],
    content: {
      email: { body: '', variables: [] }
    },
    variables: [],
    isActive: true
  });

  const [activeChannel, setActiveChannel] = useState<'email' | 'sms' | 'whatsapp' | 'push' | 'widget'>('email');
  const [showPreview, setShowPreview] = useState(false);
  const [showVariables, setShowVariables] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Available variables based on business context
  const availableVariables: TemplateVariable[] = [
    // Customer variables
    { key: 'customerName', label: 'Customer Name', description: 'Full customer/company name', example: 'Agilent Technologies', category: 'customer', required: true },
    { key: 'contactName', label: 'Contact Person', description: 'Primary contact person name', example: 'Pradeep Singh', category: 'customer', required: false },
    { key: 'customerEmail', label: 'Customer Email', description: 'Primary customer email', example: 'facilities@agilent.com', category: 'customer', required: false },
    { key: 'customerPhone', label: 'Customer Phone', description: 'Primary customer phone number', example: '+919876543210', category: 'customer', required: false },
    
    // Contract variables
    { key: 'contractId', label: 'Contract ID', description: 'Unique contract identifier', example: '892323', category: 'contract', required: true },
    { key: 'contractName', label: 'Contract Name', description: 'Full contract name', example: 'HVAC Maintenance Contract', category: 'contract', required: false },
    { key: 'contractValue', label: 'Contract Value', description: 'Total contract value', example: '₹48,000', category: 'contract', required: false },
    { key: 'contractStatus', label: 'Contract Status', description: 'Current contract status', example: 'Active', category: 'contract', required: false },
    
    // Service variables
    { key: 'serviceDate', label: 'Service Date', description: 'Scheduled service date', example: 'August 15, 2025', category: 'service', required: false },
    { key: 'serviceTime', label: 'Service Time', description: 'Scheduled service time', example: '9:00 AM', category: 'service', required: false },
    { key: 'serviceNumber', label: 'Service Number', description: 'Current service number', example: '8', category: 'service', required: false },
    { key: 'totalServices', label: 'Total Services', description: 'Total number of services', example: '12', category: 'service', required: false },
    { key: 'technician', label: 'Technician Name', description: 'Assigned technician name', example: 'Rajesh Kumar', category: 'service', required: false },
    { key: 'estimatedDuration', label: 'Service Duration', description: 'Estimated service duration', example: '2 hours', category: 'service', required: false },
    
    // Payment variables
    { key: 'amount', label: 'Amount', description: 'Payment or service amount', example: '₹12,000', category: 'payment', required: false },
    { key: 'dueDate', label: 'Due Date', description: 'Payment due date', example: 'August 30, 2025', category: 'payment', required: false },
    { key: 'invoiceNumber', label: 'Invoice Number', description: 'Invoice reference number', example: 'INV-2025-Q3-001', category: 'payment', required: false },
    { key: 'paymentLink', label: 'Payment Link', description: 'Online payment URL', example: 'https://payments.contractnest.com/pay/...', category: 'payment', required: false },
    
    // System variables
    { key: 'currentDate', label: 'Current Date', description: 'Today\'s date', example: 'August 15, 2025', category: 'system', required: false },
    { key: 'companyName', label: 'Company Name', description: 'Your company name', example: 'ContractNest Services', category: 'system', required: false },
    { key: 'supportEmail', label: 'Support Email', description: 'Customer support email', example: 'support@contractnest.com', category: 'system', required: false },
    { key: 'supportPhone', label: 'Support Phone', description: 'Customer support phone', example: '+91-80-1234-5678', category: 'system', required: false }
  ];

  // Load template data if editing
  useEffect(() => {
    if (isEditing) {
      const existingTemplate = businessContextTemplates.find(t => t.id === id);
      if (existingTemplate) {
        // Convert existing template format to new format
        setTemplate({
          id: existingTemplate.id,
          name: existingTemplate.name,
          description: existingTemplate.description,
          category: existingTemplate.category as any,
          eventTypes: existingTemplate.eventTypes,
          channels: existingTemplate.channels as any,
          content: {
            email: existingTemplate.content.email ? {
              subject: existingTemplate.content.email.subject,
              body: existingTemplate.content.email.body,
              variables: existingTemplate.variables
            } : undefined,
            sms: existingTemplate.content.sms ? {
              body: existingTemplate.content.sms.body,
              variables: existingTemplate.variables
            } : undefined,
            whatsapp: existingTemplate.content.whatsapp ? {
              body: existingTemplate.content.whatsapp.body || generateDefaultWhatsAppContent(),
              variables: existingTemplate.variables
            } : undefined
          },
          variables: existingTemplate.variables,
          isActive: existingTemplate.isActive,
          usageCount: existingTemplate.usageCount,
          lastUsed: existingTemplate.lastUsed,
          businessRules: existingTemplate.businessRules
        });
      }
    }
  }, [id, isEditing]);

  // Generate default content for channels
  const generateDefaultWhatsAppContent = () => {
    return `🔧 *Service Reminder*

📅 *Date:* {{serviceDate}}
⏰ *Time:* {{serviceTime}}
👨‍🔧 *Technician:* {{technician}}
📋 *Service:* {{serviceNumber}} of {{totalServices}}
📄 *Contract:* {{contractId}}

Hello {{customerName}}, this is a reminder for your upcoming service.

Please ensure access to the service area. Reply to confirm or reschedule.`;
  };

  // Channel options
  const channelOptions = [
    { id: 'email' as const, label: 'Email', icon: Mail, placeholder: 'Enter email content...', hasSubject: true },
    { id: 'sms' as const, label: 'SMS', icon: Smartphone, placeholder: 'Enter SMS content (160 chars recommended)...', hasSubject: false },
    { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageSquare, placeholder: 'Enter WhatsApp message...', hasSubject: false },
    { id: 'push' as const, label: 'Push', icon: Bell, placeholder: 'Enter push notification...', hasSubject: true },
    { id: 'widget' as const, label: 'Widget', icon: Monitor, placeholder: 'Enter widget content...', hasSubject: false }
  ];

  // Category options
  const categoryOptions = [
    { value: 'service_reminders', label: 'Service Reminders', icon: Calendar, color: colors.brand.primary },
    { value: 'payment_reminders', label: 'Payment Reminders', icon: DollarSign, color: colors.semantic.warning },
    { value: 'contract_notifications', label: 'Contract Notifications', icon: FileText, color: colors.brand.secondary },
    { value: 'emergency_alerts', label: 'Emergency Alerts', icon: AlertCircle, color: colors.semantic.error },
    { value: 'surveys', label: 'Surveys & Feedback', icon: CheckCircle, color: colors.semantic.success }
  ];

  // Event type options
  const eventTypeOptions = [
    { value: 'service_due', label: 'Service Due' },
    { value: 'payment_due', label: 'Payment Due' },
    { value: 'payment_overdue', label: 'Payment Overdue' },
    { value: 'contract_renewal', label: 'Contract Renewal' },
    { value: 'emergency_service', label: 'Emergency Service' },
    { value: 'service_completed', label: 'Service Completed' },
    { value: 'contract_expiring', label: 'Contract Expiring' }
  ];

  // Variable categories for grouping
  const variablesByCategory = useMemo(() => {
    return availableVariables.reduce((acc, variable) => {
      if (!acc[variable.category]) {
        acc[variable.category] = [];
      }
      acc[variable.category].push(variable);
      return acc;
    }, {} as Record<string, TemplateVariable[]>);
  }, [availableVariables]);

  // Insert variable into content
  const insertVariable = (variableKey: string) => {
    const currentContent = template.content[activeChannel];
    if (!currentContent) return;

    const variableTag = `{{${variableKey}}}`;
    const updatedContent = {
      ...currentContent,
      body: currentContent.body + variableTag,
      variables: [...(currentContent.variables || []), variableKey].filter((v, i, arr) => arr.indexOf(v) === i)
    };

    setTemplate(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [activeChannel]: updatedContent
      },
      variables: [...prev.variables, variableKey].filter((v, i, arr) => arr.indexOf(v) === i)
    }));
  };

  // Update template content for active channel
  const updateChannelContent = (field: 'subject' | 'body', value: string) => {
    const currentContent = template.content[activeChannel] || { body: '', variables: [] };
    const updatedContent = {
      ...currentContent,
      [field]: value
    };

    setTemplate(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [activeChannel]: updatedContent
      }
    }));
  };

  // Toggle channel
  const toggleChannel = (channel: typeof activeChannel) => {
    if (template.channels.includes(channel)) {
      setTemplate(prev => ({
        ...prev,
        channels: prev.channels.filter(c => c !== channel),
        content: {
          ...prev.content,
          [channel]: undefined
        }
      }));
    } else {
      setTemplate(prev => ({
        ...prev,
        channels: [...prev.channels, channel],
        content: {
          ...prev.content,
          [channel]: { body: '', variables: [] }
        }
      }));
    }
  };

  // Generate preview with sample data
  const generatePreview = () => {
    const sampleData = {
      customerName: 'Agilent Technologies',
      contactName: 'Pradeep Singh',
      contractId: '892323',
      contractName: 'HVAC Maintenance Contract',
      serviceDate: 'August 15, 2025',
      serviceTime: '9:00 AM',
      serviceNumber: '8',
      totalServices: '12',
      technician: 'Rajesh Kumar',
      amount: '₹12,000',
      dueDate: 'August 30, 2025',
      estimatedDuration: '2 hours',
      currentDate: new Date().toLocaleDateString('en-IN'),
      companyName: 'ContractNest Services',
      supportEmail: 'support@contractnest.com'
    };

    const content = template.content[activeChannel];
    if (!content) return '';

    let preview = content.body;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });

    return preview;
  };

  // Save template
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validation
      if (!template.name.trim()) {
        toast.error('Template name is required', {
          style: { background: colors.semantic.error, color: '#FFF' }
        });
        return;
      }

      if (template.channels.length === 0) {
        toast.error('At least one channel must be selected', {
          style: { background: colors.semantic.error, color: '#FFF' }
        });
        return;
      }

      // Check if all selected channels have content
      const missingContent = template.channels.filter(channel => !template.content[channel]?.body.trim());
      if (missingContent.length > 0) {
        toast.error(`Content is required for: ${missingContent.join(', ')}`, {
          style: { background: colors.semantic.error, color: '#FFF' }
        });
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const action = isCreating ? 'created' : 'updated';
      toast.success(`Template ${action} successfully!`, {
        style: { background: colors.semantic.success, color: '#FFF' }
      });

      navigate('/vani/templates');
    } catch (error) {
      toast.error('Failed to save template. Please try again.', {
        style: { background: colors.semantic.error, color: '#FFF' }
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Back handler
  const handleBack = () => {
    navigate('/vani/templates');
  };

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
            <h1 className="text-3xl font-bold" style={{ color: colors.utility.primaryText }}>
              {isCreating ? 'Create Template' : 'Edit Template'}
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.utility.secondaryText }}>
              {isCreating ? 'Create a new business event template' : `Editing: ${template.name}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: showPreview ? `${colors.brand.primary}10` : colors.utility.secondaryBackground,
              color: showPreview ? colors.brand.primary : colors.utility.primaryText
            }}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, ${colors.semantic.success}, ${colors.semantic.success}dd)`
            }}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isCreating ? 'Create' : 'Save'} Template</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="xl:col-span-3 space-y-6">
          {/* Template Basic Info */}
          <Card
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.utility.primaryText }}>
                Template Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Template Name */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., HVAC Service Reminder"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                    Category *
                  </label>
                  <select
                    value={template.category}
                    onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Description
                </label>
                <textarea
                  value={template.description}
                  onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of when and how this template is used..."
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

              {/* Event Types */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Event Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {eventTypeOptions.map((eventType) => (
                    <label
                      key={eventType.value}
                      className="flex items-center space-x-2 px-3 py-1.5 border rounded-lg cursor-pointer transition-colors hover:opacity-80"
                      style={{
                        borderColor: template.eventTypes.includes(eventType.value)
                          ? colors.brand.primary + '40'
                          : colors.utility.primaryText + '20',
                        backgroundColor: template.eventTypes.includes(eventType.value)
                          ? colors.brand.primary + '10'
                          : colors.utility.primaryBackground
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={template.eventTypes.includes(eventType.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTemplate(prev => ({
                              ...prev,
                              eventTypes: [...prev.eventTypes, eventType.value]
                            }));
                          } else {
                            setTemplate(prev => ({
                              ...prev,
                              eventTypes: prev.eventTypes.filter(et => et !== eventType.value)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm" style={{ color: colors.utility.primaryText }}>
                        {eventType.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Selection */}
          <Card
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.utility.primaryText }}>
                Communication Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {channelOptions.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = template.channels.includes(channel.id);
                  const isActive = activeChannel === channel.id && isSelected;
                  
                  return (
                    <button
                      key={channel.id}
                      onClick={() => {
                        if (isSelected) {
                          setActiveChannel(channel.id);
                        } else {
                          toggleChannel(channel.id);
                          setActiveChannel(channel.id);
                        }
                      }}
                      className="flex flex-col items-center p-4 border rounded-lg transition-all hover:scale-105"
                      style={{
                        borderColor: isActive
                          ? colors.brand.primary
                          : isSelected
                            ? colors.brand.primary + '40'
                            : colors.utility.primaryText + '20',
                        backgroundColor: isActive
                          ? colors.brand.primary + '20'
                          : isSelected
                            ? colors.brand.primary + '10'
                            : colors.utility.primaryBackground,
                        color: isSelected
                          ? colors.brand.primary
                          : colors.utility.primaryText
                      }}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{channel.label}</span>
                      {isSelected && (
                        <span className="text-xs mt-1" style={{ color: colors.semantic.success }}>
                          ✓ Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          {template.channels.length > 0 && (
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
                  {React.createElement(channelOptions.find(c => c.id === activeChannel)?.icon || FileText, { 
                    className: "w-5 h-5" 
                  })}
                  <span>{channelOptions.find(c => c.id === activeChannel)?.label} Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject (for email and push) */}
                {channelOptions.find(c => c.id === activeChannel)?.hasSubject && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={template.content[activeChannel]?.subject || ''}
                      onChange={(e) => updateChannelContent('subject', e.target.value)}
                      placeholder="Enter subject line..."
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: colors.utility.secondaryText + '40',
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                    />
                  </div>
                )}

                {/* Content Body */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                    Message Content
                  </label>
                  
                  {activeChannel === 'email' ? (
                    <RichTextEditor
                      value={template.content[activeChannel]?.body || ''}
                      onChange={(value) => updateChannelContent('body', value)}
                      placeholder={channelOptions.find(c => c.id === activeChannel)?.placeholder}
                      minHeight={200}
                      maxHeight={400}
                      showCharCount={true}
                      allowFullscreen={true}
                      toolbarButtons={['bold', 'italic', 'underline', 'bulletList', 'orderedList', 'table', 'color']}
                    />
                  ) : (
                    <textarea
                      value={template.content[activeChannel]?.body || ''}
                      onChange={(e) => updateChannelContent('body', e.target.value)}
                      placeholder={channelOptions.find(c => c.id === activeChannel)?.placeholder}
                      rows={activeChannel === 'sms' ? 4 : 8}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm"
                      style={{
                        borderColor: colors.utility.secondaryText + '40',
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                    />
                  )}
                  
                  {/* Character count for SMS */}
                  {activeChannel === 'sms' && (
                    <div className="flex justify-between mt-2 text-xs">
                      <span style={{ color: colors.utility.secondaryText }}>
                        SMS messages over 160 characters will be split
                      </span>
                      <span 
                        style={{ 
                          color: (template.content[activeChannel]?.body.length || 0) > 160 
                            ? colors.semantic.warning 
                            : colors.utility.secondaryText 
                        }}
                      >
                        {template.content[activeChannel]?.body.length || 0}/160
                      </span>
                    </div>
                  )}
                </div>

                {/* Preview */}
                {showPreview && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                      Preview with Sample Data
                    </label>
                    <div 
                      className="p-4 border rounded-lg"
                      style={{
                        backgroundColor: colors.utility.primaryBackground,
                        borderColor: colors.utility.primaryText + '20'
                      }}
                    >
                      <div 
                        className="whitespace-pre-wrap text-sm"
                        style={{ color: colors.utility.primaryText }}
                        dangerouslySetInnerHTML={{ __html: generatePreview() }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Variables Sidebar */}
        <div className="xl:col-span-1">
          <Card
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between"
                style={{ color: colors.utility.primaryText }}
              >
                <span>Template Variables</span>
                <button
                  onClick={() => setShowVariables(!showVariables)}
                  className="p-1 transition-colors hover:opacity-80"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {showVariables ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </CardTitle>
            </CardHeader>
            
            {showVariables && (
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(variablesByCategory).map(([category, variables]) => (
                  <div key={category}>
                    <h4 
                      className="text-sm font-medium mb-2 capitalize flex items-center space-x-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {category === 'customer' && <User className="w-3 h-3" />}
                      {category === 'contract' && <FileText className="w-3 h-3" />}
                      {category === 'service' && <Calendar className="w-3 h-3" />}
                      {category === 'payment' && <DollarSign className="w-3 h-3" />}
                      {category === 'system' && <Settings className="w-3 h-3" />}
                      <span>{category} Variables</span>
                    </h4>
                    <div className="space-y-1">
                      {variables.map((variable) => (
                        <button
                          key={variable.key}
                          onClick={() => insertVariable(variable.key)}
                          className="w-full text-left p-2 border rounded transition-colors hover:opacity-80"
                          style={{
                            borderColor: colors.utility.primaryText + '20',
                            backgroundColor: colors.utility.primaryBackground
                          }}
                          title={variable.description}
                        >
                          <div className="flex items-center justify-between">
                            <span 
                              className="text-xs font-medium"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {variable.label}
                            </span>
                            {variable.required && (
                              <span 
                                className="text-xs"
                                style={{ color: colors.semantic.error }}
                              >
                                *
                              </span>
                            )}
                          </div>
                          <div 
                            className="text-xs font-mono"
                            style={{ color: colors.brand.primary }}
                          >
                            {`{{${variable.key}}}`}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            e.g., {variable.example}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorPage;