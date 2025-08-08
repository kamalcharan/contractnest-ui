// src/components/businessmodel/tenants/subscription/UsageProgressBar.tsx

import React from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const percentage = Math.min(Math.round((used / limit) * 100), 100);
  
  const getProgressColor = () => {
    if (percentage < 70) return colors.semantic.success;
    if (percentage < 90) return colors.semantic.warning || '#F59E0B';
    return colors.semantic.error;
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span 
          className="transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          {label}
        </span>
        <span 
          className="transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          {used} / {limit} ({percentage}%)
        </span>
      </div>
      <div 
        className="h-2 w-full rounded-full overflow-hidden transition-colors"
        style={{
          backgroundColor: `${colors.utility.secondaryText}20`
        }}
      >
        <div 
          className="h-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getProgressColor()
          }}
        ></div>
      </div>
    </div>
  );
};

export default UsageProgressBar;