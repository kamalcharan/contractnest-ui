// Debug utility for testing master data endpoints
// Use this in browser console to test endpoints

export const debugMasterData = {
  
  // Test what category names are available in the database
  async checkAvailableCategories() {
    try {
      const response = await fetch('/api/functions/debug-categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log('📊 Available Categories:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to check categories:', error);
      return { success: false, error: error.message };
    }
  },

  // Test specific category endpoint
  async testCategory(categoryName: string, token?: string, tenantId?: string) {
    try {
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (tenantId) headers['x-tenant-id'] = tenantId;
      
      const response = await fetch(`/api/functions/product-masterdata?category_name=${categoryName}`, {
        method: 'GET',
        headers
      });
      
      const result = await response.json();
      console.log(`📊 Category '${categoryName}' result:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Failed to test category '${categoryName}':`, error);
      return { success: false, error: error.message };
    }
  },

  // Test all common category names
  async testCommonCategories(token?: string, tenantId?: string) {
    const commonNames = [
      'service_categories',
      'categories', 
      'industries',
      'resource_types',
      'pricing_models',
      'services',
      'service_types'
    ];
    
    console.log('🔍 Testing common category names...');
    
    for (const categoryName of commonNames) {
      await this.testCategory(categoryName, token, tenantId);
    }
  },

  // Get auth details from current session (if available)
  getAuthDetails() {
    // Try to get from localStorage or sessionStorage
    const authData = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        console.log('🔐 Found auth data:', { 
          hasToken: !!parsed.token,
          hasTenant: !!parsed.currentTenant,
          tenantId: parsed.currentTenant?.id 
        });
        return parsed;
      } catch (e) {
        console.warn('⚠️ Could not parse auth data');
      }
    }
    console.warn('⚠️ No auth data found in storage');
    return null;
  },

  // Test GraphQL endpoint
  async testGraphQLEndpoint(token?: string, tenantId?: string) {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (tenantId) headers['x-tenant-id'] = tenantId;

    // Simple GraphQL health check query
    const query = {
      query: `
        query HealthCheck {
          __typename
        }
      `
    };

    try {
      console.log('🔍 Testing GraphQL endpoint...');
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify(query)
      });
      
      const result = await response.json();
      console.log('📊 GraphQL endpoint result:', {
        status: response.status,
        ok: response.ok,
        data: result
      });
      return result;
    } catch (error) {
      console.error('❌ GraphQL endpoint test failed:', error);
      return { error: error.message };
    }
  },

  // Test master data GraphQL query
  async testMasterDataGraphQL(token?: string, tenantId?: string) {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (tenantId) headers['x-tenant-id'] = tenantId;

    // Test the actual master data query
    const query = {
      query: `
        query GetMasterData {
          masterData {
            success
            data {
              categories {
                id
                name
                description
                isActive
              }
              industries {
                id
                name
                description
                isActive
              }
            }
          }
        }
      `
    };

    try {
      console.log('🔍 Testing Master Data GraphQL query...');
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify(query)
      });
      
      const result = await response.json();
      console.log('📊 Master Data GraphQL result:', {
        status: response.status,
        ok: response.ok,
        data: result
      });
      return result;
    } catch (error) {
      console.error('❌ Master Data GraphQL test failed:', error);
      return { error: error.message };
    }
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugMasterData = debugMasterData;
}

// Usage examples:
console.log(`
🔧 Debug Master Data Utility Loaded!

Usage in browser console:

=== Edge Functions (Master Data) ===
- debugMasterData.checkAvailableCategories()
- debugMasterData.testCategory('categories')
- debugMasterData.testCommonCategories()

=== GraphQL Endpoints ===
- debugMasterData.testGraphQLEndpoint()
- debugMasterData.testMasterDataGraphQL()

=== Auth & Setup ===
- debugMasterData.getAuthDetails()

With auth (get token/tenant from getAuthDetails first):
- debugMasterData.testGraphQLEndpoint('token', 'tenant-id')
- debugMasterData.testMasterDataGraphQL('token', 'tenant-id')
`);