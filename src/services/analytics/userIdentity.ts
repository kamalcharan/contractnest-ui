import { analyticsService } from './analytics';

const CLIENT_ID_KEY = 'cn_client_id';

/**
 * ContractNest User Identity Manager
 * 
 * This service manages user identification for analytics
 */
export class UserIdentityManager {
  private clientId: string | null = null;
  
  /**
   * Initialize user identity manager
   * Generate or retrieve client ID
   */
  init() {
    // Try to get existing client ID
    this.clientId = localStorage.getItem(CLIENT_ID_KEY);
    
    // If no client ID exists, generate a new one
    if (!this.clientId) {
      this.clientId = this.generateClientId();
      localStorage.setItem(CLIENT_ID_KEY, this.clientId);
    }
    
    return this.clientId;
  }
  
  /**
   * Generate a unique client ID
   */
  private generateClientId() {
    return 'cn_' + 
      Date.now().toString(36) + 
      Math.random().toString(36).substring(2);
  }
  
  /**
   * Get client ID
   */
  getClientId() {
    if (!this.clientId) {
      this.init();
    }
    return this.clientId;
  }
  
  /**
   * Identify authenticated user
   * 
   * @param userId User ID
   * @param userProperties Additional user properties
   */
  identifyUser(userId: string, userProperties: Record<string, any> = {}) {
    // Set user ID for cross-device tracking
    analyticsService.setUserId(userId);
    
    // Set additional user properties
    analyticsService.setUserProperties({
      user_id: userId,
      ...userProperties
    });
  }
  
  /**
   * Clear user identity (on logout)
   */
  clearUserIdentity() {
    analyticsService.setUserId(null);
    analyticsService.setUserProperties({
      user_id: null,
      tenant_id: null,
      workspace_name: null,
      user_role: null,
      subscription_plan: null
    });
  }
  
  /**
   * Update user properties
   * 
   * @param properties User properties to update
   */
  updateUserProperties(properties: Record<string, any>) {
    analyticsService.setUserProperties(properties);
  }
}

// Create and export singleton instance
export const userIdentityManager = new UserIdentityManager();