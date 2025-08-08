// src/components/contacts/view/cards/ContactChannelsCard.tsx - Full Production Version
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Globe, 
  Copy, 
  Edit, 
  ExternalLink, 
  Check, 
  Star,
  Linkedin,
  Send,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CONTACT_CHANNEL_TYPES, canPerformOperation } from '@/utils/constants/contacts';

interface ContactChannel {
  id: string;
  channel_type: string;
  value: string;
  country_code?: string;
  is_primary: boolean;
  is_verified: boolean;
  notes?: string;
}

interface ContactChannelsCardProps {
  contact: {
    id: string;
    status: 'active' | 'inactive' | 'archived';
    contact_channels: ContactChannel[];
  };
  onEdit?: () => void;
  className?: string;
}

const ContactChannelsCard: React.FC<ContactChannelsCardProps> = ({ 
  contact, 
  onEdit,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  // Get channel icon based on type
  const getChannelIcon = (channelType: string) => {
    switch (channelType) {
      case CONTACT_CHANNEL_TYPES.MOBILE:
        return Phone;
      case CONTACT_CHANNEL_TYPES.EMAIL:
        return Mail;
      case CONTACT_CHANNEL_TYPES.WHATSAPP:
        return MessageSquare;
      case CONTACT_CHANNEL_TYPES.WEBSITE:
        return Globe;
      case CONTACT_CHANNEL_TYPES.LINKEDIN:
        return Linkedin;
      case CONTACT_CHANNEL_TYPES.TELEGRAM:
        return Send;
      case CONTACT_CHANNEL_TYPES.SKYPE:
        return MessageSquare;
      default:
        return Phone;
    }
  };

  // Get channel display label
  const getChannelLabel = (channelType: string): string => {
    switch (channelType) {
      case CONTACT_CHANNEL_TYPES.MOBILE:
        return 'Mobile';
      case CONTACT_CHANNEL_TYPES.EMAIL:
        return 'Email';
      case CONTACT_CHANNEL_TYPES.WHATSAPP:
        return 'WhatsApp';
      case CONTACT_CHANNEL_TYPES.WEBSITE:
        return 'Website';
      case CONTACT_CHANNEL_TYPES.LINKEDIN:
        return 'LinkedIn';
      case CONTACT_CHANNEL_TYPES.TELEGRAM:
        return 'Telegram';
      case CONTACT_CHANNEL_TYPES.SKYPE:
        return 'Skype';
      default:
        return channelType.charAt(0).toUpperCase() + channelType.slice(1);
    }
  };

  // Format phone number with country code
  const formatPhoneNumber = (channel: ContactChannel): string => {
    if (channel.channel_type === CONTACT_CHANNEL_TYPES.MOBILE && channel.country_code) {
      // Handle different country codes
      const countryCodeMap: Record<string, string> = {
        'IN': '+91',
        'US': '+1',
        'UK': '+44',
        'AU': '+61',
        'CA': '+1',
        'DE': '+49',
        'FR': '+33',
        'JP': '+81',
        'SG': '+65'
      };
      
      const phoneCode = countryCodeMap[channel.country_code] || `+${channel.country_code}`;
      return `${phoneCode} ${channel.value}`;
    }
    return channel.value;
  };

  // Get display value for channel
  const getDisplayValue = (channel: ContactChannel): string => {
    if (channel.channel_type === CONTACT_CHANNEL_TYPES.MOBILE) {
      return formatPhoneNumber(channel);
    }
    return channel.value;
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (value: string, channelId: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedChannel(channelId);
      
      toast({
        title: "Copied!",
        description: "Contact information copied to clipboard",
        duration: 2000
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedChannel(null), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy to clipboard"
      });
    }
  };

  // Handle channel action (call, email, etc.)
  const handleChannelAction = (channel: ContactChannel) => {
    const value = getDisplayValue(channel);
    
    switch (channel.channel_type) {
      case CONTACT_CHANNEL_TYPES.MOBILE:
        window.location.href = `tel:${value}`;
        break;
      case CONTACT_CHANNEL_TYPES.EMAIL:
        window.location.href = `mailto:${channel.value}`;
        break;
      case CONTACT_CHANNEL_TYPES.WHATSAPP:
        const whatsappNumber = channel.country_code === 'IN' ? `91${channel.value}` : channel.value;
        window.open(`https://wa.me/${whatsappNumber}`, '_blank');
        break;
      case CONTACT_CHANNEL_TYPES.WEBSITE:
        const url = channel.value.startsWith('http') ? channel.value : `https://${channel.value}`;
        window.open(url, '_blank');
        break;
      case CONTACT_CHANNEL_TYPES.LINKEDIN:
        const linkedinUrl = channel.value.startsWith('http') ? channel.value : `https://linkedin.com/in/${channel.value}`;
        window.open(linkedinUrl, '_blank');
        break;
      case CONTACT_CHANNEL_TYPES.TELEGRAM:
        window.open(`https://t.me/${channel.value}`, '_blank');
        break;
      case CONTACT_CHANNEL_TYPES.SKYPE:
        window.location.href = `skype:${channel.value}?call`;
        break;
      default:
        copyToClipboard(value, channel.id);
    }
  };

  // Handle edit action
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/contacts/${contact.id}/edit`);
    }
  };

  // Check if edit is allowed
  const canEdit = canPerformOperation(contact.status, 'edit');

  // Sort channels: primary first, then by type
  const sortedChannels = [...contact.contact_channels].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.channel_type.localeCompare(b.channel_type);
  });

  return (
    <div className={`bg-card rounded-lg shadow-sm border border-border p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Contact Channels</h3>
        {canEdit && (
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit contact channels"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Channels List */}
      {sortedChannels.length === 0 ? (
        // Empty state
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">No contact channels added</p>
          {canEdit && (
            <button
              onClick={handleEdit}
              className="text-xs text-primary hover:underline"
            >
              Add contact channel
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedChannels.map((channel) => {
            const IconComponent = getChannelIcon(channel.channel_type);
            const displayValue = getDisplayValue(channel);
            const channelLabel = getChannelLabel(channel.channel_type);
            const isCopied = copiedChannel === channel.id;
            
            return (
              <div 
                key={channel.id} 
                className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors group"
              >
                {/* Left side - Icon and details */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Channel Icon */}
                  <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  {/* Channel Details */}
                  <div className="flex-1 min-w-0">
                    {/* Value */}
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => handleChannelAction(channel)}
                        className="text-sm font-medium truncate hover:text-primary transition-colors text-left"
                        title={`${channelLabel}: ${displayValue}`}
                      >
                        {displayValue}
                      </button>
                      
                      {/* Primary badge */}
                      {channel.is_primary && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                          <Star className="h-3 w-3" />
                          Primary
                        </span>
                      )}
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{channelLabel}</span>
                      
                      {/* Verification status */}
                      {channel.is_verified && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            Verified
                          </span>
                        </>
                      )}
                      
                      {/* Country code for mobile */}
                      {channel.channel_type === CONTACT_CHANNEL_TYPES.MOBILE && channel.country_code && (
                        <>
                          <span>•</span>
                          <span>{channel.country_code}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Notes */}
                    {channel.notes && (
                      <div className="mt-1">
                        <p className="text-xs text-muted-foreground italic">
                          {channel.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-1 ml-2">
                  {/* Copy button */}
                  <button
                    onClick={() => copyToClipboard(displayValue, channel.id)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                    title="Copy to clipboard"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                  
                  {/* External link for websites */}
                  {(channel.channel_type === CONTACT_CHANNEL_TYPES.WEBSITE || 
                    channel.channel_type === CONTACT_CHANNEL_TYPES.LINKEDIN) && (
                    <button
                      onClick={() => handleChannelAction(channel)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Footer with add channel option */}
      {canEdit && sortedChannels.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <button
            onClick={handleEdit}
            className="text-xs text-primary hover:underline"
          >
            + Add another channel
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactChannelsCard;