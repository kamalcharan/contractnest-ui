// src/components/common/ThemeSwitcher.tsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../config/theme';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, currentThemeId, isDarkMode, setTheme, toggleDarkMode } = useTheme();

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
                currentThemeId === theme.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={{
                backgroundColor: currentThemeId === theme.id 
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
        
        {/* Additional Color Rows */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.brand.tertiary 
                : currentTheme.colors.brand.tertiary 
              }}
            ></div>
            <span className="text-xs mt-1">Tertiary</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.brand.alternate 
                : currentTheme.colors.brand.alternate 
              }}
            ></div>
            <span className="text-xs mt-1">Alternate</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.semantic.warning 
                : currentTheme.colors.semantic.warning 
              }}
            ></div>
            <span className="text-xs mt-1">Warning</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.semantic.info 
                : currentTheme.colors.semantic.info 
              }}
            ></div>
            <span className="text-xs mt-1">Info</span>
          </div>
        </div>
        
        {/* Utility Colors Row */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-300" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.utility.primaryBackground 
                : currentTheme.colors.utility.primaryBackground 
              }}
            ></div>
            <span className="text-xs mt-1">Primary BG</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-300" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.utility.secondaryBackground 
                : currentTheme.colors.utility.secondaryBackground 
              }}
            ></div>
            <span className="text-xs mt-1">Secondary BG</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-300" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.utility.primaryText 
                : currentTheme.colors.utility.primaryText 
              }}
            ></div>
            <span className="text-xs mt-1">Primary Text</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-300" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.utility.secondaryText 
                : currentTheme.colors.utility.secondaryText 
              }}
            ></div>
            <span className="text-xs mt-1">Secondary Text</span>
          </div>
        </div>
        
        {/* Accent Colors Row */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.accent.accent1 
                : currentTheme.colors.accent.accent1 
              }}
            ></div>
            <span className="text-xs mt-1">Accent 1</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.accent.accent2 
                : currentTheme.colors.accent.accent2 
              }}
            ></div>
            <span className="text-xs mt-1">Accent 2</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.accent.accent3 
                : currentTheme.colors.accent.accent3 
              }}
            ></div>
            <span className="text-xs mt-1">Accent 3</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: isDarkMode 
                ? currentTheme.darkMode.colors.accent.accent4 
                : currentTheme.colors.accent.accent4 
              }}
            ></div>
            <span className="text-xs mt-1">Accent 4</span>
          </div>
        </div>
      </div>
      
      {/* Theme Details Section */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-2">Current Theme Details</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Theme:</span> {currentTheme.name}
            </div>
            <div>
              <span className="font-medium">ID:</span> {currentTheme.id}
            </div>
            <div>
              <span className="font-medium">Mode:</span> {isDarkMode ? 'Dark' : 'Light'}
            </div>
            <div>
              <span className="font-medium">Primary:</span> 
              <span 
                className="ml-1 px-2 py-1 rounded text-xs"
                style={{ 
                  backgroundColor: isDarkMode ? currentTheme.darkMode.colors.brand.primary : currentTheme.colors.brand.primary,
                  color: '#fff'
                }}
              >
                {isDarkMode ? currentTheme.darkMode.colors.brand.primary : currentTheme.colors.brand.primary}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Theme Preview Section */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-2">Theme Preview</h3>
        <div 
          className="rounded-lg p-4 border-2"
          style={{ 
            backgroundColor: isDarkMode ? currentTheme.darkMode.colors.utility.primaryBackground : currentTheme.colors.utility.primaryBackground,
            borderColor: isDarkMode ? currentTheme.darkMode.colors.brand.primary : currentTheme.colors.brand.primary,
            color: isDarkMode ? currentTheme.darkMode.colors.utility.primaryText : currentTheme.colors.utility.primaryText
          }}
        >
          <h4 className="font-semibold mb-2">Sample Content</h4>
          <p 
            className="text-sm mb-3"
            style={{ color: isDarkMode ? currentTheme.darkMode.colors.utility.secondaryText : currentTheme.colors.utility.secondaryText }}
          >
            This is how your content will look with the current theme settings.
          </p>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 rounded text-white text-sm"
              style={{ backgroundColor: isDarkMode ? currentTheme.darkMode.colors.brand.primary : currentTheme.colors.brand.primary }}
            >
              Primary Button
            </button>
            <button 
              className="px-3 py-1 rounded text-white text-sm"
              style={{ backgroundColor: isDarkMode ? currentTheme.darkMode.colors.brand.secondary : currentTheme.colors.brand.secondary }}
            >
              Secondary Button
            </button>
            <button 
              className="px-3 py-1 rounded text-white text-sm"
              style={{ backgroundColor: isDarkMode ? currentTheme.darkMode.colors.semantic.success : currentTheme.colors.semantic.success }}
            >
              Success
            </button>
            <button 
              className="px-3 py-1 rounded text-white text-sm"
              style={{ backgroundColor: isDarkMode ? currentTheme.darkMode.colors.semantic.error : currentTheme.colors.semantic.error }}
            >
              Error
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;