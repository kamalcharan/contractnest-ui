// src/components/contacts/form-sections/ChannelsSection.tsx
import React from 'react';
import { Plus, Trash2, Mail, Phone, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ContactChannelForm, ValidationResult } from '@/models/contacts/types';
import { CHANNELS, getChannelByCode } from '@/utils/constants/channels';
import { countries } from '@/utils/constants/countries';
import { hasFieldError, getFieldError } from '@/utils/contacts/validation';
import { cn } from '@/lib/utils';

interface ChannelsSectionProps {
  channels: ContactChannelForm[];
  onChange: (channels: ContactChannelForm[]) => void;
  validationErrors?: ValidationResult;
}

const ChannelsSection: React.FC<ChannelsSectionProps> = ({
  channels,
  onChange,
  validationErrors = { isValid: true, errors: [] }
}) => {
  // Add new channel
  const handleAddChannel = () => {
    const newChannel: ContactChannelForm = {
      type: 'email',
      value: '',
      isPrimary: channels.length === 0,
      countryCode: 'IN'
    };
    onChange([...channels, newChannel]);
  };

  // Update channel
  const handleChannelChange = (index: number, field: keyof ContactChannelForm, value: any) => {
    const updatedChannels = [...channels];
    updatedChannels[index] = {
      ...updatedChannels[index],
      [field]: value
    };
    onChange(updatedChannels);
  };

  // Set primary channel
  const handlePrimaryToggle = (index: number) => {
    const updatedChannels = channels.map((ch, i) => ({
      ...ch,
      isPrimary: i === index
    }));
    onChange(updatedChannels);
  };

  // Remove channel
  const handleRemoveChannel = (index: number) => {
    const channel = channels[index];
    if (channel.isPrimary && channels.length > 1) {
      // If removing primary, make the first remaining channel primary
      const updatedChannels = channels.filter((_, i) => i !== index);
      updatedChannels[0].isPrimary = true;
      onChange(updatedChannels);
    } else if (!channel.isPrimary) {
      onChange(channels.filter((_, i) => i !== index));
    }
  };

  // Get icon for channel type
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
      case 'mobile':
        return <Phone className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Channel List */}
      <div className="space-y-3">
        {channels.map((channel, index) => {
          const channelConfig = getChannelByCode(channel.type);
          const requiresCountryCode = channelConfig?.validation.requiresCountryCode;

          return (
            <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
              {/* Channel Type */}
              <div className="w-40">
                <Select
                  value={channel.type}
                  onValueChange={(value) => handleChannelChange(index, 'type', value)}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      {getChannelIcon(channel.type)}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map(ch => (
                      <SelectItem key={ch.code} value={ch.code}>
                        <div className="flex items-center gap-2">
                          {getChannelIcon(ch.code)}
                          <span>{ch.displayName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country Code (if needed) */}
              {requiresCountryCode && (
                <Select
                  value={channel.countryCode || 'IN'}
                  onValueChange={(value) => handleChannelChange(index, 'countryCode', value)}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        +{country.phoneCode} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Value Input */}
              <div className="flex-1 space-y-1">
                <Input
                  type={channel.type === 'email' ? 'email' : 'text'}
                  value={channel.value}
                  onChange={(e) => handleChannelChange(index, 'value', e.target.value)}
                  placeholder={channelConfig?.placeholder || 'Enter value'}
                  className={cn(
                    hasFieldError(validationErrors.errors, `channels.${index}.value`) && 'border-destructive'
                  )}
                />
                {hasFieldError(validationErrors.errors, `channels.${index}.value`) && (
                  <p className="text-sm text-destructive">
                    {getFieldError(validationErrors.errors, `channels.${index}.value`)}
                  </p>
                )}
              </div>

              {/* Primary Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 pt-1">
                      <Switch
                        checked={channel.isPrimary}
                        onCheckedChange={() => handlePrimaryToggle(index)}
                        disabled={channel.isPrimary}
                      />
                      <Label className="text-sm cursor-pointer">Primary</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Primary channel will be used for notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveChannel(index)}
                disabled={channels.length === 1}
                className="h-9 w-9"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Error Messages */}
      {hasFieldError(validationErrors.errors, 'channels') && (
        <p className="text-sm text-destructive">
          {getFieldError(validationErrors.errors, 'channels')}
        </p>
      )}

      {/* Add Channel Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddChannel}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Communication Channel
      </Button>
    </div>
  );
};

export default ChannelsSection;