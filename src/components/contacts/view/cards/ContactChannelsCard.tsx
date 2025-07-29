// src/components/contacts/view/cards/ContactChannelsCard.tsx
import React from 'react';
import { Mail, Phone, MessageCircle, Globe, Copy, Edit, ExternalLink, Check, Star } from 'lucide-react';

interface ContactChannelsCardProps {
  contact: any;
  onEdit: () => void;
}

export const ContactChannelsCard: React.FC<ContactChannelsCardProps> = ({ contact, onEdit }) => {
  const getChannelIcon = (channelCode: string) => {
    switch (channelCode) {
      case 'mobile': return Phone;
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      case 'website': return Globe;
      default: return Phone;
    }
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const formatPhoneNumber = (channel: any): string => {
    if (channel.channel_code === 'mobile' && channel.country_code) {
      const country = [{ code: 'IN', phoneCode: '91' }, { code: 'US', phoneCode: '1' }]
        .find(c => c.code === channel.country_code);
      return country ? `+${country.phoneCode} ${channel.value}` : channel.value;
    }
    return channel.value;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Contact Channels</h3>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          title="Edit contact channels"
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {contact.contact_channels.map((channel: any, index: number) => {
          const IconComponent = getChannelIcon(channel.channel_code);
          const displayValue = formatPhoneNumber(channel);
          
          return (
            <div key={channel.id || index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <IconComponent className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{displayValue}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{channel.channel_code.charAt(0).toUpperCase() + channel.channel_code.slice(1)}</span>
                    {channel.is_primary && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Primary
                        </span>
                      </>
                    )}
                    {channel.is_verified && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-green-600">
                          <Check className="h-3 w-3" />
                          Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => copyToClipboard(displayValue)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactChannelsCard;