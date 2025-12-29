// src/pages/catalog-studio/components/block-wizard/steps/service/pricing-step.tsx
import React, { useState } from 'react';
import { DollarSign, Percent, Calculator, Plus, Trash2 } from 'lucide-react';
import { CURRENCY_OPTIONS } from '../../../../data';

interface PricingTier { id: string; name: string; price: number; description?: string; }

interface PricingStepProps {
  formData: { priceType?: 'fixed' | 'hourly' | 'tiered' | 'custom'; basePrice?: number; currency?: string; taxInclusive?: boolean; taxRate?: number; pricingTiers?: PricingTier[]; };
  onChange: (field: string, value: unknown) => void;
}

const PricingStep: React.FC<PricingStepProps> = ({ formData, onChange }) => {
  const [priceType, setPriceType] = useState(formData.priceType || 'fixed');
  const [tiers, setTiers] = useState<PricingTier[]>(formData.pricingTiers || [
    { id: '1', name: 'Basic', price: 500, description: 'Standard service' },
    { id: '2', name: 'Premium', price: 1000, description: 'Extended service with extras' },
  ]);

  const handlePriceTypeChange = (type: 'fixed' | 'hourly' | 'tiered' | 'custom') => { setPriceType(type); onChange('priceType', type); };
  const addTier = () => { const newTier: PricingTier = { id: Date.now().toString(), name: `Tier ${tiers.length + 1}`, price: 0 }; setTiers([...tiers, newTier]); onChange('pricingTiers', [...tiers, newTier]); };
  const removeTier = (id: string) => { const updated = tiers.filter((t) => t.id !== id); setTiers(updated); onChange('pricingTiers', updated); };
  const updateTier = (id: string, field: keyof PricingTier, value: string | number) => { const updated = tiers.map((t) => (t.id === id ? { ...t, [field]: value } : t)); setTiers(updated); onChange('pricingTiers', updated); };
  const selectedCurrency = CURRENCY_OPTIONS.find((c) => c.value === (formData.currency || 'INR'));

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-200">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Pricing Configuration</h2>
      <p className="text-sm text-gray-500 mb-6">Set how this service will be priced.</p>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Pricing Model <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-4 gap-3">
            <div onClick={() => handlePriceTypeChange('fixed')} className={`p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${priceType === 'fixed' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
              <DollarSign className="w-6 h-6 mx-auto mb-1 text-purple-600" /><div className="text-sm font-bold text-gray-900">Fixed</div><div className="text-xs text-gray-500">One price</div>
            </div>
            <div onClick={() => handlePriceTypeChange('hourly')} className={`p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${priceType === 'hourly' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
              <Calculator className="w-6 h-6 mx-auto mb-1 text-purple-600" /><div className="text-sm font-bold text-gray-900">Hourly</div><div className="text-xs text-gray-500">Per hour</div>
            </div>
            <div onClick={() => handlePriceTypeChange('tiered')} className={`p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${priceType === 'tiered' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
              <Percent className="w-6 h-6 mx-auto mb-1 text-purple-600" /><div className="text-sm font-bold text-gray-900">Tiered</div><div className="text-xs text-gray-500">Multiple options</div>
            </div>
            <div onClick={() => handlePriceTypeChange('custom')} className={`p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${priceType === 'custom' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
              <Calculator className="w-6 h-6 mx-auto mb-1 text-purple-600" /><div className="text-sm font-bold text-gray-900">Quote</div><div className="text-xs text-gray-500">Custom quote</div>
            </div>
          </div>
        </div>
        {(priceType === 'fixed' || priceType === 'hourly') && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{priceType === 'fixed' ? 'Service Price' : 'Hourly Rate'} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{selectedCurrency?.symbol}</span>
                  <input type="number" value={formData.basePrice || 0} onChange={(e) => onChange('basePrice', parseFloat(e.target.value))} className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select value={formData.currency || 'INR'} onChange={(e) => onChange('currency', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {CURRENCY_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
            </div>
          </div>
        )}
        {priceType === 'tiered' && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-gray-700">Pricing Tiers</h4>
              <button onClick={addTier} className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Tier</button>
            </div>
            <div className="space-y-3">
              {tiers.map((tier, index) => (
                <div key={tier.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">{index + 1}</div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input type="text" value={tier.name} onChange={(e) => updateTier(tier.id, 'name', e.target.value)} placeholder="Tier name" className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{selectedCurrency?.symbol}</span>
                      <input type="number" value={tier.price} onChange={(e) => updateTier(tier.id, 'price', parseFloat(e.target.value))} className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <input type="text" value={tier.description || ''} onChange={(e) => updateTier(tier.id, 'description', e.target.value)} placeholder="Description" className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  {tiers.length > 1 && (<button onClick={() => removeTier(tier.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>)}
                </div>
              ))}
            </div>
          </div>
        )}
        {priceType === 'custom' && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex gap-3"><span className="text-xl">💡</span><div><div className="font-semibold text-yellow-800">Custom Quote Mode</div><p className="text-sm text-yellow-700 mt-1">Price will be determined per contract. A quote request form will be shown to customers instead of a fixed price.</p></div></div>
          </div>
        )}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Tax Settings</h4>
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.taxInclusive !== false} onChange={(e) => onChange('taxInclusive', e.target.checked)} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span className="text-sm text-gray-700">Price includes taxes (GST/VAT)</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label><input type="number" value={formData.taxRate || 18} onChange={(e) => onChange('taxRate', parseFloat(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="gst">GST</option><option value="vat">VAT</option><option value="sales">Sales Tax</option><option value="none">No Tax</option></select></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Discount Options</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Allow coupon codes</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Allow bulk/quantity discounts</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Enable negotiated pricing</span></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingStep;
