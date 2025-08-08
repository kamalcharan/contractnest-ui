// src/components/shared/TabsNavigation.tsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-4 text-base';
      default:
        return 'px-4 py-3 text-sm';
    }
  };

  const getTabStyles = (tab: Tab, isActive: boolean) => {
    const baseStyle = {
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    };

    if (variant === 'underline') {
      return {
        ...baseStyle,
        borderBottom: `2px solid ${isActive ? colors.brand.primary : 'transparent'}`,
        color: isActive ? colors.brand.primary : colors.utility.secondaryText,
        backgroundColor: isActive ? colors.brand.primary + '05' : 'transparent'
      };
    }

    if (variant === 'pills') {
      return {
        ...baseStyle,
        borderRadius: '6px',
        color: isActive ? '#ffffff' : colors.utility.secondaryText,
        background: isActive 
          ? `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
          : 'transparent'
      };
    }

    // Default variant
    return {
      ...baseStyle,
      color: isActive ? colors.brand.primary : colors.utility.secondaryText
    };
  };

  const handleTabHover = (e: React.MouseEvent<HTMLButtonElement>, tab: Tab, isActive: boolean) => {
    if (isActive) return;

    if (variant === 'underline') {
      e.currentTarget.style.color = colors.utility.primaryText;
      e.currentTarget.style.borderBottomColor = colors.utility.secondaryText + '50';
    } else if (variant === 'pills') {
      e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
      e.currentTarget.style.color = colors.utility.primaryText;
    } else {
      e.currentTarget.style.color = colors.utility.primaryText;
    }
  };

  const handleTabLeave = (e: React.MouseEvent<HTMLButtonElement>, tab: Tab, isActive: boolean) => {
    if (isActive) return;

    const styles = getTabStyles(tab, false);
    Object.assign(e.currentTarget.style, styles);
  };

  const getCountStyles = (tab: Tab, isActive: boolean) => {
    if (variant === 'pills' && isActive) {
      return {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.75rem',
        fontWeight: '500'
      };
    }
    
    return {
      color: colors.utility.secondaryText,
      fontSize: '0.75rem',
      fontWeight: '500'
    };
  };

  return (
    <div 
      className={`rounded-lg shadow-sm border transition-colors ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div 
        className={variant === 'underline' ? 'border-b' : 'p-1'}
        style={{
          borderColor: variant === 'underline' ? colors.utility.secondaryText + '20' : 'transparent'
        }}
      >
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 font-medium ${getSizeClasses()}`}
                style={getTabStyles(tab, isActive)}
                onMouseEnter={(e) => handleTabHover(e, tab, isActive)}
                onMouseLeave={(e) => handleTabLeave(e, tab, isActive)}
              >
                {IconComponent && (
                  <IconComponent className="h-4 w-4" />
                )}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={getCountStyles(tab, isActive)}>
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