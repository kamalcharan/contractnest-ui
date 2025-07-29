// src/components/catalog/VersionHistory.tsx
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  Calendar,
  GitBranch,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Eye,
  Check,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../services/serviceURLs';
import { SimpleTableSkeleton } from '../common/skeletons';
import { formatDistanceToNow } from '../../utils/dateHelpers';

interface VersionInfo {
  id: string;
  catalog_id: string;
  version: number;
  name: string;
  description: string;
  version_reason?: string;
  created_at: string;
  created_by: {
    id: string;
    name: string;
    email: string;
  };
  is_current: boolean;
  is_active: boolean;
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
}

interface VersionHistoryProps {
  catalogId: string;
  currentVersion?: number;
  onRestore?: (versionId: string) => void;
  showActions?: boolean;
  className?: string;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  catalogId,
  currentVersion = 1,
  onRestore,
  showActions = true,
  className = ''
}) => {
  const [versions, setVersions] = useState<VersionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<[string?, string?]>([]);

  useEffect(() => {
    loadVersionHistory();
  }, [catalogId]);

  const loadVersionHistory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(API_ENDPOINTS.CATALOG.VERSIONS(catalogId));
      const data = response.data.data || response.data;
      
      // Mock version data for now since API might not be ready
      const mockVersions: VersionInfo[] = [
        {
          id: 'v3',
          catalog_id: catalogId,
          version: 3,
          name: 'Premium Service Package',
          description: 'Updated description with new features',
          version_reason: 'Added new service features and updated pricing',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          is_current: currentVersion === 3,
          is_active: true,
          changes: [
            { field: 'name', old_value: 'Service Package', new_value: 'Premium Service Package' },
            { field: 'price', old_value: 5000, new_value: 6000 }
          ]
        },
        {
          id: 'v2',
          catalog_id: catalogId,
          version: 2,
          name: 'Service Package',
          description: 'Enhanced service package',
          version_reason: 'Updated pricing structure',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: {
            id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          is_current: currentVersion === 2,
          is_active: true,
          changes: [
            { field: 'price', old_value: 4500, new_value: 5000 }
          ]
        },
        {
          id: 'v1',
          catalog_id: catalogId,
          version: 1,
          name: 'Basic Service',
          description: 'Initial service offering',
          version_reason: 'Initial version',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          is_current: currentVersion === 1,
          is_active: true,
          changes: []
        }
      ];

      setVersions(data.versions || mockVersions);
    } catch (error) {
      console.error('Error loading version history:', error);
      // Use mock data for demo
      setVersions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const handleRestore = async (versionId: string) => {
    setRestoringVersion(versionId);
    try {
      if (onRestore) {
        await onRestore(versionId);
      } else {
        // Default restore behavior
        await api.post(API_ENDPOINTS.CATALOG.RESTORE(versionId));
      }
      
      toast.success('Version restored successfully', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      
      // Reload history
      await loadVersionHistory();
    } catch (error) {
      toast.error('Failed to restore version', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px',
        },
      });
    } finally {
      setRestoringVersion(null);
    }
  };

  const toggleVersionSelection = (versionId: string) => {
    const [first, second] = selectedVersions;
    
    if (first === versionId) {
      setSelectedVersions([second]);
    } else if (second === versionId) {
      setSelectedVersions([first]);
    } else if (!first) {
      setSelectedVersions([versionId]);
    } else if (!second) {
      setSelectedVersions([first, versionId]);
    } else {
      setSelectedVersions([versionId]);
    }
  };

  const getChangeIcon = (field: string) => {
    switch (field) {
      case 'name':
      case 'description':
        return '📝';
      case 'price':
        return '💰';
      case 'tax':
        return '🧾';
      default:
        return '🔄';
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <SimpleTableSkeleton rows={3} />
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">No version history available</p>
      </div>
    );
  }

  const canCompare = selectedVersions.filter(Boolean).length === 2;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Compare toolbar */}
      {versions.length > 1 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Compare Versions
              </span>
              {selectedVersions.filter(Boolean).length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({selectedVersions.filter(Boolean).length} selected)
                </span>
              )}
            </div>
            {canCompare && (
              <button
                className="flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 dark:bg-gray-700 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-gray-600"
              >
                Compare
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Version timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />

        {/* Version items */}
        <div className="space-y-6">
          {versions.map((version, index) => (
            <div key={version.id} className="relative">
              {/* Timeline dot */}
              <div className={`
                absolute left-6 w-4 h-4 rounded-full border-2 bg-white dark:bg-gray-800
                ${version.is_current 
                  ? 'border-indigo-500 bg-indigo-500' 
                  : 'border-gray-300 dark:border-gray-600'
                }
              `} />

              {/* Version card */}
              <div className={`
                ml-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border
                ${version.is_current 
                  ? 'border-indigo-300 dark:border-indigo-700' 
                  : 'border-gray-200 dark:border-gray-700'
                }
              `}>
                {/* Version header */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          Version {version.version}
                        </h4>
                        {version.is_current && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                            Current
                          </span>
                        )}
                        {versions.length > 1 && (
                          <button
                            onClick={() => toggleVersionSelection(version.id)}
                            className={`
                              p-1 rounded transition-colors
                              ${selectedVersions.includes(version.id)
                                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                              }
                            `}
                          >
                            {selectedVersions.includes(version.id) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {version.version_reason || 'No description provided'}
                      </p>

                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {version.created_by.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(version.created_at)} ago
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {showActions && !version.is_current && (
                        <button
                          onClick={() => handleRestore(version.id)}
                          disabled={restoringVersion === version.id}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                          {restoringVersion === version.id ? (
                            <>
                              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700 dark:border-gray-300 mr-2" />
                              Restoring...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Restore
                            </>
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => toggleExpanded(version.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {expandedVersions.has(version.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedVersions.has(version.id) && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="mt-4 space-y-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Changes in this version:
                      </h5>
                      
                      {version.changes && version.changes.length > 0 ? (
                        <div className="space-y-2">
                          {version.changes.map((change, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                            >
                              <span className="text-lg">
                                {getChangeIcon(change.field)}
                              </span>
                              <div className="flex-1 text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {change.field}:
                                </span>
                                <div className="mt-1 flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                  <span className="line-through">
                                    {JSON.stringify(change.old_value)}
                                  </span>
                                  <ArrowRight className="w-3 h-3" />
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {JSON.stringify(change.new_value)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Initial version - no changes to display
                        </p>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Name</dt>
                            <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                              {version.name}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                            <dd className="mt-1">
                              {version.is_active ? (
                                <span className="inline-flex items-center text-green-700 dark:text-green-400">
                                  <Check className="w-3 h-3 mr-1" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Inactive
                                </span>
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simplified version for inline display
export const VersionBadge: React.FC<{
  version: number;
  isCurrent?: boolean;
  className?: string;
}> = ({ version, isCurrent = false, className = '' }) => {
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
      ${isCurrent 
        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      }
      ${className}
    `}>
      <Clock className="w-3 h-3 mr-1" />
      v{version}
    </span>
  );
};

export default VersionHistory;