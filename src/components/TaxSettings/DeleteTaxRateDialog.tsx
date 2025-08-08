// src/components/TaxSettings/DeleteTaxRateDialog.tsx
// Confirmation dialog for deleting tax rates using existing ConfirmationDialog

import { Crown, AlertTriangle } from 'lucide-react';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

// Import types
import type { DeleteTaxRateDialogProps } from '@/types/taxSettings';

const DeleteTaxRateDialog = ({
  isOpen,
  rate,
  onConfirm,
  onCancel,
  isDeleting
}: DeleteTaxRateDialogProps) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Don't render if no rate is selected
  if (!rate) {
    return null;
  }

  // Handle confirm action
  const handleConfirm = async () => {
    if (isDeleting) return; // Prevent double-clicking
    await onConfirm();
  };

  // Handle cancel action
  const handleCancel = () => {
    if (isDeleting) return; // Prevent canceling during deletion
    onCancel();
  };

  // Format rate for display
  const formatRate = (rateValue: number) => {
    return `${rateValue}%`;
  };

  // Check if this is a default rate (should not happen, but safety check)
  const isDefaultRate = rate.is_default;

  // Prepare dialog content
  const getDialogContent = () => {
    if (isDefaultRate) {
      return {
        title: 'Cannot Delete Default Rate',
        description: `The tax rate "${rate.name}" is currently set as the default rate and cannot be deleted. To delete this rate, first set another tax rate as the default, then try again.`,
        confirmText: 'Understood',
        type: 'warning' as const,
        icon: <Crown className="h-6 w-6" style={{ color: colors.semantic.warning }} />,
        showCancel: false
      };
    }

    // Build description with rate info and warnings
    let description = `Are you sure you want to delete the tax rate "${rate.name}" (${formatRate(rate.rate)})?`;
    
    if (rate.description) {
      description += `\n\nDescription: ${rate.description}`;
    }
    
    description += '\n\nThis action cannot be undone. Services using this rate will need to be updated.';
    
    // Add special warning for tax-exempt rates
    if (rate.rate === 0) {
      description += '\n\nNote: This appears to be a tax-exempt rate (0%). Make sure you have another way to handle tax-exempt services.';
    }

    return {
      title: 'Delete Tax Rate',
      description,
      confirmText: 'Delete Tax Rate',
      type: 'danger' as const,
      icon: <AlertTriangle className="h-6 w-6" style={{ color: colors.semantic.error }} />,
      showCancel: true
    };
  };

  const dialogContent = getDialogContent();

  // For default rates, we only show an "OK" style dialog
  if (isDefaultRate) {
    return (
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleCancel} // Just close the dialog
        title={dialogContent.title}
        description={dialogContent.description}
        confirmText={dialogContent.confirmText}
        type={dialogContent.type}
        icon={dialogContent.icon}
        isLoading={false}
      />
    );
  }

  // For regular rates, show delete confirmation
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title={dialogContent.title}
      description={dialogContent.description}
      confirmText={dialogContent.confirmText}
      cancelText="Cancel"
      type={dialogContent.type}
      icon={dialogContent.icon}
      isLoading={isDeleting}
    />
  );
};

export default DeleteTaxRateDialog;