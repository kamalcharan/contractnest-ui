// src/hooks/useStorageManagement.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';
import { 
  STORAGE_CATEGORIES, 
  formatFileSize,
  getFileExtension,
  isFileTypeAllowed,
  isFileSizeAllowed
} from '@/utils/constants/storageConstants';

// Types
export interface StorageStats {
  storageSetupComplete: boolean;
  quota: number;
  used: number;
  available: number;
  usagePercentage: number;
  totalFiles: number;
  categories: CategoryStats[];
}

export interface CategoryStats {
  id: string;
  name: string;
  count: number;
}

export interface StorageFile {
  id: string;
  tenant_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  file_category: string;
  mime_type: string;
  download_url: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// Hook implementation
export const useStorageManagement = () => {
  const { currentTenant, setCurrentTenant, isLive } = useAuth();
  
  // States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [storageSetupComplete, setStorageSetupComplete] = useState<boolean>(false);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [categoryFiles, setCategoryFiles] = useState<Record<string, StorageFile[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  
  // Helper function to ensure headers are set
  const ensureHeaders = useCallback(() => {
    if (currentTenant?.id) {
      // Set tenant ID header
      api.defaults.headers.common['x-tenant-id'] = currentTenant.id;
    }
    
    // The authorization header should already be set by the auth context/interceptor
    // But we can check and log if it's missing
    if (!api.defaults.headers.common['Authorization']) {
      console.warn('Authorization header not set in api defaults');
    }
  }, [currentTenant]);
  
  // Fetch storage stats
  const fetchStorageStats = useCallback(async () => {
    if (!currentTenant?.id) {
      setIsLoading(false);
      return;
    }
    
    // Ensure headers are set
    ensureHeaders();
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching storage stats for ${isLive ? 'Live' : 'Test'} environment`);
      
      const response = await api.get(API_ENDPOINTS.STORAGE.STATS);
      
      if (!isMountedRef.current) return;
      
      const data = response.data;
      
      // Handle the response based on storage setup status
      if (data.storageSetupComplete === false) {
        setStorageSetupComplete(false);
        setStorageStats(null);
      } else {
        setStorageStats(data);
        setStorageSetupComplete(true);
        
        // Update tenant in context if needed
        if (currentTenant && !currentTenant.storage_setup_complete && setCurrentTenant) {
          setCurrentTenant({
            ...currentTenant,
            storage_setup_complete: true
          });
        }
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      console.error('Error fetching storage stats:', err);
      
      // Handle different error scenarios
      if (err.response?.status === 401) {
        // Don't set error for auth issues, let the auth interceptor handle it
        console.error('Authentication error in storage stats');
      } else if (err.response?.status === 404 || 
                (err.response?.status === 200 && err.response?.data?.storageSetupComplete === false)) {
        // Storage not set up yet - this is a valid state
        setStorageSetupComplete(false);
        setStorageStats(null);
        setError(null);
      } else {
        // Actual error
        setError(err.response?.data?.error || 'Failed to load storage statistics');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [currentTenant, setCurrentTenant, isLive, ensureHeaders]);
  
  // Setup storage
  const setupStorage = async (): Promise<boolean> => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected');
      return false;
    }
    
    // Ensure headers are set
    ensureHeaders();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log(`Setting up storage for ${isLive ? 'Live' : 'Test'} environment`);
      
      const response = await api.post(API_ENDPOINTS.STORAGE.SETUP);
      
      if (!isMountedRef.current) return false;
      
      const data = response.data;
      
      setStorageStats(data);
      setStorageSetupComplete(true);
      
      // Update tenant in context
      if (setCurrentTenant) {
        setCurrentTenant({
          ...currentTenant,
          storage_setup_complete: true
        });
      }
      
      toast.success('Storage setup completed successfully');
      return true;
    } catch (err: any) {
      if (!isMountedRef.current) return false;
      
      console.error('Error setting up storage:', err);
      
      // Check if storage is already set up
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.error || '';
        
        if (errorMessage.toLowerCase().includes('already set up')) {
          // Storage is already set up, update state accordingly
          setStorageSetupComplete(true);
          
          // Try to fetch current stats
          await fetchStorageStats();
          
          toast.info('Storage is already set up');
          return true;
        }
      }
      
      setError(err.response?.data?.error || 'Failed to setup storage');
      toast.error(err.response?.data?.error || 'Failed to setup storage');
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };
  
  // Fetch files
  const fetchFiles = useCallback(async (category?: string): Promise<StorageFile[]> => {
    if (!currentTenant?.id || !storageSetupComplete) {
      return [];
    }
    
    // Ensure headers are set
    ensureHeaders();
    
    setIsLoading(true);
    setError(null);
    
    try {
      let url = API_ENDPOINTS.STORAGE.FILES;
      if (category) {
        url += `?category=${category}`;
      }
      
      console.log(`Fetching files for ${isLive ? 'Live' : 'Test'} environment${category ? ` (category: ${category})` : ''}`);
      
      const response = await api.get(url);
      
      if (!isMountedRef.current) return [];
      
      const data = response.data || [];
      
      if (category) {
        setCategoryFiles(prev => ({
          ...prev,
          [category]: data
        }));
      } else {
        setFiles(data);
        
        // Group files by category
        const groupedFiles: Record<string, StorageFile[]> = {};
        STORAGE_CATEGORIES.forEach(cat => {
          groupedFiles[cat.id] = data.filter((file: StorageFile) => file.file_category === cat.id);
        });
        setCategoryFiles(groupedFiles);
      }
      
      return data;
    } catch (err: any) {
      if (!isMountedRef.current) return [];
      
      console.error('Error fetching files:', err);
      
      // Return empty array for errors to prevent UI issues
      if (err.response?.status === 404 || err.response?.status === 400) {
        return [];
      }
      
      setError(err.response?.data?.error || 'Failed to load files');
      return [];
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [currentTenant?.id, storageSetupComplete, isLive, ensureHeaders]);
  
  // Upload single file - Using fetch instead of axios
  const uploadFile = async (file: File, category: string): Promise<StorageFile | null> => {
    if (!currentTenant?.id || !storageSetupComplete) {
      toast.error('Storage is not set up yet');
      return null;
    }
    
    // Validate file size
    if (!isFileSizeAllowed(file.size, category)) {
      toast.error(`File size exceeds the maximum limit of ${formatFileSize(5 * 1024 * 1024)}`);
      return null;
    }
    
    // Validate file type
    if (!isFileTypeAllowed(file.type, category)) {
      toast.error('File type is not allowed for this category');
      return null;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Check current storage quota before uploading
      if (storageStats && file.size > storageStats.available) {
        toast.error('Not enough storage space available');
        return null;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      
      // Debug: Log what we're sending
      console.log('=== Upload Debug ===');
      console.log('Uploading file:');
      console.log('- Name:', file.name);
      console.log('- Size:', file.size);
      console.log('- Type:', file.type);
      console.log('- Category:', category);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      // Get auth token and tenant ID
      const authToken = api.defaults.headers.common['Authorization'] || 
                       localStorage.getItem('auth_token') || 
                       sessionStorage.getItem('auth_token');
      const tenantId = currentTenant.id;
      const baseURL = api.defaults.baseURL;
      const uploadURL = `${baseURL}${API_ENDPOINTS.STORAGE.FILES}`;
      
      console.log('Upload configuration:');
      console.log('- URL:', uploadURL);
      console.log('- Auth Token:', authToken ? 'Present' : 'Missing');
      console.log('- Tenant ID:', tenantId);
      console.log('- Environment:', isLive ? 'Live' : 'Test');
      
      // Use fetch instead of axios to avoid header issues
      const response = await fetch(uploadURL, {
        method: 'POST',
        headers: {
          'Authorization': authToken as string,
          'x-tenant-id': tenantId,
          'x-environment': isLive ? 'live' : 'test'
          // NO Content-Type header - let browser set it with boundary
        },
        body: formData
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }
      
      const uploadedFile = await response.json();
      console.log('Upload successful:', uploadedFile);
      
      // Update local state
      setFiles(prev => [uploadedFile, ...prev]);
      setCategoryFiles(prev => ({
        ...prev,
        [category]: [uploadedFile, ...(prev[category] || [])]
      }));
      
      // Refresh storage stats
      fetchStorageStats();
      
      toast.success('File uploaded successfully');
      return uploadedFile;
    } catch (err: any) {
      console.error('=== Upload Error ===');
      console.error('Error details:', err);
      
      setError(err.message || 'Failed to upload file');
      toast.error(err.message || 'Failed to upload file');
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Upload multiple files - Also using fetch
  const uploadMultipleFiles = async (files: File[], category: string): Promise<boolean> => {
    if (!currentTenant?.id || !storageSetupComplete) {
      toast.error('Storage is not set up yet');
      return false;
    }
    
    // Validate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (storageStats && totalSize > storageStats.available) {
      toast.error('Not enough storage space available for all files');
      return false;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Add all files to form data
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Add category for all files
      formData.append('category', category);
      
      console.log(`Uploading ${files.length} files to ${isLive ? 'Live' : 'Test'} environment`);
      
      // Get auth token and tenant ID
      const authToken = api.defaults.headers.common['Authorization'] || 
                       localStorage.getItem('auth_token') || 
                       sessionStorage.getItem('auth_token');
      const tenantId = currentTenant.id;
      const baseURL = api.defaults.baseURL;
      const uploadURL = `${baseURL}${API_ENDPOINTS.STORAGE.FILES}/multiple`;
      
      // Use fetch for multiple files too
      const response = await fetch(uploadURL, {
        method: 'POST',
        headers: {
          'Authorization': authToken as string,
          'x-tenant-id': tenantId,
          'x-environment': isLive ? 'live' : 'test'
          // NO Content-Type header
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!isMountedRef.current) return false;
      
      // Update local state with successful uploads
      const successfulUploads = result.results
        .filter((r: any) => r.file)
        .map((r: any) => r.file);
      
      if (successfulUploads.length > 0) {
        setFiles(prev => [...successfulUploads, ...prev]);
        setCategoryFiles(prev => ({
          ...prev,
          [category]: [...successfulUploads, ...(prev[category] || [])]
        }));
      }
      
      // Refresh storage stats
      fetchStorageStats();
      
      // Show appropriate message
      if (result.summary.failed > 0) {
        toast.warning(result.message);
      } else {
        toast.success(result.message);
      }
      
      return result.summary.failed === 0;
    } catch (err: any) {
      if (!isMountedRef.current) return false;
      
      console.error('Error uploading multiple files:', err);
      setError(err.message || 'Failed to upload files');
      toast.error(err.message || 'Failed to upload files');
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };
  
  // Delete single file
  const deleteFile = async (fileId: string): Promise<boolean> => {
    if (!currentTenant?.id || !storageSetupComplete) return false;
    
    // Ensure headers are set
    ensureHeaders();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log(`Deleting file from ${isLive ? 'Live' : 'Test'} environment`);
      
      await api.delete(`${API_ENDPOINTS.STORAGE.FILES}/${fileId}`);
      
      if (!isMountedRef.current) return false;
      
      // Update local state
      const fileToDelete = files.find(f => f.id === fileId);
      
      if (fileToDelete) {
        const category = fileToDelete.file_category;
        
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setCategoryFiles(prev => ({
          ...prev,
          [category]: prev[category]?.filter(f => f.id !== fileId) || []
        }));
      }
      
      // Refresh storage stats
      fetchStorageStats();
      
      toast.success('File deleted successfully');
      return true;
    } catch (err: any) {
      if (!isMountedRef.current) return false;
      
      console.error('Error deleting file:', err);
      setError(err.response?.data?.error || 'Failed to delete file');
      toast.error(err.response?.data?.error || 'Failed to delete file');
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };
  
  // Delete multiple files
  const deleteMultipleFiles = async (fileIds: string[]): Promise<boolean> => {
    if (!currentTenant?.id || !storageSetupComplete) return false;
    
    // Ensure headers are set
    ensureHeaders();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log(`Deleting ${fileIds.length} files from ${isLive ? 'Live' : 'Test'} environment`);
      
      const response = await api.post(`${API_ENDPOINTS.STORAGE.FILES}/delete-batch`, {
        fileIds
      });
      
      if (!isMountedRef.current) return false;
      
      const result = response.data;
      
      // Update local state by removing deleted files
      const deletedIds = result.results
        .filter((r: any) => r.success)
        .map((r: any) => r.fileId);
      
      if (deletedIds.length > 0) {
        setFiles(prev => prev.filter(f => !deletedIds.includes(f.id)));
        
        // Update category files
        const newCategoryFiles = { ...categoryFiles };
        Object.keys(newCategoryFiles).forEach(category => {
          newCategoryFiles[category] = newCategoryFiles[category].filter(
            f => !deletedIds.includes(f.id)
          );
        });
        setCategoryFiles(newCategoryFiles);
      }
      
      // Refresh storage stats
      fetchStorageStats();
      
      // Show appropriate message
      if (result.summary.failed > 0) {
        toast.warning(result.message);
      } else {
        toast.success(result.message);
      }
      
      return result.summary.failed === 0;
    } catch (err: any) {
      if (!isMountedRef.current) return false;
      
      console.error('Error deleting multiple files:', err);
      setError(err.response?.data?.error || 'Failed to delete files');
      toast.error(err.response?.data?.error || 'Failed to delete files');
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };
  
  // Get storage categories
  const getStorageCategories = useCallback(() => {
    return STORAGE_CATEGORIES;
  }, []);
  
  // Clear all data when environment changes
  const clearAllData = useCallback(() => {
    console.log('Clearing all storage data for environment switch');
    setStorageStats(null);
    setFiles([]);
    setCategoryFiles({});
    setSelectedCategory(null);
    setError(null);
    setStorageSetupComplete(!!currentTenant?.storage_setup_complete);
  }, [currentTenant]);
  
  // Initialize storage setup status from tenant
  useEffect(() => {
    if (currentTenant) {
      setStorageSetupComplete(!!currentTenant.storage_setup_complete);
    }
  }, [currentTenant]);
  
  // Initial data load
  useEffect(() => {
    if (currentTenant?.id) {
      fetchStorageStats();
    }
  }, [currentTenant?.id, fetchStorageStats]);
  
  // Load files when storage is confirmed as setup
  useEffect(() => {
    if (storageSetupComplete && currentTenant?.id) {
      fetchFiles();
    }
  }, [storageSetupComplete, currentTenant?.id, fetchFiles]);
  
  // Handle environment changes
  useEffect(() => {
    // Clear data when environment changes
    return () => {
      clearAllData();
    };
  }, [isLive, clearAllData]);
  
  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return {
    // State
    isLoading,
    isSubmitting,
    storageStats,
    storageSetupComplete,
    files,
    categoryFiles,
    selectedCategory,
    error,
    
    // Actions
    setupStorage,
    fetchStorageStats,
    fetchFiles,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    deleteMultipleFiles,
    getStorageCategories,
    setSelectedCategory,
    clearAllData,
  };
};

export default useStorageManagement;