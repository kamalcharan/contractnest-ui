// contractnest-ui/src/vani/components/shared/VaNiList.tsx
import * as React from "react";
import { cn } from "../../../lib/utils";
import { useTheme } from "../../../contexts/ThemeContext";

interface VaNiListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'jobs' | 'templates' | 'channels' | 'analytics' | 'events' | 'business';
  spacing?: 'compact' | 'normal' | 'loose';
  // New business context props
  showBusinessContext?: boolean;
  groupByModule?: boolean;
}

const VaNiList = React.forwardRef<HTMLDivElement, VaNiListProps>(
  ({ 
    className, 
    variant, 
    spacing = 'normal', 
    showBusinessContext = false,
    groupByModule = false,
    ...props 
  }, ref) => {
    const { isDarkMode, currentTheme } = useTheme();
    const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full flex flex-col",
          spacing === 'compact' && "space-y-1",
          spacing === 'normal' && "space-y-2", 
          spacing === 'loose' && "space-y-4",
          variant === 'jobs' && "vani-jobs-list",
          variant === 'templates' && "vani-templates-list",
          variant === 'channels' && "vani-channels-list",
          variant === 'analytics' && "vani-analytics-list",
          variant === 'events' && "vani-events-list",
          variant === 'business' && "vani-business-list",
          showBusinessContext && "vani-business-context",
          className
        )}
        style={{
          '--list-border-color': `${colors.utility.primaryText}15`,
          '--list-hover-color': `${colors.utility.primaryText}10`,
          '--list-selected-color': `${colors.brand.primary}10`
        } as React.CSSProperties}
        {...props}
      />
    );
  }
);
VaNiList.displayName = "VaNiList";

interface VaNiListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  disabled?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'card' | 'compact' | 'business';
  // New business context props
  businessContext?: {
    priority?: number;
    urgency?: 'low' | 'medium' | 'high' | 'critical';
    entityType?: string;
    moduleSource?: string;
    hasActions?: boolean;
  };
  // Enhanced interaction props
  onSecondaryAction?: (e: React.MouseEvent) => void;
  secondaryActionLabel?: string;
}

const VaNiListItem = React.forwardRef<HTMLDivElement, VaNiListItemProps>(
  ({ 
    className, 
    selected, 
    disabled, 
    clickable = true, 
    variant = 'default',
    businessContext,
    onSecondaryAction,
    secondaryActionLabel,
    children,
    ...props 
  }, ref) => {
    const { isDarkMode, currentTheme } = useTheme();
    const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

    // Get priority-based styling
    const getPriorityStyles = () => {
      if (!businessContext?.priority) return {};
      
      const priority = businessContext.priority;
      if (priority >= 8) {
        return {
          borderLeftColor: colors.semantic.error,
          borderLeftWidth: '4px'
        };
      } else if (priority >= 6) {
        return {
          borderLeftColor: colors.semantic.warning,
          borderLeftWidth: '3px'
        };
      } else if (priority >= 4) {
        return {
          borderLeftColor: colors.brand.primary,
          borderLeftWidth: '2px'
        };
      }
      return {};
    };

    // Get urgency-based background
    const getUrgencyBackground = () => {
      if (!businessContext?.urgency) return colors.utility.primaryBackground;
      
      switch (businessContext.urgency) {
        case 'critical':
          return `${colors.semantic.error}08`;
        case 'high':
          return `${colors.semantic.warning}08`;
        case 'medium':
          return `${colors.brand.primary}05`;
        default:
          return colors.utility.primaryBackground;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center transition-all duration-200 relative",
          variant === 'default' && "justify-between p-4 rounded-lg border",
          variant === 'card' && "p-6 rounded-xl border shadow-sm",
          variant === 'compact' && "justify-between p-3 rounded-md border",
          variant === 'business' && "justify-between p-4 rounded-lg border-l-4 border-t border-r border-b",
          clickable && !disabled && "hover:shadow-sm cursor-pointer",
          clickable && !disabled && "hover:scale-[1.01]",
          selected && "ring-2 ring-opacity-50",
          disabled && "opacity-50 cursor-not-allowed",
          !clickable && "cursor-default",
          businessContext?.hasActions && "group",
          className
        )}
        style={{
          backgroundColor: selected 
            ? `${colors.brand.primary}15` 
            : getUrgencyBackground(),
          borderColor: selected 
            ? `${colors.brand.primary}40`
            : `var(--list-border-color, ${colors.utility.primaryText}15)`,
          '--tw-ring-color': colors.brand.primary,
          ...getPriorityStyles()
        }}
        {...props}
      >
        {/* Business Context Indicator */}
        {businessContext?.urgency === 'critical' && (
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: colors.semantic.error }}
          />
        )}

        {/* Module Source Indicator */}
        {businessContext?.moduleSource && variant === 'business' && (
          <div
            className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: `${colors.brand.secondary}20`,
              color: colors.brand.secondary,
              fontSize: '0.7rem'
            }}
          >
            {businessContext.moduleSource.toUpperCase()}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Priority Indicator */}
        {businessContext?.priority && variant === 'business' && (
          <div 
            className="flex flex-col items-center ml-3"
            style={{ minWidth: '40px' }}
          >
            <div
              className="text-lg font-bold leading-none"
              style={{
                color: businessContext.priority >= 8 
                  ? colors.semantic.error 
                  : businessContext.priority >= 6 
                    ? colors.semantic.warning 
                    : colors.brand.primary
              }}
            >
              {businessContext.priority}
            </div>
            <div
              className="text-xs"
              style={{ color: colors.utility.secondaryText }}
            >
              Priority
            </div>
          </div>
        )}

        {/* Secondary Action Button */}
        {onSecondaryAction && businessContext?.hasActions && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSecondaryAction(e);
            }}
            className="ml-3 px-3 py-1 text-sm border rounded opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              borderColor: `${colors.brand.primary}40`,
              backgroundColor: `${colors.brand.primary}10`,
              color: colors.brand.primary
            }}
          >
            {secondaryActionLabel || 'Action'}
          </button>
        )}
      </div>
    );
  }
);
VaNiListItem.displayName = "VaNiListItem";

