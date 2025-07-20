// src/hooks/useIdleTimer.ts
import { useEffect, useCallback } from 'react';

export const useIdleTimer = (
  onIdle: () => void,
  timeout: number = 5 * 60 * 1000, // 5 minutes default
  enabled: boolean = true
) => {
  const reset = useCallback(() => {
    // This is handled in AuthContext's resetIdleTimer
  }, []);

  useEffect(() => {
    if (!enabled) return;
    
    // Activity detection is already handled in AuthContext
    // This hook is just for organization if needed
  }, [enabled, onIdle, timeout]);

  return { reset };
};