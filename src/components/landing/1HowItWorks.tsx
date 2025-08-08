// src/components/Landing/HowItWorks.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import eventSchedulingImage from '@/assets/images/event-scheduling.png';


// Define all the color variations upfront to avoid dynamic class generation
const colorVariations = {
  blue: {
    button: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500',
    icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    mobileButton: 'bg-blue-500 text-white',
    mobileHeader: 'bg-blue-100 dark:bg-blue-900/20'
  },
  green: {
    button: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500',
    icon: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    mobileButton: 'bg-green-500 text-white',
    mobileHeader: 'bg-green-100 dark:bg-green-900/20'
  },
  orange: {
    button: 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500',
    icon: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    mobileButton: 'bg-orange-500 text-white',
    mobileHeader: 'bg-orange-100 dark:bg-orange-900/20'
  },
  purple: {
    button: 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500',
    icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    mobileButton: 'bg-purple-500 text-white',
    mobileHeader: 'bg-purple-100 dark:bg-purple-900/20'
  },
  red: {
    button: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500',
    icon: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    mobileButton: 'bg-red-500 text-white',
    mobileHeader: 'bg-red-100 dark:bg-red-900/20'
  }
};

// Pre-render component to avoid re-renders
const StepButton = ({ 
  step, 
  index, 
  isActive, 
  colorVariant, 
  onClick, 
  textColor, 
  secondaryTextColor 
}) => {
  return (
    <button
      className={`flex items-center p-4 rounded-lg text-left transition ${
        isActive ? colorVariant.button : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <div className={`mr-4 p-2 rounded-full ${colorVariant.icon}`}>
        {step.icon}
      </div>
      <div>
        <div className="flex items-center">
          <span className={`font-bold ${textColor} mr-2`}>{index + 1}.</span>
          <h3 className={`font-semibold ${textColor}`}>{step.name}</h3>
        </div>
        {isActive && (
          <p className={`mt-1 text-sm ${secondaryTextColor}`}>
            {step.description}
          </p>
        )}
      </div>
    </button>
  );
};

const HowItWorks: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  // Theme-specific styling
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const secondaryTextColor = theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgColor = theme.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  
  // Steps for the process
  const steps = [
    {
      id: 'initiate',
      name: 'Initiate',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      description: "Start by planning your activity and selecting your targets. ContractNest helps you map out what contracts you need to create.",
      image: "/images/track-initiate.png",
      color: "blue"
    },
    {
      id: 'create',
      name: 'Create Events',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: "Define and schedule events for your contracts with tailored templates. Set up service visits, calibrations, maintenance, and more.",
      image: "/images/event-scheduling.png",
      color: "orange",
      
    },
    {
      id: 'track',
      name: 'Track Payments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Monitor payments, receivables, and financial metrics in real-time. Get insights into your contract revenue and upcoming billing cycles.",
      image: "/images/track-payments.png",
      color: "green"
    },
    {
      id: 'collaborate',
      name: 'Collaborate',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: "Share contracts with partners, team members, and observers. Enable collaboration across boundaries with role-based access control.",
      image: "/images/track-collaboration.png",
      color: "purple"
    },
    {
      id: 'alerts',
      name: 'Stay Informed',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      description: "Receive proactive alerts and notifications about upcoming events, payment deadlines, and compliance requirements.",
      image: "/images/track-alerts.png",
      color: "red"
    }
  ];

  // State for currently selected step
  const [activeStep, setActiveStep] = useState(steps[0].id);
  const [contentKey, setContentKey] = useState(0); // Key to force re-render of content
  const [imageLoaded, setImageLoaded] = useState(false);

  // Find the active step object
  const currentStep = steps.find(step => step.id === activeStep) || steps[0];
  
  // Use effect to handle step changes
  useEffect(() => {
    setContentKey(prevKey => prevKey + 1);
    setImageLoaded(false);
  }, [activeStep]);

  // Steps with precomputed color classes
  const stepsWithColorClasses = steps.map(step => {
    return {
      ...step,
      colorVariant: colorVariations[step.color] || colorVariations.blue
    };
  });

  return (
    <section className={bgColor} id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
            How It Works
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${secondaryTextColor}`}>
            ContractNest streamlines your service contract management in five simple steps
          </p>
        </div>
        
        {/* Desktop view - Side by side */}
        <div className="hidden md:flex gap-10">
          {/* Left - Step navigation */}
          <div className="w-1/3">
            <div className="flex flex-col space-y-1">
              {stepsWithColorClasses.map((step, index) => (
                <StepButton 
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={step.id === activeStep}
                  colorVariant={step.colorVariant}
                  onClick={() => setActiveStep(step.id)}
                  textColor={textColor}
                  secondaryTextColor={secondaryTextColor}
                />
              ))}
            </div>
          </div>
          
          {/* Right - Content display */}
          <div className="w-2/3">
            <div 
              key={contentKey}
              className={`rounded-xl overflow-hidden shadow-lg ${cardBg} border border-gray-200 dark:border-gray-700`}
            >
              {/* App interface mockup */}
              <div className="p-1 bg-blue-500 flex items-center">
                <div className="flex space-x-1.5 ml-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  {!imageLoaded && (
                    <div className="text-gray-400 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Loading image...</span>
                    </div>
                  )}
                  <img 
                    src={currentStep.image}
                    alt={`${currentStep.name} illustration`} 
                    className={`w-full h-auto rounded ${imageLoaded ? 'block' : 'hidden'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      console.log("Image failed to load:", e);
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-screenshot.png';
                    }}
                  />
                </div>
                
                <div className="mt-6">
                  <h3 className={`text-xl font-bold mb-3 ${textColor}`}>{currentStep.name}</h3>
                  <p className={secondaryTextColor}>{currentStep.description}</p>
                  
                  <div className="mt-4 flex justify-between">
                    <div>
                      {activeStep !== steps[0].id && (
                        <button 
                          onClick={() => {
                            const currentIndex = steps.findIndex(s => s.id === activeStep);
                            if (currentIndex > 0) {
                              setActiveStep(steps[currentIndex - 1].id);
                            }
                          }}
                          className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Previous
                        </button>
                      )}
                    </div>
                    <div>
                      {activeStep !== steps[steps.length - 1].id && (
                        <button 
                          onClick={() => {
                            const currentIndex = steps.findIndex(s => s.id === activeStep);
                            if (currentIndex < steps.length - 1) {
                              setActiveStep(steps[currentIndex + 1].id);
                            }
                          }}
                          className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                          Next
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile view - Vertical layout */}
        <div className="md:hidden">
          {/* Step selection pills */}
          <div className="flex overflow-x-auto pb-4 mb-6 space-x-2">
            {stepsWithColorClasses.map((step, index) => {
              const isActive = step.id === activeStep;
              
              return (
                <button
                  key={step.id}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                    isActive ? step.colorVariant.mobileButton : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  {index + 1}. {step.name}
                </button>
              );
            })}
          </div>
          
          {/* Mobile content */}
          <div 
            key={contentKey}
            className={`rounded-xl overflow-hidden shadow-lg ${cardBg} border border-gray-200 dark:border-gray-700`}
          >
            {/* App interface mockup */}
            <div className="p-1 bg-blue-500 flex items-center">
              <div className="flex space-x-1.5 ml-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              </div>
            </div>
            
            <div className="p-4">
              <div className={`p-3 mb-4 rounded-lg ${currentStep.colorVariant?.mobileHeader || 'bg-blue-100 dark:bg-blue-900/20'}`}>
                <div className="flex items-center">
                  <div className={`mr-3 p-2 rounded-full ${currentStep.colorVariant?.icon || 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                    {currentStep.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${textColor}`}>{currentStep.name}</h3>
                  </div>
                </div>
              </div>
              
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mb-4">
                {!imageLoaded && (
                  <div className="text-gray-400 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Loading image...</span>
                  </div>
                )}
                <img 
                  src={currentStep.image}
                  alt={`${currentStep.name} illustration`} 
                  className={`w-full h-auto rounded ${imageLoaded ? 'block' : 'hidden'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    console.log("Image failed to load:", e);
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-screenshot.png';
                  }}
                />
              </div>
              
              <p className={`${secondaryTextColor} mb-4`}>{currentStep.description}</p>
              
              <div className="flex justify-between">
                <div>
                  {activeStep !== steps[0].id && (
                    <button 
                      onClick={() => {
                        const currentIndex = steps.findIndex(s => s.id === activeStep);
                        if (currentIndex > 0) {
                          setActiveStep(steps[currentIndex - 1].id);
                        }
                      }}
                      className="flex items-center text-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                  )}
                </div>
                <div>
                  {activeStep !== steps[steps.length - 1].id && (
                    <button 
                      onClick={() => {
                        const currentIndex = steps.findIndex(s => s.id === activeStep);
                        if (currentIndex < steps.length - 1) {
                          setActiveStep(steps[currentIndex + 1].id);
                        }
                      }}
                      className="flex items-center text-blue-500"
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* "Get Started" CTA */}
        <div className="mt-16 text-center">
          <button
            className="px-8 py-3 text-white font-medium rounded-lg shadow-lg"
            style={{ backgroundColor: currentTheme?.colors?.brand?.primary || '#E53E3E' }}
            onClick={() => {
              document.getElementById('email-signup')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started Now
          </button>
          <p className={`mt-3 ${secondaryTextColor}`}>
            No credit card required • Free early access
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;