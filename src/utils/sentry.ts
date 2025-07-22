// src/utils/sentry.ts
import * as Sentry from '@sentry/browser';

// Initialize Sentry
export const initSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN not found. Error tracking disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
      tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    });
    console.log('Sentry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

// Create a simplified version that doesn't rely on configureScope
export const setUserContext = (user: any, tenant: any, isLive: boolean) => {
  // Skip if Sentry isn't available
  if (!import.meta.env.VITE_SENTRY_DSN || !Sentry.setUser) {
    return;
  }

  try {
    // Set user context if available
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: `${user.first_name} ${user.last_name}`,
      });
    } else {
      Sentry.setUser(null);
    }

    // Set tenant tags if available
    if (tenant) {
      Sentry.setTag('tenant_id', tenant.id);
      Sentry.setTag('workspace_name', tenant.name);
    }
  } catch (error) {
    console.error('Error setting Sentry context:', error);
  }
};

// Simplified error capture
export const captureException = (error: any, context: Record<string, any> = {}) => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.error('Error:', error);
    console.error('Context:', context);
    return;
  }

  try {
    // Add context as tags/extras
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        Sentry.setExtra(key, String(value));
      });
    }
    
    Sentry.captureException(error);
  } catch (captureError) {
    console.error('Failed to capture exception in Sentry:', captureError);
    console.error('Original error:', error);
  }
};