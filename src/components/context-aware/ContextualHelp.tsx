// src/components/context-aware/ContextualHelp.tsx
import React from 'react';
import { useContextEngine } from '../../context/ContextEngine';

interface ContextualHelpProps {
  elementId: string;
  topic?: string;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({ elementId, topic }) => {
  const { contextState } = useContextEngine();
  
  // Only show detailed help for beginners
  if (contextState.userExpertise === 'advanced' && !topic) {
    return null;
  }
  
  // Get help content based on context
  const helpContent = getHelpContent(
    elementId, 
    topic, 
    contextState.currentContext,
    contextState.userExpertise
  );
  
  if (!helpContent) return null;
  
  return (
    <div className="text-sm bg-muted/30 p-3 rounded-md mt-1 text-muted-foreground">
      {helpContent}
    </div>
  );
};