// src/pages/catalog-studio/template.tsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useCatBlocks } from '../../hooks/queries/useCatBlocks';

const CatalogStudioTemplatePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  const { data, isLoading, error } = useCatBlocks();

  if (isLoading) {
    return <div style={{ padding: 40 }}>Loading blocks...</div>;
  }

  if (error) {
    return <div style={{ padding: 40, color: 'red' }}>Error: {error.message}</div>;
  }

  return (
    <div style={{ padding: 40, background: 'white' }}>
      <h1>Template Page - Minimal Test</h1>
      <p>Blocks loaded: {data?.data?.blocks?.length || 0}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default CatalogStudioTemplatePage;