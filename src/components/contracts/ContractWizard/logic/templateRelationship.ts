import type { CatTemplate } from '@/hooks/queries/useCatTemplates';

export type TemplateRelationship = 'client' | 'partner' | 'vendor';

export function templateRelationship(template: Pick<CatTemplate, 'settings'> | null | undefined): TemplateRelationship | null {
  const value = template?.settings?.relationship;
  return value === 'client' || value === 'partner' || value === 'vendor' ? value : null;
}

export const templateRelationshipLabel = (value: TemplateRelationship): string =>
  value === 'client' ? 'Customer template' : value === 'vendor' ? 'Vendor template' : 'Partner template';
