// src/services/sessionService.ts
import { v4 as uuidv4 } from 'uuid';

export const sessionService = {
  initializeSession(): string {
    let sessionId = sessionStorage.getItem('session_id');
    
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('session_id', sessionId);
      
      // Set session creation timestamp
      sessionStorage.setItem('session_created_at', Date.now().toString());
      
      // Also store in localStorage for cross-tab detection
      const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
      if (userId) {
        localStorage.setItem(`active_session_${userId}`, sessionId);
        // Store session timestamp
        localStorage.setItem(`session_timestamp_${userId}`, Date.now().toString());
      }
    }
    
    return sessionId;
  },

  clearSession(): void {
    const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
    
    // Clear session storage items
    sessionStorage.removeItem('session_id');
    sessionStorage.removeItem('session_conflict');
    sessionStorage.removeItem('session_created_at');
    
    if (userId) {
      // Clear active session
      localStorage.removeItem(`active_session_${userId}`);
      // Clear session timestamp
      localStorage.removeItem(`session_timestamp_${userId}`);
      // Clear any lingering conflict flags
      localStorage.removeItem(`session_conflict_${userId}`);
    }
  },

  checkForConflict(userId: string): boolean {
    const currentSessionId = sessionStorage.getItem('session_id');
    const activeSessionId = localStorage.getItem(`active_session_${userId}`);
    
    // If no current session or no active session, no conflict
    if (!currentSessionId || !activeSessionId) {
      return false;
    }
    
    // Check if sessions match
    return activeSessionId !== currentSessionId;
  },
  
  // Get session age in milliseconds
  getSessionAge(): number {
    const createdAt = sessionStorage.getItem('session_created_at');
    if (!createdAt) return 0;
    
    return Date.now() - parseInt(createdAt, 10);
  },
  
  // Check if session is in grace period (first 2 seconds after creation)
  isInGracePeriod(): boolean {
    const age = this.getSessionAge();
    return age < 2000; // 2 seconds grace period
  },
  
  // Force take over session
  forceSessionTakeover(userId: string): void {
    const sessionId = sessionStorage.getItem('session_id');
    if (sessionId && userId) {
      localStorage.setItem(`active_session_${userId}`, sessionId);
      localStorage.setItem(`session_timestamp_${userId}`, Date.now().toString());
      // Clear conflict flag
      sessionStorage.removeItem('session_conflict');
    }
  }
};