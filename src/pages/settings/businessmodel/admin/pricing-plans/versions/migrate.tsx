// src/pages/settings/businessmodel/admin/pricing-plans/versions/migrate.tsx

import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const MigrationDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetVersion = queryParams.get('targetVersion');
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Handle Back
  const handleBack = () => {
    navigate(`/settings/businessmodel/admin/pricing-plans/${id}/versions`);
  };
  
  return (
    <div 
      className="p-6 transition-colors"
      style={{ backgroundColor: `${colors.utility.primaryBackground}20` }}
    >
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:opacity-80 transition-colors"
          style={{ backgroundColor: colors.utility.secondaryBackground }}
        >
          <ArrowLeft 
            className="h-5 w-5 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          />
        </button>
        <div>
          <h1 
            className="text-2xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Tenant Migration Dashboard
          </h1>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Manage tenant migrations between plan versions
          </p>
        </div>
      </div>
      
      {/* Placeholder content */}
      <div 
        className="rounded-lg border p-8 text-center transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.secondaryText + '40'
        }}
      >
        <h3 
          className="text-lg font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Migration Dashboard
        </h3>
        <p 
          className="mt-2 mb-4 transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          This page will provide tools for migrating tenants from version {id} to version {targetVersion || "latest"}.
        </p>
        <p 
          className="transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Coming soon!
        </p>
      </div>
    </div>
  );
};

export default MigrationDashboardPage;