import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Database, Activity, HardDrive, Cloud } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const StorageSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTenant } = useAuth();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const handleBack = () => {
    navigate('/settings');
  };
  
  const handleDiagnostic = () => {
    navigate('/settings/configure/storage/firebase');
  };
  
  // Check if user is admin
  const isAdmin = currentTenant?.is_admin === true;
  
  return (
    <div 
      className="container mx-auto p-6 max-w-4xl transition-colors duration-200 min-h-screen"
      style={{
        background: isDarkMode 
          ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
          : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
      }}
    >
      <div className="flex items-center gap-2 mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBack}
          className="mr-2 transition-colors"
          style={{
            borderColor: colors.utility.secondaryText + '40',
            backgroundColor: colors.utility.secondaryBackground,
            color: colors.utility.primaryText
          }}
        >
          <ArrowLeft 
            className="h-4 w-4 mr-2 transition-colors" 
            style={{ color: colors.utility.secondaryText }}
          />
          Back to Settings
        </Button>
        <div className="flex-1">
          <h2 
            className="text-2xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Storage Settings
          </h2>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Configure and manage your storage options
          </p>
        </div>
      </div>
      
      <div className="grid gap-6">
        {/* Storage Overview */}
        <Card 
          className="transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <HardDrive 
                className="h-5 w-5 mr-2 transition-colors" 
                style={{ color: colors.brand.primary }}
              />
              <h3 
                className="text-lg font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Storage Overview
              </h3>
            </div>
            
            <div className="space-y-4">
              <p 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Manage your storage options and settings for documents, images, and other files.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="p-4 border rounded-md transition-colors"
                  style={{
                    borderColor: colors.utility.primaryText + '20',
                    backgroundColor: colors.utility.primaryBackground + '50'
                  }}
                >
                  <div className="flex items-center mb-2">
                    <Cloud 
                      className="h-4 w-4 mr-2 transition-colors" 
                      style={{ color: colors.brand.primary }}
                    />
                    <h4 
                      className="font-medium transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Storage Provider
                    </h4>
                  </div>
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
{(currentTenant as any)?.storage_provider || "Firebase Storage (Default)"}
                  </p>
                </div>
                
                <div 
                  className="p-4 border rounded-md transition-colors"
                  style={{
                    borderColor: colors.utility.primaryText + '20',
                    backgroundColor: colors.utility.primaryBackground + '50'
                  }}
                >
                  <div className="flex items-center mb-2">
                    <Database 
                      className="h-4 w-4 mr-2 transition-colors" 
                      style={{ color: colors.brand.primary }}
                    />
                    <h4 
                      className="font-medium transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Storage Status
                    </h4>
                  </div>
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Active
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Firebase Diagnostics Card - Admin Only */}
        {isAdmin && (
          <Card 
            className="transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Activity 
                  className="h-5 w-5 mr-2 transition-colors" 
                  style={{ color: colors.brand.primary }}
                />
                <h3 
                  className="text-lg font-semibold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Firebase Diagnostics
                </h3>
              </div>
              
              <div className="space-y-4">
                <p 
                  className="transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Test and troubleshoot your Firebase Storage configuration. This tool helps diagnose issues with storage connectivity,
                  permissions, and folder structure.
                </p>
                
                <div className="flex flex-col items-start">
                  <Button 
                    onClick={handleDiagnostic}
                    className="transition-colors hover:opacity-90"
                    style={{
                      background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                      color: '#FFFFFF',
                      borderColor: 'transparent'
                    }}
                  >
                    Open Firebase Diagnostic Tool
                  </Button>
                  <p 
                    className="text-xs mt-2 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
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