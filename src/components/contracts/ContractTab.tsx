// src/components/contracts/ContractTab.tsx - Enhanced with Contact Status Handling
import React from 'react';
import { FileText, Plus, Upload, Eye, BarChart3, Download, AlertCircle, Archive } from 'lucide-react';
import ContractStatsGrid from './ContractStatsGrid';
import RecentContractsCard from './RecentContractsCard';
import ContractRenewalCard from './ContractRenewalCard';

interface ContractTabProps {
  contactId: string;
  contactStatus?: 'active' | 'inactive' | 'archived';
}

const ContractTab: React.FC<ContractTabProps> = ({ 
  contactId, 
  contactStatus = 'active' 
}) => {
  // Mock contract data - this would come from API
  const contractStats = {
    draft: 2,
    sent: 1,
    negotiation: 0,
    inForce: 5,
    completed: 12
  };

  const totalContracts = Object.values(contractStats).reduce((sum, count) => sum + count, 0);

  // Check if contact is restricted
  const isContactRestricted = contactStatus === 'inactive' || contactStatus === 'archived';

  // If no contracts exist, show empty state
  if (totalContracts === 0) {
    return (
      <div className="space-y-6">
        {/* Status Banner for restricted contacts */}
        {isContactRestricted && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Contact {contactStatus === 'archived' ? 'Archived' : 'Inactive'}
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {contactStatus === 'archived' 
                    ? 'This contact is archived. No new contracts can be created.' 
                    : 'This contact is inactive. Contract operations may be limited.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg shadow-sm border border-border p-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">No contracts yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Contracts and agreements with this contact will appear here once you start creating them.
            </p>
            
            {!isContactRestricted ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Contract
                </button>
                <button className="flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors text-foreground">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Contract
                </button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Activate the contact to enable contract operations
              </div>
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
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Contact {contactStatus === 'archived' ? 'Archived' : 'Inactive'}
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {contactStatus === 'archived' 
                  ? 'This contact is archived. Contract data is read-only.' 
                  : 'This contact is inactive. Some contract operations may be restricted.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contract Overview Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20 p-6">
        <div className="flex items-center justify-between">
          {/* Left side - Summary */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Contract Management</h2>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">
                  <span className="font-medium text-green-600 dark:text-green-400">{contractStats.inForce}</span> Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{contractStats.sent + contractStats.negotiation}</span> In Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-muted-foreground">
                  <span className="font-medium text-purple-600 dark:text-purple-400">{contractStats.completed}</span> Completed
                </span>
              </div>
            </div>
          </div>
          
          {/* Right side - Total */}
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">{totalContracts}</div>
            <div className="text-sm text-muted-foreground">Total Contracts</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
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
          
          {/* Quick Actions Card */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold mb-4 text-foreground">Quick Actions</h3>
            <div className="space-y-3">
              {!isContactRestricted ? (
                <>
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Contract
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Signed Contract
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <Archive className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
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
                <button className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Contracts
                </button>
              </div>
            </div>
          </div>
          
          {/* Contract Analytics Card */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold mb-4 text-foreground">Contract Insights</h3>
            <div className="space-y-4">
              {/* Contract Value */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Contract Value</span>
                <span className="font-semibold text-green-600 dark:text-green-400">₹5.1L</span>
              </div>
              
              {/* Average Contract Size */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Contract Size</span>
                <span className="font-semibold text-foreground">₹25.5K</span>
              </div>
              
              {/* Completion Rate */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-semibold text-foreground">
                  {Math.round((contractStats.completed / totalContracts) * 100)}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Contract Performance</span>
                  <span>Excellent</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            
            {/* View Analytics Button */}
            <div className="mt-4 pt-4 border-t border-border">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors">
                <BarChart3 className="h-4 w-4" />
                View Detailed Analytics
              </button>
            </div>
          </div>
          
          {/* Export/Reports Card */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
            <h3 className="text-base font-semibold mb-4 text-foreground">Reports & Export</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
                <Download className="mr-2 h-4 w-4" />
                Export Contract List
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </button>
            </div>
            
            <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
              Last export: Never
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractTab;