// contractnest-ui/src/vani/components/shared/VaNiMetricCard.tsx
import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
import { useTheme } from '../../../contexts/ThemeContext';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface TrendData {
  direction: 'up' | 'down' | 'flat';
  percentage: number;
  period?: string;
}

interface MetricData {
  value: string | number;
  label: string;
  trend?: TrendData;
  cost?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  // New business context fields
  businessContext?: {
    entityType?: 'contracts' | 'payments' | 'services' | 'events';
    relatedCount?: number;
    actionable?: boolean;
    urgency?: 'low' | 'medium' | 'high' | 'critical';
  };
  // Enhanced status indicators
  status?: 'normal' | 'warning' | 'critical' | 'success';
  secondaryMetric?: {
    value: string | number;
    label: string;
  };
}

interface VaNiMetricCardProps {
  metric: MetricData;
  className?: string;
  variant?: 'default' | 'highlight' | 'compact' | 'business';
  onClick?: () => void;
  loading?: boolean;
}

const TrendIndicator: React.FC<{ trend: TrendData }> = ({ trend }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'up':
        return colors.semantic.success;
      case 'down':
        return colors.semantic.error;
      case 'flat':
        return colors.utility.secondaryText;
      default:
        return colors.utility.secondaryText;
    }
  };

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      case 'flat':
        return <Minus className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="flex items-center space-x-1 text-xs"
      style={{ color: getTrendColor() }}
    >
      {getTrendIcon()}
      <span className="font-medium">
        {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
      </span>
      {trend.period && (
        <span className="opacity-70">({trend.period})</span>
      )}
    </div>
  );
};

const StatusIndicator: React.FC<{ status: string; urgency?: string }> = ({ status, urgency }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const getStatusConfig = () => {
    if (urgency === 'critical') {
      return {
        icon: <AlertTriangle className="w-3 h-3" />,
        color: colors.semantic.error,
        label: 'Critical'
      };
    }

    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          color: colors.semantic.success,
          label: 'Good'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          color: colors.semantic.warning,
          label: 'Attention'
        };
      case 'critical':
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          color: colors.semantic.error,
          label: 'Critical'
        };
      default:
        return {
          icon: <Clock className="w-3 h-3" />,
          color: colors.utility.secondaryText,
          label: 'Normal'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className="flex items-center space-x-1 text-xs"
      style={{ color: config.color }}
    >
      {config.icon}
      <span className="font-medium">{config.label}</span>
    </div>
  );
};

export const VaNiMetricCard: React.FC<VaNiMetricCardProps> = ({
  metric,
  className,
  variant = 'default',
  onClick,
  loading = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const isClickable = !!onClick;
  const isBusiness = variant === 'business';
  const hasBusinessContext = !!metric.businessContext;

  // Get urgency-based styling
  const getUrgencyStyles = () => {
    if (!hasBusinessContext) return {};
    
    const urgency = metric.businessContext?.urgency;
    switch (urgency) {
      case 'critical':
        return {
          borderColor: colors.semantic.error + '40',
          borderWidth: '2px',
          backgroundColor: colors.semantic.error + '05'
        };
      case 'high':
        return {
          borderColor: colors.semantic.warning + '40',
          backgroundColor: colors.semantic.warning + '05'
        };
      case 'medium':
        return {
          borderColor: colors.brand.primary + '30'
        };
      default:
        return {};
    }
  };

  return (
    <Card
      className={cn(
        "vani-metric-card transition-all duration-200",
        variant === 'highlight' && "ring-2 ring-primary/20",
        variant === 'compact' && "p-2",
        variant === 'business' && "relative overflow-hidden",
        isClickable && "hover:shadow-md cursor-pointer hover:scale-[1.02]",
        loading && "animate-pulse",
        hasBusinessContext && metric.businessContext?.actionable && "hover:shadow-lg",
        className
      )}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: `${colors.utility.primaryText}20`,
        ...getUrgencyStyles()
      }}
      onClick={onClick}
    >
      {/* Business Context Indicator */}
      {hasBusinessContext && metric.businessContext?.urgency === 'critical' && (
        <div
          className="absolute top-0 right-0 w-0 h-0"
          style={{
            borderLeft: '20px solid transparent',
            borderTop: `20px solid ${colors.semantic.error}`
          }}
        />
      )}

      <CardContent className={cn(
        variant === 'compact' ? "p-4" : "p-6"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {metric.icon && (
                <div style={{ color: colors.brand.primary }}>
                  {metric.icon}
                </div>
              )}
              <p 
                className="text-sm font-medium"
                style={{ color: colors.utility.secondaryText }}
              >
                {metric.label}
              </p>
              {metric.status && (
                <StatusIndicator 
                  status={metric.status} 
                  urgency={metric.businessContext?.urgency} 
                />
              )}
            </div>
            
            <div className="space-y-1">
              <p 
                className={cn(
                  "font-bold",
                  variant === 'compact' ? "text-xl" : "text-2xl"
                )}
                style={{ color: colors.utility.primaryText }}
              >
                {loading ? '---' : metric.value}
              </p>
              
              {metric.subtitle && (
                <p 
                  className="text-xs"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {metric.subtitle}
                </p>
              )}

              {/* Business Context Info */}
              {hasBusinessContext && metric.businessContext?.relatedCount && (
                <p 
                  className="text-xs"
                  style={{ color: colors.brand.primary }}
                >
                  {metric.businessContext.relatedCount} {metric.businessContext.entityType} affected
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {metric.trend && !loading && (
              <TrendIndicator trend={metric.trend} />
            )}

            {/* Secondary Metric */}
            {metric.secondaryMetric && !loading && (
              <div className="text-right">
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.utility.primaryText }}
                >
                  {metric.secondaryMetric.value}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {metric.secondaryMetric.label}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Cost or Business Action Footer */}
        {(metric.cost || hasBusinessContext) && !loading && (
          <div 
            className="mt-4 pt-3 border-t"
            style={{ borderColor: `${colors.utility.primaryText}20` }}
          >
            <div className="flex items-center justify-between">
              {metric.cost ? (
                <>
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Cost
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {metric.cost}
                  </span>
                </>
              ) : hasBusinessContext && metric.businessContext?.actionable ? (
                <>
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Action Required
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ 
                      color: metric.businessContext?.urgency === 'critical' 
                        ? colors.semantic.error 
                        : colors.brand.primary 
                    }}
                  >
                    Click to review →
                  </span>
                </>
              ) : null}
            </div>

            {/* Business Entity Type Indicator */}
            {hasBusinessContext && metric.businessContext?.entityType && (
              <div className="mt-2">
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${colors.brand.secondary}20`,
                    color: colors.brand.secondary 
                  }}
                >
                  {metric.businessContext.entityType.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};