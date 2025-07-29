// src/components/contacts/view/cards/QuickStatsGrid.tsx
import React from 'react';
import { FileText, DollarSign, Settings, TrendingUp } from 'lucide-react';

interface QuickStatsGridProps {
  contact: any;
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({ contact }) => {
  // Mock statistics - these would come from API based on contact's actual data
  const stats = [
    {
      id: 'contracts',
      label: 'Active Contracts',
      value: '3',
      subValue: '2 expiring soon',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+1 this month'
    },
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: '₹2.4L',
      subValue: 'This year',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+15% vs last year'
    },
    {
      id: 'services',
      label: 'Active Services',
      value: '5',
      subValue: '1 renewal due',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: 'All running smoothly'
    },
    {
      id: 'engagement',
      label: 'Engagement Score',
      value: '87%',
      subValue: 'Last 30 days',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: '+5% improvement'
    }
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          
          return (
            <div 
              key={stat.id} 
              className={`p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor} hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/80 ${stat.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  {stat.label}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {stat.subValue}
                </p>
                <p className={`text-xs font-medium ${stat.color}`}>
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStatsGrid;