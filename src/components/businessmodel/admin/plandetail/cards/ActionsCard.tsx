// src/components/businessmodel/admin/plandetail/ActionsCard.tsx - UPDATED

import React from 'react';
import { 
  Edit, 
  Eye, 
  EyeOff, 
  Archive, 
  Clock,
  GitBranch,
  DollarSign,
  Users
} from 'lucide-react';

interface ActionsCardProps {
  isVisible: boolean;
  isArchived: boolean;
  supportedCurrencies: string[];
  defaultCurrencyCode: string;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onArchive: () => void;
  onVersionHistory: () => void;
  onViewBilling: () => void;
  onAssignWithCurrency: (currency: string) => void;
}

const ActionsCard: React.FC<ActionsCardProps> = ({
  isVisible,
  isArchived,
  supportedCurrencies,
  defaultCurrencyCode,
  onEdit,
  onToggleVisibility,
  onArchive,
  onVersionHistory,
  onViewBilling,
  onAssignWithCurrency
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>
      
      <div className="space-y-3">
        {/* Edit Plan - Now creates version */}
        {!isArchived && (
          <button
            onClick={onEdit}
            className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Plan
          </button>
        )}
        
        {/* Toggle Visibility */}
        {!isArchived && (
          <button
            onClick={onToggleVisibility}
            className="w-full px-4 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
          >
            {isVisible ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Plan
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publish Plan
              </>
            )}
          </button>
        )}
        
        {/* Version History */}
        <button
          onClick={onVersionHistory}
          className="w-full px-4 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
        >
          <GitBranch className="h-4 w-4 mr-2" />
          Version History
        </button>
        
        {/* View Billing */}
        <button
          onClick={onViewBilling}
          className="w-full px-4 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          View Billing
        </button>
        
        {/* Assign to Tenants */}
        {!isArchived && supportedCurrencies.length > 0 && (
          <div className="border-t border-border pt-3">
            <p className="text-sm text-muted-foreground mb-2">Assign to Tenants:</p>
            <div className="space-y-2">
              {supportedCurrencies.map(currency => (
                <button
                  key={currency}
                  onClick={() => onAssignWithCurrency(currency)}
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-border bg-background hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1.5" />
                    Assign {currency} Plan
                  </span>
                  {currency === defaultCurrencyCode && (
                    <span className="text-xs text-muted-foreground">(Default)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Archive Plan */}
        {!isArchived && (
          <div className="border-t border-border pt-3">
            <button
              onClick={onArchive}
              className="w-full px-4 py-2 rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive Plan
            </button>
          </div>
        )}
        
        {/* Archived Status */}
        {isArchived && (
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-md p-3 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center text-amber-700 dark:text-amber-300">
              <Archive className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Plan Archived</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              This plan is no longer available for new subscriptions.
            </p>
          </div>
        )}
      </div>
      
      {/* Help Text */}
      <div className="mt-4 p-3 bg-muted/50 rounded-md">
        <p className="text-xs text-muted-foreground">
          <strong>Edit Plan:</strong> Creates a new version with your changes
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          <strong>Version History:</strong> View and activate different versions
        </p>
      </div>
    </div>
  );
};

export default ActionsCard;