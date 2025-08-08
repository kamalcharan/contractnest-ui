// src/contexts/ABTestContext.tsx
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { ABTestConfig, ExperimentVariant, UserSession } from '../types/cro.types';
import { CROUtils } from '../utils/helpers/cro.utils';

interface ABTestState {
  experiments: Record<string, ABTestConfig>;
  userAssignments: Record<string, string>; // experimentId -> variantId
  isLoading: boolean;
  error: string | null;
}

type ABTestAction =
  | { type: 'SET_EXPERIMENTS'; payload: ABTestConfig[] }
  | { type: 'ASSIGN_VARIANT'; payload: { experimentId: string; variantId: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'INITIALIZE_ASSIGNMENTS'; payload: Record<string, string> };

const initialState: ABTestState = {
  experiments: {},
  userAssignments: {},
  isLoading: true,
  error: null
};

function abTestReducer(state: ABTestState, action: ABTestAction): ABTestState {
  switch (action.type) {
    case 'SET_EXPERIMENTS':
      return {
        ...state,
        experiments: action.payload.reduce((acc, exp) => {
          acc[exp.experimentId] = exp;
          return acc;
        }, {} as Record<string, ABTestConfig>)
      };
    
    case 'ASSIGN_VARIANT':
      return {
        ...state,
        userAssignments: {
          ...state.userAssignments,
          [action.payload.experimentId]: action.payload.variantId
        }
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'INITIALIZE_ASSIGNMENTS':
      return { ...state, userAssignments: action.payload };
    
    default:
      return state;
  }
}

interface ABTestContextValue {
  state: ABTestState;
  getVariant: (experimentId: string) => ExperimentVariant | null;
  trackExperimentView: (experimentId: string, variantId: string) => void;
  trackConversion: (experimentId: string, conversionGoal: string, value?: number) => void;
  isExperimentActive: (experimentId: string) => boolean;
  getAllActiveExperiments: () => ABTestConfig[];
}

const ABTestContext = createContext<ABTestContextValue | undefined>(undefined);

// ContractNest specific A/B test configurations
const CONTRACTNEST_EXPERIMENTS: ABTestConfig[] = [
  {
    experimentId: 'hero_cta_test',
    name: 'Hero CTA Button Text',
    description: 'Test different CTA button texts in hero section',
    variants: [
      {
        id: 'control',
        name: 'Get Early Access',
        weight: 50,
        component: () => null, // Will be handled by components
        metadata: { buttonText: 'Get Early Access', color: 'red' }
      },
      {
        id: 'variant_a',
        name: 'Start Free Trial',
        weight: 25,
        component: () => null,
        metadata: { buttonText: 'Start Free Trial', color: 'red' }
      },
      {
        id: 'variant_b',
        name: 'Transform My Contracts',
        weight: 25,
        component: () => null,
        metadata: { buttonText: 'Transform My Contracts', color: 'blue' }
      }
    ],
    conversionGoals: ['demo_request', 'form_submit'],
    status: 'running',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-01')
  },
  
  {
    experimentId: 'pricing_display_test',
    name: 'Pricing Display Format',
    description: 'Test different ways to display the ₹250/contract pricing',
    variants: [
      {
        id: 'control',
        name: 'Standard Pricing',
        weight: 50,
        component: () => null,
        metadata: { 
          format: 'standard',
          emphasis: 'contract',
          showComparison: false
        }
      },
      {
        id: 'variant_savings',
        name: 'Savings Focused',
        weight: 50,
        component: () => null,
        metadata: { 
          format: 'savings',
          emphasis: 'savings',
          showComparison: true,
          comparisonText: 'vs ₹2000/user/month traditional software'
        }
      }
    ],
    conversionGoals: ['demo_request', 'pricing_click'],
    status: 'running'
  },

  {
    experimentId: 'social_proof_test',
    name: 'Social Proof Placement',
    description: 'Test different placements for customer testimonials',
    variants: [
      {
        id: 'control',
        name: 'Below Hero',
        weight: 33,
        component: () => null,
        metadata: { placement: 'below_hero', style: 'carousel' }
      },
      {
        id: 'variant_sidebar',
        name: 'Floating Sidebar',
        weight: 33,
        component: () => null,
        metadata: { placement: 'floating_sidebar', style: 'card' }
      },
      {
        id: 'variant_inline',
        name: 'Inline with Features',
        weight: 34,
        component: () => null,
        metadata: { placement: 'inline_features', style: 'quotes' }
      }
    ],
    conversionGoals: ['demo_request', 'testimonial_click'],
    status: 'running'
  },

  {
    experimentId: 'form_fields_test',
    name: 'Lead Form Fields',
    description: 'Test different form field combinations for lead generation',
    variants: [
      {
        id: 'control',
        name: 'Email + Company',
        weight: 50,
        component: () => null,
        metadata: { 
          fields: ['email', 'company'],
          optional: [],
          layout: 'vertical'
        }
      },
      {
        id: 'variant_extended',
        name: 'Email + Company + Phone + Industry',
        weight: 50,
        component: () => null,
        metadata: { 
          fields: ['email', 'company', 'phone', 'industry'],
          optional: ['phone'],
          layout: 'grid'
        }
      }
    ],
    conversionGoals: ['form_submit', 'demo_request'],
    status: 'running'
  }
];

interface ABTestProviderProps {
  children: React.ReactNode;
  experiments?: ABTestConfig[];
  userId?: string;
  enableAnalytics?: boolean;
}

export const ABTestProvider: React.FC<ABTestProviderProps> = ({
  children,
  experiments = CONTRACTNEST_EXPERIMENTS,
  userId,
  enableAnalytics = true
}) => {
  const [state, dispatch] = useReducer(abTestReducer, initialState);

  // Initialize experiments and user assignments
  useEffect(() => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Set available experiments
      const activeExperiments = experiments.filter(exp => 
        exp.status === 'running' && 
        (!exp.endDate || exp.endDate > new Date())
      );
      
      dispatch({ type: 'SET_EXPERIMENTS', payload: activeExperiments });

      // Load existing assignments from storage
      const existingSession = CROUtils.getSessionData();
      if (existingSession?.experiments) {
        dispatch({ type: 'INITIALIZE_ASSIGNMENTS', payload: existingSession.experiments });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Failed to initialize A/B tests:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize experiments' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [experiments]);

  // Get variant for an experiment
  const getVariant = useCallback((experimentId: string): ExperimentVariant | null => {
    try {
      const experiment = state.experiments[experimentId];
      if (!experiment || experiment.status !== 'running') {
        return null;
      }

      // Check if user already has an assignment
      const existingAssignment = state.userAssignments[experimentId];
      if (existingAssignment) {
        const variant = experiment.variants.find(v => v.id === existingAssignment);
        if (variant) return variant;
      }

      // Assign new variant
      const selectedVariant = CROUtils.selectVariant(experiment.variants, userId);
      
      // Store assignment
      dispatch({
        type: 'ASSIGN_VARIANT',
        payload: { experimentId, variantId: selectedVariant.id }
      });

      // Update session storage
      const session = CROUtils.getSessionData();
      if (session) {
        session.experiments[experimentId] = selectedVariant.id;
        CROUtils.storeSessionData(session);
      }

      // Track experiment view
      if (enableAnalytics) {
        trackExperimentView(experimentId, selectedVariant.id);
      }

      return selectedVariant;
    } catch (error) {
      console.error('Failed to get variant:', error);
      // Return control variant as fallback
      const experiment = state.experiments[experimentId];
      return experiment?.variants[0] || null;
    }
  }, [state.experiments, state.userAssignments, userId, enableAnalytics]);

  // Track experiment view
  const trackExperimentView = useCallback((experimentId: string, variantId: string) => {
    if (!enableAnalytics) return;

    try {
      const experiment = state.experiments[experimentId];
      const variant = experiment?.variants.find(v => v.id === variantId);

      if (typeof gtag !== 'undefined') {
        gtag('event', 'experiment_view', {
          event_category: 'ab_test',
          event_label: `${experimentId}_${variantId}`,
          experiment_id: experimentId,
          variant_id: variantId,
          variant_name: variant?.name,
          experiment_name: experiment?.name
        });
      }

      // Google Tag Manager
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'experiment_view',
          experimentData: {
            experiment_id: experimentId,
            variant_id: variantId,
            variant_name: variant?.name,
            experiment_name: experiment?.name
          }
        });
      }
    } catch (error) {
      console.warn('Failed to track experiment view:', error);
    }
  }, [state.experiments, enableAnalytics]);

  // Track conversion for experiment
  const trackConversion = useCallback((experimentId: string, conversionGoal: string, value?: number) => {
    if (!enableAnalytics) return;

    try {
      const experiment = state.experiments[experimentId];
      const variantId = state.userAssignments[experimentId];
      const variant = experiment?.variants.find(v => v.id === variantId);

      if (!experiment || !variantId || !variant) return;

      // Check if this is a valid conversion goal for the experiment
      if (!experiment.conversionGoals.includes(conversionGoal)) return;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'experiment_conversion', {
          event_category: 'ab_test',
          event_label: `${experimentId}_${variantId}_${conversionGoal}`,
          value: value,
          experiment_id: experimentId,
          variant_id: variantId,
          variant_name: variant.name,
          conversion_goal: conversionGoal
        });
      }

      // Google Tag Manager
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'experiment_conversion',
          experimentData: {
            experiment_id: experimentId,
            variant_id: variantId,
            variant_name: variant.name,
            conversion_goal: conversionGoal,
            value: value
          }
        });
      }
    } catch (error) {
      console.warn('Failed to track experiment conversion:', error);
    }
  }, [state.experiments, state.userAssignments, enableAnalytics]);

  // Check if experiment is active
  const isExperimentActive = useCallback((experimentId: string): boolean => {
    const experiment = state.experiments[experimentId];
    if (!experiment) return false;

    const now = new Date();
    const isWithinDateRange = (!experiment.startDate || experiment.startDate <= now) &&
                              (!experiment.endDate || experiment.endDate >= now);
    
    return experiment.status === 'running' && isWithinDateRange;
  }, [state.experiments]);

  // Get all active experiments
  const getAllActiveExperiments = useCallback((): ABTestConfig[] => {
    return Object.values(state.experiments).filter(exp => isExperimentActive(exp.experimentId));
  }, [state.experiments, isExperimentActive]);

  const contextValue: ABTestContextValue = {
    state,
    getVariant,
    trackExperimentView,
    trackConversion,
    isExperimentActive,
    getAllActiveExperiments
  };

  return (
    <ABTestContext.Provider value={contextValue}>
      {children}
    </ABTestContext.Provider>
  );
};

