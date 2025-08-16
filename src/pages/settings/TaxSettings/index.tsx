// src/pages/settings/TaxSettings/index.tsx
// Main Tax Settings page following LOV methodology with two-panel layout

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
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
  const { isDarkMode, currentTheme } = useTheme();
  const { toast } = useToast();

  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

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
      <div 
        className="flex items-center justify-center min-h-[400px] transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <Loader2 
          className="h-8 w-8 animate-spin transition-colors" 
          style={{ color: colors.brand.primary }}
        />
      </div>
    );
  }

  return (
    <div 
      className="p-6 transition-colors duration-200 min-h-screen"
      style={{
        background: isDarkMode 
          ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
          : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
      }}
    >
      {/* Header - Following LOV pattern */}
      <div className="flex items-center mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="mr-4 transition-colors"
          style={{
            borderColor: colors.utility.secondaryText + '40',
            backgroundColor: colors.utility.secondaryBackground,
            color: colors.utility.primaryText
          }}
        >
          <ArrowLeft 
            className="h-5 w-5 transition-colors" 
            style={{ color: colors.utility.secondaryText }}
          />
        </Button>
        <div>
          <h1 
            className="text-2xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Tax Settings
          </h1>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Configure tax display and manage tax rates
          </p>
        </div>
        
        {/* Save indicator */}
        {isSaving && (
          <div 
            className="ml-auto flex items-center gap-2 text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <Loader2 
              className="h-4 w-4 animate-spin transition-colors"
              style={{ color: colors.brand.primary }}
            />
            Saving...
          </div>
        )}
      </div>

      {/* Two-panel layout - Following LOV methodology */}
      <div className="flex gap-6">
        {/* Left Panel - Section Navigation */}
        <div className="w-64 shrink-0">
          <div 
            className="rounded-lg shadow-sm border overflow-hidden transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            {TAX_SECTIONS.map((section, index) => {
              const isSelected = activeSection === section.id;
              const isFirst = index === 0;
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left border-b last:border-0 transition-colors",
                    isSelected 
                      ? "font-medium" 
                      : "hover:opacity-80"
                  )}
                  style={{
                    borderColor: colors.utility.primaryText + '20',
                    backgroundColor: isSelected 
                      ? colors.brand.primary
                      : isFirst && !isSelected 
                      ? colors.utility.primaryBackground + '50'
                      : 'transparent',
                    color: isSelected 
                      ? '#FFFFFF'
                      : colors.utility.primaryText
                  }}
                >
                  <div className="font-medium">{section.label}</div>
                  <div 
                    className="text-sm mt-1 transition-colors"
                    style={{
                      color: isSelected 
                        ? '#FFFFFF80'
                        : colors.utility.secondaryText
                    }}
                  >
                    {section.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error indicator in left panel */}
          {hasErrors && (
            <div 
              className="mt-4 p-3 border rounded-lg transition-colors"
              style={{
                backgroundColor: colors.semantic.error + '10',
                borderColor: colors.semantic.error + '20'
              }}
            >
              <div 
                className="text-sm font-medium transition-colors"
                style={{ color: colors.semantic.error }}
              >
                Configuration Error
              </div>
              <div 
                className="text-xs mt-1 transition-colors"
                style={{ color: colors.semantic.error + '80' }}
              >
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
        <div 
          className="mt-8 p-4 rounded-lg transition-colors"
          style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
        >
        
         
        </div>
      )}
    </div>
  );
};

export default TaxSettingsPage;