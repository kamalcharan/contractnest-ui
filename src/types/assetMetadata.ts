/** Registry-backed Smart Form field vocabulary. Keep aligned with the API's
 * domain/assetMetadata.ts; definitions themselves come from the database. */
export type AssetKind = 'equipment' | 'asset';
export type AttributeType = 'text' | 'number' | 'boolean' | 'date' | 'select';
export type RequiredStage = 'none' | 'service_start' | 'form_submit';
export type RegistryKey = 'id' | 'name' | 'code' | 'serial_number' | 'make' | 'model' | 'location' | 'resource_type_id' | 'asset_type_id' | 'template_id' | 'area_sqft' | 'capacity';
export type ServiceKey = 'contract_id' | 'event_id' | 'ticket_id' | 'ticket_number' | 'visit_number' | 'scheduled_date' | 'started_at' | 'technician_id' | 'technician_name';
export type FieldBinding =
  | { source: 'registry'; key: RegistryKey }
  | { source: 'specification'; key: string }
  | { source: 'service'; key: ServiceKey }
  | { source: 'response' };
export interface AttributeDefinition {
  resource_type_id: AssetKind;
  tenant_id: string | null;
  template_id: string | null;
  asset_type_id: string | null;
  attribute_key: string;
  label: string;
  data_type: AttributeType;
  unit: string | null;
  options: Array<{ value: string; label: string }>;
  required_stage: RequiredStage;
  is_active: boolean;
}
