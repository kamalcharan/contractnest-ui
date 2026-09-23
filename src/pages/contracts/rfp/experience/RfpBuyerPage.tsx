import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';
import assetRegistryService from '@/services/assetRegistryService';
import { labelApplies, registryType, ownRegistryItem } from './selectionPolicy';
import resourcesService from '@/services/resourcesService';
import EquipmentFormDialog from '@/pages/equipment-registry/EquipmentFormDialog';
import type { AssetFormData } from '@/types/assetRegistry';
import { useNomenclatureTypes } from '@/hooks/queries/useNomenclatureTypes';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import SafeHtml from '@/components/catalog-studio/SafeHtml';
import { PageLoader, InlineLoader } from '@/components/common/loaders/UnifiedLoader';
import { useVaNiToast } from '@/components/common/toast/VaNiToast';
import { currencyOptions } from '@/utils/constants/currencies';
import { RFP_KEY, newDraft, validate, restore, commitmentSummary, type RfpDraft, type Family } from './model';
import { persistDraft, unwrap } from './persistence';
import './rfp-buyer.css';
import RequirementEditor from './RequirementEditor';
import { REQUIREMENT_TYPES, type RequirementType } from './model';
import RfpVendorPicker from './RfpVendorPicker';
import RfpDocument from './RfpDocument';
import RfpConfirmation from './RfpConfirmation';
import {rfpRpc,rfpError} from './rfpLifecycle';
import RfpEmptyState from './RfpEmptyState';
import RfpCoverageCard from './RfpCoverageCard';

const steps=['The need','Questions for vendors','Terms & money','Invite vendors','Review'];
const headings=['Find the right service partner.','Get answers you can compare.','Set clear terms from the start.','Bring the right people to the table.','Ready for the other side.'];
const errorText=(e:any)=>typeof e?.response?.data?.error==='string'?e.response.data.error:e?.response?.data?.error?.message||e.message||'Request failed';
const uid=()=>crypto.randomUUID();

