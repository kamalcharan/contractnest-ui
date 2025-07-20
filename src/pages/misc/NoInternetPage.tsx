//src/pages/misc/NoInternetPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, RefreshCw } from 'lucide-react';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const NoInternetPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();

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
      icon={<WifiOff className="h-16 w-16" />}
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
      <div className="mt-6 text-sm text-muted-foreground">
        <p>You can:</p>
        <ul className="mt-2 space-y-1">
          <li>• Check your Wi-Fi or mobile data connection</li>
          <li>• Move closer to your router</li>
          <li>• Restart your device</li>
        </ul>
      </div>
    </MiscPageLayout>
  );
};

export default NoInternetPage;