import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Activity, HardDrive, Cloud } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const StorageSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTenant } = useAuth();
  
  const handleBack = () => {
    navigate('/settings');
  };
  
  const handleDiagnostic = () => {
    navigate('/settings/configure/storage/firebase');
  };
  
  // Check if user is admin
  const isAdmin = currentTenant?.is_admin === true;
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            Storage Settings
          </h2>
          <p className="text-muted-foreground">
            Configure and manage your storage options
          </p>
        </div>
      </div>
      
      <div className="grid gap-6">
        {/* Storage Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <HardDrive className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Storage Overview</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Manage your storage options and settings for documents, images, and other files.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center mb-2">
                    <Cloud className="h-4 w-4 mr-2 text-primary" />
                    <h4 className="font-medium">Storage Provider</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentTenant?.storage_provider || "Firebase Storage (Default)"}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center mb-2">
                    <Database className="h-4 w-4 mr-2 text-primary" />
                    <h4 className="font-medium">Storage Status</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Firebase Diagnostics Card - Admin Only */}
        {isAdmin && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold">Firebase Diagnostics</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Test and troubleshoot your Firebase Storage configuration. This tool helps diagnose issues with storage connectivity,
                  permissions, and folder structure.
                </p>
                
                <div className="flex flex-col items-start">
                  <Button onClick={handleDiagnostic}>
                    Open Firebase Diagnostic Tool
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Admin privileges required to use this tool.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StorageSettingsPage;