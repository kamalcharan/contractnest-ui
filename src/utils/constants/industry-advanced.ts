// src/lib/constants/industries.ts

export interface IndustryCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string; // Optional icon for UI
  defaultPricingModel?: 'per_session' | 'subscription' | 'package' | 'per_unit' | 'hourly';
  suggestedDuration?: number; // in minutes
  commonVariants?: string[]; // Common variants for this category
}

export interface Industry {
  id: string;
  name: string;
  description?: string;
  icon: string; // Lucide icon name
  categories: IndustryCategory[];
  commonPricingRules?: Array<{
    name: string;
    condition: string;
    action: string;
  }>;
  complianceRequirements?: string[];
}

export const industries: Industry[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical services, hospitals, clinics, and healthcare products',
    icon: 'Stethoscope',
    categories: [
      {
        id: 'medical_equipment_amc',
        name: 'Medical Equipment AMC',
        description: 'Maintenance contracts for medical devices',
        defaultPricingModel: 'subscription',
        commonVariants: ['Comprehensive', 'Basic', 'Emergency Only']
      },
      {
        id: 'patient_care_services',
        name: 'Patient Care Services',
        description: 'Direct patient care and support services',
        defaultPricingModel: 'per_session',
        suggestedDuration: 60,
        commonVariants: ['Home Care', 'In-Patient', 'Out-Patient']
      },
      {
        id: 'diagnostic_services',
        name: 'Diagnostic Services',
        description: 'Lab tests, imaging, and diagnostic procedures',
        defaultPricingModel: 'per_unit',
        commonVariants: ['Regular', 'Urgent', 'Home Collection']
      },
      {
        id: 'therapy_rehabilitation',
        name: 'Therapy & Rehabilitation',
        description: 'Physical therapy, occupational therapy, rehab services',
        defaultPricingModel: 'package',
        suggestedDuration: 45,
        commonVariants: ['Individual', 'Group', 'Intensive']
      },
      {
        id: 'medical_consultation',
        name: 'Medical Consultation',
        description: 'Doctor consultations and specialist visits',
        defaultPricingModel: 'per_session',
        suggestedDuration: 30,
        commonVariants: ['In-Person', 'Teleconsultation', 'Follow-up']
      },
      {
        id: 'preventive_health_packages',
        name: 'Preventive Health Packages',
        description: 'Health checkups and wellness packages',
        defaultPricingModel: 'package',
        commonVariants: ['Basic', 'Executive', 'Comprehensive']
      }
    ],
    commonPricingRules: [
      { name: 'Emergency Service', condition: 'service_type = emergency', action: '+50%' },
      { name: 'Home Visit', condition: 'location = home', action: '+30%' },
      { name: 'After Hours', condition: 'time > 8PM', action: '+25%' }
    ],
    complianceRequirements: ['HIPAA', 'Medical Device Regulations', 'Patient Privacy']
  },
  
  {
    id: 'wellness',
    name: 'Wellness & Fitness',
    description: 'Yoga studios, gyms, spas, and wellness centers',
    icon: 'Heart',
    categories: [
      {
        id: 'yoga_meditation',
        name: 'Yoga & Meditation',
        description: 'Yoga classes, meditation sessions, mindfulness',
        defaultPricingModel: 'per_session',
        suggestedDuration: 60,
        commonVariants: ['Morning', 'Evening', 'Weekend', 'Online']
      },
      {
        id: 'spa_services',
        name: 'Spa Services',
        description: 'Massage, facials, body treatments',
        defaultPricingModel: 'per_session',
        suggestedDuration: 90,
        commonVariants: ['Swedish', 'Deep Tissue', 'Aromatherapy', 'Hot Stone']
      },
      {
        id: 'fitness_training',
        name: 'Fitness Training',
        description: 'Personal training, group fitness, strength training',
        defaultPricingModel: 'package',
        suggestedDuration: 60,
        commonVariants: ['Personal', 'Small Group', 'Boot Camp', 'Virtual']
      },
      {
        id: 'nutrition_consultation',
        name: 'Nutrition Consultation',
        description: 'Diet planning, nutritional counseling',
        defaultPricingModel: 'per_session',
        suggestedDuration: 45,
        commonVariants: ['Initial Assessment', 'Follow-up', 'Meal Planning']
      },
      {
        id: 'wellness_packages',
        name: 'Wellness Packages',
        description: 'Comprehensive wellness programs',
        defaultPricingModel: 'package',
        commonVariants: ['Weight Loss', 'Stress Management', 'Detox', 'Immunity']
      },
      {
        id: 'equipment_maintenance',
        name: 'Gym Equipment Maintenance',
        description: 'Maintenance of fitness equipment',
        defaultPricingModel: 'subscription',
        commonVariants: ['Monthly', 'Quarterly', 'On-demand']
      }
    ],
    commonPricingRules: [
      { name: 'Peak Hours', condition: 'time = 6-9AM or 5-8PM', action: '+20%' },
      { name: 'Weekend Premium', condition: 'day = Sat/Sun', action: '+15%' },
      { name: 'New Member Discount', condition: 'customer_type = new', action: '-20%' },
      { name: 'Package Discount', condition: 'sessions >= 10', action: '-10%' }
    ]
  },

  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Production of goods and industrial products',
    icon: 'Factory',
    categories: [
      {
        id: 'equipment_amc',
        name: 'Equipment AMC',
        description: 'Annual maintenance for manufacturing equipment',
        defaultPricingModel: 'subscription',
        commonVariants: ['Comprehensive', 'Preventive Only', 'Breakdown Only']
      },
      {
        id: 'calibration_services',
        name: 'Calibration Services',
        description: 'Instrument and equipment calibration',
        defaultPricingModel: 'per_unit',
        commonVariants: ['On-site', 'Lab', 'Express']
      },
      {
        id: 'quality_inspection',
        name: 'Quality Inspection',
        description: 'Quality control and inspection services',
        defaultPricingModel: 'hourly',
        commonVariants: ['Pre-production', 'In-line', 'Final']
      },
      {
        id: 'spare_parts_supply',
        name: 'Spare Parts Supply',
        description: 'Supply contracts for spare parts',
        defaultPricingModel: 'per_unit',
        commonVariants: ['OEM', 'Compatible', 'Refurbished']
      },
      {
        id: 'technical_support',
        name: 'Technical Support',
        description: 'On-call technical assistance',
        defaultPricingModel: 'subscription',
        commonVariants: ['24x7', 'Business Hours', 'Remote Only']
      },
      {
        id: 'training_services',
        name: 'Training Services',
        description: 'Operator and maintenance training',
        defaultPricingModel: 'per_session',
        suggestedDuration: 240,
        commonVariants: ['Basic', 'Advanced', 'Certification']
      }
    ],
    commonPricingRules: [
      { name: 'Urgent Service', condition: 'priority = urgent', action: '+30%' },
      { name: 'Bulk Discount', condition: 'quantity > 100', action: '-15%' },
      { name: 'Long-term Contract', condition: 'duration >= 3 years', action: '-10%' }
    ],
    complianceRequirements: ['ISO 9001', 'Safety Standards', 'Environmental Regulations']
  },

  {
    id: 'facility_management',
    name: 'Facility Management',
    description: 'Building maintenance, security, housekeeping services',
    icon: 'Building2',
    categories: [
      {
        id: 'elevator_maintenance',
        name: 'Elevator Maintenance',
        description: 'Lift and escalator maintenance services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Full Service', 'Oil & Grease', 'On-call Only']
      },
      {
        id: 'hvac_services',
        name: 'HVAC Services',
        description: 'Heating, ventilation, and air conditioning',
        defaultPricingModel: 'subscription',
        commonVariants: ['Preventive', 'Comprehensive', 'Energy Management']
      },
      {
        id: 'electrical_maintenance',
        name: 'Electrical Maintenance',
        description: 'Electrical systems and equipment maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['LT Panel', 'HT Panel', 'DG Sets', 'UPS']
      },
      {
        id: 'pest_control',
        name: 'Pest Control',
        description: 'Pest management and control services',
        defaultPricingModel: 'package',
        commonVariants: ['General', 'Termite', 'Rodent', 'Integrated']
      },
      {
        id: 'housekeeping',
        name: 'Housekeeping Services',
        description: 'Cleaning and sanitation services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Daily', 'Deep Cleaning', 'Specialized']
      },
      {
        id: 'security_services',
        name: 'Security Services',
        description: 'Manned security and surveillance',
        defaultPricingModel: 'subscription',
        commonVariants: ['24x7', 'Business Hours', 'Event Based']
      },
      {
        id: 'landscaping',
        name: 'Landscaping & Gardening',
        description: 'Garden maintenance and landscaping',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Premium', 'Seasonal']
      }
    ],
    commonPricingRules: [
      { name: 'Multi-location', condition: 'locations > 1', action: '-5% per location' },
      { name: 'Emergency Call-out', condition: 'service_type = emergency', action: '+100%' },
      { name: 'Weekend Service', condition: 'day = weekend', action: '+25%' }
    ]
  },

  {
    id: 'technology',
    name: 'Technology',
    description: 'Software, hardware, IT services, and digital products',
    icon: 'Cpu',
    categories: [
      {
        id: 'software_amc',
        name: 'Software AMC',
        description: 'Annual maintenance for software applications',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic Support', 'Premium Support', 'Enterprise']
      },
      {
        id: 'it_infrastructure',
        name: 'IT Infrastructure Support',
        description: 'Server, network, and infrastructure maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Monitoring Only', 'Managed Services', 'Full Support']
      },
      {
        id: 'cloud_services',
        name: 'Cloud Services',
        description: 'Cloud hosting and management',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Standard', 'Premium', 'Enterprise']
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity Services',
        description: 'Security monitoring and protection',
        defaultPricingModel: 'subscription',
        commonVariants: ['Monitoring', 'Managed SOC', 'Incident Response']
      },
      {
        id: 'development_services',
        name: 'Development Services',
        description: 'Custom software development',
        defaultPricingModel: 'hourly',
        commonVariants: ['Fixed Price', 'Time & Material', 'Retainer']
      },
      {
        id: 'training_certification',
        name: 'Training & Certification',
        description: 'Technical training and certification programs',
        defaultPricingModel: 'per_session',
        suggestedDuration: 480,
        commonVariants: ['Online', 'Classroom', 'Corporate']
      }
    ],
    commonPricingRules: [
      { name: 'SLA Premium', condition: 'sla = 99.9%', action: '+25%' },
      { name: 'After Hours Support', condition: 'support_hours = 24x7', action: '+40%' },
      { name: 'Multi-year Discount', condition: 'contract_years >= 3', action: '-15%' }
    ]
  },

  {
    id: 'education',
    name: 'Education',
    description: 'Schools, universities, e-learning, and educational services',
    icon: 'GraduationCap',
    categories: [
      {
        id: 'tuition_classes',
        name: 'Tuition Classes',
        description: 'Academic tutoring and coaching',
        defaultPricingModel: 'package',
        suggestedDuration: 90,
        commonVariants: ['Individual', 'Group', 'Online', 'Hybrid']
      },
      {
        id: 'skill_development',
        name: 'Skill Development',
        description: 'Professional skill training',
        defaultPricingModel: 'package',
        commonVariants: ['Basic', 'Intermediate', 'Advanced', 'Certification']
      },
      {
        id: 'test_preparation',
        name: 'Test Preparation',
        description: 'Entrance exam and competitive test prep',
        defaultPricingModel: 'package',
        commonVariants: ['Crash Course', 'Regular', 'Intensive', 'Mock Tests']
      },
      {
        id: 'lab_equipment_amc',
        name: 'Lab Equipment AMC',
        description: 'Maintenance of laboratory equipment',
        defaultPricingModel: 'subscription',
        commonVariants: ['Comprehensive', 'Preventive', 'Calibration Only']
      },
      {
        id: 'digital_infrastructure',
        name: 'Digital Infrastructure',
        description: 'LMS, digital classroom maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Premium', 'Enterprise']
      },
      {
        id: 'transport_services',
        name: 'Transport Services',
        description: 'Student transportation services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Full Route', 'Partial Route', 'Special Events']
      }
    ],
    commonPricingRules: [
      { name: 'Early Bird Discount', condition: 'enrollment = early', action: '-15%' },
      { name: 'Sibling Discount', condition: 'siblings > 1', action: '-10%' },
      { name: 'Bulk Sessions', condition: 'sessions > 20', action: '-20%' }
    ]
  },

  {
    id: 'financial_services',
    name: 'Financial Services',
    description: 'Banking, insurance, investments, and financial consulting',
    icon: 'DollarSign',
    categories: [
      {
        id: 'financial_advisory',
        name: 'Financial Advisory',
        description: 'Investment and financial planning services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Premium', 'Wealth Management', 'Family Office']
      },
      {
        id: 'tax_consulting',
        name: 'Tax Consulting',
        description: 'Tax planning and filing services',
        defaultPricingModel: 'package',
        commonVariants: ['Individual', 'Business', 'Corporate', 'International']
      },
      {
        id: 'audit_services',
        name: 'Audit Services',
        description: 'Financial audit and compliance',
        defaultPricingModel: 'package',
        commonVariants: ['Statutory', 'Internal', 'Tax', 'Special']
      },
      {
        id: 'accounting_services',
        name: 'Accounting Services',
        description: 'Bookkeeping and accounting',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic Books', 'Full Service', 'CFO Services']
      },
      {
        id: 'compliance_services',
        name: 'Compliance Services',
        description: 'Regulatory compliance and reporting',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Comprehensive', 'International']
      },
      {
        id: 'payroll_services',
        name: 'Payroll Services',
        description: 'Payroll processing and management',
        defaultPricingModel: 'per_unit',
        commonVariants: ['Basic', 'With Compliance', 'Fully Managed']
      }
    ],
    commonPricingRules: [
      { name: 'Asset Based Fee', condition: 'aum > 10cr', action: 'Tiered Pricing' },
      { name: 'Retainer Discount', condition: 'payment = annual', action: '-10%' },
      { name: 'Success Fee', condition: 'performance > benchmark', action: '+20% bonus' }
    ],
    complianceRequirements: ['SEBI Regulations', 'Tax Laws', 'Audit Standards']
  },

  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    description: 'Hotels, restaurants, tourism, and travel services',
    icon: 'UtensilsCrossed',
    categories: [
      {
        id: 'kitchen_equipment_amc',
        name: 'Kitchen Equipment AMC',
        description: 'Commercial kitchen equipment maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Comprehensive', 'Preventive', 'Breakdown']
      },
      {
        id: 'laundry_services',
        name: 'Laundry Services',
        description: 'Commercial laundry and linen services',
        defaultPricingModel: 'per_unit',
        commonVariants: ['Regular', 'Express', 'Specialized']
      },
      {
        id: 'pest_control_hospitality',
        name: 'Pest Control - F&B',
        description: 'Specialized pest control for food establishments',
        defaultPricingModel: 'subscription',
        commonVariants: ['Monthly', 'Fortnightly', 'Weekly']
      },
      {
        id: 'event_management',
        name: 'Event Management',
        description: 'Event planning and management services',
        defaultPricingModel: 'package',
        commonVariants: ['Corporate', 'Social', 'Wedding', 'Conference']
      },
      {
        id: 'pos_maintenance',
        name: 'POS System Maintenance',
        description: 'Point of sale system support',
        defaultPricingModel: 'subscription',
        commonVariants: ['Hardware Only', 'Software Only', 'Full Support']
      },
      {
        id: 'guest_amenities',
        name: 'Guest Amenities Supply',
        description: 'Regular supply of guest amenities',
        defaultPricingModel: 'subscription',
        commonVariants: ['Standard', 'Premium', 'Luxury']
      }
    ],
    commonPricingRules: [
      { name: 'Peak Season', condition: 'season = peak', action: '+30%' },
      { name: 'Long Stay Discount', condition: 'nights > 7', action: '-15%' },
      { name: 'Group Booking', condition: 'rooms > 10', action: '-20%' }
    ],
    complianceRequirements: ['Food Safety', 'Fire Safety', 'Hygiene Standards']
  },

  {
    id: 'retail',
    name: 'Retail',
    description: 'Sale of goods to consumers through stores or online platforms',
    icon: 'ShoppingBag',
    categories: [
      {
        id: 'pos_equipment_amc',
        name: 'POS Equipment AMC',
        description: 'Point of sale hardware maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Comprehensive', '24x7 Support']
      },
      {
        id: 'refrigeration_amc',
        name: 'Refrigeration AMC',
        description: 'Cold storage and refrigeration maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Preventive', 'Comprehensive', 'Emergency Only']
      },
      {
        id: 'security_systems',
        name: 'Security Systems',
        description: 'CCTV and security system maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Monitoring Only', 'Full Maintenance', 'Cloud Storage']
      },
      {
        id: 'inventory_management',
        name: 'Inventory Management',
        description: 'Inventory tracking and management services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'RFID Enabled', 'Full Service']
      },
      {
        id: 'visual_merchandising',
        name: 'Visual Merchandising',
        description: 'Store display and merchandising services',
        defaultPricingModel: 'package',
        commonVariants: ['Seasonal', 'Monthly', 'Event Based']
      },
      {
        id: 'delivery_logistics',
        name: 'Delivery & Logistics',
        description: 'Last mile delivery services',
        defaultPricingModel: 'per_unit',
        commonVariants: ['Same Day', 'Next Day', 'Scheduled']
      }
    ],
    commonPricingRules: [
      { name: 'Multi-store Discount', condition: 'stores > 5', action: '-10%' },
      { name: 'Holiday Premium', condition: 'date = holiday', action: '+25%' },
      { name: 'Bulk Order', condition: 'quantity > 1000', action: '-15%' }
    ]
  },

  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car manufacturing, dealerships, and automotive services',
    icon: 'Car',
    categories: [
      {
        id: 'vehicle_service_packages',
        name: 'Vehicle Service Packages',
        description: 'Periodic maintenance packages',
        defaultPricingModel: 'package',
        commonVariants: ['Basic', 'Comprehensive', 'Premium']
      },
      {
        id: 'extended_warranty',
        name: 'Extended Warranty',
        description: 'Extended warranty programs',
        defaultPricingModel: 'package',
        commonVariants: ['1 Year', '2 Years', '3 Years', '5 Years']
      },
      {
        id: 'roadside_assistance',
        name: 'Roadside Assistance',
        description: '24x7 breakdown assistance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Premium', 'Elite']
      },
      {
        id: 'fleet_maintenance',
        name: 'Fleet Maintenance',
        description: 'Commercial fleet maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Preventive Only', 'Full Service', 'Pay Per Use']
      },
      {
        id: 'car_detailing',
        name: 'Car Detailing Services',
        description: 'Professional cleaning and detailing',
        defaultPricingModel: 'per_session',
        commonVariants: ['Basic Wash', 'Full Detail', 'Ceramic Coating']
      },
      {
        id: 'spare_parts_contract',
        name: 'Spare Parts Contract',
        description: 'OEM spare parts supply agreement',
        defaultPricingModel: 'per_unit',
        commonVariants: ['Genuine Parts', 'OES Parts', 'Aftermarket']
      }
    ],
    commonPricingRules: [
      { name: 'Loyalty Discount', condition: 'customer_years > 3', action: '-10%' },
      { name: 'Multi-vehicle', condition: 'vehicles > 1', action: '-15%' },
      { name: 'Prepaid Bonus', condition: 'payment = advance', action: '+2 free services' }
    ]
  },

  {
    id: 'real_estate',
    name: 'Real Estate',
    description: 'Property management, real estate services',
    icon: 'Home',
    categories: [
      {
        id: 'property_management',
        name: 'Property Management',
        description: 'Complete property management services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Residential', 'Commercial', 'Mixed Use']
      },
      {
        id: 'facility_maintenance',
        name: 'Facility Maintenance',
        description: 'Building maintenance services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Comprehensive', 'Premium']
      },
      {
        id: 'common_area_maintenance',
        name: 'Common Area Maintenance',
        description: 'Maintenance of common areas',
        defaultPricingModel: 'per_unit',
        commonVariants: ['Per Sq Ft', 'Per Unit', 'Fixed Fee']
      },
      {
        id: 'rental_management',
        name: 'Rental Management',
        description: 'Tenant and rental management',
        defaultPricingModel: 'subscription',
        commonVariants: ['Finding Only', 'Full Management', 'Collection Only']
      },
      {
        id: 'security_services_re',
        name: 'Security Services',
        description: 'Property security services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Manned', 'Electronic', 'Integrated']
      },
      {
        id: 'landscaping_maintenance',
        name: 'Landscaping Maintenance',
        description: 'Garden and landscape upkeep',
        defaultPricingModel: 'subscription',
        commonVariants: ['Weekly', 'Bi-weekly', 'Monthly']
      }
    ],
    commonPricingRules: [
      { name: 'Multiple Properties', condition: 'properties > 3', action: '-12%' },
      { name: 'Annual Contract', condition: 'duration = annual', action: '-8%' },
      { name: 'Exclusive Management', condition: 'exclusive = true', action: '+15%' }
    ]
  },

  {
    id: 'telecommunications',
    name: 'Telecommunications',
    description: 'Phone, internet, and communication services',
    icon: 'Phone',
    categories: [
      {
        id: 'tower_maintenance',
        name: 'Tower Maintenance',
        description: 'Telecom tower maintenance services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Passive Infra', 'Active Components', 'Full Service']
      },
      {
        id: 'network_maintenance',
        name: 'Network Maintenance',
        description: 'Network infrastructure maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Monitoring', 'Preventive', 'Comprehensive']
      },
      {
        id: 'fiber_maintenance',
        name: 'Fiber Optic Maintenance',
        description: 'Fiber network maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Underground', 'Aerial', 'Last Mile']
      },
      {
        id: 'bts_maintenance',
        name: 'BTS Maintenance',
        description: 'Base station maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Indoor', 'Outdoor', 'Remote Sites']
      },
      {
        id: 'power_systems',
        name: 'Power Systems AMC',
        description: 'Battery and power system maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Battery Only', 'Rectifier', 'Complete System']
      },
      {
        id: 'enterprise_support',
        name: 'Enterprise Support',
        description: 'Enterprise telecom support',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Premium', 'Dedicated']
      }
    ],
    commonPricingRules: [
      { name: 'SLA Based', condition: 'uptime_sla > 99.5%', action: '+20%' },
      { name: 'Remote Location', condition: 'location = remote', action: '+35%' },
      { name: 'Multi-site', condition: 'sites > 50', action: '-15%' }
    ]
  },

  {
    id: 'logistics',
    name: 'Transportation & Logistics',
    description: 'Transport of goods and people, logistics operations',
    icon: 'Truck',
    categories: [
      {
        id: 'fleet_maintenance_logistics',
        name: 'Fleet Maintenance',
        description: 'Vehicle fleet maintenance services',
        defaultPricingModel: 'subscription',
        commonVariants: ['Per Vehicle', 'Unlimited', 'Pay Per Service']
      },
      {
        id: 'warehouse_equipment',
        name: 'Warehouse Equipment AMC',
        description: 'Material handling equipment maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Forklifts', 'Conveyors', 'Racking Systems']
      },
      {
        id: 'gps_tracking',
        name: 'GPS Tracking Services',
        description: 'Vehicle tracking and monitoring',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic Tracking', 'Advanced Analytics', 'Full Telematics']
      },
      {
        id: 'cold_chain',
        name: 'Cold Chain Maintenance',
        description: 'Refrigerated transport maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Monitoring Only', 'Full Maintenance', 'Emergency Support']
      },
      {
        id: 'loading_equipment',
        name: 'Loading Equipment Services',
        description: 'Dock and loading equipment maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Preventive', 'Comprehensive', 'On-call']
      },
      {
        id: 'transport_contracts',
        name: 'Transport Contracts',
        description: 'Dedicated transport services',
        defaultPricingModel: 'per_unit',
        commonVariants: ['FTL', 'LTL', 'Express', 'Scheduled']
      }
    ],
    commonPricingRules: [
      { name: 'Volume Discount', condition: 'monthly_trips > 100', action: '-12%' },
      { name: 'Fuel Surcharge', condition: 'fuel_price > baseline', action: 'Variable' },
      { name: 'Express Service', condition: 'delivery = same_day', action: '+50%' }
    ]
  },

  {
    id: 'government',
    name: 'Government',
    description: 'Public administration, governmental agencies and services',
    icon: 'Landmark',
    categories: [
      {
        id: 'it_infrastructure_gov',
        name: 'IT Infrastructure Support',
        description: 'Government IT systems maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['L1 Support', 'L2 Support', 'L3 Support', 'Turnkey']
      },
      {
        id: 'facility_management_gov',
        name: 'Facility Management',
        description: 'Government building maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Comprehensive', 'Specialized', 'Heritage Buildings']
      },
      {
        id: 'vehicle_maintenance_gov',
        name: 'Vehicle Fleet Maintenance',
        description: 'Government vehicle maintenance',
        defaultPricingModel: 'subscription',
        commonVariants: ['Light Vehicles', 'Heavy Vehicles', 'Special Purpose']
      },
      {
        id: 'security_services_gov',
        name: 'Security Services',
        description: 'Government facility security',
        defaultPricingModel: 'subscription',
        commonVariants: ['Manned Guarding', 'Electronic', 'Integrated']
      },
      {
        id: 'equipment_calibration',
        name: 'Equipment Calibration',
        description: 'Scientific equipment calibration',
        defaultPricingModel: 'per_unit',
        commonVariants: ['NABL Certified', 'Standard', 'On-site']
      },
      {
        id: 'annual_rate_contracts',
        name: 'Annual Rate Contracts',
        description: 'Supply and service rate contracts',
        defaultPricingModel: 'per_unit',
        commonVariants: ['Goods Supply', 'Services', 'Combined']
      }
    ],
    commonPricingRules: [
      { name: 'GeM Portal Rates', condition: 'procurement = GeM', action: 'As per GeM' },
      { name: 'L1 Pricing', condition: 'tender = competitive', action: 'Lowest Quote' },
      { name: 'CENVAT Benefit', condition: 'tax_benefit = applicable', action: 'Pass through' }
    ],
    complianceRequirements: ['Government Procurement Rules', 'Tender Conditions', 'Quality Standards']
  },

  {
    id: 'other',
    name: 'Other',
    description: 'Industries not covered by other categories',
    icon: 'MoreHorizontal',
    categories: [
      {
        id: 'general_services',
        name: 'General Services',
        description: 'Miscellaneous service offerings',
        defaultPricingModel: 'per_session',
        commonVariants: ['Standard', 'Premium', 'Custom']
      },
      {
        id: 'consulting_services',
        name: 'Consulting Services',
        description: 'Professional consulting',
        defaultPricingModel: 'hourly',
        commonVariants: ['Strategic', 'Operational', 'Technical']
      },
      {
        id: 'maintenance_services',
        name: 'Maintenance Services',
        description: 'General maintenance contracts',
        defaultPricingModel: 'subscription',
        commonVariants: ['Basic', 'Standard', 'Comprehensive']
      },
      {
        id: 'supply_contracts',
        name: 'Supply Contracts',
        description: 'Regular supply agreements',
        defaultPricingModel: 'per_unit',
        commonVariants: ['Scheduled', 'On-demand', 'Bulk']
      },
      {
        id: 'rental_services',
        name: 'Rental/Lease Services',
        description: 'Equipment and asset rentals',
        defaultPricingModel: 'subscription',
        commonVariants: ['Short-term', 'Long-term', 'Rent-to-own']
      },
      {
        id: 'custom_contracts',
        name: 'Custom Contracts',
        description: 'Specialized contract types',
        defaultPricingModel: 'package',
        commonVariants: ['Fixed Price', 'Variable', 'Hybrid']
      }
    ],
    commonPricingRules: [
      { name: 'Standard Discount', condition: 'volume > threshold', action: '-10%' },
      { name: 'Premium Service', condition: 'service_level = premium', action: '+25%' },
      { name: 'Long-term Contract', condition: 'duration > 1 year', action: '-5%' }
    ]
  }
];

// Helper function to get categories by industry
export const getCategoriesByIndustry = (industryId: string): IndustryCategory[] => {
  const industry = industries.find(ind => ind.id === industryId);
  return industry?.categories || industries.find(ind => ind.id === 'other')?.categories || [];
};

// Helper function to get pricing rules by industry
export const getPricingRulesByIndustry = (industryId: string) => {
  const industry = industries.find(ind => ind.id === industryId);
  return industry?.commonPricingRules || [];
};

// Helper function to get compliance requirements
export const getComplianceByIndustry = (industryId: string): string[] => {
  const industry = industries.find(ind => ind.id === industryId);
  return industry?.complianceRequirements || [];
};

// Helper function to suggest categories based on keywords
export const suggestCategories = (industryId: string, keywords: string): IndustryCategory[] => {
  const categories = getCategoriesByIndustry(industryId);
  const lowerKeywords = keywords.toLowerCase();
  
  return categories.filter(cat => 
    cat.name.toLowerCase().includes(lowerKeywords) ||
    cat.description?.toLowerCase().includes(lowerKeywords)
  );
};