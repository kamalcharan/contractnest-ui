// src/lib/constants/businessTypes.ts
export interface BusinessType {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
}

export const businessTypes: BusinessType[] = [
  {
    id: 'service_provider',
    name: 'Service Provider',
    description: 'Businesses that offer professional services to other businesses or customers',
    icon: 'Building2'
  },
  {
    id: 'merchant',
    name: 'Merchant',
    description: 'Businesses that sell products or goods to customers',
    icon: 'ShoppingCart'
  }
];