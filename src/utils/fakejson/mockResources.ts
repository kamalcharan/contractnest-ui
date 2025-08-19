// src/utils/fakejson/mockResources.ts
// Mock data for resources following your useResources hook structure

export interface MockResourceType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  sort_order?: number;
}

export interface MockResource {
  id: string;
  resource_type_id: string;
  name: string;
  display_name: string;
  description?: string;
  hexcolor?: string;
  sequence_no?: number;
  contact_id?: string;
  tags?: string[];
  form_settings?: any;
  is_active: boolean;
  is_deletable: boolean;
  tenant_id: string;
  created_at: string;
  updated_at?: string;
  contact?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

// Mock Resource Types (Categories)
export const mockResourceTypes: MockResourceType[] = [
  {
    id: 'team-staff',
    name: 'Team Staff',
    description: 'Human resources - doctors, technicians, specialists',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'equipment',
    name: 'Equipment',
    description: 'Tools, machines, diagnostic equipment',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'consumables',
    name: 'Consumables',
    description: 'Materials that get used up - filters, medicines, supplies',
    is_active: true,
    sort_order: 3
  },
  {
    id: 'assets',
    name: 'Assets',
    description: 'Fixed assets - rooms, vehicles, facilities',
    is_active: true,
    sort_order: 4
  },
  {
    id: 'partners',
    name: 'Partners',
    description: 'External partners, vendors, specialists',
    is_active: true,
    sort_order: 5
  }
];

// Mock Resources
export const mockResources: MockResource[] = [
  // Team Staff
  {
    id: 'dr-kiran',
    resource_type_id: 'team-staff',
    name: 'Dr. Kiran',
    display_name: 'Dr. Kiran (Cardiologist)',
    description: 'Senior cardiologist with 15+ years experience',
    hexcolor: '#3B82F6',
    sequence_no: 1,
    contact_id: 'contact-dr-kiran',
    tags: ['doctor', 'cardiologist', 'senior'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-15T10:00:00Z',
    contact: {
      id: 'contact-dr-kiran',
      first_name: 'Kiran',
      last_name: 'Sharma',
      email: 'dr.kiran@clinic.com'
    }
  },
  {
    id: 'dr-priya',
    resource_type_id: 'team-staff',
    name: 'Dr. Priya',
    display_name: 'Dr. Priya (General Physician)',
    description: 'General physician for consultations',
    hexcolor: '#10B981',
    sequence_no: 2,
    contact_id: 'contact-dr-priya',
    tags: ['doctor', 'general', 'consultation'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-16T10:00:00Z',
    contact: {
      id: 'contact-dr-priya',
      first_name: 'Priya',
      last_name: 'Patel',
      email: 'dr.priya@clinic.com'
    }
  },
  {
    id: 'tech-john',
    resource_type_id: 'team-staff',
    name: 'John Smith',
    display_name: 'John Smith (HVAC Technician)',
    description: 'Certified HVAC maintenance technician',
    hexcolor: '#F59E0B',
    sequence_no: 3,
    contact_id: 'contact-tech-john',
    tags: ['technician', 'hvac', 'maintenance'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-17T10:00:00Z',
    contact: {
      id: 'contact-tech-john',
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@tech.com'
    }
  },
  {
    id: 'nurse-sarah',
    resource_type_id: 'team-staff',
    name: 'Sarah Wilson',
    display_name: 'Sarah Wilson (Registered Nurse)',
    description: 'Registered nurse for patient care',
    hexcolor: '#8B5CF6',
    sequence_no: 4,
    contact_id: 'contact-nurse-sarah',
    tags: ['nurse', 'patient-care', 'registered'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-18T10:00:00Z',
    contact: {
      id: 'contact-nurse-sarah',
      first_name: 'Sarah',
      last_name: 'Wilson',
      email: 'sarah.wilson@clinic.com'
    }
  },

  // Equipment
  {
    id: 'ecg-machine',
    resource_type_id: 'equipment',
    name: 'ECG Machine',
    display_name: 'ECG Machine (Portable)',
    description: '12-lead ECG machine for cardiac monitoring',
    hexcolor: '#EF4444',
    sequence_no: 1,
    tags: ['cardiac', 'diagnostic', 'portable'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'hvac-diagnostic-tool',
    resource_type_id: 'equipment',
    name: 'HVAC Diagnostic Scanner',
    display_name: 'HVAC Diagnostic Scanner (Professional)',
    description: 'Professional HVAC system diagnostic tool',
    hexcolor: '#6366F1',
    sequence_no: 2,
    tags: ['hvac', 'diagnostic', 'professional'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 'ultrasound-machine',
    resource_type_id: 'equipment',
    name: 'Ultrasound Machine',
    display_name: 'Portable Ultrasound Machine',
    description: 'Portable ultrasound for basic imaging',
    hexcolor: '#059669',
    sequence_no: 3,
    tags: ['imaging', 'portable', 'diagnostic'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-17T10:00:00Z'
  },

  // Consumables
  {
    id: 'air-filter-hepa',
    resource_type_id: 'consumables',
    name: 'HEPA Air Filter',
    display_name: 'HEPA Air Filter (High Efficiency)',
    description: 'High-efficiency particulate air filter',
    hexcolor: '#84CC16',
    sequence_no: 1,
    tags: ['filter', 'hepa', 'air-quality'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'surgical-gloves',
    resource_type_id: 'consumables',
    name: 'Surgical Gloves',
    display_name: 'Sterile Surgical Gloves (Box)',
    description: 'Sterile surgical gloves, latex-free',
    hexcolor: '#06B6D4',
    sequence_no: 2,
    tags: ['surgical', 'sterile', 'latex-free'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 'disinfectant-wipes',
    resource_type_id: 'consumables',
    name: 'Disinfectant Wipes',
    display_name: 'Medical Grade Disinfectant Wipes',
    description: 'Hospital-grade disinfectant wipes',
    hexcolor: '#F97316',
    sequence_no: 3,
    tags: ['disinfectant', 'medical-grade', 'cleaning'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-17T10:00:00Z'
  },

  // Assets
  {
    id: 'consultation-room-1',
    resource_type_id: 'assets',
    name: 'Consultation Room 1',
    display_name: 'Consultation Room 1 (Ground Floor)',
    description: 'Primary consultation room with basic equipment',
    hexcolor: '#7C3AED',
    sequence_no: 1,
    tags: ['room', 'consultation', 'ground-floor'],
    is_active: true,
    is_deletable: false,
    tenant_id: 'tenant-1',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'service-vehicle-1',
    resource_type_id: 'assets',
    name: 'Service Vehicle 1',
    display_name: 'Service Van (Toyota Hiace)',
    description: 'Mobile service vehicle for on-site visits',
    hexcolor: '#DC2626',
    sequence_no: 2,
    tags: ['vehicle', 'mobile', 'on-site'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 'customer-site-access',
    resource_type_id: 'assets',
    name: 'Customer Site Access',
    display_name: 'Customer Site Access Permission',
    description: 'Access to customer premises for service delivery',
    hexcolor: '#059669',
    sequence_no: 3,
    tags: ['access', 'customer', 'permission'],
    is_active: true,
    is_deletable: false,
    tenant_id: 'tenant-1',
    created_at: '2024-01-17T10:00:00Z'
  },

  // Partners
  {
    id: 'specialist-lab',
    resource_type_id: 'partners',
    name: 'City Lab Services',
    display_name: 'City Lab Services (External Lab)',
    description: 'External laboratory for specialized tests',
    hexcolor: '#BE185D',
    sequence_no: 1,
    tags: ['lab', 'external', 'testing'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'hvac-supplier',
    resource_type_id: 'partners',
    name: 'HVAC Parts Supplier',
    display_name: 'HVAC Parts Supplier (Premium)',
    description: 'Reliable supplier for HVAC components',
    hexcolor: '#7C2D12',
    sequence_no: 2,
    tags: ['supplier', 'hvac', 'parts'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 'specialist-consultant',
    resource_type_id: 'partners',
    name: 'Dr. Expert Consultant',
    display_name: 'Dr. Expert (External Specialist)',
    description: 'External specialist consultant for complex cases',
    hexcolor: '#92400E',
    sequence_no: 3,
    tags: ['consultant', 'specialist', 'external'],
    is_active: true,
    is_deletable: true,
    tenant_id: 'tenant-1',
    created_at: '2024-01-17T10:00:00Z'
  }
];

// Helper functions for filtering
export const getResourcesByType = (resourceTypeId: string): MockResource[] => {
  return mockResources.filter(resource => resource.resource_type_id === resourceTypeId);
};

export const getResourceById = (resourceId: string): MockResource | undefined => {
  return mockResources.find(resource => resource.id === resourceId);
};

export const getActiveResources = (): MockResource[] => {
  return mockResources.filter(resource => resource.is_active);
};

export const getResourceTypeById = (typeId: string): MockResourceType | undefined => {
  return mockResourceTypes.find(type => type.id === typeId);
};

// Simulate API delay
export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};