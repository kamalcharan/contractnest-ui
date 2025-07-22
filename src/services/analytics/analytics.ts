import { AnalyticsEventName, AnalyticsEventParams } from './events';
import { env } from '../../config/env';

// Define the type for window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * ContractNest Analytics Service
 * 
 * This service provides a centralized way to track analytics events
 * across the ContractNest application.
 */
export class AnalyticsService {
  private initialized = false;
  private measurementId: string | undefined;
  private debug = false;
  
  /**
   * Initialize Google Analytics
   */
  initGA() {
    if (this.initialized) return;
    
    this.measurementId = env.VITE_GA_MEASUREMENT_ID;
    if (!this.measurementId) {
      console.warn('GA4 Measurement ID not found. Analytics will not be initialized.');
      return;
    }

    this.debug = env.DEV;
    
    // Add Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    script.async = true;
    document.head.appendChild(script);
    
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      send_page_view: false // We'll handle page views manually for SPA
    });
    
    this.initialized = true;

    if (this.debug) {
      console.log('📊 GA4 initialized with measurement ID:', this.measurementId);
    }
  }
  
  /**
   * Track any analytics event using the event registry
   * 
   * @param eventName The name of the event from ANALYTICS_EVENTS
   * @param params Optional parameters for the event
   */
  trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}) {
    if (!window.gtag || !this.initialized) {
      if (this.debug) {
        console.log(`📊 [DEBUG] Event would be tracked: ${eventName}`, params);
      }
      return;
    }
    
    window.gtag('event', eventName, {
      ...params,
      send_to: this.measurementId
    });
    
    // Log events in development for debugging
    if (this.debug) {
      console.log(`📊 Event tracked: ${eventName}`, params);
    }
  }
  
  /**
   * Track page view
   * 
   * @param pagePath Path of the page
   * @param pageTitle Optional title of the page
   */
  trackPageView(pagePath: string, pageTitle?: string) {
    this.trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
    });
  }
  
  /**
   * Set user properties
   * 
   * @param properties User properties to set
   */
  setUserProperties(properties: {
    tenant_id?: string;
    user_id?: string;
    workspace_name?: string;
    user_role?: string;
    subscription_plan?: string;
    [key: string]: any;
  }) {
    if (!window.gtag || !this.initialized) return;
    
    window.gtag('set', 'user_properties', properties);
    
    if (this.debug) {
      console.log('📊 User properties set:', properties);
    }
  }
  
  /**
   * Set user ID for cross-device tracking
   * 
   * @param userId The user's ID
   */
  setUserId(userId: string | null) {
    if (!window.gtag || !this.initialized) return;
    
    if (userId) {
      window.gtag('config', this.measurementId, {
        user_id: userId
      });
      
      if (this.debug) {
        console.log('📊 User ID set:', userId);
      }
    } else {
      // Clear user ID
      window.gtag('config', this.measurementId, {
        user_id: undefined
      });
      
      if (this.debug) {
        console.log('📊 User ID cleared');
      }
    }
  }
  
  /**
   * Configure consent for GA4
   * 
   * @param consented Whether the user has consented to analytics
   */
  updateConsent(consented: boolean) {
    if (!window.gtag || !this.initialized) return;
    
    window.gtag('consent', 'update', {
      'analytics_storage': consented ? 'granted' : 'denied',
      'ad_storage': consented ? 'granted' : 'denied',
    });
    
    if (this.debug) {
      console.log('📊 Consent updated:', consented ? 'granted' : 'denied');
    }
  }
}

// Create and export singleton instance
export const analyticsService = new AnalyticsService();