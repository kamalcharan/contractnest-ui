// src/pages/templates/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Upload,
  Copy,
  Trash2,
  Edit,
  Eye,
  Share2,
  Star,
  MoreVertical,
  FileText,
  Calendar,
  User,
  Building,
  Tag,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  FolderOpen
} from 'lucide-react';
import { ViewToggle } from '@/components/template-designer/shared/ViewToggle';
import TemplateStatusBadge, { VisibilityBadge, TemplateTypeBadge } from '@/components/template-designer/shared/TemplateStatusBadge';

// Mock data for templates
const mockTemplates = [
  {
    id: '1',
    name: 'Service Agreement Template',
    description: 'Standard service agreement for consulting services',
    category: 'contracts',
    type: 'standard' as const,
    status: 'published' as const,
    visibility: 'organization' as const,
    tags: ['consulting', 'services', 'standard'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    createdBy: 'John Doe',
    usage: 156,
    rating: 4.5,
    isStarred: true
  },
  {
    id: '2',
    name: 'Employment Contract',
    description: 'Full-time employment contract with benefits',
    category: 'hr',
    type: 'premium' as const,
    status: 'published' as const,
    visibility: 'public' as const,
    tags: ['employment', 'hr', 'full-time'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-15'),
    createdBy: 'Jane Smith',
    usage: 89,
    rating: 4.8,
    isStarred: false
  },
  {
    id: '3',
    name: 'NDA Template',
    description: 'Non-disclosure agreement for business partnerships',
    category: 'legal',
    type: 'standard' as const,
    status: 'draft' as const,
    visibility: 'private' as const,
    tags: ['nda', 'legal', 'confidential'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-25'),
    createdBy: 'Admin User',
    usage: 0,
    rating: 0,
    isStarred: false
  },
  {
    id: '4',
    name: 'Sales Contract',
    description: 'Product sales agreement with payment terms',
    category: 'sales',
    type: 'custom' as const,
    status: 'archived' as const,
    visibility: 'organization' as const,
    tags: ['sales', 'products', 'payment'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'Sales Team',
    usage: 234,
    rating: 4.2,
    isStarred: false
  }
];

const categories = [
  { id: 'all', name: 'All Templates', count: 45 },
  { id: 'contracts', name: 'Contracts', count: 12 },
  { id: 'hr', name: 'Human Resources', count: 8 },
  { id: 'sales', name: 'Sales', count: 15 },
  { id: 'legal', name: 'Legal', count: 10 }
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedTemplates, setSelectedTemplates] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<'name' | 'date' | 'usage'>('date');

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNew = () => {
    navigate('/settings/templates/new');
  };

  const handleTemplateClick = (templateId: string) => {
    navigate(`/settings/templates/${templateId}/edit`);
  };

  const handleStarToggle = (templateId: string) => {
    // Toggle star logic
    console.log('Toggle star for', templateId);
  };

  const handleBulkAction = (action: 'delete' | 'archive' | 'duplicate') => {
    console.log(`Bulk ${action} for`, selectedTemplates);
    setSelectedTemplates([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage contract templates for your organization
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                showFilters ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Bulk Actions */}
            {selectedTemplates.length > 0 && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-500">
                  {selectedTemplates.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('duplicate')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Archive"
                >
                  <Archive className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            )}
          </div>

          {/* View Toggle & Sort */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="usage">Sort by Usage</option>
            </select>
            <ViewToggle view={view} onChange={setView} availableViews={['grid', 'list']} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Categories */}
        <div className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-180px)]">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
            <ul className="space-y-1">
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full px-3 py-2 text-left rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-gray-500">{category.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  Total Uses
                </div>
                <span className="text-sm font-semibold">479</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4" />
                  Favorites
                </div>
                <span className="text-sm font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  Recent
                </div>
                <span className="text-sm font-semibold">5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className="flex-1 p-6">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplates.includes(template.id)}
                  onSelect={(id) => {
                    setSelectedTemplates(prev =>
                      prev.includes(id)
                        ? prev.filter(t => t !== id)
                        : [...prev, id]
                    );
                  }}
                  onClick={() => handleTemplateClick(template.id)}
                  onStarToggle={() => handleStarToggle(template.id)}
                />
              ))}
            </div>
          ) : (
            <TemplateList
              templates={filteredTemplates}
              selectedTemplates={selectedTemplates}
              onSelect={(id) => {
                setSelectedTemplates(prev =>
                  prev.includes(id)
                    ? prev.filter(t => t !== id)
                    : [...prev, id]
                );
              }}
              onClick={handleTemplateClick}
              onStarToggle={handleStarToggle}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Template Card Component
interface TemplateCardProps {
  template: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: () => void;
  onStarToggle: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onClick,
  onStarToggle
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      className={`bg-white rounded-lg border ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      } hover:shadow-lg transition-all cursor-pointer relative group`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(template.id);
          }}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </div>

      {/* Star Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStarToggle();
        }}
        className="absolute top-2 right-2 z-10"
      >
        <Star
          className={`w-4 h-4 ${
            template.isStarred
              ? 'text-yellow-500 fill-current'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        />
      </button>

      <div onClick={onClick} className="p-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>

        {/* Title & Description */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {template.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {template.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <TemplateStatusBadge status={template.status} size="xs" />
          <TemplateTypeBadge type={template.type} size="xs" showIcon={false} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 2 && (
            <span className="text-xs text-gray-500">
              +{template.tags.length - 2}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {template.createdBy}
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {template.usage} uses
          </div>
        </div>
      </div>
    </div>
  );
};

// Template List Component
interface TemplateListProps {
  templates: any[];
  selectedTemplates: string[];
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
  onStarToggle: (id: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  selectedTemplates,
  onSelect,
  onClick,
  onStarToggle
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                checked={selectedTemplates.length === templates.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    templates.forEach(t => onSelect(t.id));
                  } else {
                    selectedTemplates.forEach(id => onSelect(id));
                  }
                }}
              />
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              Template
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              Status
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              Type
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              Created
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
              Usage
            </th>
            <th className="w-20"></th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr
              key={template.id}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => onClick(template.id)}
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  checked={selectedTemplates.includes(template.id)}
                  onChange={() => onSelect(template.id)}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-sm text-gray-500">{template.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <TemplateStatusBadge status={template.status} size="sm" />
              </td>
              <td className="px-4 py-3">
                <TemplateTypeBadge type={template.type} size="sm" showIcon={false} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {template.createdAt.toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {template.usage}
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStarToggle(template.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        template.isStarred
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};