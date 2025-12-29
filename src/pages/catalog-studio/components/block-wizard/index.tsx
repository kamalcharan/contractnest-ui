// src/pages/catalog-studio/components/block-wizard/index.tsx
import React, { useState } from 'react';
import { Block, WizardMode } from '../../types';
import { BLOCK_CATEGORIES } from '../../data/categories';
import { WIZARD_STEPS } from '../../data/wizard-steps';
import WizardHeader from './wizard-header';
import WizardProgress from './wizard-progress';
import WizardFooter from './wizard-footer';
import { TypeSelectionStep, BasicInfoStep, DeliveryStep, PricingStep, EvidenceStep, RulesStep } from './steps';

interface BlockWizardProps {
  isOpen: boolean;
  mode: WizardMode;
  blockType: string;
  editingBlock?: Block | null;
  onClose: () => void;
  onSave: (block: Partial<Block>) => void;
  onBlockTypeChange: (type: string) => void;
}

const BlockWizard: React.FC<BlockWizardProps> = ({
  isOpen, mode, blockType, editingBlock, onClose, onSave, onBlockTypeChange,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Block>>(editingBlock || {});

  const wizardSteps = WIZARD_STEPS[blockType] || WIZARD_STEPS.service;
  const totalSteps = wizardSteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSave(formData);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
  };

  const handleFormChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (type: string) => {
    onBlockTypeChange(type);
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    if (currentStep === 1) {
      return <TypeSelectionStep categories={BLOCK_CATEGORIES} selectedType={blockType} onSelectType={handleTypeChange} />;
    }
    if (currentStep === 2) {
      return <BasicInfoStep blockType={blockType} formData={formData} onChange={handleFormChange} />;
    }
    if (blockType === 'service') {
      switch (currentStep) {
        case 3: return <DeliveryStep formData={formData} onChange={handleFormChange} />;
        case 4: return <PricingStep formData={formData} onChange={handleFormChange} />;
        case 5: return <EvidenceStep formData={formData} onChange={handleFormChange} />;
        case 6: return <RulesStep formData={formData} onChange={handleFormChange} />;
      }
    }
    const stepLabel = wizardSteps.find((s) => s.id === currentStep)?.label || 'Configuration';
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-200">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{stepLabel}</h2>
        <p className="text-sm text-gray-500 mb-6">Configure settings for this block.</p>
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
          <div className="text-4xl mb-3">🚧</div>
          <div className="text-lg font-semibold text-gray-700">Step {currentStep} Configuration</div>
          <div className="text-sm text-gray-500 mt-1">{stepLabel} settings will be available soon</div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <WizardHeader mode={mode} blockType={blockType} categories={BLOCK_CATEGORIES} onClose={onClose} />
        <WizardProgress steps={wizardSteps} currentStep={currentStep} />
        <div className="flex-1 overflow-y-auto p-6">{renderStepContent()}</div>
        <WizardFooter currentStep={currentStep} totalSteps={totalSteps} onPrevious={handlePrevious} onNext={handleNext} onSaveDraft={handleSaveDraft} />
      </div>
    </div>
  );
};

export default BlockWizard;
