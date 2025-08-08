// src/components/integrations/StatusBadge.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface StatusBadgeProps {
  status: string;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  isActive = true,
  size = 'md',
  className 
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Get badge color based on status
  const getStatusStyles = () => {
    if (!isActive) {
      return {
        backgroundColor: `${colors.utility.secondaryText}20`,
        color: colors.utility.secondaryText
      };
    }
    
    switch (status.toLowerCase()) {
      case 'connected':
        return {
          backgroundColor: `${colors.semantic.success}20`,
          color: colors.semantic.success
        };
      case 'failed':
      case 'configuration error':
        return {
          backgroundColor: `${colors.semantic.error}20`,
          color: colors.semantic.error
        };
      case 'pending':
      case 'pending verification':
        return {
          backgroundColor: `${colors.semantic.warning}20`,
          color: colors.semantic.warning
        };
      case 'not configured':
      default:
        return {
          backgroundColor: `${colors.utility.secondaryText}20`,
          color: colors.utility.secondaryText
        };
    }
  };
  
  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1.5';
      case 'md':
      default:
        return 'text-xs px-2.5 py-0.5';
    }
  };
  
  // Format status text
  const formatStatus = () => {
    if (!isActive) return 'Inactive';
    
    // Capitalize first letter of each word
    return status
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  const statusStyles = getStatusStyles();
  
  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        getSizeClasses(),
        className
      )}
      style={statusStyles}
    >
      {formatStatus()}
    </span>
  );
};

export default StatusBadge;