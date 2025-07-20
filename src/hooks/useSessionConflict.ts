// src/hooks/useSessionConflict.ts
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionService } from '../services/sessionService';

export const useSessionConflict = () => {
  const [hasSessionConflict, setHasSessionConflict] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    if (!user || !isAuthenticated) {
      setHasSessionConflict(false);
      return;
    }

    const sessionId = sessionStorage.getItem('session_id');
    const storageKey = `active_session_${user.id}`;
    
    // Function to check for conflicts
    const checkForConflict = () => {
      // Skip check if in grace period or transitioning
      if (sessionService.isInGracePeriod() || isTransitioningRef.current) {
        return false;
      }
      
      if (!sessionId) return false;
      
      const activeSessionId = localStorage.getItem(storageKey);
      
      // No active session stored - we're the first/only session
      if (!activeSessionId) {
        localStorage.setItem(storageKey, sessionId);
        localStorage.setItem(`session_timestamp_${user.id}`, Date.now().toString());
        setHasSessionConflict(false);
        return false;
      }
      
      // Check if there's a different active session
      if (activeSessionId !== sessionId) {
        // Check if the other session is stale (older than 1 hour)
        const timestampKey = `session_timestamp_${user.id}`;
        const timestamp = localStorage.getItem(timestampKey);
        
        if (timestamp) {
          const age = Date.now() - parseInt(timestamp, 10);
          // If the other session is older than 1 hour, take over automatically
          if (age > 3600000) { // 1 hour
            localStorage.setItem(storageKey, sessionId);
            localStorage.setItem(timestampKey, Date.now().toString());
            setHasSessionConflict(false);
            return false;
          }
        }
        
        console.log('Session conflict detected!', { activeSessionId, currentSessionId: sessionId });
        setHasSessionConflict(true);
        return true;
      }
      
      // We are the active session
      setHasSessionConflict(false);
      return false;
    };

    // Initial check with delay to avoid false positives during login
    const initialCheckTimeout = setTimeout(() => {
      checkForConflict();
    }, 1000); // 1 second delay for initial check

    // Listen for storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        // If the storage was cleared, we can take over
        if (!e.newValue) {
          localStorage.setItem(storageKey, sessionId);
          localStorage.setItem(`session_timestamp_${user.id}`, Date.now().toString());
          setHasSessionConflict(false);
        } 
        // If a different session was set
        else if (e.newValue !== sessionId) {
          // Check if we're in grace period
          if (!sessionService.isInGracePeriod()) {
            console.log('Session conflict detected via storage event!');
            setHasSessionConflict(true);
          }
        }
        // If our session was confirmed
        else if (e.newValue === sessionId) {
          setHasSessionConflict(false);
        }
      }
    };

    // Listen for broadcast channel messages
    let channel: BroadcastChannel | null = null;
    if (window.BroadcastChannel) {
      channel = new BroadcastChannel('session_conflict');
      channel.onmessage = (event) => {
        if (event.data.userId === user.id) {
          if (event.data.action === 'logout') {
            // Other session logged out
            isTransitioningRef.current = true;
            setTimeout(() => {
              isTransitioningRef.current = false;
              // We can take over after a brief delay
              if (sessionId) {
                localStorage.setItem(storageKey, sessionId);
                localStorage.setItem(`session_timestamp_${user.id}`, Date.now().toString());
                setHasSessionConflict(false);
              }
            }, 500);
          } else if (event.data.action === 'login' && event.data.sessionId !== sessionId) {
            // New login detected
            isTransitioningRef.current = true;
            setTimeout(() => {
              isTransitioningRef.current = false;
              if (!sessionService.isInGracePeriod()) {
                console.log('Session conflict detected via broadcast!');
                setHasSessionConflict(true);
              }
            }, 1000);
          } else if (event.data.action === 'takeover' && event.data.sessionId !== sessionId) {
            // Another session is taking over
            setHasSessionConflict(true);
          }
        }
      };
    }

    window.addEventListener('storage', handleStorageChange);

    // Check periodically but less frequently
    checkIntervalRef.current = setInterval(() => {
      if (!isTransitioningRef.current) {
        checkForConflict();
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearTimeout(initialCheckTimeout);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
    };
  }, [user, isAuthenticated]);

  // Function to clear conflict and force takeover
  const clearSessionConflict = () => {
    setHasSessionConflict(false);
    if (user) {
      sessionService.forceSessionTakeover(user.id);
    }
  };

  return { hasSessionConflict, clearSessionConflict };
};