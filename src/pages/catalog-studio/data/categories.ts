// src/pages/catalog-studio/data/categories.ts
import { BlockCategory } from '../types';

export const BLOCK_CATEGORIES: BlockCategory[] = [
  { id: 'service', name: 'Service', icon: '🎯', count: 12, color: '#7C3AED', bgColor: '#F5F3FF', description: 'Deliverable work items with SLA' },
  { id: 'spare', name: 'Spare Parts', icon: '📦', count: 8, color: '#0891B2', bgColor: '#ECFEFF', description: 'Physical products with inventory' },
  { id: 'billing', name: 'Billing', icon: '💰', count: 4, color: '#059669', bgColor: '#ECFDF5', description: 'Payment structures' },
  { id: 'text', name: 'Text', icon: '📄', count: 5, color: '#64748B', bgColor: '#F8FAFC', description: 'Terms, conditions, policies' },
  { id: 'video', name: 'Video', icon: '🎬', count: 2, color: '#DC2626', bgColor: '#FEF2F2', description: 'Embedded video content' },
  { id: 'image', name: 'Image', icon: '🖼️', count: 3, color: '#EA580C', bgColor: '#FFF7ED', description: 'Photos and diagrams' },
  { id: 'checklist', name: 'Checklist', icon: '☑️', count: 4, color: '#0284C7', bgColor: '#F0F9FF', description: 'Task verification lists' },
  { id: 'document', name: 'Document', icon: '📎', count: 2, color: '#CA8A04', bgColor: '#FEFCE8', description: 'File attachments' },
];

export const getCategoryById = (id: string): BlockCategory | undefined => {
  return BLOCK_CATEGORIES.find((c) => c.id === id);
};
