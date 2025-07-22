import React from 'react';
import * as Sentry from '@sentry/react';

// Error fallback render function that matches Sentry's expected FallbackRender type
export const ErrorFallback: Sentry.ErrorBoundaryProps['fallback'] = (errorInfo) => {
  const { error, resetError } = errorInfo;
  
  // Safely handle the error (it could be anything)
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  const errorStack = error instanceof Error ? error.stack : String(error);

  return (
    <div className="error-container p-4 bg-red-50 border border-red-200 rounded">
      <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="mt-2 text-sm text-red-700">The error has been reported to our team.</p>
      
      {/* Show error details in development */}
      {import.meta.env.DEV && (
        <details className="mt-3">
          <summary className="text-sm text-red-600 cursor-pointer">Error Details (Development)</summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto max-h-32">
            {errorMessage}
            {errorStack && '\n\n' + errorStack}
          </pre>
        </details>
      )}
      
      <button 
        onClick={resetError}
        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

// Alternative simple fallback
export const SimpleErrorFallback: Sentry.ErrorBoundaryProps['fallback'] = ({ resetError }) => (
  <div className="error-container p-4 bg-red-50 border border-red-200 rounded text-center">
    <h3 className="text-lg font-medium text-red-800">Oops! Something went wrong</h3>
    <p className="mt-2 text-sm text-red-700">We've been notified about this issue.</p>
    <button 
      onClick={resetError}
      className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Reload page
    </button>
  </div>
);

// Wrap component with error boundary
export const withErrorBoundary = (Component: React.ComponentType<any>, options = {}) => {
  // Check if Sentry is configured
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN not configured, skipping error boundary');
    return Component;
  }
  
  return Sentry.withErrorBoundary(Component, {
    fallback: ErrorFallback,
    beforeCapture: (scope) => {
      scope.setTag('errorBoundary', true);
      scope.setLevel('error');
    },
    ...options
  });
};

// Higher-order component for manual error boundary wrapping
export const withErrorBoundaryHOC = <P extends object>(
  Component: React.ComponentType<P>,
  fallbackRender?: Sentry.ErrorBoundaryProps['fallback']
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    if (!import.meta.env.VITE_SENTRY_DSN) {
      return <Component {...props} />;
    }

    return (
      <Sentry.ErrorBoundary fallback={fallbackRender || ErrorFallback}>
        <Component {...props} />
      </Sentry.ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for manual error reporting
export const useErrorHandler = () => {
  const captureError = React.useCallback((error: Error, context?: Record<string, any>) => {
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.withScope((scope) => {
        if (context) {
          Object.keys(context).forEach(key => {
            scope.setExtra(key, context[key]);
          });
        }
        Sentry.captureException(error);
      });
    } else {
      console.error('Error captured:', error, context);
    }
  }, []);

  return { captureError };
};