// src/components/contacts/view/cards/RecentActivityCard.tsx
import React from 'react';
import { Clock, Edit, Phone, Mail, MessageCircle, FileText, Calendar, User } from 'lucide-react';

interface RecentActivityCardProps {
  contact: any;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ contact }) => {
  // Mock recent activity data - this would come from API
  const recentActivities = [
    {
      id: '1',
      type: 'contact_updated',
      description: 'Contact information updated',
      timestamp: '2024-01-15T14:30:00Z',
      user: 'System',
      icon: Edit,
      color: 'text-blue-600'
    },
    {
      id: '2',
      type: 'phone_call',
      description: 'Phone call completed (15 minutes)',
      timestamp: '2024-01-14T10:15:00Z',
      user: 'John Smith',
      icon: Phone,
      color: 'text-green-600'
    },
    {
      id: '3',
      type: 'email_sent',
      description: 'Proposal email sent',
      timestamp: '2024-01-12T16:45:00Z',
      user: 'Sarah Wilson',
      icon: Mail,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'meeting_scheduled',
      description: 'Follow-up meeting scheduled for Jan 20th',
      timestamp: '2024-01-10T09:00:00Z',
      user: 'Mike Johnson',
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      id: '5',
      type: 'contact_created',
      description: 'Contact added to system',
      timestamp: contact.created_at,
      user: 'System',
      icon: User,
      color: 'text-gray-600'
    }
  ];

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
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {recentActivities.map((activity) => {
          const IconComponent = activity.icon;
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-full bg-muted/50 ${activity.color}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {activity.user}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:underline">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivityCard;