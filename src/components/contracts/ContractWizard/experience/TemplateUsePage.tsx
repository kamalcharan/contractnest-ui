import React, { useState } from 'react';
import { ArrowLeft, Check, FileText, Save, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { textOnBrand } from '@/pages/experience/model';
import type { ContractWizardState, ContractType } from '../logic/state';
import { serviceErrors } from './ServicesCatalog';
import { eventPreview } from './eventsModel';
import { moneyTotals } from './moneyModel';
import './agreement.css';
import './approved-agreement.css';

interface Props {
  state: ContractWizardState;
  relationship: ContractType;
  contactPicker: React.ReactNode;
  busy: boolean;
  error: string | null;
  saveStatus: string;
  onChange: (patch: Partial<ContractWizardState>) => void;
  onSave: () => Promise<boolean>;
  onCreate: () => Promise<void>;
  onEquipment: () => void;
  onClose: () => void;
}

const inputDate = (date: Date) => Number.isFinite(date.getTime())
  ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  : '';

/** A template is an approved plan, not a second empty contract wizard. */
export default function TemplateUsePage(p: Props) {
  const { currentTheme, isDarkMode } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const [attempted, setAttempted] = useState(false);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState('');
  const s = p.state;
  const validDate = Number.isFinite(new Date(s.startDate).getTime());
  const preview = validDate ? eventPreview(s) : null;
  const issues = [...new Set([...serviceErrors(s.selectedBlocks, s.currency, s.coverageTypes), ...(preview?.errors || [])])];
  const totals = moneyTotals(s);
  const format = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: s.currency }).format(value);
  const ready = !!s.buyerId && validDate && issues.length === 0;
  const save = async () => {
    setAttempted(true);
    if (!s.buyerId || !validDate || working || p.busy) return;
    setWorking(true);
    try { setNotice(await p.onSave() ? 'Draft saved. Nothing was sent.' : 'Save was not confirmed. Please retry.'); }
    finally { setWorking(false); }
  };
  const create = async () => {
    setAttempted(true);
    if (!ready || working || p.busy) return;
    setWorking(true);
    try { await p.onCreate(); }
    finally { setWorking(false); }
  };
  const date = (value: Date) => value.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  return <div className="ag-page" style={{ '--ag-bg': colors.utility.primaryBackground, '--ag-panel': colors.utility.secondaryBackground, '--ag-text': colors.utility.primaryText, '--ag-muted': colors.utility.secondaryText, '--ag-line': `${colors.utility.primaryText}22`, '--ag-brand': colors.brand.primary, '--ag-onbrand': textOnBrand(colors.brand.primary), '--ag-error': colors.semantic.error } as React.CSSProperties}>
    <header className="ag-header"><div><FileText size={22}/><strong>ContractNest</strong><span>Use approved template</span></div><div><span role="status">Draft · {p.saveStatus === 'saving' ? 'Saving…' : p.saveStatus === 'saved' ? 'Saved' : 'Ready to set up'}</span><button type="button" aria-label="Close template setup" disabled={working || p.busy} onClick={p.onClose}><X size={20}/></button></div></header>
    <div className="ag-layout"><main><div className="ag-intro"><span className="ag-eyebrow">TEMPLATE SETUP</span><h1>{s.contractName}</h1><p>The template supplies scope, services, schedule, price and contract rules. Add the customer and start date; attach real equipment now or later.</p></div>
      <fieldset className="ag-fields" disabled={working || p.busy}>
        <section className="ag-card"><h2>1 · Who is this for?</h2>{p.contactPicker}{attempted && !s.buyerId && <p className="ag-error" role="alert">Choose a customer before continuing.</p>}</section>
        <section className="ag-card"><h2>2 · When does it start?</h2><label>Start date <input aria-label="Contract start date" type="date" value={inputDate(new Date(s.startDate))} onChange={event => p.onChange({ startDate: event.target.value ? new Date(`${event.target.value}T00:00:00`) : new Date(NaN), eventOverrides: {}, eventsReview: undefined })}/></label>{attempted && !validDate && <p className="ag-error" role="alert">Choose a valid start date.</p>}<p>Fixed template term: <strong>{s.durationValue} {s.durationUnit}</strong>. Changing the term requires a new template version, so the services, dates and payment plan remain consistent.</p></section>
        <section className="ag-card"><h2>3 · Covered equipment</h2><p>{s.coverageTypes.length ? s.coverageTypes.map(c => `${c.resource_name} × ${c.unit_count || 1}`).join(' · ') : 'This template has no equipment requirement.'}</p><p>{s.equipmentDetails.filter(d => !!d.asset_registry_id).length} real unit(s) attached. Remaining units can be identified later.</p>{!!s.coverageTypes.length && <button type="button" className="ag-secondary" disabled={!s.buyerId} onClick={p.onEquipment}>Attach or review equipment</button>}</section>
      </fieldset>
      <section className="ag-card"><h2>Included from the template</h2><p><strong>{format(totals.grandTotal)}</strong> · {s.selectedBlocks.filter(b => b.categoryId !== 'text').length} commitments · {preview?.events.filter(e => e.event_type === 'service').length ?? '—'} planned service events</p><details><summary>Review services, money and timing · optional</summary><ul>{s.selectedBlocks.filter(b => b.categoryId !== 'text').map(b => <li key={b.id}>{b.name} · {b.quantity} {b.categoryId === 'service' ? 'visit(s)' : 'item(s)'}{b.serviceCycleDays ? ` · every ${b.serviceCycleDays} days` : ''} · {format(b.totalPrice)}</li>)}</ul><p>Payment plan: {preview?.events.filter(e => e.event_type === 'billing').length ?? '—'} scheduled payment event(s). Delivery and acceptance follow the saved template.</p>{validDate && preview && !preview.errors.length && <p>First scheduled event: {preview.events[0] ? date(preview.events[0].scheduled_date) : 'No dated event required'}.</p>}</details></section>
      {attempted && issues.length > 0 && <section className="ag-card" role="alert"><h2>This template needs repair before use</h2><ul>{issues.map(issue => <li key={issue}>{issue}</li>)}</ul><p>These are template configuration errors, not missing choices for the buyer.</p></section>}
      {(notice || p.error) && <p role={p.error || notice.includes('not confirmed') ? 'alert' : 'status'} className={p.error || notice.includes('not confirmed') ? 'ag-error' : ''}>{p.error || notice}</p>}
    </main><aside><span className="ag-eyebrow">FIXED TEMPLATE</span><h2>{s.contractName}</h2><p>{s.durationValue} {s.durationUnit} · {s.currency}</p><p>{s.coverageTypes.map(c => c.resource_name).join(', ') || 'Service-based'}</p><strong>{format(totals.grandTotal)}</strong><p><Check size={16} style={{ display: 'inline' }}/> No template commitment is changed in this setup.</p></aside></div>
    <footer className="ag-footer"><button type="button" disabled={working || p.busy} onClick={p.onClose}><ArrowLeft size={16}/>Back to contracts</button><button type="button" disabled={working || p.busy} onClick={() => void save()}><Save size={16}/>Save draft</button><button type="button" className="ag-primary" disabled={working || p.busy} onClick={() => void create()}>{working ? 'Working…' : s.acceptanceMethod === 'auto' ? 'Create contract from template' : 'Create proposal from template'}</button></footer>
  </div>;
}
