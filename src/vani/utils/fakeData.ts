// src/vani/utils/realisticFakeData.ts

export interface BusinessEvent {
  id: string;
  tenantId: string;
  sourceModule: 'contracts' | 'invoicing' | 'services' | 'crm' | 'support';
  sourceSystem: string;
  
  // Business Entity
  entityType: 'contract' | 'invoice' | 'service' | 'customer' | 'ticket';
  entityId: string;
  entityName: string;
  
  // Contact Information
  contactId: string;
  contactName: string;
  contactType: 'buyer' | 'vendor' | 'technician' | 'manager';
  contactChannels: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  
  // Event Details
  eventType: string;
  eventDate: string;
  status: 'planned' | 'reminded' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: number;
  
  // Business Context
  metadata: {
    contractId?: string;
    serviceNumber?: number;
    totalServices?: number;
    amount?: number;
    dueDate?: string;
    dependencies?: string[];
    [key: string]: any;
  };
  
  // Communication Rules
  reminderRules?: {
    beforeDays: number[];
    channels: string[];
    templateId: string;
    escalationRules?: any;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface EventDrivenJob {
  id: string;
  tenantId: string;
  businessEventId: string;
  
  // Job Details
  jobType: 'reminder' | 'followup' | 'escalation' | 'confirmation' | 'survey';
  jobName: string;
  priority: number;
  
  // Business Context (denormalized for performance)
  sourceModule: string;
  entityType: string;
  entityId: string;
  contactId: string;
  businessContext: {
    contractId?: string;
    contractName?: string;
    serviceNumber?: number;
    totalServices?: number;
    invoiceNumber?: string;
    amount?: number;
    [key: string]: any;
  };
  
  // Recipients with business context
  recipients: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    details: Array<{
      id: string;
      name: string;
      email?: string;
      phone?: string;
      type: string;
      businessRole: string;
    }>;
  };
  
  // Channels and content
  channels: ('sms' | 'email' | 'whatsapp' | 'push' | 'widget')[];
  templateId?: string;
  contentData: {
    [channel: string]: {
      subject?: string;
      message: string;
      variables: Record<string, any>;
    };
  };
  
  // Execution
  triggerDate: string;
  scheduledAt?: string;
  executedAt?: string;
  completedAt?: string;
  
  // Status
  status: 'pending' | 'staged' | 'executing' | 'completed' | 'failed' | 'cancelled';
  executionStatus: {
    [channel: string]: {
      status: 'pending' | 'sent' | 'delivered' | 'failed';
      sentAt?: string;
      deliveredAt?: string;
      error?: string;
      cost: number;
    };
  };
  
  // Dependencies
  dependsOn: string[];
  triggers: string[];
  
  // Cost and analytics
  cost: string;
  successRate: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  tenantId: string;
  name: string;
  type: 'hvac_maintenance' | 'security_system' | 'cleaning_service' | 'it_support';
  customerId: string;
  customerName: string;
  
  // Contract details
  startDate: string;
  endDate: string;
  totalValue: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
  serviceFrequency: 'weekly' | 'monthly' | 'quarterly';
  
  // Service schedule
  totalServices: number;
  servicesCompleted: number;
  nextServiceDate: string;
  
  // Payment schedule
  totalPayments: number;
  paymentsReceived: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  
  status: 'active' | 'expiring' | 'expired' | 'cancelled';
  createdAt: string;
}

// Realistic Business Events Data
export const realisticBusinessEvents: BusinessEvent[] = [
  // HVAC Contract - Service Events
  {
    id: 'evt_001',
    tenantId: '12891212',
    sourceModule: 'contracts',
    sourceSystem: 'ContractNest v2.1',
    
    entityType: 'contract',
    entityId: '892323',
    entityName: 'HVAC Maintenance Contract - Agilent Tech',
    
    contactId: '8928323',
    contactName: 'Agilent Technologies',
    contactType: 'buyer',
    contactChannels: {
      email: 'facilities@agilent.com',
      phone: '+919876543210',
      whatsapp: '+919876543210'
    },
    
    eventType: 'service_due',
    eventDate: '2025-08-15T09:00:00Z',
    status: 'planned',
    priority: 8,
    
    metadata: {
      contractId: '892323',
      serviceNumber: 8,
      totalServices: 12,
      serviceType: 'Monthly HVAC Maintenance',
      technician: 'Rajesh Kumar',
      estimatedDuration: '2 hours',
      lastServiceDate: '2025-07-15T09:00:00Z',
      nextServiceDate: '2025-09-15T09:00:00Z',
      equipmentIds: ['HVAC-001', 'HVAC-002', 'HVAC-003'],
      checklist: ['Filter replacement', 'Coil cleaning', 'Refrigerant check']
    },
    
    reminderRules: {
      beforeDays: [7, 3, 1],
      channels: ['email', 'sms'],
      templateId: 'service_reminder_hvac',
      escalationRules: {
        noResponseDays: 2,
        escalateTo: ['manager@agilent.com'],
        escalationTemplate: 'service_escalation'
      }
    },
    
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-08-01T10:00:00Z'
  },
  
  // Payment Due Event
  {
    id: 'evt_002',
    tenantId: '12891212',
    sourceModule: 'invoicing',
    sourceSystem: 'ContractNest Billing v2.1',
    
    entityType: 'invoice',
    entityId: 'INV-2025-Q3-001',
    entityName: 'Q3 2025 HVAC Maintenance Payment',
    
    contactId: '8928323',
    contactName: 'Agilent Technologies',
    contactType: 'buyer',
    contactChannels: {
      email: 'accounts@agilent.com',
      phone: '+919876543210'
    },
    
    eventType: 'payment_due',
    eventDate: '2025-08-30T23:59:59Z',
    status: 'reminded',
    priority: 9,
    
    metadata: {
      contractId: '892323',
      invoiceNumber: 'INV-2025-Q3-001',
      amount: 12000,
      currency: 'INR',
      dueDate: '2025-08-30T23:59:59Z',
      paymentMethod: 'bank_transfer',
      quarterCovered: 'Q3 2025',
      servicesIncluded: ['July Service', 'August Service', 'September Service'],
      previousPaymentDate: '2025-05-30T10:15:00Z',
      accountsReceivableAge: 15
    },
    
    reminderRules: {
      beforeDays: [10, 5, 1],
      channels: ['email'],
      templateId: 'payment_reminder_quarterly',
      escalationRules: {
        overdueDay: 1,
        escalateTo: ['collections@contractnest.com'],
        escalationTemplate: 'payment_overdue'
      }
    },
    
    createdAt: '2025-07-20T10:00:00Z',
    updatedAt: '2025-08-15T14:30:00Z'
  },
  
  // IT Support Contract - Service Event
  {
    id: 'evt_003',
    tenantId: '12891212',
    sourceModule: 'contracts',
    sourceSystem: 'ContractNest v2.1',
    
    entityType: 'contract',
    entityId: '892324',
    entityName: 'IT Support Contract - TechCorp Solutions',
    
    contactId: '8928324',
    contactName: 'TechCorp Solutions',
    contactType: 'buyer',
    contactChannels: {
      email: 'it@techcorp.com',
      phone: '+919876543211',
      whatsapp: '+919876543211'
    },
    
    eventType: 'service_due',
    eventDate: '2025-08-20T14:00:00Z',
    status: 'in_progress',
    priority: 7,
    
    metadata: {
      contractId: '892324',
      serviceNumber: 3,
      totalServices: 4,
      serviceType: 'Quarterly IT Audit',
      technician: 'Priya Sharma',
      estimatedDuration: '4 hours',
      lastServiceDate: '2025-05-20T14:00:00Z',
      nextServiceDate: '2025-11-20T14:00:00Z',
      systemsToAudit: ['Network Security', 'Backup Systems', 'User Access'],
      complianceStandards: ['ISO 27001', 'SOC 2']
    },
    
    reminderRules: {
      beforeDays: [14, 7, 3],
      channels: ['email', 'whatsapp'],
      templateId: 'service_reminder_it_audit'
    },
    
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-08-18T09:00:00Z'
  },
  
  // Contract Renewal Event
  {
    id: 'evt_004',
    tenantId: '12891212',
    sourceModule: 'contracts',
    sourceSystem: 'ContractNest v2.1',
    
    entityType: 'contract',
    entityId: '892323',
    entityName: 'HVAC Maintenance Contract - Renewal Notice',
    
    contactId: '8928323',
    contactName: 'Agilent Technologies',
    contactType: 'buyer',
    contactChannels: {
      email: 'facilities@agilent.com',
      phone: '+919876543210'
    },
    
    eventType: 'contract_renewal',
    eventDate: '2025-12-31T23:59:59Z',
    status: 'planned',
    priority: 6,
    
    metadata: {
      contractId: '892323',
      currentContractEnd: '2025-12-31T23:59:59Z',
      renewalDeadline: '2025-11-30T23:59:59Z',
      proposedNewRate: 52000,
      currentRate: 48000,
      rateIncreasePercent: 8.33,
      performanceScore: 95.5,
      servicesCompleted: 7,
      totalServices: 12,
      customerSatisfactionScore: 4.8
    },
    
    reminderRules: {
      beforeDays: [90, 60, 30, 15],
      channels: ['email'],
      templateId: 'contract_renewal_notice'
    },
    
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-08-01T10:00:00Z'
  },
  
  // Emergency Service Event
  {
    id: 'evt_005',
    tenantId: '12891212',
    sourceModule: 'services',
    sourceSystem: 'ContractNest Services v2.1',
    
    entityType: 'service',
    entityId: 'SRV-EMRG-001',
    entityName: 'Emergency HVAC Repair - Agilent Tech',
    
    contactId: '8928323',
    contactName: 'Agilent Technologies',
    contactType: 'buyer',
    contactChannels: {
      email: 'facilities@agilent.com',
      phone: '+919876543210',
      whatsapp: '+919876543210'
    },
    
    eventType: 'emergency_service',
    eventDate: '2025-08-16T16:30:00Z',
    status: 'completed',
    priority: 10,
    
    metadata: {
      contractId: '892323',
      serviceType: 'Emergency Repair',
      issueReported: 'AC Unit 2 complete failure',
      technician: 'Rajesh Kumar',
      emergencyRate: 1.5,
      actualDuration: '3 hours',
      partsReplaced: ['Compressor', 'Coolant'],
      additionalCost: 8500,
      resolutionTime: '3.5 hours',
      customerPriority: 'Critical - Server room cooling'
    },
    
    reminderRules: {
      beforeDays: [0],
      channels: ['sms', 'whatsapp'],
      templateId: 'emergency_service_confirmation'
    },
    
    createdAt: '2025-08-16T16:30:00Z',
    updatedAt: '2025-08-16T20:15:00Z'
  }
];

// Realistic Event-Driven Jobs
export const realisticEventJobs: EventDrivenJob[] = [
  // Service Reminder Job (7 days before)
  {
    id: 'job_001',
    tenantId: '12891212',
    businessEventId: 'evt_001',
    
    jobType: 'reminder',
    jobName: 'HVAC Service Reminder - 7 Days Notice',
    priority: 8,
    
    sourceModule: 'contracts',
    entityType: 'contract',
    entityId: '892323',
    contactId: '8928323',
    businessContext: {
      contractId: '892323',
      contractName: 'HVAC Maintenance Contract',
      serviceNumber: 8,
      totalServices: 12,
      serviceType: 'Monthly HVAC Maintenance',
      technician: 'Rajesh Kumar',
      estimatedDuration: '2 hours',
      equipmentCount: 3
    },
    
    recipients: {
      total: 2,
      successful: 2,
      failed: 0,
      pending: 0,
      details: [
        {
          id: 'contact_001',
          name: 'Pradeep Singh',
          email: 'pradeep.singh@agilent.com',
          phone: '+919876543210',
          type: 'primary',
          businessRole: 'Facilities Manager'
        },
        {
          id: 'contact_002',
          name: 'Facilities Team',
          email: 'facilities@agilent.com',
          type: 'group',
          businessRole: 'Operations Team'
        }
      ]
    },
    
    channels: ['email', 'sms'],
    templateId: 'service_reminder_hvac',
    contentData: {
      email: {
        subject: 'HVAC Service Scheduled - Service #8 of 12',
        message: 'Your monthly HVAC maintenance service is scheduled for August 15, 2025. Technician Rajesh Kumar will arrive at 9:00 AM.',
        variables: {
          customerName: 'Agilent Technologies',
          serviceDate: 'August 15, 2025',
          serviceTime: '9:00 AM',
          technician: 'Rajesh Kumar',
          serviceNumber: 8,
          totalServices: 12,
          contractId: '892323',
          estimatedDuration: '2 hours'
        }
      },
      sms: {
        message: 'HVAC Service reminder: Aug 15, 9 AM. Technician: Rajesh Kumar. Service 8/12. Contract #892323',
        variables: {
          serviceDate: 'Aug 15',
          serviceTime: '9 AM',
          technician: 'Rajesh Kumar',
          serviceNumber: 8,
          totalServices: 12
        }
      }
    },
    
    triggerDate: '2025-08-08T09:00:00Z',
    scheduledAt: '2025-08-08T09:00:00Z',
    executedAt: '2025-08-08T09:05:00Z',
    completedAt: '2025-08-08T09:08:00Z',
    
    status: 'completed',
    executionStatus: {
      email: {
        status: 'delivered',
        sentAt: '2025-08-08T09:05:00Z',
        deliveredAt: '2025-08-08T09:07:00Z',
        cost: 0.25
      },
      sms: {
        status: 'delivered',
        sentAt: '2025-08-08T09:06:00Z',
        deliveredAt: '2025-08-08T09:06:30Z',
        cost: 0.75
      }
    },
    
    dependsOn: [],
    triggers: ['job_002'],
    
    cost: '₹1.00',
    successRate: 100,
    
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-08T09:08:00Z'
  },
  
  // Payment Reminder Job
  {
    id: 'job_002',
    tenantId: '12891212',
    businessEventId: 'evt_002',
    
    jobType: 'reminder',
    jobName: 'Q3 Payment Reminder - 10 Days Notice',
    priority: 9,
    
    sourceModule: 'invoicing',
    entityType: 'invoice',
    entityId: 'INV-2025-Q3-001',
    contactId: '8928323',
    businessContext: {
      contractId: '892323',
      invoiceNumber: 'INV-2025-Q3-001',
      amount: 12000,
      currency: 'INR',
      dueDate: '2025-08-30',
      quarterCovered: 'Q3 2025',
      servicesIncluded: 3,
      accountsReceivableAge: 5
    },
    
    recipients: {
      total: 3,
      successful: 2,
      failed: 1,
      pending: 0,
      details: [
        {
          id: 'contact_003',
          name: 'Accounts Payable',
          email: 'accounts@agilent.com',
          type: 'department',
          businessRole: 'Finance Team'
        },
        {
          id: 'contact_004',
          name: 'Suresh Patel',
          email: 'suresh.patel@agilent.com',
          phone: '+919876543212',
          type: 'individual',
          businessRole: 'Finance Manager'
        },
        {
          id: 'contact_005',
          name: 'Vendor Management',
          email: 'vendors@agilent.com',
          type: 'department',
          businessRole: 'Procurement Team'
        }
      ]
    },
    
    channels: ['email'],
    templateId: 'payment_reminder_quarterly',
    contentData: {
      email: {
        subject: 'Payment Reminder: Invoice INV-2025-Q3-001 Due August 30',
        message: 'This is a friendly reminder that your quarterly payment of ₹12,000 for HVAC maintenance services is due on August 30, 2025.',
        variables: {
          invoiceNumber: 'INV-2025-Q3-001',
          amount: '₹12,000',
          dueDate: 'August 30, 2025',
          quarterCovered: 'Q3 2025',
          servicesIncluded: 'July, August, September services',
          contractId: '892323',
          paymentLink: 'https://payments.contractnest.com/pay/INV-2025-Q3-001'
        }
      }
    },
    
    triggerDate: '2025-08-20T10:00:00Z',
    scheduledAt: '2025-08-20T10:00:00Z',
    executedAt: '2025-08-20T10:03:00Z',
    completedAt: '2025-08-20T10:05:00Z',
    
    status: 'completed',
    executionStatus: {
      email: {
        status: 'delivered',
        sentAt: '2025-08-20T10:03:00Z',
        deliveredAt: '2025-08-20T10:04:00Z',
        cost: 0.25
      }
    },
    
    dependsOn: [],
    triggers: ['job_003'],
    
    cost: '₹0.75',
    successRate: 66.67,
    
    createdAt: '2025-08-10T10:00:00Z',
    updatedAt: '2025-08-20T10:05:00Z'
  },
  
  // Service Confirmation Job (1 day before)
  {
    id: 'job_003',
    tenantId: '12891212',
    businessEventId: 'evt_001',
    
    jobType: 'confirmation',
    jobName: 'HVAC Service Confirmation - Tomorrow',
    priority: 8,
    
    sourceModule: 'contracts',
    entityType: 'contract',
    entityId: '892323',
    contactId: '8928323',
    businessContext: {
      contractId: '892323',
      serviceNumber: 8,
      totalServices: 12,
      technician: 'Rajesh Kumar',
      technicianPhone: '+919876543213'
    },
    
    recipients: {
      total: 1,
      successful: 0,
      failed: 0,
      pending: 1,
      details: [
        {
          id: 'contact_001',
          name: 'Pradeep Singh',
          phone: '+919876543210',
          whatsapp: '+919876543210',
          type: 'primary',
          businessRole: 'Facilities Manager'
        }
      ]
    },
    
    channels: ['whatsapp'],
    templateId: 'service_confirmation_whatsapp',
    contentData: {
      whatsapp: {
        message: '🔧 HVAC Service Tomorrow!\n\n📅 Date: Aug 15, 9:00 AM\n👨‍🔧 Technician: Rajesh Kumar\n📞 Contact: +919876543213\n\nService 8 of 12 for Contract #892323\n\nReply YES to confirm or RESCHEDULE to change.',
        variables: {
          serviceDate: 'Aug 15',
          serviceTime: '9:00 AM',
          technician: 'Rajesh Kumar',
          technicianPhone: '+919876543213',
          serviceNumber: 8,
          totalServices: 12,
          contractId: '892323'
        }
      }
    },
    
    triggerDate: '2025-08-14T18:00:00Z',
    scheduledAt: '2025-08-14T18:00:00Z',
    executedAt: null,
    completedAt: null,
    
    status: 'pending',
    executionStatus: {
      whatsapp: {
        status: 'pending',
        cost: 0.50
      }
    },
    
    dependsOn: ['job_001'],
    triggers: ['job_004'],
    
    cost: '₹0.50',
    successRate: 0,
    
    createdAt: '2025-08-08T09:10:00Z',
    updatedAt: '2025-08-14T17:00:00Z'
  },
  
  // Post-Service Follow-up Job
  {
    id: 'job_004',
    tenantId: '12891212',
    businessEventId: 'evt_001',
    
    jobType: 'survey',
    jobName: 'Post-Service Satisfaction Survey',
    priority: 5,
    
    sourceModule: 'contracts',
    entityType: 'contract',
    entityId: '892323',
    contactId: '8928323',
    businessContext: {
      contractId: '892323',
      serviceNumber: 8,
      totalServices: 12,
      technician: 'Rajesh Kumar',
      serviceCompletedDate: '2025-08-15T11:30:00Z'
    },
    
    recipients: {
      total: 1,
      successful: 0,
      failed: 0,
      pending: 1,
      details: [
        {
          id: 'contact_001',
          name: 'Pradeep Singh',
          email: 'pradeep.singh@agilent.com',
          type: 'primary',
          businessRole: 'Facilities Manager'
        }
      ]
    },
    
    channels: ['email'],
    templateId: 'service_satisfaction_survey',
    contentData: {
      email: {
        subject: 'How was your HVAC service experience?',
        message: 'We hope you\'re satisfied with today\'s HVAC maintenance service. Please take 2 minutes to share your feedback.',
        variables: {
          customerName: 'Pradeep Singh',
          serviceDate: 'August 15, 2025',
          technician: 'Rajesh Kumar',
          serviceNumber: 8,
          contractId: '892323',
          surveyLink: 'https://survey.contractnest.com/service/892323/8'
        }
      }
    },
    
    triggerDate: '2025-08-15T14:00:00Z',
    scheduledAt: '2025-08-15T14:00:00Z',
    executedAt: null,
    completedAt: null,
    
    status: 'staged',
    executionStatus: {
      email: {
        status: 'pending',
        cost: 0.25
      }
    },
    
    dependsOn: ['job_003'],
    triggers: [],
    
    cost: '₹0.25',
    successRate: 0,
    
    createdAt: '2025-08-08T09:15:00Z',
    updatedAt: '2025-08-15T13:00:00Z'
  },
  
  // Emergency Service Notification
  {
    id: 'job_005',
    tenantId: '12891212',
    businessEventId: 'evt_005',
    
    jobType: 'confirmation',
    jobName: 'Emergency Service Completion Notification',
    priority: 10,
    
    sourceModule: 'services',
    entityType: 'service',
    entityId: 'SRV-EMRG-001',
    contactId: '8928323',
    businessContext: {
      contractId: '892323',
      serviceType: 'Emergency Repair',
      issueResolved: 'AC Unit 2 complete failure',
      technician: 'Rajesh Kumar',
      actualDuration: '3 hours',
      additionalCost: 8500,
      emergencyRate: 1.5
    },
    
    recipients: {
      total: 2,
      successful: 2,
      failed: 0,
      pending: 0,
      details: [
        {
          id: 'contact_001',
          name: 'Pradeep Singh',
          phone: '+919876543210',
          email: 'pradeep.singh@agilent.com',
          type: 'primary',
          businessRole: 'Facilities Manager'
        },
        {
          id: 'contact_006',
          name: 'Emergency Contact',
          phone: '+919876543214',
          type: 'emergency',
          businessRole: 'On-call Manager'
        }
      ]
    },
    
    channels: ['sms', 'email'],
    templateId: 'emergency_service_completion',
    contentData: {
      sms: {
        message: 'URGENT: Emergency HVAC repair completed. AC Unit 2 restored. Duration: 3hrs. Additional cost: ₹8,500. Report: SRV-EMRG-001',
        variables: {
          issueResolved: 'AC Unit 2 restored',
          duration: '3hrs',
          additionalCost: '₹8,500',
          reportId: 'SRV-EMRG-001'
        }
      },
      email: {
        subject: 'Emergency Service Completed - AC Unit 2 Restored',
        message: 'Emergency HVAC repair has been successfully completed. AC Unit 2 is now operational. Detailed report and additional charges information attached.',
        variables: {
          issueResolved: 'AC Unit 2 complete failure resolved',
          technician: 'Rajesh Kumar',
          duration: '3 hours',
          additionalCost: '₹8,500',
          emergencyRate: '1.5x standard rate',
          reportId: 'SRV-EMRG-001',
          contractId: '892323'
        }
      }
    },
    
    triggerDate: '2025-08-16T20:00:00Z',
    scheduledAt: '2025-08-16T20:00:00Z',
    executedAt: '2025-08-16T20:02:00Z',
    completedAt: '2025-08-16T20:05:00Z',
    
    status: 'completed',
    executionStatus: {
      sms: {
        status: 'delivered',
        sentAt: '2025-08-16T20:02:00Z',
        deliveredAt: '2025-08-16T20:02:30Z',
        cost: 0.75
      },
      email: {
        status: 'delivered',
        sentAt: '2025-08-16T20:03:00Z',
        deliveredAt: '2025-08-16T20:04:00Z',
        cost: 0.25
      }
    },
    
    dependsOn: [],
    triggers: [],
    
    cost: '₹1.00',
    successRate: 100,
    
    createdAt: '2025-08-16T20:00:00Z',
    updatedAt: '2025-08-16T20:05:00Z'
  }
];

// Realistic Contracts Data
export const realisticContracts: Contract[] = [
  {
    id: '892323',
    tenantId: '12891212',
    name: 'HVAC Maintenance Contract - Agilent Technologies',
    type: 'hvac_maintenance',
    customerId: '8928323',
    customerName: 'Agilent Technologies',
    
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    totalValue: 48000,
    paymentFrequency: 'quarterly',
    serviceFrequency: 'monthly',
    
    totalServices: 12,
    servicesCompleted: 7,
    nextServiceDate: '2025-08-15T09:00:00Z',
    
    totalPayments: 4,
    paymentsReceived: 2,
    nextPaymentDate: '2025-08-30T23:59:59Z',
    nextPaymentAmount: 12000,
    
    status: 'active',
    createdAt: '2024-12-15T10:00:00Z'
  },
  {
    id: '892324',
    tenantId: '12891212',
    name: 'IT Support Contract - TechCorp Solutions',
    type: 'it_support',
    customerId: '8928324',
    customerName: 'TechCorp Solutions',
    
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2026-01-31T23:59:59Z',
    totalValue: 120000,
    paymentFrequency: 'quarterly',
    serviceFrequency: 'quarterly',
    
    totalServices: 4,
    servicesCompleted: 2,
    nextServiceDate: '2025-08-20T14:00:00Z',
    
    totalPayments: 4,
    paymentsReceived: 2,
    nextPaymentDate: '2025-08-31T23:59:59Z',
    nextPaymentAmount: 30000,
    
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '892325',
    tenantId: '12891212',
    name: 'Security System Maintenance - MegaMart Retail',
    type: 'security_system',
    customerId: '8928325',
    customerName: 'MegaMart Retail',
    
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2025-05-31T23:59:59Z',
    totalValue: 84000,
    paymentFrequency: 'monthly',
    serviceFrequency: 'weekly',
    
    totalServices: 52,
    servicesCompleted: 45,
    nextServiceDate: '2025-08-18T08:00:00Z',
    
    totalPayments: 12,
    paymentsReceived: 10,
    nextPaymentDate: '2025-08-15T23:59:59Z',
    nextPaymentAmount: 7000,
    
    status: 'expiring',
    createdAt: '2024-05-15T10:00:00Z'
  }
];

// Enhanced Templates with Business Context
export const businessContextTemplates = [
  {
    id: 'service_reminder_hvac',
    name: 'HVAC Service Reminder',
    description: 'Automated reminder for HVAC maintenance services',
    category: 'service_reminders',
    eventTypes: ['service_due'],
    channels: ['email', 'sms', 'whatsapp'],
    variables: [
      'customerName', 'serviceDate', 'serviceTime', 'technician', 
      'serviceNumber', 'totalServices', 'contractId', 'estimatedDuration',
      'equipmentIds', 'lastServiceDate'
    ],
    content: {
      email: {
        subject: 'HVAC Service Scheduled - Service #{{serviceNumber}} of {{totalServices}}',
        body: `Dear {{customerName}},

Your monthly HVAC maintenance service is scheduled for {{serviceDate}} at {{serviceTime}}.

Service Details:
- Service Number: {{serviceNumber}} of {{totalServices}}
- Technician: {{technician}}
- Estimated Duration: {{estimatedDuration}}
- Contract ID: {{contractId}}

Equipment to be serviced:
{{#each equipmentIds}}
- {{this}}
{{/each}}

Last service was completed on {{lastServiceDate}}.

Please ensure access to all HVAC units. Contact us if you need to reschedule.

Best regards,
ContractNest Services Team`
      },
      sms: {
        body: 'HVAC Service reminder: {{serviceDate}}, {{serviceTime}}. Technician: {{technician}}. Service {{serviceNumber}}/{{totalServices}}. Contract #{{contractId}}'
      }
    },
    businessRules: {
      triggerDays: [7, 3, 1],
      escalationRules: {
        noResponseDays: 2,
        escalationTemplate: 'service_escalation'
      }
    },
    usageCount: 1456,
    lastUsed: '2025-08-08T09:05:00Z',
    createdAt: '2024-12-01T10:00:00Z',
    isActive: true
  },
  {
    id: 'payment_reminder_quarterly',
    name: 'Quarterly Payment Reminder',
    description: 'Payment reminder for quarterly billing cycles',
    category: 'payment_reminders',
    eventTypes: ['payment_due'],
    channels: ['email'],
    variables: [
      'customerName', 'invoiceNumber', 'amount', 'dueDate', 
      'quarterCovered', 'servicesIncluded', 'contractId', 'paymentLink'
    ],
    content: {
      email: {
        subject: 'Payment Reminder: Invoice {{invoiceNumber}} Due {{dueDate}}',
        body: `Dear {{customerName}},

This is a friendly reminder that your quarterly payment is due.

Payment Details:
- Invoice Number: {{invoiceNumber}}
- Amount Due: {{amount}}
- Due Date: {{dueDate}}
- Quarter Covered: {{quarterCovered}}
- Services Included: {{servicesIncluded}}
- Contract ID: {{contractId}}

Pay Online: {{paymentLink}}

Thank you for your business!

ContractNest Billing Team`
      }
    },
    businessRules: {
      triggerDays: [10, 5, 1],
      overdueEscalation: {
        overdueDay: 1,
        escalationTemplate: 'payment_overdue'
      }
    },
    usageCount: 892,
    lastUsed: '2025-08-20T10:03:00Z',
    createdAt: '2024-12-01T10:00:00Z',
    isActive: true
  }
];

// Mock API functions
export const realisticMockApi = {
  async getBusinessEvents(filters?: any): Promise<BusinessEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    let events = [...realisticBusinessEvents];
    
    if (filters?.eventType) {
      events = events.filter(e => e.eventType === filters.eventType);
    }
    if (filters?.status) {
      events = events.filter(e => e.status === filters.status);
    }
    if (filters?.sourceModule) {
      events = events.filter(e => e.sourceModule === filters.sourceModule);
    }
    
    return events;
  },

