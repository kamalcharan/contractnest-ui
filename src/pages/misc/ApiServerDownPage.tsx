// src/pages/misc/ApiServerDownPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Server, RefreshCw, Home } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';
import { checkApiHealth } from '../../services/api';

const ApiServerDownPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, currentTheme } = useTheme();
  
  // State for countdown timer
  const [countdown, setCountdown] = useState(30);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  useEffect(() => {
    analyticsService.trackMiscPageView('api-server-down', 'API Server Down', {
      attempted_path: location.state?.from?.pathname,
      last_error: location.state?.error
    });
  }, [location]);

  // Health check function
  const performHealthCheck = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    setLastChecked(new Date());
    
    try {
      analyticsService.trackMiscPageAction('api-server-down', 'health_check_attempted');
      
      const isHealthy = await checkApiHealth();
      
      if (isHealthy) {
        analyticsService.trackMiscPageAction('api-server-down', 'api_recovered');
        
        // API is back up - redirect to previous page or dashboard
        const returnPath = location.state?.from?.pathname || '/dashboard';
        navigate(returnPath, { replace: true });
        return;
      } else {
        analyticsService.trackMiscPageAction('api-server-down', 'health_check_failed');
        
        // Still down - reset countdown
        setCountdown(30);
      }
    } catch (error) {
      console.error('Health check error:', error);
      analyticsService.trackMiscPageAction('api-server-down', 'health_check_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Reset countdown on error
      setCountdown(30);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, navigate, location.state]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0 && !isChecking) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isChecking) {
      // Auto-retry when countdown reaches zero
      performHealthCheck();
    }
  }, [countdown, isChecking, performHealthCheck]);

  // Manual retry handler
  const handleManualRetry = () => {
    analyticsService.trackMiscPageAction('api-server-down', 'manual_retry_clicked');
    setCountdown(30); // Reset countdown
    performHealthCheck();
  };

  // Go to landing page handler
  const handleGoToLanding = () => {
    analyticsService.trackMiscPageAction('api-server-down', 'go_to_landing_clicked');
    navigate('/', { replace: true });
  };

  return (
    <MiscPageLayout
      icon={<Server className="h-16 w-16" style={{ color: colors.semantic.error }} />}
      title="Unable to Connect to Server"
      description="The server is currently unavailable. We're automatically checking for recovery."
      illustration="api-server-down"
      actions={[
        {
          label: isChecking ? 'Checking...' : 'Try Again',
          onClick: handleManualRetry,
          variant: 'primary',
          icon: <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />,
          disabled: isChecking
        },
        {
          label: 'Go to Landing Page',
          onClick: handleGoToLanding,
          variant: 'outline',
          icon: <Home className="h-4 w-4" />
        }
      ]}
    >
      <div className="mt-8 space-y-6">
        {/* Countdown Timer */}
        <div 
          className="text-center p-4 rounded-md border transition-colors"
          style={{
            backgroundColor: colors.brand.primary + '10',
            borderColor: colors.brand.primary + '30'
          }}
        >
          {isChecking ? (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw 
                className="h-5 w-5 animate-spin"
                style={{ color: colors.brand.primary }}
              />
              <span 
                className="text-sm font-medium transition-colors"
                style={{ color: colors.brand.primary }}
              >
                Checking server status...
              </span>
            </div>
          ) : (
            <div>
              <p 
                className="text-sm font-medium transition-colors"
                style={{ color: colors.brand.primary }}
              >
                Automatic retry in {countdown} seconds
              </p>
              {lastChecked && (
                <p 
                  className="text-xs mt-1 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Last checked: {lastChecked.toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="text-center space-y-3">
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <p className="font-medium mb-2" style={{ color: colors.utility.primaryText }}>
              What's happening:
            </p>
            <ul className="space-y-1 text-left max-w-md mx-auto">
              <li className="flex items-start">
                <span 
                  className="mr-2 font-medium"
                  style={{ color: colors.utility.primaryText }}
                >
                  •
                </span>
                The server may be temporarily down for maintenance
              </li>
              <li className="flex items-start">
                <span 
                  className="mr-2 font-medium"
                  style={{ color: colors.utility.primaryText }}
                >
                  •
                </span>
                There might be a network connectivity issue
              </li>
              <li className="flex items-start">
                <span 
                  className="mr-2 font-medium"
                  style={{ color: colors.utility.primaryText }}
                >
                  •
                </span>
                We're automatically checking every 30 seconds
              </li>
            </ul>
          </div>
        </div>

        {/* Support Information */}
        <div 
          className="text-center p-3 rounded-md transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          <p 
            className="text-xs transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            If this issue persists, please contact support or check our status page.
          </p>
        </div>
      </div>
    </MiscPageLayout>
  );
};

export default ApiServerDownPage;