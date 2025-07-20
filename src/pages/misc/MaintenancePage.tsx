//src/pages/misc/MaintenancePage.tsx

import React, { useEffect, useState } from 'react';
import { Wrench, Clock } from 'lucide-react';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';
import { useMaintenanceMode } from '../../hooks/useMaintenanceMode';

const MaintenancePage: React.FC = () => {
  const { estimatedEndTime } = useMaintenanceMode();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    analyticsService.trackMiscPageView('maintenance', 'Under Maintenance');
  }, []);

  useEffect(() => {
    if (!estimatedEndTime) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(estimatedEndTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft('Soon');
        // Reload page to check if maintenance is over
        setTimeout(() => window.location.reload(), 30000);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [estimatedEndTime]);

  return (
    <MiscPageLayout
      icon={<Wrench className="h-16 w-16" />}
      title="We'll Be Right Back!"
      description="We're currently performing scheduled maintenance to improve your experience."
      illustration="maintenance"
    >
      <div className="mt-8 space-y-4">
        {timeLeft && (
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>Estimated time remaining: <strong>{timeLeft}</strong></span>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground text-center">
          <p>Follow us for updates:</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-primary hover:underline">Twitter</a>
            <a href="#" className="text-primary hover:underline">Status Page</a>
          </div>
        </div>
      </div>
    </MiscPageLayout>
  );
};

export default MaintenancePage;