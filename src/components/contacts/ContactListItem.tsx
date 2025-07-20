// src/components/contacts/ContactListItem.tsx
import React from 'react';
import { 
  Mail, 
  Phone, 
  Building, 
  User, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Edit,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ContactSummary } from '@/models/contacts/types';
import { cn } from '@/lib/utils';

interface ContactListItemProps {
  contact: ContactSummary;
  onClick?: (contact: ContactSummary) => void;
  onEdit?: (contact: ContactSummary) => void;
  onDelete?: (contact: ContactSummary) => void;
  onMessage?: (contact: ContactSummary) => void;
  className?: string;
}

const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  onClick,
  onEdit,
  onDelete,
  onMessage,
  className
}) => {
  // Get initials for avatar
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format phone number for display
  const formatPhone = (phone: string): string => {
    return phone.replace(/(\+\d{2})(\d{5})(\d{5})/, '$1 $2 $3');
  };

  const handleRowClick = () => {
    if (onClick) {
      onClick(contact);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={cn(
        "group bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer",
        "hover:border-primary/20",
        className
      )}
      onClick={handleRowClick}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Avatar and Basic Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={contact.photoUrl} alt={contact.displayName} />
            <AvatarFallback className="text-sm bg-muted">
              {contact.formType === 'CORPORATE' ? (
                <Building className="h-5 w-5 text-muted-foreground" />
              ) : (
                getInitials(contact.displayName)
              )}
            </AvatarFallback>
          </Avatar>

          {/* Name and ID */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate">{contact.displayName}</h3>
              <span className="text-xs text-muted-foreground">#{contact.contactId}</span>
            </div>
            
            {/* Contact Types */}
            <div className="flex items-center gap-2 mt-1">
              {contact.types.map(type => (
                <Badge 
                  key={type.id} 
                  variant="secondary"
                  style={{ 
                    backgroundColor: `${type.color}15`,
                    color: type.color,
                    borderColor: `${type.color}30`
                  }}
                  className="text-xs border"
                >
                  {type.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Contact Info */}
        <div className="hidden md:flex items-center gap-6 px-4">
          {/* Email */}
          {contact.primaryEmail && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="max-w-[200px] truncate">{contact.primaryEmail}</span>
            </div>
          )}
          
          {/* Phone */}
          {contact.primaryPhone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{formatPhone(contact.primaryPhone)}</span>
            </div>
          )}
        </div>

        {/* Right Section - Status and Actions */}
        <div className="flex items-center gap-3">
          {/* User Badge */}
          {contact.isUser && (
            <Badge variant="outline" className="text-xs hidden sm:flex">
              <User className="h-3 w-3 mr-1" />
              User
            </Badge>
          )}

          {/* Status Icon */}
          <div className="flex items-center">
            {contact.isActive ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleActionClick}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onClick?.(contact)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(contact)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMessage?.(contact)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(contact)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ContactListItem;