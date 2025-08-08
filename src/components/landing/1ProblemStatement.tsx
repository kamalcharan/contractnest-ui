// src/components/Landing/ProblemStatement.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const ProblemStatement: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  // Card style based on theme
  const cardBg = theme.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardHover = theme.mode === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white';
  const cardBorder = theme.mode === 'dark' ? 'border-gray-800' : 'border-gray-200';
  
  // Statistics from your presentation
  const statistics = [
    {
      value: '65%',
      description: 'of service contracts are not digitized',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      value: '90%',
      description: 'of beneficiaries don\'t remember contract contents',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      value: '50%+',
      description: 'of event SLAs are beyond time',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      value: '2 hrs',
      description: 'spent daily on event planning & tracking receivables',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      value: '700B+',
      description: 'worth of service contracts created annually',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      value: '15%',
      description: 'year-over-year growth in service contracts market',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];
  
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8" style={{
      backgroundColor: theme.mode === 'dark' ? '#0A0A0A' : '#FAFAFA'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Problem</h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Service Contracts and Plans are extremely vital, but managing them effectively remains a challenge for most businesses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statistics.map((stat, index) => (
            <div 
              key={index}
              className={`p-6 rounded-lg border ${cardBg} ${cardHover} ${cardBorder} transition-colors duration-300 flex items-start`}
            >
              <div className="mr-4 text-red-500 dark:text-red-400">
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-bold mb-2" style={{ 
                  color: currentTheme?.colors?.brand?.primary 
                }}>
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Why Digitize Your Contracts Now?</h3>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">Digital Transformation</span>
            <span className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">Regulatory Compliance</span>
            <span className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">Manufacturing Re-alignment</span>
            <span className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">Reduced Revenue Cycle</span>
            <span className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">Customer Engagement</span>
            <span className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">ISP Growth</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;