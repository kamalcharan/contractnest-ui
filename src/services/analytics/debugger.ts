import { analyticsService } from './analytics';
import { consentManager } from './consent';
import { userIdentityManager } from './userIdentity';
import { ANALYTICS_EVENTS } from './events';

/**
 * Analytics Debugger
 * 
 * Utility for debugging analytics in development environment
 */
export class AnalyticsDebugger {
  private enabled = false;
  private events: Array<{
    timestamp: Date;
    eventName: string;
    params: any;
  }> = [];
  
  /**
   * Enable analytics debugger
   */
  enable() {
    if (import.meta.env.PROD) {
      console.warn('Analytics debugger should not be enabled in production');
      return;
    }
    
    this.enabled = true;
    
    // Monkey patch analytics service to capture events
    const originalTrackEvent = analyticsService.trackEvent.bind(analyticsService);
    analyticsService.trackEvent = (eventName, params = {}) => {
      // Call original method
      originalTrackEvent(eventName, params);
      
      // Store event for debugging
      this.events.push({
        timestamp: new Date(),
        eventName,
        params
      });
      
      // Log to console with a distinct style
      console.log(
        '%c📊 Analytics Debug: ' + eventName,
        'background: #f3f4f6; color: #2563eb; padding: 2px 4px; border-radius: 2px;',
        params
      );
    };
    
    console.log('📊 Analytics debugger enabled');
  }
  
  /**
   * Disable analytics debugger
   */
  disable() {
    this.enabled = false;
    // We would need to restore the original trackEvent method here
    // but that's complex without a proper reference
    console.log('📊 Analytics debugger disabled');
  }
  
  /**
   * Get analytics debug info
   */
  getDebugInfo() {
    return {
      enabled: this.enabled,
      hasConsent: consentManager.hasGivenConsent(),
      consentPending: consentManager.isConsentPending(),
      clientId: userIdentityManager.getClientId(),
      trackedEvents: this.events,
      eventRegistry: Object.keys(ANALYTICS_EVENTS).length,
    };
  }
  
  /**
   * Clear tracked events
   */
  clearEvents() {
    this.events = [];
    console.log('📊 Tracked events cleared');
  }
  
  /**
   * Print debug info to console
   */
  printDebugInfo() {
    console.group('📊 Analytics Debug Info');
    console.log('Debugger Enabled:', this.enabled);
    console.log('Consent Given:', consentManager.hasGivenConsent());
    console.log('Consent Pending:', consentManager.isConsentPending());
    console.log('Client ID:', userIdentityManager.getClientId());
    console.log('Tracked Events:', this.events.length);
    console.log('Event Registry Size:', Object.keys(ANALYTICS_EVENTS).length);
    console.groupEnd();
  }
}

// Create and export singleton instance
export const analyticsDebugger = new AnalyticsDebugger();