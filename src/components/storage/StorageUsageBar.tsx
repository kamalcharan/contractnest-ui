// src/components/storage/FileUploader.tsx
import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { 
  formatFileSize, 
  MAX_FILE_SIZE, 
  isFileTypeAllowed, 
  getAllowedFileTypesText 
} from '@/utils/constants/storageConstants';

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
      <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Upload {multiple ? 'Files' : 'File'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Category Info */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Uploading to <span className="font-medium text-foreground">{category.name}</span>
          </p>
          {multiple && (
            <p className="text-xs text-muted-foreground mt-1">
              You can select up to 10 files at once
            </p>
          )}
        </div>
        
        {/* File Drop Zone */}
        <div 
          className={`
            border-2 border-dashed rounded-lg p-8 
            ${dragActive ? 'border-primary bg-primary/5' : 'border-border'} 
            transition-colors cursor-pointer
          `}
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
                <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </div>
                <div className="text-sm text-muted-foreground">
                  Supported formats: {getAllowedFileTypesText(category.id)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Max file size: {formatFileSize(MAX_FILE_SIZE)}
                  {multiple && ' per file'}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Click or drag to add more files
              </div>
            )}
          </div>
        </div>
        
        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Selected Files</h4>
              <span className="text-sm text-muted-foreground">
                {validCount} valid, {formatFileSize(totalSize)} total
              </span>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {selectedFiles.map((fileValidation, index) => (
                <div 
                  key={index}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border
                    ${fileValidation.valid 
                      ? 'bg-card border-border' 
                      : 'bg-red-50 border-red-200'}
                  `}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {fileValidation.valid ? (
                        <FileText className="w-5 h-5 text-primary" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {fileValidation.file.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {fileValidation.valid ? (
                          formatFileSize(fileValidation.file.size)
                        ) : (
                          <span className="text-red-500">{fileValidation.error}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="ml-2 p-1 hover:bg-muted rounded"
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
            className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50"
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