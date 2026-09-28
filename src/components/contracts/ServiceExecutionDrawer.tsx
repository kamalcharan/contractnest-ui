// src/components/contracts/ServiceExecutionDrawer.tsx
// Shared selected-service workspace. Evidence saving and completion are distinct.

import './service-workspace.css';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {useStartVisit,useCompleteVisit,useAssignVisit,useCollectionsBoard} from '@/hooks/queries/useCollectionsQueries';
import {useServiceWorkspaceEvents as useContractEventsForContract} from '@/hooks/queries/useServiceExecution';
import {useContractFormMappings,useServiceFormSubmissions,useServiceStartMetadataProblem} from '@/hooks/queries/useFormTemplates';
import {applicableForms,outcomeNeedsFollowup} from '@/utils/serviceForms';
import {useServiceTicketForEvent,useUpdateServiceTicket} from '@/hooks/queries/useServiceExecution';
import {
  X,
  Package,
  Plus,
  Loader2,
  AlertTriangle,
  Search,
  Zap,
  ArrowLeft,
  Trash2,
  Briefcase,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useContractEventAssets,
} from '@/hooks/queries/useContractEventQueries';
import ServiceFormUpload from './ServiceFormUpload';
import {useContractEvidence} from '@/hooks/queries/useEvidenceQueries';
import FormFillModal from '@/components/contracts/FormFillModal';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { useReceivables } from '@/hooks/queries/useFinanceQueries';
import {
  useCreateBeyondScopeInvoice,
} from '@/hooks/queries/useServiceExecution';
import { useContactsForResourceDropdown } from '@/hooks/queries/useContactsResource';
import { useCatBlocksTest } from '@/hooks/queries/useCatBlocksTest';
import { catBlocksToBlocks } from '@/utils/catalog-studio/catBlockAdapter';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import type { Block } from '@/types/catalogStudio';
import type {
  ContractEvent,
} from '@/types/contractEvents';
import type { EventStatusDefinition } from '@/types/eventStatusConfig';

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

export type EvidencePolicyType = 'none' | 'upload' | 'smart_form';

export interface EvidenceSelectedForm {
  form_template_id: string;
  name: string;
  sequence: number;
}

// Beyond-scope block that user adds from master data
interface BeyondScopeItem {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  isFlyBy?: boolean;
  // Editable amount. Only the explicit additional-work invoice action bills
  // these lines; starting a ticket does not create an invoice or payment.
  amount?: number;
}

export interface ServiceExecutionDrawerProps {
  isOpen: boolean;
  contractId: string;
  date: string;
  events: ContractEvent[];
  allContractEvents?: ContractEvent[];
  currency: string;
  evidencePolicyType?: EvidencePolicyType;
  evidenceSelectedForms?: EvidenceSelectedForm[];
  statusDefsByType?: Record<string, EventStatusDefinition[]>;
  transitionsByType?: Record<string, Record<string, string[]>>;
  onClose: () => void;
}

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// Pricing-only categories for beyond-scope
const PRICING_CATEGORIES = [
  { id: 'service', name: 'Service', icon: Briefcase, color: '#4F46E5', bgColor: '#EEF2FF' },
  { id: 'spare', name: 'Spare Part', icon: Package, color: '#059669', bgColor: '#ECFDF5' },
];

// Check if a block has pricing in the given currency
const blockMatchesCurrency = (block: Block, cur: string | undefined): boolean => {
  if (!cur) return true;
  const records = (block.meta?.pricingRecords || block.config?.pricingRecords) as
    Array<{ currency: string; is_active: boolean }> | undefined;
  if (!records || records.length === 0) {
    return (block.currency || 'INR') === cur;
  }
  return records.some(r => r.currency === cur && r.is_active !== false);
};

// ═══════════════════════════════════════════════════
// BEYOND SCOPE PANEL — pricing blocks only
// ═══════════════════════════════════════════════════

interface BeyondScopePanelProps {
  colors: any;
  currency: string;
  beyondScopeItems: BeyondScopeItem[];
  onAddBlock: (block: Block) => void;
  onAddFlyBy: (type: 'service' | 'spare') => void;
  onRemoveItem: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onClose: () => void;
}

