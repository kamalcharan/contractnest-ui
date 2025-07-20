//src/services/analytics/events.ts
/**
 * ContractNest Analytics Event Registry
 * 
 * This file serves as the central registry for all analytics events
 * across the ContractNest platform.
 * 
 * NAMING CONVENTION:
 * - Use snake_case for event names
 * - Use the format: object_action
 * - Keep names concise but descriptive
 */

// Authentication Events
export const AUTH_EVENTS = {
  LOGIN: 'auth_login',
  LOGIN_SUCCESS: 'auth_login_success',
  LOGIN_FAILURE: 'auth_login_failure',
  LOGOUT: 'auth_logout',
  SIGNUP_START: 'auth_signup_start',
  SIGNUP_STEP: 'auth_signup_step',
  SIGNUP_SUCCESS: 'auth_signup_success',
  SIGNUP_FAILURE: 'auth_signup_failure',
  PASSWORD_RESET_REQUEST: 'auth_password_reset_request',
  PASSWORD_RESET_COMPLETE: 'auth_password_reset_complete',
  MFA_ENABLE: 'auth_mfa_enable',
  MFA_VERIFY: 'auth_mfa_verify',
} as const;

// Contract Events
export const CONTRACT_EVENTS = {
  CREATE: 'contract_create',
  VIEW: 'contract_view',
  EDIT: 'contract_edit',
  SHARE: 'contract_share',
  SIGN: 'contract_sign',
  COMPLETE: 'contract_complete',
  ARCHIVE: 'contract_archive',
  DOWNLOAD: 'contract_download',
  DELETE: 'contract_delete',
} as const;

// Workspace Events
export const WORKSPACE_EVENTS = {
  CREATE: 'workspace_create',
  UPDATE: 'workspace_update',
  INVITE_SEND: 'workspace_invite_send',
  INVITE_ACCEPT: 'workspace_invite_accept',
  SETTINGS_UPDATE: 'workspace_settings_update',
  SWITCH: 'workspace_switch',
} as const;

// User Events
export const USER_EVENTS = {
  PROFILE_VIEW: 'user_profile_view',
  PROFILE_UPDATE: 'user_profile_update',
  SETTINGS_VIEW: 'user_settings_view',
  SETTINGS_UPDATE: 'user_settings_update',
  NOTIFICATION_RECEIVE: 'user_notification_receive',
  NOTIFICATION_CLICK: 'user_notification_click',
} as const;

// Payment/Subscription Events
export const BILLING_EVENTS = {
  PLAN_VIEW: 'billing_plan_view',
  SUBSCRIPTION_START: 'billing_subscription_start',
  SUBSCRIPTION_UPGRADE: 'billing_subscription_upgrade',
  SUBSCRIPTION_DOWNGRADE: 'billing_subscription_downgrade',
  SUBSCRIPTION_CANCEL: 'billing_subscription_cancel',
  PAYMENT_SUCCESS: 'billing_payment_success',
  PAYMENT_FAILURE: 'billing_payment_failure',
} as const;

// UI/Navigation Events
export const UI_EVENTS = {
  PAGE_VIEW: 'page_view',
  MODAL_OPEN: 'ui_modal_open',
  MODAL_CLOSE: 'ui_modal_close',
  MENU_OPEN: 'ui_menu_open',
  MENU_CLICK: 'ui_menu_click',
  SEARCH: 'ui_search',
  FILTER_USE: 'ui_filter_use',
  SORT_USE: 'ui_sort_use',
} as const;

// Landing Page & Marketing Events
export const MARKETING_EVENTS = {
  CTA_CLICK: 'marketing_cta_click',
  LANDING_VIEW: 'marketing_landing_view',
  FEATURE_EXPLORE: 'marketing_feature_explore',
  DEMO_REQUEST: 'marketing_demo_request',
  RESOURCE_DOWNLOAD: 'marketing_resource_download',
  PRICING_VIEW: 'marketing_pricing_view',
} as const;

// Combine all event categories
export const ANALYTICS_EVENTS = {
  ...AUTH_EVENTS,
  ...CONTRACT_EVENTS,
  ...WORKSPACE_EVENTS,
  ...USER_EVENTS,
  ...BILLING_EVENTS,
  ...UI_EVENTS,
  ...MARKETING_EVENTS,
} as const;

// Create a type for all event names
export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

// Parameter definitions for common events
export interface AnalyticsEventParams {
  // Common parameters that can be included with any event
  source?: string;
  screen_name?: string;
  page_name?: string;
  
  // Auth events
  method?: string;
  success?: boolean;
  error_type?: string;
  error_message?: string;
  
  // Contract events
  contract_id?: string;
  template_id?: string;
  duration?: number;
  contract_type?: string;
  
  // Workspace events
  workspace_id?: string;
  workspace_name?: string;
  
  // User events
  user_id?: string;
  user_role?: string;
  
  // UI events
  modal_name?: string;
  menu_item?: string;
  search_term?: string;
  filter_type?: string;
  filter_value?: string;
  sort_field?: string;
  sort_direction?: string;
  
  // Billing events
  plan_id?: string;
  plan_name?: string;
  amount?: number;
  currency?: string;
  payment_method?: string;
  
  // Marketing events
  cta_id?: string;
  cta_position?: string;
  landing_page?: string;
  feature_name?: string;
  resource_type?: string;
  resource_id?: string;
  
  // Allow for additional custom parameters
  [key: string]: any;
}