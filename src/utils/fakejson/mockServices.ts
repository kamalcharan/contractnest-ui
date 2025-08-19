// src/utils/fakejson/mockServices.ts
// Mock data for service catalog following the new resource-composition model

export interface MockServiceResourceRequirement {
  id: string;
  resource_id: string;
  resource_type_id: string;
  requirement_type: 'required' | 'optional' | 'alternative';
  quantity?: number;
  notes?: string;
}

export interface MockService {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  short_description?: string;
  
  // Pricing
  base_price: number;
  currency: string;
  pricing_type: 'fixed' | 'hourly' | 'daily';
  
  // Service attributes
  duration?: number; // in minutes
  category?: string;
  tags?: string[];
  
  // Resource composition (the new flexible model)
  resource_requirements: MockServiceResourceRequirement[];
  
  // Status and metadata
  is_active: boolean;
  is_live: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  
  // UI helpers
  hexcolor?: string;
  icon?: string;
}

export interface MockServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  hexcolor?: string;
  is_active: boolean;
}

// Mock Service Categories
export const mockServiceCategories: MockServiceCategory[] = [
  {
    id: 'medical-consultation',
    name: 'Medical Consultation',
    description: 'Doctor consultations and medical advice',
    icon: '🩺',
    hexcolor: '#3B82F6',
    is_active: true
  },
  {
    id: 'hvac-maintenance',
    name: 'HVAC Maintenance',
    description: 'Heating, ventilation, and air conditioning services',
    icon: '❄️',
    hexcolor: '#10B981',
    is_active: true
  },
  {
    id: 'business-consulting',
    name: 'Business Consulting',
    description: 'Business strategy and consulting services',
    icon: '💼',
    hexcolor: '#8B5CF6',
    is_active: true
  },
  {
    id: 'technical-support',
    name: 'Technical Support',
    description: 'IT and technical assistance services',
    icon: '🔧',
    hexcolor: '#F59E0B',
    is_active: true
  }
];

