// src/pages/settings/businessmodel/admin/pricing-plans/versions/index.tsx - WITH PROPER DIALOG

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, GitBranch, Calendar, User, Eye, Activity, Clock, AlertCircle } from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';
import { useBusinessModel } from '@/hooks/useBusinessModel';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

const VersionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { 
    isLoading, 
    selectedPlan,
    planVersions,
    loadPlanDetails,
    loadPlanVersions,
    activatePlanVersion
  } = useBusinessModel();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [activatingVersionId, setActivatingVersionId] = useState<string | null>(null);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [selectedVersionForActivation, setSelectedVersionForActivation] = useState<any>(null);
  const isMounted = useRef(true);
  
  // Set up mounting status
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView(
      `settings/businessmodel/admin/pricing-plans/${id}/versions`, 
      'Plan Version History'
    );
  }, [id]);
  
  // Fetch plan and versions data
  useEffect(() => {
    if (id && !isInitialized) {
      console.log(`Loading plan and versions for: ${id}`);
      
      const loadData = async () => {
        try {
          await loadPlanDetails(id);
          await loadPlanVersions(id);
          setIsInitialized(true);
        } catch (error) {
          console.error('Error loading plan data:', error);
        }
      };
      
      loadData();
    }
  }, [id, isInitialized, loadPlanDetails, loadPlanVersions]);
  
  // Handle navigation
  const handleBack = () => {
    navigate(`/settings/businessmodel/admin/pricing-plans/${id}`);
  };
  
  // Handle activate version click - show dialog
  const handleActivateClick = (version: any) => {
    setSelectedVersionForActivation(version);
    setShowActivateDialog(true);
  };
  
  // Handle actual activation after confirmation
  const handleConfirmActivation = async () => {
    if (!selectedVersionForActivation) return;
    
    setActivatingVersionId(selectedVersionForActivation.version_id);
    setShowActivateDialog(false);
    
    const success = await activatePlanVersion(selectedVersionForActivation.version_id!);
    if (success) {
      // Refresh the versions list
      await loadPlanVersions(id!);
    }
    
    setActivatingVersionId(null);
    setSelectedVersionForActivation(null);
  };
  
  // Handle dialog close
  const handleCancelActivation = () => {
    setShowActivateDialog(false);
    setSelectedVersionForActivation(null);
  };
  
  // Get the current active version for comparison
  const activeVersion = planVersions.find(v => v.is_active);
  
  // Loading state
  if (isLoading && !isInitialized) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <div className="h-7 bg-muted rounded-md w-40 animate-pulse"></div>
            <div className="h-4 bg-muted rounded-md w-60 mt-2 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2 text-muted-foreground">Loading version history...</span>
        </div>
      </div>
    );
  }
  
  // Error state
  if (!selectedPlan && isInitialized) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Plan Not Found</h1>
            <p className="text-muted-foreground">The requested pricing plan could not be found.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Version History</h1>
            <p className="text-muted-foreground">{selectedPlan?.name}</p>
          </div>
        </div>
      </div>
      
      {/* Version Creation Notice */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
        <div className="flex items-start">
          <GitBranch className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              How to Create a New Version
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              To create a new version, go back to the plan details and click "Edit Plan". 
              Any changes you save will automatically create a new version.
            </p>
          </div>
        </div>
      </div>
      
      {/* Versions List */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 bg-muted/20 border-b border-border">
          <h2 className="text-lg font-semibold">All Versions</h2>
        </div>
        
        <div className="divide-y divide-border">
          {planVersions.length > 0 ? (
            planVersions.map((version) => (
              <div key={version.version_id} className="p-6 hover:bg-muted/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <GitBranch className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="font-medium">Version {version.version_number}</span>
                      {version.is_active && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <Activity className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!version.is_active && (
                      <button
                        onClick={() => handleActivateClick(version)}
                        disabled={activatingVersionId === version.version_id}
                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {activatingVersionId === version.version_id ? (
                          <>
                            <div className="animate-spin -ml-1 mr-2 h-3 w-3 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                            Activating...
                          </>
                        ) : (
                          'Activate'
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(version.effective_date!).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {version.created_by}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Created {new Date(version.created_at!).toLocaleDateString()}
                  </div>
                </div>
                
                {version.changelog && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium mb-1">Changes in this version:</p>
                    <p className="text-sm text-muted-foreground">{version.changelog}</p>
                  </div>
                )}
                
                {/* Version Stats */}
                <div className="mt-3 flex items-center space-x-6 text-xs text-muted-foreground">
                  <span>{version.tiers?.length || 0} pricing tiers</span>
                  <span>{version.features?.length || 0} features</span>
                  <span>{version.notifications?.length || 0} notification types</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <GitBranch className="h-12 w-12 mx-auto opacity-50 mb-4" />
              <h3 className="text-lg font-medium">No Versions Found</h3>
              <p className="mt-2">This plan doesn't have any versions yet.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Activation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showActivateDialog}
        onClose={handleCancelActivation}
        onConfirm={handleConfirmActivation}
        title="Activate Version"
        description={
          selectedVersionForActivation ? 
          `Are you sure you want to activate version ${selectedVersionForActivation.version_number}? ${
            activeVersion ? 
            `This will deactivate the current active version (${activeVersion.version_number}).` : 
            ''
          }` : ''
        }
        confirmText="Activate Version"
        type="info"
        icon={<GitBranch className="h-6 w-6" />}
      />
    </div>
  );
};

export default VersionHistoryPage;