import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ContractWizard, { type ContractType } from '@/components/contracts/ContractWizard';
import { useCatTemplate, useCatTemplates, type CatTemplate } from '@/hooks/queries/useCatTemplates';
import RfpContractDraft from '../rfp/experience/RfpContractDraft';
import { templateRelationship } from '@/components/contracts/ContractWizard/logic/templateRelationship';

const usable = (template: CatTemplate, tenantId: string, isLive: boolean) =>
  template.tenant_id === tenantId && template.is_live === isLive && template.is_active !== false &&
  (template.settings as any)?.lifecycle === 'signed_off' &&
  !!templateRelationship(template) &&
  Array.isArray((template.settings as any)?.wizard_state?.selectedBlocks) &&
  (template.settings as any).wizard_state.selectedBlocks.length > 0;

export default function CreateContractExperiencePage() {
  const { currentTenant, isLive, perspective } = useAuth();
  const { currentTheme, isDarkMode } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  const location = useLocation();
  const initialDraftText = typeof location.state?.vaniIntent === 'string' ? location.state.vaniIntent.slice(0, 500) : '';
  const [params, setParams] = useSearchParams();
  const source = params.get('source');
  const templateId = source === 'template' ? params.get('template') : null;
  const [templateSearch, setTemplateSearch] = useState('');
  const [templatePage, setTemplatePage] = useState(1);
  const templates = useCatTemplates({ limit: 100, page: templatePage, search: templateSearch.trim() || undefined });
  const templateDetail = useCatTemplate(templateId || undefined);
  const requested = params.get('relationship');
  const choices: ContractType[] = perspective === 'revenue' ? ['client', 'partner'] : perspective === 'expense' ? ['vendor'] : [];
  const valid = choices.includes(requested as ContractType);
  const [started, setStarted] = useState<ContractType | null>(valid ? requested as ContractType : null);
  const [initialScope, setInitialScope] = useState(() => JSON.stringify([currentTenant?.id, isLive, perspective]));
  const scopeChanged = !!started && initialScope !== JSON.stringify([currentTenant?.id, isLive, perspective]);
  const close = () => navigate('/ncontracts');
  const available = (templates.data?.data?.templates || []).filter(t => usable(t, currentTenant?.id || '', isLive));
  const chosen = templateId ? templateDetail.data?.data : null;
  const chosenValid = !!chosen && usable(chosen, currentTenant?.id || '', isLive);
  const templateType = chosenValid ? templateRelationship(chosen) : null;
  if (params.get('draft')) return <RfpContractDraft key={`${currentTenant?.id}-${isLive}-${params.get('draft')}`} id={params.get('draft')!} />;
  if (started && currentTenant?.id && !scopeChanged && source !== 'template') return <ContractWizard
    presentation="experience" agreementOnly isOpen contractType={started} initialDraftText={initialDraftText} onClose={close} />;
  if (templateType && currentTenant?.id && source === 'template' && chosenValid) return <ContractWizard
    key={`${currentTenant.id}:${isLive}:${chosen!.id}`} presentation="experience" agreementOnly isOpen contractType={templateType}
    startTemplate={chosen} onClose={close} />;
  return <main style={{ maxWidth: 880, margin: 'auto', padding: 'clamp(20px, 5vw, 64px)', color: colors.utility.primaryText }}>
    <p style={{ color: colors.brand.primary, fontSize: 12, letterSpacing: '.08em', fontWeight: 700 }}>CREATE AN AGREEMENT</p>
    <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-.035em', lineHeight: 1.15 }}>{source === 'template' ? 'Start with a template.' : 'Who is this commitment with?'}</h1>
    <p style={{ color: colors.utility.secondaryText, lineHeight: 1.7 }}>{source === 'template' ? 'Choose a published template. Its relationship and contract plan are already set; add the matching contact and start date.' : 'Start with the relationship. We’ll use your contacts and catalogue to shape the agreement, one decision at a time.'}</p>
    {scopeChanged || !currentTenant?.id || !choices.length ? <p role="alert">Workspace or perspective changed or is unavailable. Return to Contracts and start in the intended workspace. No contract is submitted from this screen.</p> : <>
      {requested && !valid && <p role="alert">That relationship is not available in this perspective. Choose explicitly below.</p>}
      {source !== 'template' && !started ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 30 }}>
        {choices.map(type => <button key={type} onClick={() => { setInitialScope(JSON.stringify([currentTenant?.id, isLive, perspective])); setParams(previous => { const next = new URLSearchParams(previous); next.set('relationship', type); return next; }, { replace: true }); setStarted(type); }}
          style={{ padding: 24, border: `1px solid ${colors.utility.primaryText}20`, borderRadius: 20, background: colors.utility.secondaryBackground, color: colors.utility.primaryText, textAlign: 'left', cursor: 'pointer' }}>
          <FileText size={24} color={colors.brand.primary} /><h2 style={{ fontSize: 19, marginTop: 18 }}>{type === 'client' ? 'Client contract' : type === 'partner' ? 'Partner contract' : 'Vendor contract'}</h2>
          <p style={{ fontSize: 13, color: colors.utility.secondaryText, lineHeight: 1.6 }}>Choose from your {type === 'client' ? 'clients' : type === 'partner' ? 'partners' : 'vendors'}. Agree the scope, price and delivery plan.</p><ArrowRight size={18} />
        </button>)}
      </div> : source === 'template' && !templateId ? <section aria-label="Published templates" style={{ display: 'grid', gap: 12, marginTop: 28 }}>
        <h2>Choose a published template</h2>
        <label>Search templates <input value={templateSearch} onChange={event => { setTemplateSearch(event.target.value); setTemplatePage(1); }} placeholder="Name or keyword" style={{ display: 'block', width: '100%', padding: 12, marginTop: 6, border: `1px solid ${colors.utility.primaryText}30`, borderRadius: 10, color: colors.utility.primaryText, background: colors.utility.secondaryBackground }} /></label>
        {templates.isPending && <p role="status">Loading templates…</p>}
        {templates.isError && <p role="alert">Templates could not be loaded. <button onClick={() => void templates.refetch()}>Retry</button></p>}
        {!templates.isPending && !templates.isError && !available.length && <p role="status">No published templates on this page. Try a search, another page, or <button onClick={() => navigate('/catalog-studio/templates-list')}>manage templates</button>.</p>}
        {available.map(template => <button key={template.id} onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.set('template', template.id); return next; })}
          style={{ padding: 20, border: `1px solid ${colors.utility.primaryText}20`, borderRadius: 14, background: colors.utility.secondaryBackground, color: colors.utility.primaryText, textAlign: 'left', cursor: 'pointer' }}>
          <strong>{template.display_name || template.name}</strong><span style={{ display: 'block', marginTop: 7, color: colors.utility.secondaryText }}>{templateRelationship(template)} template · {template.blocks?.length || 0} commitments · {template.currency || 'Currency to review'}</span>
        </button>)}
        {(templates.data?.data?.total || 0) > 100 && <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><button disabled={templatePage <= 1} onClick={() => setTemplatePage(page => page - 1)}>Previous</button><span>Page {templatePage}</span><button disabled={templatePage * 100 >= (templates.data?.data?.total || 0)} onClick={() => setTemplatePage(page => page + 1)}>Next</button></div>}
      </section> : source === 'template' && templateId && <p role="alert">{templateDetail.isPending ? 'Opening template…' : templateDetail.isError ? 'The template could not be loaded.' : 'This template is not published or is unavailable in this workspace and environment.'} <button onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.delete('template'); return next; })}>Choose another template</button></p>}
      {source !== 'template' && <p style={{ marginTop: 24, fontSize: 13, color: colors.utility.secondaryText }}>Manual creation · VaNi assistance is not required.</p>}
    </>}
    <button onClick={close} style={{ marginTop: 22, padding: '12px 0', color: colors.brand.primary, background: 'transparent', border: 0, cursor: 'pointer' }}>Back to Contracts</button>
  </main>;
}
