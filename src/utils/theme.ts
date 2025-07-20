// src/utils/theme.ts

import { BharathaVarshaTheme } from '@/config/theme/themes/BharathaVarshaTheme';
import { ClassicElegantTheme } from '@/config/theme/themes/ClassicElegantTheme';
import { PurpleToneTheme } from '@/config/theme/themes/PurpleToneTheme';
import { ThemeName } from '@/contexts/ThemeContext';

/**
 * Get colors for the current theme and mode
 * @param themeName The current theme name
 * @param isDarkMode Whether dark mode is enabled
 * @returns Theme colors object
 */
export function getThemeColors(themeName: ThemeName, isDarkMode: boolean): any {
  let themeConfig;
  
  switch (themeName) {
    case 'BharathaVarshaTheme':
      themeConfig = BharathaVarshaTheme;
      break;
    case 'ClassicElegantTheme':
      themeConfig = ClassicElegantTheme;
      break;
    case 'PurpleToneTheme':
      themeConfig = PurpleToneTheme;
      break;
    default:
      themeConfig = ClassicElegantTheme; // Default fallback
  }
  
  return isDarkMode ? themeConfig.darkMode.colors : themeConfig.colors;
}

/**
 * Create toast styles based on current theme
 * @param themeName Current theme name
 * @param isDarkMode Whether dark mode is enabled
 * @returns Object with styled toast variants
 */
export function getToastStyles(themeName: ThemeName, isDarkMode: boolean) {
  const colors = getThemeColors(themeName, isDarkMode);
  
  // Common style attributes
  const baseStyle = {
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    minWidth: '300px'
  };
  
  // Style variants for different toast types
  return {
    error: {
      ...baseStyle,
      background: colors.semantic.error,
      color: '#FFFFFF'
    },
    success: {
      ...baseStyle,
      background: colors.semantic.success,
      color: '#FFFFFF'
    },
    warning: {
      ...baseStyle,
      background: colors.semantic.warning,
      color: isDarkMode ? '#000000' : '#000000' // Usually black text on yellow
    },
    info: {
      ...baseStyle,
      background: colors.semantic.info,
      color: '#FFFFFF'
    },
    loading: {
      ...baseStyle,
      background: isDarkMode ? colors.utility.secondaryBackground : '#FFFFFF',
      color: colors.utility.primaryText
    }
  };
}

/**
 * Get a specific semantic color from the current theme
 * @param themeName Current theme name
 * @param isDarkMode Whether dark mode is enabled
 * @param colorName Name of the semantic color to get (success, error, warning, info)
 * @returns The color value as hex string
 */
export function getSemanticColor(
  themeName: ThemeName, 
  isDarkMode: boolean, 
  colorName: 'success' | 'error' | 'warning' | 'info'
): string {
  const colors = getThemeColors(themeName, isDarkMode);
  return colors.semantic[colorName];
}

/**
 * Get a specific brand color from the current theme
 * @param themeName Current theme name
 * @param isDarkMode Whether dark mode is enabled
 * @param colorName Name of the brand color to get (primary, secondary, tertiary, alternate)
 * @returns The color value as hex string
 */
export function getBrandColor(
  themeName: ThemeName,
  isDarkMode: boolean,
  colorName: 'primary' | 'secondary' | 'tertiary' | 'alternate'
): string {
  const colors = getThemeColors(themeName, isDarkMode);
  return colors.brand[colorName];
}

/**
 * Check if a color is light (to determine text color)
 * @param color Hex color string (e.g. #FFFFFF)
 * @returns Boolean indicating if the color is light
 */
export function isLightColor(color: string): boolean {
  // Remove the hash if it exists
  const hex = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate perceived brightness using the sRGB formula
  // https://www.w3.org/TR/AERT/#color-contrast
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if the color is light (brightness > 125)
  return brightness > 125;
}

/**
 * Get contrasting text color for a given background color
 * @param bgColor Background color hex string
 * @returns White or black color for optimal contrast
 */
export function getContrastColor(bgColor: string): string {
  return isLightColor(bgColor) ? '#000000' : '#FFFFFF';
}