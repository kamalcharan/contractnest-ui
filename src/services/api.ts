// src/services/api.ts
import axios from 'axios';

// Determine the environment-specific API URL
const getApiUrl = () => {
  // For Vercel deployments
  if (import.meta.env.VITE_VERCEL_ENV) {
    switch (import.meta.env.VITE_VERCEL_ENV) {
      case 'production':
        return import.meta.env.VITE_PROD_API_URL;
      case 'preview':
        return import.meta.env.VITE_STAGING_API_URL;
      default:
        return import.meta.env.VITE_DEV_API_URL;
    }
  }
  
  // For local development or if Vercel env isn't available
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

const API_URL = getApiUrl();

console.log(`API configured with base URL: ${API_URL}`);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token, tenant ID, and session ID
api.interceptors.request.use(
  (config) => {
    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      '/users/invitations/validate',
      '/users/invitations/accept'
    ];
    
    // Check if current request is to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
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
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle maintenance mode, session conflicts, and errors
api.interceptors.response.use(
  (response) => {
    // Check for maintenance mode header
    if (response.headers['x-maintenance-mode'] === 'true') {
      // Store maintenance info if provided
      const maintenanceInfo = {
        isInMaintenance: true,
        estimatedEndTime: response.headers['x-maintenance-end-time'] || null,
        message: response.headers['x-maintenance-message'] || 'System maintenance in progress'
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
    // Handle network errors FIRST (no internet connection)
    if (!error.response && (error.message === 'Network Error' || error.code === 'ERR_NETWORK')) {
      // Don't redirect for network errors during auth initialization
      // Check if this is happening during app initialization
      const isAuthPath = error.config?.url?.includes('/auth/user') || 
                        error.config?.url?.includes('/tenants') ||
                        error.config?.url?.includes('/auth/login') ||
                        error.config?.url?.includes('/auth/register');
      
      if (isAuthPath) {
        // During auth-related calls, just reject without redirect
        return Promise.reject(error);
      }
      
      // For other requests, redirect to no-internet page
      window.location.href = '/misc/no-internet';
      return Promise.reject(error);
    }
    
    // Handle 503 Service Unavailable (maintenance mode)
    if (error.response?.status === 503) {
      const maintenanceInfo = {
        isInMaintenance: true,
        estimatedEndTime: error.response.headers['x-maintenance-end-time'] || null,
        message: error.response.data?.message || 'System maintenance in progress'
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
        // This prevents redirect loops
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login') && 
            !currentPath.startsWith('/register') && 
            !currentPath.startsWith('/forgot-password')) {
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