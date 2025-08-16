// src/vani/pages/JobsListPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  VaNiList, 
  VaNiListItem, 
  VaNiListHeader,
  VaNiStatusBadge 
} from '../components/shared';
import { useJobs } from '../hooks/useVaNiData';
import { 
  realisticEventJobs,
  realisticBusinessEvents,
  businessIntelligence,
  type EventDrivenJob
} from '../utils/fakeData';
import type { JobFilters } from '../types/vani.types';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Eye,
  Copy,
  Calendar,
  Users,
  DollarSign,
  FileText,
  Building,
  ExternalLink,
  Activity,
  MessageSquare,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobsListPage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Use realistic event jobs instead of old fake jobs
  const jobs = realisticEventJobs;
  const loading = false; // Set to false since we're using static data
  const error = null;

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Text search
      if (searchTerm && !job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.businessContext.contractName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.sourceModule.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status && job.status !== filters.status) {
        return false;
      }
      
      // Type filter (jobType instead of type)
      if (filters.type && job.jobType !== filters.type) {
        return false;
      }
      
      // Channel filter
      if (filters.channels && filters.channels.length > 0) {
        const hasMatchingChannel = job.channels.some(channel => 
          filters.channels?.includes(channel)
        );
        if (!hasMatchingChannel) {
          return false;
        }
      }
      
      return true;
    });
  }, [jobs, searchTerm, filters]);

  // Calculate business metrics
  const businessMetrics = useMemo(() => {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const pendingJobs = jobs.filter(j => j.status === 'pending').length;
    const failedJobs = jobs.filter(j => j.status === 'failed').length;
    const executingJobs = jobs.filter(j => j.status === 'executing').length;
    
    return {
      total: totalJobs,
      completed: completedJobs,
      pending: pendingJobs,
      failed: failedJobs,
      executing: executingJobs,
      successRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0
    };
  }, [jobs]);

  // Job action handlers
  const handleJobAction = (action: string, job: EventDrivenJob) => {
    console.log(`Action: ${action} on job:`, job.id);
    toast.success(`${action} action triggered for ${job.jobName}`, {
      style: {
        background: colors.semantic.success,
        color: '#FFF'
      }
    });
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on jobs:`, selectedJobs);
    toast.success(`${action} action triggered for ${selectedJobs.length} jobs`, {
      style: {
        background: colors.semantic.success,
        color: '#FFF'
      }
    });
  };

  const handleJobSelection = (jobId: string, selected: boolean) => {
    if (selected) {
      setSelectedJobs([...selectedJobs, jobId]);
    } else {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    }
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(job => job.id));
    }
  };

  const handleCreateJob = () => {
    navigate('/vani/jobs/create');
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/vani/jobs/${jobId}`);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/vani/events/${eventId}`);
  };

  const handleViewContract = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get job type badge color
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return colors.semantic.warning;
      case 'confirmation': return colors.brand.primary;
      case 'followup': return colors.brand.secondary;
      case 'escalation': return colors.semantic.error;
      case 'survey': return colors.semantic.success;
      default: return colors.utility.secondaryText;
    }
  };

  // Get business event for job
  const getBusinessEventForJob = (job: EventDrivenJob) => {
    return realisticBusinessEvents.find(event => event.id === job.businessEventId);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Communication Jobs
          </h1>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Event-driven communication jobs with complete business context
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/vani/events')}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <Activity className="w-4 h-4" />
            <span>View Events</span>
          </button>

          <button
            onClick={() => handleBulkAction('export')}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={handleCreateJob}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>
        </div>
      </div>

      {/* Business Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Jobs', value: businessMetrics.total, color: colors.utility.primaryText },
          { label: 'Completed', value: businessMetrics.completed, color: colors.semantic.success },
          { label: 'Executing', value: businessMetrics.executing, color: colors.brand.primary },
          { label: 'Pending', value: businessMetrics.pending, color: colors.semantic.warning },
          { label: 'Success Rate', value: `${businessMetrics.successRate.toFixed(1)}%`, color: colors.semantic.success }
        ].map((metric, index) => (
          <Card
            key={index}
            className="p-4"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <div className="text-center">
              <p 
                className="text-2xl font-bold"
                style={{ color: metric.color }}
              >
                {metric.value}
              </p>
              <p 
                className="text-sm"
                style={{ color: colors.utility.secondaryText }}
              >
                {metric.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card
        className="transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: colors.utility.secondaryText }}
              />
              <input
                type="text"
                placeholder="Search jobs by name, contract, or module..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'ring-2' : ''
              }`}
              style={{
                borderColor: `${colors.utility.primaryText}20`,
                backgroundColor: showFilters ? `${colors.brand.primary}10` : colors.utility.primaryBackground,
                color: showFilters ? colors.brand.primary : colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: `${colors.utility.primaryText}20` }}>
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="staged">Staged</option>
                  <option value="executing">Executing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Job Type
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as any || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Types</option>
                  <option value="reminder">Reminder</option>
                  <option value="confirmation">Confirmation</option>
                  <option value="followup">Follow-up</option>
                  <option value="escalation">Escalation</option>
                  <option value="survey">Survey</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchTerm('');
                  }}
                  className="w-full p-2 border rounded-lg transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.secondaryText
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card
        className="transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <VaNiListHeader
          title={`Communication Jobs (${filteredJobs.length})`}
          description={selectedJobs.length > 0 ? `${selectedJobs.length} selected` : undefined}
          showMetrics={true}
          metrics={businessMetrics}
          actions={
            selectedJobs.length > 0 ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('pause')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                >
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={() => handleBulkAction('retry')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.semantic.error}40`,
                    backgroundColor: `${colors.semantic.error}10`,
                    color: colors.semantic.error
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm" style={{ color: colors.utility.secondaryText }}>
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                  <span>Select All</span>
                </label>
              </div>
            )
          }
        />

        <CardContent className="p-0">
          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center">
              <p style={{ color: colors.utility.secondaryText }}>
                {searchTerm || Object.keys(filters).length > 0 
                  ? 'No jobs match your search criteria.' 
                  : 'No communication jobs found.'
                }
              </p>
              {!searchTerm && Object.keys(filters).length === 0 && (
                <button
                  onClick={handleCreateJob}
                  className="mt-4 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                  }}
                >
                  Create Your First Job
                </button>
              )}
            </div>
          ) : (
            <VaNiList variant="business" spacing="compact" className="p-4">
              {filteredJobs.map((job) => {
                const businessEvent = getBusinessEventForJob(job);
                
                return (
                  <VaNiListItem
                    key={job.id}
                    variant="business"
                    onClick={() => handleViewJob(job.id)}
                    businessContext={{
                      priority: job.priority,
                      urgency: job.priority >= 8 ? 'critical' : job.priority >= 6 ? 'high' : 'medium',
                      entityType: job.entityType,
                      moduleSource: job.sourceModule,
                      hasActions: true
                    }}
                    onSecondaryAction={() => businessEvent && handleViewEvent(businessEvent.id)}
                    secondaryActionLabel="View Event"
                    style={{
                      backgroundColor: selectedJobs.includes(job.id) 
                        ? `${colors.brand.primary}10` 
                        : colors.utility.primaryBackground,
                      borderColor: selectedJobs.includes(job.id)
                        ? `${colors.brand.primary}40`
                        : `${colors.utility.primaryText}15`
                    }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleJobSelection(job.id, e.target.checked);
                        }}
                        className="rounded"
                      />

                      {/* Job Type Icon */}
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${getJobTypeColor(job.jobType)}20` }}
                      >
                        <MessageSquare className="w-4 h-4" style={{ color: getJobTypeColor(job.jobType) }} />
                      </div>

                      {/* Job Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 
                            className="font-medium truncate"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {job.jobName}
                          </h3>
                          <span
                            className="px-2 py-0.5 text-xs rounded-full capitalize"
                            style={{
                              backgroundColor: `${getJobTypeColor(job.jobType)}20`,
                              color: getJobTypeColor(job.jobType)
                            }}
                          >
                            {job.jobType}
                          </span>
                          <VaNiStatusBadge status={job.status as any} size="sm" />
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs" style={{ color: colors.utility.secondaryText }}>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{job.recipients.total} recipients</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(job.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{job.cost}</span>
                          </div>
                          <div>
                            <span>{job.channels.join(', ')}</span>
                          </div>
                        </div>
                        
                        {/* Business Context */}
                        <div className="mt-1 flex items-center space-x-3 text-xs">
                          {job.businessContext.contractName && (
                            <div className="flex items-center space-x-1" style={{ color: colors.brand.primary }}>
                              <FileText className="w-3 h-3" />
                              <span>{job.businessContext.contractName}</span>
                            </div>
                          )}
                          {job.businessContext.serviceNumber && (
                            <span style={{ color: colors.utility.secondaryText }}>
                              Service {job.businessContext.serviceNumber}/{job.businessContext.totalServices}
                            </span>
                          )}
                          {businessEvent && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEvent(businessEvent.id);
                              }}
                              className="flex items-center space-x-1 hover:opacity-80"
                              style={{ color: colors.brand.secondary }}
                            >
                              <Activity className="w-3 h-3" />
                              <span>Source Event</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Success Rate */}
                      <div className="text-right">
                        <div 
                          className="text-lg font-bold"
                          style={{ 
                            color: job.successRate >= 95 
                              ? colors.semantic.success 
                              : job.successRate >= 85 
                                ? colors.semantic.warning 
                                : colors.semantic.error 
                          }}
                        >
                          {job.successRate}%
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          Success Rate
                        </div>
                      </div>

                      {/* Actions Menu */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJobAction('view', job);
                          }}
                          className="p-1 transition-colors hover:opacity-80"
                          style={{ color: colors.utility.secondaryText }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJobAction('copy', job);
                          }}
                          className="p-1 transition-colors hover:opacity-80"
                          style={{ color: colors.utility.secondaryText }}
                          title="Duplicate Job"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {job.businessContext.contractId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewContract(job.businessContext.contractId!);
                            }}
                            className="p-1 transition-colors hover:opacity-80"
                            style={{ color: colors.utility.secondaryText }}
                            title="View Contract"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('More actions for:', job.id);
                          }}
                          className="p-1 transition-colors hover:opacity-80"
                          style={{ color: colors.utility.secondaryText }}
                          title="More Actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </VaNiListItem>
                );
              })}
            </VaNiList>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsListPage;