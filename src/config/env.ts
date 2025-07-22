// src/config/env.ts
// Environment variable helper that works with both build and TypeScript checking

declare const __VITE_API_URL__: string;
declare const __VITE_SUPABASE_URL__: string;
declare const __VITE_SUPABASE_KEY__: string;
declare const __VITE_GA_MEASUREMENT_ID__: string;
declare const __VITE_SENTRY_DSN__: string;
declare const __VITE_DEBUG_MODE__: string;
declare const __VITE_LOG_API_CALLS__: string;
declare const __VITE_MAINTENANCE_MODE__: string;
declare const __VITE_MAINTENANCE_END_TIME__: string;
declare const __VITE_MAINTENANCE_MESSAGE__: string;
declare const __DEV__: boolean;

// Safe environment variable access
function getEnvVar(key: string): string | undefined {
  try {
    // Try window first (for browser)
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__[key];
    }
    
    // Try process.env (for Node.js environments)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
    
    // Fallback for TypeScript checking
    return undefined;
  } catch {
    return undefined;
  }
}

export const env = {
  VITE_API_URL: getEnvVar('VITE_API_URL') || 'http://localhost:5000',
  VITE_SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL') || '',
  VITE_SUPABASE_KEY: getEnvVar('VITE_SUPABASE_KEY') || '',
  VITE_GA_MEASUREMENT_ID: getEnvVar('VITE_GA_MEASUREMENT_ID') || '',
  VITE_SENTRY_DSN: getEnvVar('VITE_SENTRY_DSN') || '',
  VITE_DEBUG_MODE: getEnvVar('VITE_DEBUG_MODE') || 'false',
  VITE_LOG_API_CALLS: getEnvVar('VITE_LOG_API_CALLS') || 'false',
  VITE_MAINTENANCE_MODE: getEnvVar('VITE_MAINTENANCE_MODE') || 'false',
  VITE_MAINTENANCE_END_TIME: getEnvVar('VITE_MAINTENANCE_END_TIME') || '',
  VITE_MAINTENANCE_MESSAGE: getEnvVar('VITE_MAINTENANCE_MESSAGE') || 'System maintenance in progress',
  DEV: getEnvVar('NODE_ENV') !== 'production'
};