const BeyondScopePanel: React.FC<BeyondScopePanelProps> = ({
  colors,
  currency,
  beyondScopeItems,
  onAddBlock,
  onAddFlyBy,
  onRemoveItem,
  onUpdateAmount,
  onClose,
}) => {
  const [blockSearch, setBlockSearch] = useState('');
  const { data: blocksResponse, isLoading: loadingBlocks } = useCatBlocksTest();

  // Convert and filter to pricing-only blocks (service + spare)
  const pricingBlocks = useMemo(() => {
    const rawBlocks = blocksResponse?.data?.blocks;
    if (!rawBlocks || !Array.isArray(rawBlocks)) return [];
    const allBlocks = catBlocksToBlocks(rawBlocks);
    return allBlocks.filter(
      (b) => (b.categoryId === 'service' || b.categoryId === 'spare') && blockMatchesCurrency(b, currency)
    );
  }, [blocksResponse, currency]);

  // Group by category and filter by search
  const groupedBlocks = useMemo(() => {
    const q = blockSearch.toLowerCase().trim();
    return PRICING_CATEGORIES.map((cat) => ({
      ...cat,
      blocks: pricingBlocks.filter(
        (b) =>
          b.categoryId === cat.id &&
          (!q || b.name.toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q))
      ),
    }));
  }, [pricingBlocks, blockSearch]);

  const selectedIds = new Set(beyondScopeItems.map((b) => b.id));

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[700px] lg:w-[900px] shadow-2xl border-l flex flex-col animate-slide-in-right"
        style={{
          backgroundColor: colors.utility.primaryBackground,
          borderColor: `${colors.utility.primaryText}15`,
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-5 py-4 border-b flex items-center gap-3"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}10`,
          }}
        >
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: colors.utility.secondaryText }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${colors.semantic.warning}15` }}
          >
            <Zap className="w-4 h-4" style={{ color: colors.semantic.warning }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold" style={{ color: colors.utility.primaryText }}>
              Add Beyond Scope Services
            </h2>
            <p className="text-[10px]" style={{ color: colors.utility.secondaryText }}>
              Pricing blocks outside the contract — will be chargeable
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: colors.utility.secondaryText }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column: Library | Selected */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: Pricing blocks + Flyby */}
          <div
            className="flex-1 overflow-y-auto border-r flex flex-col"
            style={{ borderColor: `${colors.utility.primaryText}08` }}
          >
            {/* FlyBy Quick-Add (always visible at top) */}
            <div
              className="flex-shrink-0 p-4 border-b space-y-2"
              style={{
                borderColor: `${colors.utility.primaryText}08`,
                backgroundColor: colors.utility.secondaryBackground,
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.utility.secondaryText }}>
                Quick Add (Fly-by)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddFlyBy('service')}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed text-xs font-medium transition-all hover:shadow-sm"
                  style={{
                    borderColor: '#4F46E540',
                    color: '#4F46E5',
                    backgroundColor: '#EEF2FF',
                  }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <Briefcase className="w-3.5 h-3.5" />
                  Custom Service
                </button>
                <button
                  onClick={() => onAddFlyBy('spare')}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed text-xs font-medium transition-all hover:shadow-sm"
                  style={{
                    borderColor: '#05966940',
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                  }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <Package className="w-3.5 h-3.5" />
                  Custom Spare Part
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex-shrink-0 p-3">
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                  style={{ color: colors.utility.secondaryText }}
                />
                <input
                  type="text"
                  placeholder="Search pricing blocks..."
                  value={blockSearch}
                  onChange={(e) => setBlockSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border"
                  style={{
                    backgroundColor: colors.utility.secondaryBackground,
                    borderColor: `${colors.utility.primaryText}15`,
                    color: colors.utility.primaryText,
                  }}
                />
              </div>
            </div>

            {/* Block list */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
              {loadingBlocks ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: colors.brand.primary }} />
                </div>
              ) : (
                groupedBlocks.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center"
                        style={{ backgroundColor: cat.bgColor }}
                      >
                        <cat.icon className="w-3 h-3" style={{ color: cat.color }} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cat.color }}>
                        {cat.name} ({cat.blocks.length})
                      </span>
                    </div>
                    {cat.blocks.length === 0 ? (
                      <p className="text-[10px] pl-7 mb-2" style={{ color: colors.utility.secondaryText }}>
                        No {cat.name.toLowerCase()} blocks {blockSearch ? 'match' : 'available'}
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {cat.blocks.map((block) => {
                          const isSelected = selectedIds.has(block.id);
                          return (
                            <div
                              key={block.id}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all"
                              style={{
                                backgroundColor: isSelected ? `${cat.color}08` : colors.utility.secondaryBackground,
                                borderColor: isSelected ? `${cat.color}30` : `${colors.utility.primaryText}10`,
                                opacity: isSelected ? 0.6 : 1,
                              }}
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: cat.bgColor }}
                              >
                                <cat.icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate" style={{ color: colors.utility.primaryText }}>
                                  {block.name}
                                </p>
                                {block.description && (
                                  <p className="text-[10px] truncate" style={{ color: colors.utility.secondaryText }}>
                                    {block.description}
                                  </p>
                                )}
                              </div>
                              {!isSelected ? (
                                <button
                                  onClick={() => onAddBlock(block)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:shadow-sm"
                                  style={{ backgroundColor: cat.color }}
                                >
                                  <Plus className="w-4 h-4 text-white" />
                                </button>
                              ) : (
                                <span className="text-[9px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                  Added
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Selected beyond-scope items */}
          <div
            className="w-[300px] flex-shrink-0 overflow-y-auto p-4 space-y-3"
            style={{ backgroundColor: colors.utility.primaryBackground }}
          >
            <h3
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: colors.utility.secondaryText }}
            >
              Selected ({beyondScopeItems.length})
            </h3>

            {beyondScopeItems.length === 0 ? (
              <div
                className="rounded-lg border-2 border-dashed p-6 text-center"
                style={{
                  borderColor: `${colors.utility.primaryText}10`,
                  backgroundColor: colors.utility.secondaryBackground,
                }}
              >
                <Zap className="w-6 h-6 mx-auto mb-2" style={{ color: `${colors.utility.secondaryText}30` }} />
                <p className="text-[10px]" style={{ color: colors.utility.secondaryText }}>
                  Click + on blocks or use Fly-by to add services
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {beyondScopeItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-3 flex items-start gap-2"
                    style={{
                      backgroundColor: colors.utility.secondaryBackground,
                      borderColor: `${colors.semantic.warning}20`,
                    }}
                  >
                    <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: colors.semantic.warning }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: colors.utility.primaryText }}>
                        {item.name}
                      </p>
                      {item.isFlyBy && (
                        <span className="text-[9px] font-semibold" style={{ color: colors.semantic.warning }}>
                          Fly-by
                        </span>
                      )}
                      {/* B3.5 — billed amount (tax added server-side from settings) */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px]" style={{ color: colors.utility.secondaryText }}>
                          {getCurrencySymbol(currency)}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={item.amount ?? ''}
                          onChange={(e) => onUpdateAmount(item.id, e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                          className="w-24 rounded border px-1.5 py-0.5 text-[11px]"
                          style={{
                            backgroundColor: colors.utility.primaryBackground,
                            borderColor: `${colors.utility.primaryText}15`,
                            color: colors.utility.primaryText,
                          }}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 rounded hover:opacity-70 transition-opacity flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3" style={{ color: colors.semantic.error }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Chargeable notice */}
            <div
              className="flex items-start gap-2 rounded-lg p-3 mt-4"
              style={{
                backgroundColor: `${colors.semantic.warning}08`,
                border: `1px solid ${colors.semantic.warning}20`,
              }}
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: colors.semantic.warning }} />
              <p className="text-[10px] leading-relaxed" style={{ color: colors.utility.secondaryText }}>
                Beyond scope services are outside the contract terms and may be billed separately.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0 px-5 py-3 border-t flex items-center justify-end gap-3"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}10`,
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ color: colors.utility.secondaryText }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            disabled={beyondScopeItems.length === 0}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: colors.semantic.warning, color: '#ffffff' }}
          >
            Add {beyondScopeItems.length} Service{beyondScopeItems.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

// ═══════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════

const VisitWork: React.FC<{event:ContractEvent;contractId:string;colors:any;onOpenForm:(f:any)=>void;onDirty:(id:string,dirty:boolean)=>void}> = ({event,contractId,colors,onOpenForm,onDirty}) => {
 const start = useStartVisit(), complete = useCompleteVisit(), assign = useAssignVisit();
 const team=useCollectionsBoard({perspective:'revenue',lanes:['services'],limit:1});
 const teamMembers=(team.data?.team||[]).map(m=>({value:m.user_id,label:m.name||'Team member'}));
 const [assignee,setAssignee]=useState('');
 // Recover an existing ticket even if the timeline supplied an older event snapshot.
 const ticket=useServiceTicketForEvent(contractId,event.id,true);
 const receivables=useReceivables({enabled:!!ticket.data?.id});
 const ticketInvoices=(receivables.data?.invoices||[]).filter(i=>i.is_beyond_scope&&i.service_ticket_id===ticket.data?.id&&i.contract_id===contractId);
 const startLock=useRef(false);
 const [startAccepted,setStartAccepted]=useState(false);
 const [starting,setStarting]=useState(false);
 const [openFirstForm,setOpenFirstForm]=useState(false);
 const updateTicket=useUpdateServiceTicket();
 const [note,setNote]=useState<string|null>(null);
 const noteTouched=useRef(false);
 const [extra,setExtra]=useState<BeyondScopeItem[]>([]),[showExtra,setShowExtra]=useState(false);
 const [reviewInvoice,setReviewInvoice]=useState(false);
 const [createdInvoice,setCreatedInvoice]=useState<{id:string;number:string}|null>(null);
 const invoice=useCreateBeyondScopeInvoice();
 const assignedId=event.assigned_to||ticket.data?.assigned_to_id||'';
 const assignedName=event.assigned_to_name||ticket.data?.assigned_to_name||teamMembers.find(m=>m.value===assignedId)?.label||'';
 useEffect(()=>{setAssignee(assignedId);},[assignedId]);
 const chargedLines=extra.filter(x=>Number.isFinite(x.amount)&&Number(x.amount)>0);
 const subtotal=chargedLines.reduce((sum,x)=>sum+Number(x.amount),0);
 const money=(value:number)=>`${getCurrencySymbol(event.currency||'INR')}${value.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
 const createInvoice=()=>{
  if(!ticket.data||invoice.isPending||!chargedLines.length)return;
  invoice.mutate({ticketId:ticket.data.id,contract_id:contractId,currency:event.currency||'INR',line_items:chargedLines.map(x=>({name:x.name,description:x.description,amount:x.amount!,block_id:x.isFlyBy?undefined:x.id}))},{onSuccess:(result)=>{
   setCreatedInvoice({id:result.invoice_id,number:result.invoice_number});
   setExtra([]);setReviewInvoice(false);
  }});
 };
 useEffect(()=>{onDirty(event.id,note!==null||extra.length>0);return()=>onDirty(event.id,false);},[note,extra.length,event.id,onDirty]);
 const {data:mappings=[],isLoading:mappingLoading,error:mappingError}=useContractFormMappings(contractId);
 const {data:assetsByEvent={},isLoading:assetsLoading,error:assetsError}=useContractEventAssets(contractId);
 const submissions=useServiceFormSubmissions(event.id);
 const forms=applicableForms(mappings,event);
 const uploads=useContractEvidence(contractId);
 const assets=assetsByEvent[event.id]||[];
 const missingEquipment=assets.some(a=>a.status==='blocked_placeholder');
 const targets=assets.length?assets:[{id:'',asset_name:'This service visit',status:'open'}];
 const [review,setReview]=useState(false);
 const closed=['completed','cancelled'].includes(event.status);
 const running=!closed&&(event.status==='in_progress'||ticket.data?.status==='in_progress'||startAccepted);
 const startCheck=useServiceStartMetadataProblem(event.id,!closed&&!running);
 useEffect(()=>{
  if(!openFirstForm||mappingLoading||assetsLoading||submissions.isLoading)return;
  setOpenFirstForm(false);
  if(forms.length===1&&targets.length===1&&targets[0].status!=='blocked_placeholder')
   onOpenForm({...forms[0],event:{...event,status:'in_progress'},assetId:targets[0].id,readOnly:false});
 },[openFirstForm,mappingLoading,assetsLoading,submissions.isLoading,forms,targets,event,onOpenForm]);
 const startService=()=>{
  if(startLock.current||running||closed||assetsLoading||assetsError||missingEquipment||startCheck.isLoading||startCheck.error||startCheck.data?.problem)return;
  startLock.current=true;setStarting(true);
  start.mutate({eventId:event.id},{
   onSuccess:()=>{setStartAccepted(true);setOpenFirstForm(true);},
   onSettled:()=>{startLock.current=false;setStarting(false);},
  });
 };
 const latest=Object.values((submissions.data||[]).reduce((acc:any,s)=>{const key=s.form_template_id+':'+(s.event_asset_id||'');if(!acc[key]||(s.updated_at||'')>(acc[key].updated_at||''))acc[key]=s;return acc;},{})) as any[];
 const missing=targets.some(a=>a.status==='blocked_placeholder'||forms.filter(f=>f.is_mandatory).some(f=>!latest.some(s=>s.form_template_id===f.form_template_id&&(s.event_asset_id||'')===a.id&&['submitted','approved'].includes(s.status))));
 const missingUpload=targets.some(a=>forms.some(f=>f.require_upload&&!('evidence_id' in a&&a.evidence_id)&&!uploads.data?.evidence.some(file=>file.event_id===event.id&&file.confirmed_at&&latest.some(s=>s.id===file.form_submission_id&&s.form_template_id===f.form_template_id&&(s.event_asset_id||'')===a.id))));
 const followup=latest.some(s=>forms.some(f=>f.form_template_id===s.form_template_id)&&s.status!=='draft'&&outcomeNeedsFollowup(s.responses));
 const busy=starting||start.isPending||complete.isPending;
 const blocked=mappingLoading||assetsLoading||submissions.isLoading||!!mappingError||!!assetsError||!!submissions.error||missing||missingUpload||followup||note!==null||extra.length>0;
 const style={background:colors.utility.primaryBackground,borderColor:colors.utility.secondaryText+'30',color:colors.utility.primaryText};
 if(showExtra)return <BeyondScopePanel colors={colors} currency={event.currency||'INR'} beyondScopeItems={extra}
  onAddBlock={b=>setExtra(xs=>xs.some(x=>x.id===b.id)?xs:[...xs,{id:b.id,name:b.name,description:b.description,categoryId:b.categoryId,amount:typeof (b as any).price==='number'?(b as any).price:0}])}
  onAddFlyBy={type=>setExtra(xs=>[...xs,{id:crypto.randomUUID(),name:type==='spare'?'Additional spare part':'Additional service',categoryId:type==='spare'?'spare_part':'service',isFlyBy:true,amount:0}])}
  onRemoveItem={id=>setExtra(xs=>xs.filter(x=>x.id!==id))} onUpdateAmount={(id,amount)=>setExtra(xs=>xs.map(x=>x.id===id?{...x,amount}:x))} onClose={()=>setShowExtra(false)}/>;
 return <section className="service-visit border rounded-xl p-5 space-y-4" style={style}>
 <div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-semibold break-words">{event.block_name}</h2><p className="text-sm">Visit {event.sequence_number} of {event.total_occurrences} · {formatDate(event.scheduled_date)}</p>{ticket.data&&<p className="text-sm">{ticket.data.ticket_number} · {ticket.data.assigned_to_name||'Unassigned'}</p>}</div><span className="text-sm font-semibold">{running?'In progress':event.status.replace(/_/g,' ')}</span></div>
 {!closed&&<details className="service-assignment"><summary>Technician assignment · {assignedName||'Unassigned'}</summary><div className="flex flex-wrap gap-2 items-center"><label>Assign to <select aria-label="Assign service to" value={assignee} onChange={e=>setAssignee(e.target.value)} className="border rounded-lg p-2 ml-2" style={style}><option value="">Choose a team member</option>{assignedId&&!teamMembers.some(m=>m.value===assignedId)&&<option value={assignedId}>{assignedName||'Assigned technician'}</option>}{teamMembers.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}</select></label><button disabled={!assignee||assignee===assignedId||assign.isPending} onClick={()=>assign.mutate({eventId:event.id,assignTo:assignee})} className="border rounded-lg px-4 py-2 disabled:opacity-50">{assign.isPending?'Assigning…':'Change technician'}</button></div></details>}
 {!closed&&(assetsLoading||assetsError||missingEquipment)&&<div className="rounded-lg border p-4 space-y-3" role="status"><h3 className="font-semibold">{missingEquipment?'Attach required equipment first':'Checking required equipment'}</h3><p>{assetsError?'Equipment could not be checked. Close and reopen this workspace to retry.':assetsLoading?'Checking the equipment covered by this visit…':running?'This ticket was started before equipment was attached. Attach the real equipment before recording work or completing this visit.':'This visit cannot start until the real equipment is attached to the contract.'}</p>{missingEquipment&&<><ul>{assets.filter(a=>a.status==='blocked_placeholder').map(a=><li key={a.id}>{a.asset_name}</li>)}</ul><a className="inline-block rounded-lg px-4 py-3 font-semibold" style={{background:colors.brand.primary,color:'#fff'}} href={`/contracts/${contractId}?tab=equipment`}>Attach equipment in contract →</a><p className="text-sm">Use Attach Asset on the existing coverage card, then return to Tasks.</p></>}</div>}
 {!running&&!closed&&<>{startCheck.data?.problem&&<div role="alert" className="rounded-lg border p-4 space-y-2" style={{borderColor:'#f59e0b',backgroundColor:'#fef3c7',color:'#92400e'}}><h3 className="font-semibold">Complete equipment details before starting</h3><p>{startCheck.data.problem}</p><a href={`/contracts/${contractId}?tab=equipment`} className="inline-block rounded-lg px-4 py-2 font-semibold border">Open equipment →</a><button className="ml-2 underline" onClick={()=>startCheck.refetch()}>Recheck</button></div>}<p>An appointment is optional. Start when work begins; opening this workspace does not create a ticket.</p><button disabled={busy||ticket.isLoading||!!ticket.error||assetsLoading||!!assetsError||missingEquipment||startCheck.isLoading||!!startCheck.error||!!startCheck.data?.problem} onClick={startService} className="rounded-lg px-5 py-3 font-semibold disabled:opacity-50" style={{background:colors.brand.primary,color:'#fff'}}>{busy?'Starting…':ticket.isLoading||startCheck.isLoading?'Checking service…':missingEquipment?'Attach equipment to start':startCheck.data?.problem?'Complete equipment details':'Start service'}</button>{(ticket.error||startCheck.error)&&<p role="alert">Could not check service readiness. <button className="underline" onClick={()=>{ticket.refetch();startCheck.refetch();}}>Retry</button></p>}</>}
 {((running&&!missingEquipment&&!assetsLoading&&!assetsError)||closed)&&<><h3 className="font-semibold">Work & required evidence</h3><p className="text-sm">Record each equipment outcome. Saving evidence does not complete this visit.</p>
 {!closed&&!ticket.data&&<p role="status" className="text-sm">{ticket.isLoading?'Loading your service ticket…':'The service ticket could not be found. Reload it before recording additional work.'}{!ticket.isLoading&&<button className="underline ml-2" onClick={()=>ticket.refetch()}>Reload ticket</button>}</p>}
 {mappingLoading||assetsLoading||submissions.isLoading?<p role="status">Loading service evidence…</p>:mappingError||assetsError||submissions.error?<p role="alert">Could not load evidence. Close and retry before completing.</p>:targets.map(a=><div key={a.id} className="service-form-card border rounded-lg p-4 space-y-3" style={style}><h3 className="font-semibold">{a.asset_name||'Equipment'}</h3>{a.status==='blocked_placeholder'?<p>Attach the actual equipment in the contract’s coverage before recording evidence.</p>:forms.length?forms.map(f=>{const record=latest.find(s=>s.form_template_id===f.form_template_id&&(s.event_asset_id||'')===a.id);const submitted=record&&['submitted','approved'].includes(record.status);return <div key={f.id} className="flex flex-wrap justify-between gap-3"><div><strong>{f.form_name}</strong><p className="text-sm">{f.resolved_via==='platform_default'?'Default form':'Configured Smart Form'} · {f.is_mandatory?'Required':'Optional'} · {f.timing?.replace(/_/g,' ')||'During service'} · {record?.status||'Not recorded'}</p></div><button onClick={()=>onOpenForm({...f,event,assetId:a.id,readOnly:closed||!!submitted})} className="service-form-action border rounded-lg px-4 py-2">{closed||submitted?'View report':record?.status==='draft'?'Continue form':'Continue service form'}</button>{submitted&&!closed&&<button onClick={()=>onOpenForm({...f,event,assetId:a.id,readOnly:false})} className="border rounded-lg px-4 py-2 font-semibold">Record correction</button>}{f.require_upload&&<ServiceFormUpload contractId={contractId} eventId={event.id} submissionId={submitted?record.id:undefined} readOnly={closed}/>}</div>}):<p>No Smart Form is configured for this service.</p>}</div>)}
 {ticket.data&&!closed&&<details><summary className="cursor-pointer font-semibold">Additional work outside this service</summary><p className="text-sm my-3">Reuse catalog or custom items. Review charges before creating an unpaid invoice; no payment is recorded.</p><button onClick={()=>setShowExtra(true)} className="border rounded-lg px-4 py-2 font-semibold">Edit additional work ({extra.length})</button>{chargedLines.length>0&&<button disabled={invoice.isPending} onClick={()=>setReviewInvoice(true)} className="rounded-lg px-4 py-2 ml-2 font-semibold text-white disabled:opacity-50" style={{background:colors.brand.primary}}>Review invoice · {money(subtotal)}</button>}</details>}
 {ticket.data&&<section className="rounded-lg border p-4 space-y-3" style={style} aria-label="Invoices for this service ticket"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">Additional-work invoices for {ticket.data.ticket_number}</h3><a className="text-sm font-semibold underline" href="/invoices">All invoices →</a></div>{receivables.isLoading?<p role="status" className="text-sm">Loading invoices…</p>:receivables.isError?<p role="alert" className="text-sm">Could not load invoices. <button className="underline font-semibold" onClick={()=>receivables.refetch()}>Retry</button></p>:ticketInvoices.length===0&&!createdInvoice?<p className="text-sm">No additional-work invoice has been created for this ticket.</p>:<div className="space-y-2">{ticketInvoices.map(i=><div key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div><strong>{i.invoice_number}</strong><p className="text-sm">{i.status.replace(/_/g,' ')} · {money(Number(i.total_amount))} total · {money(Number(i.balance))} open</p></div><a className="font-semibold underline" href={`/invoices/${i.id}`}>View invoice →</a></div>)}{createdInvoice&&!ticketInvoices.some(i=>i.id===createdInvoice.id)&&<div role="status" className="rounded-lg border p-3"><strong>{createdInvoice.number}</strong> created. <a className="font-semibold underline" href={`/invoices/${createdInvoice.id}`}>View invoice →</a></div>}</div>}</section>}
 <ConfirmationDialog isOpen={reviewInvoice} onClose={()=>!invoice.isPending&&setReviewInvoice(false)} onConfirm={createInvoice} title="Review additional-work invoice" type="primary" confirmText={invoice.isPending?'Creating…':'Create unpaid invoice'} isLoading={invoice.isPending} description={<div className="space-y-3"><p>For {ticket.data?.ticket_number||'this service ticket'}. Check the chargeable lines before creating the invoice.</p><ul className="divide-y border rounded-lg px-3">{chargedLines.map(x=><li key={x.id} className="flex justify-between gap-3 py-2"><span>{x.name}</span><strong>{money(Number(x.amount))}</strong></li>)}</ul><p className="flex justify-between font-semibold"><span>Subtotal</span><span>{money(subtotal)}</span></p><p className="text-sm">Tax is calculated from your tenant settings on creation. The final total will appear on the invoice. This creates an unpaid receivable in Money In; it does not send the invoice or record payment.</p></div>}/>
 {ticket.data&&!closed&&<div className="service-notes space-y-2"><RichTextEditor label="Service notes" value={note??ticket.data.notes??''} onFocus={()=>{noteTouched.current=true}} onChange={html=>{if(noteTouched.current)setNote(html)}} placeholder="Record the work performed, observations and follow-up." toolbarButtons={['bold','italic','underline','bulletList','orderedList']} minHeight={120} maxHeight={320} allowFullscreen={false}/><button disabled={updateTicket.isPending||note===null} onClick={()=>updateTicket.mutate({ticketId:ticket.data!.id,version:ticket.data!.version,notes:note||''},{onSuccess:()=>{noteTouched.current=false;setNote(null)}})} className="border rounded-lg px-4 py-2 font-semibold disabled:opacity-50">{updateTicket.isPending?'Saving…':'Save service notes'}</button></div>}
 {!closed&&<><button onClick={()=>setReview(!review)} className="border rounded-lg px-4 py-3 font-semibold">Review & complete</button>{review&&<div className="rounded-lg border p-4 space-y-3" style={style}><h3 className="font-semibold">Complete this service?</h3><p>{note!==null||extra.length?'Save your notes and finish or remove additional-work items before completing.':missing?'Complete all required equipment outcomes first.':missingUpload?'Attach the required supporting evidence for each equipment outcome.':followup?'Recorded work needs follow-up. Keep the service open; do not mark it completed.':'Required outcomes have been recorded. Completion closes this visit; it does not record payment.'}</p><button disabled={blocked||busy} onClick={()=>complete.mutate({eventId:event.id})} className="rounded-lg px-4 py-3 font-semibold disabled:opacity-50" style={{background:colors.brand.primary,color:'#fff'}}>Complete service</button></div>}</>}
 </>}
 </section>
};
const ServiceExecutionDrawer: React.FC<ServiceExecutionDrawerProps> = ({isOpen,contractId,events:initialEvents,currency,onClose}) => {
 const {isDarkMode,currentTheme}=useTheme(),colors=isDarkMode?currentTheme.darkMode.colors:currentTheme.colors;
 const eventsQuery=useContractEventsForContract(contractId,{enabled:isOpen,per_page:200});
 const {data:eventAssetsByEvent={}}=useContractEventAssets(contractId,{enabled:isOpen});
 const [openForm,setOpenForm]=useState<any>(null);
 const [dirtyVisits,setDirtyVisits]=useState<Record<string,boolean>>({});
 const trackDirty=useCallback((id:string,dirty:boolean)=>setDirtyVisits(old=>old[id]===dirty?old:{...old,[id]:dirty}),[]);
 const closeWorkspace=()=>{if(!Object.values(dirtyVisits).some(Boolean)||window.confirm('Leave without saving your notes or additional work?'))onClose();};
 if(!isOpen)return null;
 const events=initialEvents.filter(e=>e.event_type==='service').map(e=>eventsQuery.data?.items.find(x=>x.id===e.id)||e);
 if(eventsQuery.isLoading||eventsQuery.error)return <div data-theme={isDarkMode?'dark':'light'} className="service-workspace fixed inset-0 z-50 bg-black/40 flex justify-end" role="dialog" aria-modal="true" aria-label="Service workspace"><section className="w-full max-w-5xl h-full p-8 bg-white"><button className="border rounded-lg px-4 py-2" onClick={closeWorkspace}>Close workspace</button><p role="status" className="my-6">{eventsQuery.error?'Unable to refresh this service. No action has been taken.':'Loading current service status…'}</p>{eventsQuery.error&&<button className="border rounded-lg px-4 py-2" onClick={()=>eventsQuery.refetch()}>Retry loading service</button>}</section></div>;
 return <div data-theme={isDarkMode?'dark':'light'} className="service-workspace fixed inset-0 z-50 bg-black/40 flex justify-end" role="dialog" aria-modal="true" aria-label="Service workspace"><section className="w-full max-w-5xl h-full overflow-auto p-5 sm:p-8" style={{background:colors.utility.secondaryBackground,color:colors.utility.primaryText}}><header className="flex justify-between gap-4 mb-6"><div><p className="text-sm">Service workspace · Tasks and financial milestones remain unchanged</p><h1 className="text-2xl font-semibold">{events.length===1?events[0].block_name:'Carry out this service visit'}</h1></div><button onClick={closeWorkspace} className="border rounded-lg px-4 py-2 self-start">Close workspace</button></header><div className="space-y-5">{events.length?events.map(event=><VisitWork key={event.id} event={event} contractId={contractId} colors={colors} onOpenForm={setOpenForm} onDirty={trackDirty}/>):<p role="alert">The selected service could not be loaded. Close and open it from its task.</p>}</div>{openForm&&<FormFillModal key={openForm.id+':'+openForm.assetId} isOpen readOnly={openForm.readOnly} contractId={contractId} formTemplateId={openForm.form_template_id} formName={openForm.form_name} serviceEvents={[openForm.event]} eventAssetsByEvent={eventAssetsByEvent} initialAssetId={openForm.assetId} onClose={()=>setOpenForm(null)}/>}</section></div>
};
export default ServiceExecutionDrawer;
