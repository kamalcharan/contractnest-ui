// src/components/contracts/vani/BulkAssignDialog.tsx
// Multi-party assignment of one published template. The user reviews the
// batch before explicitly choosing activation now or individual draft review.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Users, Search, User, Building2, CheckCircle2, Loader2, AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useVaNiToast } from '@/components/common/toast/VaNiToast';
import { useContactList } from '@/hooks/useContacts';
import { useContractSubmission } from '@/hooks/useContractSubmission';
import vaniComposerService, { VaniParsedIntent, VaniComposeResult, assertVaniScope } from '@/services/vaniComposerService';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import { CONTACT_CLASSIFICATION_CONFIG } from '@/utils/constants/contacts';
import type { TemplateSeed } from './VaNiComposerLauncher';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { TemplateRelationship } from '@/components/contracts/ContractWizard/logic/templateRelationship';
import {
  computeContractEvents,
  type ContractEvent,
  type ComputeEventsInput,
} from '@/utils/service-contracts/contractEvents';

interface BulkAssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  seed: TemplateSeed | null;
  templateName: string;
  relationship: TemplateRelationship;
  onDone?: () => void;
}

type RowStatus = 'pending' | 'running' | 'done' | 'skipped' | 'error';
interface ProgressRow {
  id: string;
  name: string;
  status: RowStatus;
  contractNumber?: string;
  contractId?: string;
  createdStatus?: string;
  error?: string;
}

const contactDisplayName = (c: any): string =>
  c?.display_name || c?.company_name ||
  [c?.first_name, c?.last_name].filter(Boolean).join(' ') ||
  c?.name || 'Unnamed';

