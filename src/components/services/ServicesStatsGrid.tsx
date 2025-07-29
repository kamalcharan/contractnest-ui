// src/components/services/ServicesStatsGrid.tsx
import React from 'react';
import { Play, RefreshCw, CheckCircle, Pause, Calendar, Archive } from 'lucide-react';

interface ServicesStatsGridProps {
  servicesStats: {
    active: number;
    renewalDue: number;
    completed: number;
    paused: number;
    upcoming: number;
    inactive: number;
  };
  contactId: string;
  showInactive: boolean;
  showUpcoming: boolean;
}

const ServicesStatsGrid: React.FC<ServicesStatsGridProps> = ({ 
  servicesStats, 
  contactId,
  showInactive,
  showUpcoming 
}) => {
  const stats = [
    {
      id: 'active',
      label: 'Active Services',
      count: servicesStats.active,
      description: 'Currently running',
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      priority: 'success',
      alwaysShow: true
    },
    {
      id: 'renewalDue',
      label: 'Renewal Due',
      count: servicesStats.renewalDue,
      description: 'Expiring soon',
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      priority: 'high',
      alwaysShow: true
    },
    {
      id: 'completed',
      label: 'Completed',
      count: servicesStats.completed,
      description: 'Successfully finished',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      priority: 'normal',
      alwaysShow: true
    },
    {
      id: 'paused',
      label: 'Paused',
      count: servicesStats.paused,
      description: 'Temporarily stopped',
      icon: Pause,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      hoverColor: 'hover:bg-yellow-100',
      priority: 'medium',
      alwaysShow: true
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: servicesStats.upcoming,
      description: 'Scheduled to start',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100',
      priority: 'normal',
      alwaysShow: false,
      showCondition: showUpcoming
    },
    {
      id: 'inactive',
      label: 'Inactive',
      count: servicesStats.inactive,
      description: 'Ended or cancelled',
      icon: Archive,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      hoverColor: 'hover:bg-gray-100',
      priority: 'low',
      alwaysShow: false,
      showCondition: showInactive
    }
  ];

  // Filter stats based on show conditions
  const visibleStats = stats.filter(stat => 
    stat.alwaysShow || (stat.showCondition !== undefined ? stat.showCondition : true)
  );

  const totalServices = visibleStats.reduce((sum, stat) => sum + stat.count, 0);
  const activeServices = servicesStats.active + servicesStats.renewalDue;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Services Overview</h3>
          <p className="text-sm text-muted-foreground">
            {totalServices} total services • {activeServices} currently active
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {servicesStats.active}
          </div>
          <div className="text-xs text-muted-foreground">Active Now</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleStats.map((stat) => {
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
                <p className="text-xs text-muted-foreground mb-2">
                  {stat.description}
                </p>
              </div>
              
              {/* Priority indicators */}
              {stat.priority === 'high' && stat.count > 0 && (
                <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                  <RefreshCw className="h-3 w-3" />
                  Action Required
                </div>
              )}
              
              {stat.priority === 'success' && stat.count > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Play className="h-3 w-3" />
                  Running Well
                </div>
              )}

              {/* Progress indicator */}
              {totalServices > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${stat.color.replace('text-', 'bg-')}`}
                      style={{ width: `${(stat.count / totalServices) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Service Health Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {servicesStats.active}
            </div>
            <div className="text-xs text-muted-foreground">Running</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600">
              {servicesStats.renewalDue}
            </div>
            <div className="text-xs text-muted-foreground">Due Soon</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {servicesStats.completed}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">
              {servicesStats.paused}
            </div>
            <div className="text-xs text-muted-foreground">Paused</div>
          </div>
        </div>
      </div>

      {/* Service Efficiency Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Service Success Rate</span>
          <span className="font-medium">
            {Math.round((servicesStats.completed / Math.max(servicesStats.completed + servicesStats.paused + servicesStats.inactive, 1)) * 100)}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min((servicesStats.completed / Math.max(servicesStats.completed + servicesStats.paused + servicesStats.inactive, 1)) * 100, 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ServicesStatsGrid;