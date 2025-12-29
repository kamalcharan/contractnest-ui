// src/pages/catalog-studio/components/block-wizard/steps/service/rules-step.tsx
import React, { useState } from 'react';
import { Shield, RefreshCw, Ban, AlertCircle, Clock, Bell } from 'lucide-react';
import { CANCELLATION_POLICIES } from '../../../../data';

interface RulesStepProps {
  formData: { autoApprove?: boolean; requiresOTP?: boolean; maxReschedules?: number; cancellationPolicy?: 'flexible' | 'moderate' | 'strict'; refundPercentage?: number; reminderHours?: number; };
  onChange: (field: string, value: unknown) => void;
}

const RulesStep: React.FC<RulesStepProps> = ({ formData, onChange }) => {
  const [cancellationPolicy, setCancellationPolicy] = useState(formData.cancellationPolicy || 'moderate');

  const handlePolicyChange = (policy: 'flexible' | 'moderate' | 'strict') => {
    setCancellationPolicy(policy);
    onChange('cancellationPolicy', policy);
    const policyData = CANCELLATION_POLICIES.find((p) => p.id === policy);
    if (policyData) onChange('refundPercentage', policyData.refundPercent);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-200">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Business Rules</h2>
      <p className="text-sm text-gray-500 mb-6">Configure cancellation, rescheduling, and automation rules.</p>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Cancellation Policy <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-3 gap-3">
            {CANCELLATION_POLICIES.map((policy) => (
              <div key={policy.id} onClick={() => handlePolicyChange(policy.id as 'flexible' | 'moderate' | 'strict')} className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${cancellationPolicy === policy.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {policy.id === 'flexible' && <RefreshCw className="w-5 h-5 text-green-600" />}
                  {policy.id === 'moderate' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                  {policy.id === 'strict' && <Ban className="w-5 h-5 text-red-600" />}
                  <span className="font-bold text-gray-900">{policy.name}</span>
                </div>
                <p className="text-xs text-gray-500">{policy.description}</p>
                <div className="mt-2 text-sm font-semibold text-purple-600">{policy.refundPercent}% refund</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Rescheduling Rules</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Reschedules Allowed</label><select value={formData.maxReschedules || 2} onChange={(e) => onChange('maxReschedules', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="0">No rescheduling</option><option value="1">1 time</option><option value="2">2 times</option><option value="3">3 times</option><option value="-1">Unlimited</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Reschedule Notice Period</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="2">At least 2 hours</option><option value="6">At least 6 hours</option><option value="12">At least 12 hours</option><option value="24">At least 24 hours</option></select></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Charge fee for late rescheduling (after notice period)</span></label>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Shield className="w-4 h-4" /> Verification & Security</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.requiresOTP !== false} onChange={(e) => onChange('requiresOTP', e.target.checked)} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Require OTP verification for service start</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Require OTP/Signature for service completion</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Auto-lock service if technician leaves geo-fence</span></label>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2"><Bell className="w-4 h-4" /> Automation & Notifications</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Send Reminder Before</label><select value={formData.reminderHours || 24} onChange={(e) => onChange('reminderHours', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="1">1 hour before</option><option value="2">2 hours before</option><option value="6">6 hours before</option><option value="12">12 hours before</option><option value="24">24 hours before</option><option value="48">48 hours before</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Reminder Channels</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="all">WhatsApp + SMS + Email</option><option value="whatsapp">WhatsApp only</option><option value="sms">SMS only</option><option value="email">Email only</option></select></div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.autoApprove !== false} onChange={(e) => onChange('autoApprove', e.target.checked)} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Auto-approve service completion (skip manual review)</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Auto-generate invoice on completion</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Request customer feedback after service</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Auto-schedule follow-up service (for recurring)</span></label>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> SLA (Service Level Agreement)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Response Time Commitment</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="none">No commitment</option><option value="1h">Within 1 hour</option><option value="4h">Within 4 hours</option><option value="24h">Within 24 hours</option><option value="48h">Within 48 hours</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Completion Guarantee</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="none">No guarantee</option><option value="same-day">Same day</option><option value="next-day">Next business day</option><option value="3-days">Within 3 days</option></select></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-4"><input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Offer compensation if SLA is breached</span></label>
        </div>
      </div>
    </div>
  );
};

export default RulesStep;
