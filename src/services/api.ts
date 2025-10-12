//src/services/api.ts - FIXED with Direct import.meta.env Usage

import axios from 'axios';

// Use Vite's import.meta.env directly for build-time injection
const API_URL = import.meta.env.VITE_API_URL || 'https://contractnest-api-production.up.railway.app';

// Debug logging to see what's happening
console.log('🔍 API Configuration:', {
  'import.meta.env.VITE_API_URL': import.meta.env.VITE_API_URL,
  'Final API_URL': API_URL,
  'Is using fallback': !import.meta.env.VITE_API_URL
});

// Debug logging (only in development when enabled)
if (import.meta.env.VITE_DEBUG_MODE === 'true' && import.meta.env.VITE_LOG_API_CALLS === 'true') {
  console.log(`[API] Configured with base URL: ${API_URL}`);
}

// ===== NEW: API Health Detection Constants =====
const API_HEALTH_CHECK_ENABLED = import.meta.env.VITE_ENABLE_API_HEALTH_CHECK === 'true';
const API_DOWN_SESSION_KEY = 'api_server_down_detected';
const API_DOWN_REDIRECT_KEY = 'api_down_redirect_done';

console.log('🏥 API Health Check Status:', {
  enabled: API_HEALTH_CHECK_ENABLED,
  env_var: import.meta.env.VITE_ENABLE_API_HEALTH_CHECK
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// FIXED: Helper function to get current environment from storage
const getCurrentEnvironment = (): 'live' | 'test' => {
  // Check localStorage for is_live_environment (matches AuthContext storage key)
  const isLive = localStorage.getItem('is_live_environment');
  
  // Default to 'live' if not set, or if set to 'true'
  if (isLive === null || isLive === 'true') {
    return 'live';
  }
  
  return 'test';
};

// ===== NEW: API Health Detection Helper Functions =====
const isApiServerDown = (error: any): boolean => {
  // Check if it's a network error indicating server is completely unreachable
  return (
    !error.response && 
    (error.message === 'Network Error' || 
     error.code === 'ERR_NETWORK' || 
     error.code === 'ECONNABORTED' ||
     error.message?.includes('Network') ||
     error.message?.includes('fetch'))
  );
};

const handleApiServerDown = (error: any) => {
  // Mark API as down in session
  sessionStorage.setItem(API_DOWN_SESSION_KEY, 'true');
  sessionStorage.setItem(API_DOWN_REDIRECT_KEY, 'true');
  
  // Store timestamp and error details for debugging
  sessionStorage.setItem('api_down_timestamp', new Date().toISOString());
  sessionStorage.setItem('api_down_error', JSON.stringify({
    message: error.message,
    code: error.code,
    url: error.config?.url
  }));
  
  console.log('🚨 API Server Down detected - redirecting to API down page');
  
  // Store the current location so we can return there when API recovers
  const currentPath = window.location.pathname + window.location.search;
  if (currentPath !== '/misc/api-server-down') {
    sessionStorage.setItem('api_down_return_path', currentPath);
  }
  
  // Redirect to API down page
  window.location.href = '/misc/api-server-down';
};

const shouldRedirectToApiDown = (): boolean => {
  // Don't redirect if feature is disabled
  if (!API_HEALTH_CHECK_ENABLED) {
    return false;
  }
  
  // Don't redirect if we've already redirected
  if (sessionStorage.getItem(API_DOWN_REDIRECT_KEY) === 'true') {
    return false;
  }
  
  // Don't redirect if we're already on the API down page
  if (window.location.pathname === '/misc/api-server-down') {
    return false;
  }
  
  return true;
};

// Request interceptor to add auth token, tenant ID, session ID, and ENVIRONMENT HEADER
api.interceptors.request.use(
  (config) => {
    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      '/api/users/invitations/validate',
      '/api/users/invitations/accept',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/register-with-invitation',
      '/api/auth/reset-password',
      '/api/system/health',
      '/api/system/maintenance/status',
      '/health'  // Add this for Railway health check
    ];
    
    // Check if current request is to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    // Debug logging for API calls
    if (import.meta.env.VITE_DEBUG_MODE === 'true' && import.meta.env.VITE_LOG_API_CALLS === 'true') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        isPublicEndpoint,
        headers: config.headers
      });
    }
    
    // Only add auth headers for non-public endpoints
    if (!isPublicEndpoint) {
      // Get auth token from storage (check both localStorage and sessionStorage)
      const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      // Get tenant ID from storage
      const tenantId = localStorage.getItem('tenant_id') || sessionStorage.getItem('tenant_id');
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
      }

      // Add session ID for tracking (only from sessionStorage)
      const sessionId = sessionStorage.getItem('session_id');
      if (sessionId) {
        config.headers['x-session-id'] = sessionId;
      }

      // FIXED: Add environment header for live/test data separation
      const currentEnvironment = getCurrentEnvironment();
      config.headers['x-environment'] = currentEnvironment;
      
      // Debug log environment header
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.log(`[API] Setting environment header: ${currentEnvironment}`);
      }
    }

    return config;
  },
  (error) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.error('[API] Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle maintenance mode, session conflicts, API down, and errors
api.interceptors.response.use(
  (response) => {
    // Debug logging for successful responses
    if (import.meta.env.VITE_DEBUG_MODE === 'true' && import.meta.env.VITE_LOG_API_CALLS === 'true') {
      console.log(`[API] Response from ${response.config.url}:`, {
        status: response.status,
        data: response.data,
        environment: response.config.headers['x-environment']
      });
    }
    
    // ===== NEW: Clear API down flags on successful response =====
    if (API_HEALTH_CHECK_ENABLED) {
      // If we get a successful response, clear any API down flags
      const wasDown = sessionStorage.getItem(API_DOWN_SESSION_KEY) === 'true';
      if (wasDown) {
        console.log('🎉 API Server recovered - clearing down flags');
      }
      
      sessionStorage.removeItem(API_DOWN_SESSION_KEY);
      sessionStorage.removeItem(API_DOWN_REDIRECT_KEY);
      sessionStorage.removeItem('api_down_timestamp');
      sessionStorage.removeItem('api_down_error');
    }
    
    // Check for maintenance mode header
    if (response.headers['x-maintenance-mode'] === 'true') {
      // Store maintenance info if provided
      const maintenanceInfo = {
        isInMaintenance: true,
        estimatedEndTime: response.headers['x-maintenance-end-time'] || import.meta.env.VITE_MAINTENANCE_END_TIME || null,
        message: response.headers['x-maintenance-message'] || import.meta.env.VITE_MAINTENANCE_MESSAGE || 'System maintenance in progress'
      };
      sessionStorage.setItem('maintenance_info', JSON.stringify(maintenanceInfo));
      
      // Redirect to maintenance page
      window.location.href = '/misc/maintenance';
      return Promise.reject(new Error('System is in maintenance mode'));
    }
    
    // Check for session conflict header
    if (response.headers['x-session-conflict'] === 'true') {
      // Store session conflict info
      sessionStorage.setItem('session_conflict', 'true');
      
      // Redirect to session conflict page
      window.location.href = '/misc/session-conflict';
      return Promise.reject(new Error('Session conflict detected'));
    }
    
    return response;
  },
  (error) => {
    // Debug logging for errors
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.error('[API] Response error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
        environment: error.config?.headers?.['x-environment']
      });
    }
    
    // ===== NEW: API Server Down Detection (BEFORE existing logic) =====
    if (API_HEALTH_CHECK_ENABLED && isApiServerDown(error) && shouldRedirectToApiDown()) {
      handleApiServerDown(error);
      return Promise.reject(error);
    }
    
    // ===== EXISTING ERROR HANDLING (UNCHANGED) =====
    
    // Handle network errors FIRST - UPDATED MESSAGE
    if (!error.response && (error.message === 'Network Error' || error.code === 'ERR_NETWORK')) {
      // Don't redirect for network errors during auth initialization
      const isAuthPath = error.config?.url?.includes('/auth/user') || 
                        error.config?.url?.includes('/tenants') ||
                        error.config?.url?.includes('/auth/login') ||
                        error.config?.url?.includes('/auth/register');
      
      if (isAuthPath) {
        // During auth-related calls, just reject without redirect
        return Promise.reject(error);
      }
      
      // Only redirect to generic error page if NOT using API health check
      if (!API_HEALTH_CHECK_ENABLED) {
        // UPDATED: Better error handling for server unavailable
        // Store server error info
        sessionStorage.setItem('server_error', JSON.stringify({
          type: 'server_unavailable',
          message: 'Server is currently unavailable. Please contact system administrator.',
          timestamp: new Date().toISOString()
        }));
        
        // For other requests, redirect to custom error page
        window.location.href = '/misc/error';
      }
      
      return Promise.reject(error);
    }
    
    // Handle 503 Service Unavailable (maintenance mode)
    if (error.response?.status === 503) {
      // Check if we're in maintenance mode from env
      const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
      
      const maintenanceInfo = {
        isInMaintenance: true,
        estimatedEndTime: error.response.headers['x-maintenance-end-time'] || 
                          import.meta.env.VITE_MAINTENANCE_END_TIME || null,
        message: error.response.data?.message || 
                import.meta.env.VITE_MAINTENANCE_MESSAGE || 
                'System maintenance in progress'
      };
      sessionStorage.setItem('maintenance_info', JSON.stringify(maintenanceInfo));
      
      window.location.href = '/misc/maintenance';
      return Promise.reject(error);
    }
    
    // Handle 401 with session conflict
    if (error.response?.status === 401 && error.response?.data?.code === 'SESSION_CONFLICT') {
      sessionStorage.setItem('session_conflict', 'true');
      window.location.href = '/misc/session-conflict';
      return Promise.reject(error);
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      window.location.href = '/misc/unauthorized';
      return Promise.reject(error);
    }
    
    // Handle regular 401 (don't redirect for auth endpoints to avoid loops)
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      if (!isAuthEndpoint) {
        // Only clear auth and redirect if not already on an auth endpoint
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login') && 
            !currentPath.startsWith('/register') && 
            !currentPath.startsWith('/forgot-password')) {
          // Clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('tenant_id');
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('tenant_id');
          sessionStorage.removeItem('session_id');
          
          // The auth context will handle the logout
          return Promise.reject(error);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Export the instance for direct use
export default api;

// Export the API URL for components that need it (like health checks)
export { API_URL };

// FIXED: Export environment helper for components that need it
export { getCurrentEnvironment };

// Helper function to check API health
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    console.log('🏥 Checking API health at:', `${API_URL}/health`);
    const response = await fetch(`${API_URL}/health`);
    console.log('🏥 Health check response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('[API] Health check failed:', error);
    return false;
  }
};

// Helper to get maintenance status
export const getMaintenanceStatus = async (): Promise<any> => {
  try {
    const response = await api.get('/api/system/maintenance/status');
    return response.data;
  } catch (error) {
    // If we can't check maintenance status, assume we're not in maintenance
    return { isInMaintenance: false };
  }
};

// ===== NEW: API Health Management Functions =====

// Function to clear API down state manually
export const clearApiDownState = () => {
  sessionStorage.removeItem(API_DOWN_SESSION_KEY);
  sessionStorage.removeItem(API_DOWN_REDIRECT_KEY);
  sessionStorage.removeItem('api_down_timestamp');
  sessionStorage.removeItem('api_down_error');
  sessionStorage.removeItem('api_down_return_path');
  console.log('🔄 API down state cleared manually');
};

// Function to check if API is marked as down
export const isApiMarkedAsDown = (): boolean => {
  return sessionStorage.getItem(API_DOWN_SESSION_KEY) === 'true';
};

// Function to get API down information
export const getApiDownInfo = () => {
  const timestamp = sessionStorage.getItem('api_down_timestamp');
  const error = sessionStorage.getItem('api_down_error');
  const returnPath = sessionStorage.getItem('api_down_return_path');
  
  return {
    isDown: isApiMarkedAsDown(),
    timestamp: timestamp ? new Date(timestamp) : null,
    error: error ? JSON.parse(error) : null,
    returnPath: returnPath || '/dashboard'
  };
};

// Function to force mark API as down (for testing)
export const forceApiDown = () => {
  if (import.meta.env.VITE_DEBUG_MODE === 'true') {
    sessionStorage.setItem(API_DOWN_SESSION_KEY, 'true');
    sessionStorage.setItem('api_down_timestamp', new Date().toISOString());
    console.log('🧪 API forced down for testing');
  }
};