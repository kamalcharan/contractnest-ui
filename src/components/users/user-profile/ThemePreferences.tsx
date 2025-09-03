// src/components/users/user-profile/ThemePreferences.tsx
import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { themes } from '@/utils/theme';
import { cn } from '@/lib/utils';

interface ThemePreferencesProps {
  profile: any;
  onUpdate: (data: any) => Promise<boolean>; // We can ignore this prop
  updating: boolean; // We can ignore this prop too
}

const ThemePreferences: React.FC<ThemePreferencesProps> = ({ profile }) => {
  const { isDarkMode, currentTheme, currentThemeId, setTheme, toggleDarkMode } = useTheme();
  const { updateUserPreferences } = useAuth();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Convert themes object to array for display
  const availableThemes = Object.values(themes).map(theme => ({
    id: theme.id,
    name: theme.name,
    colors: theme.colors,
    darkMode: theme.darkMode
  }));

  // Exactly like Header.tsx
  const handleThemeChange = async (themeId: string) => {
    setTheme(themeId);
    
    if (updateUserPreferences) {
      try {
        await updateUserPreferences({ preferred_theme: themeId });
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };

  // Exactly like Header.tsx
  const handleDarkModeToggle = async () => {
    toggleDarkMode();
    
    if (updateUserPreferences) {
      try {
        await updateUserPreferences({ is_dark_mode: !isDarkMode });
      } catch (error) {
        console.error('Failed to save dark mode preference:', error);
      }
    }
  };

  // Theme preview colors for display
  const getThemePreviewColors = (theme: any, isDark: boolean) => {
    const themeColors = isDark ? theme.darkMode?.colors : theme.colors;
    return {
      primary: themeColors?.brand?.primary || '#3B82F6',
      secondary: themeColors?.brand?.secondary || '#8B5CF6',
      tertiary: themeColors?.brand?.tertiary || '#EC4899',
      background: themeColors?.utility?.primaryBackground || '#FFFFFF',
      text: themeColors?.utility?.primaryText || '#000000'
    };
  };

  return (
    <div 
      className="border rounded-lg p-6"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20'
      }}
    >
      <div className="flex items-center mb-6">
        <Palette className="mr-3" style={{ color: colors.brand.primary }} />
        <h2 className="text-xl font-semibold" style={{ color: colors.utility.primaryText }}>
          Appearance Settings
        </h2>
      </div>

      <div className="space-y-6">
        {/* Dark Mode Toggle */}
        <div>
          <h3 className="text-lg font-medium mb-3" style={{ color: colors.utility.primaryText }}>
            Display Mode
          </h3>
          <div className="flex items-center justify-between p-4 rounded-lg border"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <div className="flex items-center">
              {isDarkMode ? (
                <Moon className="mr-3 h-5 w-5" style={{ color: colors.brand.primary }} />
              ) : (
                <Sun className="mr-3 h-5 w-5" style={{ color: colors.semantic.warning || '#f59e0b' }} />
              )}
              <div>
                <p className="font-medium" style={{ color: colors.utility.primaryText }}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                  {isDarkMode ? 'Easier on the eyes in low light' : 'Better for well-lit environments'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{
                backgroundColor: isDarkMode ? colors.brand.primary : colors.utility.primaryText + '30'
              }}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  isDarkMode ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-medium mb-3" style={{ color: colors.utility.primaryText }}>
            Color Theme
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableThemes.map((theme) => {
              const isSelected = currentThemeId === theme.id;
              const previewColors = getThemePreviewColors(theme, isDarkMode);
              
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all hover:scale-105",
                    isSelected && "ring-2 ring-offset-2"
                  )}
                  style={{
                    borderColor: isSelected ? colors.brand.primary : colors.utility.primaryText + '20',
                    backgroundColor: colors.utility.primaryBackground,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  {/* Theme Preview */}
                  <div className="mb-3 flex justify-center space-x-1">
                    <div 
                      className="w-7 h-7 rounded-full shadow-sm"
                      style={{ backgroundColor: previewColors.primary }}
                    />
                    <div 
                      className="w-7 h-7 rounded-full shadow-sm"
                      style={{ backgroundColor: previewColors.secondary }}
                    />
                    <div 
                      className="w-7 h-7 rounded-full shadow-sm"
                      style={{ backgroundColor: previewColors.tertiary }}
                    />
                  </div>
                  
                  {/* Theme Name */}
                  <p className="text-sm font-medium capitalize" style={{ color: colors.utility.primaryText }}>
                    {theme.name}
                  </p>
                  
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div 
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: colors.brand.primary }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview Section */}
        <div>
          <h3 className="text-lg font-medium mb-3" style={{ color: colors.utility.primaryText }}>
            Live Preview
          </h3>
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: colors.utility.primaryText }}>
                  Sample Heading
                </span>
                <button
                  className="px-3 py-1 rounded-md text-sm font-medium transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: colors.brand.primary,
                    color: '#ffffff'
                  }}
                >
                  Primary Button
                </button>
              </div>
              <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                This preview updates instantly as you select different themes and toggle dark mode. 
                Your preferences are automatically saved.
              </p>
              <div className="flex flex-wrap gap-2">
                <div 
                  className="px-3 py-1 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: colors.semantic.success + '20',
                    color: colors.semantic.success
                  }}
                >
                  Success
                </div>
                <div 
                  className="px-3 py-1 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: (colors.semantic.warning || '#f59e0b') + '20',
                    color: colors.semantic.warning || '#f59e0b'
                  }}
                >
                  Warning
                </div>
                <div 
                  className="px-3 py-1 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: colors.semantic.error + '20',
                    color: colors.semantic.error
                  }}
                >
                  Error
                </div>
                <div 
                  className="px-3 py-1 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: colors.brand.secondary + '20',
                    color: colors.brand.secondary
                  }}
                >
                  Secondary
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
            <strong>Note:</strong> Changes are applied immediately and saved automatically. 
            Your theme preferences sync across all your devices when you sign in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemePreferences;