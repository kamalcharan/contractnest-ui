// src/pages/catalog-studio/components/block-wizard/wizard-progress.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { WizardStep } from '../../types';

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
}

const WizardProgress: React.FC<WizardProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div className={`w-8 h-0.5 transition-colors ${currentStep > index ? 'bg-green-500' : 'bg-gray-300'}`} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
              </div>
              {currentStep === step.id && (
                <span className="text-xs font-semibold text-purple-600">{step.label}</span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WizardProgress;