  async getEventJobs(filters?: any): Promise<EventDrivenJob[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    let jobs = [...realisticEventJobs];
    
    if (filters?.status) {
      jobs = jobs.filter(j => j.status === filters.status);
    }
    if (filters?.jobType) {
      jobs = jobs.filter(j => j.jobType === filters.jobType);
    }
    
    return jobs;
  },

  async getContracts(): Promise<Contract[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return realisticContracts;
  },

  async getBusinessEvent(id: string): Promise<BusinessEvent | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return realisticBusinessEvents.find(e => e.id === id) || null;
  },

  async getEventJob(id: string): Promise<EventDrivenJob | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return realisticEventJobs.find(j => j.id === id) || null;
  },

  async getContract(id: string): Promise<Contract | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return realisticContracts.find(c => c.id === id) || null;
  }
};

// Business Intelligence Functions
export const businessIntelligence = {
  getEventsByStatus: (status: string) => {
    return realisticBusinessEvents.filter(e => e.status === status);
  },

  getJobsByBusinessEvent: (eventId: string) => {
    return realisticEventJobs.filter(j => j.businessEventId === eventId);
  },

  getContractEventTimeline: (contractId: string) => {
    const events = realisticBusinessEvents.filter(e => 
      e.metadata.contractId === contractId
    );
    const jobs = realisticEventJobs.filter(j => 
      j.businessContext.contractId === contractId
    );
    
    return {
      events: events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()),
      jobs: jobs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    };
  },

  getAccountsReceivable: () => {
    return realisticBusinessEvents
      .filter(e => e.eventType === 'payment_due')
      .map(e => ({
        contractId: e.metadata.contractId,
        contractName: e.entityName,
        customerName: e.contactName,
        amount: e.metadata.amount,
        dueDate: e.metadata.dueDate,
        status: e.status,
        daysOverdue: e.status === 'completed' ? 0 : 
          Math.max(0, Math.ceil((new Date().getTime() - new Date(e.metadata.dueDate).getTime()) / (1000 * 60 * 60 * 24)))
      }));
  },

  getServiceSchedule: (month?: string) => {
    return realisticBusinessEvents
      .filter(e => e.eventType === 'service_due')
      .filter(e => !month || e.eventDate.includes(month))
      .map(e => ({
        contractId: e.metadata.contractId,
        customerName: e.contactName,
        serviceDate: e.eventDate,
        serviceNumber: e.metadata.serviceNumber,
        totalServices: e.metadata.totalServices,
        technician: e.metadata.technician,
        status: e.status
      }));
  }
};  
// ADD ONLY THIS AT THE VERY END OF YOUR fakeData.ts FILE:

// Export mockApi for backward compatibility with existing hooks
export const mockApi = {
  // Use your existing methods
  getJobs: async (filters?: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return fakeJobs; // Your existing fakeJobs array
  },

  getJob: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return fakeJobs.find(job => job.id === id) || null;
  },

  getTemplates: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return fakeTemplates; // Your existing fakeTemplates array
  },

  getChannels: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return fakeChannels; // Your existing fakeChannels array
  },

  getAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return fakeAnalytics; // Your existing fakeAnalytics
  },

  // New business event methods (using already imported realisticMockApi)
  getBusinessEvents: realisticMockApi.getBusinessEvents,
  getEventJobs: realisticMockApi.getEventJobs,
  getContracts: realisticMockApi.getContracts,
  getBusinessEvent: realisticMockApi.getBusinessEvent,
  getEventJob: realisticMockApi.getEventJob,
  getContract: realisticMockApi.getContract
};