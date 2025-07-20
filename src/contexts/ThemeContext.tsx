// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define available themes
export type ThemeName = 'BharathaVarshaTheme' | 'ClassicElegantTheme' | 'PurpleToneTheme' | 'CorporateTheme';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setIsDarkMode: (darkMode: boolean) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'ClassicElegantTheme',
  setTheme: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
  setIsDarkMode: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
  defaultDarkMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'ClassicElegantTheme',
  defaultDarkMode = false 
}) => {
  // State to track if we've initialized from user preferences
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Initialize state from localStorage or defaults
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('contractnest-theme');
    return (savedTheme as ThemeName) || defaultTheme;
  });
  
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    const savedDarkMode = localStorage.getItem('contractnest-dark-mode');
    // Check for system preference if not saved
    if (savedDarkMode === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches || defaultDarkMode;
    }
    return savedDarkMode === 'true';
  });

  // Initialize from user preferences on mount
  useEffect(() => {
    const initializeFromUserPreferences = () => {
      if (hasInitialized) return;
      
      // Try to get user data from storage (both localStorage and sessionStorage)
      let userData = null;
      
      // Check sessionStorage first (for remember me = false)
      const sessionData = sessionStorage.getItem('user_data');
      if (sessionData) {
        try {
          userData = JSON.parse(sessionData);
        } catch (e) {
          console.error('Error parsing session user data:', e);
        }
      }
      
      // If not in session, check localStorage
      if (!userData) {
        const localData = localStorage.getItem('user_data');
        if (localData) {
          try {
            userData = JSON.parse(localData);
          } catch (e) {
            console.error('Error parsing local user data:', e);
          }
        }
      }
      
      // Apply user preferences if available
      if (userData) {
        console.log('Initializing theme from user preferences:', {
          theme: userData.preferred_theme,
          darkMode: userData.is_dark_mode
        });
        
        if (userData.preferred_theme) {
          setCurrentTheme(userData.preferred_theme as ThemeName);
          localStorage.setItem('contractnest-theme', userData.preferred_theme);
        }
        
        if (userData.is_dark_mode !== undefined && userData.is_dark_mode !== null) {
          setIsDarkModeState(userData.is_dark_mode);
          localStorage.setItem('contractnest-dark-mode', String(userData.is_dark_mode));
        }
        
        setHasInitialized(true);
      }
    };
    
    // Initialize immediately
    initializeFromUserPreferences();
    
    // Also listen for storage events in case user data is set after mount
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_data' && e.newValue && !hasInitialized) {
        initializeFromUserPreferences();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [hasInitialized]);

  // Set theme function
  const setTheme = (theme: ThemeName) => {
    console.log(`Setting theme to: ${theme}, isDarkMode: ${isDarkMode}`);
    setCurrentTheme(theme);
    localStorage.setItem('contractnest-theme', theme);
    applyTheme(theme, isDarkMode);
  };

  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
  };
  
  // Set dark mode directly
  const setIsDarkMode = (darkMode: boolean) => {
    setIsDarkModeState(darkMode);
    localStorage.setItem('contractnest-dark-mode', String(darkMode));
    applyTheme(currentTheme, darkMode);
  };

  // Apply theme to document
  const applyTheme = (theme: ThemeName, darkMode: boolean) => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      'theme-bharatha-varsha',
      'theme-classic-elegant',
      'theme-purple-tone',
      'theme-corporate',
      'dark',
      'light'
    );

    // Add appropriate theme class
    switch (theme) {
      case 'BharathaVarshaTheme':
        document.documentElement.classList.add('theme-bharatha-varsha');
        break;
      case 'ClassicElegantTheme':
        document.documentElement.classList.add('theme-classic-elegant');
        break;
      case 'PurpleToneTheme':
        document.documentElement.classList.add('theme-purple-tone');
        break;
      case 'CorporateTheme':
        document.documentElement.classList.add('theme-corporate');
        break;
    }

    // Add dark/light mode class
    document.documentElement.classList.add(darkMode ? 'dark' : 'light');
    
    console.log('Updated classList:', document.documentElement.className);
  };

  // Apply theme on initial render and when dependencies change
  useEffect(() => {
    applyTheme(currentTheme, isDarkMode);
  }, [currentTheme, isDarkMode]);

  // Listen for system color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if user hasn't set a preference
      const savedDarkMode = localStorage.getItem('contractnest-dark-mode');
      const userData = sessionStorage.getItem('user_data') || localStorage.getItem('user_data');
      const hasUserPreference = userData && JSON.parse(userData).is_dark_mode !== undefined;
      
      if (savedDarkMode === null && !hasUserPreference) {
        setIsDarkModeState(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      isDarkMode, 
      toggleDarkMode,
      setIsDarkMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing theme context
export const useTheme = () => useContext(ThemeContext);