// src/components/TaxSettings/TaxDisplayPanel.tsx
// Panel component for tax display settings (display_mode configuration)

import { useState, useEffect } from 'react';
import { Loader2, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// Import types
import type { 
  UseTaxDisplayReturn, 
  TaxDisplayFormData,
  DISPLAY_MODE_OPTIONS 
} from '@/types/taxSettings';

interface TaxDisplayPanelProps {
  hook: UseTaxDisplayReturn;
  onError?: (error: string) => void;
}

const TaxDisplayPanel = ({ hook, onError }: TaxDisplayPanelProps) => {
  const { state, updateDisplayMode, resetChanges } = hook;

  // Local form state
  const [selectedMode, setSelectedMode] = useState<'including_tax' | 'excluding_tax'>('excluding_tax');
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Display mode options (matching your reference UI)
  const displayModeOptions = [
    {
      value: 'excluding_tax' as const,
      label: 'Excluding tax',
      description: 'Show prices without tax included'
    },
    {
      value: 'including_tax' as const,
      label: 'Including tax', 
      description: 'Show prices with tax included'
    }
  ];

  // Sync form state with hook data
  useEffect(() => {
    if (state.data) {
      setSelectedMode(state.data.display_mode);
      setHasLocalChanges(false);
    }
  }, [state.data]);

  // Handle mode change
  const handleModeChange = (mode: 'including_tax' | 'excluding_tax') => {
    setSelectedMode(mode);
    setHasLocalChanges(state.data?.display_mode !== mode);
  };

  // Handle save
  const handleSave = async () => {
    if (!hasLocalChanges) {
      toast('No changes to save', {
        duration: 2000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#6B7280',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    try {
      await updateDisplayMode(selectedMode);
      
      // SUCCESS TOAST
      toast.success(`Tax display mode changed to "${selectedMode === 'including_tax' ? 'Including tax' : 'Excluding tax'}"`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      
      setHasLocalChanges(false);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to save tax display settings';
      onError?.(errorMessage);
      
      // ERROR TOAST
      toast.error(`Save Failed: ${errorMessage}`, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
    }
  };

  // Handle reset
  const handleReset = () => {
    if (state.data) {
      setSelectedMode(state.data.display_mode);
      setHasLocalChanges(false);
      resetChanges();
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await hook.refresh();
      setHasLocalChanges(false);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to refresh tax display settings';
      onError?.(errorMessage);
    }
  };

  // LOADING STATE
  if (state.loading) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading tax display settings...</span>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="text-center py-8">
          <div className="text-destructive font-medium mb-2">
            Failed to load tax display settings
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {state.error}
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            disabled={state.loading}
          >
            {state.loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Try Again'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel Title - LOADING INDICATOR ADDED */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tax Display</h2>
          <p className="text-muted-foreground">
            How prices are displayed on the proposal pricing page
          </p>
        </div>
        
        {/* LOADING INDICATOR */}
        {state.saving && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      {/* Main Settings Card */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="space-y-6">
          {/* Sales Tax Display Section */}
          <div>
            <Label className="text-base font-medium">Sales tax display</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Show prices with or without tax
            </p>
          </div>

          {/* Display Mode Options */}
          <div className="space-y-3">
            {displayModeOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  selectedMode === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                  state.saving && "opacity-60 cursor-not-allowed"
                )}
                onClick={() => !state.saving && handleModeChange(option.value)}
              >
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5",
                  selectedMode === option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground"
                )}>
                  {selectedMode === option.value && (
                    state.saving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Display Mode Information
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                This setting affects how prices appear throughout your proposals and invoices. 
                You can change this setting at any time.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              {hasLocalChanges && (
                <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                  You have unsaved changes
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {hasLocalChanges && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={state.saving}
                >
                  Reset
                </Button>
              )}
              
              <Button
                onClick={handleSave}
                disabled={!hasLocalChanges || state.saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {state.saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Configuration Summary */}
      {state.data && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm font-medium mb-2">Current Configuration</div>
          <div className="text-sm text-muted-foreground">
            <div>Display Mode: <span className="font-medium">
              {state.data.display_mode === 'including_tax' ? 'Including tax' : 'Excluding tax'}
            </span></div>
            {state.data.default_tax_rate_id && (
              <div>Default Tax Rate: <span className="font-medium">
                {state.data.default_tax_rate_id}
              </span></div>
            )}
            <div>Last Updated: <span className="font-medium">
              {new Date(state.data.updated_at).toLocaleString()}
            </span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxDisplayPanel;