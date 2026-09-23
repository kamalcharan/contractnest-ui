import React, { useState } from 'react';
import type { VaniParsedIntent } from '@/services/vaniComposerService';

/** A clarification inside the current canvas, not a new wizard or drafting path. */
export default function VaniContextQuestions({ intent, onConfirm, template }: {
  intent: VaniParsedIntent; onConfirm: (intent: VaniParsedIntent) => void; template: boolean;
}) {
  const [value, setValue] = useState(() => structuredClone(intent));
  const inputClass = 'border rounded-lg px-3 py-2 w-full bg-transparent';
  const ready = value.duration.value > 0 && !!value.duration.unit && !!value.billing.mode && !!value.acceptance
    && (template || !!value.start_date)
    && (value.billing.mode !== 'emi' || value.billing.emi_months >= 2)
    && (value.billing.mode !== 'per_block' || !!value.billing.cycle);
  return <form className="border rounded-xl p-4 my-4 space-y-4 max-h-[60vh] overflow-y-auto flex-shrink-0" onSubmit={e => { e.preventDefault(); if (ready) onConfirm(value); }}>
    <h3 className="font-semibold">A few details need your confirmation</h3>
    <p className="text-sm">VaNi has not assumed these terms. Nothing has been saved or sent.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label>Duration *
        <input className={inputClass} type="number" min="1" max="3650" required value={value.duration.value || ''}
          onChange={e => setValue(v => ({ ...v, duration: { ...v.duration, value: Number(e.target.value) } }))} />
      </label>
      <label>Duration unit *
        <select className={inputClass} required value={value.duration.unit}
          onChange={e => setValue(v => ({ ...v, duration: { ...v.duration, unit: e.target.value as VaniParsedIntent['duration']['unit'] } }))}>
          <option value="">Choose a unit</option><option value="days">Days</option><option value="months">Months</option><option value="years">Years</option>
        </select>
      </label>
      {!template && <label>Starts on *
        <input className={inputClass} type="date" required value={value.start_date}
          onChange={e => setValue(v => ({ ...v, start_date: e.target.value }))} />
      </label>}
      <label>Payment plan *
        <select className={inputClass} required value={value.billing.mode}
          onChange={e => setValue(v => ({ ...v, billing: { ...v.billing, mode: e.target.value as VaniParsedIntent['billing']['mode'] } }))}>
          <option value="">Choose a payment plan</option><option value="prepaid">Full payment upfront</option>
          <option value="emi">Monthly instalments</option><option value="per_block">Per service billing cycle</option>
        </select>
      </label>
      {value.billing.mode === 'emi' && <label>Number of instalments *
        <input className={inputClass} type="number" min="2" max="60" required value={value.billing.emi_months || ''}
          onChange={e => setValue(v => ({ ...v, billing: { ...v.billing, emi_months: Number(e.target.value) } }))} />
      </label>}
      {value.billing.mode === 'per_block' && <label>Billing cycle *
        <select className={inputClass} required value={value.billing.cycle}
          onChange={e => setValue(v => ({ ...v, billing: { ...v.billing, cycle: e.target.value } }))}>
          <option value="">Choose a cycle</option>
          {['daily','weekly','fortnightly','monthly','quarterly','halfyearly','annual','prepaid','postpaid'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>}
      <label>How is it accepted? *
        <select className={inputClass} required value={value.acceptance}
          onChange={e => setValue(v => ({ ...v, acceptance: e.target.value as VaniParsedIntent['acceptance'] }))}>
          <option value="">Choose acceptance</option><option value="signoff">Buyer signs off</option>
          <option value="payment">Buyer pays to accept</option><option value="auto">Activate without an acceptance request</option>
        </select>
      </label>
    </div>
    {template && <p className="text-sm">These are reusable template terms. Calendar dates are illustrative until assigned.</p>}
    <button className="border rounded-lg px-4 py-2 font-semibold disabled:opacity-40" disabled={!ready}>Confirm details and continue</button>
  </form>;
}
