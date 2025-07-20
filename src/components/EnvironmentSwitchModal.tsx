// src/components/EnvironmentSwitchModal.tsx


import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmationDialog from './ui/ConfirmationDialog';

const EnvironmentSwitchModal: React.FC = () => {
  const { 
    showEnvironmentSwitchModal, 
    pendingEnvironment, 
    isLive,
    confirmEnvironmentSwitch, 
    cancelEnvironmentSwitch 
  } = useAuth();

  if (!showEnvironmentSwitchModal || !pendingEnvironment) {
    return null;
  }

  // Determine source and target environments
  const sourceEnv = isLive ? 'Live' : 'Test';
  const targetEnv = pendingEnvironment === 'live' ? 'Live' : 'Test';

  // Create environment badges
  const SourceBadge = () => (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: isLive ? '#dcfce7' : '#fef3c7',
        color: isLive ? '#16a34a' : '#f59e0b'
      }}
    >
      {sourceEnv} Environment
    </span>
  );

  const TargetBadge = () => (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: pendingEnvironment === 'live' ? '#dcfce7' : '#fef3c7',
        color: pendingEnvironment === 'live' ? '#16a34a' : '#f59e0b'
      }}
    >
      {targetEnv} Environment
    </span>
  );

  const description = (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-3">
        <SourceBadge />
        <span className="text-muted-foreground">→</span>
        <TargetBadge />
      </div>
      <p className="text-sm text-muted-foreground">
        You are switching from {sourceEnv} to {targetEnv} environment.
      </p>
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-md p-3">
        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
          ⚠️ Any unsaved changes will be lost.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        All data will be refreshed and you will be redirected to the dashboard.
      </p>
    </div>
  );

  return (
    <ConfirmationDialog
      isOpen={showEnvironmentSwitchModal}
      onClose={cancelEnvironmentSwitch}
      onConfirm={confirmEnvironmentSwitch}
      title="Switch Environment"
      description={description as any} // Type assertion needed since we're passing JSX
      confirmText={`Switch to ${targetEnv}`}
      cancelText="Cancel"
      type="info"
      icon={<RefreshCw className="h-6 w-6" />}
    />
  );
};

export default EnvironmentSwitchModal;