import React from 'react';
import { ArrowRight, FileText, ClipboardList, Users, Check, Search, AlertCircle } from 'lucide-react';
import './requests-empty-state.css';

export type RequestState = 'loading' | 'error' | 'list' | 'filtered' | 'page' | 'empty';
export function requestState(input: { loading: boolean; error: boolean; loaded: boolean; hasData: boolean; filtered: boolean; page: number; total: number }): RequestState {
  if (input.error) return 'error';
  if (input.loading || !input.loaded) return 'loading';
  if (input.hasData) return 'list';
  if (input.filtered) return 'filtered';
  if (input.page > 1 || input.total > 0) return 'page';
  return 'empty';
}

interface Props {
  kind: 'error' | 'filtered' | 'page' | 'empty';
  received: boolean;
  colors: any;
  busy?: boolean;
  onCreate: () => void;
  onRetry: () => void;
  onClear: () => void;
  onFirstPage: () => void;
  onContracts: () => void;
}

export default function RequestsEmptyState({ kind, received, colors, busy, onCreate, onRetry, onClear, onFirstPage, onContracts }: Props) {
  const styles = { '--rq-ink': colors.utility.primaryText, '--rq-muted': colors.utility.secondaryText, '--rq-brand': colors.brand.primary, '--rq-bg': colors.utility.secondaryBackground, '--rq-line': colors.utility.primaryText + '20' } as React.CSSProperties;
  const action = (text: string, callback: () => void, primary = true) => <button type="button" className={primary ? 'rq-action rq-primary' : 'rq-action'} onClick={callback} disabled={busy}>{text}<ArrowRight size={16} aria-hidden="true" /></button>;
  if (kind !== 'empty') {
    const Icon = kind === 'error' ? AlertCircle : Search;
    return <section className="rq-state rq-recovery" style={styles} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="rq-symbol"><Icon size={27} aria-hidden="true" /></span>
      <h2>{kind === 'error' ? 'We couldn’t load your requests.' : kind === 'filtered' ? 'No requests match this view.' : 'No requests on this page.'}</h2>
      <p>{kind === 'error' ? 'Your requests may still be there. Retry to check—we haven’t changed anything.' : kind === 'filtered' ? 'Try a different search or clear the filters to see all requests.' : 'Return to the first page to see the available requests.'}</p>
      {kind === 'error' ? action(busy ? 'Checking…' : 'Retry', onRetry) : kind === 'filtered' ? action('Clear filters', onClear) : action('Back to first page', onFirstPage)}
    </section>;
  }
  const steps = received ? [
    ['Review the brief', 'Understand the buyer’s scope and expectations.'],
    ['Prepare your quote', 'Respond with your approach and pricing.'],
    ['Follow the decision', 'Keep the request and your response connected.'],
  ] : [
    ['Describe the need', 'Give vendors a clear scope to quote against.'],
    ['Invite the right vendors', 'Request quotes for the same requirements.'],
    ['Review the responses', 'Compare proposals before choosing your provider.'],
  ];
  return <section className="rq-state" style={styles} aria-label={received ? 'Getting started with received requests' : 'Getting started with vendor requests'}>
    <div className="rq-hero">
      <div className="rq-copy">
        <span className="rq-eyebrow">{received ? 'A CLEAR BRIEF. YOUR NEXT OPPORTUNITY.' : 'ONE CLEAR ASK. INFORMED DECISIONS.'}</span>
        <h2>{received ? <>Your next opportunity starts with <em>a request.</em></> : <>Bring the right vendors <em>to the table.</em></>}</h2>
        <p>{received ? 'When a buyer invites you to quote, their request appears here. Understand what they need, prepare your response, and keep the conversation connected.' : 'Tell vendors what you need, collect quotes against a shared scope, and choose with the details in front of you.'}</p>
        {received ? action(busy ? 'Checking…' : 'Check for new requests', onRetry) : action('Create a request', onCreate)}
        <div className="rq-reassurance"><Check size={15} aria-hidden="true" />{received ? 'Nothing waiting in this view right now.' : 'Start with a draft. Invitations for the new RFP flow are not enabled yet.'}</div>
        {received && <button className="rq-secondary" type="button" onClick={onContracts}>View your contracts <ArrowRight size={14} aria-hidden="true" /></button>}
      </div>
      <div className="rq-preview" aria-label="Illustration of the request journey, not a real request">
        <div className="rq-document">
          <div className="rq-doc-top"><span className="rq-symbol"><FileText size={25} aria-hidden="true" /></span><span className="rq-example-badge">ILLUSTRATION</span></div>
          <h3>{received ? 'A brief worth responding to' : 'Your next service partnership'}</h3><p>{received ? 'The details you need, in one place.' : 'Clarity before a commitment.'}</p>
          {[[ClipboardList, 'The scope', 'What needs to be delivered'], [Users, received ? 'Your response' : 'Vendor responses', 'Approach, availability & pricing'], [Check, 'The next step', received ? 'Track the buyer’s decision' : 'Review and choose your provider']].map(([Icon, title, detail]) => {
            const RowIcon = Icon as typeof FileText;
            return <div className="rq-doc-row" key={String(title)}><RowIcon size={18} aria-hidden="true" /><div><strong>{String(title)}</strong><small>{String(detail)}</small></div></div>;
          })}
        </div>
        <small className="rq-example-note">Illustrative preview · no sample requests are created</small>
      </div>
    </div>
    <div className="rq-steps">{steps.map(([title, body], i) => <article key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
  </section>;
}
