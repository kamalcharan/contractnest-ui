// src/components/test/ThemeTest.tsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * This component is used to test if the theme context is working properly.
 * It attempts to import from both possible paths and displays the results.
 */
const ThemeTest: React.FC = () => {
  // Use the theme context
  const { isDarkMode, toggleDarkMode, currentTheme, setTheme } = useTheme();
  
  let contextPath = "../../contexts/ThemeContext";
  let themingSystem = "None detected";
  let themeData: any = {};
  
  try {    
    // Gather theme info
    themeData = {
      isDarkMode,
      currentTheme,
      hasToggleDarkMode: typeof toggleDarkMode === 'function',
      hasSetTheme: typeof setTheme === 'function'
    };
    
    if (typeof toggleDarkMode === 'function' && typeof setTheme === 'function') {
      themingSystem = "Full theming system detected";
    } else if (typeof toggleDarkMode === 'function') {
      themingSystem = "Dark mode toggle detected";
    } else if (typeof setTheme === 'function') {
      themingSystem = "Theme selection detected";
    }
  } catch (error) {
    // Handle error
    console.error("Error testing theme context:", error);
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Theme Context Test</h1>
      
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Theme Context Details</h2>
        <p><strong>Path:</strong> {contextPath}</p>
        <p><strong>System:</strong> {themingSystem}</p>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Theme Values</h2>
        <pre className="bg-muted p-3 rounded overflow-auto text-sm">
          {JSON.stringify(themeData, null, 2)}
        </pre>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">CSS Variable Test</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm">
              Primary
            </div>
            <div className="h-10 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-sm">
              Secondary
            </div>
            <div className="h-10 bg-accent rounded flex items-center justify-center text-accent-foreground text-sm">
              Accent
            </div>
            <div className="h-10 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
              Muted
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Toggle Dark Mode
          </button>
          
          {typeof setTheme === 'function' && (
            <>
              <button 
                onClick={() => setTheme('ClassicElegantTheme')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Classic Theme
              </button>
              <button 
                onClick={() => setTheme('CorporateTheme')}
                className="px-4 py-2 bg-sky-500 text-white rounded-md"
              >
                Corporate Theme
              </button>
              <button 
                onClick={() => setTheme('PurpleToneTheme')}
                className="px-4 py-2 bg-purple-500 text-white rounded-md"
              >
                Purple Theme
              </button>
              <button 
                onClick={() => setTheme('BharathaVarshaTheme')}
                className="px-4 py-2 bg-orange-500 text-white rounded-md"
              >
                Bharatha Varsha Theme
              </button>
            </>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>
            If the theme context is working, the colors above should change when you toggle between themes.
            If colors don't change, check if your ThemeContext provider is properly set up and wrapping this component.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;