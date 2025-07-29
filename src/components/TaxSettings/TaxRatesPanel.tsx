// src/components/TaxSettings/TaxRatesPanel.tsx
// Panel component for tax rates management following LOV methodology

import { useState } from 'react';
import { Plus, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

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
          background: '#10B981',
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
            background: '#F59E0B', // Amber color for warning
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
            background: '#EF4444',
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
          background: '#EF4444',
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
          background: '#10B981',
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
          background: '#EF4444',
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
          background: '#10B981',
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
          background: '#EF4444',
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
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading tax rates...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="text-center py-8">
          <div className="text-destructive font-medium mb-2">
            Failed to load tax rates
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {state.error}
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            disabled={state.loading}
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
          <h2 className="text-xl font-semibold">Tax Rates</h2>
          <p className="text-muted-foreground">
            Calculate tax on services
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Loading indicator */}
          {state.saving && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          
          {!state.isAdding && (
            <Button 
              onClick={handleAddClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm font-medium mb-1">Default tax rate</div>
          <div className="text-sm text-muted-foreground">
            Services will use <span className="font-medium">{defaultRate.name} ({defaultRate.rate}%)</span> unless a specific rate is assigned to the service
          </div>
        </div>
      )}

      {/* Column Headers */}
      <div className="bg-card rounded-lg shadow-sm border border-border mb-4">
        <div className="grid grid-cols-4 gap-4 px-4 py-3">
          <div className="font-medium">NAME</div>
          <div className="font-medium">RATE</div>
          <div className="font-medium">DEFAULT</div>
          <div className="font-medium">ACTIONS</div>
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
          <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
            <div className="mb-4">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">No tax rates configured</div>
              <div className="text-muted-foreground">
                You need at least one tax rate to calculate taxes on your services.
              </div>
            </div>
            <Button 
              onClick={handleAddClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add your first tax rate
            </Button>
          </div>
        )}
      </div>

      {/* Warning about no default rate */}
      {sortedRates.length > 0 && !defaultRate && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                No Default Tax Rate Set
              </div>
              <div className="text-amber-700 dark:text-amber-300">
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