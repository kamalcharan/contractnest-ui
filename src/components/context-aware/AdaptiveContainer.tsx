// src/components/context-aware/AdaptiveContainer.tsx
import React, { ReactNode } from 'react';
import { useContextEngine } from '../../context/ContextEngine';

interface AdaptiveContainerProps {
  children: ReactNode;
  beginnerView?: ReactNode;
  intermediateView?: ReactNode;
  advancedView?: ReactNode;
  defaultView?: ReactNode;
}

const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({
  children,
  beginnerView,
  intermediateView,
  advancedView,
  defaultView
}) => {
  const { contextState } = useContextEngine();
  
  // Render different views based on expertise
  switch(contextState.userExpertise) {
    case 'beginner':
      return <>{beginnerView || defaultView || children}</>;
    case 'intermediate':
      return <>{intermediateView || defaultView || children}</>;
    case 'advanced':
      return <>{advancedView || defaultView || children}</>;
    default:
      return <>{defaultView || children}</>;
  }
};