// Hook to use A/B test context
export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};

// src/components/ABTest/ExperimentComponent.tsx
import React from 'react';
import { useABTest } from '../../contexts/ABTestContext';

interface ExperimentComponentProps {
  experimentId: string;
  fallback?: React.ReactNode;
  children?: (variant: any) => React.ReactNode;
  onVariantSelected?: (variantId: string, metadata: any) => void;
}

export const ExperimentComponent: React.FC<ExperimentComponentProps> = ({
  experimentId,
  fallback = null,
  children,
  onVariantSelected
}) => {
  const { getVariant, isExperimentActive } = useABTest();

  // Don't run experiment if not active
  if (!isExperimentActive(experimentId)) {
    return <>{fallback}</>;
  }

  const variant = getVariant(experimentId);
  
  if (!variant) {
    return <>{fallback}</>;
  }

  // Notify parent component of variant selection
  React.useEffect(() => {
    if (onVariantSelected && variant) {
      onVariantSelected(variant.id, variant.metadata);
    }
  }, [variant, onVariantSelected]);

  // If children is a function, call it with variant data
  if (typeof children === 'function') {
    return <>{children(variant)}</>;
  }

  // Otherwise render the variant's component
  const VariantComponent = variant.component;
  return <VariantComponent {...variant.metadata} />;
};

