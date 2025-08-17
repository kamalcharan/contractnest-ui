// src/utils/environment.ts
export const getBaseUrl = () => {
  // Railway provides RAILWAY_STATIC_URL for the frontend
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for server-side or missing env vars
  return 'https://contractnest-ui-production.up.railway.app';
};

export const getSignupUrl = () => {
  return import.meta.env.VITE_SIGNUP_URL || `${getBaseUrl()}/signup`;
};

export const getLoginUrl = () => {
  return import.meta.env.VITE_LOGIN_URL || `${getBaseUrl()}/login`;
};