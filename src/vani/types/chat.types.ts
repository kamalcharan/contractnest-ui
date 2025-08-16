// src/vani/types/chat.types.ts

export interface ChatParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'business' | 'system' | 'technician' | 'finance';
  businessRole?: string; // Facilities Manager, Finance Team, etc.
  isOnline?: boolean;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  
  // Sender info
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'business' | 'system';
  
  // Message content
  content: string;
  messageType: 'text' | 'template' | 'system' | 'file' | 'form';
  channel: 'email' | 'sms' | 'whatsapp' | 'widget' | 'phone';
  
  // Timestamps
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  
  // Business context
  businessContext: {
    jobId?: string;
    eventId?: string;
    contractId?: string;
    templateId?: string;
    eventType?: string; // service_due, payment_due, etc.
    priority?: number;
  };
  
  // Message metadata
  metadata: {
    subject?: string; // For email messages
    templateVariables?: Record<string, any>;
    cost?: number;
    deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
    errorMessage?: string;
    attachments?: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
    }>;
  };
  
  // Threading
  replyToId?: string;
  threadId?: string;
  
  // Actions and responses
  responses?: ChatResponse[];
  availableActions?: ChatAction[];
}

export interface ChatResponse {
  id: string;
  messageId: string;
  responderId: string;
  responderName: string;
  content: string;
  responseType: 'confirmation' | 'reschedule' | 'question' | 'complaint';
  sentAt: string;
  
  // Business impact
  businessImpact?: {
    statusUpdate?: string; // confirmed, rescheduled, escalated
    newEventCreated?: boolean;
    jobUpdated?: boolean;
  };
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'quick_reply' | 'button' | 'form' | 'link';
  data?: any;
  
  // Business actions
  businessAction?: {
    type: 'confirm_service' | 'reschedule' | 'make_payment' | 'escalate';
    contractId?: string;
    eventId?: string;
  };
}

export interface ChatConversation {
  id: string;
  
  // Participants
  participants: ChatParticipant[];
  primaryCustomer: ChatParticipant;
  
  // Conversation metadata
  title: string;
  description?: string;
  status: 'active' | 'archived' | 'escalated' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Business context
  businessContext: {
    contractId: string;
    contractName: string;
    customerName: string;
    relatedEvents: string[];
    totalValue?: number;
    serviceType?: string;
  };
  
