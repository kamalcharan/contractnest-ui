// src/components/dashboard/ActivityFeed.tsx
import React from 'react';
import { 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle, 
  MessageSquare,
  Mail,
  ChevronRight
} from 'lucide-react';

interface ActivityItem {
  id: string | number;
  type: 'contract' | 'appointment' | 'contact' | 'task' | 'message' | 'email';
  title: string;
  description: string;
  time: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface ActivityFeedProps {
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ className = '' }) => {
  // Mock activity data
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'contract',
      title: 'Contract created',
      description: 'Annual maintenance contract for Acme Corp.',
      time: '10 minutes ago',
      user: {
        name: 'John Doe',
      }
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Appointment scheduled',
      description: 'Equipment inspection at XYZ Industries.',
      time: '1 hour ago',
      user: {
        name: 'Sarah Johnson',
      }
    },
    {
      id: 3,
      type: 'task',
      title: 'Task completed',
      description: 'Send contract renewal reminder to TechSolutions.',
      time: '3 hours ago',
      user: {
        name: 'Michael Smith',
      }
    },
    {
      id: 4,
      type: 'message',
      title: 'New message',
      description: 'Question about service schedule from GlobalTech.',
      time: '5 hours ago',
      user: {
        name: 'Emma Wilson',
      }
    },
    {
      id: 5,
      type: 'contract',
      title: 'Contract signed',
      description: 'Service agreement with DataDrive Inc.',
      time: '1 day ago',
      user: {
        name: 'John Doe',
      }
    },
    {
      id: 6,
      type: 'email',
      title: 'Email sent',
      description: 'Quote for annual maintenance to NewCorp.',
      time: '1 day ago',
      user: {
        name: 'Sarah Johnson',
      }
    },
  ];

  // Icon mapping for activity types
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'contract':
        return <FileText size={16} className="text-primary" />;
      case 'appointment':
        return <Calendar size={16} className="text-indigo-500" />;
      case 'contact':
        return <Users size={16} className="text-orange-500" />;
      case 'task':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'message':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'email':
        return <Mail size={16} className="text-purple-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  // Color mapping for activity types
  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'contract':
        return 'bg-primary/10';
      case 'appointment':
        return 'bg-indigo-100 dark:bg-indigo-900/20';
      case 'contact':
        return 'bg-orange-100 dark:bg-orange-900/20';
      case 'task':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'message':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'email':
        return 'bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="font-medium">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-start">
              <div className={`h-10 w-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center mr-3 flex-shrink-0`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 bg-muted/50 px-2 py-0.5 rounded-full">{activity.time}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1 truncate">{activity.description}</p>
                
                {activity.user && (
                  <div className="flex items-center mt-2 justify-between">
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary mr-1 flex-shrink-0">
                        {activity.user.avatar ? (
                          <img 
                            src={activity.user.avatar} 
                            alt={activity.user.name} 
                            className="h-5 w-5 rounded-full"
                          />
                        ) : (
                          activity.user.name.charAt(0)
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-border bg-muted/10">
        <button className="text-sm text-primary hover:underline w-full text-center py-1 rounded-md hover:bg-muted/50 transition-colors">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;