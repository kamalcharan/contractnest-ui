// src/components/contracts/RecentContractsCard.tsx - Theme Enabled Version
import React from 'react';
import { Clock, FileText, Send, MessageSquare, CheckCircle, Eye, Edit, ExternalLink } from 'lucide-react';

interface RecentContractsCardProps {
  contactId: string;
}

const RecentContractsCard: React.FC<RecentContractsCardProps> = ({ contactId }) => {
  // Mock recent contracts data - this would come from API
  const recentContracts = [
    {
      id: '1',
      title: 'Annual Service Agreement 2024',
      status: 'inForce',
      value: '₹2,40,000',
      lastActivity: '2024-01-15T10:30:00Z',
      activityType: 'contract_signed',
      description: 'Contract signed and activated'
    },
    {
      id: '2', 
      title: 'Website Development Contract',
      status: 'negotiation',
      value: '₹85,000',
      lastActivity: '2024-01-14T16:45:00Z',
      activityType: 'revision_requested',
      description: 'Client requested pricing revision'
    },
    {
      id: '3',
      title: 'Maintenance & Support Agreement',
      status: 'sent',
      value: '₹15,000',
      lastActivity: '2024-01-12T09:15:00Z',
      activityType: 'contract_sent',
      description: 'Contract sent for client review'
    },
    {
      id: '4',
      title: 'Quarterly Consulting Services',
      status: 'draft',
      value: '₹50,000',
      lastActivity: '2024-01-10T14:20:00Z',
      activityType: 'draft_updated',
      description: 'Contract terms being finalized'
    },
    {
      id: '5',
      title: 'Mobile App Development',
      status: 'completed',
      value: '₹1,20,000',
      lastActivity: '2024-01-08T11:00:00Z',
      activityType: 'contract_completed',
      description: 'Project completed successfully'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { 
          label: 'Draft', 
          textColor: 'text-gray-700 dark:text-gray-300', 
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: FileText 
        };
      case 'sent':
        return { 
          label: 'Sent', 
          textColor: 'text-blue-700 dark:text-blue-300', 
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          borderColor: 'border-blue-200 dark:border-blue-700',
          icon: Send 
        };
      case 'negotiation':
        return { 
          label: 'Negotiation', 
          textColor: 'text-orange-700 dark:text-orange-300', 
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          borderColor: 'border-orange-200 dark:border-orange-700',
          icon: MessageSquare 
        };
      case 'inForce':
        return { 
          label: 'In Force', 
          textColor: 'text-green-700 dark:text-green-300', 
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          borderColor: 'border-green-200 dark:border-green-700',
          icon: CheckCircle 
        };
      case 'completed':
        return { 
          label: 'Completed', 
          textColor: 'text-purple-700 dark:text-purple-300', 
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          borderColor: 'border-purple-200 dark:border-purple-700',
          icon: CheckCircle 
        };
      default:
        return { 
          label: 'Unknown', 
          textColor: 'text-muted-foreground', 
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: FileText 
        };
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Recent Contract Activity</h3>
      </div>
      
      {/* Contracts List */}
      {recentContracts.length === 0 ? (
        // Empty state
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-2">No recent contract activity</p>
          <p className="text-xs text-muted-foreground">
            Contract activities will appear here as they occur
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentContracts.map((contract, index) => {
            const statusConfig = getStatusConfig(contract.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div 
                key={contract.id} 
                className="group p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Title and Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground truncate flex-1">
                        {contract.title}
                      </h4>
                      <span className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
                        ${statusConfig.textColor} ${statusConfig.bgColor} ${statusConfig.borderColor}
                      `}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    
                    {/* Value and Time */}
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {contract.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(contract.lastActivity)}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {contract.description}
                    </p>
                    
                    {/* Timeline indicator */}
                    {index < recentContracts.length - 1 && (
                      <div className="absolute left-8 top-16 w-px h-8 bg-border opacity-50" />
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="View contract"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Edit contract"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {recentContracts.length} recent activities
          </div>
          <button className="text-sm text-primary hover:underline transition-colors flex items-center gap-1">
            View all contracts
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentContractsCard;