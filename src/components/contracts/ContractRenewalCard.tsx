// src/components/contracts/ContractRenewalCard.tsx - Theme Enabled Version
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

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': 
        return {
          textColor: 'text-red-700 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'medium': 
        return {
          textColor: 'text-orange-700 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800'
        };
      case 'low': 
        return {
          textColor: 'text-green-700 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      default: 
        return {
          textColor: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border'
        };
    }
  };

  const getSectionConfig = (section: string) => {
    switch (section) {
      case 'dueThisWeek':
        return {
          titleColor: 'text-red-600 dark:text-red-400',
          cardBg: 'bg-red-50 dark:bg-red-900/10',
          cardBorder: 'border-red-200 dark:border-red-800',
          daysLeftColor: 'text-red-600 dark:text-red-400'
        };
      case 'dueNextMonth':
        return {
          titleColor: 'text-orange-600 dark:text-orange-400',
          cardBg: 'bg-orange-50 dark:bg-orange-900/10',
          cardBorder: 'border-orange-200 dark:border-orange-800',
          daysLeftColor: 'text-orange-600 dark:text-orange-400'
        };
      case 'completed':
        return {
          titleColor: 'text-purple-600 dark:text-purple-400',
          cardBg: 'bg-purple-50 dark:bg-purple-900/10',
          cardBorder: 'border-purple-200 dark:border-purple-800',
          daysLeftColor: 'text-purple-600 dark:text-purple-400'
        };
      default:
        return {
          titleColor: 'text-foreground',
          cardBg: 'bg-muted/30',
          cardBorder: 'border-border',
          daysLeftColor: 'text-foreground'
        };
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

  const getRenewalStatusConfig = (status: string) => {
    switch (status) {
      case 'pending_decision':
        return {
          label: 'PENDING',
          textColor: 'text-yellow-700 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'not_renewed':
        return {
          label: 'NO RENEWAL',
          textColor: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border'
        };
      default:
        return {
          label: 'UNKNOWN',
          textColor: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border'
        };
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-semibold text-foreground">Contract Renewals</h3>
      </div>
      
      <div className="space-y-6">
        {/* Due This Week */}
        {renewalData.dueThisWeek.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <h4 className="font-medium text-sm text-red-600 dark:text-red-400">Due This Week</h4>
            </div>
            <div className="space-y-2">
              {renewalData.dueThisWeek.map((contract) => {
                const sectionConfig = getSectionConfig('dueThisWeek');
                const priorityConfig = getPriorityConfig(contract.priority);
                
                return (
                  <div 
                    key={contract.id} 
                    className={`p-3 rounded-lg border ${sectionConfig.cardBg} ${sectionConfig.cardBorder} hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-foreground truncate">
                        {contract.title}
                      </h5>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium border
                        ${priorityConfig.textColor} ${priorityConfig.bgColor} ${priorityConfig.borderColor}
                      `}>
                        {contract.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {contract.value}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(contract.renewalDate)}
                        </div>
                        <div className={`text-xs font-medium ${sectionConfig.daysLeftColor}`}>
                          {getDaysUntilRenewal(contract.renewalDate)} days left
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Due Next Month */}
        {renewalData.dueNextMonth.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <h4 className="font-medium text-sm text-orange-600 dark:text-orange-400">Due Next Month</h4>
            </div>
            <div className="space-y-2">
              {renewalData.dueNextMonth.map((contract) => {
                const sectionConfig = getSectionConfig('dueNextMonth');
                const priorityConfig = getPriorityConfig(contract.priority);
                
                return (
                  <div 
                    key={contract.id} 
                    className={`p-3 rounded-lg border ${sectionConfig.cardBg} ${sectionConfig.cardBorder} hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-foreground truncate">
                        {contract.title}
                      </h5>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium border
                        ${priorityConfig.textColor} ${priorityConfig.bgColor} ${priorityConfig.borderColor}
                      `}>
                        {contract.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {contract.value}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(contract.renewalDate)}
                        </div>
                        <div className={`text-xs font-medium ${sectionConfig.daysLeftColor}`}>
                          {getDaysUntilRenewal(contract.renewalDate)} days left
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed but Not Renewed */}
        {renewalData.completedNotRenewed.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <h4 className="font-medium text-sm text-purple-600 dark:text-purple-400">Completed - Renewal Pending</h4>
            </div>
            <div className="space-y-2">
              {renewalData.completedNotRenewed.map((contract) => {
                const sectionConfig = getSectionConfig('completed');
                const statusConfig = getRenewalStatusConfig(contract.renewalStatus);
                
                return (
                  <div 
                    key={contract.id} 
                    className={`p-3 rounded-lg border ${sectionConfig.cardBg} ${sectionConfig.cardBorder} hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-foreground truncate">
                        {contract.title}
                      </h5>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium border
                        ${statusConfig.textColor} ${statusConfig.bgColor} ${statusConfig.borderColor}
                      `}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {contract.value}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Completed: {formatDate(contract.completedDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {renewalData.dueThisWeek.length === 0 && 
         renewalData.dueNextMonth.length === 0 && 
         renewalData.completedNotRenewed.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              No contracts due for renewal
            </p>
            <p className="text-xs text-muted-foreground">
              Renewal alerts will appear here when contracts are nearing expiration
            </p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {renewalData.dueThisWeek.length + renewalData.dueNextMonth.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Contracts due for renewal
          </div>
          {renewalData.completedNotRenewed.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              + {renewalData.completedNotRenewed.length} awaiting renewal decision
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractRenewalCard;