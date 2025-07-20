// src/services/analytics/index.ts

/**
 * ContractNest Analytics
 * 
 * Centralized analytics module for ContractNest web application
 */

// Import all dependencies at the top
import { analyticsService } from './analytics';
import { consentManager } from './consent';
import { userIdentityManager } from './userIdentity';

// Export analytics service
export { analyticsService };

// Export consent manager
export { consentManager };

// Export user identity manager
export { userIdentityManager };

// Export event registry and types
export {
  ANALYTICS_EVENTS,
  AUTH_EVENTS,
  CONTRACT_EVENTS,
  WORKSPACE_EVENTS,
  USER_EVENTS,
  BILLING_EVENTS,
  UI_EVENTS,
  MARKETING_EVENTS,
  type AnalyticsEventName,
  type AnalyticsEventParams
} from './events';

/**
 * Initialize analytics system
 * 
 * This function should be called at application startup
 */
export function initAnalytics() {
  // No need for require() - we already imported at the top
  
  // Initialize consent manager first
  const hasConsented = consentManager.init();
  
  // Initialize client ID
  userIdentityManager.init();
  
  // Initialize GA4 only if consent is granted or not yet decided
  if (hasConsented !== false) {
    analyticsService.initGA();
  }
  
  return {
    hasConsented,
    clientId: userIdentityManager.getClientId()
  };
}