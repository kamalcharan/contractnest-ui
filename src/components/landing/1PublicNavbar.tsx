//src/components/landing/PublicNavbar.tsx

mport React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PublicNavbar: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PublicNavbar: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Theme-based styling
  const navbarBg = scrolled 
    ? theme.mode === 'dark' ? 'bg-black/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md' 
    : 'bg-transparent';
  
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const buttonBgColor = currentTheme?.colors?.brand?.primary || '#E53E3E';
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="ContractNest Logo" 
                className="h-10 w-auto mr-2"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // We'll still show the text logo as fallback
                }}
              />
              <span className={`text-xl font-bold ${textColor}`}>ContractNest</span>
            </Link>
          </div>
          
          {/* Navigation Links - can be expanded as needed 
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className={`${textColor} hover:text-opacity-75 transition-colors text-sm font-medium`}>Features</a>
            <a href="#how-it-works" className={`${textColor} hover:text-opacity-75 transition-colors text-sm font-medium`}>How It Works</a>
            <a href="#use-cases" className={`${textColor} hover:text-opacity-75 transition-colors text-sm font-medium`}>Use Cases</a>
          </div>*/}
          
          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button 
                variant="outline" 
                className="hidden sm:inline-flex"
                style={{ 
                  borderColor: buttonBgColor,
                  color: buttonBgColor 
                }}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                style={{ backgroundColor: buttonBgColor }}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Theme-based styling
  const navbarBg = scrolled 
    ? theme.mode === 'dark' ? 'bg-black/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md' 
    : 'bg-transparent';
  
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const buttonBgColor = currentTheme?.colors?.brand?.primary || '#E53E3E';
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="ContractNest Logo" 
                className="h-10 w-auto mr-2"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // We'll still show the text logo as fallback
                }}
              />
              <span className={`text-xl font-bold ${textColor}`}>ContractNest</span>
            </Link>
          </div>
          
          {/* Navigation Links - can be expanded as needed 
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className={`${textColor} hover:text-opacity-75 transition-colors text-sm font-medium`}>Features</a>
            <a href="#how-it-works" className={`${textColor} hover:text-opacity-75 transition-colors text-sm font-medium`}>How It Works</a>
            <a href="#use-cases" className={`${textColor} hover:text-opacity-75 transition-colors text-sm font-medium`}>Use Cases</a>
          </div>*/}
          
          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/auth/login">
              <Button 
                variant="outline" 
                className="hidden sm:inline-flex"
                style={{ 
                  borderColor: buttonBgColor,
                  color: buttonBgColor 
                }}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button 
                style={{ backgroundColor: buttonBgColor }}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;