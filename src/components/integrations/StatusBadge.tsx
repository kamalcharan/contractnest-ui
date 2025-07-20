// src/components/integrations/StatusBadge.tsx
import React from 'react';
import { cn } from '@/lib/utils';

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
  // Get badge color based on status
  const getStatusStyles = () => {
    if (!isActive) {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
    
    switch (status.toLowerCase()) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
      case 'configuration error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
      case 'pending verification':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'not configured':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
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
  
  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        getStatusStyles(),
        getSizeClasses(),
        className
      )}
    >
      {formatStatus()}
    </span>
  );
};

export default StatusBadge;