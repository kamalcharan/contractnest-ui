// src/components/ui/ConfirmationDialog.tsx - FULLY THEME-AWARE VERSION

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info' | 'success' | 'primary';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Cancel',
  type = 'warning',
  icon,
  isLoading = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: colors.semantic.error + '10',
          iconColor: colors.semantic.error,
          confirmButton: {
            background: `linear-gradient(to right, ${colors.semantic.error}, ${colors.semantic.error}dd)`,
            color: '#ffffff'
          }
        };
      case 'warning':
        return {
          iconBg: colors.semantic.warning + '10',
          iconColor: colors.semantic.warning,
          confirmButton: {
            background: `linear-gradient(to right, ${colors.semantic.warning}, ${colors.semantic.warning}dd)`,
            color: '#ffffff'
          }
        };
      case 'info':
      case 'primary':
        return {
          iconBg: colors.brand.primary + '10',
          iconColor: colors.brand.primary,
          confirmButton: {
            background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
            color: '#ffffff'
          }
        };
      case 'success':
        return {
          iconBg: colors.semantic.success + '10',
          iconColor: colors.semantic.success,
          confirmButton: {
            background: `linear-gradient(to right, ${colors.semantic.success}, ${colors.semantic.success}dd)`,
            color: '#ffffff'
          }
        };
      default:
        return {
          iconBg: colors.brand.primary + '10',
          iconColor: colors.brand.primary,
          confirmButton: {
            background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
            color: '#ffffff'
          }
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm transition-opacity"
        style={{
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'
        }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="relative transform overflow-hidden rounded-lg border px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 transition-colors hover:opacity-80"
            style={{ color: colors.utility.secondaryText }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.utility.primaryText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.utility.secondaryText;
            }}
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="sm:flex sm:items-start">
            {/* Icon */}
            <div 
              className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 transition-colors"
              style={{ backgroundColor: styles.iconBg }}
            >
              <div style={{ color: styles.iconColor }}>
                {icon || <AlertTriangle className="h-6 w-6" />}
              </div>
            </div>
            
            {/* Content */}
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
              <h3 
                className="text-base font-semibold leading-6 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {title}
              </h3>
              <div className="mt-2">
                {typeof description === 'string' ? (
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {description}
                  </p>
                ) : (
                  <div className="text-sm">
                    {description}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm sm:w-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={styles.confirmButton}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="mt-3 inline-flex w-full justify-center rounded-md border px-4 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '40',
                color: colors.utility.primaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.utility.secondaryBackground;
              }}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;