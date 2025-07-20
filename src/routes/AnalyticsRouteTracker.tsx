import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analytics';

/**
 * Analytics Route Tracker Component
 * 
 * This component tracks page views as the user navigates through the application.
 * It should be included in your main router configuration to track all route changes.
 */
const AnalyticsRouteTracker: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view on route change
    analyticsService.trackPageView(
      location.pathname + location.search,
      document.title
    );
  }, [location]);
  
  // This component doesn't render anything
  return null;
};

export default AnalyticsRouteTracker;