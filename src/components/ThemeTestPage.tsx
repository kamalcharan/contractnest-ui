// src/components/ThemeTestPage.tsx
import React from 'react';
import Navbar from './layout/Navbar';
import ThemeSwitcher from './common/ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';

const ThemeTestPage: React.FC = () => {
  const { currentTheme, isDarkMode } = useTheme();

  // Sample form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted!');
  };

  return (
    <div className="min-h-screen bg-utility-primaryBackground text-utility-primaryText">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Theme Switcher Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h2 className="text-2xl font-bold mb-4">Theme Settings</h2>
              <ThemeSwitcher />
              
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Current Theme</h3>
                <p>Name: <span className="font-medium">{currentTheme.name}</span></p>
                <p>ID: <span className="font-medium">{currentTheme.id}</span></p>
                <p>Mode: <span className="font-medium">{isDarkMode ? 'Dark' : 'Light'}</span></p>
              </div>
              
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">Color Palette</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Brand Colors</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-brand-primary"></div>
                        <span className="text-xs mt-1">Primary</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-brand-secondary"></div>
                        <span className="text-xs mt-1">Secondary</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-brand-tertiary"></div>
                        <span className="text-xs mt-1">Tertiary</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-brand-alternate"></div>
                        <span className="text-xs mt-1">Alternate</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Semantic Colors</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-semantic-success"></div>
                        <span className="text-xs mt-1">Success</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-semantic-error"></div>
                        <span className="text-xs mt-1">Error</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-semantic-warning"></div>
                        <span className="text-xs mt-1">Warning</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-semantic-info"></div>
                        <span className="text-xs mt-1">Info</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* UI Components Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">UI Components</h2>
            
            {/* Buttons */}
            <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Buttons</h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90">
                    Primary Button
                  </button>
                  <button className="px-4 py-2 bg-brand-secondary text-white rounded-md hover:bg-brand-secondary/90">
                    Secondary Button
                  </button>
                  <button className="px-4 py-2 bg-brand-tertiary text-white rounded-md hover:bg-brand-tertiary/90">
                    Tertiary Button
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 border border-brand-primary text-brand-primary rounded-md hover:bg-brand-primary/10">
                    Outlined Primary
                  </button>
                  <button className="px-4 py-2 border border-brand-secondary text-brand-secondary rounded-md hover:bg-brand-secondary/10">
                    Outlined Secondary
                  </button>
                  <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
                    Disabled Button
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 bg-semantic-success text-white rounded-md hover:bg-semantic-success/90">
                    Success
                  </button>
                  <button className="px-4 py-2 bg-semantic-error text-white rounded-md hover:bg-semantic-error/90">
                    Error
                  </button>
                  <button className="px-4 py-2 bg-semantic-warning text-white rounded-md hover:bg-semantic-warning/90">
                    Warning
                  </button>
                  <button className="px-4 py-2 bg-semantic-info text-white rounded-md hover:bg-semantic-info/90">
                    Info
                  </button>
                </div>
              </div>
            </section>
            
            {/* Cards */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Cards</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-brand-primary">
                  <h4 className="text-lg font-medium mb-2">Primary Card</h4>
                  <p className="text-utility-secondaryText">
                    This card has a primary border accent at the top.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90">
                    Action
                  </button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-brand-secondary">
                  <h4 className="text-lg font-medium mb-2">Secondary Card</h4>
                  <p className="text-utility-secondaryText">
                    This card has a secondary border accent at the top.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-brand-secondary text-white rounded-md hover:bg-brand-secondary/90">
                    Action
                  </button>
                </div>
                
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-medium mb-2">Information Card</h4>
                  <p className="text-utility-secondaryText mb-4">
                    This is a standard card with some information about ContractNest.
                  </p>
                  <div className="bg-accent-accent1 p-4 rounded-md mb-4">
                    <p className="text-sm">ContractNest helps you manage your service contracts, appointments, and commitments easily.</p>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-utility-primaryText rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 mr-2">
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Form Elements */}
            <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Form Elements</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-utility-primaryText">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-utility-primaryText">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-utility-primaryText">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-utility-primaryText">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="agree"
                      name="agree"
                      type="radio"
                      className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="agree" className="ml-2 block text-sm text-utility-primaryText">
                      I agree to the terms
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </section>
            
            {/* Alert Messages */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Alerts</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-semantic-success/10 border border-semantic-success">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-semantic-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-semantic-success">Success alert</h3>
                      <div className="mt-2 text-sm text-semantic-success">
                        <p>Your contract has been successfully created.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-semantic-error/10 border border-semantic-error">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-semantic-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-semantic-error">Error alert</h3>
                      <div className="mt-2 text-sm text-semantic-error">
                        <p>There was an error processing your request.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-semantic-warning/10 border border-semantic-warning">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-semantic-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-semantic-warning">Warning alert</h3>
                      <div className="mt-2 text-sm text-semantic-warning">
                        <p>Your subscription will expire in 7 days.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-semantic-info/10 border border-semantic-info">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-semantic-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-semantic-info">Information alert</h3>
                      <div className="mt-2 text-sm text-semantic-info">
                        <p>A new version of ContractNest is available.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThemeTestPage;