//src/services/maintenanceService.ts

import api from './api';
import { API_ENDPOINTS } from './serviceURLs';

interface MaintenanceStatus {
  isInMaintenance: boolean;
  estimatedEndTime: string | null;
  message?: string;
}

export const maintenanceService = {
  async checkMaintenanceStatus(): Promise<MaintenanceStatus> {
    // First check if we have stored maintenance info from a previous API response
    const storedInfo = sessionStorage.getItem('maintenance_info');
    if (storedInfo) {
      try {
        return JSON.parse(storedInfo);
      } catch (e) {
        console.error('Failed to parse stored maintenance info:', e);
      }
    }

    // Then check environment variable for client-side maintenance
    if (import.meta.env.VITE_MAINTENANCE_MODE === 'true') {
      return {
        isInMaintenance: true,
        estimatedEndTime: import.meta.env.VITE_MAINTENANCE_END_TIME || null,
        message: import.meta.env.VITE_MAINTENANCE_MESSAGE || 'System maintenance in progress'
      };
    }

    // Finally check with API
    try {
      const response = await api.get(API_ENDPOINTS.SYSTEM.MAINTENANCE_STATUS);
      return response.data;
    } catch (error) {
      console.error('Failed to check maintenance status:', error);
      // If API is unreachable, assume not in maintenance
      return {
        isInMaintenance: false,
        estimatedEndTime: null
      };
    }
  },

  clearMaintenanceInfo(): void {
    sessionStorage.removeItem('maintenance_info');
  }
};