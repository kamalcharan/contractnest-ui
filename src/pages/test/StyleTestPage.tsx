// src/pages/test/StyleTestPage.tsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Sun, Moon, Palette, 
  Check, X, AlertTriangle,
  User, Settings, FileText,
  LogIn, LogOut, Mail
} from 'lucide-react';

const StyleTestPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode, currentTheme, setTheme } = useTheme();
  
  // Available themes
  const themes = [
    { name: 'ClassicElegantTheme', label: 'Classic Elegant' },
    { name: 'CorporateTheme', label: 'Corporate' },
    { name: 'PurpleToneTheme', label: 'Purple Tone' },
    { name: 'BharathaVarshaTheme', label: 'Bharatha Varsha' }
  ];

  // Get theme color indicator
  const getThemeColor = (themeName: string): string => {
    switch (themeName) {
      case 'ClassicElegantTheme':
        return 'bg-blue-500';
      case 'CorporateTheme':
        return 'bg-sky-500';
      case 'PurpleToneTheme':
        return 'bg-purple-500';
      case 'BharathaVarshaTheme':
        return 'bg-orange-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Style Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This page tests various UI components and theme settings to ensure proper styling.
        </p>

        {/* Theme Controls */}
        <section className="mb-12 p-6 bg-card rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Theme Controls</h2>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            
            <div className="text-sm text-muted-foreground">
              Current Mode: <span className="font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">Available Themes:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setTheme(theme.name as any)}
                  className={`flex items-center justify-between px-4 py-3 rounded-md border transition-colors ${
                    currentTheme === theme.name 
                      ? 'bg-primary/10 border-primary' 
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getThemeColor(theme.name)}`}></div>
                    <span>{theme.label}</span>
                  </div>
                  {currentTheme === theme.name && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="mb-12 p-6 bg-card rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded bg-primary text-primary-foreground text-center">Primary</div>
            <div className="p-4 rounded bg-secondary text-secondary-foreground text-center">Secondary</div>
            <div className="p-4 rounded bg-accent text-accent-foreground text-center">Accent</div>
            <div className="p-4 rounded bg-muted text-muted-foreground text-center">Muted</div>
            <div className="p-4 rounded bg-card text-card-foreground border border-border text-center">Card</div>
            <div className="p-4 rounded bg-destructive text-destructive-foreground text-center">Destructive</div>
            <div className="p-4 rounded bg-border text-foreground text-center">Border</div>
            <div className="p-4 rounded bg-input text-foreground text-center">Input</div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12 p-6 bg-card rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Primary
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
              Secondary
            </button>
            <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors">
              Accent
            </button>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors">
              Destructive
            </button>
            <button className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors">
              Muted
            </button>
            <button className="px-4 py-2 bg-card border border-input text-card-foreground rounded-md hover:bg-muted transition-colors">
              Outline
            </button>
            <button className="px-4 py-2 bg-transparent text-foreground underline rounded-md hover:bg-muted transition-colors">
              Link
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md opacity-50 cursor-not-allowed" disabled>
              Disabled
            </button>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Icon Button</span>
            </button>
            <button className="p-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* Form Controls */}
        <section className="mb-12 p-6 bg-card rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Form Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Text Input</label>
              <input 
                type="text" 
                placeholder="Enter text here" 
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Select Input</label>
              <select className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Checkbox</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-border rounded" />
                <span>Remember me</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Radio Buttons</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="radio" name="radio-group" className="h-4 w-4 text-primary focus:ring-primary border-border" />
                  <span>Option 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="radio-group" className="h-4 w-4 text-primary focus:ring-primary border-border" />
                  <span>Option 2</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="mb-12 p-6 bg-card rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Alerts</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-primary/10 border border-primary/20 text-foreground">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-foreground">Success Alert</h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <p>Operation completed successfully.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-foreground">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-destructive" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-foreground">Error Alert</h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <p>There was a problem with your request.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-foreground">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-foreground">Warning Alert</h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <p>This action cannot be undone.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="mb-12 p-6 bg-card rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Icons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <User className="h-6 w-6 text-foreground" />
              <span className="text-sm text-muted-foreground">User</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Settings className="h-6 w-6 text-foreground" />
              <span className="text-sm text-muted-foreground">Settings</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-6 w-6 text-foreground" />
              <span className="text-sm text-muted-foreground">File</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LogIn className="h-6 w-6 text-foreground" />
              <span className="text-sm text-muted-foreground">Login</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LogOut className="h-6 w-6 text-foreground" />
              <span className="text-sm text-muted-foreground">Logout</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="h-6 w-6 text-foreground" />
              <span className="text-sm text-muted-foreground">Mail</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StyleTestPage;