// src/components/contracts/RecentContractsCard.tsx
import React from 'react';
import { Clock, FileText, Send, MessageSquare, CheckCircle, Eye, Edit } from 'lucide-react';

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
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
          icon: FileText 
        };
      case 'sent':
        return { 
          label: 'Sent', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100',
          icon: Send 
        };
      case 'negotiation':
        return { 
          label: 'Negotiation', 
          color: 'text-orange-600', 
          bgColor: 'bg-orange-100',
          icon: MessageSquare 
        };
      case 'inForce':
        return { 
          label: 'In Force', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          icon: CheckCircle 
        };
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'text-purple-600', 
          bgColor: 'bg-purple-100',
          icon: CheckCircle 
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
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
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Recent Contract Activity</h3>
      </div>
      
      <div className="space-y-4">
        {recentContracts.map((contract) => {
          const statusConfig = getStatusConfig(contract.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={contract.id} className="p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground truncate">
                      {contract.title}
                    </h4>
                    <span className={`
                      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                      ${statusConfig.color} ${statusConfig.bgColor}
                    `}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-semibold text-green-600">
                      {contract.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(contract.lastActivity)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {contract.description}
                  </p>
                </div>
                
                <div className="flex gap-1 ml-4">
                  <button 
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="View contract"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="Edit contract"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:underline">
          View all contracts
        </button>
      </div>
    </div>
  );
};

export default RecentContractsCard;