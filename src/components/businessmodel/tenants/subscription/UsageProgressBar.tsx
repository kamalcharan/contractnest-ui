// src/components/businessmodel/tenants/subscription/UsageProgressBar.tsx

import React from 'react';

interface UsageProgressBarProps {
  used: number;
  limit: number;
  label: string;
}

const UsageProgressBar: React.FC<UsageProgressBarProps> = ({ 
  used, 
  limit, 
  label 
}) => {
  const percentage = Math.min(Math.round((used / limit) * 100), 100);
  
  const getColorClass = () => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span>{label}</span>
        <span>
          {used} / {limit} ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColorClass()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default UsageProgressBar;