// src/components/template-designer/canvas/CanvasToolbar.tsx
import React from 'react';
import { 
  Save, 
  Eye, 
  Code, 
  Undo2, 
  Redo2, 
  Download, 
  Share2, 
  Settings,
  FileText,
  Copy,
  Trash2,
  AlertCircle,
  Check,
  Clock,
  PlayCircle,
  ChevronDown
} from 'lucide-react';

interface CanvasToolbarProps {
  templateName: string;
  isDirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  viewMode: 'design' | 'contract' | 'preview';
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onExport: () => void;
  onShare: () => void;
  onViewModeChange: (mode: 'design' | 'contract' | 'preview') => void;
  onSettings: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  templateName,
  isDirty,
  canUndo,
  canRedo,
  viewMode,
  onSave,
  onUndo,
  onRedo,
  onPreview,
  onExport,
  onShare,
  onViewModeChange,
  onSettings
}) => {
  const [showSaveMenu, setShowSaveMenu] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(new Date());
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave();
    setLastSaved(new Date());
    setIsSaving(false);
    
    // Show success feedback
    setTimeout(() => {
      setShowSaveMenu(false);
    }, 1000);
  };

  const handleSaveAs = (type: 'draft' | 'version' | 'template') => {
    console.log(`Save as ${type}`);
    setShowSaveMenu(false);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never saved';
    
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return lastSaved.toLocaleDateString();
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Template Name */}
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">{templateName}</h2>
            {isDirty && (
              <span className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
            )}
          </div>

          <div className="h-6 w-px bg-gray-300" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                !canUndo ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                !canRedo ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('design')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'design'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                Design
              </div>
            </button>
            <button
              onClick={() => onViewModeChange('contract')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'contract'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Contract
              </div>
            </button>
            <button
              onClick={() => onViewModeChange('preview')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Preview
              </div>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Last Saved Indicator */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatLastSaved()}</span>
          </div>

          {/* Save Button with Dropdown */}
          <div className="relative">
            <div className="flex">
              <button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className={`px-4 py-2 rounded-l-lg font-medium transition-colors flex items-center gap-2 ${
                  isDirty
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
              <button
                onClick={() => setShowSaveMenu(!showSaveMenu)}
                className={`px-2 py-2 rounded-r-lg border-l transition-colors ${
                  isDirty
                    ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Save Dropdown Menu */}
            {showSaveMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => handleSaveAs('draft')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-gray-500" />
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSaveAs('version')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                  Save as New Version
                </button>
                <button
                  onClick={() => handleSaveAs('template')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  Save as Template
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <button
            onClick={onPreview}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Preview"
          >
            <PlayCircle className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={onExport}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={onShare}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>

          <div className="h-6 w-px bg-gray-300" />

          <button
            onClick={onSettings}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Template Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Auto-save indicator */}
      {isDirty && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 animate-pulse" />
      )}
    </div>
  );
};

// Export Modal Component
export const ExportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <h3 className="text-lg font-semibold mb-4">Export Template</h3>
        
        <div className="space-y-3">
          <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium">Export as JSON</div>
                <div className="text-sm text-gray-500">Template configuration file</div>
              </div>
            </div>
          </button>
          
          <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium">Export as HTML</div>
                <div className="text-sm text-gray-500">Embeddable template</div>
              </div>
            </div>
          </button>
          
          <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium">Export as PDF</div>
                <div className="text-sm text-gray-500">Print-ready document</div>
              </div>
            </div>
          </button>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};