// src/components/services/ServicesTab.tsx
import React, { useState } from 'react';
import { Settings, Plus, FileText } from 'lucide-react';
import ServicesStatsGrid from './ServicesStatsGrid';
import RecentServicesCard from './RecentServicesCard';
import ServiceActionsCard from './ServiceActionsCard';
import ServiceRenewalCard from './ServiceRenewalCard';
import AdHocServiceCard from './AdHocServiceCard';

interface ServicesTabProps {
  contactId: string;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ contactId }) => {
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

  // If no services exist, show empty state
  if (totalServices === 0) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No services yet</h3>
            <p className="text-muted-foreground mb-6">
              Services provided to or by this contact will appear here.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </button>
              <button className="flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                <FileText className="mr-2 h-4 w-4" />
                + Contract
              </button>
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
          <AdHocServiceCard contactId={contactId} />
        </div>
      </div>
    );
  }

  return (
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
        
        {/* Ad Hoc Service Card */}
        <AdHocServiceCard contactId={contactId} />
        
        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Add New Service
            </button>
            <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
              Service Templates
            </button>
            <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
              View All Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;