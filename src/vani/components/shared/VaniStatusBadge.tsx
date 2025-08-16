// contractnest-ui/src/vani/components/shared/VaNiStatusBadge.tsx 
import * as React from "react";
import { cn } from "../../../lib/utils";
import { useTheme } from "../../../contexts/ThemeContext";

// Updated type definitions to include business event statuses
type JobStatus = 'pending' | 'staged' | 'executing' | 'completed' | 'failed' | 'cancelled';
type ChannelStatus = 'active' | 'inactive' | 'error' | 'configuring';
type DeliveryStatus = 'sent' | 'delivered' | 'failed' | 'pending';
type BusinessEventStatus = 'planned' | 'reminded' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
type ModuleHealthStatus = 'healthy' | 'warning' | 'critical';

interface VaNiStatusBadgeProps {
  status: JobStatus | ChannelStatus | DeliveryStatus | BusinessEventStatus | ModuleHealthStatus;
  variant?: 'job' | 'channel' | 'delivery' | 'event' | 'health';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  // Job statuses
  pending: { 
    label: 'Pending', 
    color: 'warning',
    icon: '⏳'
  },
  staged: { 
    label: 'Staged', 
    color: 'info',
    icon: '📋'
  },
  executing: { 
    label: 'Executing', 
    color: 'info',
    icon: '⚡'
  },
  completed: { 
    label: 'Completed', 
    color: 'success',
    icon: '✅'
  },
  failed: { 
    label: 'Failed', 
    color: 'error',
    icon: '❌'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'neutral',
    icon: '🚫'
  },
  
  // Channel statuses
  active: { 
    label: 'Active', 
    color: 'success',
    icon: '🟢'
  },
  inactive: { 
    label: 'Inactive', 
    color: 'neutral',
    icon: '⚪'
  },
  error: { 
    label: 'Error', 
    color: 'error',
    icon: '🔴'
  },
  configuring: { 
    label: 'Configuring', 
    color: 'warning',
    icon: '⚙️'
  },
  
  // Delivery statuses
  sent: { 
    label: 'Sent', 
    color: 'info',
    icon: '📤'
  },
  delivered: { 
    label: 'Delivered', 
    color: 'success',
    icon: '✅'
  },
  
  // Business Event statuses (NEW)
  planned: {
    label: 'Planned',
    color: 'info',
    icon: '📅'
  },
  reminded: {
    label: 'Reminded',
    color: 'warning',
    icon: '🔔'
  },
  in_progress: {
    label: 'In Progress',
    color: 'info',
    icon: '⚡'
  },
  
  // Module Health statuses (NEW)
  healthy: {
    label: 'Healthy',
    color: 'success',
    icon: '💚'
  },
  warning: {
    label: 'Warning',
    color: 'warning',
    icon: '⚠️'
  },
  critical: {
    label: 'Critical',
    color: 'error',
    icon: '🚨'
  }
};

export const VaNiStatusBadge: React.FC<VaNiStatusBadgeProps> = ({
  status,
  variant = 'job',
  size = 'md',
  showIcon = true,
  className
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const config = statusConfig[status as keyof typeof statusConfig];
  
  if (!config) {
    return (
      <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs", className)}>
        {status}
      </span>
    );
  }

  const getColorStyles = (colorType: string) => {
    switch (colorType) {
      case 'success':
        return {
          backgroundColor: `${colors.semantic.success}20`,
          color: colors.semantic.success,
          borderColor: `${colors.semantic.success}40`
        };
      case 'error':
        return {
          backgroundColor: `${colors.semantic.error}20`,
          color: colors.semantic.error,
          borderColor: `${colors.semantic.error}40`
        };
      case 'warning':
        return {
          backgroundColor: `${colors.semantic.warning}20`,
          color: colors.semantic.warning,
          borderColor: `${colors.semantic.warning}40`
        };
      case 'info':
        return {
          backgroundColor: `${colors.brand.primary}20`,
          color: colors.brand.primary,
          borderColor: `${colors.brand.primary}40`
        };
      case 'neutral':
        return {
          backgroundColor: `${colors.utility.secondaryText}20`,
          color: colors.utility.secondaryText,
          borderColor: `${colors.utility.secondaryText}40`
        };
      default:
        return {
          backgroundColor: `${colors.utility.secondaryText}20`,
          color: colors.utility.secondaryText,
          borderColor: `${colors.utility.secondaryText}40`
        };
    }
  };

  const colorStyles = getColorStyles(config.color);

  // Variant-specific adjustments
  const getVariantStyles = () => {
    switch (variant) {
      case 'event':
        return {
          fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '0.875rem' : '0.8125rem',
          fontWeight: '500'
        };
      case 'health':
        return {
          fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '0.875rem' : '0.8125rem',
          fontWeight: '600',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.025em'
        };
      default:
        return {};
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border rounded-full font-medium transition-colors",
        size === 'sm' && "px-2 py-0.5 text-xs",
        size === 'md' && "px-2.5 py-1 text-sm",
        size === 'lg' && "px-3 py-1.5 text-base",
        className
      )}
      style={{
        ...colorStyles,
        ...getVariantStyles()
      }}
    >
      {showIcon && (
        <span className="text-xs">{config.icon}</span>
      )}
      {config.label}
    </span>
  );
};