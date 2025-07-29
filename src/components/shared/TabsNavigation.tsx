// src/components/shared/TabsNavigation.tsx
import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

interface TabsNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underline',
  size = 'md',
  className = ''
}) => {
  const getTabClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses = `
      flex items-center gap-2 font-medium transition-colors cursor-pointer
      ${size === 'sm' ? 'px-3 py-2 text-sm' : 
        size === 'lg' ? 'px-6 py-4 text-base' : 
        'px-4 py-3 text-sm'}
    `;

    if (variant === 'underline') {
      return `
        ${baseClasses}
        border-b-2 transition-colors
        ${isActive
          ? 'border-primary text-primary bg-primary/5'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
        }
      `;
    }

    if (variant === 'pills') {
      return `
        ${baseClasses}
        rounded-md
        ${isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }
      `;
    }

    // Default variant
    return `
      ${baseClasses}
      ${isActive
        ? 'text-primary'
        : 'text-muted-foreground hover:text-foreground'
      }
    `;
  };

  const getCountClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses = 'text-xs font-medium';
    
    if (variant === 'pills' && isActive) {
      return `${baseClasses} text-primary-foreground/80`;
    }
    
    return `${baseClasses} text-muted-foreground`;
  };

  return (
    <div className={`bg-card rounded-lg shadow-sm border border-border ${className}`}>
      <div className={variant === 'underline' ? 'border-b border-border' : 'p-1'}>
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={getTabClasses(tab, isActive)}
              >
                {IconComponent && (
                  <IconComponent className="h-4 w-4" />
                )}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={getCountClasses(tab, isActive)}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabsNavigation;