import React from 'react';
import { ArrowRight, CalendarClock, Check, ClipboardCheck, FileText, Users } from 'lucide-react';
import '../../contracts/hub/requests-empty-state.css';
import './group-sessions-empty-state.css';

interface Props {
  colors: any;
  onCreateBlock: () => void;
  onContracts: () => void;
}

/** First-use explanation only. Animation never creates or changes a contract. */
export default function GroupSessionsEmptyState({ colors, onCreateBlock, onContracts }: Props) {
  const styles = {
    '--rq-ink': colors.utility.primaryText,
    '--rq-muted': colors.utility.secondaryText,
    '--rq-brand': colors.brand.primary,
    '--rq-bg': colors.utility.secondaryBackground,
    '--rq-line': colors.utility.primaryText + '20',
  } as React.CSSProperties;

  return <section className="rq-state gs-empty" style={styles} aria-label="Getting started with group sessions">
    <div className="rq-hero">
      <div className="rq-copy">
        <span className="rq-eyebrow">BUILT FOR PEOPLE WHO BRING PEOPLE TOGETHER</span>
        <h2>Run your group sessions <em>with clarity.</em></h2>
        <p>Yoga classes, training programs, group campaigns—give every group a shared schedule, a member roster, attendance and dues in one place.</p>
        <button className="rq-action rq-primary" type="button" onClick={onCreateBlock}>Create a Group Session block <ArrowRight size={16} aria-hidden="true" /></button>
        <div className="rq-reassurance"><Check size={15} aria-hidden="true" />A group appears here only when its block is used in an active contract.</div>
        <button className="rq-secondary" type="button" onClick={onContracts}>Already have a block? Create a contract <ArrowRight size={14} aria-hidden="true" /></button>
      </div>
      <div className="rq-preview" aria-label="Illustration: add a Group Session block to a contract, then activate the contract to see the group here">
        <div className="rq-document gs-journey">
          <div className="rq-doc-top"><span className="rq-symbol"><Users size={25} aria-hidden="true" /></span><span className="rq-example-badge">ILLUSTRATION</span></div>
          <h3>From block to live group</h3><p>A group starts with a contract commitment.</p>
          <div className="gs-journey-stage" aria-hidden="true">
            <div className="gs-journey-library"><span>BLOCK LIBRARY</span><div><Users size={17} /> Group Session</div></div>
            <div className="gs-journey-track"><ArrowRight size={19} /><span className="gs-journey-moving"><Users size={14} /> Group Session</span></div>
            <div className="gs-journey-contract"><span><FileText size={16} /> CONTRACT</span><div className="gs-journey-slot">Add group service here</div><strong>Active contract</strong></div>
          </div>
          <div className="rq-doc-row"><CalendarClock size={18} aria-hidden="true" /><div><strong>One shared schedule</strong><small>Plan recurring classes or sessions</small></div></div>
          <div className="rq-doc-row"><ClipboardCheck size={18} aria-hidden="true" /><div><strong>Attendance and dues</strong><small>Follow each member from the group view</small></div></div>
        </div>
        <small className="rq-example-note">Illustrative animation · no block or contract is created</small>
      </div>
    </div>
    <div className="rq-steps">
      <article><span>01</span><div><h3>Create the group service</h3><p>Make a Group Session block for your class, training or campaign.</p></div></article>
      <article><span>02</span><div><h3>Put it in a contract</h3><p>Add the block to a contract and activate that contract.</p></div></article>
      <article><span>03</span><div><h3>Run the group here</h3><p>Manage its schedule, roster, attendance and dues.</p></div></article>
    </div>
  </section>;
}
