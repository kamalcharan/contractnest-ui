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
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

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
    const iconProps = { size: 16 };
    
    switch (type) {
      case 'contract':
        return <FileText {...iconProps} style={{ color: colors.brand.primary }} />;
      case 'appointment':
        return <Calendar {...iconProps} style={{ color: colors.brand.secondary }} />;
      case 'contact':
        return <Users {...iconProps} style={{ color: colors.brand.tertiary }} />;
      case 'task':
        return <CheckCircle {...iconProps} style={{ color: colors.semantic.success }} />;
      case 'message':
        return <MessageSquare {...iconProps} style={{ color: colors.brand.primary }} />;
      case 'email':
        return <Mail {...iconProps} style={{ color: colors.brand.secondary }} />;
      default:
        return <FileText {...iconProps} style={{ color: colors.utility.secondaryText }} />;
    }
  };

  // Color mapping for activity types
  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'contract':
        return colors.brand.primary + '10';
      case 'appointment':
        return colors.brand.secondary + '10';
      case 'contact':
        return colors.brand.tertiary + '10';
      case 'task':
        return colors.semantic.success + '10';
      case 'message':
        return colors.brand.primary + '10';
      case 'email':
        return colors.brand.secondary + '10';
      default:
        return colors.utility.secondaryText + '10';
    }
  };

  return (
    <div 
      className={`rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div 
        className="p-4 border-b transition-colors"
        style={{ borderColor: colors.utility.secondaryText + '20' }}
      >
        <h3 
          className="font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Recent Activity
        </h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={activity.id}>
            <div 
              className="p-4 transition-colors cursor-pointer hover:opacity-80"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '05';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="flex items-start">
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-colors"
                  style={{ backgroundColor: getActivityColor(activity.type) }}
                >
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p 
                      className="font-medium text-sm truncate transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {activity.title}
                    </p>
                    <span 
                      className="text-xs whitespace-nowrap ml-2 px-2 py-0.5 rounded-full transition-colors"
                      style={{
                        color: colors.utility.secondaryText,
                        backgroundColor: colors.utility.secondaryText + '10'
                      }}
                    >
                      {activity.time}
                    </span>
                  </div>
                  
                  <p 
                    className="text-sm mt-1 truncate transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {activity.description}
                  </p>
                  
                  {activity.user && (
                    <div className="flex items-center mt-2 justify-between">
                      <div className="flex items-center">
                        <div 
                          className="h-5 w-5 rounded-full flex items-center justify-center text-xs mr-1 flex-shrink-0 transition-colors"
                          style={{
                            backgroundColor: colors.brand.primary + '10',
                            color: colors.brand.primary
                          }}
                        >
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
                        <span 
                          className="text-xs transition-colors"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          {activity.user.name}
                        </span>
                      </div>
                      <ChevronRight 
                        size={14} 
                        style={{ color: colors.utility.secondaryText }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {index < activities.length - 1 && (
              <div 
                className="border-t"
                style={{ borderColor: colors.utility.secondaryText + '20' }}
              />
            )}
          </div>
        ))}
      </div>
      
      <div 
        className="p-3 border-t transition-colors"
        style={{
          borderColor: colors.utility.secondaryText + '20',
          backgroundColor: colors.utility.secondaryText + '05'
        }}
      >
        <button 
          className="text-sm w-full text-center py-1 rounded-md transition-colors hover:opacity-80"
          style={{
            color: colors.brand.primary,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          View all activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;