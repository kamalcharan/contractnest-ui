// src/pages/catalog/EquipmentsPage.tsx
// UPDATED: Simplified to match ServicesPage pattern

import React from 'react';
import { Helmet } from 'react-helmet-async';
import CatalogContainer from '../../components/catalog/shared/CatalogContainer';
import { CATALOG_ITEM_TYPES } from '../../utils/constants/catalog';

const EquipmentsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Equipment Catalog | ContractNest</title>
        <meta name="description" content="Manage your equipment catalog including machinery, tools, and operational equipment available for contracts." />
      </Helmet>
      
      <CatalogContainer catalogType={CATALOG_ITEM_TYPES.EQUIPMENT} />
    </>
  );
};

export default EquipmentsPage;
