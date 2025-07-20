// Modification to src/utils/fakejson/TenantsData.ts

export interface Tenant {
  id: string;
  name: string;
  email: string;
  currentPlanId: string | null;
  planVersionId: string | null; // Added this field
  createdAt: string;
}

export const fakeTenants: Tenant[] = [
  { 
    id: 'tenant_1', 
    name: 'Acme Inc.', 
    email: 'admin@acme.com', 
    currentPlanId: 'plan_1', 
    planVersionId: 'version_103', // Version 2.0 of Basic Plan
    createdAt: '2024-01-15T09:30:00Z' 
  },
  { 
    id: 'tenant_2', 
    name: 'Globex Corp', 
    email: 'admin@globex.com', 
    currentPlanId: 'plan_2', 
    planVersionId: 'version_202', // Version 2.0 of Premium Plan
    createdAt: '2024-02-10T11:15:00Z' 
  },
  { 
    id: 'tenant_3', 
    name: 'Initech', 
    email: 'admin@initech.com', 
    currentPlanId: 'plan_1', 
    planVersionId: 'version_102', // Version 1.1 of Basic Plan (needs migration)
    createdAt: '2024-01-20T14:45:00Z' 
  },
  // Other tenants...
];