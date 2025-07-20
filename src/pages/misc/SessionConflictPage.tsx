//src/pages/misc/SessionConflictPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogIn, Shield } from 'lucide-react';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';
import { useAuth } from '../../context/AuthContext';

const SessionConflictPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    analyticsService.trackMiscPageView('session-conflict', 'Session Conflict');
  }, []);

  const handleLoginAgain = async () => {
    analyticsService.trackMiscPageAction('session-conflict', 'login_again_clicked');
    await logout();
    navigate('/login');
  };

  const handleStaySigned = () => {
    analyticsService.trackMiscPageAction('session-conflict', 'stay_signed_out_clicked');
    navigate('/');
  };

  return (
    <MiscPageLayout
      icon={<Users className="h-16 w-16" />}
      title="Already Logged In Elsewhere"
      description="Your account is currently active on another device or browser."
      illustration="session-conflict"
      actions={[
        {
          label: 'Login Here Instead',
          onClick: handleLoginAgain,
          variant: 'primary',
          icon: <LogIn className="h-4 w-4" />
        },
        {
          label: 'Stay Signed Out',
          onClick: handleStaySigned,
          variant: 'outline'
        }
      ]}
    >
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Security Notice:</p>
            <p className="mt-1">
              If you didn't initiate the other session, please change your password immediately
              and enable two-factor authentication.
            </p>
          </div>
        </div>
      </div>
    </MiscPageLayout>
  );
};

export default SessionConflictPage;