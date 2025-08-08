// src/components/contacts/forms/ContactChannelsSection.tsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Trash2, 
  Star, 
  Edit2, 
  Check, 
  X,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';

// Types matching API structure
interface ContactChannel {
  id?: string;
  channel_type: string;
  value: string;
  country_code?: string;
  is_primary: boolean;
  is_verified: boolean;
  notes?: string;
}

interface ContactChannelsSectionProps {
  value: ContactChannel[];
  onChange: (channels: ContactChannel[]) => void;
  disabled?: boolean;
  duplicateWarnings?: string[];
  mode?: 'create' | 'edit';
  showValidation?: boolean;
}

// Channel types configuration
const CHANNEL_TYPES = [
  { 
    value: 'mobile', 
    label: 'Mobile', 
    icon: Phone, 
    placeholder: '9876543210',
    validation: /^[6-9]\d{9}$/,
    errorMessage: 'Invalid mobile number (10 digits starting with 6-9)'
  },
  { 
    value: 'email', 
    label: 'Email', 
    icon: Mail, 
    placeholder: 'john@example.com',
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Invalid email address'
  },
  { 
    value: 'whatsapp', 
    label: 'WhatsApp', 
    icon: MessageSquare, 
    placeholder: '9876543210',
    validation: /^[6-9]\d{9}$/,
    errorMessage: 'Invalid WhatsApp number'
  },
  { 
    value: 'linkedin', 
    label: 'LinkedIn', 
    icon: Globe, 
    placeholder: 'linkedin.com/in/username',
    validation: /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/(in|company)\/[A-z0-9_-]+\/?$/,
    errorMessage: 'Invalid LinkedIn URL'
  },
  { 
    value: 'website', 
    label: 'Website', 
    icon: Globe, 
    placeholder: 'https://example.com',
    validation: /^https?:\/\/.+\..+$/,
    errorMessage: 'Invalid website URL (must start with http:// or https://)'
  },
  { 
    value: 'telegram', 
    label: 'Telegram', 
    icon: MessageSquare, 
    placeholder: '@username or phone',
    validation: null,
    errorMessage: ''
  },
  { 
    value: 'skype', 
    label: 'Skype', 
    icon: MessageSquare, 
    placeholder: 'skype.username',
    validation: null,
    errorMessage: ''
  }
];

// Country codes for mobile/whatsapp
const COUNTRY_CODES = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+61', country: 'Australia' }
];

const ContactChannelsSection: React.FC<ContactChannelsSectionProps> = ({
  value,
  onChange,
  disabled = false,
  duplicateWarnings = [],
  mode = 'create',
  showValidation = true
}) => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Track analytics when channels are added/removed
  useEffect(() => {
    if (value.length > 0) {
      analyticsService.trackPageView(
        `contacts/${mode}/channels-count`,
        `Contact Channels: ${value.length}`
      );
    }
  }, [value.length, mode]);

  // New channel form state
  const [newChannel, setNewChannel] = useState<ContactChannel>({
    channel_type: 'mobile',
    value: '',
    country_code: '+91',
    is_primary: value.length === 0,
    is_verified: false,
    notes: ''
  });

  // Validate a channel value
  const validateChannel = (channel: ContactChannel): string | null => {
    const channelType = CHANNEL_TYPES.find(ct => ct.value === channel.channel_type);
    if (!channelType || !channelType.validation) return null;

    // Skip validation for empty values
    if (!channel.value) return 'This field is required';

    // For mobile/whatsapp, strip country code before validation
    let valueToValidate = channel.value;
    if (['mobile', 'whatsapp'].includes(channel.channel_type) && channel.country_code) {
      valueToValidate = channel.value.replace(channel.country_code, '').trim();
    }

    if (!channelType.validation.test(valueToValidate)) {
      return channelType.errorMessage;
    }

    // Check for duplicates
    const duplicate = value.find((ch, idx) => 
      ch.channel_type === channel.channel_type && 
      ch.value === channel.value &&
      (editingIndex === null || idx !== editingIndex)
    );
    
    if (duplicate) {
      return `This ${channelType.label} is already added`;
    }

    return null;
  };

  // Add new channel
  const addChannel = () => {
    const error = validateChannel(newChannel);
    if (error) {
      setValidationErrors({ new: error });
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: error
      });
      return;
    }

    const channelWithId: ContactChannel = {
      ...newChannel,
      id: `temp_${Date.now()}`
    };

    // If marking as primary, unset others
    let updatedChannels = [...value];
    if (channelWithId.is_primary) {
      updatedChannels = updatedChannels.map(ch => ({ ...ch, is_primary: false }));
    }

    onChange([...updatedChannels, channelWithId]);
    
    // Reset form
    setNewChannel({
      channel_type: 'mobile',
      value: '',
      country_code: '+91',
      is_primary: false,
      is_verified: false,
      notes: ''
    });
    setIsAddingChannel(false);
    setValidationErrors({});
    
    toast({
      title: "Channel Added",
      description: `${CHANNEL_TYPES.find(ct => ct.value === channelWithId.channel_type)?.label} added successfully`
    });
  };

  // Update existing channel
  const updateChannel = (index: number, updates: Partial<ContactChannel>) => {
    const updatedChannels = [...value];
    
    // If setting as primary, unset others
    if (updates.is_primary) {
      updatedChannels.forEach((ch, i) => {
        if (i !== index) {
          updatedChannels[i] = { ...ch, is_primary: false };
        }
      });
    }
    
    updatedChannels[index] = { ...updatedChannels[index], ...updates };
    
    // Validate the updated channel
    const error = validateChannel(updatedChannels[index]);
    if (error) {
      setValidationErrors({ [index]: error });
    } else {
      const newErrors = { ...validationErrors };
      delete newErrors[index];
      setValidationErrors(newErrors);
    }
    
    onChange(updatedChannels);
  };

  // Remove channel
  const removeChannel = (index: number) => {
    const removedChannel = value[index];
    const newChannels = value.filter((_, i) => i !== index);
    
    // If removed channel was primary, make first remaining channel primary
    if (removedChannel.is_primary && newChannels.length > 0) {
      newChannels[0] = { ...newChannels[0], is_primary: true };
    }
    
    onChange(newChannels);
    
    toast({
      title: "Channel Removed",
      description: `${CHANNEL_TYPES.find(ct => ct.value === removedChannel.channel_type)?.label} removed`
    });
  };

  // Get channel type info
  const getChannelTypeInfo = (channelType: string) => {
    return CHANNEL_TYPES.find(ct => ct.value === channelType) || CHANNEL_TYPES[0];
  };

  // Mark field as touched for validation display
  const markFieldTouched = (fieldId: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldId));
  };

  return (
    <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Contact Channels <span className="text-destructive">*</span>
        </h2>
        {!isAddingChannel && (
          <button
            onClick={() => setIsAddingChannel(true)}
            disabled={disabled}
            className="flex items-center px-3 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Channel
          </button>
        )}
      </div>

      {/* Validation Summary */}
      {showValidation && value.length === 0 && (
        <div className="mb-4 p-3 rounded-md border bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            At least one contact channel is required
          </p>
        </div>
      )}

      {/* Duplicate Warnings */}
      {duplicateWarnings.length > 0 && (
        <div className="mb-4 p-3 rounded-md border bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
          <p className="text-sm font-medium mb-1 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            Potential Duplicates Found:
          </p>
          <ul className="text-xs space-y-1 text-yellow-700 dark:text-yellow-300">
            {duplicateWarnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Channel Form */}
      {isAddingChannel && (
        <div className="mb-4 p-4 rounded-lg border bg-muted/30 border-border">
          <div className="space-y-4">
            {/* Channel Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Type</label>
                <select
                  value={newChannel.channel_type}
                  onChange={(e) => setNewChannel({ ...newChannel, channel_type: e.target.value })}
                  className="w-full p-2 border rounded-md bg-background border-input text-foreground"
                >
                  {CHANNEL_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Country Code for Mobile/WhatsApp */}
              {['mobile', 'whatsapp'].includes(newChannel.channel_type) && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Country</label>
                  <select
                    value={newChannel.country_code}
                    onChange={(e) => setNewChannel({ ...newChannel, country_code: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background border-input text-foreground"
                  >
                    {COUNTRY_CODES.map(cc => (
                      <option key={cc.code} value={cc.code}>
                        {cc.code} {cc.country}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Value Input */}
              <div className={['mobile', 'whatsapp'].includes(newChannel.channel_type) ? '' : 'md:col-span-2'}>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {getChannelTypeInfo(newChannel.channel_type).label} *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newChannel.value}
                    onChange={(e) => {
                      setNewChannel({ ...newChannel, value: e.target.value });
                      if (validationErrors.new) {
                        const error = validateChannel({ ...newChannel, value: e.target.value });
                        setValidationErrors({ new: error || '' });
                      }
                    }}
                    onBlur={() => {
                      markFieldTouched('new');
                      const error = validateChannel(newChannel);
                      if (error) setValidationErrors({ new: error });
                    }}
                    placeholder={getChannelTypeInfo(newChannel.channel_type).placeholder}
                    className={`w-full p-2 pr-8 border rounded-md bg-background text-foreground ${
                      validationErrors.new && touchedFields.has('new')
                        ? 'border-destructive focus:ring-destructive/20' 
                        : 'border-input'
                    }`}
                  />
                  {validationErrors.new && touchedFields.has('new') && (
                    <div className="absolute right-2 top-2.5">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                  )}
                </div>
                {validationErrors.new && touchedFields.has('new') && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.new}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Notes (Optional)</label>
              <input
                type="text"
                value={newChannel.notes || ''}
                onChange={(e) => setNewChannel({ ...newChannel, notes: e.target.value })}
                placeholder="Add any notes..."
                className="w-full p-2 border rounded-md bg-background border-input text-foreground"
              />
            </div>

            {/* Primary Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="new_is_primary"
                checked={newChannel.is_primary}
                onChange={(e) => setNewChannel({ ...newChannel, is_primary: e.target.checked })}
                className="mr-2 accent-primary"
              />
              <label htmlFor="new_is_primary" className="text-sm text-foreground">
                Set as primary contact channel
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={addChannel}
                className="px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm bg-primary text-primary-foreground"
              >
                <Check className="mr-2 h-4 w-4 inline" />
                Add Channel
              </button>
              <button
                onClick={() => {
                  setIsAddingChannel(false);
                  setNewChannel({
                    channel_type: 'mobile',
                    value: '',
                    country_code: '+91',
                    is_primary: false,
                    is_verified: false,
                    notes: ''
                  });
                  setValidationErrors({});
                }}
                className="px-4 py-2 border rounded-md hover:bg-accent transition-colors text-sm border-input text-foreground"
              >
                <X className="mr-2 h-4 w-4 inline" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Channels */}
      {value.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg border-border">
          <Phone className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">No contact channels added yet</p>
          <p className="text-sm mb-4 text-muted-foreground">
            Add email, phone, or other ways to reach this contact
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((channel, index) => {
            const channelInfo = getChannelTypeInfo(channel.channel_type);
            const IconComponent = channelInfo.icon;
            const isEditing = editingIndex === index;
            const fieldId = `channel_${index}`;
            
            return (
              <div 
                key={channel.id || index} 
                className={`p-4 rounded-lg border transition-all ${
                  validationErrors[index] && touchedFields.has(fieldId)
                    ? 'border-destructive bg-destructive/5' 
                    : 'border-border bg-card hover:shadow-sm'
                }`}
              >
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <select
                          value={channel.channel_type}
                          onChange={(e) => updateChannel(index, { channel_type: e.target.value })}
                          className="w-full p-2 border rounded-md bg-background border-input text-foreground text-sm"
                        >
                          {CHANNEL_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      {['mobile', 'whatsapp'].includes(channel.channel_type) && (
                        <div>
                          <select
                            value={channel.country_code}
                            onChange={(e) => updateChannel(index, { country_code: e.target.value })}
                            className="w-full p-2 border rounded-md bg-background border-input text-foreground text-sm"
                          >
                            {COUNTRY_CODES.map(cc => (
                              <option key={cc.code} value={cc.code}>
                                {cc.code} {cc.country}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className={['mobile', 'whatsapp'].includes(channel.channel_type) ? '' : 'md:col-span-2'}>
                        <input
                          type="text"
                          value={channel.value}
                          onChange={(e) => updateChannel(index, { value: e.target.value })}
                          onBlur={() => markFieldTouched(fieldId)}
                          className={`w-full p-2 border rounded-md bg-background text-foreground text-sm ${
                            validationErrors[index] ? 'border-destructive' : 'border-input'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          markFieldTouched(fieldId);
                        }}
                        className="px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors text-sm bg-primary text-primary-foreground"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-3 py-1.5 border rounded-md hover:bg-accent transition-colors text-sm border-input text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {validationErrors[index] && (
                      <p className="text-xs text-destructive">{validationErrors[index]}</p>
                    )}
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        channel.is_primary 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">
                            {channelInfo.label}
                          </span>
                          {channel.is_primary && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                              <Star className="h-3 w-3" />
                              Primary
                            </span>
                          )}
                          {channel.is_verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-foreground break-all">
                          {['mobile', 'whatsapp'].includes(channel.channel_type) && channel.country_code
                            ? `${channel.country_code} ${channel.value}`
                            : channel.value
                          }
                        </p>
                        
                        {channel.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            💡 {channel.notes}
                          </p>
                        )}

                        {validationErrors[index] && touchedFields.has(fieldId) && (
                          <p className="text-xs text-destructive mt-1">
                            <AlertCircle className="inline h-3 w-3 mr-1" />
                            {validationErrors[index]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!channel.is_primary && (
                        <button
                          onClick={() => updateChannel(index, { is_primary: true })}
                          disabled={disabled}
                          className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                          title="Set as primary"
                        >
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingIndex(index)}
                        disabled={disabled}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                        title="Edit channel"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => removeChannel(index)}
                        disabled={disabled}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                        title="Remove channel"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {value.length > 0 && (
        <div className="mt-4 p-3 rounded-md border bg-muted/50 border-border">
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">{value.length}</strong> contact channel{value.length !== 1 ? 's' : ''} added
            {value.filter(ch => ch.is_primary).length > 0 && (
              <>
                {' '} • <strong className="text-foreground">1</strong> primary channel
              </>
            )}
            {value.filter(ch => ch.is_verified).length > 0 && (
              <>
                {' '} • <strong className="text-foreground">{value.filter(ch => ch.is_verified).length}</strong> verified
              </>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      {value.length === 0 && !value.some(ch => ch.is_primary) && (
        <div className="mt-4 p-3 rounded-md border bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 Tip: Mark one channel as "Primary" for the main contact method.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactChannelsSection;