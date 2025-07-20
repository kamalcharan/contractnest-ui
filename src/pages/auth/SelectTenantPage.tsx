// src/pages/auth/SelectTenantPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Search, 
  Crown, 
  Users, 
  Calendar,
  CheckCircle2,
  Star,
  ArrowRight,
  Sparkles,
  Shield
} from 'lucide-react';

interface TenantCardProps {
  tenant: any;
  onSelect: (tenant: any) => void;
  isSelected?: boolean;
}

const TenantCard: React.FC<TenantCardProps> = ({ tenant, onSelect, isSelected }) => {
  const getBadges = () => {
    const badges = [];
    if (tenant.is_default) badges.push({ label: 'Default', color: 'bg-blue-100 text-blue-700' });
    if (tenant.is_admin) badges.push({ label: 'Admin Workspace', color: 'bg-purple-100 text-purple-700' });
    if (tenant.is_owner) badges.push({ label: 'Owner', color: 'bg-green-100 text-green-700' });
    if (tenant.is_explicitly_assigned) badges.push({ label: 'Assigned', color: 'bg-gray-100 text-gray-700' });
    return badges;
  };

  const badges = getBadges();

  return (
    <button
      onClick={() => onSelect(tenant)}
      className={`
        w-full text-left p-6 rounded-xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.01]'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`
            w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl
            ${tenant.is_admin 
              ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg' 
              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
            }
          `}>
            {tenant.is_admin ? <Crown size={24} /> : tenant.name.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {tenant.name}
              {tenant.is_default && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Workspace Code: <span className="font-mono">{tenant.workspace_code}</span>
            </p>
            
            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <ArrowRight 
          size={20} 
          className={`
            text-gray-400 transition-all
            ${isSelected ? 'text-primary translate-x-1' : ''}
          `}
        />
      </div>
    </button>
  );
};

const SelectTenantPage: React.FC = () => {
  const { tenants, setCurrentTenant, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'admin' | 'assigned' | 'recent'>('all');
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  // Mock recent tenants - in production, this would come from localStorage or API
  const [recentTenantIds] = useState<string[]>([]);

  useEffect(() => {
    // Pre-select default tenant if exists
    const defaultTenant = tenants.find(t => t.is_default);
    if (defaultTenant) {
      setSelectedTenant(defaultTenant);
    }
  }, [tenants]);

  const handleSelectTenant = (tenant: any) => {
    setSelectedTenant(tenant);
  };

  const handleContinue = () => {
    if (selectedTenant) {
      setCurrentTenant(selectedTenant);
      navigate('/dashboard');
    }
  };

  const handleCreateTenant = () => {
    navigate('/create-tenant');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  // Filter tenants based on search and category
  const filteredTenants = tenants.filter(tenant => {
    // Search filter
    if (searchTerm && !tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !tenant.workspace_code.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    switch (selectedCategory) {
      case 'admin':
        return tenant.is_admin;
      case 'assigned':
        return tenant.is_explicitly_assigned;
      case 'recent':
        return recentTenantIds.includes(tenant.id);
      default:
        return true;
    }
  });

  // Group tenants for better organization (for admin users)
  const adminWorkspaces = filteredTenants.filter(t => t.is_admin);
  const assignedWorkspaces = filteredTenants.filter(t => !t.is_admin && t.is_explicitly_assigned);
  const otherWorkspaces = filteredTenants.filter(t => !t.is_admin && !t.is_explicitly_assigned);

  const isAdmin = user?.is_admin || false;
  const hasMultipleTenants = tenants.length > 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Select Workspace</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.first_name || user?.email}
                  {isAdmin && <span className="ml-2 text-purple-600">• System Admin</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filters - only show for admin users with many tenants */}
        {isAdmin && hasMultipleTenants && (
          <div className="mb-8 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search workspaces by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Category filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({tenants.length})
              </button>
              <button
                onClick={() => setSelectedCategory('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'admin'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin ({adminWorkspaces.length})
              </button>
              <button
                onClick={() => setSelectedCategory('assigned')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'assigned'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Assigned ({assignedWorkspaces.length})
              </button>
              {recentTenantIds.length > 0 && (
                <button
                  onClick={() => setSelectedCategory('recent')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'recent'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Recent ({recentTenantIds.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tenant grid/list */}
        <div className="space-y-6">
          {filteredTenants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No workspaces found</h3>
              <p className="mt-2 text-sm text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'You don\'t have access to any workspaces yet'}
              </p>
              <button
                onClick={handleCreateTenant}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                Create New Workspace
              </button>
            </div>
          ) : isAdmin && filteredTenants.length > 10 ? (
            // Grid view for admin users with many tenants
            <div>
              {adminWorkspaces.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="text-purple-600" size={20} />
                    Admin Workspaces
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminWorkspaces.map((tenant) => (
                      <TenantCard
                        key={tenant.id}
                        tenant={tenant}
                        onSelect={handleSelectTenant}
                        isSelected={selectedTenant?.id === tenant.id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {assignedWorkspaces.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="text-blue-600" size={20} />
                    Assigned Workspaces
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignedWorkspaces.map((tenant) => (
                      <TenantCard
                        key={tenant.id}
                        tenant={tenant}
                        onSelect={handleSelectTenant}
                        isSelected={selectedTenant?.id === tenant.id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {otherWorkspaces.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="text-gray-600" size={20} />
                    Other Workspaces
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {otherWorkspaces.map((tenant) => (
                      <TenantCard
                        key={tenant.id}
                        tenant={tenant}
                        onSelect={handleSelectTenant}
                        isSelected={selectedTenant?.id === tenant.id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // List view for regular users or few tenants
            <div className="space-y-3 max-w-2xl mx-auto">
              {filteredTenants.map((tenant) => (
                <TenantCard
                  key={tenant.id}
                  tenant={tenant}
                  onSelect={handleSelectTenant}
                  isSelected={selectedTenant?.id === tenant.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-between items-center max-w-2xl mx-auto">
          <button
            onClick={handleCreateTenant}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
          >
            Create New Workspace
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!selectedTenant}
            className={`
              px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all
              ${selectedTenant
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Continue to {selectedTenant?.name || 'Workspace'}
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Info section for admin users */}
        {isAdmin && (
          <div className="mt-12 p-6 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-start gap-4">
              <Sparkles className="text-purple-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-purple-900">System Admin Access</h3>
                <p className="text-purple-700 mt-1">
                  As a system administrator, you have access to all workspaces in the platform. 
                  Admin workspaces are marked with a crown icon and purple highlight.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTenantPage;