// src/components/layout/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  ChevronDown, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  Sun,
  Moon,
  Palette,
  Globe,
  Key,
  ToggleLeft,
  ToggleRight,
  Shield
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { languages } from '../../utils/constants/languages';
import { themes } from "../../utils/theme"
import EnvironmentSwitchModal from "../EnvironmentSwitchModal";
import TenantSwitcher from './TenantSwitcher';

// Environment configuration
const ENVIRONMENT_CONFIG = {
  showEnvironmentSwitch: import.meta.env.VITE_SHOW_ENVIRONMENT_SWITCH === 'true' || false,
  defaultEnvironment: 'live' as 'live' | 'test'
};

interface HeaderProps {
  onToggleSidebar: () => void;
}

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState<boolean>(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false);
  const { isDarkMode, toggleDarkMode, currentThemeId, setTheme } = useTheme();
  const { user, currentTenant, tenants, logout, isLive, toggleEnvironment, updateUserPreferences } = useAuth();

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Convert themes object to array for the dropdown
  const availableThemes = Object.values(themes).map(theme => ({
    name: theme.id, // This matches what the context expects
    label: theme.name, // This is the display name
    id: theme.id
  }));

  // Mock notification data
  const notifications: Notification[] = [
    { id: 1, text: 'New contract request from Acme Corp', time: '5 min ago', read: false },
    { id: 2, text: 'Appointment reminder: Meeting with client', time: '1 hour ago', read: false },
    { id: 3, text: 'Contract #1234 has been signed', time: '3 hours ago', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUserMenu = (): void => {
    console.log("Toggle user menu");
    setUserMenuOpen(!userMenuOpen);
    setNotificationsOpen(false);
    setThemeMenuOpen(false);
    setLanguageMenuOpen(false);
  };
  
  const toggleNotifications = (): void => {
    setNotificationsOpen(!notificationsOpen);
    setUserMenuOpen(false);
    setThemeMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  const toggleThemeMenu = (): void => {
    setThemeMenuOpen(!themeMenuOpen);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    setLanguageMenuOpen(false);
  };
  
  const toggleLanguageMenu = (): void => {
    setLanguageMenuOpen(!languageMenuOpen);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    setThemeMenuOpen(false);
  };

  // Update handleThemeChange
  const handleThemeChange = async (themeName: string): Promise<void> => {
    console.log('🎨 Theme change requested:', themeName);
    
    // First update the UI immediately
    setTheme(themeName as any);
    setThemeMenuOpen(false);
    
    // Then persist to backend if user is logged in
    if (user && updateUserPreferences) {
      try {
        console.log('📤 Sending theme preference to backend...');
        await updateUserPreferences({
          preferred_theme: themeName
        });
        console.log('✅ Theme preference saved');
      } catch (error) {
        console.error('❌ Failed to save theme preference:', error);
      }
    }
  };

  // Update handleDarkModeToggle  
  const handleDarkModeToggle = async (): Promise<void> => {
    console.log('🌓 Dark mode toggle requested, current:', isDarkMode);
    
    // First update the UI immediately
    toggleDarkMode();
    
    // Then persist to backend if user is logged in
    if (user && updateUserPreferences) {
      try {
        console.log('📤 Sending dark mode preference to backend...');
        await updateUserPreferences({
          is_dark_mode: !isDarkMode
        });
        console.log('✅ Dark mode preference saved');
      } catch (error) {
        console.error('❌ Failed to save dark mode preference:', error);
      }
    }
  };
  
  const handleLanguageChange = (languageCode: string): void => {
    console.log('Language changed to:', languageCode);
    setLanguageMenuOpen(false);
  };
  
  const handleLogout = (): void => {
    logout();
  };

  const handleProfileClick = (): void => {
    setUserMenuOpen(false);
    navigate('/profile');
  };

  const handleChangePasswordClick = (): void => {
    setUserMenuOpen(false);
    navigate('/change-password');
  };

  const handleSettingsClick = (): void => {
    setUserMenuOpen(false);
    navigate('/settings');
  };

  const handleHelpClick = (): void => {
    setUserMenuOpen(false);
    navigate('/help');
  };

  // Function to get theme color indicator
  const getThemeColor = (themeId: string): string => {
    const theme = themes[themeId];
    if (!theme) return 'bg-primary';
    
    // Use the theme's primary color for the indicator
    const primaryColor = theme.colors.brand.primary;
    
    // Map common colors to Tailwind classes, or use inline style
    const colorMap: { [key: string]: string } = {
      '#e67e22': 'bg-orange-500', // BharathaVarsha
      '#4b998c': 'bg-teal-500',   // ClassicElegant  
      '#6f61ef': 'bg-purple-500', // PurpleTone
      '#E53E3E': 'bg-red-500',    // ContractNest
      '#19db8a': 'bg-emerald-500', // ModernBold
      '#39d2c0': 'bg-cyan-500',   // ModernBusiness
      '#507583': 'bg-slate-500',  // ProfessionalRedefined
      '#2797ff': 'bg-blue-500',   // SleekCool & TechFuture
      '#06d5cd': 'bg-teal-400',   // TechAI
      '#f83b46': 'bg-rose-500',   // TechySimple
    };
    
    return colorMap[primaryColor] || 'bg-primary';
  };

  // Get user's preferred language or default to English
  const userPreferredLanguage = user?.preferred_language || 'en';
  const currentLanguage = languages.find(lang => lang.code === userPreferredLanguage) || languages[0];

  // Check if user/tenant is admin
  const isUserAdmin = user?.is_admin || false;
  const isAdminTenant = currentTenant?.is_admin || false;
  
  // Determine if we should show the tenant switcher
  // Show for: 1) Admin users (always) 2) Users with multiple tenants
  const showTenantSwitcher = isUserAdmin || (tenants && tenants.length > 1);

  return (
    <div className="relative h-full">
      <header className="bg-card shadow-sm py-3 px-4 flex items-center justify-between header h-full">
        {/* Left section */}
        <div className="flex items-center">
          <button 
            onClick={onToggleSidebar}
            className="mr-4 p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          
          {/* Tenant Switcher - Show based on user type and tenant count */}
          {showTenantSwitcher && currentTenant && (
            <TenantSwitcher showFullName={true} className="mr-4" />
          )}
          
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-muted rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-muted-foreground" />
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Admin/Owner Badge */}
          {(isUserAdmin || isAdminTenant) && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Shield size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {isUserAdmin ? 'System Admin' : 'Workspace Admin'}
              </span>
            </div>
          )}

          {/* Environment Toggle - Only show if enabled in config */}
          {ENVIRONMENT_CONFIG.showEnvironmentSwitch && (
            <button 
              onClick={toggleEnvironment}
              className="flex items-center px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
              style={{ borderColor: isLive ? '#22c55e' : '#f59e0b' }}
              aria-label={isLive ? "Switch to test environment" : "Switch to live environment"}
            >
              {isLive ? (
                <>
                  <span className="text-sm font-medium mr-2" style={{ color: '#16a34a' }}>Live</span>
                  <ToggleRight size={18} style={{ color: '#16a34a' }} />
                </>
              ) : (
                <>
                  <span className="text-sm font-medium mr-2" style={{ color: '#f59e0b' }}>Test</span>
                  <ToggleLeft size={18} style={{ color: '#f59e0b' }} />
                </>
              )}
            </button>
          )}
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-lg hover:bg-muted transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="fixed right-4 top-16 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-border flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-xs text-primary">Mark all as read</button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b border-border hover:bg-muted cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{notification.text}</p>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary mt-1"></span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-2 border-t border-border">
                  <button className="w-full py-2 text-center text-sm text-primary hover:bg-muted rounded-md transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={toggleUserMenu}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="User menu"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user?.first_name ? (
                  <span>{user.first_name.charAt(0)}</span>
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-tight">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {user?.user_code || 'User'}
                </p>
              </div>
              <ChevronDown size={16} className="hidden md:block" />
            </button>
            
            {userMenuOpen && (
              <div className="fixed right-4 top-16 w-64 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-border">
                  <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                  {user?.user_code && (
                    <div className="mt-2 text-xs bg-muted rounded px-2 py-1 inline-block">
                      User Code: {user.user_code}
                    </div>
                  )}
                </div>
                
                <div className="p-2">
                  <button 
                    onClick={toggleThemeMenu}
                    className="flex items-center justify-between gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center">
                      <Palette size={18} className="mr-3" />
                      <span>Theme</span>
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  
                  <button 
                    onClick={toggleLanguageMenu}
                    className="flex items-center justify-between gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center">
                      <Globe size={18} className="mr-3" />
                      <span>Language: {currentLanguage.name}</span>
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  
                  <button 
                    onClick={handleProfileClick}
                    className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <User size={18} className="mr-3" />
                    <span>Profile</span>
                  </button>
                  
                  <button 
                    onClick={handleChangePasswordClick}
                    className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <Key size={18} className="mr-3" />
                    <span>Change Password</span>
                  </button>
                  
                  <button 
                    onClick={handleSettingsClick}
                    className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <Settings size={18} className="mr-3" />
                    <span>Settings</span>
                  </button>
                  
                  <button 
                    onClick={handleHelpClick}
                    className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <HelpCircle size={18} className="mr-3" />
                    <span>Help & Support</span>
                  </button>
                </div>
                
                <div className="p-2 border-t border-border">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <LogOut size={18} className="mr-3" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Theme Selection Menu */}
      {themeMenuOpen && (
        <div className="fixed right-20 top-16 w-60 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden" ref={themeMenuRef}>
          <div className="p-3 border-b border-border">
            <h3 className="font-medium">Appearance</h3>
          </div>
          
          <div className="p-3">
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Mode</p>
              <button 
                onClick={handleDarkModeToggle} 
                className="flex items-center justify-between w-full p-2 text-left text-sm rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex items-center">
                  {isDarkMode ? <Moon size={16} className="mr-2" /> : <Sun size={16} className="mr-2" />}
                  <span>{isDarkMode ? 'Dark' : 'Light'}</span>
                </div>
                <div className="h-4 w-8 bg-muted rounded-full relative">
                  <div className={`absolute h-3 w-3 rounded-full top-0.5 transition-all ${isDarkMode ? 'bg-primary right-0.5' : 'bg-muted-foreground left-0.5'}`}></div>
                </div>
              </button>
            </div>
            
            <p className="text-sm font-medium mb-2">Theme</p>
            <div className="max-h-64 overflow-y-auto">
              {availableThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.name)}
                  className={`flex items-center w-full p-2 mb-1 text-left text-sm rounded-md hover:bg-muted transition-colors ${
                    currentThemeId === theme.name ? 'bg-muted' : ''
                  }`}
                >
                  <div className={`h-3 w-3 rounded-full ${getThemeColor(theme.id)} mr-2`}></div>
                  <span className="flex-1 truncate">{theme.label}</span>
                  {currentThemeId === theme.name && (
                    <span className="ml-auto text-primary text-xs">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Language Selection Menu */}
      {languageMenuOpen && (
        <div className="fixed right-20 top-16 w-60 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden" ref={languageMenuRef}>
          <div className="p-3 border-b border-border">
            <h3 className="font-medium">Select Language</h3>
          </div>
          
          <div className="p-3 max-h-96 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`flex items-center w-full p-2 mb-1 text-left text-sm rounded-md hover:bg-muted transition-colors ${
                  userPreferredLanguage === language.code ? 'bg-muted' : ''
                }`}
              >
                <span className="mr-2">{language.isRTL ? '←' : '→'}</span>
                <span className="flex-1 truncate">{language.name} ({language.nativeName})</span>
                {userPreferredLanguage === language.code && (
                  <span className="ml-auto text-primary text-xs">Active</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Environment Switch Modal */}
      <EnvironmentSwitchModal />
    </div>
  );
};

export default Header;