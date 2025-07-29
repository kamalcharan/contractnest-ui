// src/pages/settings/TaxSettings/index.tsx
// Main Tax Settings page following LOV methodology with two-panel layout

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { analyticsService } from '@/services/analytics.service';
import { captureException } from '@/utils/sentry';

// Import components
import TaxDisplayPanel from '@/components/TaxSettings/TaxDisplayPanel';
import TaxRatesPanel from '@/components/TaxSettings/TaxRatesPanel';

// Import hooks
import { useTaxDisplay } from '@/hooks/useTaxDisplay';
import { useTaxRates } from '@/hooks/useTaxRates';

// Import types
import type { TaxSection } from '@/types/taxSettings';
import { TAX_SECTIONS } from '@/types/taxSettings';

const TaxSettingsPage = () => {
  const navigate = useNavigate();
  const { currentTenant } = useAuth();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();

  // Local state for section navigation
  const [activeSection, setActiveSection] = useState<TaxSection>('tax-display');
  const [initialLoading, setInitialLoading] = useState(true);

  // Initialize hooks
  const taxDisplayHook = useTaxDisplay();
  const taxRatesHook = useTaxRates();

  // Track page view
  useEffect(() => {
    try {
      analyticsService.trackPageView('settings/tax-settings', 'Tax Settings');
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  // Handle initial loading state
  useEffect(() => {
    // Wait for both hooks to finish initial loading
    const displayLoading = taxDisplayHook.state.loading;
    const ratesLoading = taxRatesHook.state.loading;
    
    if (!displayLoading && !ratesLoading) {
      setInitialLoading(false);
    }
  }, [taxDisplayHook.state.loading, taxRatesHook.state.loading]);

  // Handle section change
  const handleSectionChange = (sectionId: TaxSection) => {
    console.log('Changing tax settings section to:', sectionId);
    setActiveSection(sectionId);
    
    try {
      analyticsService.trackPageView(
        `settings/tax-settings/${sectionId}`, 
        `Tax Settings - ${sectionId === 'tax-display' ? 'Display' : 'Rates'}`
      );
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // Handle navigation back
  const handleGoBack = () => {
    navigate('/settings/configure');
  };

  // Get section configuration
  const getSectionConfig = (sectionId: TaxSection) => {
    return TAX_SECTIONS.find(section => section.id === sectionId);
  };

  // Check if there are any errors
  const hasErrors = taxDisplayHook.state.error || taxRatesHook.state.error;

  // Check if anything is saving
  const isSaving = taxDisplayHook.state.saving || taxRatesHook.state.saving;

  // Show initial loading spinner
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-muted/20">
      {/* Header - Following LOV pattern */}
      <div className="flex items-center mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            Tax Settings
          </h1>
          <p className="text-muted-foreground">
            Configure tax display and manage tax rates
          </p>
        </div>
        
        {/* Save indicator */}
        {isSaving && (
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>

      {/* Two-panel layout - Following LOV methodology */}
      <div className="flex gap-6">
        {/* Left Panel - Section Navigation */}
        <div className="w-64 shrink-0">
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            {TAX_SECTIONS.map((section, index) => {
              const isSelected = activeSection === section.id;
              const isFirst = index === 0;
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left border-b border-border last:border-0 transition-colors",
                    isSelected 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "hover:bg-muted",
                    // Apply special styles for the first item
                    isFirst && !isSelected && "bg-muted/50"
                  )}
                >
                  <div className="font-medium">{section.label}</div>
                  <div className={cn(
                    "text-sm mt-1",
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {section.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error indicator in left panel */}
          {hasErrors && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="text-sm text-destructive font-medium">
                Configuration Error
              </div>
              <div className="text-xs text-destructive/80 mt-1">
                Please check the settings and try again
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Content Area */}
        <div className="flex-1">
          {activeSection === 'tax-display' && (
            <TaxDisplayPanel
              hook={taxDisplayHook}
              onError={(error) => {
                console.error('Tax display panel error:', error);
                captureException(new Error(error), {
                  tags: { component: 'TaxSettingsPage', panel: 'display' }
                });
              }}
            />
          )}
          
          {activeSection === 'tax-rates' && (
            <TaxRatesPanel
              hook={taxRatesHook}
              onError={(error) => {
                console.error('Tax rates panel error:', error);
                captureException(new Error(error), {
                  tags: { component: 'TaxSettingsPage', panel: 'rates' }
                });
              }}
            />
          )}
        </div>
      </div>

      {/* Debug information (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
        
         
        </div>
      )}
    </div>
  );
};

export default TaxSettingsPage;