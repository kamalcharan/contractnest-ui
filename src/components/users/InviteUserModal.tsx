// src/components/users/InviteUserModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import InviteUserForm from './InviteUserForm';
import { CreateInvitationData } from '@/hooks/useInvitations';
import { useTheme } from '@/contexts/ThemeContext';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvitationData) => Promise<void>;
  isSubmitting?: boolean;
  availableRoles?: Array<{ id: string; name: string; description?: string }>;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  availableRoles = []
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  if (!isOpen) return null;

  const handleSubmit = async (data: CreateInvitationData) => {
    await onSubmit(data);
    // Close modal on success
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-50 transition-colors"
        style={{ backgroundColor: `${colors.utility.primaryBackground}CC` }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%]">
        <div 
          className="border rounded-lg shadow-lg transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}20`
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-6 border-b transition-colors"
            style={{ borderColor: `${colors.utility.primaryText}20` }}
          >
            <h2 
              className="text-xl font-semibold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Invite User
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-md transition-all duration-200 hover:opacity-80"
              style={{ 
                backgroundColor: `${colors.utility.primaryText}10`,
                color: colors.utility.primaryText
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <InviteUserForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
              availableRoles={availableRoles}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteUserModal;

// Alternative: Slide-over panel variant
interface InviteUserPanelProps extends InviteUserModalProps {
  position?: 'left' | 'right';
}

export const InviteUserPanel: React.FC<InviteUserPanelProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  availableRoles = [],
  position = 'right'
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const handleSubmit = async (data: CreateInvitationData) => {
    await onSubmit(data);
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 backdrop-blur-sm transition-opacity z-50",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ backgroundColor: `${colors.utility.primaryBackground}CC` }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 h-full w-full max-w-md border shadow-xl z-50 transition-transform",
          position === 'right' ? "right-0 border-l" : "left-0 border-r",
          isOpen 
            ? "translate-x-0" 
            : position === 'right' ? "translate-x-full" : "-translate-x-full"
        )}
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-6 border-b transition-colors"
            style={{ borderColor: `${colors.utility.primaryText}20` }}
          >
            <h2 
              className="text-xl font-semibold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Invite User
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-md transition-all duration-200 hover:opacity-80"
              style={{ 
                backgroundColor: `${colors.utility.primaryText}10`,
                color: colors.utility.primaryText
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <InviteUserForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
              availableRoles={availableRoles}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Compound component for easy usage
interface InviteUserDialogProps {
  trigger: React.ReactNode;
  onInvite: (data: CreateInvitationData) => Promise<void>;
  availableRoles?: Array<{ id: string; name: string; description?: string }>;
  variant?: 'modal' | 'panel';
  panelPosition?: 'left' | 'right';
}

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  trigger,
  onInvite,
  availableRoles = [],
  variant = 'modal',
  panelPosition = 'right'
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: CreateInvitationData) => {
    setIsSubmitting(true);
    try {
      await onInvite(data);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger element */}
      <div onClick={() => setIsOpen(true)}>
        {trigger}
      </div>

      {/* Dialog */}
      {variant === 'modal' ? (
        <InviteUserModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          availableRoles={availableRoles}
        />
      ) : (
        <InviteUserPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          availableRoles={availableRoles}
          position={panelPosition}
        />
      )}
    </>
  );
};