  // src/components/storage/StorageStats.tsx
  import React from 'react';
  import { Database, FileText, AlertTriangle } from 'lucide-react';
  import { formatFileSize } from '@/utils/constants/storageConstants';

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
    // Get color based on usage percentage
    const getStatusColor = () => {
      if (usagePercentage >= 90) return 'text-red-500';
      if (usagePercentage >= 75) return 'text-amber-500';
      return 'text-green-500';
    };
    
    // Get background color for progress bar
    const getProgressColor = () => {
      if (usagePercentage >= 90) return 'bg-red-500';
      if (usagePercentage >= 75) return 'bg-amber-500';
      return 'bg-primary';
    };
    
    return (
      <div className={`bg-card border border-border rounded-lg p-5 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium">Storage Statistics</h3>
          <Database className="w-5 h-5 text-muted-foreground" />
        </div>
        
        {/* Usage Overview */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Used Storage
            </span>
            <span className={`text-sm font-medium flex items-center ${getStatusColor()}`}>
              {usagePercentage >= 90 && <AlertTriangle className="w-4 h-4 mr-1" />}
              {usagePercentage}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`${getProgressColor()} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
        
        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Space</div>
            <div className="text-xl font-medium">{formatFileSize(totalQuota)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Used Space</div>
            <div className="text-xl font-medium">{formatFileSize(usedSpace)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Available Space</div>
            <div className="text-xl font-medium">{formatFileSize(availableSpace)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Files</div>
            <div className="text-xl font-medium flex items-center">
              <FileText className="w-4 h-4 mr-1 text-muted-foreground" />
              {totalFiles}
            </div>
          </div>
        </div>
        
        {/* Warning for low space */}
        {usagePercentage >= 90 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <div className="text-sm text-red-700">
              Your storage is almost full. Consider deleting unused files or upgrading your storage plan.
            </div>
          </div>
        )}
        
        {usagePercentage >= 75 && usagePercentage < 90 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              Your storage is getting full. You have {formatFileSize(availableSpace)} remaining.
            </div>
          </div>
        )}
      </div>
    );
  };

  export default StorageStats;