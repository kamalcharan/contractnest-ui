// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getMenuItemsForIndustry, MenuItem } from '../../utils/constants/industryMenus';

interface NavItemProps {
  item: MenuItem;
  collapsed: boolean;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ item, collapsed, badge }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  
  // Safely get the icon from Lucide icons with proper typing
  const getIconComponent = (iconName: string) => {
    const iconsMap = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
    return iconsMap[iconName] || LucideIcons.Circle;
  };
  
  const IconComponent = getIconComponent(item.icon);
  
  const toggleSubmenu = (e: React.MouseEvent) => {
    if (item.hasSubmenu && item.submenuItems) {
      e.preventDefault();
      setIsSubmenuOpen(!isSubmenuOpen);
    }
  };

  return (
    <div className="mb-1">
      <NavLink 
        to={item.hasSubmenu ? '#' : item.path} 
        className={({ isActive }) => `
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all sidebar-nav-item
          ${(isActive && !item.hasSubmenu) 
            ? 'bg-primary text-primary-foreground font-medium shadow-sm active' 
            : 'text-foreground hover:bg-primary/10 hover:text-primary'}
          ${item.hasSubmenu && isSubmenuOpen ? 'bg-muted/50' : ''}
        `}
        onClick={toggleSubmenu}
      >
        <div className="relative">
          <IconComponent size={20} />
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
        
        {!collapsed && (
          <div className="flex justify-between items-center w-full">
            <span>{item.label}</span>
            
            {item.hasSubmenu && item.submenuItems && (
              <LucideIcons.ChevronRight 
                size={16} 
                className={`transition-transform ${isSubmenuOpen ? 'rotate-90' : ''}`} 
              />
            )}
            
            {badge !== undefined && badge > 0 && (
              <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </div>
        )}
      </NavLink>
      
      {!collapsed && item.hasSubmenu && item.submenuItems && isSubmenuOpen && (
        <div className="ml-5 pl-4 border-l border-border space-y-1 mt-1">
          {item.submenuItems.map((subItem) => {
            const SubIconComponent = getIconComponent(subItem.icon);
            
            return (
              <NavLink
                key={subItem.id}
                to={subItem.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                `}
              >
                <div className="relative">
                  <SubIconComponent size={16} />
                </div>
                <span>{subItem.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  // Get user data and industry from auth context
  const { user, currentTenant, isAuthenticated } = useAuth();
  const [logoError, setLogoError] = useState(false);
  const [iconError, setIconError] = useState(false);
  
  // Get industry-specific menu items
  const menuItems = getMenuItemsForIndustry(user?.industry || currentTenant?.id);
  
  // Filter items into regular and admin groups
  const regularMenuItems = menuItems.filter(item => !item.adminOnly);
  const adminMenuItems = menuItems.filter(item => item.adminOnly);
  
  // Mock badge counts - in a real app, these would come from API/state
  const notificationCounts: Record<string, number> = {
    contracts: 3,
    appointments: 2,
    tasks: 5,
    vani: 1
  };

  // Check if user is admin
  const isAdmin = Boolean(currentTenant?.is_admin);

  // Render logo or text based on collapsed state and image availability
  const renderLogo = () => {
    if (collapsed) {
      if (!iconError) {
        return (
          <img 
            src="/assets/images/contractnest-icon.png" 
            alt="CN" 
            className="h-8 w-8"
            onError={() => setIconError(true)}
          />
        );
      } else {
        // Fallback for collapsed state if image fails to load
        return (
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <span className="font-bold">CN</span>
          </div>
        );
      }
    } else {
      if (!logoError) {
        return (
          <div className="flex items-center">
            <img 
              src="assets/assets/images/contractnest-logo.png" 
              alt="ContractNest" 
              className="h-8"
              onError={() => setLogoError(true)}
            />
          </div>
        );
      } else {
        // Fallback for expanded state if image fails to load
        return (
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-colors">
            ContractNest
          </h1>
        );
      }
    }
  };

  return (
    <aside 
      className={`
        bg-card text-card-foreground flex flex-col
        transition-all duration-300 ease-in-out sidebar shadow-sm h-full
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="mx-auto">
          {renderLogo()}
        </div>
      </div>

      <div className="p-2 flex-1 overflow-y-auto">
        <nav className="py-4 space-y-1">
          {/* Regular menu items */}
          {regularMenuItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              collapsed={collapsed}
              badge={notificationCounts[item.id]}
            />
          ))}
          
          {/* Admin menu separator - only show if user is admin and there are admin items */}
          {isAdmin && adminMenuItems.length > 0 && (
            <div className="my-4 px-4">
              <div className="flex items-center">
                {!collapsed && <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</span>}
                <div className={`${collapsed ? 'w-full' : 'ml-2 flex-1'} h-px bg-border`}></div>
              </div>
            </div>
          )}
          
          {/* Admin menu items - only show if user is admin */}
          {isAdmin && adminMenuItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              collapsed={collapsed} 
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-4 shadow-sm">
              <p className="text-sm font-medium">Need help?</p>
              <p className="text-xs text-muted-foreground mt-1">Check our documentation or contact support</p>
              <button className="mt-3 text-xs text-primary font-medium flex items-center">
                View Documentation
                <LucideIcons.ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;