// src/pages/contracts/create/index.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  X,
  CheckCircle,
  Circle,
  Clock,
  FileText,
  Users,
  Settings,
  Calendar,
  DollarSign,
  Send
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import types
import { ContractType } from '../../../types/contracts/contract';
import { Template } from '../../../types/contracts/template';

// Import step components
import TemplatesStep from './templates';

// Placeholder step components - will be replaced with actual implementations
const ContractTypeStep = ({ onTemplateSelect }: { onTemplateSelect?: (template: Template) => void }) => (
  <div className="p-8 bg-card rounded-lg border border-border">
    <h2 className="text-xl font-semibold mb-4 text-foreground">Contract Type Selection</h2>
    <p className="text-muted-foreground">Choose between Service Contract or Partnership Contract</p>
    <div className="mt-4 text-sm text-muted-foreground">
      Component: ContractTypeStep (placeholder)
    </div>
  </div>
);

const RecipientStep = ({ onTemplateSelect }: { onTemplateSelect?: (template: Template) => void }) => (
  <div className="p-8 bg-card rounded-lg border border-border">
    <h2 className="text-xl font-semibold mb-4 text-foreground">Recipient Selection</h2>
    <p className="text-muted-foreground">Choose the contract recipient from your contacts</p>
    <div className="mt-4 text-sm text-muted-foreground">
      Component: RecipientStep (placeholder)
    </div>
  </div>
);

const AcceptanceStep = ({ onTemplateSelect }: { onTemplateSelect?: (template: Template) => void }) => (
  <div className="p-8 bg-card rounded-lg border border-border">
    <h2 className="text-xl font-semibold mb-4 text-foreground">Acceptance Criteria</h2>
    <p className="text-muted-foreground">Define how the contract will be accepted</p>
    <div className="mt-4 text-sm text-muted-foreground">
      Component: AcceptanceStep (placeholder)
    </div>
  </div>
);

const BuilderStep = ({ onTemplateSelect }: { onTemplateSelect?: (template: Template) => void }) => (
  <div className="p-8 bg-card rounded-lg border border-border">
    <h2 className="text-xl font-semibold mb-4 text-foreground">Contract Builder</h2>
    <p className="text-muted-foreground">Add and configure contract blocks</p>
    <div className="mt-4 text-sm text-muted-foreground">
      Component: BuilderStep (placeholder)
    </div>
  </div>
);

const TimelineStep = ({ onTemplateSelect }: { onTemplateSelect?: (template: Template) => void }) => (
  <div className="p-8 bg-card rounded-lg border border-border">
    <h2 className="text-xl font-semibold mb-4 text-foreground">Timeline Preview</h2>
    <p className="text-muted-foreground">Review contract timeline and events</p>
    <div className="mt-4 text-sm text-muted-foreground">
      Component: TimelineStep (placeholder)
    </div>
  </div>
);

const BillingStep = ({ onTemplateSelect }: { onTemplateSelect?: (template: Template) => void }) => (
  <div className="p-8 bg-card rounded-lg border border-border">
    <h2 className="text-xl font-semibold mb-4 text-foreground">Billing Configuration</h2>
    <p className="text-muted-foreground">Configure billing rules and payment terms</p>
    <div className="mt-4 text-sm text-muted-foreground">
      Component: BillingStep (placeholder)
    </div>
  </div>
);

const ReviewStep = ({ onTemplateSelect }: { onTemplateSelect?: (template: Template) => void }) => (
  <div className="p-8 bg-card rounded-lg border border-border">
    <h2 className="text-xl font-semibold mb-4 text-foreground">Review Contract</h2>
    <p className="text-muted-foreground">Review all contract details before sending</p>
    <div className="mt-4 text-sm text-muted-foreground">
      Component: ReviewStep (placeholder)
    </div>
  </div>
);

