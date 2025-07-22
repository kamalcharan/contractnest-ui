// src/pages/settings/users/userview.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Clock,
  Edit,
  UserX,
  RefreshCw,
  Download,
  Activity,
  Key,
  Globe,
  Building,
  Loader2
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import UserStatusBadge, { UserRoleBadge } from '@/components/users/UserStatusBadge';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/context/AuthContext';

type TabType = 'overview' | 'activity' | 'permissions';

const UserViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, currentTenant } = useAuth();
  const { 
    getUser, 
    suspendUser, 
    activateUser, 
    resetUserPassword,
    getUserActivity,
    submitting 
  } = useUsers({ autoLoad: false });
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  
  // Check if viewing own profile
  const isOwnProfile = currentUser?.id === id;
  
  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const userData = await getUser(id);
        if (userData) {
          setUser(userData);
        } else {
          toast.error('User not found');
          navigate('/settings/users');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [id]);
  
  // Fetch activity log when activity tab is selected
  useEffect(() => {
    const fetchActivity = async () => {
      if (!id || activeTab !== 'activity') return;
      
      setActivityLoading(true);
      try {
        const activities = await getUserActivity(id, 30);
        setActivityLog(activities);
      } catch (error) {
        console.error('Error fetching activity:', error);
        toast.error('Failed to load activity log');
      } finally {
        setActivityLoading(false);
      }
    };
    
    fetchActivity();
  }, [id, activeTab]);
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/settings/users');
  };
  
  // Handle edit user
  const handleEdit = () => {
    navigate(`/settings/users/edit/${id}`);
  };
  
  // Handle suspend user
  const handleSuspend = async () => {
    if (!user) return;
    
    if (confirm(`Are you sure you want to suspend ${user.first_name} ${user.last_name}?`)) {
      const success = await suspendUser(user.user_id);
      if (success) {
        setUser((prev: any) => ({ ...prev, status: 'suspended' }));
      }
    }
  };
  
  // Handle activate user
  const handleActivate = async () => {
    if (!user) return;
    
    const success = await activateUser(user.user_id);
    if (success) {
      setUser((prev: any) => ({ ...prev, status: 'active' }));
    }
  };
  
  // Handle reset password
  const handleResetPassword = async () => {
    if (!user) return;
    
    if (confirm('Send password reset email to this user?')) {
      await resetUserPassword(user.user_id);
    }
  };
  
  // Export user data
  const handleExportData = () => {
    if (!user) return;
    
    const data = {
      user: user,
      activity_log: activityLog
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-${user.user_code}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Get action icon and color
  const getActionIcon = (action: string) => {
    const icons = {
      login: { icon: Activity, color: 'text-green-600' },
      logout: { icon: Activity, color: 'text-gray-600' },
      password_changed: { icon: Key, color: 'text-blue-600' },
      profile_updated: { icon: User, color: 'text-purple-600' },
      failed_login: { icon: Shield, color: 'text-red-600' },
      user_suspended: { icon: UserX, color: 'text-red-600' },
      user_activated: { icon: Shield, color: 'text-green-600' },
      role_assigned: { icon: Shield, color: 'text-blue-600' },
      role_removed: { icon: Shield, color: 'text-orange-600' }
    };
    return icons[action as keyof typeof icons] || { icon: Activity, color: 'text-gray-600' };
  };
  
  if (loading) {
    return (
      <div className="p-6 bg-muted/20 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-6 bg-muted/20 min-h-screen">
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">User not found</h3>
          <button
            onClick={handleBack}
            className="text-primary hover:underline"
          >
            Back to users
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-muted/20 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={handleBack} 
              className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">User Profile</h1>
              <p className="text-muted-foreground">
                View and manage user information
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            
            {!isOwnProfile && (
              <>
                <button
                  onClick={handleEdit}
                  className="px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                
                {user.status === 'active' && (
                  <button
                    onClick={handleSuspend}
                    disabled={submitting}
                    className="px-3 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors flex items-center gap-2"
                  >
                    <UserX size={16} />
                    Suspend
                  </button>
                )}
                
                {user.status === 'suspended' && (
                  <button
                    onClick={handleActivate}
                    disabled={submitting}
                    className="px-3 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-600/10 transition-colors flex items-center gap-2"
                  >
                    <Shield size={16} />
                    Activate
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* User Info Header */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">
                    {user.first_name} {user.last_name}
                  </h2>
                  <UserStatusBadge status={user.status} size="sm" />
                  {user.role && <UserRoleBadge role={user.role} size="sm" />}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail size={14} />
                    {user.email}
                  </span>
                  {user.mobile_number && (
                    <span className="flex items-center gap-1">
                      <Phone size={14} />
                      {user.mobile_number}
                    </span>
                  )}
                  <span>Code: {user.user_code}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </span>
                  {user.last_login && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Last active {formatDistanceToNow(new Date(user.last_login), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {!isOwnProfile && (
              <button
                onClick={handleResetPassword}
                disabled={submitting}
                className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors"
              >
                Reset Password
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'activity', label: 'Activity Log' },
              { id: 'permissions', label: 'Permissions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-card border border-border rounded-lg p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Profile Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="mt-1">{user.first_name} {user.last_name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                    <p className="mt-1">{user.mobile_number || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Code</label>
                    <p className="mt-1 font-mono">{user.user_code}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="mt-1">{user.department || 'Not assigned'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                    <p className="mt-1">{user.employee_id || 'Not assigned'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="mt-1 flex items-center gap-1">
                      <Globe size={14} />
                      {user.country_code || 'Not set'} • {user.timezone || 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preferred Language</label>
                    <p className="mt-1">{user.preferred_language?.toUpperCase() || 'EN'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Information */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Security Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                    <p className="mt-1">
                      {user.last_login ? format(new Date(user.last_login), 'PPpp') : 'Never'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Logins</label>
                    <p className="mt-1">{user.stats?.total_logins || 0}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Password Change</label>
                    <p className="mt-1">
                      {user.stats?.last_password_change 
                        ? format(new Date(user.stats.last_password_change), 'PP')
                        : 'Never'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Failed Login Attempts</label>
                    <p className="mt-1 flex items-center gap-2">
                      {user.stats?.failed_login_attempts || 0}
                      {user.stats?.last_failed_login && (
                        <span className="text-sm text-muted-foreground">
                          (Last: {formatDistanceToNow(new Date(user.stats.last_failed_login), { addSuffix: true })})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            {activityLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : activityLog.length > 0 ? (
              <div className="space-y-3">
                {activityLog.map((activity) => {
                  const { icon: Icon, color } = getActionIcon(activity.action);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 py-3 border-b border-border last:border-0">
                      <div className={cn("p-2 rounded-full bg-muted", color)}>
                        <Icon size={16} />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">
{activity.action.split('_').map((word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{format(new Date(activity.timestamp || activity.created_at), 'PPpp')}</span>
                          {activity.ip_address && <span>IP: {activity.ip_address}</span>}
                          {activity.user_agent && <span>{activity.user_agent.split('/')[0]}</span>}
                        </div>
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            {JSON.stringify(activity.metadata)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No activity recorded
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'permissions' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">User Permissions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={20} className="text-primary" />
                  <span className="font-medium">Role: {user.role || 'No role assigned'}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.role 
                    ? `This user has ${user.role.toLowerCase()} privileges in the workspace.`
                    : 'This user has not been assigned any role yet.'
                  }
                </p>
              </div>
              
              {user.assigned_roles && user.assigned_roles.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Assigned Roles</h4>
                  <div className="space-y-2">
                    {user.assigned_roles.map((role: any) => (
                      <div key={role.id} className="p-3 bg-muted/30 rounded-md">
                        <div className="font-medium">{role.name}</div>
                        {role.description && (
                          <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                        )}
                        {role.permissions && role.permissions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                              {role.permissions.map((permission: string) => (
                                <span
                                  key={permission}
                                  className="text-xs px-2 py-1 bg-muted rounded-md font-mono"
                                >
                                  {permission}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(!user.assigned_roles || user.assigned_roles.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No roles or permissions assigned
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserViewPage;