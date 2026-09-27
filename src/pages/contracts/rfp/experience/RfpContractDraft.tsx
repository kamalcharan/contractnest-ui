import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';
import ContractWizard from '@/components/contracts/ContractWizard';
import SafeHtml from '@/components/catalog-studio/SafeHtml';
import { InlineLoader } from '@/components/common/loaders/UnifiedLoader';
import { unwrap } from './persistence';
import { rfpError } from './rfpLifecycle';

/** Resume the existing wizard, not a separate RFP contract builder. */
export default function RfpContractDraft({ id }: { id: string }) {
  const { currentTenant, isLive, perspective } = useAuth();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ['rfp-contract-draft', currentTenant?.id, isLive, id],
    enabled: !!currentTenant?.id, refetchOnWindowFocus: false,
    queryFn: async () => {
      const data = unwrap(await api.get(API_ENDPOINTS.CONTRACTS.GET(id)));
      if (data.tenant_id !== currentTenant?.id || data.is_live !== isLive || data.record_type !== 'contract' || !data.metadata?.rfp_origin) throw new Error('The linked contract is not available in this workspace.');
      return data;
    } });
  if (query.isLoading) return <InlineLoader text="Opening the awarded proposal’s contract" />;
  if (query.isError) return <p role="alert">{rfpError(query.error)}</p>;
  const data = query.data;
  if (!data) return null;
  const origin = data.metadata.rfp_origin;
  const sellerLed=origin.prepared_by==='vendor';
  const close=()=>navigate(sellerLed?'/contracts/experience':`/requests/rfp/${origin.request_id}`);
  if(perspective!==(sellerLed?'revenue':'expense'))return <p role="alert">Switch to {sellerLed?'Revenue':'Expense'} to open this agreement.</p>;
  if (data.status !== 'draft') return <section style={{ padding: 24 }}><h2>This contract is already {data.status}.</h2><button onClick={() => navigate(`/contracts/${id}`)}>Open contract</button></section>;
  return <>
    <details style={{ margin: '16px 24px', padding: 20, border: '1px solid #dce3da', borderRadius: 12, background: 'white', color: '#243b35' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>From {origin.request_number} · Awarded proposal: {new Intl.NumberFormat(undefined, { style: 'currency', currency: origin.currency }).format(origin.quoted_amount)} · View source & billing terms</summary>
      <p>{origin.response?.blocks?.length?'The awarded commitments and item prices have been carried into this agreement.':'This is an older total-only proposal. Item prices still need allocation.'} Review coverage, dates, taxes and payment timing before submission. {sellerLed?'Select or add the requesting business as your client; do not substitute another customer.':''}</p>
      <h3>Vendor’s approach</h3><SafeHtml html={origin.response?.approach || 'Not supplied'} />
      <h3>Proposed billing</h3><SafeHtml html={origin.response?.billingTerms || 'Not supplied'} />
      {(origin.request?.questions || []).map((q: any) => <div key={q.id}><strong>{q.text}</strong>{q.type === 'text' ? <SafeHtml html={String(origin.response?.answers?.[q.id] ?? 'Not answered')} /> : <p>{String(origin.response?.answers?.[q.id] ?? 'Not answered')}</p>}</div>)}
      <button onClick={close}>{sellerLed?'Back to Contracts':'Back to awarded request'}</button>
    </details>
    <ContractWizard presentation="experience" agreementOnly isOpen contractType={sellerLed?'client':'vendor'} draftContractId={id} draftContractData={data} onClose={close} />
  </>;
}