const SendStep = ({ onTemplateSelect }: { onTemplateSelect?: (template: Template) => void }) => (
  <div className="p-8 bg-card rounded-lg border border-border">
    <h2 className="text-xl font-semibold mb-4 text-foreground">Send Contract</h2>
    <p className="text-muted-foreground">Send the contract to the recipient</p>
    <div className="mt-4 text-sm text-muted-foreground">
      Component: SendStep (placeholder)
    </div>
  </div>
);

// Types
interface ContractBuilderState {
  // Basic contract info
  contractType: ContractType | null;
  templateId: string | null;
  templateName: string | null;
  contractName: string;
  
  // Contact/Recipient info
  recipientId: string | null;
  recipientType: 'customer' | 'partner' | null;
  
  // Contract details
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  
  // Blocks and configuration
  selectedBlocks: any[];
  blockConfigurations: Record<string, any>;
  
  // Acceptance criteria
  acceptanceCriteria: {
    type: 'payment' | 'signature' | 'auto';
    requiresPayment: boolean;
    requiresSignature: boolean;
    autoAccept: boolean;
    paymentAmount?: number;
  };
  
  // Billing and commercial
  billingRules: any[];
  revenueSharing: any[];
  
  // Template selection
  selectedTemplate: Template | null;
  
  // Meta
  isDraft: boolean;
  lastSaved: Date | null;
  validationErrors: Record<string, string[]>;
}

interface ContractBuilderContextType {
  state: ContractBuilderState;
  updateState: (updates: Partial<ContractBuilderState>) => void;
  resetState: () => void;
  saveDraft: () => Promise<void>;
  validateCurrentStep: () => boolean;
  getStepErrors: (step: number) => string[];
}

// Initial state
const initialState: ContractBuilderState = {
  contractType: null,
  templateId: null,
  templateName: null,
  contractName: '',
  recipientId: null,
  recipientType: null,
  startDate: null,
  endDate: null,
  description: '',
  selectedBlocks: [],
  blockConfigurations: {},
  acceptanceCriteria: {
    type: 'signature',
    requiresPayment: false,
    requiresSignature: true,
    autoAccept: false
  },
  billingRules: [],
  revenueSharing: [],
  selectedTemplate: null,
  isDraft: true,
  lastSaved: null,
  validationErrors: {}
};

// Context
const ContractBuilderContext = createContext<ContractBuilderContextType | null>(null);

export const useContractBuilder = () => {
  const context = useContext(ContractBuilderContext);
  if (!context) {
    throw new Error('useContractBuilder must be used within ContractBuilderProvider');
  }
  return context;
};

// Step configuration
const getStepConfig = (contractType: ContractType | null) => {
  const baseSteps = [
    {
      id: 'templates',
      title: 'Choose Template',
      description: 'Select a contract template',
      icon: FileText,
      component: TemplatesStep
    },
    {
      id: 'contract-type',
      title: 'Contract Type',
      description: 'Service or Partnership',
      icon: Settings,
      component: ContractTypeStep
    },
    {
      id: 'recipient',
      title: 'Recipient',
      description: 'Choose contract recipient',
      icon: Users,
      component: RecipientStep
    }
  ];

  if (contractType === 'partnership') {
    // Simplified flow for partnership
    return [
      ...baseSteps,
      {
        id: 'acceptance',
        title: 'Acceptance',
        description: 'Define acceptance criteria',
        icon: CheckCircle,
        component: AcceptanceStep
      },
      {
        id: 'review',
        title: 'Review',
        description: 'Review contract details',
        icon: FileText,
        component: ReviewStep
      },
      {
        id: 'send',
        title: 'Send',
        description: 'Send to recipient',
        icon: Send,
        component: SendStep
      }
    ];
  }

  // Full flow for service contracts
  return [
    ...baseSteps,
    {
      id: 'acceptance',
      title: 'Acceptance',
      description: 'Define acceptance criteria',
      icon: CheckCircle,
      component: AcceptanceStep
    },
    {
      id: 'builder',
      title: 'Contract Builder',
      description: 'Add and configure blocks',
      icon: Settings,
      component: BuilderStep
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Review timeline and events',
      icon: Calendar,
      component: TimelineStep
    },
    {
      id: 'billing',
      title: 'Billing',
      description: 'Configure billing rules',
      icon: DollarSign,
      component: BillingStep
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Review contract details',
      icon: FileText,
      component: ReviewStep
    },
    {
      id: 'send',
      title: 'Send',
      description: 'Send to recipient',
      icon: Send,
      component: SendStep
    }
  ];
};

const ContractCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  
  // Get contract type from URL params (for partnership flow)
  const contractTypeFromUrl = searchParams.get('type') as ContractType | null;
  
  // State
  const [state, setState] = useState<ContractBuilderState>({
    ...initialState,
    contractType: contractTypeFromUrl
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get step configuration based on contract type
  const steps = getStepConfig(state.contractType);
  const CurrentStepComponent = steps[currentStep]?.component;

  // Context value
  const contextValue: ContractBuilderContextType = {
    state,
    updateState: (updates) => {
      setState(prev => ({ ...prev, ...updates }));
    },
    resetState: () => {
      setState(initialState);
      setCurrentStep(0);
    },
    saveDraft: async () => {
      try {
        setIsLoading(true);
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          lastSaved: new Date(),
          isDraft: true
        }));
        
        toast({
          title: "Draft saved",
          description: "Your contract has been saved as draft"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Failed to save draft. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    },
    validateCurrentStep: () => {
      // TODO: Implement step-specific validation
      return true;
    },
    getStepErrors: (step: number) => {
      // TODO: Return validation errors for specific step
      return [];
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (state.contractName || state.templateId) {
        contextValue.saveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [state.contractName, state.templateId]);

  // Handle step navigation
  const canGoNext = () => {
    return currentStep < steps.length - 1 && contextValue.validateCurrentStep();
  };

  const canGoPrevious = () => {
    return currentStep > 0;
  };

  const handleNext = async () => {
    if (canGoNext()) {
      await contextValue.saveDraft();
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleExit = async () => {
    if (state.isDraft && (state.contractName || state.templateId)) {
      await contextValue.saveDraft();
    }
    navigate('/contracts');
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <ContractBuilderContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleExit}
                  className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground"
                  title="Exit contract builder"
                >
                  <X className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    {state.contractName || 'New Contract'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {state.templateName || 'Contract Builder'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Auto-save indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : state.lastSaved ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Saved {new Date(state.lastSaved).toLocaleTimeString()}
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" />
                      Not saved
                    </>
                  )}
                </div>

                {/* Manual save button */}
                <button
                  onClick={contextValue.saveDraft}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition-colors text-sm border-input text-foreground disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="border-b bg-card border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8 overflow-x-auto">
                {steps.map((step, index) => {
                  const status = getStepStatus(index);
                  const IconComponent = step.icon;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      disabled={index > currentStep}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors min-w-0 ${
                        status === 'current' 
                          ? 'bg-primary text-primary-foreground' 
                          : status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/30'
                          : 'text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      <IconComponent className={`h-4 w-4 flex-shrink-0 ${
                        status === 'completed' ? 'text-green-600 dark:text-green-400' : ''
                      }`} />
                      <div className="min-w-0 text-left hidden sm:block">
                        <div className="text-sm font-medium truncate">
                          {step.title}
                        </div>
                        <div className="text-xs opacity-80 truncate">
                          {step.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Step counter for mobile */}
              <div className="text-sm text-muted-foreground sm:hidden">
                {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8 py-6">
          <div className="max-w-4xl mx-auto">
            {CurrentStepComponent && <CurrentStepComponent onTemplateSelect={handleTemplateSelect} />}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t bg-card border-border sticky bottom-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious()}
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-input text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>

              <button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContractBuilderContext.Provider>
  );
};

export default ContractCreatePage;