// src/components/ThemeTestSimple.tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from './common/ThemeSwitcher';

const ThemeTestSimple: React.FC = () => {
  const { currentTheme, isDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-utility-primaryBackground text-utility-primaryText">
      <header className="bg-brand-primary text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">ContractNest Theme Test</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Theme Switcher</h2>
            <ThemeSwitcher />
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Theme Details</h2>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <p><strong>Current Theme:</strong> {currentTheme.name}</p>
                <p><strong>Theme ID:</strong> {currentTheme.id}</p>
                <p><strong>Mode:</strong> {isDarkMode ? 'Dark' : 'Light'}</p>
                <pre className="mt-4 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto">
                  {JSON.stringify(
                    isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors, 
                    null, 
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">UI Elements with Theme Colors</h2>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <h3 className="font-medium mb-4">Buttons</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-brand-primary text-white rounded-md">
                    Primary Button
                  </button>
                  <button className="px-4 py-2 bg-brand-secondary text-white rounded-md">
                    Secondary Button
                  </button>
                  <button className="px-4 py-2 bg-brand-tertiary text-white rounded-md">
                    Tertiary Button
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-semantic-success text-white rounded-md">
                    Success
                  </button>
                  <button className="px-4 py-2 bg-semantic-error text-white rounded-md">
                    Error
                  </button>
                  <button className="px-4 py-2 bg-semantic-warning text-black rounded-md">
                    Warning
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <h3 className="font-medium mb-4">Text Colors</h3>
              <p className="text-utility-primaryText">Primary Text</p>
              <p className="text-utility-secondaryText">Secondary Text</p>
              <p className="text-brand-primary">Brand Primary Text</p>
              <p className="text-brand-secondary">Brand Secondary Text</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-medium mb-4">Background Colors</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-4 bg-brand-primary text-white rounded">Primary</div>
                <div className="p-4 bg-brand-secondary text-white rounded">Secondary</div>
                <div className="p-4 bg-utility-primaryBackground rounded">Primary BG</div>
                <div className="p-4 bg-utility-secondaryBackground rounded">Secondary BG</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThemeTestSimple;