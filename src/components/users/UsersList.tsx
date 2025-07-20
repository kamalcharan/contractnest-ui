// src/components/users/UsersList.tsx
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone,
  ChevronDown,
  Users,
  Download,
  UserPlus,
  Building,
  User,
  Check,
  Eye,
  Edit,
  UserX,
  RefreshCw,
  Key
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_code: string;
  mobile_number?: string;
  status: 'active' | 'inactive' | 'suspended' | 'invited';
  role?: string;
  last_login?: string;
  created_at: string;
  invitation?: {
    id: string;
    sent_at: string;
    expires_at: string;
  };
  // Additional fields for organization check
  is_organization?: boolean;
  company_name?: string;
  contact_type?: string;
}

interface UsersListProps {
  users: User[];
  onViewUser?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onSuspendUser?: (user: User) => void;
  onResendInvitation?: (userId: string) => void;
  onInviteUser?: () => void;
  isLoading?: boolean;
  className?: string;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  onViewUser,
  onEditUser,
  onSuspendUser,
  onResendInvitation,
  onInviteUser,
  isLoading = false,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique roles and statuses for filters
  const uniqueRoles = useMemo(() => {
    const roles = new Set(users.map(user => user.role).filter(Boolean));
    return Array.from(roles);
  }, [users]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(users.map(user => user.status));
    return Array.from(statuses);
  }, [users]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const matches = 
          fullName.includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.user_code.toLowerCase().includes(search) ||
          (user.mobile_number && user.mobile_number.includes(search));
        
        if (!matches) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && user.status !== statusFilter) {
        return false;
      }

      // Role filter
      if (roleFilter !== 'all' && user.role !== roleFilter) {
        return false;
      }

      return true;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Export users to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Code', 'Mobile', 'Status', 'Role', 'Last Login', 'Created At'];
    const csvData = filteredUsers.map(user => [
      `${user.first_name} ${user.last_name}`,
      user.email,
      user.user_code,
      user.mobile_number || '',
      user.status,
      user.role || '',
      user.last_login ? new Date(user.last_login).toLocaleDateString() : '',
      new Date(user.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get member card component
  const MemberCard = ({ user }: { user: User }) => {
    const isOrganization = user.is_organization || user.contact_type === 'Vendor' || user.contact_type === 'Partner';
    const displayName = `${user.first_name} ${user.last_name}`.trim() || user.company_name || user.email;
    const initials = user.first_name && user.last_name 
      ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
      : displayName.substring(0, 2).toUpperCase();

    // Get status badge
    const getStatusBadge = () => {
      if (user.status === 'invited') {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Pending
          </span>
        );
      }
      return null;
    };

    // Get type badge
    const getTypeBadge = () => {
      if (user.role) {
        return (
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            user.role.toLowerCase() === 'admin' ? "bg-purple-100 text-purple-700" :
            user.role.toLowerCase() === 'owner' ? "bg-indigo-100 text-indigo-700" :
            "bg-blue-100 text-blue-700"
          )}>
            {user.role}
          </span>
        );
      }
      
      if (user.contact_type) {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {user.contact_type}
          </span>
        );
      }
      
      return null;
    };

    return (
      <div className="bg-card border-2 border-primary/20 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center text-white font-medium",
              isOrganization ? "bg-gray-500" : "bg-primary"
            )}>
              {isOrganization ? (
                <Building size={20} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground">{displayName}</h4>
                <span className="text-xs text-muted-foreground">#{user.user_code}</span>
                {getTypeBadge()}
                {getStatusBadge()}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={14} />
                    {user.email}
                  </span>
                )}
                {user.mobile_number && (
                  <span className="flex items-center gap-1">
                    <Phone size={14} />
                    {user.mobile_number}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <User size={14} />
                  Team
                </span>
                {user.status === 'active' && (
                  <Check size={16} className="text-green-600" />
                )}
              </div>
              
              {/* Additional info for invited users */}
              {user.status === 'invited' && user.invitation && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Invited {formatDistanceToNow(new Date(user.invitation.sent_at), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
          
          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
              onBlur={() => setTimeout(() => setOpenMenuId(null), 200)}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            
            {openMenuId === user.id && (
              <div className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
                <div className="py-1">
                  {onViewUser && (
                    <button
                      onClick={() => {
                        onViewUser(user);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center"
                    >
                      <Eye size={14} className="mr-2" />
                      View Details
                    </button>
                  )}
                  
                  {onEditUser && user.status === 'active' && (
                    <button
                      onClick={() => {
                        onEditUser(user);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center"
                    >
                      <Edit size={14} className="mr-2" />
                      Edit
                    </button>
                  )}
                  
                  {onResendInvitation && user.status === 'invited' && (
                    <button
                      onClick={() => {
                        onResendInvitation(user.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center"
                    >
                      <RefreshCw size={14} className="mr-2" />
                      Resend Invitation
                    </button>
                  )}
                  
                  {onSuspendUser && user.status === 'active' && (
                    <>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={() => {
                          onSuspendUser(user);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center text-destructive"
                      >
                        <UserX size={14} className="mr-2" />
                        Suspend
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with search and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-2",
              showFilters && "bg-muted"
            )}
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={16} className={cn(
              "transition-transform",
              showFilters && "rotate-180"
            )} />
          </button>

          <button
            onClick={exportToCSV}
            className="px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>

          {onInviteUser && (
            <button
              onClick={onInviteUser}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <UserPlus size={16} />
              Invite Team Member
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-muted/50 border border-border rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>
            Showing {filteredUsers.length} of {users.length} team members
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>{users.filter(u => u.status === 'active').length} Active</span>
          <span>{users.filter(u => u.status === 'invited').length} Invited</span>
        </div>
      </div>

      {/* Team Members List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Users size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No team members found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by inviting team members to your workspace'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <MemberCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;