// src/components/TaxSettings/TaxRatesPanel.tsx
// Panel component for tax rates management following LOV methodology

import { useState } from 'react';
import { Plus, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// Import components
import TaxRateCard from './TaxRateCard';
import AddTaxRateModal from './AddTaxRateModal';
import DeleteTaxRateDialog from './DeleteTaxRateDialog';

// Import types
import type { 
  UseTaxRatesReturn,
  TaxRateFormData,
  TaxRateWithUI 
} from '@/types/taxSettings';

interface TaxRatesPanelProps {
  hook: UseTaxRatesReturn;
  onError?: (error: string) => void;
}

const TaxRatesPanel = ({ hook, onError }: TaxRatesPanelProps) => {
  const { 
    state, 
    createRate, 
    updateRate, 
    deleteRate, 
    setDefaultRate,
    startEditing, 
    cancelEditing,
    startAdding,
    cancelAdding,
    getNextSequence,
    checkNameExists
  } = hook;

  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Local state for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<TaxRateWithUI | null>(null);

  // Handle add new rate
  const handleAddClick = () => {
    setShowAddModal(true);
    startAdding();
  };

  // Handle add modal close
  const handleAddModalClose = () => {
    setShowAddModal(false);
    cancelAdding();
  };

  // Handle add rate submit with enhanced error handling
  const handleAddRateSubmit = async (data: TaxRateFormData) => {
    try {
      await createRate(data);
      setShowAddModal(false);
      
      // SUCCESS TOAST
      toast.success(`Tax Rate Created: "${data.name}" (${data.rate}%) has been created successfully`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.success,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create tax rate';
      
      // Check if it's a duplicate error and show appropriate message
      if (errorMessage.includes('already exists')) {
        // DUPLICATE ERROR TOAST
        toast.error(`Duplicate Tax Rate: ${errorMessage}`, {
          duration: 4000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: colors.semantic.warning,
            color: '#FFF',
            fontSize: '16px',
            minWidth: '300px'
          },
          icon: '⚠️'
        });
      } else {
        // GENERAL ERROR TOAST
        toast.error(`Creation Failed: ${errorMessage}`, {
          duration: 4000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: colors.semantic.error,
            color: '#FFF',
            fontSize: '16px',
            minWidth: '300px'
          }
        });
      }
      
      onError?.(errorMessage);
      // Keep modal open on error
    }
  };

  // Handle edit rate
  const handleEditRate = (id: string) => {
    startEditing(id);
  };

  // Handle save rate edit
  const handleSaveRateEdit = async (id: string, data: Partial<TaxRateFormData>) => {
    try {
      await updateRate(id, data);
      // Success toast is handled in TaxRateCard component
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update tax rate';
      onError?.(errorMessage);
      // Error toast is handled in TaxRateCard component
    }
  };

  // Handle cancel rate edit
  const handleCancelRateEdit = (id: string) => {
    cancelEditing(id);
  };

  // Handle delete rate click
  const handleDeleteRateClick = (rate: TaxRateWithUI) => {
    // Check if it's the default rate
    if (rate.is_default) {
      toast.error('Cannot delete the default tax rate. Please set another rate as default first.', {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    setRateToDelete(rate);
    setShowDeleteDialog(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!rateToDelete) return;

    try {
      await deleteRate(rateToDelete.id);
      setShowDeleteDialog(false);
      
      // SUCCESS TOAST
      toast.success(`Tax Rate Deleted: "${rateToDelete.name}" has been deleted successfully`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.success,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      
      setRateToDelete(null);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete tax rate';
      onError?.(errorMessage);
      
      // ERROR TOAST
      toast.error(`Deletion Failed: ${errorMessage}`, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      
      // Keep dialog open on error
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setRateToDelete(null);
  };

  // Handle set default rate
  const handleSetDefaultRate = async (id: string) => {
    const rate = state.data.find(r => r?.id === id);
    
    try {
      await setDefaultRate(id);
      
      // SUCCESS TOAST
      toast.success(`Default Tax Rate Updated: "${rate?.name || 'Unknown'}" is now the default tax rate`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.success,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to set default tax rate';
      onError?.(errorMessage);
      
      // ERROR TOAST
      toast.error(`Failed to Set Default: ${errorMessage}`, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await hook.refresh();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to refresh tax rates';
      onError?.(errorMessage);
    }
  };

  // Sort rates by sequence number with safety checks
  const sortedRates = Array.isArray(state.data) 
    ? state.data
        .filter(rate => rate && typeof rate === 'object' && rate.id && rate.name)
        .sort((a, b) => {
          if (a.sequence_no === b.sequence_no) {
            return a.name.localeCompare(b.name);
          }
          return (a.sequence_no || 0) - (b.sequence_no || 0);
        })
    : [];

  // Get default rate
  const defaultRate = sortedRates.find(rate => rate?.is_default);

  // Loading state
  if (state.loading) {
    return (
      <div 
        className="rounded-lg shadow-sm border p-6 transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 
            className="h-6 w-6 animate-spin"
            style={{ color: colors.brand.primary }}
          />
          <span 
            className="ml-2 text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Loading tax rates...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div 
        className="rounded-lg shadow-sm border p-6 transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <div className="text-center py-8">
          <div 
            className="font-medium mb-2 transition-colors"
            style={{ color: colors.semantic.error }}
          >
            Failed to load tax rates
          </div>
          <div 
            className="text-sm mb-4 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {state.error}
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            disabled={state.loading}
            className="transition-all duration-200 hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}40`,
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText
            }}
          >
            {state.loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Try Again'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel Title and Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 
            className="text-xl font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Tax Rates
          </h2>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Calculate tax on services
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Loading indicator */}
          {state.saving && (
            <div 
              className="flex items-center space-x-2 text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          
          {!state.isAdding && (
            <Button 
              onClick={handleAddClick}
              className="text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
              disabled={state.saving}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add tax rate
            </Button>
          )}
        </div>
      </div>

      {/* Default Tax Rate Info */}
      {defaultRate && (
        <div 
          className="rounded-lg p-4 transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryText}10` }}
        >
          <div 
            className="text-sm font-medium mb-1 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Default tax rate
          </div>
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Services will use <span 
              className="font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >{defaultRate.name} ({defaultRate.rate}%)</span> unless a specific rate is assigned to the service
          </div>
        </div>
      )}

      {/* Column Headers */}
      <div 
        className="rounded-lg shadow-sm border mb-4 transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <div className="grid grid-cols-4 gap-4 px-4 py-3">
          <div 
            className="font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            NAME
          </div>
          <div 
            className="font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            RATE
          </div>
          <div 
            className="font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            DEFAULT
          </div>
          <div 
            className="font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            ACTIONS
          </div>
        </div>
      </div>

      {/* Tax Rates List */}
      <div className="space-y-4">
        {sortedRates.length > 0 ? (
          sortedRates.map((rate) => {
            if (!rate || !rate.id) {
              return null;
            }
            
            return (
              <TaxRateCard
                key={rate.id}
                rate={rate}
                onEdit={handleEditRate}
                onDelete={() => handleDeleteRateClick(rate)}
                onSetDefault={handleSetDefaultRate}
                onSave={handleSaveRateEdit}
                onCancel={handleCancelRateEdit}
                disabled={state.saving || state.deletingId === rate.id}
                isDefaultChanging={state.saving && rate.is_default}
              />
            );
          })
        ) : (
          // Empty State
          <div 
            className="rounded-lg shadow-sm border p-8 text-center transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <div className="mb-4">
              <AlertTriangle 
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: colors.utility.secondaryText }}
              />
              <div 
                className="text-lg font-medium mb-2 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                No tax rates configured
              </div>
              <div 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                You need at least one tax rate to calculate taxes on your services.
              </div>
            </div>
            <Button 
              onClick={handleAddClick}
              className="text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add your first tax rate
            </Button>
          </div>
        )}
      </div>

      {/* Warning about no default rate */}
      {sortedRates.length > 0 && !defaultRate && (
        <div 
          className="border rounded-lg p-4 transition-colors"
          style={{
            backgroundColor: `${colors.semantic.warning}10`,
            borderColor: `${colors.semantic.warning}40`
          }}
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle 
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: colors.semantic.warning }}
            />
            <div className="text-sm">
              <div 
                className="font-medium mb-1 transition-colors"
                style={{ color: colors.semantic.warning }}
              >
                No Default Tax Rate Set
              </div>
              <div 
                className="transition-colors"
                style={{ color: colors.semantic.warning }}
              >
                Consider setting one of your tax rates as the default. This will be used automatically for new services.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals and Dialogs */}
      <AddTaxRateModal
        isOpen={showAddModal}
        onClose={handleAddModalClose}
        onSubmit={handleAddRateSubmit}
        existingRates={sortedRates}
      />

      <DeleteTaxRateDialog
        isOpen={showDeleteDialog}
        rate={rateToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={state.deletingId === rateToDelete?.id}
      />
    </div>
  );
};

export default TaxRatesPanel;