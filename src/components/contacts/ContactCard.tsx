// src/components/contacts/ContactCard.tsx
import React from 'react';
import { Mail, Phone, Building, User, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

interface ContactCardProps {
  contact: ContactSummary;
  onClick?: (contact: ContactSummary) => void;
  onEdit?: (contact: ContactSummary) => void;
  onDelete?: (contact: ContactSummary) => void;
  className?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onClick,
  onEdit,
  onDelete,
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
    // Simple formatting - can be enhanced based on country
    return phone.replace(/(\+\d{2})(\d{5})(\d{5})/, '$1 $2 $3');
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(contact);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.photoUrl} alt={contact.displayName} />
              <AvatarFallback className="text-sm">
                {contact.formType === 'CORPORATE' ? (
                  <Building className="h-5 w-5" />
                ) : (
                  getInitials(contact.displayName)
                )}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-sm">{contact.displayName}</h3>
              <p className="text-xs text-muted-foreground">{contact.contactId}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleMoreClick}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(contact)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete?.(contact)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contact Types */}
        <div className="flex flex-wrap gap-1 mb-3">
          {contact.types.map(type => (
            <Badge 
              key={type.id} 
              variant="secondary"
              style={{ 
                backgroundColor: `${type.color}20`,
                color: type.color,
                borderColor: type.color
              }}
              className="text-xs border"
            >
              {type.name}
            </Badge>
          ))}
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          {contact.primaryEmail && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{contact.primaryEmail}</span>
            </div>
          )}
          
          {contact.primaryPhone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{formatPhone(contact.primaryPhone)}</span>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            {contact.isUser && (
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                User
              </Badge>
            )}
          </div>
          
          <div className="flex items-center">
            {contact.isActive ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;