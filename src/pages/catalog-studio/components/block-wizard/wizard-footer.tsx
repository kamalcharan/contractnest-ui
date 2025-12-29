// src/pages/catalog-studio/components/block-wizard/wizard-footer.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

const WizardFooter: React.FC<WizardFooterProps> = ({ currentStep, totalSteps, onPrevious, onNext, onSaveDraft }) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-white">
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
          isFirstStep ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      <div className="flex gap-3">
        <button
          onClick={onSaveDraft}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
        >
          {isLastStep ? 'Save Block' : 'Continue'}
          {!isLastStep && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default WizardFooter;
