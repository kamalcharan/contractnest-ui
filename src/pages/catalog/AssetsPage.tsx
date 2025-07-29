// src/pages/catalog/AssetsPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import CatalogContainer from '../../components/catalog/shared/CatalogContainer';
import { CATALOG_ITEM_TYPES } from '../../utils/constants/catalog';

const AssetsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Assets Catalog | ContractNest</title>
        <meta name="description" content="Manage your asset catalog including facilities, properties, vehicles, and infrastructure." />
      </Helmet>
      
      <CatalogContainer catalogType={CATALOG_ITEM_TYPES.ASSET} />
    </>
  );
};

export default AssetsPage;