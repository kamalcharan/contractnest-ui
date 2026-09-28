// Shared schema interpretation for execution forms. Unknown controls fail closed.
export const supportedServiceFields = new Set(['text','textarea','number','date','select','radio','checkpoint','checkbox','multi_select','heading','email','tel']);
export function readingAssessment(field: { reading_range?: { normal_min: number | null; normal_max: number | null; unit: string | null } }, value: unknown): string | null {
  if (value === '' || value === null || value === undefined || !Number.isFinite(Number(value))) return null;
  const range = field.reading_range;
  if (!range || range.normal_min == null && range.normal_max == null) return null;
  const number = Number(value);
  const within = (range.normal_min == null || number >= range.normal_min) && (range.normal_max == null || number <= range.normal_max);
  const limits = range.normal_min != null && range.normal_max != null ? `${range.normal_min}–${range.normal_max}` : range.normal_min != null ? `≥${range.normal_min}` : `≤${range.normal_max}`;
  return `${within ? 'Within' : 'Outside'} expected range (${limits} ${range.unit || ''})`;
}
export function formProblems(schema: any, answers: Record<string, any>, draft = false): string[] {
  const errors: string[] = [];
  for (const section of schema?.sections || []) for (const f of section.fields || []) {
    if (!supportedServiceFields.has(f.type)) { errors.push(`${f.label}: unsupported field type (${f.type}). Ask your administrator to review this form.`); continue; }
    if (f.type === 'heading') continue;
    if (f.binding?.source && f.binding.source !== 'response') continue;
    const v = answers[f.id], empty = v == null || typeof v === 'string' && !v.trim() || Array.isArray(v) && !v.length;
    if (!draft && (f.required || f.validation?.required) && empty) errors.push(`${f.label} is required.`);
    if (empty) continue;
    if (f.type === 'checkbox' && typeof v !== 'boolean') errors.push(`${f.label}: select a checkbox value.`);
    if (f.type === 'number') {
      if (!Number.isFinite(Number(v))) errors.push(`${f.label}: enter a valid number.`);
      if (f.validation?.min != null && Number(v) < f.validation.min) errors.push(`${f.label}: minimum ${f.validation.min}.`);
      if (f.validation?.max != null && Number(v) > f.validation.max) errors.push(`${f.label}: maximum ${f.validation.max}.`);
    }
    if (['select','radio','checkpoint','multi_select'].includes(f.type)) {
      const options=f.type==='checkpoint'&&!f.options?.length?[{value:'good'},{value:'warn'},{value:'bad'}]:f.options;
      const values = f.type === 'multi_select' ? (Array.isArray(v) ? v : [v]) : [v];
      if (values.some((x: any) => !options?.some((o: any) => o.value === x))) errors.push(`${f.label}: choose a configured option.`);
    }
  }
  return errors;
}
export function outcomeNeedsFollowup(r: Record<string, any>) {
  return r.work_status && r.work_status !== 'completed' || r.asset_condition === 'critical' || ['fail','conditional'].includes(r.overall_status) || ['fail','conditional'].includes(r.pass_overall);
}
export function applicableForms(mappings: any[], event: any) {
  const rows = mappings.filter(m => (!m.effective_from || m.effective_from <= event.scheduled_date?.slice(0,10)) && (!m.effective_to || m.effective_to >= event.scheduled_date?.slice(0,10)));
    const specific = rows.filter(m => m.contract_block_id === event.block_id || (m.original_block_id && m.original_block_id === event.block_id));
  return specific.length ? specific : rows.filter(m => !m.contract_block_id);
}
