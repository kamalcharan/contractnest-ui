// src/pages/catalog-studio/components/block-wizard/steps/service/evidence-step.tsx
import React, { useState } from 'react';
import { Camera, Pen, MapPin, Clock, FileText, Shield, Check } from 'lucide-react';

interface EvidenceConfig { id: string; name: string; icon: React.ReactNode; description: string; enabled: boolean; when?: 'before' | 'during' | 'after' | 'any'; required?: boolean; }

interface EvidenceStepProps {
  formData: { evidenceRequired?: boolean; evidenceTypes?: string[]; };
  onChange: (field: string, value: unknown) => void;
}

const EvidenceStep: React.FC<EvidenceStepProps> = ({ formData, onChange }) => {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceConfig[]>([
    { id: 'photo-before', name: 'Before Photo', icon: <Camera className="w-5 h-5" />, description: 'Capture photo before starting service', enabled: true, when: 'before', required: true },
    { id: 'photo-after', name: 'After Photo', icon: <Camera className="w-5 h-5" />, description: 'Capture photo after completion', enabled: true, when: 'after', required: true },
    { id: 'signature', name: 'Customer Signature', icon: <Pen className="w-5 h-5" />, description: 'Digital signature for confirmation', enabled: true, when: 'after', required: true },
    { id: 'gps', name: 'GPS Location', icon: <MapPin className="w-5 h-5" />, description: 'Auto-capture service location', enabled: false, when: 'before', required: false },
    { id: 'timestamp', name: 'Time Tracking', icon: <Clock className="w-5 h-5" />, description: 'Record start and end time', enabled: true, when: 'any', required: true },
    { id: 'report', name: 'Service Report', icon: <FileText className="w-5 h-5" />, description: 'Generate detailed work report', enabled: false, when: 'after', required: false },
    { id: 'otp', name: 'OTP Verification', icon: <Shield className="w-5 h-5" />, description: 'Customer OTP for service start/end', enabled: false, when: 'any', required: false },
  ]);

  const toggleEvidence = (id: string) => { const updated = evidenceItems.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item); setEvidenceItems(updated); onChange('evidenceTypes', updated.filter((i) => i.enabled).map((i) => i.id)); };
  const toggleRequired = (id: string) => { const updated = evidenceItems.map((item) => item.id === id ? { ...item, required: !item.required } : item); setEvidenceItems(updated); };
  const enabledCount = evidenceItems.filter((i) => i.enabled).length;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-200">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Evidence Collection</h2>
      <p className="text-sm text-gray-500 mb-6">Configure what proof of service completion is required.</p>
      <div className="space-y-6">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white"><Camera className="w-5 h-5" /></div>
              <div><div className="font-semibold text-purple-900">Evidence Collection</div><div className="text-sm text-purple-700">{enabledCount} evidence types enabled</div></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.evidenceRequired !== false} onChange={(e) => onChange('evidenceRequired', e.target.checked)} className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span className="text-sm font-medium text-purple-900">Required for completion</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidenceItems.map((item) => (
            <div key={item.id} className={`p-4 border-2 rounded-xl transition-all ${item.enabled ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.enabled ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <button onClick={() => toggleEvidence(item.id)} className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${item.enabled ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`}>{item.enabled && <Check className="w-4 h-4" />}</button>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                  {item.enabled && (
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                      <div className="flex-1"><select value={item.when} className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"><option value="before">Before service</option><option value="during">During service</option><option value="after">After service</option><option value="any">Any time</option></select></div>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={item.required} onChange={() => toggleRequired(item.id)} className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-xs text-gray-600">Required</span></label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Photo Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Photos Required</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="1">At least 1</option><option value="2">At least 2</option><option value="3">At least 3</option><option value="5">At least 5</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Photo Quality</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="standard">Standard</option><option value="high">High Resolution</option><option value="compressed">Compressed</option></select></div>
          </div>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Add timestamp watermark to photos</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Add location watermark to photos</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" /><span className="text-sm text-gray-700">Allow photo from gallery (not just camera)</span></label>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg flex gap-3"><span className="text-lg">💡</span><div className="text-sm text-blue-800"><strong>Pro tip:</strong> Before/After photos help resolve disputes and build customer trust. GPS tracking helps verify service location for on-site visits.</div></div>
      </div>
    </div>
  );
};

export default EvidenceStep;
