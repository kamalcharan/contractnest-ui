// src/components/dashboard/StatsCard.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
      </div>
      
      <p className="text-3xl font-bold mt-3">{value.toLocaleString()}</p>
      
      <div className="flex items-center mt-3 bg-muted/30 rounded-md px-2 py-1 text-sm w-fit">
        {trend === 'up' && (
          <>
            <TrendingUp size={14} className="text-success mr-1" />
            <span className="text-success font-medium">
              {change}% increase
            </span>
          </>
        )}
        
        {trend === 'down' && (
          <>
            <TrendingDown size={14} className="text-destructive mr-1" />
            <span className="text-destructive font-medium">
              {change}% decrease
            </span>
          </>
        )}
        
        {trend === 'neutral' && (
          <>
            <Minus size={14} className="text-muted-foreground mr-1" />
            <span className="text-muted-foreground font-medium">
              No change
            </span>
          </>
        )}
        
        <span className="text-muted-foreground ml-1">from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;