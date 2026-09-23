import type { Family } from './model';

export function labelApplies(settings: { is_equipment_based?: boolean; is_entity_based?: boolean; is_service_based?: boolean } | undefined, family: Family) {
  const flag = family === 'equipment' ? 'is_equipment_based' : family === 'facility' ? 'is_entity_based' : 'is_service_based';
  return settings?.[flag] === true;
}

export const registryType = (family: Family) => family === 'equipment' ? 'equipment' : family === 'facility' ? 'asset' : null;

export function ownRegistryItem(asset: any, tenantId: string, live: boolean, family: Family) {
  return !!registryType(family) && asset.tenant_id === tenantId && asset.is_live === live && asset.is_active === true &&
    asset.ownership_type === 'self' && asset.resource_type_id === registryType(family);
}
