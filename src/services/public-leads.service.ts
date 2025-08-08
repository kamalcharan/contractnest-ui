// src/services/public-leads.service.ts
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/supabase';
import { captureError } from '@/config/sentry.config';
import { analyticsService } from './analytics.service';

export interface PublicLeadData {
  name: string;
  email: string;
  company: string;
  industry?: string | null;
  phone?: string | null;
  country_code?: string | null;
  consent: boolean;
  is_test?: boolean;
  tenant_id?: string | null;
  created_by?: string | null;
}

export interface ResourceUsageData {
  lead_id?: string | null;
  resource_type: string;
  resource_id?: string;
  usage_data?: any;
  is_test?: boolean;
  tenant_id?: string | null;
  created_by?: string | null;
}

// New interface for ContractNest leads
export interface ContractNestLeadData {
  email: string;
  company_name?: string;
  source: string; // 'hero_section' or 'cta_section'
  is_test?: boolean;
  tenant_id?: string;
}

// Function to get headers for public API calls
const getPublicHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept-Profile': 'public',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Prefer': 'return=representation'
  };
};

export const savePublicLeadData = async (data: PublicLeadData) => {
  try {
    console.log('Saving lead data:', data);
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/t_lead_capture`,
      {
        method: 'POST',
        headers: getPublicHeaders(),
        body: JSON.stringify({
          ...data,
          captured_at: new Date().toISOString(),
        })
      }
    );

    const responseText = await response.text();
    console.log('Lead capture API response:', response.status, responseText);

    if (!response.ok) {
      console.error('API Error:', { 
        status: response.status, 
        statusText: response.statusText, 
        body: responseText 
      });
      throw new Error(`Failed to save lead data: ${response.status}`);
    }

    // Parse JSON response if available
    let result;
    try {
      result = responseText ? JSON.parse(responseText) : { success: true };
    } catch (err) {
      console.error('Failed to parse response:', err);
      result = { success: true };
    }

    // Track lead capture event
    try {
      analyticsService.trackWorkspaceEvent('dt_readiness_lead_captured', {
        industry: data.industry || 'not_specified',
        has_phone: !!data.phone
      });
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError);
    }
    
    return result;
    
  } catch (error) {
    // Capture error for monitoring
    captureError(error as Error, {
      tags: { module: 'public-leads', action: 'savePublicLeadData' }
    });
    console.error('Error saving lead data:', error);
    throw error;
  }
};

export const trackResourceUsage = async (data: Omit<ResourceUsageData, 'resource_id'>, assessmentData: any) => {
  try {
    // Generate a unique resource ID using timestamp
    const resourceId = `DT_READINESS_${Date.now()}`;
    
    console.log('Tracking resource usage:', {
      ...data,
      resource_id: resourceId,
      usage_data: assessmentData
    });

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/t_resource_usage`,
      {
        method: 'POST',
        headers: getPublicHeaders(),
        body: JSON.stringify({
          lead_id: data.lead_id,
          resource_type: data.resource_type || 'DTReadinessAssessment', // Set resource type explicitly
          resource_id: resourceId,
          usage_data: assessmentData,
          used_at: new Date().toISOString(),
          is_test: data.is_test || false,
          tenant_id: data.tenant_id,
          created_by: data.created_by
        })
      }
    );

    const responseText = await response.text();
    console.log('Resource usage API response:', response.status, responseText);

    if (!response.ok) {
      console.error('API Error:', { 
        status: response.status, 
        statusText: response.statusText, 
        body: responseText 
      });
      throw new Error(`Failed to track resource usage: ${response.status}`);
    }

    // Parse JSON response if available
    try {
      return responseText ? JSON.parse(responseText) : { success: true };
    } catch (err) {
      console.error('Failed to parse response:', err);
      return { success: true };
    }
    
  } catch (error) {
    captureError(error as Error, {
      tags: { module: 'public-leads', action: 'trackResourceUsage' }
    });
    console.error('Error tracking resource usage:', error);
    // Don't throw error for usage tracking to avoid disrupting user experience
    return null;
  }
};

// New function to save ContractNest leads
export const saveContractNestLead = async (data: ContractNestLeadData) => {
  try {
    console.log('Saving ContractNest lead data:', data);
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/t_leads_contractnest`,
      {
        method: 'POST',
        headers: getPublicHeaders(),
        body: JSON.stringify({
          email: data.email,
          company_name: data.company_name || null,
          source: data.source,
          captured_at: new Date().toISOString(),
          is_test: data.is_test || false,
          tenant_id: data.tenant_id || null
        })
      }
    );

    const responseText = await response.text();
    console.log('ContractNest lead capture API response:', response.status, responseText);

    if (!response.ok) {
      console.error('API Error:', { 
        status: response.status, 
        statusText: response.statusText, 
        body: responseText 
      });
      throw new Error(`Failed to save ContractNest lead data: ${response.status}`);
    }

    // Parse JSON response if available
    let result;
    try {
      result = responseText ? JSON.parse(responseText) : { success: true };
    } catch (err) {
      console.error('Failed to parse response:', err);
      result = { success: true };
    }

    // Track lead capture event in analytics
    try {
      analyticsService.trackWorkspaceEvent('contractnest_lead_captured', {
        source: data.source,
        has_company: !!data.company_name
      });
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError);
    }

    return result;
    
  } catch (error) {
    // Capture error for monitoring
    captureError(error as Error, {
      tags: { module: 'public-leads', action: 'saveContractNestLead' }
    });
    console.error('Error saving ContractNest lead data:', error);
    throw error;
  }
};