// src/pages/catalog-studio/components/block-wizard/steps/service/delivery-step.tsx
import React, { useState } from 'react';
import { MapPin, Video, Users } from 'lucide-react';

interface DeliveryStepProps {
  formData: {
    deliveryMode?: 'on-site' | 'virtual' | 'hybrid';
    serviceArea?: string;
    requiresScheduling?: boolean;
    schedulingBuffer?: number;
    maxDistance?: number;
    allowReschedule?: boolean;
  };
  onChange: (field: string, value: unknown) => void;
}

const DeliveryStep: React.FC<DeliveryStepProps> = ({ formData, onChange }) => {
  const [deliveryMode, setDeliveryMode] = useState(formData.deliveryMode || 'on-site');

  const handleModeChange = (mode: 'on-site' | 'virtual' | 'hybrid') => {
    setDeliveryMode(mode);
    onChange('deliveryMode', mode);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-200">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Delivery Settings</h2>
      <p className="text-sm text-gray-500 mb-6">Configure how this service will be delivered to customers.</p>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">How is this service delivered? <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-3 gap-3">
            <div onClick={() => handleModeChange('on-site')} className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${deliveryMode === 'on-site' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
              <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-bold text-gray-900">On-Site</div>
              <div className="text-xs text-gray-500">At customer location</div>
            </div>
            <div onClick={() => handleModeChange('virtual')} className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${deliveryMode === 'virtual' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
              <Video className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-bold text-gray-900">Virtual</div>
              <div className="text-xs text-gray-500">Video call / Remote</div>
            </div>
            <div onClick={() => handleModeChange('hybrid')} className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${deliveryMode === 'hybrid' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-bold text-gray-900">Hybrid</div>
              <div className="text-xs text-gray-500">Both options available</div>
            </div>
          </div>
        </div>
        {(deliveryMode === 'on-site' || deliveryMode === 'hybrid') && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><MapPin className="w-4 h-4" /> On-Site Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
                <select defaultValue={formData.serviceArea || 'city'} onChange={(e) => onChange('serviceArea', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="local">Local (within 10km)</option>
                  <option value="city">City-wide</option>
                  <option value="region">Regional</option>
                  <option value="national">National</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance (km)</label>
                <input type="number" defaultValue={formData.maxDistance || 25} onChange={(e) => onChange('maxDistance', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked={true} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span className="text-sm text-gray-700">Capture GPS location at service start</span>
            </label>
          </div>
        )}
        {(deliveryMode === 'virtual' || deliveryMode === 'hybrid') && (
          <div className="p-4 bg-blue-50 rounded-lg space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Video className="w-4 h-4" /> Virtual Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Platform</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="zoom">Zoom</option>
                  <option value="meet">Google Meet</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="internal">In-app Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto-create Link</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="yes">Yes, auto-generate</option>
                  <option value="no">No, manual entry</option>
                </select>
              </div>
            </div>
          </div>
        )}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Scheduling Options</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked={formData.requiresScheduling !== false} onChange={(e) => onChange('requiresScheduling', e.target.checked)} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span className="text-sm text-gray-700">Requires appointment scheduling</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked={formData.allowReschedule !== false} onChange={(e) => onChange('allowReschedule', e.target.checked)} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span className="text-sm text-gray-700">Allow customer rescheduling</span>
            </label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Notice Period</label>
              <select defaultValue={formData.schedulingBuffer || 24} onChange={(e) => onChange('schedulingBuffer', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="0">No minimum</option>
                <option value="2">2 hours</option>
                <option value="6">6 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="weekdays">Weekdays only</option>
                <option value="all">All days</option>
                <option value="custom">Custom schedule</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStep;
    