// Contact names are free-text (often ALL CAPS from bulk imports) — title-case
// for display in the generated contract heading, same as the single-assign
// composer does.
const toTitleCase = (s: string): string =>
  String(s || '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

// Display classification — the contact's actual type, for the tag/badge shown
// beside their name. Uses the shared 4-type config (client/vendor/partner/
// team_member) so it never mislabels a team member as a client.
const contactClasses = (c: any): string[] => Array.isArray(c?.classifications)
  ? c.classifications.map((v: any) => typeof v === 'string' ? v : v?.classification_value).filter(Boolean) : [];
const contactClassificationLabel = (c: any): string => {
  const classes = contactClasses(c);
  return CONTACT_CLASSIFICATION_CONFIG.filter(cfg => classes.includes(cfg.id)).map(cfg => cfg.label).join(', ') || 'Unclassified';
};
const contactContractType = (c: any): 'client' | 'partner' | 'vendor' => {
  const types = Array.from(new Set(contactClasses(c).filter(v => ['client','partner','vendor'].includes(v))));
  if (types.length !== 1) throw new Error(`Choose an unambiguous Client, Partner or Vendor classification for ${contactDisplayName(c)} before assigning.`);
  return types[0] as 'client' | 'partner' | 'vendor';
};
const eligibleForTemplate = (c: any, relationship: TemplateRelationship): boolean => {
  const types = Array.from(new Set(contactClasses(c).filter(v => ['client','partner','vendor'].includes(v))));
  return types.length === 1 && types[0] === relationship;
};

const BulkAssignContent: React.FC<BulkAssignDialogProps> = ({
  isOpen, onClose, seed, templateName, relationship, onDone,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const { addToast } = useVaNiToast();
  const { submitBulk } = useContractSubmission();
  const composer = useMemo(() => vaniComposerService.withContext('template', null), []);
  const [templateError, setTemplateError] = useState('');

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Record<string, any>>({}); // id -> contact
  const [reviewing, setReviewing] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<'activate' | 'drafts' | null>(null);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [running, setRunning] = useState(false);
  const submissionStarted = useRef(false);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [finished, setFinished] = useState(false);

  // The published template fixes all terms. Only the shared start date varies.
  const [intent, setIntent] = useState<VaniParsedIntent | null>(null);
  const [result, setResult] = useState<VaniComposeResult | null>(null);
  const [assembling, setAssembling] = useState(false);

  const { data: contacts, loading } = useContactList({
    search: search.trim().length >= 2 ? search.trim() : undefined,
    classifications: [relationship],
    limit: 100,
    enabled: isOpen && !running && !finished,
  });

  const selectedIds = Object.keys(selected);
  const selectedCount = selectedIds.length;

  const perContract = seed?.match.total || 0;
  const currencySym = useMemo(() => {
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: seed?.match.currency || 'INR' }); }
    catch { return null; }
  }, [seed?.match.currency]);
  const fmt = (n: number) => currencySym ? currencySym.format(n) : `${seed?.match.currency || 'INR'} ${n.toLocaleString()}`;

  const toggle = (c: any) => {
    if (!eligibleForTemplate(c, relationship)) return;
    setSelected((prev) => {
      const next = { ...prev };
      if (next[c.id]) delete next[c.id];
      else if (Object.keys(next).length < 200) next[c.id] = c;
      return next;
    });
  };
  const selectAllVisible = () => {
    setSelected((prev) => {
      const next = { ...prev };
      const list = (contacts || []).filter((c: any) => eligibleForTemplate(c, relationship));
      const allOn = list.length > 0 && list.every((c: any) => next[c.id]);
      if (allOn) list.forEach((c: any) => delete next[c.id]);
      else list.forEach((c: any) => { if (Object.keys(next).length < 200) next[c.id] = c; });
      return next;
    });
  };

  const reset = () => {
    submissionStarted.current = false;
    setSelected({}); setProgress([]); setFinished(false); setRunning(false);
    setSearch(''); setReviewing(false); setSubmissionMode(null);
    setIntent(null); setResult(null); setTemplateError('');
  };
  const handleClose = () => { if (!running) { reset(); onClose(); } };

  // Preview the fixed template at the selected start date before any writes.
  const reassembleBase = useCallback(async (nextIntent: VaniParsedIntent) => {
    if (!seed) return;
    setAssembling(true);
    setResult(null);
    setTemplateError('');
    try {
      const res = await composer.assembleFromTemplate(
        seed.match.template_id,
        nextIntent,
        null,
        seed.match.currency,
        []
      );
      setResult(res);
    } catch (err: any) {
      if (err?.response?.data?.error?.code === 'MISSING_AGREEMENT_DETAILS') {
        const fields = err?.response?.data?.error?.details?.missingFields;
        setTemplateError(`This template could not be prepared for assignment${Array.isArray(fields) && fields.length ? `: ${fields.join(', ')}` : ''}. No contracts have been created.`);
        return;
      }
      setTemplateError('The template preview could not be prepared. No contracts have been created.');
      addToast({ type: 'error', title: 'Could not refresh draft', message: err?.message || 'Failed to assemble' });
    } finally {
      setAssembling(false);
    }
  }, [seed, addToast]);

  useEffect(() => {
    if (!isOpen || !seed) return;
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    const initIntent: VaniParsedIntent = { ...seed.intent, start_date: today };
    setIntent(initIntent);
    reassembleBase(initIntent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, seed?.match.template_id]);

  const updateStartDate = (v: string) => {
    if (!intent || assembling) return;
    setStartDate(v);
    const next = { ...intent, start_date: v };
    setIntent(next);
    if (!v) {
      setResult(null);
      setTemplateError('Choose a start date for this batch.');
      return;
    }
    reassembleBase(next);
  };

  // ── Template schedule preview ──
  // Same computation the wizard's Events Preview runs, fed from the assembled
  // (buyer-independent) draft. Every clone uses this same schedule.
  const templateEvents: ContractEvent[] = useMemo(() => {
    const d: any = result?.draft;
    if (!d || !Array.isArray(d.selectedBlocks) || d.selectedBlocks.length === 0) return [];
    const input: ComputeEventsInput = {
      startDate: new Date(startDate),
      durationValue: d.durationValue,
      durationUnit: d.durationUnit,
      selectedBlocks: d.selectedBlocks,
      paymentMode: d.paymentMode,
      emiMonths: d.emiMonths,
      perBlockPaymentType: d.perBlockPaymentType || {},
      billingCycleType: d.billingCycleType,
      grandTotal: d.grandTotal || d.totalValue || 0,
      currency: d.currency,
      baseSubtotal: d.baseSubtotal,
      discountTotal: 0,
    };
    try {
      return computeContractEvents(input);
    } catch {
      return []; // a half-assembled draft must never break the dialog
    }
  }, [result, startDate]);


  // ── Same-person detection across the SELECTED members ──
  // A contact may legitimately hold any number of contracts, so nothing here
  // blocks or skips anyone. What IS worth flagging is the same HUMAN sitting
  // in the batch twice under two contact records — duplicate rows from an
  // import, a re-registration, a slightly different spelling. The reliable
  // signal is a shared mobile number or email address, not the name.
  // Purely advisory: the user decides whether that is intended.
  const duplicateWarnings = useMemo(() => {
    const byChannel = new Map<string, { label: string; kind: string; names: string[] }>();
    for (const id of selectedIds) {
      const c: any = selected[id];
      const channels: any[] = c?.contact_channels || [];
      // One entry per (contact, channel value) — a contact listing the same
      // number twice must not look like two people.
      const seenOnThisContact = new Set<string>();
      for (const ch of channels) {
        const type = String(ch?.channel_type || '').toLowerCase();
        if (type !== 'mobile' && type !== 'email' && type !== 'whatsapp') continue;
        const raw = String(ch?.value || '').trim();
        if (!raw) continue;
        // Normalise: emails case-insensitively; phone numbers down to their
        // last 10 digits so +91-98495 02193, 09849502193 and 9849502193 all
        // collapse to the same person.
        const normalised = type === 'email'
          ? raw.toLowerCase()
          : raw.replace(/\D/g, '').slice(-10);
        if (!normalised || (type !== 'email' && normalised.length < 10)) continue;
        const key = `${type === 'email' ? 'email' : 'phone'}:${normalised}`;
        if (seenOnThisContact.has(key)) continue;
        seenOnThisContact.add(key);
        const entry = byChannel.get(key) || {
          label: raw,
          kind: type === 'email' ? 'email address' : 'mobile number',
          names: [],
        };
        entry.names.push(contactDisplayName(c));
        byChannel.set(key, entry);
      }
    }
    return Array.from(byChannel.values()).filter((e) => e.names.length > 1);
  }, [selectedIds, selected]);

  // ── Run the batch: clone the already-assembled draft per member → single
  //    bulk call. The template's assembled draft is buyer-independent, so it
  //    only needs to be built once (via the Preferences panel above), then
  //    every member gets a clone with buyer + start date substituted, and the
  //    whole set goes to the server bulk endpoint (create + activate +
  //    idempotent dedup, one round-trip). No per-member client loop.
  const run = async (mode: 'activate' | 'drafts') => {
    if (submissionStarted.current || !seed || !result || selectedCount === 0 || selectedCount > 200) return;
    submissionStarted.current = true;
    setSubmissionMode(mode);
    const members = selectedIds.map((id) => selected[id]);
    setProgress(members.map((c) => ({ id: c.id, name: contactDisplayName(c), status: 'running' as RowStatus })));
    setRunning(true);
    setFinished(false);

    try {
      assertVaniScope(result.context);
      if (members.some(c => contactContractType(c) !== relationship)) throw new Error('A selected contact does not match this template relationship. Return to the contact list and review the selection.');
      await composer.validateContacts(members.map(c => ({ id: c.id, relationship: contactContractType(c) })));
      const baseName = String((result.draft as any).contractName || '');
      const baseNameParts = baseName.split(' — ');

      const items = members.map((c) => {
        const buyerDisplayName = contactDisplayName(c);
        // The base draft was assembled buyer-independent (no member picked
        // yet), so its contractName has a placeholder buyer segment ("New
        // Client") baked in — swap in this member's real, title-cased name
        // instead of leaving every contract in the batch with that placeholder.
        const contractName = baseNameParts.length === 3
          ? `${baseNameParts[0]} — ${toTitleCase(buyerDisplayName)} — ${baseNameParts[2]}`
          : baseName;

        return {
          buyerId: c.id,
          contractType: contactContractType(c),
          draft: {
            ...(result.draft as any),
            buyerId: c.id,
            buyerName: buyerDisplayName,
            contractName,
            startDate,
            templateId: seed.match.template_id,
            // Every clone shares this start date and draft, so it computes the
            // same event ids and base dates — the one override map applies
            // cleanly to all. mapWizardToRequest does the substitution.
            eventOverrides: {},
          },
        };
      });

      const { results, summary } = await submitBulk(items, {
        templateId: seed.match.template_id,
        activate: mode === 'activate',
      });
      const activationIncomplete = mode === 'activate' && results.some(r => r.status === 'draft');

      const byBuyer = new Map(results.map((r) => [r.buyer_id, r]));
      setProgress(members.map((c) => {
        const r = byBuyer.get(c.id);
        const status: RowStatus =
          r?.status === 'skipped' ? 'skipped'
          : r?.status === 'failed' ? 'error'
          : 'done';
        return {
          id: c.id,
          name: contactDisplayName(c),
          status,
          contractNumber: r?.contract_number,
          contractId: r?.contract_id,
          createdStatus: r?.status,
          error: r?.error || r?.reason,
        };
      }));

      addToast({
        type: summary.failed === 0 && !activationIncomplete ? 'success' : 'warning',
        title: mode === 'drafts' ? 'Drafts created for individual review' : 'Bulk assignment complete',
        message: `${summary.created} ${mode === 'drafts' ? 'drafts' : 'contracts'} created`
          + (summary.skipped ? `, ${summary.skipped} skipped` : '')
          + (summary.failed ? `, ${summary.failed} failed` : '')
          + (activationIncomplete ? '. Some contracts remain drafts because activation did not complete.' : ''),
      });
      void queryClient.invalidateQueries({ queryKey: ['contracts-experience'] });
    } catch (err: any) {
      // Whole-batch failure — mark all rows.
      setProgress((p) => p.map((r) => ({ ...r, status: 'error' as RowStatus, error: err?.message || 'Failed' })));
      addToast({ type: 'error', title: 'Bulk assignment failed', message: err?.message || 'Please try again.' });
    } finally {
      setRunning(false);
      setFinished(true);
      onDone?.();
    }
  };

  if (!isOpen || !seed) return null;

  const list = (contacts || []).filter((c: any) => eligibleForTemplate(c, relationship));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* Near-fullscreen: this dialog carries a member list, batch preferences,
          per-block cadence AND the schedule review — at 5xl/90vh everything
          below the fold was effectively hidden. */}
      <DialogContent
        className="sm:max-w-[96vw] w-[96vw] rounded-xl h-[95vh] max-h-[95vh] overflow-y-auto"
        style={{ backgroundColor: colors.utility.primaryBackground, borderColor: colors.utility.border }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: colors.utility.primaryText, fontSize: '0.95rem' }}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: colors.brand.primary }} />
              {finished ? 'Bulk assignment results' : reviewing ? 'Review this batch' : 'Assign a template to contacts'}
            </div>
          </DialogTitle>
          <DialogDescription style={{ color: colors.utility.secondaryText, fontSize: '0.72rem' }}>
            {templateName}{perContract ? ` · ${fmt(perContract)} each` : ''} · {relationship} template
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2" aria-label="Bulk assignment steps">
          {['1 · Select contacts and start date', '2 · Review the batch', '3 · Assign now or review each'].map((label, index) => (
            <div key={label} className="rounded-lg border px-3 py-2 text-sm font-semibold" style={{ borderColor: index === (reviewing ? 1 : finished || running ? 2 : 0) ? colors.brand.primary : colors.utility.border, color: colors.utility.primaryText, backgroundColor: index === (reviewing ? 1 : finished || running ? 2 : 0) ? `${colors.brand.primary}12` : 'transparent' }}>{label}</div>
          ))}
        </div>
        {templateError && <div role="alert" className="mt-3 rounded-lg border p-4 text-sm" style={{ borderColor: colors.semantic.error, color: colors.semantic.error }}>{templateError}</div>}

        {/* ── PICK STAGE ── */}
        {!running && !finished && !reviewing && (
          <div className="space-y-4 mt-1">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.utility.secondaryText }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members…"
                  className="pl-9 pr-3 py-2 rounded-lg border text-sm w-full bg-transparent"
                  style={{ borderColor: colors.utility.border, color: colors.utility.primaryText }}
                />
              </div>
              <button
                type="button"
                onClick={selectAllVisible}
                className="text-[11px] font-semibold px-2.5 py-2 rounded-lg"
                style={{ color: colors.brand.primary, backgroundColor: `${colors.brand.primary}12` }}
              >
                Select all shown
              </button>
            </div>

            <p className="text-xs" style={{ color: colors.utility.secondaryText }}>Only unambiguous {relationship} contacts are shown. Select the contacts who should receive this template.</p>

            {/* Member list — taller now the dialog is near-fullscreen */}
            <div className="rounded-lg border overflow-y-auto" style={{ borderColor: colors.utility.border, maxHeight: '32rem' }}>
              {loading ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: colors.brand.primary }} />
                  <span className="text-xs" style={{ color: colors.utility.secondaryText }}>Loading members…</span>
                </div>
              ) : list.length === 0 ? (
                <div className="text-center py-8 text-xs" style={{ color: colors.utility.secondaryText }}>No members match.</div>
              ) : (
                list.map((c: any) => {
                  const checked = !!selected[c.id];
                  const isCorp = c.type === 'corporate';
                  const EntityIcon = isCorp ? Building2 : User;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggle(c)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left border-b last:border-b-0 transition-colors"
                      style={{ borderColor: colors.utility.border, backgroundColor: checked ? `${colors.brand.primary}0c` : 'transparent' }}
                    >
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{
                          border: `2px solid ${checked ? colors.brand.primary : `${colors.utility.secondaryText}55`}`,
                          backgroundColor: checked ? colors.brand.primary : 'transparent',
                        }}
                      >
                        {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </span>
                      <EntityIcon className="w-4 h-4 flex-shrink-0" style={{ color: colors.utility.secondaryText }} />
                      <span className="text-xs font-medium truncate flex-1" style={{ color: colors.utility.primaryText }}>
                        {contactDisplayName(c)}
                      </span>
                      {(c.tags || []).slice(0, 3).map((tag: any) => (
                        <span
                          key={tag.id || tag.tag_value}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0"
                          style={{
                            backgroundColor: (tag.tag_color || colors.brand.secondary || colors.brand.primary) + '20',
                            color: isDarkMode ? colors.utility.primaryText : (tag.tag_color || colors.brand.secondary || colors.brand.primary),
                          }}
                        >
                          {tag.tag_label || tag.tag_value}
                        </span>
                      ))}
                      <span className="text-[9px] uppercase font-bold flex-shrink-0" style={{ color: colors.utility.secondaryText }}>
                        {contactClassificationLabel(c)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Published template terms stay fixed; only the shared start date is variable. */}
            <div className="rounded-xl border p-4" style={{ borderColor: colors.utility.secondaryText + '40' }}>
              <label className="block text-sm font-semibold" htmlFor="bulk-start-date">Start date for all contracts</label>
              <input
                id="bulk-start-date"
                type="date"
                value={startDate}
                disabled={assembling}
                onChange={(e) => updateStartDate(e.target.value)}
                className="mt-2 rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: colors.utility.secondaryText + '40', color: colors.utility.primaryText, backgroundColor: colors.utility.primaryBackground }}
              />
              <p className="mt-3 text-xs" style={{ color: colors.utility.secondaryText }}>The approved template fixes the term, services, price, billing and acceptance. To change those terms, make a new template revision rather than changing this batch.</p>
              {templateEvents.length > 0 && (
                <details className="mt-4 rounded-lg border p-3" style={{ borderColor: colors.utility.secondaryText + '40' }}>
                  <summary className="cursor-pointer text-sm font-semibold">Preview schedule · {templateEvents.length} events per contract</summary>
                  <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                    {[...templateEvents].sort((a, b) => a.scheduled_date.getTime() - b.scheduled_date.getTime()).map(ev => (
                      <div key={ev.id} className="rounded-lg border p-3 text-xs" style={{ borderColor: colors.utility.secondaryText + '40' }}>
                        <strong>{ev.event_type === 'billing' ? 'Billing' : 'Service'} · {ev.billing_cycle_label || ev.block_name}</strong>
                        <span className="ml-2" style={{ color: colors.utility.secondaryText }}>{ev.scheduled_date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {ev.amount ? <span className="ml-2">{getCurrencySymbol(ev.currency || 'INR')}{Number(ev.amount).toLocaleString('en-IN')}</span> : null}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        )}

        {/* One batch preview precedes either outcome. It is not a draft. */}
        {reviewing && !running && !finished && (
          <section className="mt-3 space-y-4" aria-label="Batch review">
            <div className="rounded-xl border p-5" style={{ borderColor: colors.utility.border }}>
              <h3 className="text-base font-bold mb-3" style={{ color: colors.utility.primaryText }}>Check before creating</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div><p style={{ color: colors.utility.secondaryText }}>Template</p><strong>{templateName}</strong></div>
                <div><p style={{ color: colors.utility.secondaryText }}>Contacts</p><strong>{selectedCount} {relationship}{selectedCount === 1 ? '' : 's'}</strong></div>
                <div><p style={{ color: colors.utility.secondaryText }}>Start and term</p><strong>{startDate} · {result?.draft.durationValue} {result?.draft.durationUnit}</strong></div>
                <div><p style={{ color: colors.utility.secondaryText }}>Estimated batch total</p><strong>{Number(result?.draft.grandTotal || result?.draft.totalValue || perContract) > 0 ? fmt(Number(result?.draft.grandTotal || result?.draft.totalValue || perContract) * selectedCount) : 'Not priced in template'}</strong></div>
              </div>
              <p className="mt-4 text-xs" style={{ color: colors.utility.secondaryText }}>Each contact gets a separate contract using this published template. The schedule has {templateEvents.length} event{templateEvents.length === 1 ? '' : 's'} per contract. No contract has been created yet.</p>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: colors.utility.border }}>
              <h3 className="font-semibold mb-2">Selected contacts</h3>
              <div className="flex flex-wrap gap-2">{selectedIds.slice(0, 12).map(id => <span key={id} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: colors.utility.border }}>{contactDisplayName(selected[id])}</span>)}</div>
              {selectedCount > 12 && <p className="mt-2 text-xs" style={{ color: colors.utility.secondaryText }}>And {selectedCount - 12} more contacts</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border p-5" style={{ borderColor: colors.brand.primary }}>
                <h3 className="font-bold">Assign now</h3>
                <p className="text-sm mt-2" style={{ color: colors.utility.secondaryText }}>Create and activate all {selectedCount} contracts after this batch review. You will not review each contract separately before activation.</p>
                <button type="button" onClick={() => run('activate')} className="mt-4 rounded-lg px-4 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: colors.brand.primary }}>Create and activate {selectedCount}</button>
              </div>
              <div className="rounded-xl border p-5" style={{ borderColor: colors.utility.border }}>
                <h3 className="font-bold">Review each contract</h3>
                <p className="text-sm mt-2" style={{ color: colors.utility.secondaryText }}>Create {selectedCount} drafts. Open each one, review it, and activate it individually. There is no later bulk activation.</p>
                <button type="button" onClick={() => run('drafts')} className="mt-4 rounded-lg border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: colors.brand.primary, color: colors.brand.primary }}>Create {selectedCount} drafts</button>
              </div>
            </div>
          </section>
        )}

        {/* ── PROGRESS / SUMMARY STAGE ── */}
        {(running || finished) && (
          <div className="mt-1">
            <div className="rounded-lg border overflow-y-auto" style={{ borderColor: colors.utility.border, maxHeight: '26rem' }}>
              {progress.map((r) => (
                <div key={r.id} className="flex items-center gap-2.5 px-3 py-2 border-b last:border-b-0" style={{ borderColor: colors.utility.border }}>
                  <span className="w-5 flex-shrink-0 flex items-center justify-center">
                    {r.status === 'done' && <CheckCircle2 className="w-4 h-4" style={{ color: colors.semantic.success }} />}
                    {r.status === 'running' && <Loader2 className="w-4 h-4 animate-spin" style={{ color: colors.brand.primary }} />}
                    {r.status === 'error' && <AlertTriangle className="w-4 h-4" style={{ color: colors.semantic.error }} />}
                    {r.status === 'skipped' && <CheckCircle2 className="w-4 h-4" style={{ color: `${colors.utility.secondaryText}99` }} />}
                    {r.status === 'pending' && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `${colors.utility.secondaryText}55` }} />}
                  </span>
                  <span className="text-xs font-medium truncate flex-1" style={{ color: colors.utility.primaryText }}>{r.name}</span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: r.status === 'error' ? colors.semantic.error : colors.utility.secondaryText }}>
                    {r.status === 'done' ? `${r.contractNumber || 'Contract created'} · ${r.createdStatus === 'draft' && submissionMode === 'activate' ? 'Activation incomplete—draft saved' : r.createdStatus === 'draft' ? 'Draft' : r.createdStatus || 'Created'}`
                      : r.status === 'skipped' ? 'Already assigned'
                      : r.status === 'error' ? r.error
                      : r.status === 'running' ? 'Creating…' : 'Queued'}
                  </span>
                </div>
              ))}
            </div>
            {finished && (
              <p className="text-xs mt-2 font-semibold" style={{ color: colors.utility.primaryText }}>
                {progress.filter((r) => r.status === 'done').length} {submissionMode === 'drafts' ? 'drafts created for individual review' : 'contracts created'}
                {progress.some((r) => r.status === 'skipped') ? ` · ${progress.filter((r) => r.status === 'skipped').length} already assigned` : ''}
                {progress.some((r) => r.status === 'error') ? ` · ${progress.filter((r) => r.status === 'error').length} failed` : ''}
              </p>
            )}
            {finished && progress.some(r => r.createdStatus === 'draft') && <button type="button" className="mt-4 rounded-lg px-4 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: colors.brand.primary }} onClick={() => { handleClose(); navigate('/ncontracts?status=draft'); }}>Open draft contracts</button>}
          </div>
        )}

        {/* ── SAME-PERSON ADVISORY ──
            Not a limit: a contact may hold any number of contracts. This only
            flags the same human appearing twice in the batch under two contact
            records (shared mobile/email), which is almost always duplicate
            contact data rather than intent. Nothing is blocked or skipped. */}
        {!running && !finished && duplicateWarnings.length > 0 && (
          <div
            className="mt-3 rounded-lg px-3 py-2.5"
            style={{ backgroundColor: '#F59E0B14', border: '1px solid #F59E0B55' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#B45309' }}>
              Possible duplicate {duplicateWarnings.length === 1 ? 'person' : 'people'} in this batch
            </p>
            {duplicateWarnings.map((d, i) => (
              <p key={i} className="text-xs" style={{ color: colors.utility.secondaryText }}>
                {d.names.join(' and ')} share the {d.kind} <strong>{d.label}</strong>
              </p>
            ))}
            <p className="text-xs mt-1" style={{ color: colors.utility.secondaryText }}>
              Each will still get its own contract — deselect one if that isn&apos;t intended.
            </p>
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={handleClose}
            disabled={running}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: colors.utility.secondaryBackground, color: colors.utility.secondaryText, border: `1px solid ${colors.utility.border}`, opacity: running ? 0.5 : 1 }}
          >
            {finished ? 'Close' : 'Cancel'}
          </button>
          {!finished && !reviewing && (
            <button
              onClick={() => setReviewing(true)}
              disabled={running || assembling || !result || selectedCount === 0}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 flex items-center gap-1.5"
              style={{ backgroundColor: colors.brand.primary, opacity: (running || assembling || !result || selectedCount === 0) ? 0.6 : 1 }}
            >
              <ArrowRight className="w-3.5 h-3.5" /> Review {selectedCount || ''} contract{selectedCount === 1 ? '' : 's'}
            </button>
          )}
          {reviewing && !running && !finished && <button type="button" onClick={() => setReviewing(false)} className="rounded-lg border px-4 py-2 text-xs font-semibold" style={{ borderColor: colors.utility.border }}>Back to contacts and schedule</button>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BulkAssignDialog: React.FC<BulkAssignDialogProps> = props => {
  const { currentTenant, user, isLive } = useAuth();
  if (!props.isOpen) return null;
  return <BulkAssignContent key={`${currentTenant?.id}:${user?.id}:${isLive}`} {...props} />;
};
export default BulkAssignDialog;
