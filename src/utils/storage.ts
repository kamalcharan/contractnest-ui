// src/utils/storage.ts

// Token storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TENANT_ID_KEY = 'tenant_id';
const CURRENT_TENANT_KEY = 'current_tenant';
const IS_ADMIN_KEY = 'is_admin';
const IS_LIVE_KEY = 'is_live_environment';

/**
 * Set authentication token in local storage
 */
export const setAuthToken = (token: string, refreshToken?: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Get authentication token from local storage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get refresh token from local storage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Remove authentication token from local storage
 */
export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Set current tenant ID in local storage
 */
export const setCurrentTenantId = (tenantId: string) => {
  localStorage.setItem(TENANT_ID_KEY, tenantId);
};

/**
 * Get current tenant ID from local storage
 */
export const getCurrentTenantId = (): string | null => {
  return localStorage.getItem(TENANT_ID_KEY);
};

/**
 * Remove current tenant ID from local storage
 */
export const removeCurrentTenantId = () => {
  localStorage.removeItem(TENANT_ID_KEY);
};

/**
 * Set is_admin flag in local storage
 */
export const setIsAdmin = (isAdmin: boolean) => {
  localStorage.setItem(IS_ADMIN_KEY, String(isAdmin));
};

/**
 * Get is_admin flag from local storage
 */
export const getIsAdmin = (): boolean => {
  return localStorage.getItem(IS_ADMIN_KEY) === 'true';
};

/**
 * Remove is_admin flag from local storage
 */
export const removeIsAdmin = () => {
  localStorage.removeItem(IS_ADMIN_KEY);
};

/**
 * Set current tenant object in local storage
 */
export const setCurrentTenant = (tenant: any) => {
  if (!tenant) return;

  localStorage.setItem(CURRENT_TENANT_KEY, JSON.stringify(tenant));
  
  // Also set the tenant ID separately for API requests
  if (tenant.id) {
    localStorage.setItem(TENANT_ID_KEY, tenant.id);
  }
  
  // Set the is_admin flag for easy access
  setIsAdmin(Boolean(tenant?.is_admin));
};

/**
 * Get current tenant object from local storage
 */
export const getCurrentTenant = (): any | null => {
  const data = localStorage.getItem(CURRENT_TENANT_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Remove current tenant object from local storage
 */
export const removeCurrentTenant = () => {
  localStorage.removeItem(CURRENT_TENANT_KEY);
  removeIsAdmin();
};

/**
 * Set environment mode (Live/Test) in local storage
 */
export const setEnvironmentMode = (isLive: boolean) => {
  localStorage.setItem(IS_LIVE_KEY, String(isLive));
};

/**
 * Get environment mode from local storage
 */
export const getEnvironmentMode = (): boolean => {
  const value = localStorage.getItem(IS_LIVE_KEY);
  return value === null ? true : value === 'true';
};

/**
 * Remove environment mode from local storage
 */
export const removeEnvironmentMode = () => {
  localStorage.removeItem(IS_LIVE_KEY);
};

/**
 * Clear all auth-related data from local storage
 */
export const clearAuthStorage = () => {
  removeAuthToken();
  removeCurrentTenantId();
  removeCurrentTenant();
  removeIsAdmin();
  removeEnvironmentMode();
};