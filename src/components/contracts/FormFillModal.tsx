// src/components/contracts/FormFillModal.tsx
// Saves configured evidence for one visit/asset. Completion is a separate action.

import React, { useEffect, useMemo, useState } from 'react';
import { X, Loader2, CheckCircle2, Lock, AlertTriangle, ClipboardList } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useFormTemplateDetail,
  useCreateFormSubmission,
  useServiceFormSubmissions,
  useFormExecutionContext,
} from '@/hooks/queries/useFormTemplates';
import type { FormSchemaField, ServiceFormSubmission } from '@/hooks/queries/useFormTemplates';
import type { ContractEventAssetRow } from '@/hooks/queries/useContractEventQueries';
import type { ContractEvent } from '@/types/contractEvents';
import { formProblems, readingAssessment } from '@/utils/serviceForms';
import { useVaNiToast } from '@/components/common/toast/VaNiToast';
import { useContract } from '@/hooks/queries/useContractQueries';
import { useAuth } from '@/context/AuthContext';
import ServiceReport from './ServiceReport';

interface FormFillModalProps {
  readOnly?: boolean;
  initialAssetId?: string;
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  formTemplateId: string;
  formName: string;
  serviceEvents: ContractEvent[];
  eventAssetsByEvent: Record<string, ContractEventAssetRow[]>;
}

const FormFillModal: React.FC<FormFillModalProps> = ({
  isOpen,
  onClose,
  contractId,
  formTemplateId,
  formName,
  serviceEvents,
  eventAssetsByEvent,
  initialAssetId,
  readOnly = false,
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const { addToast } = useVaNiToast();
  const { currentTenant } = useAuth();
  const contract = useContract(isOpen && readOnly ? contractId : null);

  const { data: template, isLoading: loadingTemplate, error: templateError } =
    useFormTemplateDetail(formTemplateId, { enabled: isOpen });
  const createSubmission = useCreateFormSubmission();

  const [eventId, setEventId] = useState<string>('');
  const [assetId, setAssetId] = useState<string>('');
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const submissions = useServiceFormSubmissions(eventId || undefined);
  const context = useFormExecutionContext(eventId || undefined, assetId || undefined, formTemplateId, isOpen && !readOnly);
  const [savedReport, setSavedReport] = useState<ServiceFormSubmission | undefined>();
  const [loadedKey, setLoadedKey] = useState('');
  const [submissionId, setSubmissionId] = useState<string>();
  const [dirty, setDirty] = useState(false);
  const [sectionIndex,setSectionIndex]=useState(0);
  const allowDraft = template?.schema?.settings?.allow_draft === true;
  const closeForm = () => { if (!dirty || window.confirm('Leave without saving your changes?')) onClose(); };
  useEffect(() => {
    const key = formTemplateId + ':' + eventId + ':' + assetId;
    if (!isOpen || !eventId || (!readOnly && (!template || loadingTemplate)) || submissions.isLoading || submissions.error || loadedKey === key) return;
    const matching = submissions.data?.filter(s => s.form_template_id === formTemplateId && (s.event_asset_id || '') === assetId) || [];
    const latest = (readOnly ? matching.filter(s => ['submitted','approved'].includes(s.status)) : matching).sort((a,b)=>(b.updated_at||'').localeCompare(a.updated_at||''))[0];
    setResponses(latest?.responses || {});
    setSavedReport(readOnly ? latest : undefined);
    setSubmissionId(latest?.status === 'draft' && latest.form_template_version === template?.version ? latest.id : undefined);
    setLoadedKey(key); setDirty(false); setSectionIndex(0);
  }, [isOpen, formTemplateId, eventId, assetId, submissions.data, submissions.isLoading, submissions.error, loadedKey, template?.version]);

  const assets = useMemo(
    () => (eventId ? eventAssetsByEvent[eventId] || [] : []),
    [eventId, eventAssetsByEvent]
  );
  const provableAssets = useMemo(
    () => assets.filter((a) => a.status !== 'blocked_placeholder'),
    [assets]
  );
  const nextUnproven = (rows: ContractEventAssetRow[], excludeId?: string) =>
    rows.find((a) => a.status !== 'proven' && a.status !== 'blocked_placeholder' && a.id !== excludeId);

  // Initialize / reset when the modal opens: first service event, first
  // unproven asset of that event, empty responses.
  useEffect(() => {
    if (!isOpen) return;
    const firstEvent = serviceEvents[0]?.id || '';
    setEventId(firstEvent);
    const rows = firstEvent ? eventAssetsByEvent[firstEvent] || [] : [];
    setAssetId(initialAssetId || nextUnproven(rows)?.id || '');
    setResponses({});
    setServerError(null);
    setValidationError(null);
    setLoadedKey(''); setSubmissionId(undefined); setSavedReport(undefined); setDirty(false); setSectionIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const sections = (readOnly && savedReport?.form_schema_snapshot?.sections) || template?.schema?.sections || [];
  if (readOnly) {
    if (!savedReport || contract.isLoading) return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"><div className="rounded-xl bg-white p-6"><p>{submissions.isLoading || contract.isLoading ? 'Loading saved report…' : 'No submitted report was found for this equipment.'}</p><button className="mt-3 rounded border px-3 py-2" onClick={onClose}>Close</button></div></div>;
    return <ServiceReport report={savedReport} sections={sections} formName={savedReport.form_schema_snapshot?.title || formName} contract={contract.data} workspaceId={currentTenant?.id} workspaceName={currentTenant?.name} onClose={onClose} />;
  }
  const savedBoundValues = (savedReport?.service_context_snapshot?.bound_values || {}) as Record<string, unknown>;
  const boundValues = readOnly ? savedBoundValues : context.data?.values || {};
  const registryAsset = (readOnly ? savedReport?.asset_metadata_snapshot : context.data?.asset_snapshot) || null;
  const registryText = (value: unknown) => value == null || value === '' ? 'Not recorded' : String(value);

  const setField = (fieldId: string, value: unknown) => {
    setDirty(true);
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    setValidationError(null);
  };

  const validate = (): string | null => {
    const problems = formProblems(template?.schema, responses);
    if (problems.length) return problems[0];
    if (context.data?.missing_form_metadata?.length)
      return `Complete equipment metadata before submitting: ${context.data.missing_form_metadata[0].label}`;
    for (const section of sections) {
      for (const field of section.fields) {
        if (field.binding?.source && field.binding.source !== 'response') continue;
        if (field.validation?.required) {
          const v = responses[field.id];
          if (v === undefined || v === null || v === '') {
            return `"${field.label}" is required`;
          }
        }
      }
    }
    if (provableAssets.length > 0 && !assetId) {
      return 'Select which asset this form is for';
    }
    return null;
  };

  const handleSubmit = async (draft = false) => {
    if (readOnly || submissions.isLoading || submissions.error || context.isLoading || context.error || loadingTemplate || !template) return;
    const invalid = draft ? formProblems(template?.schema, responses, true)[0] : validate();
    if (invalid) {
      const problemSection = sections.findIndex((section) =>
        formProblems({ sections: [section] }, responses, draft).includes(invalid)
        || section.fields.some((field) => invalid.startsWith(`${field.label}:`) || invalid.startsWith(`${field.label} is required`))
      );
      if (problemSection >= 0) {
        setSectionIndex(problemSection);
        window.setTimeout(() => document.getElementById('service-form-current-section')?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 0);
      }
      const message = problemSection >= 0 ? `${sections[problemSection].title}: ${invalid}` : invalid;
      setValidationError(message);
      addToast({type:'error',title:'Review the form',message});
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const submission = await createSubmission.mutateAsync({
        form_template_id: formTemplateId,
        service_event_id: eventId,
        contract_id: contractId,
        event_asset_id: assetId || undefined,
        responses,
        submission_id: submissionId,
        save_draft: draft,
      });
      setSubmissionId(submission?.id); setDirty(false);

      // Evidence and successful execution are separate. Explicit completion
      // checks every applicable form before proving assets/closing the visit.
      addToast({type:'success',title:draft ? 'Draft saved' : 'Outcome recorded',message:'The service remains open until you complete it.'});
      onClose();
    } catch (err: any) {
      addToast({type:'error',title:'Not saved',message:err?.response?.data?.error || err?.message || 'Could not save this form. Your answers are still here.'});
      setServerError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Submission failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormSchemaField) => {
    if (field.binding?.source && field.binding.source !== 'response') {
      const bound = boundValues[field.id];
      const display = bound == null || bound === '' ? 'Not recorded' : typeof bound === 'object' ? JSON.stringify(bound) : String(bound);
      const source = field.binding.source === 'service' ? 'From this service visit' : 'From the equipment registry';
      return <div className="rounded-lg border px-3 py-2 text-sm" style={{backgroundColor:colors.utility.secondaryBackground,borderColor:`${colors.utility.primaryText}15`,color:colors.utility.primaryText}}>
        <span className="font-medium">{display}</span>
        <span className="block text-xs mt-1" style={{color:colors.utility.secondaryText}}>{source} · read-only</span>
      </div>;
    }
    const value = (responses[field.id] as any) ?? '';
    const baseStyle = {
      backgroundColor: colors.utility.primaryBackground,
      borderColor: `${colors.utility.primaryText}15`,
      color: colors.utility.primaryText,
    };
    switch (field.type) {
      case 'heading':
        return <h3 className="font-semibold pt-3">{field.label}</h3>;
      case 'checkpoint':
        return <div className="flex flex-wrap gap-2">{(field.options?.length?field.options:[{label:'Good',value:'good'},{label:'Attention',value:'warn'},{label:'Fail',value:'bad'}]).map(o=><button key={o.value} type="button" aria-pressed={value===o.value} onClick={()=>setField(field.id,o.value)} className="border rounded-lg px-4 py-3" style={value===o.value?{backgroundColor:colors.brand.primary,color:'#fff'}:baseStyle}>{o.label}</button>)}</div>;
      case 'radio':
      case 'multi_select':
        return <div className="space-y-2">{field.options?.map(o => <label key={o.value} className="flex gap-3 border rounded-lg p-3" style={baseStyle}>
          <input type={field.type === 'radio' ? 'radio' : 'checkbox'} name={field.id} aria-label={o.label}
            checked={field.type === 'radio' ? value === o.value : Array.isArray(value) && value.includes(o.value)}
            onChange={e => setField(field.id, field.type === 'radio' ? o.value : e.target.checked ? [...(Array.isArray(value) ? value : []), o.value] : (Array.isArray(value) ? value : []).filter(v => v !== o.value))}/>{o.label}
        </label>)}</div>;
      case 'select':
        return (
          <select
            aria-label={field.label}
            value={value}
            onChange={(e) => setField(field.id, e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            style={baseStyle}
          >
            <option value="">Select…</option>
            {(field.options || []).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            aria-label={field.label}
            value={value}
            onChange={(e) => setField(field.id, e.target.value)}
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm resize-none"
            style={baseStyle}
            placeholder={field.help_text || ''}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            step={field.step || 'any'}
            min={field.validation?.min}
            max={field.validation?.max}
            aria-label={field.label}
            value={value}
            onChange={(e) => setField(field.id, e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            style={baseStyle}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            aria-label={field.label}
            value={value}
            onChange={(e) => setField(field.id, e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            style={baseStyle}
          />
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 text-sm" style={{ color: colors.utility.primaryText }}>
            <input
              type="checkbox"
              aria-label={field.label} checked={!!value}
              onChange={(e) => setField(field.id, e.target.checked)}
            />
            {field.help_text || field.label}
          </label>
        );
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            aria-label={field.label}
            value={value}
            onChange={(e) => setField(field.id, e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            style={baseStyle}
            placeholder={field.help_text || ''}
          />
        );
      default:
        return <p role="alert">This form contains an unsupported control ({field.type}). Ask your administrator to update it before submission.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={submitting ? undefined : closeForm} />
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}10` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${colors.brand.primary}10` }}
            >
              <ClipboardList className="w-4 h-4" style={{ color: colors.brand.primary }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: colors.utility.primaryText }}>
                {template?.schema?.title || formName}
              </p>
              <p className="text-[10px]" style={{ color: colors.utility.secondaryText }}>
                Evidence form — one submission per asset
              </p>
            </div>
          </div>
          <button
            onClick={closeForm}
            disabled={submitting}
            className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Guard: evidence needs a visit — without a service event there is
              nothing (and no equipment) to record against */}
          {serviceEvents.length === 0 && (
            <div
              className="flex items-start gap-2 rounded-lg border p-3 text-xs"
              style={{ borderColor: '#f59e0b40', backgroundColor: '#f59e0b10', color: '#b45309' }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                No service visit in this drawer — add the service event (From Contract)
                first, then fill the evidence form for its equipment.
              </span>
            </div>
          )}

          {/* Which equipment: when the visit has no per-asset rows (legacy
              contracts), the form applies to the visit as a whole */}
          {serviceEvents.length > 0 && assets.length === 0 && (
            <p className="text-[11px]" style={{ color: colors.utility.secondaryText }}>
              This visit has no per-equipment tracking — the form is recorded
              against the visit as a whole.
            </p>
          )}

          {/* Visit selector (only when the drawer holds several service events) */}
          {serviceEvents.length > 1 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: colors.utility.secondaryText }}>
                Visit
              </p>
              <select
                value={eventId}
                onChange={(e) => {
                  if (dirty && !window.confirm('Change visit and discard unsaved answers?')) return;
                  const next = e.target.value;
                  setEventId(next);
                  const rows = eventAssetsByEvent[next] || [];
                  setAssetId(rows.find((a) => a.status !== 'proven' && a.status !== 'blocked_placeholder')?.id || '');
                }}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: `${colors.utility.primaryText}15`,
                  color: colors.utility.primaryText,
                }}
              >
                {serviceEvents.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.block_name}{e.sequence_number > 0 ? ` #${e.sequence_number}/${e.total_occurrences}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Asset selector — which equipment this form proves */}
          {assets.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: colors.utility.secondaryText }}>
                This form is for
              </p>
              <div className="flex flex-wrap gap-1.5">
                {assets.map((a) => {
                  const isProven = a.status === 'proven';
                  const isBlocked = a.status === 'blocked_placeholder';
                  const selected = assetId === a.id;
                  return (
                    <button
                      key={a.id}
                      disabled={isBlocked || submitting}
                      onClick={() => { if (!dirty || window.confirm('Change equipment and discard unsaved answers?')) setAssetId(a.id); }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-60"
                      style={{
                        backgroundColor: selected ? `${colors.brand.primary}12` : colors.utility.secondaryBackground,
                        borderColor: selected ? colors.brand.primary : `${colors.utility.primaryText}12`,
                        color: isProven ? colors.semantic.success : isBlocked ? '#d97706' : colors.utility.primaryText,
                      }}
                      title={isBlocked ? 'Awaiting asset — attach the real asset first' : undefined}
                    >
                      {isProven ? <CheckCircle2 className="w-3 h-3" /> : isBlocked ? <Lock className="w-3 h-3" /> : null}
                      {a.asset_name || a.asset_ref}
                      {isProven && <span className="text-[9px]">(proven)</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {registryAsset && (
            <div className="rounded-xl border p-3 text-sm" style={{backgroundColor:colors.utility.secondaryBackground,borderColor:`${colors.utility.primaryText}20`,color:colors.utility.primaryText}}>
              <p className="font-semibold mb-1">Equipment from registry</p>
              <p className="text-xs mb-2" style={{color:colors.utility.secondaryText}}>These details belong to the equipment record, not this service form. Missing details do not block service answers.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <span>Name: {registryText(registryAsset.name)}</span>
                <span>Tag: {registryText(registryAsset.code)}</span>
                <span>Serial: {registryText(registryAsset.serial_number)}</span>
                <span>Make / model: {registryText([registryAsset.make,registryAsset.model].filter(Boolean).join(' '))}</span>
                <span>Location: {registryText(registryAsset.location)}</span>
              </div>
            </div>
          )}

          {sections.length > 2 && <nav className="flex flex-wrap gap-2" aria-label="Form sections">{sections.map((section,index)=><button key={section.id} onClick={()=>setSectionIndex(index)} className="border rounded-lg px-3 py-2 text-sm text-left" style={{backgroundColor:index===sectionIndex?colors.brand.primary:colors.utility.primaryBackground,color:index===sectionIndex?'#fff':colors.utility.primaryText}}>{index+1}. {section.title}<span className="block text-[10px] opacity-80">{section.fields.filter(field => (field.required || field.validation?.required) && (!field.binding?.source || field.binding.source === 'response') && (responses[field.id] == null || responses[field.id] === '')).length} required left</span></button>)}</nav>}
          {/* Schema */}
          {loadingTemplate || submissions.isLoading || (!readOnly && context.isLoading) ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.brand.primary }} />
            </div>
          ) : templateError || submissions.error || (!readOnly && context.error) ? (
            <div className="flex items-center gap-2 text-sm" style={{ color: colors.semantic.error }}>
              <AlertTriangle className="w-4 h-4" /> Could not load the form, saved answers or equipment details. Close and retry; nothing has been overwritten.
            </div>
          ) : (
            (sections.length > 2 ? [sections[sectionIndex]] : sections).filter(Boolean).map((section) => (
              <fieldset id="service-form-current-section" disabled={readOnly || submitting} key={section.id} className="space-y-3 scroll-mt-20">
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: colors.utility.secondaryText }}>
                  {section.title}
                </p>
                {section.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-xs font-medium mb-1" style={{ color: colors.utility.primaryText }}>
                      {field.label}
                      <span className="ml-1 text-[10px] font-medium" style={{ color: (field.required || field.validation?.required) ? colors.semantic.error : colors.utility.secondaryText }}>
                        {(field.required || field.validation?.required) ? 'Required' : 'Optional'}
                      </span>
                    </label>
                    {renderField(field)}
                    {field.type === 'number' && field.reading_range && (field.reading_range.normal_min != null || field.reading_range.normal_max != null) && (
                      <p className="mt-1 text-xs" style={{color: colors.utility.secondaryText}}>
                        Expected range: {field.reading_range.normal_min ?? '—'}–{field.reading_range.normal_max ?? '—'} {field.reading_range.unit || ''}
                      </p>
                    )}
                    {field.type === 'number' && field.reading_range && responses[field.id] !== '' && responses[field.id] !== undefined && (
                      <p className="mt-1 text-xs font-semibold" style={{color: readingAssessment(field,responses[field.id])?.startsWith('Outside') ? colors.semantic.warning : colors.semantic.success}}>
                        {readingAssessment(field,responses[field.id]) || 'No expected range configured'} · The measured value is saved even when outside range.
                      </p>
                    )}
                    {field.help_text && field.type !== 'textarea' && field.type !== 'checkbox' && (
                      <p className="text-[10px] mt-0.5" style={{ color: colors.utility.secondaryText }}>
                        {field.help_text}
                      </p>
                    )}
                  </div>
                ))}
              </fieldset>
            ))
          )}

          {!readOnly && !!context.data?.missing_form_metadata?.length && (
            <div className="rounded-lg border p-3 text-sm" role="alert" style={{borderColor:'#f59e0b',backgroundColor:'#fef3c7',color:'#92400e'}}>
              Complete {context.data.missing_form_metadata.map(x => x.label).join(', ')} in the equipment registry before submitting this report.
            </div>
          )}

          {(validationError || serverError) && (
            <div
              className="flex items-start gap-2 rounded-lg border p-3 text-xs"
              style={{ borderColor: `${colors.semantic.error}30`, backgroundColor: `${colors.semantic.error}08`, color: colors.semantic.error }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{validationError || serverError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 flex items-center gap-3 px-5 py-4 border-t"
          style={{ backgroundColor: colors.utility.primaryBackground, borderColor: `${colors.utility.primaryText}10` }}
        >
          <button
            onClick={closeForm}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all hover:opacity-80"
            style={{ borderColor: `${colors.utility.primaryText}15`, color: colors.utility.primaryText }}
          >
            {readOnly ? 'Close report' : 'Cancel'}
          </button>
          {!readOnly && <button
            onClick={() => handleSubmit(false)}
            disabled={submitting || loadingTemplate || submissions.isLoading || context.isLoading || !!context.error || !!submissions.error || !!templateError || serviceEvents.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: colors.brand.primary, color: '#ffffff' }}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save outcome
          </button>}
          {allowDraft && !readOnly && <button onClick={() => handleSubmit(true)} disabled={submitting || loadingTemplate || submissions.isLoading || context.isLoading || !!context.error || !!submissions.error} className="border rounded-lg px-4 py-2.5 text-sm font-semibold">Save draft</button>}
        </div>
      </div>
    </div>
  );
};

export default FormFillModal;
