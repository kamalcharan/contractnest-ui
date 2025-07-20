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
  const statusConfig = {
    active: {
      icon: CheckCircle,
      label: 'Active',
      color: 'text-green-700 bg-green-50 border-green-200',
      darkColor: 'dark:text-green-400 dark:bg-green-950 dark:border-green-800'
    },
    invited: {
      icon: Mail,
      label: 'Invited',
      color: 'text-primary bg-primary/10 border-primary/20',
      darkColor: 'dark:text-primary dark:bg-primary/10 dark:border-primary/20'
    },
    pending: {
      icon: Clock,
      label: 'Pending',
      color: 'text-primary bg-primary/10 border-primary/20',
      darkColor: 'dark:text-primary dark:bg-primary/10 dark:border-primary/20'
    },
    expired: {
      icon: AlertCircle,
      label: 'Expired',
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      darkColor: 'dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800'
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelled',
      color: 'text-gray-700 bg-gray-50 border-gray-200',
      darkColor: 'dark:text-gray-400 dark:bg-gray-950 dark:border-gray-800'
    },
    suspended: {
      icon: UserX,
      label: 'Suspended',
      color: 'text-red-700 bg-red-50 border-red-200',
      darkColor: 'dark:text-red-400 dark:bg-red-950 dark:border-red-800'
    },
    inactive: {
      icon: User,
      label: 'Inactive',
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      darkColor: 'dark:text-gray-500 dark:bg-gray-950 dark:border-gray-800'
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
        'inline-flex items-center font-medium rounded-full border',
        config.color,
        config.darkColor,
        showLabel ? sizeConfig.badge : sizeConfig.iconOnly,
        className
      )}
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
  const roleColors = {
    owner: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    admin: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
    editor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    viewer: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    custom: color || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
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
        'inline-flex items-center font-medium rounded-full border',
        roleColor,
        sizeClasses[size],
        className
      )}
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