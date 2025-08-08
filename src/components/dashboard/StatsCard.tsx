// src/components/dashboard/StatsCard.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface StatsCardProps {
  title: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  icon: React.ElementType;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  change,
  icon: Icon,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.semantic.success;
      case 'down':
        return colors.semantic.error;
      case 'neutral':
        return colors.utility.secondaryText;
      default:
        return colors.utility.secondaryText;
    }
  };

  const getTrendIcon = () => {
    const iconProps = { size: 14, style: { color: getTrendColor() } };
    
    switch (trend) {
      case 'up':
        return <TrendingUp {...iconProps} />;
      case 'down':
        return <TrendingDown {...iconProps} />;
      case 'neutral':
        return <Minus {...iconProps} />;
      default:
        return <Minus {...iconProps} />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'up':
        return `${change}% increase`;
      case 'down':
        return `${change}% decrease`;
      case 'neutral':
        return 'No change';
      default:
        return 'No change';
    }
  };

  return (
    <div 
      className={`rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 p-6 ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div className="flex items-center justify-between">
        <h3 
          className="text-sm font-medium transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          {title}
        </h3>
        <div 
          className="h-10 w-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: colors.brand.primary + '10' }}
        >
          <Icon 
            size={20} 
            style={{ color: colors.brand.primary }}
          />
        </div>
      </div>
      
      <p 
        className="text-3xl font-bold mt-3 transition-colors"
        style={{ color: colors.utility.primaryText }}
      >
        {value.toLocaleString()}
      </p>
      
      <div 
        className="flex items-center mt-3 rounded-md px-2 py-1 text-sm w-fit transition-colors"
        style={{ backgroundColor: colors.utility.secondaryText + '05' }}
      >
        {getTrendIcon()}
        <span 
          className="font-medium ml-1"
          style={{ color: getTrendColor() }}
        >
          {getTrendText()}
        </span>
        <span 
          className="ml-1 transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          from last month
        </span>
      </div>
    </div>
  );
};

export default StatsCard;