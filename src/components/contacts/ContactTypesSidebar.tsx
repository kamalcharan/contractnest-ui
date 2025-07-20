// src/components/contacts/ContactTypesSidebar.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ContactTypeConfig } from '@/models/contacts/types';
import { cn } from '@/lib/utils';

interface ContactTypesSidebarProps {
  contactTypes: ContactTypeConfig[];
  selectedType: string | null;
  onTypeSelect: (typeId: string | null) => void;
  getTypeCount: (typeId: string) => number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isLoading?: boolean;
  className?: string;
}

const ContactTypesSidebar: React.FC<ContactTypesSidebarProps> = ({
  contactTypes,
  selectedType,
  onTypeSelect,
  getTypeCount,
  isCollapsed,
  onToggleCollapse,
  isLoading,
  className
}) => {
  const totalCount = React.useMemo(() => {
    return contactTypes.reduce((sum, type) => sum + getTypeCount(type.id), 0);
  }, [contactTypes, getTypeCount]);

  const TypeButton: React.FC<{ type: ContactTypeConfig }> = ({ type }) => {
    const count = getTypeCount(type.id);
    const isSelected = selectedType === type.id;

    const button = (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start hover:bg-muted/50",
          isCollapsed && "justify-center px-2",
          isSelected && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        onClick={() => onTypeSelect(isSelected ? null : type.id)}
      >
        <div 
          className={cn(
            "w-3 h-3 rounded-full shrink-0",
            !isCollapsed && "mr-3"
          )}
          style={{ backgroundColor: type.color }}
        />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left truncate">{type.name}</span>
            <Badge variant="secondary" className="ml-auto bg-muted">
              {count}
            </Badge>
          </>
        )}
      </Button>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{type.name} ({count})</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "flex flex-col h-full bg-white border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          {!isCollapsed && (
            <h3 className="font-medium text-sm">Contact Types</h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-auto"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* All Contacts */}
        <div className="p-2 bg-white">
          {isLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <TooltipProvider>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-center px-2 hover:bg-muted/50",
                        !selectedType && "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                      onClick={() => onTypeSelect(null)}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>All Contacts ({totalCount})</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start hover:bg-muted/50",
                    !selectedType && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => onTypeSelect(null)}
                >
                  <Users className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">All Contacts</span>
                  <Badge variant="secondary" className="ml-auto bg-muted">
                    {totalCount}
                  </Badge>
                </Button>
              )}
            </TooltipProvider>
          )}
        </div>

        {/* Contact Types List */}
        <ScrollArea className="flex-1 px-2 bg-white">
          <div className="space-y-1 pb-2">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </>
            ) : (
              contactTypes.map(type => (
                <TypeButton key={type.id} type={type} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
};

export default ContactTypesSidebar;