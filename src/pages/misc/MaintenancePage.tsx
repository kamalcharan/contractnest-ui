//src/pages/misc/MaintenancePage.tsx - Theme Integrated Version

import React, { useEffect, useState } from 'react';
import { Wrench, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';
import { useMaintenanceMode } from '../../hooks/useMaintenanceMode';

const MaintenancePage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const { estimatedEndTime } = useMaintenanceMode();
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

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
      icon={<Wrench className="h-16 w-16" style={{ color: colors.semantic.warning }} />}
      title="We'll Be Right Back!"
      description="We're currently performing scheduled maintenance to improve your experience."
      illustration="maintenance"
    >
      <div className="mt-8 space-y-4">
        {timeLeft && (
          <div 
            className="flex items-center justify-center space-x-2 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <Clock className="h-5 w-5" />
            <span>
              Estimated time remaining: <strong style={{ color: colors.utility.primaryText }}>{timeLeft}</strong>
            </span>
          </div>
        )}
        
        <div 
          className="text-sm text-center transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          <p>Follow us for updates:</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a 
              href="#" 
              className="hover:underline transition-colors"
              style={{ 
                color: colors.brand.primary 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Twitter
            </a>
            <a 
              href="#" 
              className="hover:underline transition-colors"
              style={{ 
                color: colors.brand.primary 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Status Page
            </a>
          </div>
        </div>
      </div>
    </MiscPageLayout>
  );
};

export default MaintenancePage;