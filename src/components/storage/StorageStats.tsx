// src/components/storage/StorageStats.tsx
import React from 'react';
import { Database, FileText, AlertTriangle } from 'lucide-react';
import { formatFileSize } from '@/utils/constants/storageConstants';
import { useTheme } from '@/contexts/ThemeContext';

interface StorageStatsProps {
  totalQuota: number;
  usedSpace: number;
  availableSpace: number;
  usagePercentage: number;
  totalFiles: number;
  className?: string;
}

const StorageStats: React.FC<StorageStatsProps> = ({
  totalQuota,
  usedSpace,
  availableSpace,
  usagePercentage,
  totalFiles,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Get color based on usage percentage
  const getStatusColor = () => {
    if (usagePercentage >= 90) return colors.semantic.error;
    if (usagePercentage >= 75) return colors.semantic.warning;
    return colors.semantic.success;
  };
  
  // Get background color for progress bar
  const getProgressColor = () => {
    if (usagePercentage >= 90) return colors.semantic.error;
    if (usagePercentage >= 75) return colors.semantic.warning;
    return colors.brand.primary;
  };
  
  return (
    <div 
      className={`border rounded-lg p-5 transition-colors ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: `${colors.utility.primaryText}20`
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 
          className="text-lg font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Storage Statistics
        </h3>
        <Database 
          className="w-5 h-5 transition-colors"
          style={{ color: colors.utility.secondaryText }}
        />
      </div>
      
      {/* Usage Overview */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Used Storage
          </span>
          <span 
            className="text-sm font-medium flex items-center transition-colors"
            style={{ color: getStatusColor() }}
          >
            {usagePercentage >= 90 && <AlertTriangle className="w-4 h-4 mr-1" />}
            {usagePercentage}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div 
          className="w-full rounded-full h-2 transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryText}20` }}
        >
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${usagePercentage}%`,
              backgroundColor: getProgressColor()
            }}
          />
        </div>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Total Space
          </div>
          <div 
            className="text-xl font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {formatFileSize(totalQuota)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Used Space
          </div>
          <div 
            className="text-xl font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {formatFileSize(usedSpace)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Available Space
          </div>
          <div 
            className="text-xl font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {formatFileSize(availableSpace)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Total Files
          </div>
          <div 
            className="text-xl font-medium flex items-center transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            <FileText 
              className="w-4 h-4 mr-1 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            />
            {totalFiles}
          </div>
        </div>
      </div>
      
      {/* Warning for low space */}
      {usagePercentage >= 90 && (
        <div 
          className="mt-4 p-3 border rounded-md flex items-start transition-colors"
          style={{
            backgroundColor: `${colors.semantic.error}10`,
            borderColor: `${colors.semantic.error}40`
          }}
        >
          <AlertTriangle 
            className="w-5 h-5 mr-2 flex-shrink-0"
            style={{ color: colors.semantic.error }}
          />
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.semantic.error }}
          >
            Your storage is almost full. Consider deleting unused files or upgrading your storage plan.
          </div>
        </div>
      )}
      
      {usagePercentage >= 75 && usagePercentage < 90 && (
        <div 
          className="mt-4 p-3 border rounded-md flex items-start transition-colors"
          style={{
            backgroundColor: `${colors.semantic.warning}10`,
            borderColor: `${colors.semantic.warning}40`
          }}
        >
          <AlertTriangle 
            className="w-5 h-5 mr-2 flex-shrink-0"
            style={{ color: colors.semantic.warning }}
          />
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.semantic.warning }}
          >
            Your storage is getting full. You have {formatFileSize(availableSpace)} remaining.
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageStats;