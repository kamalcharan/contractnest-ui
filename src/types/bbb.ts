// src/types/bbb.ts
// File 1/13 - BBB Directory Type Definitions

export interface TenantMarketProfile {
  id: string;
  tenant_id: string;
  tenant_profile_id?: string;
  
  // Contact
  mobile_number: string;
  whatsapp_number?: string;
  alternate_mobile?: string;
  
  // Marketplace Context
  marketplace_type: 'bbb' | 'ac_servicing' | 'hospitals' | 'pest_control';
  branch: string; // 'bagyanagar', 'kukatpally', etc.
  
  // Profile Content
  short_description?: string;
  ai_enhanced_description?: string;
  raw_data: string;
  
  // Search & Discovery
  suggested_keywords: string[];
  approved_keywords: string[];
  service_tags: string[];
  business_category?: string;
  
  // AI/Vector
  embedding?: number[];
  structured_data: Record<string, any>;
  
  // Metadata
  generation_method?: 'manual' | 'website' | 'ai_enhanced';
  profile_status: 'pending' | 'active' | 'inactive';
  is_publicly_searchable: boolean;
  
  // Audit
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
}

export interface TenantProfile {
  id: string;
  tenant_id: string;
  business_name: string;
  business_email?: string;
  business_phone?: string;
  business_phone_code?: string;
  website_url?: string;
  logo_url?: string;
  industry_id?: string;
  business_category?: string;
  city?: string;
  address_line1?: string;
  address_line2?: string;
  postal_code?: string;
  country_code?: string;
  state_code?: string;
}

export interface SemanticCluster {
  id: string;
  primary_term: string;
  related_terms: string[];
  cluster_embedding?: number[];
  category?: string;
  is_active: boolean;
  created_at: string;
}

export interface QueryCache {
  query_text: string;
  query_normalized: string;
  chapter: string;
  embedding?: number[];
  results: any;
  hit_count: number;
  created_at: string;
  expires_at: string;
}

export interface BBBOnboardingData {
  tenant_id: string;
  branch: string;
  profile_entry_method: 'manual' | 'website';
  short_description?: string;
  website_url?: string;
}

export interface AIEnhancementRequest {
  tenant_id: string;
  short_description: string;
  business_name: string;
  business_category?: string;
  phone_number?: string;
  website_url?: string;
}

export interface AIEnhancementResponse {
  enhanced_description: string;
  suggested_keywords: string[];
  service_tags: string[];
}

export interface WebsiteScrapingRequest {
  website_url: string;
  tenant_id: string;
}

export interface WebsiteScrapingResponse {
  success: boolean;
  business_description?: string;
  services?: string[];
  keywords?: string[];
  error?: string;
}

export interface SemanticClusterGenerationResponse {
  clusters: {
    primary_term: string;
    related_terms: string[];
    category: string;
  }[];
}

export interface BBBJoinRequest {
  tenant_id: string;
  password: string;
  branch: string;
}

export interface BBBSearchRequest {
  query: string;
  branch?: string;
  marketplace_type?: string;
}

export interface BBBSearchResult {
  profile: TenantMarketProfile;
  tenant_profile: TenantProfile;
  similarity_score: number;
  digital_card_url?: string;
}

export interface BBBAdminStats {
  total_members: number;
  active_members: number;
  pending_approvals: number;
  inactive_members: number;
  branches: {
    name: string;
    count: number;
  }[];
}

export type ProfileFormData = {
  short_description: string;
  generation_method: 'manual' | 'website';
  website_url?: string;
};