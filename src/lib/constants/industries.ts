// src/lib/constants/industries.ts
export interface Industry {
  id: string;
  name: string;
  description?: string;
  icon: string; // Lucide icon name
}

export const industries: Industry[] = [
  { 
    id: 'healthcare', 
    name: 'Healthcare',
    description: 'Medical services, hospitals, clinics, and healthcare products',
    icon: 'Stethoscope'
  },
  { 
    id: 'financial_services', 
    name: 'Financial Services',
    description: 'Banking, insurance, investments, and financial consulting',
    icon: 'DollarSign'
  },
  { 
    id: 'manufacturing', 
    name: 'Manufacturing',
    description: 'Production of goods and industrial products',
    icon: 'Factory'
  },
  { 
    id: 'retail', 
    name: 'Retail',
    description: 'Sale of goods to consumers through stores or online platforms',
    icon: 'ShoppingBag'
  },
  { 
    id: 'technology', 
    name: 'Technology',
    description: 'Software, hardware, IT services, and digital products',
    icon: 'Cpu'
  },
  { 
    id: 'education', 
    name: 'Education',
    description: 'Schools, universities, e-learning, and educational services',
    icon: 'GraduationCap'
  },
  { 
    id: 'government', 
    name: 'Government',
    description: 'Public administration, governmental agencies and services',
    icon: 'Landmark'
  },
  { 
    id: 'nonprofit', 
    name: 'Non-profit',
    description: 'Charitable organizations and social initiatives',
    icon: 'Heart'
  },
  { 
    id: 'professional_services', 
    name: 'Professional Services',
    description: 'Legal, accounting, consulting, and other professional services',
    icon: 'Briefcase'
  },
  { 
    id: 'telecommunications', 
    name: 'Telecommunications',
    description: 'Phone, internet, and communication services',
    icon: 'Phone'
  },
  { 
    id: 'transportation', 
    name: 'Transportation & Logistics',
    description: 'Transport of goods and people, logistics operations',
    icon: 'Truck'
  },
  { 
    id: 'energy', 
    name: 'Energy & Utilities',
    description: 'Power generation, distribution, and utility services',
    icon: 'Zap'
  },
  { 
    id: 'construction', 
    name: 'Construction & Real Estate',
    description: 'Building, property development, and real estate services',
    icon: 'Construction'
  },
  { 
    id: 'hospitality', 
    name: 'Hospitality & Tourism',
    description: 'Hotels, restaurants, tourism, and travel services',
    icon: 'UtensilsCrossed'
  },
  { 
    id: 'media', 
    name: 'Media & Entertainment',
    description: 'TV, film, music, publishing, and digital content creation',
    icon: 'Film'
  },
  { 
    id: 'agriculture', 
    name: 'Agriculture',
    description: 'Farming, livestock, and agricultural products',
    icon: 'Wheat'
  },
  { 
    id: 'pharma', 
    name: 'Pharmaceuticals',
    description: 'Medication development, production, and distribution',
    icon: 'Pill'
  },
  { 
    id: 'automotive', 
    name: 'Automotive',
    description: 'Car manufacturing, dealerships, and automotive services',
    icon: 'Car'
  },
  { 
    id: 'aerospace', 
    name: 'Aerospace & Defense',
    description: 'Aircraft, spacecraft, and defense technologies',
    icon: 'Plane'
  },
  { 
    id: 'other', 
    name: 'Other',
    description: 'Industries not covered by other categories',
    icon: 'MoreHorizontal'
  }
];