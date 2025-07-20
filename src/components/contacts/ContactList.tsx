// src/components/contacts/ContactList.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactCard from './ContactCard';
import ContactListItem from './ContactListItem';
import { ContactSummary } from '@/models/contacts/types';
import { cn } from '@/lib/utils';

interface ContactListProps {
  contacts: ContactSummary[];
  viewMode: 'grid' | 'list';
  onContactClick: (contact: ContactSummary) => void;
  onContactEdit?: (contact: ContactSummary) => void;
  onContactDelete?: (contact: ContactSummary) => void;
  onContactMessage?: (contact: ContactSummary) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  viewMode,
  onContactClick,
  onContactEdit,
  onContactDelete,
  onContactMessage,
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  // Pagination helpers
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Contact Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {contacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={onContactClick}
              onEdit={onContactEdit}
              onDelete={onContactDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(contact => (
            <ContactListItem
              key={contact.id}
              contact={contact}
              onClick={onContactClick}
              onEdit={onContactEdit}
              onDelete={onContactDelete}
              onMessage={onContactMessage}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                  •••
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-8 h-8 p-0",
                    page === currentPage && "pointer-events-none"
                  )}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )
            ))}
          </div>

          {/* Mobile Page Indicator */}
          <span className="sm:hidden text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          
          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactList;