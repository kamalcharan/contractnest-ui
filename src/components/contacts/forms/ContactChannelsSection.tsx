// src/components/contacts/forms/ContactChannelsSection.tsx - FIXED VERSION
import React, { useState } from 'react';
import { 
  Plus, 
  Phone, 
  Mail, 
  MessageCircle, 
  Globe,
  Linkedin,
  Edit2,
  Trash2,
  Star,
  Copy,
  Check
} from 'lucide-react';
import { 
  CONTACT_CHANNEL_TYPES,
  DEFAULT_COUNTRY_CODE,
  ERROR_MESSAGES,
  PLACEHOLDER_TEXTS
} from '../../../utils/constants/contacts';
import { CHANNELS } from '../../../utils/constants/channels';

// Types
interface ContactChannel {
  id?: string;
  channel_code: string;
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
  mode?: 'create' | 'edit' | 'view';
  compact?: boolean;
}

const ContactChannelsSection: React.FC<ContactChannelsSectionProps> = ({
  value,
  onChange,
  disabled = false,
  duplicateWarnings = [],
  mode = 'create',
  compact = false
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Icon mapping for channels
  const getChannelIcon = (channelCode: string) => {
    switch (channelCode) {
      case 'mobile': return Phone;
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      case 'linkedin': return Linkedin;
      case 'website': return Globe;
      default: return Phone;
    }
  };

  // Get channel display name
  const getChannelDisplayName = (channelCode: string) => {
    const channel = CHANNELS.find(c => c.code === channelCode);
    return channel?.displayName || channelCode;
  };

  // REMOVED: Auto-add default phone channel logic

  // Add new contact channel
  const addContactChannel = (newChannel: Omit<ContactChannel, 'id'>) => {
    if (disabled) return;
    
    const channelWithId: ContactChannel = {
      ...newChannel,
      id: `temp_${Date.now()}`,
      is_primary: value.length === 0 ? true : newChannel.is_primary
    };

    // If marking as primary, unset others
    let updatedChannels = [...value];
    if (channelWithId.is_primary) {
      updatedChannels = updatedChannels.map(ch => ({ ...ch, is_primary: false }));
    }

    onChange([...updatedChannels, channelWithId]);
    setIsAddModalOpen(false);
  };

  // Remove contact channel
  const removeContactChannel = (index: number) => {
    if (disabled) return;
    
    const newChannels = value.filter((_, i) => i !== index);
    
    // If we removed the primary channel, make the first remaining channel primary
    if (value[index].is_primary && newChannels.length > 0) {
      newChannels[0] = { ...newChannels[0], is_primary: true };
    }
    
    onChange(newChannels);
  };

  // Update contact channel
  const updateContactChannel = (index: number, updates: Partial<ContactChannel>) => {
    if (disabled) return;
    
    const newChannels = [...value];
    
    // If setting this channel as primary, unset others
    if (updates.is_primary) {
      newChannels.forEach((channel, i) => {
        if (i !== index) {
          newChannels[i] = { ...channel, is_primary: false };
        }
      });
    }
    
    newChannels[index] = { ...newChannels[index], ...updates };
    onChange(newChannels);
  };

  // Copy channel value to clipboard
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    // You could add a toast notification here
  };

  // Check if a channel value has duplicate warnings
  const hasWarning = (channelValue: string): boolean => {
    return duplicateWarnings.some(warning => warning.includes(channelValue));
  };

  // Format phone number with country code
  const formatPhoneNumber = (channel: ContactChannel): string => {
    if (channel.channel_code === 'mobile' && channel.country_code) {
      const country = [{ code: 'IN', phoneCode: '91' }, { code: 'US', phoneCode: '1' }]
        .find(c => c.code === channel.country_code);
      return country ? `+${country.phoneCode} ${channel.value}` : channel.value;
    }
    return channel.value;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Contact Channels</h2>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={disabled}
          className="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </button>
      </div>

      {/* Channel Cards */}
      {value.length === 0 ? (
        // FIXED: Proper empty state with "Add Mobile" button
        <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
          <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No contact channels added yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add phone, email, or other contact methods to reach this contact
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={disabled}
              className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone className="mr-2 h-4 w-4" />
              Add Mobile
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={disabled}
              className="flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="mr-2 h-4 w-4" />
              Add Email
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.map((channel, index) => {
            const IconComponent = getChannelIcon(channel.channel_code);
            const hasChannelWarning = hasWarning(channel.value);
            const displayValue = formatPhoneNumber(channel);
            
            return (
              <div 
                key={channel.id || index} 
                className={`
                  relative p-4 rounded-lg border transition-all hover:shadow-md
                  ${hasChannelWarning 
                    ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20' 
                    : 'border-border bg-card hover:border-primary/50'
                  }
                `}
              >
                {/* Primary Badge */}
                {channel.is_primary && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    <Star className="h-3 w-3" />
                    Primary
                  </div>
                )}

                {/* Channel Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {getChannelDisplayName(channel.channel_code)}
                      </span>
                      {channel.is_verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="h-3 w-3" />
                          <span className="text-xs">Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-foreground font-medium break-all">
                      {displayValue}
                    </p>
                    {channel.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {channel.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Warning Message */}
                {hasChannelWarning && (
                  <div className="mb-3 p-2 bg-yellow-100 border border-yellow-200 rounded-md dark:bg-yellow-900/30 dark:border-yellow-700">
                    <p className="text-xs text-yellow-800 dark:text-yellow-400">
                      ⚠️ {duplicateWarnings.find(w => w.includes(channel.value))}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(displayValue)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {!channel.is_primary && (
                      <button
                        onClick={() => updateContactChannel(index, { is_primary: true })}
                        disabled={disabled}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                        title="Make primary"
                      >
                        <Star className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingIndex(index)}
                      disabled={disabled}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                      title="Edit channel"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeContactChannel(index)}
                      disabled={disabled}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Remove channel"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Info */}
      {value.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
          <div className="text-sm text-blue-800 dark:text-blue-400">
            <strong>{value.length}</strong> contact channel{value.length !== 1 ? 's' : ''} added
            {value.filter(ch => ch.is_verified).length > 0 && (
              <>
                {' '} • <strong>{value.filter(ch => ch.is_verified).length}</strong> verified
              </>
            )}
            {value.filter(ch => ch.is_primary).length > 0 && (
              <>
                {' '} • <strong>1</strong> primary channel set
              </>
            )}
          </div>
        </div>
      )}

      {/* Validation Messages - ONLY show when truly needed */}
      {value.length === 0 && mode !== 'create' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-400">
            {ERROR_MESSAGES.NO_CHANNELS}
          </p>
        </div>
      )}

      {/* Add Channel Modal */}
      {isAddModalOpen && (
        <AddChannelModal
          onAdd={addContactChannel}
          onClose={() => setIsAddModalOpen(false)}
          existingChannels={value}
        />
      )}

      {/* Edit Channel Modal */}
      {editingIndex !== null && (
        <EditChannelModal
          channel={value[editingIndex]}
          onSave={(updates) => {
            updateContactChannel(editingIndex, updates);
            setEditingIndex(null);
          }}
          onClose={() => setEditingIndex(null)}
          existingChannels={value}
        />
      )}
    </div>
  );
};

// Add Channel Modal Component (unchanged)
interface AddChannelModalProps {
  onAdd: (channel: Omit<ContactChannel, 'id'>) => void;
  onClose: () => void;
  existingChannels: ContactChannel[];
}

const AddChannelModal: React.FC<AddChannelModalProps> = ({ onAdd, onClose, existingChannels }) => {
  const [channelData, setChannelData] = useState({
    channel_code: 'mobile', // Default to mobile instead of DEFAULT_CONTACT_CHANNEL
    value: '',
    country_code: DEFAULT_COUNTRY_CODE,
    is_primary: existingChannels.length === 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelData.value.trim()) return;

    onAdd({
      ...channelData,
      is_verified: false
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Contact Channel</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Channel Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Channel Type</label>
              <select
                value={channelData.channel_code}
                onChange={(e) => setChannelData(prev => ({ ...prev, channel_code: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                {CHANNELS.map(channel => (
                  <option key={channel.code} value={channel.code}>
                    {channel.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Code (for phone) */}
            {(channelData.channel_code === 'mobile' || channelData.channel_code === 'whatsapp') && (
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  value={channelData.country_code}
                  onChange={(e) => setChannelData(prev => ({ ...prev, country_code: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="IN">India (+91)</option>
                  <option value="US">United States (+1)</option>
                  <option value="UK">United Kingdom (+44)</option>
                </select>
              </div>
            )}

            {/* Value */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {channelData.channel_code === 'email' ? 'Email Address' : 
                 channelData.channel_code === 'mobile' ? 'Phone Number' : 'Value'}
              </label>
              <input
                type={channelData.channel_code === 'email' ? 'email' : 'text'}
                value={channelData.value}
                onChange={(e) => setChannelData(prev => ({ ...prev, value: e.target.value }))}
                placeholder={
                  channelData.channel_code === 'email' ? PLACEHOLDER_TEXTS.EMAIL :
                  channelData.channel_code === 'mobile' ? PLACEHOLDER_TEXTS.PHONE : 'Enter value'
                }
                className="w-full p-2 border border-border rounded-md bg-background"
                required
              />
            </div>

            {/* Primary */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_primary"
                checked={channelData.is_primary}
                onChange={(e) => setChannelData(prev => ({ ...prev, is_primary: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="is_primary" className="text-sm">Make this the primary contact method</label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <input
                type="text"
                value={channelData.notes}
                onChange={(e) => setChannelData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this contact method..."
                className="w-full p-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Channel Modal Component (similar structure, unchanged)
interface EditChannelModalProps {
  channel: ContactChannel;
  onSave: (updates: Partial<ContactChannel>) => void;
  onClose: () => void;
  existingChannels: ContactChannel[];
}

const EditChannelModal: React.FC<EditChannelModalProps> = ({ channel, onSave, onClose }) => {
  const [channelData, setChannelData] = useState({
    channel_code: channel.channel_code,
    value: channel.value,
    country_code: channel.country_code || DEFAULT_COUNTRY_CODE,
    is_primary: channel.is_primary,
    notes: channel.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelData.value.trim()) return;

    onSave(channelData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Contact Channel</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Similar form structure as AddChannelModal */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Channel Type</label>
              <select
                value={channelData.channel_code}
                onChange={(e) => setChannelData(prev => ({ ...prev, channel_code: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                {CHANNELS.map(channel => (
                  <option key={channel.code} value={channel.code}>
                    {channel.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type={channelData.channel_code === 'email' ? 'email' : 'text'}
                value={channelData.value}
                onChange={(e) => setChannelData(prev => ({ ...prev, value: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-background"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit_is_primary"
                checked={channelData.is_primary}
                onChange={(e) => setChannelData(prev => ({ ...prev, is_primary: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="edit_is_primary" className="text-sm">Make this the primary contact method</label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactChannelsSection;