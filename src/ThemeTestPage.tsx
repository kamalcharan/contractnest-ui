// src/ThemeTestPage.tsx
import React from 'react';
import { useTheme } from './contexts/ThemeContext';
import { Eye, EyeOff, Sun, Moon, Check } from 'lucide-react';

/**
 * Standalone Theme Test Page
 * 
 * This standalone test page can be added directly to your existing routes
 * without requiring changes to your file structure. It will help you test
 * if your theme context is working properly.
 * 
 * Add this to your routes:
 * <Route path="/theme-test" element={<ThemeTestPage />} />
 */
const ThemeTestPage: React.FC = () => {
  // Use the theme context to access theme values and functions
  const { isDarkMode, toggleDarkMode, currentTheme, setTheme } = useTheme();
  
  // Available themes in your application
  const themes = [
    { name: 'ClassicElegantTheme', label: 'Classic Elegant', color: 'bg-blue-500' },
    { name: 'CorporateTheme', label: 'Corporate', color: 'bg-sky-500' },
    { name: 'PurpleToneTheme', label: 'Purple Tone', color: 'bg-purple-500' },
    { name: 'BharathaVarshaTheme', label: 'Bharatha Varsha', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theme Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This page tests if your theme context is working properly. If you can see this page
          and interact with the controls below, your routes are configured correctly.
        </p>

        {/* Theme Context Status */}
        <div className="p-6 bg-card rounded-lg border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">Theme Context Status</h2>
          <div className="space-y-2">
            <p><span className="font-medium">isDarkMode:</span> {isDarkMode ? 'true' : 'false'}</p>
            <p><span className="font-medium">currentTheme:</span> {currentTheme || 'undefined'}</p>
            <p><span className="font-medium">toggleDarkMode:</span> {typeof toggleDarkMode === 'function' ? 'function available' : 'not available'}</p>
            <p><span className="font-medium">setTheme:</span> {typeof setTheme === 'function' ? 'function available' : 'not available'}</p>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="p-6 bg-card rounded-lg border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">Theme Controls</h2>
          
          {typeof toggleDarkMode === 'function' && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Dark Mode</h3>
              <button 
                onClick={toggleDarkMode} 
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </div>
          )}
          
          {typeof setTheme === 'function' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Available Themes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setTheme(theme.name)}
                    className={`flex items-center justify-between px-4 py-3 rounded-md border ${
                      currentTheme === theme.name 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${theme.color}`}></div>
                      <span>{theme.label}</span>
                    </div>
                    {currentTheme === theme.name && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Color Test */}
        <div className="p-6 bg-card rounded-lg border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">Color Test</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-md bg-primary text-primary-foreground text-center">Primary</div>
            <div className="p-4 rounded-md bg-secondary text-secondary-foreground text-center">Secondary</div>
            <div className="p-4 rounded-md bg-accent text-accent-foreground text-center">Accent</div>
            <div className="p-4 rounded-md bg-muted text-muted-foreground text-center">Muted</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-md bg-destructive text-destructive-foreground text-center">Destructive</div>
            <div className="p-4 rounded-md border border-border text-center">Border</div>
            <div className="p-4 rounded-md bg-card text-card-foreground border border-border text-center">Card</div>
            <div className="p-4 rounded-md bg-background text-foreground border border-border text-center">Background</div>
          </div>
        </div>

        {/* UI Components Test */}
        <div className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">UI Components</h2>
          
          <div className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-medium mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Primary</button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">Secondary</button>
                <button className="px-4 py-2 border border-border rounded-md">Outline</button>
                <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md">Delete</button>
              </div>
            </div>
            
            {/* Form Elements */}
            <div>
              <h3 className="text-lg font-medium mb-3">Form Elements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Text Input</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-border rounded-md" 
                    placeholder="Text input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password Input</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 border border-border rounded-md pr-10" 
                      placeholder="Password input"
                    />
                    <button className="absolute right-2 top-2 text-muted-foreground">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Checkbox</label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 text-primary border-border rounded" />
                    <span>Remember me</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select Input</label>
                  <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTestPage;