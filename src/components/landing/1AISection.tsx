// src/components/Landing/AISection.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const AISection: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  // Theme-specific styling
  const sectionBg = theme.mode === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const cardBg = theme.mode === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme.mode === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const secondaryTextColor = theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  // AI capabilities
  const aiCapabilities = [
    {
      title: "Smart Scheduling",
      description: "AI automatically schedules service events based on contract terms, equipment needs, and resource availability.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Proactive Alerts",
      description: "Get intelligent notifications about upcoming commitments, potential SLA breaches, and maintenance requirements.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: "Compliance Monitoring",
      description: "AI continuously monitors compliance with contract terms and regulatory requirements, flagging potential issues.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Payment Automation",
      description: "Streamline invoicing and payment tracking with intelligent automation based on contract milestones.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Intelligent Insights",
      description: "Gain data-driven recommendations to optimize service delivery, resource allocation, and contract terms.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: "Document Analysis",
      description: "Extract key information from contract documents automatically, reducing manual data entry.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <section className={`py-20 px-4 md:px-6 lg:px-8 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - AI visualization */}
          <div className="relative">
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6 md:p-8 shadow-lg`}>
              {/* AI Brain visualization - placeholder */}
              <div className="aspect-square relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 animate-pulse"></div>
                  <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-red-500/30 to-blue-500/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-red-500/40 to-blue-500/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                
                {/* Connection lines */}
                <div className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={theme.mode === 'dark' ? '#F56565' : '#E53E3E'} />
                        <stop offset="100%" stopColor={theme.mode === 'dark' ? '#3182CE' : '#2B6CB0'} />
                      </linearGradient>
                    </defs>
                    
                    {/* Animated pulsing circles representing data flow */}
                    <circle className="animate-pulse" cx="100" cy="100" r="60" stroke="url(#line-gradient)" strokeWidth="0.5" fill="none" />
                    <circle className="animate-pulse" cx="100" cy="100" r="80" stroke="url(#line-gradient)" strokeWidth="0.5" fill="none" style={{ animationDelay: '0.7s' }} />
                    <circle className="animate-pulse" cx="100" cy="100" r="40" stroke="url(#line-gradient)" strokeWidth="0.5" fill="none" style={{ animationDelay: '1.4s' }} />
                    
                    {/* Neural network-like connections */}
                    <line x1="100" y1="20" x2="180" y2="80" stroke="url(#line-gradient)" strokeWidth="0.5" />
                    <line x1="100" y1="20" x2="20" y2="80" stroke="url(#line-gradient)" strokeWidth="0.5" />
                    <line x1="20" y1="80" x2="100" y2="180" stroke="url(#line-gradient)" strokeWidth="0.5" />
                    <line x1="180" y1="80" x2="100" y2="180" stroke="url(#line-gradient)" strokeWidth="0.5" />
                    <line x1="100" y1="180" x2="20" y2="120" stroke="url(#line-gradient)" strokeWidth="0.5" />
                    <line x1="100" y1="180" x2="180" y2="120" stroke="url(#line-gradient)" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <div 
                  className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-3"
                  style={{ 
                    backgroundColor: theme.mode === 'dark' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(229, 62, 62, 0.05)',
                    color: currentTheme?.colors?.brand?.primary || '#E53E3E'
                  }}
                >
                  COMING SOON
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>ContractNest AI</h3>
                <p className={secondaryTextColor}>
                  Our intelligent system learns from your contract patterns to provide proactive recommendations and automate routine tasks.
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-red-500/10 z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-blue-500/10 z-0"></div>
          </div>
          
          {/* Right side - AI capabilities */}
          <div>
            <div className="mb-8">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>AI-Powered Automation</h2>
              <p className={`text-lg ${secondaryTextColor}`}>
                ContractNest leverages artificial intelligence to transform how you manage service contracts, enabling predictive insights and automating routine tasks.
              </p>
            </div>
            
            <div className="space-y-6">
              {aiCapabilities.map((capability, index) => (
                <div key={index} className="flex items-start">
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                    style={{ 
                      backgroundColor: theme.mode === 'dark' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(229, 62, 62, 0.05)',
                      color: currentTheme?.colors?.brand?.primary || '#E53E3E'
                    }}
                  >
                    {capability.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${textColor}`}>{capability.title}</h3>
                    <p className={`${secondaryTextColor}`}>{capability.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;