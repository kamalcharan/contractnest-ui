// src/pages/settings/businessmodel/admin/pricing-plans/versions/migrate.tsx

import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MigrationDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetVersion = queryParams.get('targetVersion');
  
  // Handle Back
  const handleBack = () => {
    navigate(`/settings/businessmodel/admin/pricing-plans/${id}/versions`);
  };
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Tenant Migration Dashboard</h1>
          <p className="text-muted-foreground">Manage tenant migrations between plan versions</p>
        </div>
      </div>
      
      {/* Placeholder content */}
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <h3 className="text-lg font-medium">Migration Dashboard</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          This page will provide tools for migrating tenants from version {id} to version {targetVersion || "latest"}.
        </p>
        <p>Coming soon!</p>
      </div>
    </div>
  );
};

export default MigrationDashboardPage;