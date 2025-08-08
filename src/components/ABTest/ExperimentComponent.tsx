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

// src/components/ABTest/ABTestDebugPanel.tsx (Development only)
import React, { useState } from 'react';
import { useABTest } from '../../contexts/ABTestContext';

export const ABTestDebugPanel: React.FC = () => {
  const { state, getAllActiveExperiments } = useABTest();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    return null;
  }

  const activeExperiments = getAllActiveExperiments();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-purple-700"
      >
        A/B Tests ({activeExperiments.length})
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-3">Active A/B Tests</h3>
          
          {activeExperiments.length === 0 ? (
            <p className="text-gray-500 text-sm">No active experiments</p>
          ) : (
            <div className="space-y-3">
              {activeExperiments.map(experiment => {
                const assignedVariant = state.userAssignments[experiment.experimentId];
                const variant = experiment.variants.find(v => v.id === assignedVariant);
                
                return (
                  <div key={experiment.experimentId} className="border border-gray-100 rounded p-3">
                    <div className="font-medium text-sm text-gray-900">{experiment.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{experiment.description}</div>
                    
                    {variant && (
                      <div className="bg-purple-50 rounded px-2 py-1">
                        <span className="text-xs font-medium text-purple-700">
                          Variant: {variant.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-400">
                      Goals: {experiment.conversionGoals.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(false)}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ABTestProvider;