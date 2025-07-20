import React from 'react';
import * as Sentry from '@sentry/react';

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

// Error fallback component
export const ErrorFallback = ({ error, resetError }: FallbackProps) => (
  <div className="error-container p-4 bg-red-50 border border-red-200 rounded">
    <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
    <p className="mt-2 text-sm text-red-700">The error has been reported to our team.</p>
    <button 
      onClick={resetError}
      className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

// Wrap component with error boundary
export const withErrorBoundary = (Component: React.ComponentType<any>, options = {}) => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    return Component;
  }
  
  return Sentry.withErrorBoundary(Component, {
    fallback: ErrorFallback,
    ...options
  });
};