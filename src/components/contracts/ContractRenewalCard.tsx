// src/components/contracts/ContractRenewalCard.tsx
import React from 'react';
import { RefreshCw, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ContractRenewalCardProps {
  contactId: string;
}

const ContractRenewalCard: React.FC<ContractRenewalCardProps> = ({ contactId }) => {
  // Mock renewal data - this would come from API
  const renewalData = {
    dueThisWeek: [
      {
        id: '1',
        title: 'Annual Service Agreement',
        value: '₹2,40,000',
        renewalDate: '2024-01-20',
        priority: 'high'
      }
    ],
    dueNextMonth: [
      {
        id: '2',
        title: 'Maintenance Contract',
        value: '₹36,000',
        renewalDate: '2024-02-15',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Support Services',
        value: '₹18,000',
        renewalDate: '2024-02-28',
        priority: 'low'
      }
    ],
    completedNotRenewed: [
      {
        id: '4',
        title: 'Website Development',
        value: '₹85,000',
        completedDate: '2024-01-10',
        renewalStatus: 'pending_decision'
      },
      {
        id: '5',
        title: 'Mobile App Phase 1',
        value: '₹1,20,000',
        completedDate: '2023-12-15',
        renewalStatus: 'not_renewed'
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-semibold">Contract Renewals</h3>
      </div>
      
      <div className="space-y-6">
        {/* Due This Week */}
        {renewalData.dueThisWeek.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <h4 className="font-medium text-sm text-red-600">Due This Week</h4>
            </div>
            <div className="space-y-2">
              {renewalData.dueThisWeek.map((contract) => (
                <div key={contract.id} className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-sm text-foreground truncate">
                      {contract.title}
                    </h5>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium border
                      ${getPriorityColor(contract.priority)}
                    `}>
                      {contract.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">
                      {contract.value}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(contract.renewalDate)}
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        {getDaysUntilRenewal(contract.renewalDate)} days left
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Due Next Month */}
        {renewalData.dueNextMonth.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-orange-600" />
              <h4 className="font-medium text-sm text-orange-600">Due Next Month</h4>
            </div>
            <div className="space-y-2">
              {renewalData.dueNextMonth.map((contract) => (
                <div key={contract.id} className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-sm text-foreground truncate">
                      {contract.title}
                    </h5>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium border
                      ${getPriorityColor(contract.priority)}
                    `}>
                      {contract.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">
                      {contract.value}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(contract.renewalDate)}
                      </div>
                      <div className="text-xs text-orange-600 font-medium">
                        {getDaysUntilRenewal(contract.renewalDate)} days left
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed but Not Renewed */}
        {renewalData.completedNotRenewed.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <h4 className="font-medium text-sm text-purple-600">Completed - Renewal Pending</h4>
            </div>
            <div className="space-y-2">
              {renewalData.completedNotRenewed.map((contract) => (
                <div key={contract.id} className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-sm text-foreground truncate">
                      {contract.title}
                    </h5>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${contract.renewalStatus === 'pending_decision' 
                        ? 'text-yellow-700 bg-yellow-100 border border-yellow-200' 
                        : 'text-gray-600 bg-gray-100 border border-gray-200'
                      }
                    `}>
                      {contract.renewalStatus === 'pending_decision' ? 'PENDING' : 'NO RENEWAL'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">
                      {contract.value}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Completed: {formatDate(contract.completedDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Renewals */}
        {renewalData.dueThisWeek.length === 0 && 
         renewalData.dueNextMonth.length === 0 && 
         renewalData.completedNotRenewed.length === 0 && (
          <div className="text-center py-6">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No contracts due for renewal
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {renewalData.dueThisWeek.length + renewalData.dueNextMonth.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Contracts due for renewal
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractRenewalCard;