// src/pages/public/roicalculator.tsx
import React from 'react';
import { CalculatorProvider } from '@/components/Leads/ROIcalculator/CalculatorContext';
import ROICalculatorMain from '@/components/Leads/ROIcalculator';

const PublicROICalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">Digital Transformation ROI Calculator</h1>
        <p className="text-center text-gray-600 mb-8">Quantify what delaying digital initiatives is really costing your organization</p>
        
        <CalculatorProvider>
          <ROICalculatorMain />
        </CalculatorProvider>
        
        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>© {new Date().getFullYear()} DxWithCharan. This calculator provides estimates based on industry standards and should not be considered financial advice.</p>
          <p className="mt-2">Parameters vary by project, customer, and industry. A personalized assessment will provide more accurate results.</p>
        </footer>
      </div>
    </div>
  );
};

export default PublicROICalculatorPage;