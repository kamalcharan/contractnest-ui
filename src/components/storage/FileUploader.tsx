// src/components/storage/FileUploader.tsx
import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Loader2 } from 'lucide-react';
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
  onUpload: (file: File) => Promise<void>;
  onCancel: () => void;
  isUploading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  category,
  onUpload,
  onCancel,
  isUploading
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = files[0];
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}`);
      setSelectedFile(null);
      return;
    }
    
    // Validate file type
    if (!isFileTypeAllowed(file.type, category.id)) {
      setError(`File type not allowed. Supported formats: ${getAllowedFileTypesText(category.id)}`);
      setSelectedFile(null);
      return;
    }
    
    setError(null);
    setSelectedFile(file);
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
    if (selectedFile) {
      await onUpload(selectedFile);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload File</h3>
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
        </div>
        
        {/* File Drop Zone */}
        <div 
          className={`
            border-2 border-dashed rounded-lg p-8 
            ${dragActive ? 'border-primary bg-primary/5' : 'border-border'} 
            ${error ? 'border-red-500 bg-red-50' : ''}
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
          />
          
          <div className="text-center">
            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="font-medium">{selectedFile.name}</div>
                <div className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</div>
              </div>
            ) : error ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-red-500 font-medium">Error</div>
                <div className="text-sm text-red-500">{error}</div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Please select another file or <span className="text-primary hover:underline">try again</span>
                </div>
              </div>
            ) : (
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
                </div>
              </div>
            )}
          </div>
        </div>
        
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
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;