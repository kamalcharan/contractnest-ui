// src/components/businessmodel/admin/plandetail/PlanDetailHeader.tsx

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PlanDetailHeaderProps {
  planName: string;
  planDescription?: string;
  isVisible?: boolean;
  isArchived?: boolean;
  isLive: boolean;
  onBack: () => void;
}

const PlanDetailHeader: React.FC<PlanDetailHeaderProps> = ({
  planName,
  planDescription,
  isVisible,
  isArchived,
  isLive,
  onBack
}) => {
  // Determine status badge
  const getStatusBadge = () => {
    if (isArchived) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          Archived
        </span>
      );
    }
    
    if (isVisible) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Visible
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
        Hidden
      </span>
    );
  };

  // Environment badge
  const getEnvironmentBadge = () => (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
      isLive 
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        isLive ? 'bg-green-500' : 'bg-amber-500'
      }`}></div>
      {isLive ? 'Live Environment' : 'Test Environment'}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center">
        <button 
          onClick={onBack} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          type="button"
          aria-label="Go back to plans list"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{planName}</h1>
            <div className="ml-4">
              {getStatusBadge()}
            </div>
          </div>
          {planDescription && (
            <p className="text-muted-foreground mt-1">{planDescription}</p>
          )}
        </div>
      </div>
      
      {/* Environment Badge */}
      <div>
        {getEnvironmentBadge()}
      </div>
    </div>
  );
};

export default PlanDetailHeader;