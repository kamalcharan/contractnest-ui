import { analyticsService } from './analytics';

const CONSENT_KEY = 'cn_analytics_consent';

/**
 * ContractNest Analytics Consent Manager
 * 
 * This service manages user consent for analytics tracking
 */
export class ConsentManager {
  private hasConsented: boolean | null = null;
  
  /**
   * Initialize consent manager
   * Check stored consent and apply it
   */
  init() {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    
    if (storedConsent !== null) {
      this.hasConsented = storedConsent === 'true';
      analyticsService.updateConsent(this.hasConsented);
    } else {
      this.hasConsented = null;
    }
    
    return this.hasConsented;
  }
  
  /**
   * Check if user has given consent
   */
  hasGivenConsent(): boolean {
    if (this.hasConsented === null) {
      this.init();
    }
    return this.hasConsented === true;
  }
  
  /**
   * Check if user has denied consent
   */
  hasDeniedConsent(): boolean {
    if (this.hasConsented === null) {
      this.init();
    }
    return this.hasConsented === false;
  }
  
  /**
   * Check if user has not yet made a choice
   */
  isConsentPending(): boolean {
    if (this.hasConsented === null) {
      this.init();
    }
    return this.hasConsented === null;
  }
  
  /**
   * Give consent for analytics tracking
   */
  giveConsent() {
    this.hasConsented = true;
    localStorage.setItem(CONSENT_KEY, 'true');
    analyticsService.updateConsent(true);
  }
  
  /**
   * Deny consent for analytics tracking
   */
  denyConsent() {
    this.hasConsented = false;
    localStorage.setItem(CONSENT_KEY, 'false');
    analyticsService.updateConsent(false);
  }
  
  /**
   * Clear consent choice
   */
  clearConsent() {
    this.hasConsented = null;
    localStorage.removeItem(CONSENT_KEY);
    analyticsService.updateConsent(false); // Default to denied when clearing
  }
}

// Create and export singleton instance
export const consentManager = new ConsentManager();