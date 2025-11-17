// src/pages/VaNi/channels/BBBAdminDashboard.tsx
// File 13/13 - BBB Admin Dashboard

import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  BarChart3,
  Shield,
  X
} from 'lucide-react';
import BBBMemberTable from '../../../components/VaNi/bbb/BBBMemberTable';
import ProfileCard from '../../../components/VaNi/bbb/ProfileCard';
import { mockMarketProfiles, mockTenantProfiles, mockAdminStats } from '../../../utils/fakejson/bbbMockData';
import toast from 'react-hot-toast';

const BBBAdminDashboard: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Get stats
  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: mockAdminStats.total_members,
      color: colors.brand.primary,
      bgColor: `${colors.brand.primary}20`
    },
    {
      icon: CheckCircle,
      label: 'Active Members',
      value: mockAdminStats.active_members,
      color: colors.semantic.success,
      bgColor: `${colors.semantic.success}20`
    },
    {
      icon: Clock,
      label: 'Pending Approvals',
      value: mockAdminStats.pending_approvals,
      color: colors.semantic.warning,
      bgColor: `${colors.semantic.warning}20`
    },
    {
      icon: XCircle,
      label: 'Inactive Members',
      value: mockAdminStats.inactive_members,
      color: colors.utility.secondaryText,
      bgColor: `${colors.utility.secondaryText}20`
    }
  ];

  // Handle view
  const handleView = (profileId: string) => {
    setSelectedProfileId(profileId);
    setViewModalOpen(true);
  };

  // Handle edit
  const handleEdit = (profileId: string) => {
    const profile = mockMarketProfiles.find(p => p.id === profileId);
    const tenantProfile = mockTenantProfiles.find(t => t.tenant_id === profile?.tenant_id);
    
    toast.success(`Opening editor for ${tenantProfile?.business_name}`, {
      style: { background: colors.brand.primary, color: '#FFF' }
    });
    
    // In real app: navigate to edit page or open edit modal
    // navigate(`/vani/channels/bbb/edit/${profileId}`);
  };

  // Handle delete
  const handleDelete = (profileId: string) => {
    const profile = mockMarketProfiles.find(p => p.id === profileId);
    const tenantProfile = mockTenantProfiles.find(t => t.tenant_id === profile?.tenant_id);
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${tenantProfile?.business_name}?\n\nThis will set the profile to inactive.`
    );
    
    if (confirmed) {
      toast.success(`${tenantProfile?.business_name} has been deleted (set to inactive)`, {
        style: { background: colors.semantic.success, color: '#FFF' }
      });
      
      // In real app: call API to soft delete (set is_active = false)
    }
  };

  // Get selected profile data
  const selectedProfile = selectedProfileId 
    ? mockMarketProfiles.find(p => p.id === selectedProfileId)
    : null;
  const selectedTenantProfile = selectedProfile
    ? mockTenantProfiles.find(t => t.tenant_id === selectedProfile.tenant_id)
    : null;

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: colors.utility.primaryText }}
          >
            BBB Admin Dashboard
          </h1>
          <p
            className="text-lg"
            style={{ color: colors.utility.secondaryText }}
          >
            Manage BBB Directory members and monitor activity
          </p>
        </div>
        <div
          className="p-3 rounded-full"
          style={{
            backgroundColor: `${colors.brand.primary}20`
          }}
        >
          <Shield className="w-8 h-8" style={{ color: colors.brand.primary }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-6"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: stat.bgColor
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="text-right">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: colors.utility.secondaryText }}
              >
                {stat.label}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Branch Distribution */}
      <Card
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.utility.primaryText }}>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Branch Distribution</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAdminStats.branches.map((branch, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  border: `1px solid ${colors.utility.primaryText}15`
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="font-semibold capitalize"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {branch.name}
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.brand.primary }}
                  >
                    {branch.count}
                  </p>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: `${colors.utility.primaryText}15`
                  }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(branch.count / mockAdminStats.total_members) * 100}%`,
                      backgroundColor: colors.brand.primary
                    }}
                  />
                </div>
                <p
                  className="text-xs mt-2"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {((branch.count / mockAdminStats.total_members) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.utility.primaryText }}>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Activity</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                action: 'Profile created',
                member: 'Vikuna Technologies',
                time: '2 hours ago',
                color: colors.semantic.success
              },
              {
                action: 'Profile updated',
                member: 'DigiGrow Marketing',
                time: '5 hours ago',
                color: colors.semantic.info
              },
              {
                action: 'Pending approval',
                member: 'Legal Solutions & Associates',
                time: '1 day ago',
                color: colors.semantic.warning
              }
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  border: `1px solid ${colors.utility.primaryText}10`
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activity.color }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {activity.member}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {activity.action}
                  </p>
                </div>
                <p
                  className="text-xs"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Table */}
      <BBBMemberTable
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* View Modal */}
      {viewModalOpen && selectedTenantProfile && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setViewModalOpen(false)}
            style={{ backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                border: `1px solid ${colors.utility.primaryText}20`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:opacity-80 z-10"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.secondaryText
                }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div
                className="p-6 border-b"
                style={{
                  borderColor: `${colors.utility.primaryText}15`,
                  background: `linear-gradient(135deg, ${colors.brand.primary}10 0%, ${colors.brand.secondary}10 100%)`
                }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.utility.primaryText }}
                >
                  View Member Profile
                </h2>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                <ProfileCard profile={selectedTenantProfile} showTitle={false} />

                {/* Profile Details */}
                {selectedProfile && (
                  <div className="mt-6 space-y-4">
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: colors.utility.secondaryBackground,
                        border: `1px solid ${colors.utility.primaryText}15`
                      }}
                    >
                      <h3
                        className="text-sm font-semibold mb-3"
                        style={{ color: colors.utility.primaryText }}
                      >
                        Profile Description
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {selectedProfile.ai_enhanced_description || selectedProfile.short_description || 'No description available'}
                      </p>
                    </div>

                    {/* Keywords */}
                    {selectedProfile.approved_keywords.length > 0 && (
                      <div
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: colors.utility.secondaryBackground,
                          border: `1px solid ${colors.utility.primaryText}15`
                        }}
                      >
                        <h3
                          className="text-sm font-semibold mb-3"
                          style={{ color: colors.utility.primaryText }}
                        >
                          Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfile.approved_keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${colors.semantic.success}20`,
                                color: colors.semantic.success
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BBBAdminDashboard;