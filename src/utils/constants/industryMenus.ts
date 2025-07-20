// src/utils/constants/industryMenus.ts
import { industries } from '../../lib/constants/industries';

// Menu item interface
export interface MenuItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  path: string;
  adminOnly?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: MenuItem[];
}

// Default menu structure
export const defaultMenuItems: MenuItem[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: 'Compass',
    path: '/getting-started',
    hasSubmenu: false
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    path: '/dashboard',
    hasSubmenu: false
  },
  {
  id: 'contacts',
  label: 'Contacts',
  icon: 'Users',
  path: '/contacts',
  hasSubmenu: true,
  submenuItems: [
    {
      id: 'contacts-list',
      label: 'All Contacts',
      icon: 'List',
      path: '/contacts'
    },
    {
      id: 'contacts-create',
      label: 'Add Contact',
      icon: 'UserPlus',
      path: '/contacts/create'  // Changed from /contacts/new
    },
    
  ]
},

 {
    id: 'contracts',
    label: 'Contracts',
    icon: 'FileText',
    path: '/contracts',
    hasSubmenu: true,
    submenuItems: [
      {
        id: 'contracts-list',
        label: 'All Contracts',
        icon: 'List',
        path: '/contracts'
      },
      {
        id: 'contracts-create',
        label: 'Create Contract',
        icon: 'FilePlus',
        path: '/contracts/new'
      }
    ]
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: 'Calendar',
    path: '/appointments',
    hasSubmenu: false
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'CheckSquare',
    path: '/tasks',
    hasSubmenu: false
  },
  {
    id: 'vani',
    label: 'VaNi',
    icon: 'MessageSquare',
    path: '/vani',
    hasSubmenu: false
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: 'ShoppingBag',
    path: '/marketplace',
    hasSubmenu: false
  },
  // Settings menu with submenu for Configure and Template Designer
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    hasSubmenu: true,
    submenuItems: [
      {
        id: 'settings-configure',
        label: 'Configure',
        icon: 'Sliders',
        path: '/settings/configure'
      },
      {
        id: 'settings-templates',
        label: 'Template Designer',
        icon: 'FileText',
        path: '/settings/templates'
      },
      {
  id: 'pricing-plans',
  label: 'Pricing Plans',
  icon: 'CreditCard',
  path: '/businessmodel/tenants/pricing-plans',
  hasSubmenu: false
},
{
  id: 'my-subscription',
  label: 'My Subscription',
  icon: 'Package',
  path: '/businessmodel/tenants/subscription',
  hasSubmenu: false
}
    ]
  },
  // Admin menus below
  {
    id: 'implementation-toolkit',
    label: 'Implementation Toolkit',
    icon: 'Tool',
    path: '/implementation',
    adminOnly: true,
    hasSubmenu: true,
    submenuItems: [
      {
        id: 'configure-plan',
        label: 'Configure Plan',
        icon: 'Settings',
        path: '/settings/businessmodel/admin/pricing-plans'
      },
      {
        id: 'plan-detail',
        label: 'Plan Detail',
        icon: 'FileText',
        path: '/implementation/plan-detail'
      },
      {
        id: 'plan-versions',
        label: 'Plan Versions',
        icon: 'GitBranch',
        path: '/implementation/plan-versions'
      },
      {
        id: 'subscription-dashboard',
        label: 'Subscription Dashboard',
        icon: 'BarChart',
        path: '/implementation/subscription-dashboard'
      },
      {
        id: 'subscription-management',
        label: 'Subscription Management',
        icon: 'CreditCard',
        path: '/implementation/subscription-management'
      },
       {
      id: 'billing-dashboard',
      label: 'Billing Dashboard',
      icon: 'CreditCard',
      path: '/settings/businessmodel/admin/billing'
    },
    ]
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: 'UserCog',
    path: '/user-management',
    adminOnly: true,
    hasSubmenu: false
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart2',
    path: '/analytics',
    adminOnly: true,
    hasSubmenu: false
  }
];

// Industry-specific menu overrides
export const industryMenuOverrides: Record<string, Partial<Record<string, { label: string, icon?: string }>>> = {
  healthcare: {
    contracts: { label: 'Care Packages', icon: 'Stethoscope' },
    appointments: { label: 'Patient Appointments', icon: 'Stethoscope' },
    contacts: { label: 'Patients & Staff', icon: 'Users' },
    'implementation-toolkit': { label: 'Clinical Implementation Tools', icon: 'Stethoscope' }
  },
  financial_services: {
    contracts: { label: 'Financial Agreements', icon: 'DollarSign' },
    appointments: { label: 'Client Meetings', icon: 'Calendar' },
    contacts: { label: 'Clients & Partners', icon: 'Users' },
    'implementation-toolkit': { label: 'Financial Implementation Suite', icon: 'DollarSign' }
  },
  education: {
    contracts: { label: 'Learning Programs', icon: 'GraduationCap' },
    appointments: { label: 'Sessions', icon: 'Calendar' },
    contacts: { label: 'Students & Faculty', icon: 'Users' },
    'implementation-toolkit': { label: 'Education Implementation Tools', icon: 'GraduationCap' }
  },
  construction: {
    contracts: { label: 'Project Contracts', icon: 'Hammer' },
    appointments: { label: 'Site Visits', icon: 'MapPin' },
    contacts: { label: 'Contractors & Clients', icon: 'Users' },
    'implementation-toolkit': { label: 'Construction Implementation Kit', icon: 'Hammer' }
  },
  // Add more industries as needed
};

// Get industry-specific menu items
export const getMenuItemsForIndustry = (industryId: string | undefined): MenuItem[] => {
  if (!industryId) return defaultMenuItems;
  
  // Start with the default menu items
  const menuItems = [...defaultMenuItems];
  
  // Apply industry-specific overrides if they exist
  const overrides = industryMenuOverrides[industryId];
  if (overrides) {
    menuItems.forEach(item => {
      const override = overrides[item.id];
      if (override) {
        item.label = override.label || item.label;
        item.icon = override.icon || item.icon;
      }
      
      // Also check submenu items
      if (item.hasSubmenu && item.submenuItems) {
        item.submenuItems.forEach(subItem => {
          const subOverride = overrides[subItem.id];
          if (subOverride) {
            subItem.label = subOverride.label || subItem.label;
            subItem.icon = subOverride.icon || subItem.icon;
          }
        });
      }
    });
  }
  
  return menuItems;
};