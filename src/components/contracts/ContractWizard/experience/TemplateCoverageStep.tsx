import React from 'react';
import { useResources } from '@/hooks/queries/useResources';
import type { CoverageTypeItem } from '../steps/AssetSelectionStep';

interface Props {
  coverageTypes: CoverageTypeItem[];
  onChange: (items: CoverageTypeItem[]) => void;
}

/** A template specifies a coverage requirement, never a customer's asset. */
export default function TemplateCoverageStep({ coverageTypes, onChange }: Props) {
  const resources = useResources();
  const available = (resources.data || []).filter(item => item.is_active && ['equipment', 'asset'].includes(item.resource_type_id));
  const add = (resourceId: string) => {
    const resource = available.find(item => item.id === resourceId);
    if (!resource || coverageTypes.some(item => item.resource_id === resource.id)) return;
    onChange([...coverageTypes, {
      id: crypto.randomUUID(),
      sub_category: resource.sub_category || '',
      resource_id: resource.id,
      resource_name: resource.display_name || resource.name,
      unit_count: 1,
    }]);
  };
  return <section className="px-6 py-5 space-y-5">
    <div><h2 className="text-xl font-semibold">What does this template cover?</h2>
      <p className="mt-2 text-sm">Choose the equipment or facility types and expected quantities. The actual customer's units are attached when this template becomes a contract.</p></div>
    {resources.isPending && <p role="status">Loading coverage types…</p>}
    {resources.isError && <p role="alert">Coverage types could not be loaded. Retry before continuing.</p>}
    {!resources.isPending && !resources.isError && <label className="block">Add coverage type
      <select className="mt-2 block w-full rounded-lg border p-3" value="" onChange={event => add(event.target.value)}>
        <option value="">Choose a type</option>
        {available.filter(item => !coverageTypes.some(selected => selected.resource_id === item.id)).map(item => <option key={item.id} value={item.id}>{item.display_name || item.name}</option>)}
      </select>
    </label>}
    {coverageTypes.length === 0 && <p role="status">Add at least one type to define the coverage requirement.</p>}
    {coverageTypes.map(item => <div key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border p-4">
      <strong className="flex-1">{item.resource_name}</strong>
      <label>Expected units <input className="ml-2 w-20 rounded-lg border p-2" aria-label={`${item.resource_name} expected units`} type="number" min="1" step="1" value={item.unit_count ?? 1}
        onChange={event => onChange(coverageTypes.map(selected => selected.id === item.id ? { ...selected, unit_count: Math.max(1, Math.floor(Number(event.target.value) || 1)) } : selected))}/></label>
      <button type="button" className="rounded-lg border px-3 py-2" onClick={() => onChange(coverageTypes.filter(selected => selected.id !== item.id))}>Remove</button>
    </div>)}
  </section>;
}