// Mock Services with resource composition
export const mockServices: MockService[] = [
  // Simple service - no specific resources required
  {
    id: 'discovery-call',
    tenant_id: 'tenant-1',
    name: 'Discovery Call',
    description: 'Initial consultation call to understand your needs and provide recommendations. No specific equipment or specialist required.',
    short_description: 'Initial consultation call to understand your needs',
    base_price: 50,
    currency: 'INR',
    pricing_type: 'fixed',
    duration: 30,
    category: 'business-consulting',
    tags: ['consultation', 'discovery', 'initial'],
    resource_requirements: [], // No specific resources needed
    is_active: true,
    is_live: true,
    created_at: '2024-01-15T10:00:00Z',
    hexcolor: '#6366F1',
    icon: '📞'
  },

  // Service with specific doctor requirement
  {
    id: 'cardiology-consultation',
    tenant_id: 'tenant-1',
    name: 'Cardiology Consultation',
    description: 'Comprehensive cardiac evaluation with Dr. Kiran, our senior cardiologist. Includes ECG monitoring and detailed assessment.',
    short_description: 'Cardiac evaluation with senior cardiologist',
    base_price: 100,
    currency: 'INR',
    pricing_type: 'fixed',
    duration: 45,
    category: 'medical-consultation',
    tags: ['cardiology', 'specialist', 'ecg'],
    resource_requirements: [
      {
        id: 'req-1',
        resource_id: 'dr-kiran',
        resource_type_id: 'team-staff',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Senior cardiologist required for specialized consultation'
      },
      {
        id: 'req-2',
        resource_id: 'ecg-machine',
        resource_type_id: 'equipment',
        requirement_type: 'required',
        quantity: 1,
        notes: 'ECG machine needed for cardiac monitoring'
      },
      {
        id: 'req-3',
        resource_id: 'consultation-room-1',
        resource_type_id: 'assets',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Private consultation room'
      }
    ],
    is_active: true,
    is_live: true,
    created_at: '2024-01-16T10:00:00Z',
    hexcolor: '#EF4444',
    icon: '❤️'
  },

  // Service with equipment requirement
  {
    id: 'hvac-diagnostic',
    tenant_id: 'tenant-1',
    name: 'HVAC System Diagnostic',
    description: 'Complete diagnostic assessment of HVAC system using professional diagnostic tools. Includes system performance analysis and recommendations.',
    short_description: 'Professional HVAC system diagnostic with tools',
    base_price: 150,
    currency: 'INR',
    pricing_type: 'fixed',
    duration: 120,
    category: 'hvac-maintenance',
    tags: ['hvac', 'diagnostic', 'professional'],
    resource_requirements: [
      {
        id: 'req-4',
        resource_id: 'tech-john',
        resource_type_id: 'team-staff',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Certified HVAC technician'
      },
      {
        id: 'req-5',
        resource_id: 'hvac-diagnostic-tool',
        resource_type_id: 'equipment',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Professional diagnostic scanner required'
      },
      {
        id: 'req-6',
        resource_id: 'customer-site-access',
        resource_type_id: 'assets',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Access to customer premises'
      }
    ],
    is_active: true,
    is_live: true,
    created_at: '2024-01-17T10:00:00Z',
    hexcolor: '#10B981',
    icon: '🌡️'
  },

  // Service with multiple resource types
  {
    id: 'hvac-quarterly-maintenance',
    tenant_id: 'tenant-1',
    name: 'HVAC Quarterly Maintenance',
    description: 'Comprehensive quarterly maintenance service including filter replacement, system cleaning, and performance optimization. Includes all consumables and professional assessment.',
    short_description: 'Complete quarterly HVAC maintenance with consumables',
    base_price: 300,
    currency: 'INR',
    pricing_type: 'fixed',
    duration: 180,
    category: 'hvac-maintenance',
    tags: ['hvac', 'maintenance', 'quarterly', 'comprehensive'],
    resource_requirements: [
      {
        id: 'req-7',
        resource_id: 'tech-john',
        resource_type_id: 'team-staff',
        requirement_type: 'required',
        quantity: 1,
        notes: 'HVAC technician for maintenance'
      },
      {
        id: 'req-8',
        resource_id: 'hvac-diagnostic-tool',
        resource_type_id: 'equipment',
        requirement_type: 'required',
        quantity: 1,
        notes: 'For system diagnostics'
      },
      {
        id: 'req-9',
        resource_id: 'air-filter-hepa',
        resource_type_id: 'consumables',
        requirement_type: 'required',
        quantity: 2,
        notes: 'High-efficiency filters for replacement'
      },
      {
        id: 'req-10',
        resource_id: 'disinfectant-wipes',
        resource_type_id: 'consumables',
        requirement_type: 'required',
        quantity: 1,
        notes: 'For system cleaning'
      },
      {
        id: 'req-11',
        resource_id: 'customer-site-access',
        resource_type_id: 'assets',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Customer site access for maintenance'
      },
      {
        id: 'req-12',
        resource_id: 'hvac-supplier',
        resource_type_id: 'partners',
        requirement_type: 'optional',
        quantity: 1,
        notes: 'For additional parts if needed'
      }
    ],
    is_active: true,
    is_live: true,
    created_at: '2024-01-18T10:00:00Z',
    hexcolor: '#059669',
    icon: '🔧'
  },

  // General consultation - any doctor
  {
    id: 'general-consultation',
    tenant_id: 'tenant-1',
    name: 'General Medical Consultation',
    description: 'General medical consultation with any available physician. Suitable for routine checkups, minor health concerns, and general medical advice.',
    short_description: 'General medical consultation with available physician',
    base_price: 75,
    currency: 'INR',
    pricing_type: 'fixed',
    duration: 30,
    category: 'medical-consultation',
    tags: ['general', 'consultation', 'routine'],
    resource_requirements: [
      {
        id: 'req-13',
        resource_id: 'dr-priya',
        resource_type_id: 'team-staff',
        requirement_type: 'required',
        quantity: 1,
        notes: 'General physician for consultation'
      },
      {
        id: 'req-14',
        resource_id: 'consultation-room-1',
        resource_type_id: 'assets',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Consultation room'
      }
    ],
    is_active: true,
    is_live: true,
    created_at: '2024-01-19T10:00:00Z',
    hexcolor: '#8B5CF6',
    icon: '🩺'
  },

  // Hourly service
  {
    id: 'technical-support-hourly',
    tenant_id: 'tenant-1',
    name: 'Technical Support (Hourly)',
    description: 'On-demand technical support and troubleshooting services. Billed hourly for flexible support duration based on your needs.',
    short_description: 'Flexible hourly technical support services',
    base_price: 80,
    currency: 'INR',
    pricing_type: 'hourly',
    duration: 60,
    category: 'technical-support',
    tags: ['technical', 'support', 'hourly', 'flexible'],
    resource_requirements: [
      {
        id: 'req-15',
        resource_id: 'tech-john',
        resource_type_id: 'team-staff',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Technical specialist for support'
      }
    ],
    is_active: true,
    is_live: true,
    created_at: '2024-01-20T10:00:00Z',
    hexcolor: '#F59E0B',
    icon: '💻'
  },

  // Mobile service
  {
    id: 'mobile-health-checkup',
    tenant_id: 'tenant-1',
    name: 'Mobile Health Checkup',
    description: 'Comprehensive health checkup at your location using our mobile service unit. Includes basic diagnostics and nurse assistance.',
    short_description: 'Health checkup at your location with mobile unit',
    base_price: 200,
    currency: 'INR',
    pricing_type: 'fixed',
    duration: 90,
    category: 'medical-consultation',
    tags: ['mobile', 'health', 'checkup', 'on-site'],
    resource_requirements: [
      {
        id: 'req-16',
        resource_id: 'dr-priya',
        resource_type_id: 'team-staff',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Doctor for health assessment'
      },
      {
        id: 'req-17',
        resource_id: 'nurse-sarah',
        resource_type_id: 'team-staff',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Nurse for assistance'
      },
      {
        id: 'req-18',
        resource_id: 'service-vehicle-1',
        resource_type_id: 'assets',
        requirement_type: 'required',
        quantity: 1,
        notes: 'Mobile service vehicle'
      },
      {
        id: 'req-19',
        resource_id: 'ultrasound-machine',
        resource_type_id: 'equipment',
        requirement_type: 'optional',
        quantity: 1,
        notes: 'Portable ultrasound if needed'
      }
    ],
    is_active: true,
    is_live: true,
    created_at: '2024-01-21T10:00:00Z',
    hexcolor: '#06B6D4',
    icon: '🚐'
  }
];

