// src/components/common/ThemeSwitcher.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../config/theme';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, isDarkMode, setTheme, toggleDarkMode } = useTheme();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Theme Selection</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(themes).map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`px-3 py-2 rounded-md text-sm ${
                currentTheme.id === theme.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={{
                backgroundColor: currentTheme.id === theme.id 
                  ? (isDarkMode ? theme.darkMode.colors.brand.primary : theme.colors.brand.primary)
                  : undefined
              }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Mode</h3>
        <div className="flex items-center">
          <span className="mr-2 text-sm">Light</span>
          <button
            onClick={toggleDarkMode}
            className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
            style={{
              backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.brand.primary 
                : '#d1d5db'
            }}
          >
            <span
              className={`${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
          </button>
          <span className="ml-2 text-sm">Dark</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-2">Current Theme Colors</h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.brand.primary 
                : currentTheme.colors.brand.primary 
              }}
            ></div>
            <span className="text-xs mt-1">Primary</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.brand.secondary 
                : currentTheme.colors.brand.secondary 
              }}
            ></div>
            <span className="text-xs mt-1">Secondary</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.semantic.success 
                : currentTheme.colors.semantic.success 
              }}
            ></div>
            <span className="text-xs mt-1">Success</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.semantic.error 
                : currentTheme.colors.semantic.error 
              }}
            ></div>
            <span className="text-xs mt-1">Error</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;