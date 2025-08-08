// src/pages/public/dtreadiness.tsx
import React, { useEffect, useState } from 'react';
import { ReadinessProvider } from '@/components/Leads/ReadinessAssessment/ReadinessContext';
import ReadinessAssessmentMain from '@/components/Leads/ReadinessAssessment';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsService } from '@/services/analytics.service';
import { captureError } from '@/config/sentry.config';

const DTReadinessPage: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Safely access theme with fallback values
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' }; // Provide fallback
  
  // Track page view for analytics and setup
// Track page view for analytics and setup
useEffect(() => {
  let isMounted = true;
  
  const initPage = async () => {
    try {
      console.log("DT Readiness Assessment page mounted");
      
      // Environment check
      const environmentInfo = {
        hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        nodeEnv: import.meta.env.MODE,
        themeMode: theme.mode
      };
      console.log("Environment check:", environmentInfo);
      
      // GA4 tracking - Make sure this is wrapped in a check if component is still mounted
      if (isMounted && window.gtag && process.env.REACT_APP_GA_MEASUREMENT_ID) {
        window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
          page_path: '/public/dtreadiness',
          page_title: 'Digital Transformation Readiness Assessment'
        });
      }
      
      // Analytics tracking - Wrap in a Promise.race with a timeout
      if (isMounted) {
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Analytics tracking timed out')), 3000);
          });
          
          // Race the analytics call with the timeout
          await Promise.race([
            analyticsService.trackWorkspaceEvent('dt_readiness_page_viewed', {
              theme: theme.mode,
              locale: navigator.language,
              referrer: document.referrer || 'direct'
            }),
            timeoutPromise
          ]);
        } catch (analyticsError) {
          console.error('Analytics error:', analyticsError);
        }
      }
      
      // Sentry breadcrumb - Only add if component is still mounted
      if (isMounted && window.Sentry) {
        window.Sentry.addBreadcrumb({
          category: 'navigation',
          message: 'Viewed Digital Transformation Readiness Assessment page',
          level: 'info'
        });
      }
    } catch (error) {
      console.error("Error initializing readiness page:", error);
      if (isMounted) {
        try {
          captureError(error as Error, {
            tags: { component: 'DTReadinessPage', action: 'initialization' }
          });
        } catch (sentryError) {
          console.error("Error logging to Sentry:", sentryError);
        }
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };
  
  initPage();
  
  // Cleanup function
  return () => {
    isMounted = false;
  };
}, [theme.mode]);
  
  if (hasError) {
    return (
      <div className={`p-8 text-center ${theme.mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container mx-auto px-4 py-16">
          <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">We're having trouble loading the assessment</h2>
          <p className="mb-6 max-w-lg mx-auto">
            Please try refreshing the page. If the problem persists, our team has been notified and is working to fix it.
          </p>
        <button 
  onClick={() => window.location.reload()}
  className="px-5 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
  style={{ 
    backgroundColor: themeContext?.currentTheme?.colors?.brand?.primary || '#3b82f6' // fallback to blue-500
  }}
>
  Refresh Page
</button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.mode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className={`mt-4 ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading assessment...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary onError={(error) => {
      console.error("Error caught by boundary:", error);
      try {
        captureError(error, {
          tags: { component: 'DTReadinessPage', action: 'render' }
        });
      } catch (sentryError) {
        console.error("Error logging to Sentry:", sentryError);
      }
      setHasError(true);
    }}>
      <div className={`min-h-screen ${theme.mode === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container mx-auto px-4 py-8">
          <h1 className={`text-3xl font-bold text-center mb-2 ${theme.mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Digital Transformation Readiness Assessment
          </h1>
          <p className={`text-center mb-8 ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Evaluate your organization's readiness for digital transformation across key dimensions
          </p>
          
          <ReadinessProvider>
            <ReadinessAssessmentMain />
          </ReadinessProvider>
          
          <footer className={`text-center text-sm mt-8 ${theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>© {new Date().getFullYear()} DxWithCharan. This assessment provides a high-level overview and should not be considered a comprehensive audit.</p>
            <p className="mt-2">For a detailed assessment and personalized recommendations, schedule a consultation with our team.</p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DTReadinessPage;