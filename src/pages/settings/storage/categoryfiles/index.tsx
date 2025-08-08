// src/pages/settings/storage/categoryfiles/index.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, File, FileText, Image, Video, Trash2, Download, Search, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { useStorageManagement } from '@/hooks/useStorageManagement';
import { formatFileSize, getFileExtension, FILE_TYPE_ICONS } from '@/utils/constants/storageConstants';
import { analyticsService } from '@/services/analytics.service';
import FileUploader from '@/components/storage/FileUploader';
import FileList from '@/components/storage/FileList';
import { useTheme } from '@/contexts/ThemeContext';

const CategoryFilesPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const { 
    isLoading, 
    isSubmitting,
    storageSetupComplete,
    fetchFiles,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    deleteMultipleFiles,
    getStorageCategories,
    categoryFiles
  } = useStorageManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [multipleUploadMode, setMultipleUploadMode] = useState(false);
  const [showUploadModeDropdown, setShowUploadModeDropdown] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  
  // Find the category from the categories list
  const categories = getStorageCategories();
  const category = categories.find(c => c.id === categoryId);
  
  // Handle navigation if category doesn't exist
  useEffect(() => {
    if (!isLoading && !category) {
      navigate('/settings/storage/storagemanagement');
    }
  }, [category, isLoading, navigate]);
  
  // Track page view
  useEffect(() => {
    if (category) {
      analyticsService.trackPageView(
        `settings/storage/category/${categoryId}`, 
        `${category.name} Files`
      );
    }
  }, [categoryId, category]);
  
  // Fetch files for this category
  useEffect(() => {
    if (categoryId && storageSetupComplete) {
      fetchFiles(categoryId);
    }
  }, [categoryId, fetchFiles, storageSetupComplete]);
  
  // Get files for this category
  const files = categoryId ? (categoryFiles[categoryId] || []) : [];
  
  // Filter files by search term
  const filteredFiles = files.filter(file => 
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle back button
  const handleBack = () => {
    navigate('/settings/storage/storagemanagement');
  };
  
  // Handle single file upload
  const handleSingleFileUpload = async (file: File) => {
    if (!categoryId) return;
    
    const uploaded = await uploadFile(file, categoryId);
    if (uploaded) {
      setShowUploader(false);
      setMultipleUploadMode(false);
    }
  };
  
  // Handle multiple file upload
  const handleMultipleFileUpload = async (files: File[]) => {
    if (!categoryId) return;
    
    const success = await uploadMultipleFiles(files, categoryId);
    if (success) {
      setShowUploader(false);
      setMultipleUploadMode(false);
    }
  };
  
  // Combined upload handler
  const handleFileUpload = async (filesOrFile: File | File[]) => {
    if (Array.isArray(filesOrFile)) {
      await handleMultipleFileUpload(filesOrFile);
    } else {
      await handleSingleFileUpload(filesOrFile);
    }
  };
  
  // Handle upload button click with mode
  const handleUploadClick = (multiple: boolean = false) => {
    setMultipleUploadMode(multiple);
    setShowUploader(true);
    setShowUploadModeDropdown(false);
  };
  
  // Handle batch delete
  const handleBatchDelete = async (fileIds: string[]) => {
    await deleteMultipleFiles(fileIds);
  };
  
  // Handle delete confirmation for single file (legacy support)
  const handleDeleteClick = (fileId: string) => {
    setFileToDelete(fileId);
  };
  
  // Handle confirmed delete
  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    
    const success = await deleteFile(fileToDelete);
    if (success) {
      setFileToDelete(null);
    }
  };
  
  // Cancel delete
  const handleDeleteCancel = () => {
    setFileToDelete(null);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.upload-dropdown')) {
        setShowUploadModeDropdown(false);
      }
    };
    
    if (showUploadModeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showUploadModeDropdown]);
  
  if (!category) {
    return (
      <div 
        className="p-6 transition-colors duration-200 min-h-screen"
        style={{
          background: isDarkMode 
            ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
            : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
        }}
      >
        <div className="flex justify-center py-12">
          <div 
            className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full transition-colors"
            style={{ borderColor: colors.brand.primary }}
          ></div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="p-6 transition-colors duration-200 min-h-screen"
      style={{
        background: isDarkMode 
          ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
          : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
      }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full transition-colors hover:opacity-80"
            style={{ backgroundColor: colors.utility.secondaryBackground + '80' }}
          >
            <ArrowLeft 
              className="h-5 w-5 transition-colors" 
              style={{ color: colors.utility.secondaryText }}
            />
          </button>
          <div>
            <h1 
              className="text-2xl font-bold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {category.name}
            </h1>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {category.description}
            </p>
          </div>
        </div>
        
        {/* Upload Button with Dropdown */}
        <div className="relative upload-dropdown">
          <div className="flex items-center">
            <button
              onClick={() => handleUploadClick(false)}
              className="px-4 py-2 rounded-l-md transition-colors flex items-center hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                color: '#FFFFFF'
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUploadModeDropdown(!showUploadModeDropdown);
              }}
              className="px-2 py-2 rounded-r-md transition-colors hover:opacity-90 border-l"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                color: '#FFFFFF',
                borderColor: '#FFFFFF20'
              }}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          
          {/* Dropdown Menu */}
          {showUploadModeDropdown && (
            <div 
              className="absolute right-0 mt-1 w-48 rounded-md shadow-lg border z-10 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.primaryText + '20'
              }}
            >
              <button
                onClick={() => handleUploadClick(false)}
                className="w-full px-4 py-2 text-left transition-colors rounded-t-md hover:opacity-80"
                style={{ backgroundColor: colors.utility.primaryBackground + '50' }}
              >
                <div 
                  className="font-medium transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Single File
                </div>
                <div 
                  className="text-xs transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Upload one file at a time
                </div>
              </button>
              <button
                onClick={() => handleUploadClick(true)}
                className="w-full px-4 py-2 text-left transition-colors rounded-b-md hover:opacity-80"
                style={{ backgroundColor: colors.utility.primaryBackground + '50' }}
              >
                <div 
                  className="font-medium transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Multiple Files
                </div>
                <div 
                  className="text-xs transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Upload up to 10 files at once
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* File Uploader Modal */}
      {showUploader && (
        <FileUploader
          category={category}
          onUpload={handleFileUpload}
          onCancel={() => {
            setShowUploader(false);
            setMultipleUploadMode(false);
          }}
          isUploading={isSubmitting}
        //  multiple={multipleUploadMode}
        />
      )}
      
      {/* Delete Confirmation Modal (for backward compatibility) */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            className="rounded-lg p-6 max-w-md w-full mx-4 transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <h3 
              className="text-lg font-semibold mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Delete File
            </h3>
            <p 
              className="mb-4 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Are you sure you want to delete this file? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border rounded transition-colors hover:opacity-80"
                style={{
                  borderColor: colors.utility.primaryText + '40',
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded transition-colors flex items-center hover:opacity-80"
                disabled={isSubmitting}
                style={{
                  backgroundColor: colors.semantic.error,
                  color: '#FFFFFF'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Search and Filter */}
      <div 
        className="border rounded-lg mb-6 transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search 
                className="h-4 w-4 transition-colors" 
                style={{ color: colors.utility.secondaryText }}
              />
            </div>
            <input
              type="text"
              placeholder={`Search ${category.name.toLowerCase()}...`}
              className="pl-10 w-full p-2 rounded-md border focus:outline-none focus:ring-1 transition-colors"
              style={{
                borderColor: colors.utility.primaryText + '40',
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
            {files.length > 0 && (
              <span className="ml-2">
                ({formatFileSize(files.reduce((sum, f) => sum + f.file_size, 0))} total)
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Files List - Using the FileList component for consistency */}
      <FileList
        files={searchTerm ? filteredFiles : files}
        onDelete={deleteFile}
        onBatchDelete={handleBatchDelete}
        emptyMessage={`You haven't uploaded any files to ${category.name} yet.`}
        isLoading={isLoading}
        enableBatchOperations={true}
        className="border rounded-lg transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText + '20'
        }}
      />
    </div>
  );
};

export default CategoryFilesPage;