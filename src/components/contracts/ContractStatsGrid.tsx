// src/components/contracts/ContractStatsGrid.tsx - Theme Enabled Version
import React from 'react';
import { FileText, Send, MessageSquare, CheckCircle, Archive, TrendingUp } from 'lucide-react';

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
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800',
      hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-900/30',
      progressColor: 'bg-gray-500'
    },
    {
      id: 'sent',
      label: 'Sent',
      count: contractStats.sent,
      description: 'Awaiting response',
      icon: Send,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
      progressColor: 'bg-blue-500'
    },
    {
      id: 'negotiation',
      label: 'Negotiation',
      count: contractStats.negotiation,
      description: 'Under discussion',
      icon: MessageSquare,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
      progressColor: 'bg-orange-500'
    },
    {
      id: 'inForce',
      label: 'In Force',
      count: contractStats.inForce,
      description: 'Currently active',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30',
      progressColor: 'bg-green-500'
    },
    {
      id: 'completed',
      label: 'Completed',
      count: contractStats.completed,
      description: 'Finished contracts',
      icon: Archive,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
      progressColor: 'bg-purple-500'
    }
  ];

  const totalContracts = Object.values(contractStats).reduce((sum, count) => sum + count, 0);

  // Calculate key metrics
  const activeContracts = contractStats.inForce;
  const inProgressContracts = contractStats.sent + contractStats.negotiation;
  const completionRate = totalContracts > 0 ? Math.round((contractStats.completed / totalContracts) * 100) : 0;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Contract Overview</h3>
          <p className="text-sm text-muted-foreground">
            {totalContracts} total contract{totalContracts !== 1 ? 's' : ''} with this contact
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{totalContracts}</div>
          <div className="text-xs text-muted-foreground">Total Contracts</div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          const percentage = totalContracts > 0 ? (stat.count / totalContracts) * 100 : 0;
          
          return (
            <div 
              key={stat.id} 
              className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200 group
                ${stat.bgColor} ${stat.borderColor} ${stat.hoverColor}
                ${stat.count > 0 ? 'hover:shadow-md hover:scale-[1.02]' : 'opacity-75'}
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform">
                  {stat.count}
                </span>
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <h4 className="font-medium text-foreground text-sm">
                  {stat.label}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                
                {/* Percentage indicator */}
                {totalContracts > 0 && (
                  <div className="text-xs font-medium text-center text-muted-foreground">
                    {Math.round(percentage)}%
                  </div>
                )}
              </div>
              
              {/* Progress indicator */}
              {totalContracts > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${stat.progressColor}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {activeContracts}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Active Now</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {inProgressContracts}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Archive className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {contractStats.completed}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <div className="text-lg font-semibold text-foreground">
              {completionRate}%
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Completion Rate</div>
        </div>
      </div>
      
      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button className="text-sm text-primary hover:underline transition-colors">
            View detailed analytics →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractStatsGrid;