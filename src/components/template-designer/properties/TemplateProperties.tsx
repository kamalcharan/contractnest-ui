// src/components/template-designer/properties/TemplateProperties.tsx
import React from 'react';
import {
  Settings,
  FileText,
  Globe,
  Lock,
  Calendar,
  Tag,
  User,
  Building,
  AlertCircle,
  Info,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  Hash
} from 'lucide-react';

interface TemplatePropertiesProps {
  template: {
    id: string;
    name: string;
    description: string;
    category: string;
    version: string;
    status: 'draft' | 'published' | 'archived';
    visibility: 'private' | 'organization' | 'public';
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    tags: string[];
    permissions: {
      canEdit: boolean;
      canShare: boolean;
      canDelete: boolean;
      canPublish: boolean;
    };
    embedding: {
      enabled: boolean;
      allowedDomains: string[];
      requireAuth: boolean;
    };
    usage: {
      totalUses: number;
      activeContracts: number;
      lastUsed: Date | null;
    };
  };
  onUpdate: (updates: any) => void;
}

export const TemplateProperties: React.FC<TemplatePropertiesProps> = ({
  template,
  onUpdate
}) => {
  const [activeSection, setActiveSection] = React.useState('general');
  const [newTag, setNewTag] = React.useState('');
  const [newDomain, setNewDomain] = React.useState('');

  const handleAddTag = () => {
    if (newTag && !template.tags.includes(newTag)) {
      onUpdate({ tags: [...template.tags, newTag] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    onUpdate({ tags: template.tags.filter(t => t !== tag) });
  };

  const handleAddDomain = () => {
    if (newDomain && !template.embedding.allowedDomains.includes(newDomain)) {
      onUpdate({
        embedding: {
          ...template.embedding,
          allowedDomains: [...template.embedding.allowedDomains, newDomain]
        }
      });
      setNewDomain('');
    }
  };

  const handleRemoveDomain = (domain: string) => {
    onUpdate({
      embedding: {
        ...template.embedding,
        allowedDomains: template.embedding.allowedDomains.filter(d => d !== domain)
      }
    });
  };

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="https://app.example.com/embed/template/${template.id}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
  };

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'embedding', label: 'Embedding', icon: Globe },
    { id: 'usage', label: 'Usage Stats', icon: Clock }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4 px-4">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
                activeSection === section.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'general' && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={template.description}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={template.category}
                    onChange={(e) => onUpdate({ category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sales">Sales</option>
                    <option value="legal">Legal</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={template.status}
                    onChange={(e) => onUpdate({ status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select
                    value={template.visibility}
                    onChange={(e) => onUpdate({ visibility: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="private">Private</option>
                    <option value="organization">Organization</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {template.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Metadata</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Template ID
                  </span>
                  <span className="font-mono text-xs">{template.id}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Version
                  </span>
                  <span>{template.version}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created
                  </span>
                  <span>{template.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Created By
                  </span>
                  <span>{template.createdBy}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'permissions' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Permission Settings</p>
                  <p>Control who can access and modify this template.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(template.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">
                      {key.replace('can', 'Can ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getPermissionDescription(key)}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onUpdate({
                        permissions: { ...template.permissions, [key]: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'embedding' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Embedding Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-gray-900">Enable Embedding</div>
                    <div className="text-sm text-gray-500">Allow this template to be embedded on external websites</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.embedding.enabled}
                      onChange={(e) => onUpdate({
                        embedding: { ...template.embedding, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {template.embedding.enabled && (
                  <>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium text-gray-900">Require Authentication</div>
                        <div className="text-sm text-gray-500">Users must be logged in to use the embedded template</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={template.embedding.requireAuth}
                          onChange={(e) => onUpdate({
                            embedding: { ...template.embedding, requireAuth: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allowed Domains
                      </label>
                      <div className="space-y-2">
                        {template.embedding.allowedDomains.map(domain => (
                          <div key={domain} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <span className="flex-1 text-sm">{domain}</span>
                            <button
                              onClick={() => handleRemoveDomain(domain)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                            placeholder="example.com"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleAddDomain}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Embed Code
                      </label>
                      <div className="relative">
                        <pre className="p-3 bg-gray-900 text-gray-300 rounded-lg text-xs overflow-x-auto">
{`<iframe 
  src="https://app.example.com/embed/template/${template.id}"
  width="100%"
  height="600"
  frameborder="0">
</iframe>`}
                        </pre>
                        <button
                          onClick={copyEmbedCode}
                          className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'usage' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Usage Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {template.usage.totalUses}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Total Uses</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {template.usage.activeContracts}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Active Contracts</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Last Used</span>
                  <span className="text-sm font-medium">
                    {template.usage.lastUsed
                      ? template.usage.lastUsed.toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium">
                    {template.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Last Modified</span>
                  <span className="text-sm font-medium">
                    {template.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Detailed Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function
const getPermissionDescription = (permission: string): string => {
  const descriptions: Record<string, string> = {
    canEdit: 'Allow users to modify template content and structure',
    canShare: 'Allow users to share template with others',
    canDelete: 'Allow users to permanently delete this template',
    canPublish: 'Allow users to publish template to marketplace'
  };
  return descriptions[permission] || '';
};

export default TemplateProperties;