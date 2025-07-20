// src/types/user.ts

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'invited';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_code: string;
  mobile_number?: string;
  country_code?: string;
  preferred_language?: string;
  preferred_theme?: string;
  timezone?: string;
  department?: string;
  employee_id?: string;
  joining_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWithAccess extends UserProfile {
  status: UserStatus;
  role?: string;
  role_id?: string;
  last_login?: string;
  permissions?: string[];
  tenant_access?: {
    id: string;
    tenant_id: string;
    is_default: boolean;
    joined_at: string;
  };
  invitation?: {
    id: string;
    sent_at: string;
    expires_at: string;
  };
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at?: string;
}

export interface UserStats {
  total_logins: number;
  last_password_change?: string;
  failed_login_attempts: number;
  last_failed_login?: string;
}

export interface UserDetailsResponse extends UserWithAccess {
  stats: UserStats;
  activity_log: UserActivity[];
  assigned_roles: UserRole[];
  profile?: {
    country_code?: string;
    preferred_language?: string;
    timezone?: string;
    department?: string;
    employee_id?: string;
    joining_date?: string;
  };
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface UserListResponse {
  data: UserWithAccess[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// For forms and updates
export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  country_code?: string;
  department?: string;
  employee_id?: string;
  preferred_language?: string;
  preferred_theme?: string;
  timezone?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  country_code?: string;
  preferred_language?: string;
  preferred_theme?: string;
  timezone?: string;
}