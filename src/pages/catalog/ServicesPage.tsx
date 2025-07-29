// src/pages/catalog/ServicesPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import CatalogContainer from '../../components/catalog/shared/CatalogContainer';
import { CATALOG_ITEM_TYPES } from '../../utils/constants/catalog';

const ServicesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Services Catalog | ContractNest</title>
        <meta name="description" content="Manage your service catalog items including professional services, maintenance packages, and consulting offerings." />
      </Helmet>
      
      <CatalogContainer catalogType={CATALOG_ITEM_TYPES.SERVICE} />
    </>
  );
};

export default ServicesPage;