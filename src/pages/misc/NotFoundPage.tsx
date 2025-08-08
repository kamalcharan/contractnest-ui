//src/pages/misc/NotFoundPage.tsx - Theme Integrated Version

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, currentTheme } = useTheme();

  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  useEffect(() => {
    analyticsService.trackMiscPageView('not-found', '404 Not Found', {
      attempted_path: location.pathname
    });
  }, [location]);

  const handleGoHome = () => {
    analyticsService.trackMiscPageAction('not-found', 'go_home_clicked');
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    analyticsService.trackMiscPageAction('not-found', 'go_back_clicked');
    navigate(-1);
  };

  return (
    <MiscPageLayout
      icon={<FileQuestion className="h-16 w-16" style={{ color: colors.utility.secondaryText }} />}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      illustration="not-found"
      actions={[
        {
          label: 'Go to Dashboard',
          onClick: handleGoHome,
          variant: 'primary',
          icon: <Home className="h-4 w-4" />
        },
        {
          label: 'Go Back',
          onClick: handleGoBack,
          variant: 'outline',
          icon: <ArrowLeft className="h-4 w-4" />
        }
      ]}
    >
      <div className="mt-6 text-center">
        <p 
          className="text-sm transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          Error Code: <span style={{ color: colors.utility.primaryText, fontWeight: '600' }}>404</span>
        </p>
      </div>
    </MiscPageLayout>
  );
};

export default NotFoundPage;