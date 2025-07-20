// src/constants/sequence.ts

/**
 * Sequence types used in the application
 * These codes should match entries in the t_numbering_sequence table
 */
export enum SequenceType {
  // Core document types
  CONTACT = 'CONTACT',
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  QUOTATION = 'QUOTATION',
  
  // Project management
  PROJECT = 'PROJECT',
  TASK = 'TASK',
  
  // Support
  TICKET = 'TICKET',
  
  // Other types can be added as needed
}

/**
 * Reset frequency options for sequences
 */
export enum ResetFrequency {
  NEVER = 'NEVER',
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  CUSTOM = 'CUSTOM'
}

/**
 * Default configuration for sequence types when creating new ones
 */
export const DEFAULT_SEQUENCE_CONFIG: Record<SequenceType, {
  name: string;
  prefix: string;
  paddingLength: number;
  startValue: number;
  resetFrequency: ResetFrequency;
}> = {
  [SequenceType.CONTACT]: {
    name: 'Contact Number',
    prefix: 'CT',
    paddingLength: 4,
    startValue: 1001,
    resetFrequency: ResetFrequency.NEVER
  },
  [SequenceType.CONTRACT]: {
    name: 'Contract Number',
    prefix: 'CN',
    paddingLength: 4,
    startValue: 1001,
    resetFrequency: ResetFrequency.YEARLY
  },
  [SequenceType.INVOICE]: {
    name: 'Invoice Number',
    prefix: 'INV',
    paddingLength: 5,
    startValue: 10001,
    resetFrequency: ResetFrequency.YEARLY
  },
  [SequenceType.RECEIPT]: {
    name: 'Receipt Number',
    prefix: 'RCP',
    paddingLength: 5,
    startValue: 10001,
    resetFrequency: ResetFrequency.YEARLY
  },
  [SequenceType.QUOTATION]: {
    name: 'Quotation Number',
    prefix: 'QT',
    paddingLength: 4,
    startValue: 1001,
    resetFrequency: ResetFrequency.YEARLY
  },
  [SequenceType.PROJECT]: {
    name: 'Project Number',
    prefix: 'PRJ',
    paddingLength: 4,
    startValue: 1001,
    resetFrequency: ResetFrequency.YEARLY
  },
  [SequenceType.TASK]: {
    name: 'Task Number',
    prefix: 'TSK',
    paddingLength: 5,
    startValue: 10001,
    resetFrequency: ResetFrequency.NEVER
  },
  [SequenceType.TICKET]: {
    name: 'Support Ticket Number',
    prefix: 'TKT',
    paddingLength: 5,
    startValue: 10001, 
    resetFrequency: ResetFrequency.YEARLY
  }
};

/**
 * Interface for sequence generation result
 */
export interface GeneratedSequence {
  id: string;        // The full formatted ID (e.g., "INV-2023-00001")
  sequence: number;  // The numeric part only (e.g., 1)
  prefix: string;    // The prefix used (e.g., "INV-2023-")
  suffix: string;    // Any suffix applied (e.g., "/A" for duplicates)
}

/**
 * Interface for sequence configuration
 */
export interface SequenceConfig {
  id?: string;
  code: SequenceType;
  name: string;
  description?: string;
  prefix: string;
  suffix?: string;
  separator?: string;
  paddingLength: number;
  currentSequence?: number;
  startValue: number;
  incrementBy?: number;
  resetFrequency: ResetFrequency;
  lastResetDate?: string;
  tenantid: string;
  isActive?: boolean;
  isLive?: boolean;
}