// src/components/Landing/FeatureHighlights.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const FeatureHighlights: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  // Theme-specific styling
  const sectionBg = theme.mode === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const secondaryTextColor = theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  // Key features data
  const features = [
    {
      title: "Digital Contracts",
      description: "Create, manage, and store all your service contracts digitally in one secure place.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Automated Event Scheduling",
      description: "Schedule service events and get automated reminders to ensure on-time delivery.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "SLA Compliance Tracking",
      description: "Monitor service level agreements and ensure compliance with contractual obligations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Seamless Collaboration",
      description: "Collaborate with partners, vendors, and customers within the platform.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Invoice Automation",
      description: "Automatically generate invoices based on contract terms and schedules.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Comprehensive Analytics",
      description: "Gain insights into service performance, financial metrics, and compliance levels.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    }
  ];

  return (
    <section className={`py-20 px-4 md:px-6 lg:px-8 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>Key Features</h2>
          <p className={`text-xl max-w-3xl mx-auto ${secondaryTextColor}`}>
            ContractNest provides powerful tools to streamline your service contract management
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: theme.mode === 'dark' 
                    ? 'rgba(229, 62, 62, 0.1)' 
                    : 'rgba(229, 62, 62, 0.05)'
                }}
              >
                <div className="text-red-500 dark:text-red-400">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className={`text-xl font-bold mb-3 ${textColor}`}>{feature.title}</h3>
              <p className={`${secondaryTextColor}`}>{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Value Proposition Banner */}
        <div 
          className="mt-20 rounded-xl p-8 md:p-12 text-white relative overflow-hidden"
          style={{ 
            backgroundColor: currentTheme?.colors?.brand?.primary || '#E53E3E',
            backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)',
            backgroundSize: '20px 20px'
          }}
        >
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stop Chasing Commitments, Start Building Relationships
            </h3>
            <p className="text-lg mb-6 text-white/90">
              ContractNest handles the complexities of Service Contrat Management so you can focus on what matters most - delivering exceptional service and building stronger business relationships.
            </p>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;