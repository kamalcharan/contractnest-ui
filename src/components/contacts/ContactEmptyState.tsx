// src/components/contacts/ContactEmptyState.tsx
import React from 'react';
import { UserPlus, Upload, Users, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactTypeConfig } from '@/models/contacts/types';
import { cn } from '@/lib/utils';

interface ContactEmptyStateProps {
  selectedType?: ContactTypeConfig;
  onCreateContact: () => void;
  onImportContacts: () => void;
}

const ContactEmptyState: React.FC<ContactEmptyStateProps> = ({
  selectedType,
  onCreateContact,
  onImportContacts
}) => {
  // Get the appropriate icon based on contact type
  const getIcon = () => {
    if (!selectedType) {
      return <Users className="h-16 w-16 text-primary/60" />;
    }
    
    switch (selectedType.formType) {
      case 'CORPORATE':
        return <Building className="h-16 w-16 text-primary/60" />;
      case 'INDIVIDUAL':
      default:
        // Use specific icon based on type name if needed
        if (selectedType.name.toLowerCase() === 'employee') {
          return <User className="h-16 w-16 text-primary/60" />;
        }
        return <UserPlus className="h-16 w-16 text-primary/60" />;
    }
  };

  const getTitle = () => {
    if (!selectedType) return 'No contacts yet';
    return `No ${selectedType.name} contacts yet`;
  };

  const getDescription = () => {
    if (!selectedType) {
      return 'Start building your contact database by selecting a contact type and creating your first contact.';
    }
    return `Get started by creating your first ${selectedType.name.toLowerCase()} contact or import existing ones from a file.`;
  };

  const getCreateButtonText = () => {
    if (!selectedType) return 'Select a type first';
    return `+ ${selectedType.name}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Icon - Theme aware with primary color */}
        <div className="mb-6 p-6 rounded-full bg-primary/10">
          {getIcon()}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2">
          {getTitle()}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-8">
          {getDescription()}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Create Contact Button - Primary style */}
          <Button 
            onClick={onCreateContact}
            disabled={!selectedType}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {getCreateButtonText()}
          </Button>
          
          {/* Import Contacts Button - Outline with primary border like header */}
          <Button 
            variant="outline" 
            onClick={onImportContacts}
            className="w-full sm:w-auto border-primary/50 text-primary hover:border-primary hover:bg-primary/10 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Contacts
          </Button>
        </div>

        {/* Help Text */}
        {!selectedType && (
          <p className="text-sm text-muted-foreground mt-8">
            Select a contact type from the sidebar to get started
          </p>
        )}

        {/* Additional help for filtered states */}
        {selectedType && (
          <div className="mt-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              You can also:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Import {selectedType.name.toLowerCase()} contacts from CSV or Excel</li>
              <li>• Create contacts manually one by one</li>
              <li>• Use our API to sync contacts from other systems</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactEmptyState;