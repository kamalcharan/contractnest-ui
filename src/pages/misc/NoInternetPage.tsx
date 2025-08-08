//src/pages/misc/NoInternetPage.tsx - Theme Integrated Version

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const NoInternetPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const { isOnline } = useNetworkStatus();

  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  useEffect(() => {
    analyticsService.trackMiscPageView('no-internet', 'No Internet Connection');
  }, []);

  useEffect(() => {
    // Auto-redirect when connection is restored
    if (isOnline) {
      navigate(-1); // Go back to previous page
    }
  }, [isOnline, navigate]);

  const handleRetry = () => {
    analyticsService.trackMiscPageAction('no-internet', 'retry_clicked');
    window.location.reload();
  };

  return (
    <MiscPageLayout
      icon={<WifiOff className="h-16 w-16" style={{ color: colors.semantic.error }} />}
      title="No Internet Connection"
      description="Please check your internet connection and try again."
      illustration="no-internet"
      actions={[
        {
          label: 'Retry',
          onClick: handleRetry,
          variant: 'primary',
          icon: <RefreshCw className="h-4 w-4" />
        }
      ]}
    >
      <div className="mt-6">
        <p 
          className="text-sm transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          You can:
        </p>
        <ul className="mt-2 space-y-1">
          <li 
            className="text-sm transition-colors flex items-start"
            style={{ color: colors.utility.secondaryText }}
          >
            <span 
              className="mr-2 font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              •
            </span>
            Check your Wi-Fi or mobile data connection
          </li>
          <li 
            className="text-sm transition-colors flex items-start"
            style={{ color: colors.utility.secondaryText }}
          >
            <span 
              className="mr-2 font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              •
            </span>
            Move closer to your router
          </li>
          <li 
            className="text-sm transition-colors flex items-start"
            style={{ color: colors.utility.secondaryText }}
          >
            <span 
              className="mr-2 font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              •
            </span>
            Restart your device
          </li>
        </ul>
      </div>
    </MiscPageLayout>
  );
};

export default NoInternetPage;