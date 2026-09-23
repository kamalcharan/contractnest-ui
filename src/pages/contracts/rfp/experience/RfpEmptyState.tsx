import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Check, ClipboardList, FileText, Layers, ShieldCheck, Wrench } from 'lucide-react';

/** First-use presentation only. Does not create data or preselect wizard values. */
export default function RfpEmptyState() {
  return (
    <section className="rfp-empty" aria-labelledby="rfp-empty-heading">
      <div className="rfp-empty-hero">
        <div className="rfp-empty-copy">
          <span className="rfp-empty-eyebrow"><span aria-hidden="true" /> A CLEAR BRIEF. A BETTER START.</span>
          <h2 id="rfp-empty-heading">Great proposals start with <em>a clear ask.</em></h2>
          <p className="rfp-empty-lead">Turn what you need into a request vendors can understand. Bring your scope, questions and expectations together—before anyone quotes.</p>
          <div className="rfp-empty-types" aria-label="Supported request types">
            <span><Wrench size={15} aria-hidden="true" /> Equipment</span>
            <span><Building2 size={15} aria-hidden="true" /> Facilities</span>
            <span><Layers size={15} aria-hidden="true" /> Services</span>
          </div>
          <Link className="rfp-button primary rfp-empty-cta" to="/requests/rfp/new">Create your first RFP <ArrowRight size={18} aria-hidden="true" /></Link>
          <p className="rfp-empty-reassurance"><ShieldCheck size={16} aria-hidden="true" /> Start with a draft. Save and return. Nothing is sent.</p>
        </div>

        <div className="rfp-empty-preview" aria-label="Illustration of a structured request, not a saved RFP">
          <div className="rfp-empty-preview-caption"><span /> YOUR NEED, CLEARLY LAID OUT</div>
          <div className="rfp-empty-document">
            <div className="rfp-empty-doc-top"><span className="rfp-empty-doc-icon"><FileText size={24} aria-hidden="true" /></span><span className="rfp-empty-draft-tag">DRAFT</span></div>
            <h3>Your next service partnership</h3>
            <p>One brief. All the important details.</p>
            <div className="rfp-empty-doc-line"><span><Layers size={17} aria-hidden="true" /></span><div><strong>What you need covered</strong><small>Items, locations & service requirements</small></div><Check size={16} aria-hidden="true" /></div>
            <div className="rfp-empty-doc-line"><span><ClipboardList size={17} aria-hidden="true" /></span><div><strong>What you want to know</strong><small>Questions & expectations</small></div><Check size={16} aria-hidden="true" /></div>
            <div className="rfp-empty-doc-line"><span><ShieldCheck size={17} aria-hidden="true" /></span><div><strong>What matters to you</strong><small>Terms, timelines & evaluation criteria</small></div><Check size={16} aria-hidden="true" /></div>
            <div className="rfp-empty-doc-bottom"><span className="rfp-empty-dot" /> Prepared on your terms</div>
          </div>
          <p className="rfp-empty-example">Illustrative preview · your draft starts blank</p>
        </div>
      </div>

      <div className="rfp-empty-steps" aria-label="How to prepare your RFP">
        <article><span>01</span><div><h3>Make the need clear</h3><p>Choose coverage and describe the outcome you want.</p></div></article>
        <article><span>02</span><div><h3>Ask what matters</h3><p>Give vendors a consistent set of questions to answer.</p></div></article>
        <article><span>03</span><div><h3>Get your brief ready</h3><p>Review everything in one document and save your draft.</p></div></article>
      </div>
      <div className="rfp-empty-footnote"><span><strong>Available now: draft preparation.</strong> Vendor invitations and responses are not enabled yet.</span><Link to="/requests">Looking for existing RFQs? <ArrowRight size={15} aria-hidden="true" /></Link></div>
    </section>
  );
}
