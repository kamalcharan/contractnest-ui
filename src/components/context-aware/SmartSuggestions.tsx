// src/components/context-aware/SmartSuggestions.tsx
import React, { useState, useEffect } from 'react';
import { useContextEngine } from '../../context/ContextEngine';

interface SmartSuggestionsProps {
  entityType: 'contract' | 'appointment' | 'contact';
  currentInput?: string;
  onSuggestionSelect: (suggestion: string) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  entityType,
  currentInput = '',
  onSuggestionSelect
}) => {
  const { contextState } = useContextEngine();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    // This would call the AI service to get appropriate suggestions
    // based on current context, input, and user history
    const fetchSuggestions = async () => {
      const response = await getContextAwareSuggestions(
        entityType,
        currentInput,
        contextState
      );
      setSuggestions(response);
    };
    
    if (currentInput.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [entityType, currentInput, contextState]);
  
  return (
    <div className="mt-2">
      {suggestions.length > 0 && (
        <div className="bg-muted rounded-md border border-border p-2">
          <h4 className="text-xs font-medium mb-2">Suggestions</h4>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left text-sm p-2 hover:bg-primary/10 rounded-md"
                onClick={() => onSuggestionSelect(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};