interface VaNiListHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  // New business context props
  showMetrics?: boolean;
  metrics?: {
    total: number;
    pending?: number;
    completed?: number;
    failed?: number;
  };
  // Module health indicators
  moduleHealth?: {
    [module: string]: 'healthy' | 'warning' | 'critical';
  };
}

const VaNiListHeader = React.forwardRef<HTMLDivElement, VaNiListHeaderProps>(
  ({ 
    className, 
    title, 
    description, 
    actions, 
    children,
    showMetrics = false,
    metrics,
    moduleHealth,
    ...props 
  }, ref) => {
    const { isDarkMode, currentTheme } = useTheme();
    const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start justify-between mb-4 pb-4 border-b",
          className
        )}
        style={{ borderColor: `${colors.utility.primaryText}20` }}
        {...props}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div>
              {title && (
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: colors.utility.primaryText }}
                >
                  {title}
                </h3>
              )}
              {description && (
                <p 
                  className="text-sm mt-1"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Quick Metrics */}
            {showMetrics && metrics && (
              <div className="flex items-center space-x-4 text-sm">
                <div 
                  className="flex items-center space-x-1"
                  style={{ color: colors.utility.primaryText }}
                >
                  <span className="font-medium">{metrics.total}</span>
                  <span style={{ color: colors.utility.secondaryText }}>total</span>
                </div>
                {metrics.pending !== undefined && (
                  <div 
                    className="flex items-center space-x-1"
                    style={{ color: colors.semantic.warning }}
                  >
                    <span className="font-medium">{metrics.pending}</span>
                    <span>pending</span>
                  </div>
                )}
                {metrics.failed !== undefined && metrics.failed > 0 && (
                  <div 
                    className="flex items-center space-x-1"
                    style={{ color: colors.semantic.error }}
                  >
                    <span className="font-medium">{metrics.failed}</span>
                    <span>failed</span>
                  </div>
                )}
              </div>
            )}

            {/* Module Health Indicators */}
            {moduleHealth && (
              <div className="flex items-center space-x-2">
                {Object.entries(moduleHealth).map(([module, health]) => (
                  <div
                    key={module}
                    className="flex items-center space-x-1 text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: health === 'healthy' 
                        ? `${colors.semantic.success}20`
                        : health === 'warning'
                          ? `${colors.semantic.warning}20`
                          : `${colors.semantic.error}20`,
                      color: health === 'healthy' 
                        ? colors.semantic.success
                        : health === 'warning'
                          ? colors.semantic.warning
                          : colors.semantic.error
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: health === 'healthy' 
                          ? colors.semantic.success
                          : health === 'warning'
                            ? colors.semantic.warning
                            : colors.semantic.error
                      }}
                    />
                    <span className="capitalize">{module}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {children}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2 ml-4">
            {actions}
          </div>
        )}
      </div>
    );
  }
);
VaNiListHeader.displayName = "VaNiListHeader";

export { VaNiList, VaNiListItem, VaNiListHeader };