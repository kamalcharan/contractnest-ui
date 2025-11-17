// src/components/VaNi/bbb/BBBMemberTable.tsx
// File 12/13 - BBB Member Table Component for Admin

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import {
  Eye,
  Edit3,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TenantMarketProfile, TenantProfile } from '../../../types/bbb';
import { mockMarketProfiles, mockTenantProfiles } from '../../../utils/fakejson/bbbMockData';

interface BBBMemberTableProps {
  onView: (profileId: string) => void;
  onEdit: (profileId: string) => void;
  onDelete: (profileId: string) => void;
}

const BBBMemberTable: React.FC<BBBMemberTableProps> = ({ onView, onEdit, onDelete }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Filters
  const [branchFilter, setBranchFilter] = useState<string>('bagyanagar');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get combined data
  const combinedData = useMemo(() => {
    return mockMarketProfiles.map(profile => {
      const tenantProfile = mockTenantProfiles.find(t => t.tenant_id === profile.tenant_id);
      return { profile, tenantProfile };
    });
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return combinedData.filter(item => {
      const matchesBranch = branchFilter === 'all' || item.profile.branch === branchFilter;
      const matchesStatus = statusFilter === 'all' || item.profile.profile_status === statusFilter;
      const matchesSearch = !searchQuery || 
        item.tenantProfile?.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.profile.business_category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesBranch && matchesStatus && matchesSearch && item.profile.is_active;
    });
  }, [combinedData, branchFilter, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [branchFilter, statusFilter, searchQuery]);

  // Status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        icon: CheckCircle,
        color: colors.semantic.success,
        label: 'Active'
      },
      pending: {
        icon: Clock,
        color: colors.semantic.warning,
        label: 'Pending'
      },
      inactive: {
        icon: XCircle,
        color: colors.utility.secondaryText,
        label: 'Inactive'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span
        className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${config.color}20`,
          color: config.color
        }}
      >
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <Card
      style={{
        backgroundColor: colors.utility.primaryBackground,
        borderColor: `${colors.utility.primaryText}20`
      }}
    >
      <CardHeader
        style={{
          background: `linear-gradient(135deg, ${colors.brand.primary}15 0%, ${colors.brand.secondary}15 100%)`,
          borderBottom: `1px solid ${colors.utility.primaryText}15`
        }}
      >
        <CardTitle style={{ color: colors.utility.primaryText }}>
          BBB Members Directory
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Filters and Search */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Branch Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.utility.primaryText }}
              >
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Branch</span>
                </div>
              </label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: `${colors.utility.secondaryText}40`,
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              >
                <option value="bagyanagar">Bagyanagar</option>
                <option value="kukatpally">Kukatpally</option>
                <option value="madhapur">Madhapur</option>
                <option value="all">All Branches</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.utility.primaryText }}
              >
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: `${colors.utility.secondaryText}40`,
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.utility.primaryText }}
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </div>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Company name or category..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: `${colors.utility.secondaryText}40`,
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Results count */}
          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
              Showing {paginatedData.length} of {filteredData.length} members
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  borderBottom: `2px solid ${colors.utility.primaryText}20`
                }}
              >
                <th
                  className="text-left p-3 text-sm font-semibold"
                  style={{ color: colors.utility.primaryText }}
                >
                  Company Name
                </th>
                <th
                  className="text-left p-3 text-sm font-semibold"
                  style={{ color: colors.utility.primaryText }}
                >
                  Contact Person
                </th>
                <th
                  className="text-left p-3 text-sm font-semibold"
                  style={{ color: colors.utility.primaryText }}
                >
                  Category
                </th>
                <th
                  className="text-left p-3 text-sm font-semibold"
                  style={{ color: colors.utility.primaryText }}
                >
                  Status
                </th>
                <th
                  className="text-center p-3 text-sm font-semibold"
                  style={{ color: colors.utility.primaryText }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-8"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    No members found matching your filters
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.profile.id}
                    className="transition-colors hover:bg-opacity-50"
                    style={{
                      borderBottom: `1px solid ${colors.utility.primaryText}10`,
                      backgroundColor: index % 2 === 0 ? 'transparent' : `${colors.utility.secondaryBackground}50`
                    }}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        {item.tenantProfile?.logo_url ? (
                          <img
                            src={item.tenantProfile.logo_url}
                            alt={item.tenantProfile.business_name}
                            className="w-10 h-10 rounded-lg object-cover"
                            style={{
                              border: `1px solid ${colors.utility.primaryText}20`
                            }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: `${colors.brand.primary}20`,
                              color: colors.brand.primary
                            }}
                          >
                            {item.tenantProfile?.business_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p
                            className="font-semibold text-sm"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {item.tenantProfile?.business_name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            {item.profile.mobile_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <p
                        className="text-sm"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {item.tenantProfile?.business_name.split(' ')[0] || 'N/A'}
                      </p>
                    </td>
                    <td className="p-3">
                      <p
                        className="text-sm"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {item.profile.business_category || 'N/A'}
                      </p>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(item.profile.profile_status)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onView(item.profile.id)}
                          className="p-2 rounded-lg transition-all hover:opacity-80"
                          style={{
                            backgroundColor: `${colors.semantic.info}20`,
                            color: colors.semantic.info
                          }}
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(item.profile.id)}
                          className="p-2 rounded-lg transition-all hover:opacity-80"
                          style={{
                            backgroundColor: `${colors.brand.primary}20`,
                            color: colors.brand.primary
                          }}
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.profile.id)}
                          className="p-2 rounded-lg transition-all hover:opacity-80"
                          style={{
                            backgroundColor: `${colors.semantic.error}20`,
                            color: colors.semantic.error
                          }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.primaryText,
                  border: `1px solid ${colors.utility.primaryText}20`
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: currentPage === pageNum 
                        ? colors.brand.primary 
                        : colors.utility.secondaryBackground,
                      color: currentPage === pageNum 
                        ? '#FFFFFF' 
                        : colors.utility.primaryText,
                      border: `1px solid ${currentPage === pageNum 
                        ? colors.brand.primary 
                        : `${colors.utility.primaryText}20`}`
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.primaryText,
                  border: `1px solid ${colors.utility.primaryText}20`
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BBBMemberTable;