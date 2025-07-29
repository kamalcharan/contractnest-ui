// src/components/services/ServiceActionsCard.tsx
import React, { useState } from 'react';
import { Settings, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';

interface ServiceActionsCardProps {
  contactId: string;
  showInactiveServices: boolean;
  setShowInactiveServices: (show: boolean) => void;
  showUpcomingServices: boolean;
  setShowUpcomingServices: (show: boolean) => void;
}

const ServiceActionsCard: React.FC<ServiceActionsCardProps> = ({ 
  contactId,
  showInactiveServices,
  setShowInactiveServices,
  showUpcomingServices,
  setShowUpcomingServices
}) => {
  const [showEndAllConfirmation, setShowEndAllConfirmation] = useState(false);

  const handleEndAllServices = () => {
    if (showEndAllConfirmation) {
      // Here you would call the API to end all services
      console.log('Ending all services for contact:', contactId);
      setShowEndAllConfirmation(false);
      // Show success message or redirect
    } else {
      setShowEndAllConfirmation(true);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-semibold">Service Actions</h3>
      </div>
      
      <div className="space-y-4">
        {/* Show Inactive Services Toggle */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Show inactive services</span>
            <button
              onClick={() => setShowInactiveServices(!showInactiveServices)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showInactiveServices ? (
                <ToggleRight className="h-5 w-5 text-primary" />
              ) : (
                <ToggleLeft className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Displays services that have ended or expired
          </p>
        </div>
        
        {/* Show Upcoming Services Toggle */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Show upcoming services</span>
            <button
              onClick={() => setShowUpcomingServices(!showUpcomingServices)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showUpcomingServices ? (
                <ToggleRight className="h-5 w-5 text-primary" />
              ) : (
                <ToggleLeft className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Display services that have been accepted for renewal
          </p>
        </div>
        
        {/* End All Services Section */}
        <div className="pt-4 border-t border-border">
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              End all services
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              If you're no longer providing services to this client, use this button to make all 
              services inactive and stop billing.
            </p>
          </div>
          
          {showEndAllConfirmation ? (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Are you sure?
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      This will end all active services and stop recurring billing. 
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleEndAllServices}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Yes, End All
                </button>
                <button
                  onClick={() => setShowEndAllConfirmation(false)}
                  className="flex-1 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleEndAllServices}
              className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
            >
              End all services
            </button>
          )}
        </div>
        
        {/* Service Statistics Summary */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Current Status</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Services:</span>
              <span className="font-medium text-green-600">5 running</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Renewal Due:</span>
              <span className="font-medium text-orange-600">2 expiring</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Revenue:</span>
              <span className="font-medium text-blue-600">₹45,000</span>
            </div>
          </div>
        </div>
        
        {/* Learn More */}
        <div className="pt-4 border-t border-border">
          <div className="space-y-2 text-sm">
            <div className="text-primary hover:underline cursor-pointer">
              • Managing service lifecycles
            </div>
            <div className="text-primary hover:underline cursor-pointer">
              • Setting up automatic renewals
            </div>
            <div className="text-primary hover:underline cursor-pointer">
              • Service billing integration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceActionsCard;