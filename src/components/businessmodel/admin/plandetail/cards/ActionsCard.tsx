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
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className="rounded-lg border p-6 transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20'
      }}
    >
      <h3 
        className="text-lg font-semibold mb-4 transition-colors"
        style={{ color: colors.utility.primaryText }}
      >
        Actions
      </h3>
      
      <div className="space-y-3">
        {/* Edit Plan - Now creates version */}
        {!isArchived && (
          <button
            onClick={onEdit}
            className="w-full px-4 py-2 rounded-md transition-colors hover:opacity-90 flex items-center justify-center"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
              color: '#FFFFFF'
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Plan
          </button>
        )}
        
        {/* Toggle Visibility */}
        {!isArchived && (
          <button
            onClick={onToggleVisibility}
            className="w-full px-4 py-2 rounded-md border transition-colors hover:opacity-80 flex items-center justify-center"
            style={{
              borderColor: colors.utility.primaryText + '40',
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText
            }}
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
          className="w-full px-4 py-2 rounded-md border transition-colors hover:opacity-80 flex items-center justify-center"
          style={{
            borderColor: colors.utility.primaryText + '40',
            backgroundColor: colors.utility.primaryBackground,
            color: colors.utility.primaryText
          }}
        >
          <GitBranch className="h-4 w-4 mr-2" />
          Version History
        </button>
        
        {/* View Billing */}
        <button
          onClick={onViewBilling}
          className="w-full px-4 py-2 rounded-md border transition-colors hover:opacity-80 flex items-center justify-center"
          style={{
            borderColor: colors.utility.primaryText + '40',
            backgroundColor: colors.utility.primaryBackground,
            color: colors.utility.primaryText
          }}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          View Billing
        </button>
        
        {/* Assign to Tenants */}
        {!isArchived && supportedCurrencies.length > 0 && (
          <div 
            className="border-t pt-3 transition-colors"
            style={{ borderColor: colors.utility.primaryText + '20' }}
          >
            <p 
              className="text-sm mb-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Assign to Tenants:
            </p>
            <div className="space-y-2">
              {supportedCurrencies.map(currency => (
                <button
                  key={currency}
                  onClick={() => onAssignWithCurrency(currency)}
                  className="w-full px-3 py-1.5 text-sm rounded-md border transition-colors hover:opacity-80 flex items-center justify-between"
                  style={{
                    borderColor: colors.utility.primaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                >
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1.5" />
                    Assign {currency} Plan
                  </span>
                  {currency === defaultCurrencyCode && (
                    <span 
                      className="text-xs transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      (Default)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Archive Plan */}
        {!isArchived && (
          <div 
            className="border-t pt-3 transition-colors"
            style={{ borderColor: colors.utility.primaryText + '20' }}
          >
            <button
              onClick={onArchive}
              className="w-full px-4 py-2 rounded-md border transition-colors hover:opacity-80 flex items-center justify-center"
              style={{
                borderColor: colors.semantic.error + '40',
                backgroundColor: colors.semantic.error + '10',
                color: colors.semantic.error
              }}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive Plan
            </button>
          </div>
        )}
        
        {/* Archived Status */}
        {isArchived && (
          <div 
            className="rounded-md p-3 border transition-colors"
            style={{
              backgroundColor: (colors.semantic.warning || '#f59e0b') + '10',
              borderColor: (colors.semantic.warning || '#f59e0b') + '40'
            }}
          >
            <div 
              className="flex items-center transition-colors"
              style={{ color: colors.semantic.warning || '#f59e0b' }}
            >
              <Archive className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Plan Archived</span>
            </div>
            <p 
              className="text-xs mt-1 transition-colors"
              style={{ color: (colors.semantic.warning || '#f59e0b') }}
            >
              This plan is no longer available for new subscriptions.
            </p>
          </div>
        )}
      </div>
      
      {/* Help Text */}
      <div 
        className="mt-4 p-3 rounded-md transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground + '50' }}
      >
        <p 
          className="text-xs transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          <strong>Edit Plan:</strong> Creates a new version with your changes
        </p>
        <p 
          className="text-xs mt-1 transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          <strong>Version History:</strong> View and activate different versions
        </p>
      </div>
    </div>
  );
};

export default ActionsCard;