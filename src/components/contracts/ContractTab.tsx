// src/components/contracts/ContractTab.tsx
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import ContractStatsGrid from './ContractStatsGrid';
import RecentContractsCard from './RecentContractsCard';
import ContractRenewalCard from './ContractRenewalCard';

interface ContractTabProps {
  contactId: string;
}

const ContractTab: React.FC<ContractTabProps> = ({ contactId }) => {
  // Mock contract data - this would come from API
  const contractStats = {
    draft: 2,
    sent: 1,
    negotiation: 0,
    inForce: 5,
    completed: 12
  };

  const totalContracts = Object.values(contractStats).reduce((sum, count) => sum + count, 0);

  // If no contracts exist, show empty state
  if (totalContracts === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No contracts yet</h3>
        <p className="text-muted-foreground mb-6">
          Contracts and agreements with this contact will appear here.
        </p>
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mx-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Contract
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Content Area - 2/3 width */}
      <div className="xl:col-span-2 space-y-6">
        {/* Contract Statistics Grid */}
        <ContractStatsGrid contractStats={contractStats} contactId={contactId} />
        
        {/* Recent Contracts Activity */}
        <RecentContractsCard contactId={contactId} />
      </div>
      
      {/* Right Sidebar - 1/3 width */}
      <div className="xl:col-span-1 space-y-6">
        {/* Contract Renewal Card */}
        <ContractRenewalCard contactId={contactId} />
        
        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Create New Contract
            </button>
            <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
              Upload Signed Contract
            </button>
            <button className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
              View All Contracts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractTab;