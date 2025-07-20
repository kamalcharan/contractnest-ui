// src/utils/fakejson/templateBlocks.ts

export interface BlockCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  blocks: BlockMaster[];
}

export interface BlockMaster {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  blockType: string;
  iconNames: string[];
  hexColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  canRotate: boolean;
  canResize: boolean;
  isBidirectional: boolean;
  nodeConfig: {
    minInstances: number;
    maxInstances: number;
    inputs: string[];
    outputs: string[];
  };
  variants: BlockVariant[];
}

export interface BlockVariant {
  id: string;
  blockId: string;
  name: string;
  description: string;
  nodeType: string;
  defaultConfig: any;
  component?: BlockComponent;
  rules?: BlockRule[];
  fields?: BlockField[];
}

export interface BlockComponent {
  id: string;
  componentName: string;
  displayMode: 'design' | 'contract' | 'both';
  componentConfig: {
    design: {
      layout: string;
      showAvatar?: boolean;
      fields: Array<{
        name: string;
        icon: string;
        type?: string;
        required?: boolean;
        placeholder?: string;
        options?: string[];
      }>;
      style: {
        backgroundColor: string;
        borderColor: string;
        borderRadius: string;
        padding?: string;
      };
    };
    contract: {
      layout: string;
      template: string;
      showSchedule?: boolean;
      hideIfEmpty?: boolean;
    };
  };
}

export interface BlockRule {
  id: string;
  ruleType: 'validation' | 'calculation' | 'visibility' | 'dependency';
  ruleName: string;
  ruleConfig: any;
  executionOrder: number;
}

export interface BlockField {
  id: string;
  fieldName: string;
  fieldType: string;
  fieldConfig: {
    label: string;
    placeholder?: string;
    maxLength?: number;
    format?: string;
  };
  isRequired: boolean;
  sortOrder: number;
}

export interface BlockConnection {
  id: string;
  sourceBlockId: string;
  targetBlockId: string;
  connectionType: 'data_flow' | 'sequence' | 'conditional';
  connectionRules: {
    allowMultiple: boolean;
    dataMapping?: Record<string, string>;
    validation?: {
      message: string;
    };
  };
}

// Fake Data
export const templateBlocksData: {
  categories: BlockCategory[];
  connections: BlockConnection[];
} = {
  categories: [
    {
      id: 'cat-core',
      name: 'Core Blocks',
      description: 'Essential contract building blocks',
      icon: 'Layers',
      sortOrder: 1,
      blocks: [
        {
          id: 'block-contact',
          categoryId: 'cat-core',
          name: 'Contact Block',
          description: 'Manage contract parties and stakeholders',
          blockType: 'contact',
          iconNames: ['Users', 'Building'],
          hexColor: '#4F46E5',
          borderStyle: 'solid',
          canRotate: false,
          canResize: true,
          isBidirectional: false,
          nodeConfig: {
            minInstances: 1,
            maxInstances: 5,
            inputs: ['trigger'],
            outputs: ['contactData']
          },
          variants: [
            {
              id: 'var-single-contact',
              blockId: 'block-contact',
              name: 'Single Contact',
              description: 'One primary contact person or organization',
              nodeType: 'singleContactNode',
              defaultConfig: {
                maxContacts: 1,
                requiredFields: ['name', 'email']
              },
              component: {
                id: 'comp-single-contact',
                componentName: 'SingleContactCard',
                displayMode: 'both',
                componentConfig: {
                  design: {
                    layout: 'card',
                    showAvatar: true,
                    fields: [
                      { name: 'fullName', icon: 'User', required: true, placeholder: 'Enter full name' },
                      { name: 'email', icon: 'Mail', required: true, placeholder: 'email@example.com' },
                      { name: 'phone', icon: 'Phone', required: false, placeholder: '+1 (555) 000-0000' },
                      { name: 'organization', icon: 'Building', required: false, placeholder: 'Company name' }
                    ],
                    style: {
                      backgroundColor: '#EEF2FF',
                      borderColor: '#4F46E5',
                      borderRadius: '8px',
                      padding: '16px'
                    }
                  },
                  contract: {
                    layout: 'compact',
                    template: '<div class="flex items-center gap-2"><strong>{{fullName}}</strong><span class="text-muted-foreground">({{email}})</span></div>',
                    hideIfEmpty: false
                  }
                }
              },
              rules: [
                {
                  id: 'rule-email-required',
                  ruleType: 'validation',
                  ruleName: 'EmailRequired',
                  ruleConfig: {
                    conditions: [
                      {
                        field: 'email',
                        operator: 'required',
                        message: 'Email is required for primary contact'
                      },
                      {
                        field: 'email',
                        operator: 'pattern',
                        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
                        message: 'Please enter a valid email address'
                      }
                    ],
                    triggers: ['onSave', 'onSubmit']
                  },
                  executionOrder: 1
                }
              ],
              fields: [
                {
                  id: 'field-fullname',
                  fieldName: 'fullName',
                  fieldType: 'text',
                  fieldConfig: {
                    label: 'Full Name',
                    placeholder: 'John Doe',
                    maxLength: 100
                  },
                  isRequired: true,
                  sortOrder: 1
                },
                {
                  id: 'field-email',
                  fieldName: 'email',
                  fieldType: 'email',
                  fieldConfig: {
                    label: 'Email Address',
                    placeholder: 'john@example.com'
                  },
                  isRequired: true,
                  sortOrder: 2
                },
                {
                  id: 'field-phone',
                  fieldName: 'phone',
                  fieldType: 'phone',
                  fieldConfig: {
                    label: 'Phone Number',
                    placeholder: '+1 (555) 000-0000',
                    format: 'international'
                  },
                  isRequired: false,
                  sortOrder: 3
                }
              ]
            },
            {
              id: 'var-multi-contact',
              blockId: 'block-contact',
              name: 'Multiple Contacts',
              description: 'Multiple stakeholders with different roles',
              nodeType: 'multiContactNode',
              defaultConfig: {
                maxContacts: 5,
                requireRoles: true,
                roles: ['primary', 'secondary', 'observer']
              }
            }
          ]
        },
        {
          id: 'block-service',
          categoryId: 'cat-core',
          name: 'Service Block',
          description: 'Define service specifications and schedules',
          blockType: 'service',
          iconNames: ['Settings', 'Calendar'],
          hexColor: '#10B981',
          borderStyle: 'solid',
          canRotate: false,
          canResize: true,
          isBidirectional: false,
          nodeConfig: {
            minInstances: 1,
            maxInstances: 10,
            inputs: ['contactData'],
            outputs: ['serviceData']
          },
          variants: [
            {
              id: 'var-basic-service',
              blockId: 'block-service',
              name: 'Basic Service',
              description: 'Single service delivery',
              nodeType: 'basicServiceNode',
              defaultConfig: {
                scheduleType: 'one-time',
                requireLocation: true
              }
            },
            {
              id: 'var-recurring-service',
              blockId: 'block-service',
              name: 'Recurring Service',
              description: 'Regular service delivery with schedule',
              nodeType: 'recurringServiceNode',
              defaultConfig: {
                scheduleType: 'recurring',
                frequencyOptions: ['daily', 'weekly', 'monthly']
              },
              component: {
                id: 'comp-recurring-service',
                componentName: 'RecurringServiceCard',
                displayMode: 'both',
                componentConfig: {
                  design: {
                    layout: 'card',
                    fields: [
                      { name: 'serviceName', icon: 'Package', required: true, placeholder: 'Service name' },
                      { name: 'frequency', icon: 'Calendar', type: 'select', options: ['Daily', 'Weekly', 'Monthly'], required: true },
                      { name: 'startDate', icon: 'CalendarDays', type: 'date', required: true },
                      { name: 'location', icon: 'MapPin', required: false, placeholder: 'Service location' }
                    ],
                    style: {
                      backgroundColor: '#ECFDF5',
                      borderColor: '#10B981',
                      borderRadius: '8px',
                      padding: '16px'
                    }
                  },
                  contract: {
                    layout: 'list',
                    template: '<div class="service-item"><h4>{{serviceName}}</h4><p>{{frequency}} starting {{startDate}}</p></div>',
                    showSchedule: true,
                    hideIfEmpty: false
                  }
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'cat-financial',
      name: 'Financial Blocks',
      description: 'Payment and billing related blocks',
      icon: 'DollarSign',
      sortOrder: 2,
      blocks: [
        {
          id: 'block-billing',
          categoryId: 'cat-financial',
          name: 'Billing Block',
          description: 'Configure payment terms and schedules',
          blockType: 'billing',
          iconNames: ['DollarSign', 'CreditCard'],
          hexColor: '#8B5CF6',
          borderStyle: 'solid',
          canRotate: false,
          canResize: false,
          isBidirectional: false,
          nodeConfig: {
            minInstances: 1,
            maxInstances: 1,
            inputs: ['serviceData'],
            outputs: ['billingData']
          },
          variants: [
            {
              id: 'var-milestone-billing',
              blockId: 'block-billing',
              name: 'Milestone Billing',
              description: 'Payment based on completion milestones',
              nodeType: 'milestoneBillingNode',
              defaultConfig: {
                billingType: 'milestone',
                requireApproval: true
              }
            },
            {
              id: 'var-subscription-billing',
              blockId: 'block-billing',
              name: 'Subscription Billing',
              description: 'Regular recurring payments',
              nodeType: 'subscriptionBillingNode',
              defaultConfig: {
                billingType: 'subscription',
                allowAutoDebit: true
              },
              rules: [
                {
                  id: 'rule-subscription-calc',
                  ruleType: 'calculation',
                  ruleName: 'SubscriptionCalculation',
                  ruleConfig: {
                    trigger: 'onFrequencyChange',
                    calculation: {
                      type: 'subscription',
                      formula: 'baseAmount * (12 / frequencyMonths)',
                      outputs: {
                        annualAmount: 'calculated',
                        perPeriodAmount: 'baseAmount',
                        nextBillingDate: 'startDate + frequencyDays'
                      }
                    }
                  },
                  executionOrder: 1
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'cat-clause',
      name: 'Clause Blocks',
      description: 'Legal and contractual clauses',
      icon: 'FileText',
      sortOrder: 3,
      blocks: [
        {
          id: 'block-terms',
          categoryId: 'cat-clause',
          name: 'Terms Block',
          description: 'Standard terms and conditions',
          blockType: 'terms',
          iconNames: ['FileText', 'Shield'],
          hexColor: '#6B7280',
          borderStyle: 'dashed',
          canRotate: false,
          canResize: true,
          isBidirectional: false,
          nodeConfig: {
            minInstances: 1,
            maxInstances: 3,
            inputs: ['any'],
            outputs: ['termsData']
          },
          variants: [
            {
              id: 'var-standard-terms',
              blockId: 'block-terms',
              name: 'Standard Terms',
              description: 'Pre-defined terms and conditions',
              nodeType: 'standardTermsNode',
              defaultConfig: {
                sections: ['definitions', 'scope', 'termination'],
                isEditable: false
              }
            },
            {
              id: 'var-custom-terms',
              blockId: 'block-terms',
              name: 'Custom Terms',
              description: 'Customizable terms and conditions',
              nodeType: 'customTermsNode',
              defaultConfig: {
                versionControl: true,
                requireLegalReview: true
              }
            }
          ]
        }
      ]
    }
  ],
  connections: [
    {
      id: 'conn-contact-service',
      sourceBlockId: 'block-contact',
      targetBlockId: 'block-service',
      connectionType: 'data_flow',
      connectionRules: {
        allowMultiple: true,
        dataMapping: {
          'contactData.id': 'serviceData.contactId',
          'contactData.name': 'serviceData.contactName'
        },
        validation: {
          message: 'Service block requires at least one contact'
        }
      }
    },
    {
      id: 'conn-service-billing',
      sourceBlockId: 'block-service',
      targetBlockId: 'block-billing',
      connectionType: 'data_flow',
      connectionRules: {
        allowMultiple: false,
        dataMapping: {
          'serviceData.totalAmount': 'billingData.baseAmount',
          'serviceData.schedule': 'billingData.billingSchedule'
        }
      }
    }
  ]
};