// src/components/services/RecentServicesCard.tsx - Theme Enabled Version
import React from 'react';
import { Clock, Play, Pause, CheckCircle, RefreshCw, Calendar, Archive, Eye, Edit } from 'lucide-react';

interface RecentServicesCardProps {
  contactId: string;
  showInactive: boolean;
  showUpcoming: boolean;
}

const RecentServicesCard: React.FC<RecentServicesCardProps> = ({ 
  contactId, 
  showInactive, 
  showUpcoming 
}) => {
  // Mock recent services data - this would come from API
  const recentServices = [
    {
      id: '1',
      title: 'Website Maintenance & Support',
      status: 'active',
      type: 'recurring',
      value: 15000,
      currency: 'INR',
      startDate: '2024-01-01',
      renewalDate: '2024-04-01',
      lastActivity: '2024-01-15T10:30:00Z',
      activityType: 'service_delivered',
      description: 'Monthly maintenance completed successfully'
    },
    {
      id: '2', 
      title: 'Mobile App Development',
      status: 'renewalDue',
      type: 'project',
      value: 85000,
      currency: 'INR',
      startDate: '2023-10-01',
      renewalDate: '2024-01-25',
      lastActivity: '2024-01-14T16:45:00Z',
      activityType: 'renewal_reminder_sent',
      description: 'Renewal reminder sent to client'
    },
    {
      id: '3',
      title: 'Cloud Hosting Services',
      status: 'active',
      type: 'recurring',
      value: 8000,
      currency: 'INR',
      startDate: '2023-12-01',
      renewalDate: '2024-12-01',
      lastActivity: '2024-01-12T09:15:00Z',
      activityType: 'billing_generated',
      description: 'Monthly billing generated'
    },
    {
      id: '4',
      title: 'SEO Optimization',
      status: 'completed',
      type: 'project',
      value: 25000,
      currency: 'INR',
      startDate: '2023-11-01',
      completedDate: '2024-01-10',
      lastActivity: '2024-01-10T14:20:00Z',
      activityType: 'service_completed',
      description: 'Project completed and delivered'
    },
    {
      id: '5',
      title: 'Social Media Management',
      status: 'paused',
      type: 'recurring',
      value: 12000,
      currency: 'INR',
      startDate: '2023-09-01',
      pausedDate: '2024-01-05',
      lastActivity: '2024-01-05T11:00:00Z',
      activityType: 'service_paused',
      description: 'Service paused at client request'
    },
    {
      id: '6',
      title: 'Email Marketing Setup',
      status: 'upcoming',
      type: 'project',
      value: 18000,
      currency: 'INR',
      startDate: '2024-02-01',
      lastActivity: '2024-01-08T12:30:00Z',
      activityType: 'service_scheduled',
      description: 'Service scheduled to begin next month'
    },
    {
      id: '7',
      title: 'Legacy System Migration',
      status: 'inactive',
      type: 'project',
      value: 150000,
      currency: 'INR',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      lastActivity: '2023-12-31T18:00:00Z',
      activityType: 'service_ended',
      description: 'Service contract ended'
    }
  ];

  // Filter services based on show conditions
  const filteredServices = recentServices.filter(service => {
    if (service.status === 'inactive' && !showInactive) return false;
    if (service.status === 'upcoming' && !showUpcoming) return false;
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          label: 'Active', 
          color: 'text-green-600 dark:text-green-400', 
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: Play 
        };
      case 'renewalDue':
        return { 
          label: 'Renewal Due', 
          color: 'text-orange-600 dark:text-orange-400', 
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          icon: RefreshCw 
        };
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'text-blue-600 dark:text-blue-400', 
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: CheckCircle 
        };
      case 'paused':
        return { 
          label: 'Paused', 
          color: 'text-yellow-600 dark:text-yellow-400', 
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: Pause 
        };
      case 'upcoming':
        return { 
          label: 'Upcoming', 
          color: 'text-purple-600 dark:text-purple-400', 
          bgColor: 'bg-purple-100 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-800',
          icon: Calendar 
        };
      case 'inactive':
        return { 
          label: 'Inactive', 
          color: 'text-muted-foreground', 
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: Archive 
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'text-muted-foreground', 
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: Play 
        };
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbols = { INR: '₹', USD: '$', EUR: '€' };
    const symbol = symbols[currency as keyof typeof symbols] || currency;
    
    if (currency === 'INR') {
      if (amount >= 100000) {
        return `${symbol}${(amount / 100000).toFixed(1)}L`;
      } else if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)}K`;
      }
      return `${symbol}${amount.toLocaleString()}`;
    } else {
      if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)}K`;
      }
      return `${symbol}${amount.toLocaleString()}`;
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
        <h3 className="text-lg font-semibold text-foreground">Recent Service Activity</h3>
      </div>
      
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const statusConfig = getStatusConfig(service.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={service.id} className="p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground truncate">
                      {service.title}
                    </h4>
                    <span className={`
                      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
                      ${statusConfig.color} ${statusConfig.bgColor} ${statusConfig.borderColor}
                    `}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs border border-border">
                      {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 text-sm">
                    <div>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatAmount(service.value, service.currency)}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {service.renewalDate && service.status === 'renewalDue' && (
                        <>Renewal: {new Date(service.renewalDate).toLocaleDateString()}</>
                      )}
                      {service.completedDate && (
                        <>Completed: {new Date(service.completedDate).toLocaleDateString()}</>
                      )}
                      {service.startDate && !service.completedDate && !service.renewalDate && (
                        <>Started: {new Date(service.startDate).toLocaleDateString()}</>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(service.lastActivity)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                
                <div className="flex gap-1 ml-4">
                  <button 
                    className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="View service details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Edit service"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Renewal warning */}
              {service.status === 'renewalDue' && (
                <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                    <RefreshCw className="h-4 w-4" />
                    <span>
                      Renewal due in {Math.ceil((new Date(service.renewalDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No services match the current filter settings
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:underline">
          View all services
        </button>
      </div>
    </div>
  );
};

export default RecentServicesCard;