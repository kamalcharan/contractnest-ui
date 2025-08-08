// src/contexts/MasterDataContext.tsx
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMasterDataCache } from '@/hooks/useMasterData';

interface MasterDataContextType {
  invalidateCategory: (categoryName: string) => void;
  invalidateCategories: (categoryNames: string[]) => void;
  clearAllCache: () => void;
  preloadCategories: (categoryNames: string[]) => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType>({
  invalidateCategory: () => {},
  invalidateCategories: () => {},
  clearAllCache: () => {},
  preloadCategories: async () => {}
});

export const useMasterDataContext = () => {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error('useMasterDataContext must be used within MasterDataProvider');
  }
  return context;
};

interface MasterDataProviderProps {
  children: ReactNode;
}

export const MasterDataProvider: React.FC<MasterDataProviderProps> = ({ children }) => {
  const { currentTenant } = useAuth();
  const { clearCategoryCache, clearAllCache, preloadCategories } = useMasterDataCache();

  const invalidateCategory = useCallback((categoryName: string) => {
    clearCategoryCache(categoryName);
  }, [clearCategoryCache]);

  const invalidateCategories = useCallback((categoryNames: string[]) => {
    categoryNames.forEach(categoryName => {
      clearCategoryCache(categoryName);
    });
  }, [clearCategoryCache]);

  return (
    <MasterDataContext.Provider 
      value={{ 
        invalidateCategory, 
        invalidateCategories,
        clearAllCache,
        preloadCategories
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
};