  // Communication stats
  stats: {
    totalMessages: number;
    unreadCount: number;
    lastActivity: string;
    responseTime?: number; // Average response time in minutes
    satisfaction?: number; // 1-5 rating
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  
  // Tags and categorization
  tags: string[];
  category: 'service' | 'payment' | 'support' | 'renewal' | 'emergency';
  
  // Messages
  messages: ChatMessage[];
}

// Chat data for realistic business conversations
export const chatParticipants: ChatParticipant[] = [
  {
    id: 'customer_001',
    name: 'Pradeep Singh',
    email: 'pradeep.singh@agilent.com',
    phone: '+919876543210',
    role: 'customer',
    businessRole: 'Facilities Manager',
    isOnline: true,
    lastSeen: '2025-08-16T14:30:00Z'
  },
  {
    id: 'system_vani',
    name: 'VaNi System',
    role: 'system',
    businessRole: 'Automated Assistant',
    isOnline: true
  },
  {
    id: 'tech_001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@techservice.com',
    phone: '+919876543213',
    role: 'technician',
    businessRole: 'Senior Technician',
    isOnline: false,
    lastSeen: '2025-08-16T12:00:00Z'
  },
  {
    id: 'business_001',
    name: 'ContractNest Support',
    email: 'support@contractnest.com',
    role: 'business',
    businessRole: 'Customer Success',
    isOnline: true
  }
];

export const sampleChatConversations: ChatConversation[] = [
  {
    id: 'conv_001',
    participants: [
      chatParticipants[0], // Pradeep Singh
      chatParticipants[1], // VaNi System
      chatParticipants[2], // Rajesh Kumar
      chatParticipants[3]  // ContractNest Support
    ],
    primaryCustomer: chatParticipants[0],
    
    title: 'HVAC Service #8 - Agilent Technologies',
    description: 'Monthly HVAC maintenance service reminder and scheduling',
    status: 'active',
    priority: 'medium',
    
    businessContext: {
      contractId: '892323',
      contractName: 'HVAC Maintenance Contract - Agilent Technologies',
      customerName: 'Agilent Technologies',
      relatedEvents: ['evt_001'],
      totalValue: 48000,
      serviceType: 'Monthly HVAC Maintenance'
    },
    
    stats: {
      totalMessages: 8,
      unreadCount: 2,
      lastActivity: '2025-08-16T15:45:00Z',
      responseTime: 25,
      satisfaction: 5
    },
    
    createdAt: '2025-08-08T09:00:00Z',
    updatedAt: '2025-08-16T15:45:00Z',
    lastMessageAt: '2025-08-16T15:45:00Z',
    
    tags: ['service_reminder', 'hvac', 'maintenance'],
    category: 'service',
    
    messages: [
      {
        id: 'msg_001',
        conversationId: 'conv_001',
        senderId: 'system_vani',
        senderName: 'VaNi System',
        senderType: 'system',
        content: `🔧 HVAC Service Reminder

Dear Pradeep Singh,

Your monthly HVAC maintenance service is scheduled for August 15, 2025 at 9:00 AM.

Service Details:
• Service Number: 8 of 12
• Technician: Rajesh Kumar
• Estimated Duration: 2 hours
• Contract: #892323

Please ensure access to all HVAC units. Contact us if you need to reschedule.

Best regards,
ContractNest Services Team`,
        messageType: 'template',
        channel: 'email',
        sentAt: '2025-08-08T09:05:00Z',
        deliveredAt: '2025-08-08T09:07:00Z',
        readAt: '2025-08-08T09:15:00Z',
        
        businessContext: {
          jobId: 'job_001',
          eventId: 'evt_001',
          contractId: '892323',
          templateId: 'service_reminder_hvac',
          eventType: 'service_due',
          priority: 8
        },
        
        metadata: {
          subject: 'HVAC Service Scheduled - Service #8 of 12',
          templateVariables: {
            customerName: 'Pradeep Singh',
            serviceDate: 'August 15, 2025',
            serviceTime: '9:00 AM',
            technician: 'Rajesh Kumar',
            serviceNumber: 8,
            totalServices: 12,
            contractId: '892323'
          },
          cost: 0.25,
          deliveryStatus: 'read'
        },
        
        availableActions: [
          {
            id: 'confirm_service',
            label: 'Confirm Service',
            type: 'button',
            businessAction: {
              type: 'confirm_service',
              contractId: '892323',
              eventId: 'evt_001'
            }
          },
          {
            id: 'reschedule',
            label: 'Reschedule',
            type: 'button',
            businessAction: {
              type: 'reschedule',
              contractId: '892323',
              eventId: 'evt_001'
            }
          }
        ]
      },
      {
        id: 'msg_002',
        conversationId: 'conv_001',
        senderId: 'system_vani',
        senderName: 'VaNi System',
        senderType: 'system',
        content: 'HVAC Service reminder: Aug 15, 9 AM. Technician: Rajesh Kumar. Service 8/12. Contract #892323',
        messageType: 'template',
        channel: 'sms',
        sentAt: '2025-08-08T09:06:00Z',
        deliveredAt: '2025-08-08T09:06:30Z',
        readAt: '2025-08-08T09:10:00Z',
        
        businessContext: {
          jobId: 'job_001',
          eventId: 'evt_001',
          contractId: '892323',
          templateId: 'service_reminder_hvac',
          eventType: 'service_due',
          priority: 8
        },
        
        metadata: {
          cost: 0.75,
          deliveryStatus: 'read'
        }
      },
      {
        id: 'msg_003',
        conversationId: 'conv_001',
        senderId: 'customer_001',
        senderName: 'Pradeep Singh',
        senderType: 'customer',
        content: 'Thank you for the reminder. I confirm the service for August 15th at 9 AM. Please ensure the technician has access cards for the facility.',
        messageType: 'text',
        channel: 'email',
        sentAt: '2025-08-08T10:30:00Z',
        deliveredAt: '2025-08-08T10:30:05Z',
        readAt: '2025-08-08T10:32:00Z',
        
        businessContext: {
          jobId: 'job_001',
          eventId: 'evt_001',
          contractId: '892323',
          priority: 5
        },
        
        metadata: {
          subject: 'Re: HVAC Service Scheduled - Service #8 of 12',
          deliveryStatus: 'read'
        },
        
        responses: [
          {
            id: 'resp_001',
            messageId: 'msg_003',
            responderId: 'customer_001',
            responderName: 'Pradeep Singh',
            content: 'Service confirmed for August 15th, 9 AM',
            responseType: 'confirmation',
            sentAt: '2025-08-08T10:30:00Z',
            businessImpact: {
              statusUpdate: 'confirmed',
              jobUpdated: true
            }
          }
        ]
      },
      {
        id: 'msg_004',
        conversationId: 'conv_001',
        senderId: 'system_vani',
        senderName: 'VaNi System',
        senderType: 'system',
        content: '✅ Service Confirmed\n\nThank you for confirming your HVAC service. Rajesh Kumar has been notified about the access card requirement.\n\nService Details:\n📅 August 15, 2025 at 9:00 AM\n👨‍🔧 Technician: Rajesh Kumar (+919876543213)\n📋 Service 8 of 12\n\nRajesh will contact you 30 minutes before arrival.',
        messageType: 'system',
        channel: 'widget',
        sentAt: '2025-08-08T10:35:00Z',
        deliveredAt: '2025-08-08T10:35:02Z',
        readAt: '2025-08-08T10:40:00Z',
        
        businessContext: {
          jobId: 'job_001',
          eventId: 'evt_001',
          contractId: '892323',
          priority: 5
        },
        
        metadata: {
          deliveryStatus: 'read',
          cost: 0.05
        }
      },
      {
        id: 'msg_005',
        conversationId: 'conv_001',
        senderId: 'system_vani',
        senderName: 'VaNi System',
        senderType: 'system',
        content: '🔧 HVAC Service Tomorrow!\n\n📅 Date: Aug 15, 9:00 AM\n👨‍🔧 Technician: Rajesh Kumar\n📞 Contact: +919876543213\n\nService 8 of 12 for Contract #892323\n\nReply YES to confirm or RESCHEDULE to change.',
        messageType: 'template',
        channel: 'whatsapp',
        sentAt: '2025-08-14T18:00:00Z',
        deliveredAt: '2025-08-14T18:00:15Z',
        readAt: '2025-08-14T18:05:00Z',
        
        businessContext: {
          jobId: 'job_003',
          eventId: 'evt_001',
          contractId: '892323',
          templateId: 'service_confirmation_whatsapp',
          eventType: 'service_due',
          priority: 8
        },
        
        metadata: {
          cost: 0.50,
          deliveryStatus: 'read'
        },
        
        availableActions: [
          {
            id: 'confirm_yes',
            label: 'YES',
            type: 'quick_reply',
            businessAction: {
              type: 'confirm_service',
              contractId: '892323',
              eventId: 'evt_001'
            }
          },
          {
            id: 'reschedule',
            label: 'RESCHEDULE',
            type: 'quick_reply',
            businessAction: {
              type: 'reschedule',
              contractId: '892323',
              eventId: 'evt_001'
            }
          }
        ]
      },
      {
        id: 'msg_006',
        conversationId: 'conv_001',
        senderId: 'customer_001',
        senderName: 'Pradeep Singh',
        senderType: 'customer',
        content: 'YES',
        messageType: 'text',
        channel: 'whatsapp',
        sentAt: '2025-08-14T18:10:00Z',
        deliveredAt: '2025-08-14T18:10:02Z',
        readAt: '2025-08-14T18:12:00Z',
        
        businessContext: {
          jobId: 'job_003',
          eventId: 'evt_001',
          contractId: '892323',
          priority: 5
        },
        
        metadata: {
          deliveryStatus: 'read'
        },
        
        responses: [
          {
            id: 'resp_002',
            messageId: 'msg_006',
            responderId: 'customer_001',
            responderName: 'Pradeep Singh',
            content: 'YES - Service confirmed',
            responseType: 'confirmation',
            sentAt: '2025-08-14T18:10:00Z',
            businessImpact: {
              statusUpdate: 'confirmed',
              jobUpdated: true
            }
          }
        ]
      },
      {
        id: 'msg_007',
        conversationId: 'conv_001',
        senderId: 'tech_001',
        senderName: 'Rajesh Kumar',
        senderType: 'business',
        content: 'Hello Mr. Singh, this is Rajesh Kumar from ContractNest. I will be arriving at 9:00 AM tomorrow for your HVAC maintenance. I have the access card information. Should I report to the main reception?',
        messageType: 'text',
        channel: 'whatsapp',
        sentAt: '2025-08-14T20:30:00Z',
        deliveredAt: '2025-08-14T20:30:05Z',
        readAt: '2025-08-14T21:00:00Z',
        
        businessContext: {
          eventId: 'evt_001',
          contractId: '892323',
          priority: 6
        },
        
        metadata: {
          deliveryStatus: 'read'
        }
      },
      {
        id: 'msg_008',
        conversationId: 'conv_001',
        senderId: 'customer_001',
        senderName: 'Pradeep Singh',
        senderType: 'customer',
        content: 'Hi Rajesh, yes please report to main reception and ask for the facilities team. They will escort you to the HVAC units. Also, please note that Building C HVAC has been making unusual noise lately - please check that unit specifically.',
        messageType: 'text',
        channel: 'whatsapp',
        sentAt: '2025-08-14T21:15:00Z',
        deliveredAt: '2025-08-14T21:15:03Z',
        readAt: '2025-08-14T21:20:00Z',
        
        businessContext: {
          eventId: 'evt_001',
          contractId: '892323',
          priority: 7
        },
        
        metadata: {
          deliveryStatus: 'read'
        }
      },
      {
        id: 'msg_009',
        conversationId: 'conv_001',
        senderId: 'tech_001',
        senderName: 'Rajesh Kumar',
        senderType: 'business',
        content: 'Perfect, thank you for the additional information about Building C. I will prioritize that unit and bring additional diagnostic equipment. See you tomorrow at 9 AM sharp!',
        messageType: 'text',
        channel: 'whatsapp',
        sentAt: '2025-08-14T21:25:00Z',
        deliveredAt: '2025-08-14T21:25:02Z',
        readAt: '2025-08-16T15:45:00Z',
        
        businessContext: {
          eventId: 'evt_001',
          contractId: '892323',
          priority: 5
        },
        
        metadata: {
          deliveryStatus: 'read'
        }
      }
    ]
  },
  
  // Payment conversation
  {
    id: 'conv_002',
    participants: [
      {
        id: 'customer_002',
        name: 'Suresh Patel',
        email: 'suresh.patel@agilent.com',
        role: 'customer',
        businessRole: 'Finance Manager',
        isOnline: false,
        lastSeen: '2025-08-16T13:00:00Z'
      },
      chatParticipants[1], // VaNi System
      {
        id: 'finance_001',
        name: 'ContractNest Finance',
        email: 'finance@contractnest.com',
        role: 'business',
        businessRole: 'Accounts Team',
        isOnline: true
      }
    ],
    primaryCustomer: {
      id: 'customer_002',
      name: 'Suresh Patel',
      email: 'suresh.patel@agilent.com',
      role: 'customer',
      businessRole: 'Finance Manager',
      isOnline: false,
      lastSeen: '2025-08-16T13:00:00Z'
    },
    
    title: 'Q3 Payment Reminder - Agilent Technologies',
    description: 'Quarterly payment reminder and collection process',
    status: 'active',
    priority: 'high',
    
    businessContext: {
      contractId: '892323',
      contractName: 'HVAC Maintenance Contract - Agilent Technologies',
      customerName: 'Agilent Technologies',
      relatedEvents: ['evt_002'],
      totalValue: 12000,
      serviceType: 'Quarterly Payment'
    },
    
    stats: {
      totalMessages: 4,
      unreadCount: 1,
      lastActivity: '2025-08-20T15:30:00Z',
      responseTime: 60,
      satisfaction: 4
    },
    
    createdAt: '2025-08-20T10:00:00Z',
    updatedAt: '2025-08-20T15:30:00Z',
    lastMessageAt: '2025-08-20T15:30:00Z',
    
    tags: ['payment_reminder', 'quarterly', 'finance'],
    category: 'payment',
    
    messages: [
      {
        id: 'msg_p001',
        conversationId: 'conv_002',
        senderId: 'system_vani',
        senderName: 'VaNi System',
        senderType: 'system',
        content: `💰 Payment Reminder

Dear Suresh Patel,

This is a friendly reminder that your quarterly payment of ₹12,000 for HVAC maintenance services is due on August 30, 2025.

Payment Details:
• Invoice Number: INV-2025-Q3-001
• Amount Due: ₹12,000
• Due Date: August 30, 2025
• Quarter Covered: Q3 2025
• Services Included: July, August, September services
• Contract ID: 892323

Pay Online: https://payments.contractnest.com/pay/INV-2025-Q3-001

Thank you for your business!

ContractNest Billing Team`,
        messageType: 'template',
        channel: 'email',
        sentAt: '2025-08-20T10:03:00Z',
        deliveredAt: '2025-08-20T10:04:00Z',
        readAt: '2025-08-20T11:15:00Z',
        
        businessContext: {
          jobId: 'job_002',
          eventId: 'evt_002',
          contractId: '892323',
          templateId: 'payment_reminder_quarterly',
          eventType: 'payment_due',
          priority: 9
        },
        
        metadata: {
          subject: 'Payment Reminder: Invoice INV-2025-Q3-001 Due August 30',
          templateVariables: {
            invoiceNumber: 'INV-2025-Q3-001',
            amount: '₹12,000',
            dueDate: 'August 30, 2025',
            quarterCovered: 'Q3 2025',
            contractId: '892323',
            paymentLink: 'https://payments.contractnest.com/pay/INV-2025-Q3-001'
          },
          cost: 0.25,
          deliveryStatus: 'read'
        },
        
        availableActions: [
          {
            id: 'pay_now',
            label: 'Pay Now',
            type: 'link',
            data: 'https://payments.contractnest.com/pay/INV-2025-Q3-001',
            businessAction: {
              type: 'make_payment',
              contractId: '892323'
            }
          },
          {
            id: 'schedule_payment',
            label: 'Schedule Payment',
            type: 'button',
            businessAction: {
              type: 'reschedule',
              contractId: '892323'
            }
          }
        ]
      },
      {
        id: 'msg_p002',
        conversationId: 'conv_002',
        senderId: 'customer_002',
        senderName: 'Suresh Patel',
        senderType: 'customer',
        content: 'Hello, I received the payment reminder. I need to process this through our procurement system which requires a few additional documents. Can you please send the detailed service completion report for Q3?',
        messageType: 'text',
        channel: 'email',
        sentAt: '2025-08-20T14:30:00Z',
        deliveredAt: '2025-08-20T14:30:05Z',
        readAt: '2025-08-20T14:45:00Z',
        
        businessContext: {
          jobId: 'job_002',
          eventId: 'evt_002',
          contractId: '892323',
          priority: 8
        },
        
        metadata: {
          subject: 'Re: Payment Reminder: Invoice INV-2025-Q3-001 Due August 30',
          deliveryStatus: 'read'
        }
      },
      {
        id: 'msg_p003',
        conversationId: 'conv_002',
        senderId: 'finance_001',
        senderName: 'ContractNest Finance',
        senderType: 'business',
        content: 'Hello Mr. Patel, thank you for your prompt response. I will prepare the Q3 service completion report and send it to you by tomorrow morning. The report will include all service completion certificates, technician notes, and performance metrics. Is there anything specific you need included for your procurement process?',
        messageType: 'text',
        channel: 'email',
        sentAt: '2025-08-20T15:00:00Z',
        deliveredAt: '2025-08-20T15:00:03Z',
        readAt: '2025-08-20T15:15:00Z',
        
        businessContext: {
          contractId: '892323',
          priority: 7
        },
        
        metadata: {
          subject: 'Re: Payment Reminder: Invoice INV-2025-Q3-001 Due August 30',
          deliveryStatus: 'read'
        }
      },
      {
        id: 'msg_p004',
        conversationId: 'conv_002',
        senderId: 'customer_002',
        senderName: 'Suresh Patel',
        senderType: 'customer',
        content: 'Perfect, that would be very helpful. Please also include the cost breakdown for any additional services or parts that were used during the quarter. Our procurement team needs detailed justification for payments above the standard maintenance fee.',
        messageType: 'text',
        channel: 'email',
        sentAt: '2025-08-20T15:30:00Z',
        deliveredAt: '2025-08-20T15:30:02Z',
        
        businessContext: {
          contractId: '892323',
          priority: 6
        },
        
        metadata: {
          subject: 'Re: Payment Reminder: Invoice INV-2025-Q3-001 Due August 30',
          deliveryStatus: 'delivered'
        }
      }
    ]
  }
];

// Chat utilities and functions
export const chatUtils = {
  // Get conversation by ID
  getConversation: (id: string): ChatConversation | null => {
    return sampleChatConversations.find(conv => conv.id === id) || null;
  },
  
  // Get conversations for a contract
  getConversationsByContract: (contractId: string): ChatConversation[] => {
    return sampleChatConversations.filter(conv => 
      conv.businessContext.contractId === contractId
    );
  },
  
  // Get unread message count
  getUnreadCount: (conversationId: string): number => {
    const conversation = chatUtils.getConversation(conversationId);
    return conversation?.stats.unreadCount || 0;
  },
  
  // Get latest message in conversation
  getLatestMessage: (conversationId: string): ChatMessage | null => {
    const conversation = chatUtils.getConversation(conversationId);
    if (!conversation || conversation.messages.length === 0) return null;
    
    return conversation.messages
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];
  },
  
  // Filter messages by channel
  getMessagesByChannel: (conversationId: string, channel: string): ChatMessage[] => {
    const conversation = chatUtils.getConversation(conversationId);
    if (!conversation) return [];
    
    return conversation.messages.filter(msg => msg.channel === channel);
  },
  
  // Get conversation metrics
  getConversationMetrics: (conversationId: string) => {
    const conversation = chatUtils.getConversation(conversationId);
    if (!conversation) return null;
    
    const messages = conversation.messages;
    const totalCost = messages.reduce((sum, msg) => sum + (msg.metadata.cost || 0), 0);
    const deliveredMessages = messages.filter(msg => msg.metadata.deliveryStatus === 'delivered');
    const readMessages = messages.filter(msg => msg.readAt);
    
    return {
      totalMessages: messages.length,
      totalCost,
      deliveryRate: messages.length > 0 ? (deliveredMessages.length / messages.length) * 100 : 0,
      readRate: deliveredMessages.length > 0 ? (readMessages.length / deliveredMessages.length) * 100 : 0,
      avgResponseTime: conversation.stats.responseTime,
      satisfaction: conversation.stats.satisfaction
    };
  }
};