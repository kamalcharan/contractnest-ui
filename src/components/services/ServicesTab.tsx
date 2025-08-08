// src/components/services/ServicesTab.tsx - Complete Theme Enabled Version
import React, { useState } from 'react';
import { Settings, Plus, FileText } from 'lucide-react';
import ServicesStatsGrid from './ServicesStatsGrid';
import RecentServicesCard from './RecentServicesCard';
import ServiceActionsCard from './ServiceActionsCard';
import ServiceRenewalCard from './ServiceRenewalCard';
import AdHocServiceCard from './AdHocServiceCard';

interface ServicesTabProps {
  contactId: string;
  contactStatus?: 'active' | 'inactive' | 'archived';
}

const ServicesTab: React.FC<ServicesTabProps> = ({ 
  contactId, 
  contactStatus = 'active' 
}) => {
  const [showInactiveServices, setShowInactiveServices] = useState(false);
  const [showUpcomingServices, setShowUpcomingServices] = useState(true);

  // Mock services data - this would come from API
  const servicesStats = {
    active: 5,
    renewalDue: 2,
    completed: 12,
    paused: 1,
    upcoming: 3,
    inactive: 2
  };

  const totalServices = Object.values(servicesStats).reduce((sum, count) => sum + count, 0);

  // Check if contact is restricted
  const isContactRestricted = contactStatus === 'inactive' || contactStatus === 'archived';

  // If no services exist, show empty state
  if (totalServices === 0) {
    return (
      <div className="space-y-6">
        {/* Status Banner for restricted contacts */}
        {isContactRestricted && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Contact {contactStatus === 'archived' ? 'Archived' : 'Inactive'}
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {contactStatus === 'archived' 
                    ? 'This contact is archived. No new services can be created.' 
                    : 'This contact is inactive. Service operations may be limited.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {/* Empty State */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No services yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Services provided to or by this contact will appear here once you start creating them.
                </p>
                
                {!isContactRestricted && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Service
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                      <FileText className="mr-2 h-4 w-4" />
                      Create Contract
                    </button>
                  </div>
                )}

                {isContactRestricted && (
                  <div className="text-sm text-muted-foreground">
                    Activate the contact to enable service operations
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="xl:col-span-1 space-y-6">
            <ServiceActionsCard 
              contactId={contactId}
              showInactiveServices={showInactiveServices}
              setShowInactiveServices={setShowInactiveServices}
              showUpcomingServices={showUpcomingServices}
              setShowUpcomingServices={setShowUpcomingServices}
            />
            {!isContactRestricted && (
              <AdHocServiceCard contactId={contactId} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner for restricted contacts */}
      {isContactRestricted && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Contact {contactStatus === 'archived' ? 'Archived' : 'Inactive'}
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {contactStatus === 'archived' 
                  ? 'This contact is archived. Service data is read-only.' 
                  : 'This contact is inactive. Some service operations may be restricted.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Content Area - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Services Statistics Grid */}
          <ServicesStatsGrid 
            servicesStats={servicesStats} 
            contactId={contactId}
            showInactive={showInactiveServices}
            showUpcoming={showUpcomingServices}
          />
          
          {/* Recent Services Activity */}
          <RecentServicesCard 
            contactId={contactId}
            showInactive={showInactiveServices}
            showUpcoming={showUpcomingServices}
          />
        </div>
        
        {/* Right Sidebar - 1/3 width */}
        <div className="xl:col-span-1 space-y-6">
          {/* Service Actions Card */}
          <ServiceActionsCard 
            contactId={contactId}
            showInactiveServices={showInactiveServices}
            setShowInactiveServices={setShowInactiveServices}
            showUpcomingServices={showUpcomingServices}
            setShowUpcomingServices={setShowUpcomingServices}
          />
          
          {/* Service Renewal Card */}
          <ServiceRenewalCard contactId={contactId} />
          
          {/* Ad Hoc Service Card - only show for active contacts */}
          {!isContactRestricted && (
            <AdHocServiceCard contactId={contactId} />
          )}
          
          {/* Quick Actions */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <h3 className="text-base font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {!isContactRestricted ? (
                <>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Service
                  </button>
                  <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm text-foreground">
                    Service Templates
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {contactStatus === 'archived' 
                      ? 'No actions available for archived contacts'
                      : 'Limited actions for inactive contacts'
                    }
                  </p>
                </div>
              )}
              
              {/* Always available actions */}
              <div className="pt-3 border-t border-border space-y-2">
                <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm text-foreground">
                  View All Services
                </button>
                <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm text-foreground">
                  Export Service Data
                </button>
              </div>
            </div>
          </div>

          {/* Service Summary Stats */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <h3 className="text-base font-semibold text-foreground mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Services</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {servicesStats.active}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                <span className="font-semibold text-foreground">
                  ₹45,000
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-semibold text-foreground">
                  {Math.round((servicesStats.completed / Math.max(servicesStats.completed + servicesStats.paused + servicesStats.inactive, 1)) * 100)}%
                </span>
              </div>
              
              {/* Service Health Progress */}
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Service Health</span>
                  <span className="text-sm font-medium text-foreground">
                    {servicesStats.active + servicesStats.renewalDue > 0 ? 'Good' : 'Inactive'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((servicesStats.active + servicesStats.renewalDue) / Math.max(totalServices, 1)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;