// Helper functions for filtering and searching
export const getServicesByCategory = (categoryId: string): MockService[] => {
  return mockServices.filter(service => service.category === categoryId && service.is_active);
};

export const getServiceById = (serviceId: string): MockService | undefined => {
  return mockServices.find(service => service.id === serviceId);
};

export const getActiveServices = (): MockService[] => {
  return mockServices.filter(service => service.is_active);
};

export const searchServices = (query: string): MockService[] => {
  const searchTerm = query.toLowerCase();
  return mockServices.filter(service => 
    service.is_active && (
      service.name.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  );
};

export const getServicesByPricingType = (pricingType: 'fixed' | 'hourly' | 'daily'): MockService[] => {
  return mockServices.filter(service => 
    service.pricing_type === pricingType && service.is_active
  );
};

export const getServicesByResourceType = (resourceTypeId: string): MockService[] => {
  return mockServices.filter(service => 
    service.is_active && 
    service.resource_requirements.some(req => req.resource_type_id === resourceTypeId)
  );
};

export const getServicesWithSpecificResource = (resourceId: string): MockService[] => {
  return mockServices.filter(service => 
    service.is_active && 
    service.resource_requirements.some(req => req.resource_id === resourceId)
  );
};

export const getServicesWithoutResourceRequirements = (): MockService[] => {
  return mockServices.filter(service => 
    service.is_active && 
    service.resource_requirements.length === 0
  );
};

// Service statistics
export const getServiceStats = () => {
  const activeServices = getActiveServices();
  return {
    total: activeServices.length,
    byPricingType: {
      fixed: activeServices.filter(s => s.pricing_type === 'fixed').length,
      hourly: activeServices.filter(s => s.pricing_type === 'hourly').length,
      daily: activeServices.filter(s => s.pricing_type === 'daily').length,
    },
    byCategory: mockServiceCategories.reduce((acc, category) => {
      acc[category.id] = getServicesByCategory(category.id).length;
      return acc;
    }, {} as Record<string, number>),
    withResources: activeServices.filter(s => s.resource_requirements.length > 0).length,
    withoutResources: getServicesWithoutResourceRequirements().length,
    averagePrice: activeServices.reduce((sum, s) => sum + s.base_price, 0) / activeServices.length,
  };
};

// Simulate API delay
export const simulateServiceDelay = (ms: number = 600): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};