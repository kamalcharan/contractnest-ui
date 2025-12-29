// src/pages/catalog-studio/components/block-wizard/steps/basic-info.tsx
import React from 'react';
import { Block } from '../../../types';
import { ICON_OPTIONS } from '../../../data';

interface BasicInfoStepProps {
  blockType: string;
  formData: Partial<Block>;
  onChange: (field: string, value: string | number) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ blockType, formData, onChange }) => {
  const isServiceBlock = blockType === 'service';
  const isSpareBlock = blockType === 'spare';
  const isBillingBlock = blockType === 'billing';

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-200">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Basic Information</h2>
      <p className="text-sm text-gray-500 mb-6">Define the fundamental details of this block.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Block Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g., Yoga Session" value={formData.name || ''} onChange={(e) => onChange('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <select value={formData.icon || '🧘'} onChange={(e) => onChange('icon', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              {ICON_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea placeholder="Describe what this block includes..." value={formData.description || ''} onChange={(e) => onChange('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
        </div>
        {isServiceBlock && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration <span className="text-red-500">*</span></label>
              <input type="number" value={formData.duration || 60} onChange={(e) => onChange('duration', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select value={formData.durationUnit || 'min'} onChange={(e) => onChange('durationUnit', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="min">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Time</label>
              <select defaultValue="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="0">No buffer</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
              </select>
            </div>
          </div>
        )}
        {isSpareBlock && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g., ACF-150" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="filter">Filters</option>
                <option value="gas">Gases</option>
                <option value="parts">Parts</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>
        )}
        {isBillingBlock && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="upfront">100% Upfront</option>
                <option value="emi">EMI/Installments</option>
                <option value="milestone">Milestone-based</option>
                <option value="subscription">Recurring</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Trigger</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="auto">Auto-generate</option>
                <option value="manual">Manual</option>
                <option value="completion">On Completion</option>
              </select>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input type="text" placeholder="Add tags separated by commas..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          <p className="text-xs text-gray-400 mt-1">Tags help organize and filter blocks in your library</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
