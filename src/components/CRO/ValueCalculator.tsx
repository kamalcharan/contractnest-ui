//src/components/CRO/ValueCalculator.tsx

import React, { useState, useEffect } from 'react';
import { Calculator, Building, TrendingUp, Clock, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ValueCalculator = () => {
  const [businessSize, setBusinessSize] = useState('');
  const [industry, setIndustry] = useState('');
  const [contractCount, setContractCount] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [calculatedSavings, setCalculatedSavings] = useState(null);

  const businessSizes = {
    small: {
      label: 'Small Business (1-50 contracts)',
      avgValue: 75000, // ₹75K average
      contracts: { min: 1, max: 50, suggested: 25 }
    },
    medium: {
      label: 'Mid Enterprise (50-200 contracts)', 
      avgValue: 300000, // ₹3L average
      contracts: { min: 50, max: 200, suggested: 100 }
    },
    large: {
      label: 'Large Enterprise (200+ contracts)',
      avgValue: 1500000, // ₹15L average  
      contracts: { min: 200, max: 1000, suggested: 350 }
    }
  };

  const industries = {
    healthcare: {
      label: 'Healthcare',
      multiplier: 1.4, // Higher value contracts
      painPoints: ['Equipment downtime costs', 'Compliance penalties', 'Manual tracking errors']
    },
    pharma: {
      label: 'Pharmaceutical', 
      multiplier: 1.3,
      painPoints: ['Regulatory compliance gaps', 'Audit preparation time', 'Vendor coordination']
    },
    manufacturing: {
      label: 'Manufacturing',
      multiplier: 1.2,
      painPoints: ['Production delays', 'Equipment maintenance gaps', 'Multi-vendor coordination']
    },
    consulting: {
      label: 'Consulting Services',
      multiplier: 0.8,
      painPoints: ['Client billing disputes', 'Project milestone tracking', 'Payment delays']
    }
  };

  useEffect(() => {
    if (businessSize && industry && contractCount && manualHours) {
      calculateSavings();
    }
  }, [businessSize, industry, contractCount, manualHours]);

  const calculateSavings = () => {
    const size = businessSizes[businessSize];
    const ind = industries[industry];
    const contracts = parseInt(contractCount);
    const hours = parseFloat(manualHours);

    if (!size || !ind || !contracts || !hours) return;

    // Calculate current costs
    const avgContractValue = size.avgValue * ind.multiplier;
    const totalContractValue = contracts * avgContractValue;
    
    // Time savings (assuming 70% reduction in manual work)
    const timeSavingsHoursPerMonth = hours * 30 * 0.7; // 70% time savings
    const timeSavingsCostPerMonth = timeSavingsHoursPerMonth * 2000; // ₹2000/hour for admin time
    const timeSavingsPerYear = timeSavingsCostPerMonth * 12;

    // SLA improvement savings (reduce breaches from 50% to 10%)
    const slaImprovementSavings = totalContractValue * 0.4 * 0.05; // 40% breach rate reduced by 5% penalty
    
    // ContractNest cost
    const contractNestCostPerMonth = Math.max(contracts - 10, 0) * 150 / 3; // First 10 free, ₹150 per quarter
    const contractNestCostPerYear = contractNestCostPerMonth * 12;

    // Total savings
    const totalSavingsPerYear = timeSavingsPerYear + slaImprovementSavings - contractNestCostPerYear;
    const roiPercentage = ((totalSavingsPerYear / contractNestCostPerYear) * 100).toFixed(0);

    setCalculatedSavings({
      timeSavingsPerYear: Math.round(timeSavingsPerYear),
      slaImprovementSavings: Math.round(slaImprovementSavings),
      contractNestCostPerYear: Math.round(contractNestCostPerYear),
      totalSavingsPerYear: Math.round(totalSavingsPerYear),
      roiPercentage: roiPercentage,
      totalContractValue: Math.round(totalContractValue),
      timeSavingsHoursPerMonth: Math.round(timeSavingsHoursPerMonth),
      contracts: contracts
    });
    
    setShowResults(true);
  };

  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDemoRequest = () => {
    // Track conversion event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'demo_request', {
        event_category: 'conversion',
        event_label: 'value_calculator',
        value: calculatedSavings?.totalSavingsPerYear || 0
      });
    }
    
    // Scroll to contact form or open calendar
    const emailSection = document.getElementById('email-signup');
    if (emailSection) {
      emailSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Calculator className="h-8 w-8 text-red-500" />
          <h2 className="text-3xl font-bold">Service Contract ROI Calculator</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See how much your business could save by digitizing service contract management. 
          From lift maintenance to CT-scan AMCs - every contract size matters.
        </p>
      </div>

      {/* Calculator Form */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-500" />
            <span>Tell us about your business</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Size */}
            <div className="space-y-2">
              <Label htmlFor="businessSize">Business Size</Label>
              <Select value={businessSize} onValueChange={setBusinessSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(businessSizes).map(([key, size]) => (
                    <SelectItem key={key} value={key}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Primary Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(industries).map(([key, ind]) => (
                    <SelectItem key={key} value={key}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contract Count */}
            <div className="space-y-2">
              <Label htmlFor="contractCount">Number of Active Service Contracts</Label>
              <Input
                id="contractCount"
                type="number"
                placeholder={businessSize ? `Suggested: ${businessSizes[businessSize]?.contracts.suggested}` : "Enter number"}
                value={contractCount}
                onChange={(e) => setContractCount(e.target.value)}
                min="1"
                max="1000"
              />
              {businessSize && (
                <p className="text-sm text-gray-500">
                  Typical range: {businessSizes[businessSize].contracts.min}-{businessSizes[businessSize].contracts.max} contracts
                </p>
              )}
            </div>

            {/* Manual Hours */}
            <div className="space-y-2">
              <Label htmlFor="manualHours">Daily Hours on Contract Admin</Label>
              <Input
                id="manualHours"
                type="number"
                step="0.5"
                placeholder="e.g., 2.5 hours"
                value={manualHours}
                onChange={(e) => setManualHours(e.target.value)}
                min="0.5"
                max="8"
              />
              <p className="text-sm text-gray-500">
                Time spent on tracking, invoicing, compliance checks
              </p>
            </div>
          </div>

          {/* Pain Points Display */}
          {industry && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">
                Common {industries[industry].label} Pain Points:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {industries[industry].painPoints.map((point, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && calculatedSavings && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              <span>Your Potential Savings with ContractNest</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {formatIndianCurrency(calculatedSavings.totalSavingsPerYear)}
                </div>
                <div className="text-sm text-gray-600">Annual Savings</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-blue-600">
                  {calculatedSavings.roiPercentage}%
                </div>
                <div className="text-sm text-gray-600">ROI</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-purple-600 flex items-center justify-center">
                  <Clock className="h-5 w-5 mr-1" />
                  {calculatedSavings.timeSavingsHoursPerMonth}h
                </div>
                <div className="text-sm text-gray-600">Hours Saved/Month</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-800">Savings Breakdown:</h4>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Time Savings (70% reduction in manual work)</span>
                <span className="font-semibold text-green-600">
                  +{formatIndianCurrency(calculatedSavings.timeSavingsPerYear)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">SLA Compliance Improvement</span>
                <span className="font-semibold text-green-600">
                  +{formatIndianCurrency(calculatedSavings.slaImprovementSavings)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">ContractNest Cost (₹150/contract/quarter)</span>
                <span className="font-semibold text-red-600">
                  -{formatIndianCurrency(calculatedSavings.contractNestCostPerYear)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-green-200">
                <span className="font-semibold text-gray-800">Net Annual Savings</span>
                <span className="font-bold text-xl text-green-600">
                  {formatIndianCurrency(calculatedSavings.totalSavingsPerYear)}
                </span>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">ContractNest Pricing for Your Business:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• First 10 contracts: <strong>FREE</strong></p>
                <p>• Remaining {Math.max(calculatedSavings.contracts - 10, 0)} contracts: <strong>₹150 each per quarter</strong></p>
                <p>• No per-user licensing fees</p>
                <p>• Total monthly cost: <strong>{formatIndianCurrency(calculatedSavings.contractNestCostPerYear / 12)}</strong></p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Button 
                onClick={handleDemoRequest}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
              >
                See This in Action - Book Demo Call
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Free 30-minute consultation • No pressure, just insights
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Building */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>💡 Calculations based on industry benchmarks and customer feedback</p>
        <p>🔒 Your information is secure and never shared</p>
        <p>📞 Want to discuss your specific situation? <button onClick={handleDemoRequest} className="text-red-500 hover:underline">Book a call</button></p>
      </div>
    </div>
  );
};

export default ValueCalculator;