// src/pages/catalog/SparePartsPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import CatalogContainer from '../../components/catalog/shared/CatalogContainer';
import { CATALOG_ITEM_TYPES } from '../../utils/constants/catalog';

const SparePartsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Spare Parts Catalog | ContractNest</title>
        <meta name="description" content="Manage your spare parts catalog including replacement parts, components, and consumables." />
      </Helmet>
      
      <CatalogContainer catalogType={CATALOG_ITEM_TYPES.SPARE_PART} />
    </>
  );
};

export default SparePartsPage;