export default function RfpBuyerPage({list=false}:{list?:boolean}) {
 const {currentTenant,isLive,perspective}=useAuth(); const {id}=useParams();
 if(!currentTenant?.id||typeof isLive!=='boolean'||perspective!=='expense')return <div className="rfp-buyer"><h1>Open the buyer workspace</h1><p>Choose the Expense perspective and the intended workspace before preparing an RFP.</p><Link to="/requests">Back to Requests</Link></div>;
 return <RfpWorkspace key={`${currentTenant.id}:${isLive}:${id||'new'}:${list}`} tenantId={currentTenant.id} live={isLive} id={id} list={list}/>;
}
function RfpWorkspace({tenantId,live,id,list}:{tenantId:string;live:boolean;id?:string;list:boolean}) {
 const {currentTheme,isDarkMode}=useTheme();const colors=isDarkMode?currentTheme.darkMode.colors:currentTheme.colors;
 const {addToast}=useVaNiToast();const navigate=useNavigate();const queryClient=useQueryClient();
 const [draft,setDraft]=useState(()=>newDraft(tenantId,live,currencyOptions.find(c=>c.isDefault)?.code||''));
 const [record,setRecord]=useState<any>(null),[loading,setLoading]=useState(!!id),[busy,setBusy]=useState(false),[dirty,setDirty]=useState(false),[fatal,setFatal]=useState(''),[issues,setIssues]=useState<string[]>([]);
 const [modal,setModal]=useState<'labels'|'registry'|'coverage'|null>(null);
 const [assetPage,setAssetPage]=useState(0),[page,setPage]=useState(1);
 const [newCoverage,setNewCoverage]=useState({name:'',location:'',quantity:1,family:'equipment' as Family});
 const [register,setRegister]=useState<'equipment'|'asset'|null>(null),[registering,setRegistering]=useState(false);
 const [recipientBusy,setRecipientBusy]=useState(false);
 const registryFlight=useRef(false);
 const inFlight=useRef(false),alive=useRef(true),uncertain=useRef(false),createKey=useRef(uid()),dialog=useRef<HTMLDialogElement>(null);
 const nomenclatures=useNomenclatureTypes();
 const selectedLabel=nomenclatures.data?.flatMap(g=>g.items).find(n=>n.id===draft.nomenclature?.id);
 const mappingError=draft.nomenclature && (!selectedLabel || !labelApplies(selectedLabel.form_settings,draft.family))
   ? 'This agreement label is not valid for the selected scope. Choose a matching label or clear it.' : '';
 const coverageError=draft.coverage.some(c=>c.family!==draft.family) ? 'Some covered items belong to a different scope. Remove or review them before continuing.' : '';
 const typeId=registryType(draft.family);
 const assets=useQuery({queryKey:['rfp-registry',tenantId,live,'self',typeId,assetPage],queryFn:()=>assetRegistryService.listAssets({offset:assetPage*20,limit:20,is_live:live,ownership_type:'self',resource_type_id:typeId!}),enabled:modal==='registry'&&!!typeId});
 const types=useQuery({queryKey:['rfp-registry-types',tenantId,live,register],queryFn:async()=>{const rows=await resourcesService.getResources();if(!Array.isArray(rows))throw new Error('Configured registry types could not load.');return rows.filter(r=>(r as unknown as {is_active:boolean}).is_active===true&&r.tenant_id===tenantId&&r.resource_type_id===register);},enabled:!!register});
 const drafts=useQuery({queryKey:['rfp-drafts',tenantId,live,page],enabled:list,queryFn:async()=>{
   const res=unwrap(await api.get(API_ENDPOINTS.CONTRACTS.LIST_WITH_FILTERS({record_type:'rfq',status:'draft',page,limit:10})));
   if(!Array.isArray(res.items))throw new Error('The request list returned an unexpected response.');
   const details=await Promise.all(res.items.map((c:any)=>api.get(API_ENDPOINTS.CONTRACTS.GET(c.id)).then(unwrap)));
   return {items:details.filter(c=>c.metadata?.[RFP_KEY]&&c.tenant_id===tenantId&&c.is_live===live),next:!!res.page_info?.has_next_page};
 }});
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 useEffect(()=>{if(!id)return;let cancelled=false;api.get(API_ENDPOINTS.CONTRACTS.GET(id)).then(unwrap).then(c=>{
   if(cancelled)return;if(c.tenant_id!==tenantId||c.is_live!==live||c.record_type!=='rfq')throw new Error('This request cannot be edited in this workspace, environment or status.');
   const restored=restore(c.metadata?.[RFP_KEY],tenantId,live);setRecord(c);setDraft(restored);
 }).catch(e=>{if(!cancelled)setFatal(errorText(e));}).finally(()=>{if(!cancelled)setLoading(false);});return()=>{cancelled=true;};},[id,tenantId,live]);
 useEffect(()=>{const before=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',before);return()=>window.removeEventListener('beforeunload',before);},[dirty]);
 useEffect(()=>{if(modal&&!dialog.current?.open)dialog.current?.showModal();},[modal]);
 const change=(patch:Partial<RfpDraft>)=>{setDraft(d=>({...d,...patch}));setDirty(true);};
 const fail=(message:string)=>{setIssues([message]);addToast({type:'error',title:'Not saved',message});};
 async function registerAsset(data:AssetFormData){
   if(registryFlight.current)return;
   registryFlight.current=true;setRegistering(true);
   try{
     if(data.ownership_type!=='self'||data.resource_type_id!==typeId||!(types.data||[]).some(t=>t.id===data.asset_type_id))throw new Error('Select a configured type for your own registry. Client-owned items cannot be added here.');
     const asset=await assetRegistryService.createAsset(data);
     if(!alive.current)return;
     if(!asset.id||!ownRegistryItem(asset,tenantId,live,draft.family))throw new Error('Registry save was not confirmed in this workspace. Check the registry before retrying.');
     change({coverage:[...draft.coverage,{id:uid(),name:asset.name,quantity:1,location:asset.location||'',family:asset.resource_type_id==='asset'?'facility':'equipment',resourceId:asset.asset_type_id||asset.template_id||null,registryId:asset.id}]});
     setRegister(null);void assets.refetch();
     addToast({type:'success',title:'Registered and added to your request',message:'One registered unit linked. Save your RFP draft to retain this coverage.'});
   }catch(e){if(alive.current){setRegister(null);addToast({type:'error',title:'Check registry before retrying',message:errorText(e)});}}
   finally{registryFlight.current=false;if(alive.current)setRegistering(false);}
 }
 async function save(next?:number,finalize=false){
   if(inFlight.current||uncertain.current||recipientBusy)return;
   if(mappingError||coverageError){fail([mappingError,coverageError].filter(Boolean).join(' '));return;}
   const errors=finalize?[0,1,2,3].flatMap(i=>validate(draft,i)):next===undefined?(!draft.title.trim()?['Give your request a name before saving.']:[]):validate(draft,draft.step);
   if(errors.length){setIssues(errors);addToast({type:'error',title:'Not saved',message:errors[0]});return;}
   if(finalize&&Date.parse(draft.deadline+'T'+draft.deadlineTime+':00+05:30')<=Date.now()){fail('Set a future response deadline before sending.');return;}
   const snapshot={...draft,step:next??draft.step};inFlight.current=true;setBusy(true);setIssues([]);
   let savedId=record?.id;
   try{
     // Revalidate restored/previously selected units too; an old draft may contain client assets.
     const linked=await Promise.all(snapshot.coverage.filter(c=>c.registryId).map(async c=>({coverage:c,asset:await assetRegistryService.getAsset(c.registryId!)})));
     const invalid=linked.find(x=>!ownRegistryItem(x.asset,tenantId,live,snapshot.family));
     if(invalid)throw new Error(invalid.coverage.name+': this is not an active unit in your own matching registry. Remove it and pick the correct item.');
     if(!alive.current)return;

     const confirmed=await persistDraft(api,snapshot,record,{get:API_ENDPOINTS.CONTRACTS.GET,update:API_ENDPOINTS.CONTRACTS.UPDATE},record?uid():createKey.current,()=>alive.current);
     savedId=confirmed.id;
     if(!alive.current)return;setRecord(confirmed);setDraft(snapshot);setDirty(false);
     void queryClient.invalidateQueries({queryKey:['contracts']});
     void queryClient.invalidateQueries({queryKey:['rfp-drafts']});
     if(finalize){
       await rfpRpc('rfp_finalize',{p_id:confirmed.id,p_tenant:tenantId,p_live:live,p_version:confirmed.version});
       const finalized=unwrap(await api.get(API_ENDPOINTS.CONTRACTS.GET(confirmed.id)));
       if(finalized.status==='draft')throw new Error('Finalization was not confirmed. Reopen the request before retrying.');
       setRecord(finalized);
       addToast({type:'success',title:'Request finalized',message:'Vendor invitations queued. Check delivery status below.'});
     }else addToast({type:'success',title:'RFP draft saved',message:'All sections saved. Nothing has been sent.'});
     if(!id)navigate(`/requests/rfp/${savedId}`,{replace:true});
   }catch(e:any){if(!alive.current)return;if(e.outcome==='uncertain'){uncertain.current=true;setFatal('Save outcome needs checking. Open Requests in another tab before retrying, to avoid duplicate or stale writes.');}if(finalize&&savedId){try{const latest=unwrap(await api.get(API_ENDPOINTS.CONTRACTS.GET(savedId)));if(latest.status!=='draft'){setRecord(latest);setDirty(false);return;}}catch{}}
     fail(rfpError(e));}
   finally{inFlight.current=false;if(alive.current)setBusy(false);}
 }
 const field=(key:keyof RfpDraft,label:string,type='text',extra:Record<string,unknown>={})=><label className="rfp-field">{label}<input type={type} value={String(draft[key]??'')} onChange={e=>change({[key]:type==='number'?Number(e.target.value):e.target.value})} {...extra}/></label>;
 const rich=(key:'brief'|'terms'|'releaseTerms',label:string)=><RichTextEditor label={label} value={draft[key]} onChange={value=>change({[key]:value})} toolbarButtons={['bold','italic','underline','bulletList','orderedList','table']} minHeight={110}/>;
 const button=(label:string,action:()=>void,primary=false,disabled=false)=><button type="button" className={primary?'rfp-button primary':'rfp-button'} disabled={disabled||busy||recipientBusy} onClick={action}>{label}</button>;
 function addRequirement(type:RequirementType){change({blocks:[...draft.blocks,{id:uid(),type,name:'',description:'',quantity:1,unlimited:false,coverageIds:[]}]});}
 const styles={'--rfp-ink':colors.utility.primaryText,'--rfp-muted':colors.utility.secondaryText,'--rfp-surface':colors.utility.secondaryBackground,'--rfp-bg':colors.utility.primaryBackground,'--rfp-brand':colors.brand.primary,'--rfp-line':colors.utility.primaryText+'25'} as React.CSSProperties;
 if(record&&record.status!=='draft')return <RfpConfirmation draft={draft} record={record}/>;
 if(loading)return <PageLoader message="Opening your RFP draft"/>;
 const firstUse = !drafts.isLoading && !drafts.isError && !!drafts.data && page === 1 && drafts.data.items.length === 0 && !drafts.data.next;
 if(list)return <main className="rfp-buyer rfp-list" style={styles}>
   <div className="rfp-row between rfp-list-heading"><div><small>BUYER WORKSPACE</small><h1>RFP drafts</h1><p>{firstUse?'A considered brief is the first step to the right service partner.':'Your requirements, organised. Pick up where you left off.'}</p></div>{!firstUse&&<Link className="rfp-button primary" to="/requests/rfp/new">New RFP →</Link>}</div>
   {firstUse?<RfpEmptyState/>:<>
     <p className="rfp-note">Draft preparation is available. Vendor invitations and responses are not enabled yet.</p>
     {drafts.isLoading?<PageLoader message="Loading RFP drafts"/>:drafts.isError?<div role="alert">{errorText(drafts.error)}{button('Retry',()=>void drafts.refetch())}</div>:<>
       {drafts.data?.items.map((c:any)=><Link key={c.id} className="rfp-paper rfp-draft" to={`/requests/rfp/${c.id}`}><strong>{c.name||c.title}</strong><span>{c.rfq_number||c.contract_number} · Draft</span><span>Continue →</span></Link>)}
       {!drafts.data?.items.length&&<p>No RFP drafts on this page. Older RFQ drafts stay in Requests.</p>}
       {(page>1||drafts.data?.next)&&<div className="rfp-row">{button('Previous',()=>setPage(p=>p-1),false,page===1)}<span>Page {page}</span>{button('Next',()=>setPage(p=>p+1),false,!drafts.data?.next)}</div>}
     </>}
     <Link to="/requests">Existing Requests / RFQs</Link>
   </>}
 </main>;
 return <main className="rfp-buyer" style={styles}>
  <div className="rfp-shell"><aside className="rfp-rail"><Link to="/requests" onClick={e=>{if(dirty&&!window.confirm('Leave with unsaved changes?'))e.preventDefault();}}>← Requests</Link><small>A NEW REQUEST</small><nav>{steps.map((name,i)=><button key={name} aria-current={draft.step===i?'step':undefined} disabled={busy||recipientBusy||i>draft.step} onClick={()=>change({step:i})}><b>{i+1}</b>{name}</button>)}</nav><p>Manual, by design.<br/>Your scope. Your decision.</p></aside>
  <div className="rfp-main"><small>{draft.step+1} OF 5 · BUYER REQUEST</small><h1>{headings[draft.step]}</h1><p>Define the need clearly. Vendors bring their approach and price.</p>
  {fatal&&<div className="rfp-error" role="alert">{fatal} <Link target="_blank" to="/requests?status=draft">Open saved drafts</Link></div>}{issues.length>0&&<div className="rfp-error" role="alert"><strong>Please check these details</strong><ul>{issues.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
  <fieldset disabled={busy||!!fatal} className="rfp-grid"><div className="rfp-stack">
  {draft.step===0&&<>
   <section className="rfp-paper"><h2>Describe the outcome, not the paperwork.</h2><div className="rfp-choices">{(['equipment','facility','service'] as Family[]).map(f=><button key={f} className={draft.family===f?'selected':''} aria-pressed={draft.family===f} onClick={()=>{change({family:f});setAssetPage(0);}}>{f==='equipment'?'Equipment':f==='facility'?'Facilities':'Services'}</button>)}</div><div className="rfp-note rfp-row between"><div><small>INTENDED AGREEMENT · OPTIONAL</small><strong>{draft.nomenclature?.label||'Choose an agreement label'}</strong><p>{draft.nomenclature?.group||'Separate from what is covered.'}</p></div>{button(draft.nomenclature?'Change':'Choose label',()=>setModal('labels'))}</div>{(mappingError||coverageError)&&<p className="rfp-error" role="alert">{mappingError} {coverageError}</p>}<div className="rfp-fields">{field('title','What do you need? *')}{field('location','Where is the work? *')}{field('start','Preferred start date *','date')}{field('months','Expected duration (months) *','number',{min:1,max:120})}</div>{rich('brief','What does a good outcome look like? *')}</section>
   <section className="rfp-paper"><h2>What is covered?</h2><p>Multiple items. Registry-linked or described for this request.</p><div className="rfp-row rfp-coverage-actions">{typeId&&button('Pick from my registry',()=>{setAssetPage(0);setModal('registry');})}{button(draft.family==='service'?'+ Describe service scope':'+ Describe an unregistered item',()=>{setNewCoverage({name:'',quantity:1,location:draft.location,family:draft.family});setModal('coverage');})}{typeId&&button(draft.family==='equipment'?'Register equipment & add':'Register facility & add',()=>setRegister(typeId))}</div>{draft.coverage.map(c=><RfpCoverageCard key={c.id} coverage={c} colors={colors} tenantId={tenantId} live={live} onRemove={()=>{if(draft.blocks.some(b=>b.coverageIds.includes(c.id))){fail('Unlink this coverage from its requirements before removing it.');return;}change({coverage:draft.coverage.filter(x=>x.id!==c.id)});}}/>)} <p className="rfp-note">Described items are added to this request only. Your registry won’t change. Register & add opens the existing registry form and saves one actual unit to your registry only when you submit it. Services remain request-only.</p></section>
   <section className="rfp-paper"><h2>What should they propose for?</h2><p>Choose a requirement type, then describe what you need. Vendors will propose their approach and price.</p><div className="rfp-row wrap">{(Object.entries(REQUIREMENT_TYPES) as [RequirementType,string][]).map(([type,label])=>button('+ '+label,()=>addRequirement(type)))}</div>{draft.blocks.map(b=><RequirementEditor key={b.id} requirement={b} coverage={draft.coverage} onChange={patch=>change({blocks:draft.blocks.map(x=>x.id===b.id?{...x,...patch}:x)})} onRemove={()=>change({blocks:draft.blocks.filter(x=>x.id!==b.id)})}/>)}</section>
  </>}
  {draft.step===1&&<><section className="rfp-paper"><div className="rfp-row between"><h2>Ask once. Compare fairly.</h2>{button('+ Add question',()=>change({questions:[...draft.questions,{id:uid(),text:'',section:'Delivery',type:'text',required:true,eligibility:false}]}))}</div>{draft.questions.map((q,i)=>{const edit=(patch:Partial<typeof q>)=>change({questions:draft.questions.map(x=>x.id===q.id?{...x,...patch}:x)});return <article className="rfp-unit" key={q.id}><div className="rfp-fields"><label className="rfp-field">{i+1}. Question *<input value={q.text} onChange={e=>edit({text:e.target.value})}/></label><label className="rfp-field">Section<input value={q.section} onChange={e=>edit({section:e.target.value})}/></label><label className="rfp-field">Answer format<select value={q.type} onChange={e=>edit({type:e.target.value as any,eligibility:false})}>{[['text','Written answer'],['number','Number'],['yesno','Yes / No'],['file','Document']].map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></label></div><label className="rfp-check"><input type="checkbox" checked={q.required} disabled={q.eligibility} onChange={e=>edit({required:e.target.checked})}/>Answer required</label><label className="rfp-check"><input type="checkbox" checked={q.eligibility} disabled={q.type!=='yesno'} onChange={e=>edit({eligibility:e.target.checked,required:true})}/>Eligibility condition — must answer Yes</label>{button('Remove',()=>change({questions:draft.questions.filter(x=>x.id!==q.id)}))}</article>})}<p className="rfp-note">Required answers and eligibility conditions are different. Document questions describe what the vendor will upload in the response release.</p></section><section className="rfp-paper"><h2>Tell vendors what matters.</h2><p>Proposed weights. No automatic winner.</p><div className="rfp-fields">{['Approach & delivery','Experience & capability','Commercial value'].map((label,i)=><label className="rfp-field" key={label}>{label} (%)<input type="number" min="0" max="100" value={draft.weights[i]} onChange={e=>change({weights:draft.weights.map((v,j)=>j===i?Number(e.target.value):v)})}/></label>)}</div></section></>}
  {draft.step===2&&<><section className="rfp-paper"><h2>Make the response rules clear.</h2><div className="rfp-fields"><label className="rfp-field">Quote currency *<select value={draft.currency} onChange={e=>change({currency:e.target.value})}><option value="">Choose currency</option>{currencyOptions.map(c=><option key={c.code} value={c.code}>{c.code} · {c.name}{c.isDefault?' · Default':''}</option>)}</select></label>{field('budget','Indicative budget · optional','text')}{field('deadline','Proposals due by *','date')}{field('deadlineTime','Closing time · Asia/Kolkata *','time')}{field('questionsBy','Clarification questions due by *','date')}</div><label className="rfp-check"><input type="checkbox" checked={draft.shareBudget} onChange={e=>change({shareBudget:e.target.checked})}/>Share indicative budget</label>{rich('terms','Terms and expectations *')}</section><section className="rfp-paper"><h2>Is a bid security required?</h2><p>Vendor → buyer during bidding. Not a service advance.</p><div className="rfp-choices">{[['none','No bid security'],['declaration','Bid declaration'],['deposit','Bid security / EMD']].map(([v,t])=><button key={v} aria-pressed={draft.security===v} className={draft.security===v?'selected':''} onClick={()=>change({security:v as any})}>{t}</button>)}</div>{draft.security==='deposit'&&<>{field('securityAmount',`Fixed amount (${draft.currency}) *`)}{rich('releaseTerms','Release / refund conditions *')}<label className="rfp-check"><input type="checkbox" checked={draft.exemption} onChange={e=>change({exemption:e.target.checked})}/>Allow exemption requests with evidence</label></>}<label className="rfp-check"><input type="checkbox" checked={draft.performance} onChange={e=>change({performance:e.target.checked})}/>Performance security from the selected vendor after award</label>{draft.performance&&field('performancePct','Percentage of awarded value *')}<p className="rfp-note">This stores participation requirements, not a payment instruction or receipt. Catalog Studio’s advance deposit remains a buyer → provider commercial term.</p></section></>}
  {draft.step===3&&<section className="rfp-paper"><h2>Who should respond?</h2><p>Add vendor creates a saved contact. Selecting a vendor adds an intended recipient only. Invitations are sent only when you choose Finalize & send on Review.</p><RfpVendorPicker onBusyChange={setRecipientBusy} invites={draft.invites} onChange={invites=>change({invites})} tenantId={tenantId}/></section>}
  {draft.step===4&&<><div className="rfp-row between"><h2>Review the request</h2><button type="button" className="rfp-button" onClick={()=>window.print()}>Print / Save PDF</button></div><RfpDocument draft={draft} number={record?.rfq_number}/><p className="rfp-note">Finalize & send publishes this request and queues private invitations to the selected vendors via their enabled email and WhatsApp channels. No contract, payment or service event is created.</p><section className="rfp-paper"><h2>Recipients · {draft.invites.length}</h2>{draft.invites.map(v=><p key={v.id}>{v.name} · {[v.email?'Email':'',v.mobile?'WhatsApp':''].filter(Boolean).join(' + ')}</p>)}</section></>}
  </div><aside className="rfp-summary"><small>YOUR REQUEST</small><h2>{draft.title||'Your request takes shape here'}</h2><span className="rfp-tag">Draft · not sent</span><dl><dt>Agreement label</dt><dd>{draft.nomenclature?.label||'Not selected'}</dd><dt>Term</dt><dd>{draft.months?draft.months+' months':'Not set'}</dd><dt>Covered items</dt><dd>{draft.coverage.length}</dd><dt>Requirements</dt><dd>{draft.blocks.length}</dd><dt>Questions</dt><dd>{draft.questions.length}</dd><dt>Recipients</dt><dd>{draft.invites.length}</dd></dl><p>One request. Independent proposals. No contract, event or payment is created.</p></aside></fieldset>
  <div className="rfp-footer"><div><strong>{record?.rfq_number||'RFP draft'}</strong><small>{dirty?'Unsaved changes':record?'Saved to your workspace':'Not yet saved'}</small><small>Save & continue saves this step and opens the next. No separate save needed.</small></div><div className="rfp-row">{busy?<InlineLoader text={draft.step===4?"Saving and finalizing request":"Saving and verifying draft"}/>:<>{draft.step>0&&button('← Back',()=>change({step:draft.step-1}))}{button('Save without continuing',()=>void save(),false,!!fatal||(!dirty&&!!record))}{draft.step<4?button('Save & continue →',()=>void save(draft.step+1),true,!!fatal):button('Finalize & send →',()=>void save(undefined,true),true,!!fatal)}</>}</div></div>
  </div></div>
  <dialog ref={dialog} onCancel={()=>setModal(null)} className="rfp-modal"><div className="rfp-row between"><h2>{modal==='labels'?'Contract family & agreement label':modal==='registry'?'Pick from my registry':draft.family==='service'?'Describe service scope':'Describe an unregistered item'}</h2>{button('Close',()=>{dialog.current?.close();setModal(null);})}</div>
   {modal==='labels'&&(nomenclatures.isLoading?<InlineLoader/>:nomenclatures.isError?<p role="alert">Could not load agreement labels. {button('Retry',()=>void nomenclatures.refetch())}</p>:nomenclatures.data?.filter(g=>g.items.some(n=>labelApplies(n.form_settings,draft.family))).map(g=><section className="rfp-unit" key={g.group}><h3>{g.label}</h3><div className="rfp-row wrap">{g.items.filter(n=>labelApplies(n.form_settings,draft.family)).map(n=>button(n.form_settings.short_name||n.display_name,()=>{change({nomenclature:{id:n.id,label:n.form_settings.short_name||n.display_name,group:g.label}});dialog.current?.close();setModal(null);},draft.nomenclature?.id===n.id))}</div></section>))}
   {modal==='labels'&&<>{button('No agreement label',()=>{change({nomenclature:null});dialog.current?.close();setModal(null);})}{!nomenclatures.isLoading&&!nomenclatures.isError&&!nomenclatures.data?.some(g=>g.items.some(n=>labelApplies(n.form_settings,draft.family)))&&<p>No applicable labels are configured for this scope. You can leave the optional label unset.</p>}</>}
   {modal==='registry'&&<>{assets.isLoading?<InlineLoader/>:assets.isError?<p role="alert">{errorText(assets.error)}{button('Retry',()=>void assets.refetch())}</p>:assets.data?.data.filter(a=>ownRegistryItem(a,tenantId,live,draft.family)).map(a=><section className="rfp-unit rfp-row between" key={a.id}><RfpCoverageCard coverage={{id:a.id,name:a.name,quantity:1,location:a.location||'',family:a.resource_type_id==='asset'?'facility':'equipment',resourceId:a.asset_type_id,registryId:a.id}} asset={a} colors={colors} tenantId={tenantId} live={live}/>{button('Select',()=>{change({coverage:[...draft.coverage,{id:uid(),name:a.name,quantity:1,location:a.location||'',family:a.resource_type_id==='asset'?'facility':'equipment',resourceId:a.asset_type_id||a.template_id||null,registryId:a.id}]});dialog.current?.close();setModal(null);},false,draft.coverage.some(c=>c.registryId===a.id))}</section>)}<div className="rfp-row">{button('Previous',()=>setAssetPage(p=>p-1),false,assetPage===0)}{button('Next',()=>setAssetPage(p=>p+1),false,!assets.data?.pagination.has_more)}</div></>}
   {modal==='registry'&&!assets.isLoading&&!assets.isError&&!assets.data?.data.some(a=>ownRegistryItem(a,tenantId,live,draft.family))&&<p>No matching items in your own registry on this page. You can register an item or describe it for this request only.</p>}
   {modal==='coverage'&&<><div className="rfp-fields"><label className="rfp-field">Name *<input value={newCoverage.name} onChange={e=>setNewCoverage(c=>({...c,name:e.target.value}))}/></label><label className="rfp-field">Location<input value={newCoverage.location} onChange={e=>setNewCoverage(c=>({...c,location:e.target.value}))}/></label><label className="rfp-field">Units *<input type="number" min="1" value={newCoverage.quantity} onChange={e=>setNewCoverage(c=>({...c,quantity:Number(e.target.value)}))}/></label><p>Scope: {draft.family}. Added to this request only; your registry won’t change.</p></div>{button('Add to request',()=>{if(!newCoverage.name.trim()||!Number.isInteger(newCoverage.quantity)||newCoverage.quantity<1){addToast({type:'error',title:'Check coverage',message:'Enter a name and positive whole-number unit count.'});return;}change({coverage:[...draft.coverage,{...newCoverage,id:uid(),resourceId:null,registryId:null}]});dialog.current?.close();setModal(null);},true)}</>}
  </dialog>
  {register&&(types.isLoading?<InlineLoader text="Loading registry types"/>:types.isError?<div className="rfp-error" role="alert">Registry types could not load. {button('Retry',()=>void types.refetch())}{button('Cancel',()=>setRegister(null))}</div>:!types.data?.length?<div className="rfp-note">No configured types for this scope. Configure your registry types first, or describe an unregistered item. {button('Close',()=>setRegister(null))}</div>:<EquipmentFormDialog isOpen mode="create" onClose={()=>{if(!registering)setRegister(null);}} registryMode={register==='asset'?'entity':'equipment'} defaultOwnershipType="self" resourceTypeId={register} categories={(types.data||[]).filter(t=>t.resource_type_id===register).map(t=>({id:t.id,name:t.name,sub_category:t.sub_category,resource_type_id:t.resource_type_id}))} onSubmit={registerAsset} isSubmitting={registering}/>)}
 </main>;
}
