// src/components/contracts/ContractStatsGrid.tsx
import React from 'react';
import { FileText, Send, MessageSquare, CheckCircle, Archive } from 'lucide-react';

interface ContractStatsGridProps {
  contractStats: {
    draft: number;
    sent: number;
    negotiation: number;
    inForce: number;
    completed: number;
  };
  contactId: string;
}

const ContractStatsGrid: React.FC<ContractStatsGridProps> = ({ contractStats, contactId }) => {
  const stats = [
    {
      id: 'draft',
      label: 'Draft',
      count: contractStats.draft,
      description: 'Being prepared',
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      hoverColor: 'hover:bg-gray-100'
    },
    {
      id: 'sent',
      label: 'Sent',
      count: contractStats.sent,
      description: 'Awaiting response',
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'negotiation',
      label: 'Negotiation',
      count: contractStats.negotiation,
      description: 'Under discussion',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      id: 'inForce',
      label: 'In Force',
      count: contractStats.inForce,
      description: 'Currently active',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'completed',
      label: 'Completed',
      count: contractStats.completed,
      description: 'Finished contracts',
      icon: Archive,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  const totalContracts = Object.values(contractStats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Contract Overview</h3>
          <p className="text-sm text-muted-foreground">
            {totalContracts} total contracts with this contact
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{totalContracts}</div>
          <div className="text-xs text-muted-foreground">Total Contracts</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          
          return (
            <div 
              key={stat.id} 
              className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${stat.bgColor} ${stat.borderColor} ${stat.hoverColor}
                ${stat.count > 0 ? 'hover:shadow-md' : 'opacity-75'}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/80 ${stat.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {stat.count}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-1 text-sm">
                  {stat.label}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              
              {/* Progress indicator */}
              {totalContracts > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${stat.color.replace('text-', 'bg-')}`}
                      style={{ width: `${(stat.count / totalContracts) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Summary Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {contractStats.inForce}
            </div>
            <div className="text-xs text-muted-foreground">Active Now</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {contractStats.sent + contractStats.negotiation}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">
              {contractStats.completed}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-600">
              {contractStats.draft}
            </div>
            <div className="text-xs text-muted-foreground">In Draft</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractStatsGrid;