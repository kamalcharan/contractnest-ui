
//src/hooks/useMaintenanceMode.ts

import { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [estimatedEndTime, setEstimatedEndTime] = useState<string | null>(null);

  useEffect(() => {
    // Check initial status
    const checkStatus = async () => {
      const status = await maintenanceService.checkMaintenanceStatus();
      setIsMaintenanceMode(status.isInMaintenance);
      setEstimatedEndTime(status.estimatedEndTime);
    };

    checkStatus();

    // Poll every 1 minutes
    const interval = setInterval(checkStatus, 1 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { isMaintenanceMode, estimatedEndTime };
};