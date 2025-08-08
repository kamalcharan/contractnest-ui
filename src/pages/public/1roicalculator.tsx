// src/pages/public/roicalculator.tsx
import React from 'react';
import PublicROICalculator from '@/components/leads/ROIcalculator/PublicROICalculator';

const PublicROICalculatorPage: React.FC = () => {
  console.log("Public calculator page rendering");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">Digital Transformation ROI Calculator</h1>
        <p className="text-center text-gray-600 mb-8">Quantify what delaying digital initiatives is really costing your organization</p>
        <PublicROICalculator />
      </div>
    </div>
  );
};

export default PublicROICalculatorPage; 