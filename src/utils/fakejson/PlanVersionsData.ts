// src/utils/fakejson/PlanVersionsData.ts

export interface PlanVersion {
  id: string;
  planId: string;
  versionNumber: string;
  isActive: boolean;
  effectiveDate: string;
  changelog: string;
  createdBy: string;
  createdAt: string;
}

// Sample versions for each plan
export const fakePlanVersions: PlanVersion[] = [
  // Versions for plan_1 (Basic Plan)
  {
    id: 'version_101',
    planId: 'plan_1',
    versionNumber: '1.0',
    isActive: false,
    effectiveDate: '2023-12-05T00:00:00Z',
    changelog: 'Initial version of Basic Plan',
    createdBy: 'admin',
    createdAt: '2023-12-01T10:00:00Z'
  },
  {
    id: 'version_102',
    planId: 'plan_1',
    versionNumber: '1.1',
    isActive: false,
    effectiveDate: '2024-02-15T00:00:00Z',
    changelog: 'Increased storage limits by 50%, reduced SMS notification costs',
    createdBy: 'admin',
    createdAt: '2024-02-10T14:30:00Z'
  },
  {
    id: 'version_103',
    planId: 'plan_1',
    versionNumber: '2.0',
    isActive: true,
    effectiveDate: '2024-04-01T00:00:00Z',
    changelog: 'Major update: Added document features, increased contract limits, added WhatsApp notifications',
    createdBy: 'admin',
    createdAt: '2024-03-20T09:15:00Z'
  },
  
  // Versions for plan_2 (Premium Plan)
  {
    id: 'version_201',
    planId: 'plan_2',
    versionNumber: '1.0',
    isActive: false,
    effectiveDate: '2023-12-20T00:00:00Z',
    changelog: 'Initial version of Premium Plan',
    createdBy: 'admin',
    createdAt: '2023-12-15T11:00:00Z'
  },
  {
    id: 'version_202',
    planId: 'plan_2',
    versionNumber: '2.0',
    isActive: true,
    effectiveDate: '2024-03-01T00:00:00Z',
    changelog: 'Added VaNi feature, increased all limits by 20%, added support for AUD and CAD currencies',
    createdBy: 'admin',
    createdAt: '2024-02-20T13:45:00Z'
  },
  
  // Versions for plan_3 (Enterprise Plan)
  {
    id: 'version_301',
    planId: 'plan_3',
    versionNumber: '1.0',
    isActive: true,
    effectiveDate: '2024-01-15T00:00:00Z',
    changelog: 'Initial version of Enterprise Plan with all premium features',
    createdBy: 'admin',
    createdAt: '2024-01-10T08:30:00Z'
  }
];

// Add planVersionId to fakeTenants in TenantsData.ts
// This would be a modification to your existing fakeTenants array
// Each tenant would get a planVersionId field matching the active version of their plan

// Helper functions
export const getPlanVersions = (planId: string): PlanVersion[] => {
  return fakePlanVersions.filter(version => version.planId === planId);
};

export const getVersionById = (versionId: string): PlanVersion | undefined => {
  return fakePlanVersions.find(version => version.id === versionId);
};

export const getActiveVersion = (planId: string): PlanVersion | undefined => {
  return fakePlanVersions.find(version => version.planId === planId && version.isActive);
};

export default {
  fakePlanVersions,
  getPlanVersions,
  getVersionById,
  getActiveVersion
};