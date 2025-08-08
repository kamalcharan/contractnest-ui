// src/components/storage/FileUploader.tsx
import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { 
  formatFileSize, 
  MAX_FILE_SIZE, 
  isFileTypeAllowed, 
  getAllowedFileTypesText 
} from '@/utils/constants/storageConstants';
import { useTheme } from '@/contexts/ThemeContext';

interface FileUploaderProps {
  category: {
    id: string;
    name: string;
    allowedTypes: string[];
    description?: string;
  };
  onUpload: (files: File | File[]) => Promise<void>;
  onCancel: () => void;
  isUploading: boolean;
  multiple?: boolean; // New prop for multiple file support
}

interface FileValidation {
  file: File;
  valid: boolean;
  error?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  category,
  onUpload,
  onCancel,
  isUploading,
  multiple = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileValidation[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Validate a single file
  const validateFile = (file: File): FileValidation => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        file,
        valid: false,
        error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)}`
      };
    }
    
    // Validate file type
    if (!isFileTypeAllowed(file.type, category.id)) {
      return {
        file,
        valid: false,
        error: `File type not allowed. Supported: ${getAllowedFileTypesText(category.id)}`
      };
    }
    
    return { file, valid: true };
  };
  
  // Handle file selection
  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setSelectedFiles([]);
      return;
    }
    
    const fileArray = Array.from(files);
    const validatedFiles = fileArray.map(validateFile);
    
    if (multiple) {
      setSelectedFiles(validatedFiles);
    } else {
      setSelectedFiles([validatedFiles[0]]);
    }
  };
  
  // Remove a file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle click on the dropzone
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };
  
  // Handle upload button click
  const handleUploadClick = async () => {
    const validFiles = selectedFiles
      .filter(f => f.valid)
      .map(f => f.file);
    
    if (validFiles.length === 0) return;
    
    if (multiple) {
      await onUpload(validFiles);
    } else {
      await onUpload(validFiles[0]);
    }
  };
  
  // Calculate totals
  const validCount = selectedFiles.filter(f => f.valid).length;
  const totalSize = selectedFiles
    .filter(f => f.valid)
    .reduce((sum, f) => sum + f.file.size, 0);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transition-colors"
        style={{ backgroundColor: colors.utility.secondaryBackground }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 
            className="text-lg font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Upload {multiple ? 'Files' : 'File'}
          </h3>
          <button 
            onClick={onCancel}
            className="transition-colors hover:opacity-80"
            style={{ color: colors.utility.secondaryText }}
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Category Info */}
        <div className="mb-4">
          <p 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Uploading to <span 
              className="font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >{category.name}</span>
          </p>
          {multiple && (
            <p 
              className="text-xs mt-1 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              You can select up to 10 files at once
            </p>
          )}
        </div>
        
        {/* File Drop Zone */}
        <div 
          className="border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer"
          style={{
            borderColor: dragActive ? colors.brand.primary : `${colors.utility.primaryText}40`,
            backgroundColor: dragActive ? `${colors.brand.primary}05` : 'transparent'
          }}
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
            accept={category.allowedTypes.join(',')}
            disabled={isUploading}
            multiple={multiple}
          />
          
          <div className="text-center">
            {selectedFiles.length === 0 ? (
              <div className="space-y-2">
                <div 
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                >
                  <Upload 
                    className="w-6 h-6 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  />
                </div>
                <div>
                  <span 
                    className="font-medium transition-colors"
                    style={{ color: colors.brand.primary }}
                  >
                    Click to upload
                  </span>
                  <span 
                    className="transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  > or drag and drop</span>
                </div>
                <div 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Supported formats: {getAllowedFileTypesText(category.id)}
                </div>
                <div 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Max file size: {formatFileSize(MAX_FILE_SIZE)}
                  {multiple && ' per file'}
                </div>
              </div>
            ) : (
              <div 
                className="text-sm transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Click or drag to add more files
              </div>
            )}
          </div>
        </div>
        
        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center mb-2">
              <h4 
                className="font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Selected Files
              </h4>
              <span 
                className="text-sm transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {validCount} valid, {formatFileSize(totalSize)} total
              </span>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {selectedFiles.map((fileValidation, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: fileValidation.valid 
                      ? colors.utility.secondaryBackground
                      : `${colors.semantic.error}10`,
                    borderColor: fileValidation.valid 
                      ? `${colors.utility.primaryText}20`
                      : `${colors.semantic.error}40`
                  }}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {fileValidation.valid ? (
                        <FileText 
                          className="w-5 h-5"
                          style={{ color: colors.brand.primary }}
                        />
                      ) : (
                        <AlertCircle 
                          className="w-5 h-5"
                          style={{ color: colors.semantic.error }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div 
                        className="font-medium truncate transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {fileValidation.file.name}
                      </div>
                      <div className="text-sm">
                        {fileValidation.valid ? (
                          <span 
                            className="transition-colors"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            {formatFileSize(fileValidation.file.size)}
                          </span>
                        ) : (
                          <span 
                            className="transition-colors"
                            style={{ color: colors.semantic.error }}
                          >
                            {fileValidation.error}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="ml-2 p-1 rounded transition-all duration-200 hover:opacity-80"
                    style={{ 
                      backgroundColor: `${colors.utility.primaryText}10`,
                      color: colors.utility.primaryText
                    }}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded transition-all duration-200 hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}40`,
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText
            }}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 text-white rounded transition-all duration-200 flex items-center disabled:opacity-50 hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
            disabled={validCount === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {validCount > 1 ? `${validCount} Files` : 'File'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;