// src/components/template-designer/shared/TemplateHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Share2,
  MoreVertical,
  Eye,
  Copy,
  Trash2,
  Archive,
  Star,
  Lock,
  Unlock,
  Users,
  Globe,
  History,
  Settings,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  FileText,
  Download,
  Upload,
  Code,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/router';
import TemplateStatusBadge from './TemplateStatusBadge';

interface TemplateHeaderProps {
  template: {
    id: string;
    name: string;
    status: 'draft' | 'published' | 'archived' | 'locked';
    visibility: 'private' | 'organization' | 'public';
    version: string;
    isStarred?: boolean;
    hasUnsavedChanges?: boolean;
    lastSaved?: Date;
    permissions?: {
      canEdit: boolean;
      canShare: boolean;
      canDelete: boolean;
      canPublish: boolean;
    };
  };
  mode?: 'view' | 'edit' | 'preview';
  onSave?: () => Promise<void>;
  onShare?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  onToggleStar?: () => void;
  showBackButton?: boolean;
  customActions?: React.ReactNode;
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  template,
  mode = 'view',
  onSave,
  onShare,
  onDelete,
  onArchive,
  onDuplicate,
  onExport,
  onToggleStar,
  showBackButton = true,
  customActions
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (onSave && !isSaving) {
      setIsSaving(true);
      try {
        await onSave();
        showNotification('success', 'Template saved successfully');
      } catch (error) {
        showNotification('error', 'Failed to save template');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getVisibilityIcon = () => {
    switch (template.visibility) {
      case 'private': return <Lock className="w-4 h-4" />;
      case 'organization': return <Users className="w-4 h-4" />;
      case 'public': return <Globe className="w-4 h-4" />;
      default: return null;
    }
  };

  const getVisibilityLabel = () => {
    switch (template.visibility) {
      case 'private': return 'Private';
      case 'organization': return 'Organization';
      case 'public': return 'Public';
      default: return '';
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-gray-400" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {template.name}
                  </h1>
                  {template.hasUnsavedChanges && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <TemplateStatusBadge status={template.status} size="sm" />
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {getVisibilityIcon()}
                    <span>{getVisibilityLabel()}</span>
                  </div>
                  <span className="text-sm text-gray-500">v{template.version}</span>
                  {template.lastSaved && (
                    <span className="text-sm text-gray-400">
                      Last saved {template.lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Custom Actions */}
            {customActions}

            {/* Star Button */}
            {onToggleStar && (
              <button
                onClick={onToggleStar}
                className={`p-2 rounded-lg transition-colors ${
                  template.isStarred
                    ? 'text-yellow-500 hover:bg-yellow-50'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title={template.isStarred ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-5 h-5 ${template.isStarred ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Mode-specific Actions */}
            {mode === 'edit' && onSave && (
              <button
                onClick={handleSave}
                disabled={isSaving || !template.hasUnsavedChanges}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  template.hasUnsavedChanges
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            )}

            {mode === 'view' && (
              <button
                onClick={() => navigate(`/settings/templates/${template.id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Edit Template
              </button>
            )}

            {/* Share Button */}
            {onShare && template.permissions?.canShare && (
              <button
                onClick={onShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share template"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Preview Button */}
            <button
              onClick={() => navigate(`/settings/templates/${template.id}/preview`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Preview template"
            >
              <Eye className="w-5 h-5 text-gray-600" />
            </button>

            {/* More Options Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {onDuplicate && (
                    <button
                      onClick={() => {
                        onDuplicate();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate Template
                    </button>
                  )}

                  {onExport && (
                    <button
                      onClick={() => {
                        onExport();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Download className="w-4 h-4" />
                      Export Template
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate(`/settings/templates/${template.id}/history`);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <History className="w-4 h-4" />
                    View History
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/settings/templates/${template.id}/embed`);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Code className="w-4 h-4" />
                    Get Embed Code
                  </button>

                  <div className="h-px bg-gray-200 my-1" />

                  <button
                    onClick={() => {
                      navigate(`/settings/templates/${template.id}/settings`);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Settings className="w-4 h-4" />
                    Template Settings
                  </button>

                  {template.permissions?.canEdit && (
                    <>
                      <div className="h-px bg-gray-200 my-1" />
                      
                      {onArchive && template.status !== 'archived' && (
                        <button
                          onClick={() => {
                            onArchive();
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-orange-600 hover:bg-orange-50 flex items-center gap-3"
                        >
                          <Archive className="w-4 h-4" />
                          Archive Template
                        </button>
                      )}

                      {onDelete && template.permissions?.canDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this template?')) {
                              onDelete();
                              setShowMenu(false);
                            }
                          }}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Template
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-200`}>
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            {notification.type === 'info' && <Info className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateHeader;