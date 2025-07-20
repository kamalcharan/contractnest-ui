// src/components/template-designer/shared/TemplateStatusBadge.tsx
import React from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Archive,
  Lock,
  AlertCircle,
  XCircle,
  RefreshCw,
  Eye,
  Users,
  Globe,
  Shield,
  Zap,
  Star
} from 'lucide-react';

interface TemplateStatusBadgeProps {
  status: 'draft' | 'published' | 'archived' | 'locked' | 'pending' | 'rejected' | 'processing';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  variant?: 'default' | 'subtle' | 'outline' | 'dot';
  className?: string;
  onClick?: () => void;
}

export const TemplateStatusBadge: React.FC<TemplateStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  showLabel = true,
  variant = 'default',
  className = '',
  onClick
}) => {
  const statusConfig = {
    draft: {
      icon: FileText,
      label: 'Draft',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      dotColor: 'bg-gray-500'
    },
    published: {
      icon: CheckCircle,
      label: 'Published',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
      dotColor: 'bg-green-500'
    },
    archived: {
      icon: Archive,
      label: 'Archived',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
      dotColor: 'bg-yellow-500'
    },
    locked: {
      icon: Lock,
      label: 'Locked',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
      dotColor: 'bg-red-500'
    },
    pending: {
      icon: Clock,
      label: 'Pending',
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-300',
      dotColor: 'bg-orange-500'
    },
    rejected: {
      icon: XCircle,
      label: 'Rejected',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
      dotColor: 'bg-red-500'
    },
    processing: {
      icon: RefreshCw,
      label: 'Processing',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
      dotColor: 'bg-blue-500'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    xs: {
      padding: 'px-2 py-0.5',
      text: 'text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1',
      dot: 'w-1.5 h-1.5'
    },
    sm: {
      padding: 'px-2.5 py-1',
      text: 'text-sm',
      icon: 'w-3.5 h-3.5',
      gap: 'gap-1.5',
      dot: 'w-2 h-2'
    },
    md: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
      dot: 'w-2 h-2'
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2',
      dot: 'w-2.5 h-2.5'
    }
  };

  const sizeClass = sizeClasses[size];

  const getVariantClasses = () => {
    switch (variant) {
      case 'subtle':
        return `${config.bgColor} ${config.textColor}`;
      case 'outline':
        return `bg-white ${config.textColor} border ${config.borderColor}`;
      case 'dot':
        return 'bg-gray-100 text-gray-700';
      default:
        return `${config.bgColor} ${config.textColor} font-medium`;
    }
  };

  const baseClasses = `inline-flex items-center ${sizeClass.gap} ${sizeClass.padding} rounded-full ${sizeClass.text} ${getVariantClasses()} ${
    onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
  } ${className}`;

  const content = (
    <>
      {variant === 'dot' && (
        <span className={`${sizeClass.dot} ${config.dotColor} rounded-full`} />
      )}
      {showIcon && variant !== 'dot' && (
        <Icon className={`${sizeClass.icon} ${status === 'processing' ? 'animate-spin' : ''}`} />
      )}
      {showLabel && <span>{config.label}</span>}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        {content}
      </button>
    );
  }

  return (
    <span className={baseClasses}>
      {content}
    </span>
  );
};

// Additional status badges for other template properties
interface VisibilityBadgeProps {
  visibility: 'private' | 'organization' | 'public';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({
  visibility,
  size = 'md',
  showIcon = true,
  showLabel = true,
  className = ''
}) => {
  const visibilityConfig = {
    private: {
      icon: Lock,
      label: 'Private',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    organization: {
      icon: Users,
      label: 'Organization',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    public: {
      icon: Globe,
      label: 'Public',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  };

  const config = visibilityConfig[visibility];
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs gap-1',
    sm: 'px-2.5 py-1 text-sm gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full ${config.bgColor} ${config.color} ${className}`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

// Template type badge
interface TemplateTypeBadgeProps {
  type: 'standard' | 'premium' | 'custom' | 'system';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const TemplateTypeBadge: React.FC<TemplateTypeBadgeProps> = ({
  type,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const typeConfig = {
    standard: {
      icon: FileText,
      label: 'Standard',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    premium: {
      icon: Star,
      label: 'Premium',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    custom: {
      icon: Zap,
      label: 'Custom',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    system: {
      icon: Shield,
      label: 'System',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs gap-1',
    sm: 'px-2.5 py-1 text-sm gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full ${config.bgColor} ${config.color} font-medium ${className}`}>
      {showIcon && <Icon className={`${iconSizes[size]} ${type === 'premium' ? 'fill-current' : ''}`} />}
      <span>{config.label}</span>
    </span>
  );
};

// Combined badge component for flexibility
interface BadgeProps {
  children: React.ReactNode;
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange';
  variant?: 'default' | 'subtle' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'gray',
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
  onClick
}) => {
  const colorClasses = {
    gray: {
      default: 'bg-gray-100 text-gray-700',
      subtle: 'bg-gray-50 text-gray-600',
      outline: 'bg-white text-gray-700 border border-gray-300'
    },
    red: {
      default: 'bg-red-100 text-red-700',
      subtle: 'bg-red-50 text-red-600',
      outline: 'bg-white text-red-700 border border-red-300'
    },
    yellow: {
      default: 'bg-yellow-100 text-yellow-700',
      subtle: 'bg-yellow-50 text-yellow-600',
      outline: 'bg-white text-yellow-700 border border-yellow-300'
    },
    green: {
      default: 'bg-green-100 text-green-700',
      subtle: 'bg-green-50 text-green-600',
      outline: 'bg-white text-green-700 border border-green-300'
    },
    blue: {
      default: 'bg-blue-100 text-blue-700',
      subtle: 'bg-blue-50 text-blue-600',
      outline: 'bg-white text-blue-700 border border-blue-300'
    },
    indigo: {
      default: 'bg-indigo-100 text-indigo-700',
      subtle: 'bg-indigo-50 text-indigo-600',
      outline: 'bg-white text-indigo-700 border border-indigo-300'
    },
    purple: {
      default: 'bg-purple-100 text-purple-700',
      subtle: 'bg-purple-50 text-purple-600',
      outline: 'bg-white text-purple-700 border border-purple-300'
    },
    pink: {
      default: 'bg-pink-100 text-pink-700',
      subtle: 'bg-pink-50 text-pink-600',
      outline: 'bg-white text-pink-700 border border-pink-300'
    },
    orange: {
      default: 'bg-orange-100 text-orange-700',
      subtle: 'bg-orange-50 text-orange-600',
      outline: 'bg-white text-orange-700 border border-orange-300'
    }
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs gap-1',
    sm: 'px-2.5 py-1 text-sm gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const baseClasses = `inline-flex items-center ${sizeClasses[size]} rounded-full font-medium ${colorClasses[color][variant]} ${
    onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
  } ${className}`;

  const content = (
    <>
      {Icon && <Icon className={iconSizes[size]} />}
      {children}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        {content}
      </button>
    );
  }

  return (
    <span className={baseClasses}>
      {content}
    </span>
  );
};

export default TemplateStatusBadge;