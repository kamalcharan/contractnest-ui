// src/components/users/UserStatusBadge.tsx
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Mail, 
  RefreshCw, 
  UserX,
  AlertCircle,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

export type UserStatus = 'active' | 'invited' | 'pending' | 'expired' | 'cancelled' | 'suspended' | 'inactive';

interface UserStatusBadgeProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
  className
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const statusConfig = {
    active: {
      icon: CheckCircle,
      label: 'Active',
      color: {
        bg: colors.semantic.success + '10',
        text: colors.semantic.success,
        border: colors.semantic.success + '40'
      }
    },
    invited: {
      icon: Mail,
      label: 'Invited',
      color: {
        bg: colors.brand.primary + '10',
        text: colors.brand.primary,
        border: colors.brand.primary + '40'
      }
    },
    pending: {
      icon: Clock,
      label: 'Pending',
      color: {
        bg: colors.brand.primary + '10',
        text: colors.brand.primary,
        border: colors.brand.primary + '40'
      }
    },
    expired: {
      icon: AlertCircle,
      label: 'Expired',
      color: {
        bg: colors.semantic.warning + '10',
        text: colors.semantic.warning,
        border: colors.semantic.warning + '40'
      }
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelled',
      color: {
        bg: colors.utility.secondaryText + '10',
        text: colors.utility.secondaryText,
        border: colors.utility.secondaryText + '40'
      }
    },
    suspended: {
      icon: UserX,
      label: 'Suspended',
      color: {
        bg: colors.semantic.error + '10',
        text: colors.semantic.error,
        border: colors.semantic.error + '40'
      }
    },
    inactive: {
      icon: User,
      label: 'Inactive',
      color: {
        bg: colors.utility.secondaryText + '10',
        text: colors.utility.secondaryText,
        border: colors.utility.secondaryText + '40'
      }
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      badge: 'px-2 py-0.5 text-xs',
      icon: 12,
      iconOnly: 'p-1'
    },
    md: {
      badge: 'px-2.5 py-1 text-sm',
      icon: 14,
      iconOnly: 'p-1.5'
    },
    lg: {
      badge: 'px-3 py-1.5 text-base',
      icon: 16,
      iconOnly: 'p-2'
    }
  };

  const sizeConfig = sizeClasses[size];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        showLabel ? sizeConfig.badge : sizeConfig.iconOnly,
        className
      )}
      style={{
        backgroundColor: config.color.bg,
        color: config.color.text,
        borderColor: config.color.border
      }}
    >
      <Icon size={sizeConfig.icon} className={showLabel ? 'mr-1' : ''} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export default UserStatusBadge;

// Additional component for user role badges
interface UserRoleBadgeProps {
  role: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  role,
  color,
  size = 'md',
  className
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const roleColors = {
    owner: {
      bg: colors.brand.tertiary + '10',
      text: colors.brand.tertiary,
      border: colors.brand.tertiary + '40'
    },
    admin: {
      bg: colors.brand.secondary + '10',
      text: colors.brand.secondary,
      border: colors.brand.secondary + '40'
    },
    editor: {
      bg: colors.brand.primary + '10',
      text: colors.brand.primary,
      border: colors.brand.primary + '40'
    },
    viewer: {
      bg: colors.utility.secondaryText + '10',
      text: colors.utility.secondaryText,
      border: colors.utility.secondaryText + '40'
    },
    custom: {
      bg: color ? color + '10' : colors.utility.secondaryText + '10',
      text: color || colors.utility.secondaryText,
      border: color ? color + '40' : colors.utility.secondaryText + '40'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const roleColor = roleColors[role.toLowerCase() as keyof typeof roleColors] || roleColors.custom;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: roleColor.bg,
        color: roleColor.text,
        borderColor: roleColor.border
      }}
    >
      {role}
    </span>
  );
};

// Component for showing both status and role
interface UserInfoBadgesProps {
  status?: UserStatus;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserInfoBadges: React.FC<UserInfoBadgesProps> = ({
  status,
  role,
  size = 'md',
  className
}) => {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {status && <UserStatusBadge status={status} size={size} />}
      {role && <UserRoleBadge role={role} size={size} />}
    </div>
  );
};