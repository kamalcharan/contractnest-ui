export interface MiscPageProps {
  error?: Error;
  resetError?: () => void;
}

export interface MaintenanceInfo {
  isActive: boolean;
  estimatedEndTime?: string;
  message?: string;
}

export interface SessionInfo {
  sessionId: string;
  deviceInfo: string;
  lastActive: string;
}