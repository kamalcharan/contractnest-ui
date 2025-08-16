// src/vani/pages/TemplatesLibraryPage.tsx
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
import { 
  businessContextTemplates,
  realisticEventJobs,
  type BusinessEvent
} from '../utils/fakeData';
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
  Edit,
  Calendar,
  Users,
  DollarSign,
  FileText,
  MessageSquare,
  Mail,
  Smartphone,
  Bell,
  Monitor,
  Activity,
  TrendingUp,
  BarChart3,
  Tag,
  Clock,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TemplateFilters {
  category?: string;
  channels?: string[];
  eventTypes?: string[];
  isActive?: boolean;
  search?: string;
}

const TemplatesLibraryPage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState<TemplateFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Use business context templates
  const templates = businessContextTemplates;

  // Filter and search templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Text search
      if (searchTerm && !template.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !template.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !template.category.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && template.category !== filters.category) {
        return false;
      }
      
      // Channel filter
      if (filters.channels && filters.channels.length > 0) {
        const hasMatchingChannel = template.channels.some(channel => 
          filters.channels?.includes(channel)
        );
        if (!hasMatchingChannel) {
          return false;
        }
      }
      
      // Event types filter
      if (filters.eventTypes && filters.eventTypes.length > 0) {
        const hasMatchingEventType = template.eventTypes.some(eventType => 
          filters.eventTypes?.includes(eventType)
        );
        if (!hasMatchingEventType) {
          return false;
        }
      }
      
      // Active status filter
      if (filters.isActive !== undefined && template.isActive !== filters.isActive) {
        return false;
      }
      
      return true;
    });
  }, [templates, searchTerm, filters]);

  // Calculate template metrics
  const templateMetrics = useMemo(() => {
    const totalTemplates = templates.length;
    const activeTemplates = templates.filter(t => t.isActive).length;
    const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
    const avgUsage = totalTemplates > 0 ? totalUsage / totalTemplates : 0;
    
    // Calculate usage this month (simulate)
    const usageThisMonth = Math.floor(totalUsage * 0.3); // 30% of total usage this month
    
    const categoryCounts = templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalTemplates,
      active: activeTemplates,
      inactive: totalTemplates - activeTemplates,
      totalUsage,
      avgUsage,
      usageThisMonth,
      categoryCounts
    };
  }, [templates]);

  // Template action handlers
  const handleTemplateAction = (action: string, template: any) => {
    console.log(`Action: ${action} on template:`, template.id);
    
    switch (action) {
      case 'edit':
        navigate(`/vani/templates/${template.id}/edit`);
        break;
      case 'duplicate':
        navigate(`/vani/templates/create?duplicate=${template.id}`);
        break;
      case 'view':
        navigate(`/vani/templates/${template.id}`);
        break;
      case 'toggle':
        toast.success(`Template ${template.isActive ? 'deactivated' : 'activated'}`, {
          style: { background: colors.semantic.success, color: '#FFF' }
        });
        break;
      default:
        toast.success(`${action} action triggered for ${template.name}`, {
          style: { background: colors.semantic.success, color: '#FFF' }
        });
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on templates:`, selectedTemplates);
    toast.success(`${action} action triggered for ${selectedTemplates.length} templates`, {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
  };

  const handleTemplateSelection = (templateId: string, selected: boolean) => {
    if (selected) {
      setSelectedTemplates([...selectedTemplates, templateId]);
    } else {
      setSelectedTemplates(selectedTemplates.filter(id => id !== templateId));
    }
  };

  const handleSelectAll = () => {
    if (selectedTemplates.length === filteredTemplates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(filteredTemplates.map(template => template.id));
    }
  };

  const handleCreateTemplate = () => {
    navigate('/vani/templates/create');
  };

  const handleViewTemplate = (templateId: string) => {
    navigate(`/vani/templates/${templateId}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service_reminders': return colors.brand.primary;
      case 'payment_reminders': return colors.semantic.warning;
      case 'contract_management': return colors.semantic.success;
      case 'emergency_notifications': return colors.semantic.error;
      default: return colors.utility.secondaryText;
    }
  };

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone className="w-3 h-3" />;
      case 'email': return <Mail className="w-3 h-3" />;
      case 'whatsapp': return <MessageSquare className="w-3 h-3" />;
      case 'push': return <Bell className="w-3 h-3" />;
      case 'widget': return <Monitor className="w-3 h-3" />;
      default: return <MessageSquare className="w-3 h-3" />;
    }
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
            Business Templates
          </h1>
          <p 
            className="text-sm mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Manage communication templates with business context and variables
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 p-1 border rounded-lg" style={{ borderColor: `${colors.utility.primaryText}20` }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'grid' ? '' : ''}`}
              style={{
                backgroundColor: viewMode === 'grid' ? colors.brand.primary : 'transparent',
                color: viewMode === 'grid' ? '#FFF' : colors.utility.primaryText
              }}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'list' ? '' : ''}`}
              style={{
                backgroundColor: viewMode === 'list' ? colors.brand.primary : 'transparent',
                color: viewMode === 'list' ? '#FFF' : colors.utility.primaryText
              }}
            >
              List
            </button>
          </div>

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
            onClick={handleCreateTemplate}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {/* Template Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Templates', value: templateMetrics.total, icon: FileText, color: colors.utility.primaryText },
          { label: 'Active Templates', value: templateMetrics.active, icon: Activity, color: colors.semantic.success },
          { label: 'Usage This Month', value: templateMetrics.usageThisMonth.toLocaleString(), icon: TrendingUp, color: colors.brand.primary },
          { label: 'Avg Usage', value: Math.round(templateMetrics.avgUsage).toLocaleString(), icon: Target, color: colors.semantic.warning }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="p-4"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6" style={{ color: metric.color }} />
                <div>
                  <p className="text-xl font-bold" style={{ color: colors.utility.primaryText }}>
                    {metric.value}
                  </p>
                  <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                    {metric.label}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
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
                placeholder="Search templates by name, description, or category..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t" style={{ borderColor: `${colors.utility.primaryText}20` }}>
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Categories</option>
                  <option value="service_reminders">Service Reminders</option>
                  <option value="payment_reminders">Payment Reminders</option>
                  <option value="contract_management">Contract Management</option>
                  <option value="emergency_notifications">Emergency Notifications</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Status
                </label>
                <select
                  value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    isActive: e.target.value === '' ? undefined : e.target.value === 'true' 
                  })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Templates</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </select>
              </div>

              {/* Event Types Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.utility.primaryText }}>
                  Event Type
                </label>
                <select
                  value={filters.eventTypes?.[0] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    eventTypes: e.target.value ? [e.target.value] : undefined 
                  })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                >
                  <option value="">All Event Types</option>
                  <option value="service_due">Service Due</option>
                  <option value="payment_due">Payment Due</option>
                  <option value="contract_renewal">Contract Renewal</option>
                  <option value="emergency_service">Emergency Service</option>
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

      {/* Templates Display */}
      <Card
        className="transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <VaNiListHeader
          title={`Business Templates (${filteredTemplates.length})`}
          description={selectedTemplates.length > 0 ? `${selectedTemplates.length} selected` : undefined}
          actions={
            selectedTemplates.length > 0 ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                >
                  <Play className="w-3 h-3" />
                  <span>Activate</span>
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md transition-colors hover:opacity-80"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                >
                  <Pause className="w-3 h-3" />
                  <span>Deactivate</span>
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
                    checked={selectedTemplates.length === filteredTemplates.length && filteredTemplates.length > 0}
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
          {filteredTemplates.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: colors.utility.secondaryText }} />
              <p style={{ color: colors.utility.secondaryText }}>
                {searchTerm || Object.keys(filters).length > 0 
                  ? 'No templates match your search criteria.' 
                  : 'No business templates found.'
                }
              </p>
              {!searchTerm && Object.keys(filters).length === 0 && (
                <button
                  onClick={handleCreateTemplate}
                  className="mt-4 px-4 py-2 text-white rounded-lg transition-all hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                  }}
                >
                  Create Your First Template
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
                  style={{
                    backgroundColor: selectedTemplates.includes(template.id) 
                      ? `${colors.brand.primary}10` 
                      : colors.utility.primaryBackground,
                    borderColor: selectedTemplates.includes(template.id)
                      ? `${colors.brand.primary}40`
                      : `${colors.utility.primaryText}15`
                  }}
                  onClick={() => handleViewTemplate(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle 
                          className="text-lg mb-2"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {template.name}
                        </CardTitle>
                        <p 
                          className="text-sm"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          {template.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleTemplateSelection(template.id, e.target.checked);
                        }}
                        className="rounded ml-2"
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {/* Category & Status */}
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2 py-1 text-xs rounded-full capitalize"
                          style={{
                            backgroundColor: `${getCategoryColor(template.category)}20`,
                            color: getCategoryColor(template.category)
                          }}
                        >
                          {template.category.replace('_', ' ')}
                        </span>
                        <VaNiStatusBadge 
                          status={template.isActive ? 'active' : 'inactive'} 
                          variant="channel" 
                          size="sm" 
                        />
                      </div>

                      {/* Channels */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs" style={{ color: colors.utility.secondaryText }}>
                          Channels:
                        </span>
                        <div className="flex space-x-1">
                          {template.channels.map((channel) => (
                            <div
                              key={channel}
                              className="p-1 rounded"
                              style={{ backgroundColor: `${colors.brand.primary}20` }}
                              title={channel}
                            >
                              <div style={{ color: colors.brand.primary }}>
                                {getChannelIcon(channel)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Usage Stats */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" style={{ color: colors.semantic.success }} />
                          <span style={{ color: colors.utility.secondaryText }}>
                            {template.usageCount.toLocaleString()} uses
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" style={{ color: colors.utility.secondaryText }} />
                          <span style={{ color: colors.utility.secondaryText }}>
                            {formatDate(template.lastUsed)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: `${colors.utility.primaryText}20` }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateAction('edit', template);
                          }}
                          className="flex items-center space-x-1 px-2 py-1 text-xs border rounded transition-colors hover:opacity-80"
                          style={{
                            borderColor: `${colors.brand.primary}40`,
                            backgroundColor: `${colors.brand.primary}10`,
                            color: colors.brand.primary
                          }}
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateAction('duplicate', template);
                          }}
                          className="flex items-center space-x-1 px-2 py-1 text-xs border rounded transition-colors hover:opacity-80"
                          style={{
                            borderColor: `${colors.utility.primaryText}20`,
                            backgroundColor: colors.utility.primaryBackground,
                            color: colors.utility.primaryText
                          }}
                        >
                          <Copy className="w-3 h-3" />
                          <span>Duplicate</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <VaNiList variant="business" spacing="compact" className="p-4">
              {filteredTemplates.map((template) => (
                <VaNiListItem
                  key={template.id}
                  variant="business"
                  onClick={() => handleViewTemplate(template.id)}
                  businessContext={{
                    priority: template.usageCount > 1000 ? 8 : 5,
                    urgency: template.isActive ? 'low' : 'medium',
                    entityType: template.category,
                    hasActions: true
                  }}
                  style={{
                    backgroundColor: selectedTemplates.includes(template.id) 
                      ? `${colors.brand.primary}10` 
                      : colors.utility.primaryBackground,
                    borderColor: selectedTemplates.includes(template.id)
                      ? `${colors.brand.primary}40`
                      : `${colors.utility.primaryText}15`
                  }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTemplateSelection(template.id, e.target.checked);
                      }}
                      className="rounded"
                    />

                    {/* Template Icon */}
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${getCategoryColor(template.category)}20` }}
                    >
                      <FileText className="w-4 h-4" style={{ color: getCategoryColor(template.category) }} />
                    </div>

                    {/* Template Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 
                          className="font-medium truncate"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {template.name}
                        </h3>
                        <span
                          className="px-2 py-0.5 text-xs rounded-full capitalize"
                          style={{
                            backgroundColor: `${getCategoryColor(template.category)}20`,
                            color: getCategoryColor(template.category)
                          }}
                        >
                          {template.category.replace('_', ' ')}
                        </span>
                        <VaNiStatusBadge 
                          status={template.isActive ? 'active' : 'inactive'} 
                          variant="channel" 
                          size="sm" 
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs" style={{ color: colors.utility.secondaryText }}>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{template.usageCount.toLocaleString()} uses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Last used {formatDate(template.lastUsed)}</span>
                        </div>
                        <div className="flex space-x-1">
                          {template.channels.slice(0, 3).map((channel) => (
                            <div key={channel} style={{ color: colors.brand.primary }}>
                              {getChannelIcon(channel)}
                            </div>
                          ))}
                          {template.channels.length > 3 && (
                            <span>+{template.channels.length - 3}</span>
                          )}
                        </div>
                      </div>
                      
                      <p 
                        className="text-sm mt-1 truncate"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {template.description}
                      </p>
                    </div>

                    {/* Usage Percentage */}
                    <div className="text-right">
                      <div 
                        className="text-lg font-bold"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {template.usageCount.toLocaleString()}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        Total Uses
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateAction('view', template);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.utility.secondaryText }}
                        title="View Template"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateAction('edit', template);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.utility.secondaryText }}
                        title="Edit Template"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateAction('duplicate', template);
                        }}
                        className="p-1 transition-colors hover:opacity-80"
                        style={{ color: colors.utility.secondaryText }}
                        title="Duplicate Template"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('More actions for:', template.id);
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
              ))}
            </VaNiList>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatesLibraryPage;