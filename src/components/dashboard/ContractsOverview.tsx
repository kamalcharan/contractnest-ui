// src/components/dashboard/ContractsOverview.tsx
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ContractsOverviewProps {
  className?: string;
}

const ContractsOverview: React.FC<ContractsOverviewProps> = ({ className = '' }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Mock data for contracts overview
  const contractData = [
    { month: 'Jan', active: 65, new: 18, expired: 5 },
    { month: 'Feb', active: 78, new: 22, expired: 9 },
    { month: 'Mar', active: 85, new: 13, expired: 6 },
    { month: 'Apr', active: 92, new: 15, expired: 8 },
    { month: 'May', active: 95, new: 12, expired: 9 },
    { month: 'Jun', active: 98, new: 8, expired: 5 },
  ];

  // Mock data for contract value by type
  const contractValueData = [
    { type: 'Maintenance', value: 45000 },
    { type: 'Consulting', value: 28000 },
    { type: 'Support', value: 15000 },
    { type: 'Custom', value: 12000 },
  ];

  const [viewMode, setViewMode] = useState<'monthly' | 'quarterly'>('monthly');

  // Custom tooltip component for themed styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="border rounded-md shadow-lg p-3 transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          <p 
            className="font-medium mb-2"
            style={{ color: colors.utility.primaryText }}
          >
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.name === 'Contract Value' ? `$${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div 
        className="p-4 border-b flex justify-between items-center transition-colors"
        style={{ borderColor: colors.utility.secondaryText + '20' }}
      >
        <h3 
          className="font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Contracts Overview
        </h3>
        <div className="flex items-center">
          <button 
            className="text-sm flex items-center gap-1 py-1 px-3 rounded-md transition-colors hover:opacity-80"
            style={{
              backgroundColor: colors.utility.secondaryText + '10',
              color: colors.utility.primaryText
            }}
            onClick={() => setViewMode(viewMode === 'monthly' ? 'quarterly' : 'monthly')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '15';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
            }}
          >
            {viewMode === 'monthly' ? 'Monthly' : 'Quarterly'} 
            <ChevronDown size={14} style={{ color: colors.utility.secondaryText }} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
        <div>
          <h4 
            className="text-sm font-medium mb-3 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Contract Status
          </h4>
          <div 
            className="h-64 rounded-md p-2 transition-colors"
            style={{ backgroundColor: colors.utility.primaryBackground }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={contractData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={colors.utility.secondaryText + '30'} 
                  opacity={0.3} 
                />
                <XAxis 
                  dataKey="month" 
                  stroke={colors.utility.secondaryText} 
                  fontSize={12} 
                />
                <YAxis 
                  stroke={colors.utility.secondaryText} 
                  fontSize={12} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: '12px', 
                    paddingTop: '10px',
                    color: colors.utility.primaryText
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  name="Active Contracts"
                  stroke={colors.brand.primary} 
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0, fill: colors.brand.primary }} 
                  dot={{ r: 3, strokeWidth: 0, fill: colors.brand.primary }}
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  name="New Contracts"
                  stroke={colors.semantic.success} 
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0, fill: colors.semantic.success }} 
                  dot={{ r: 3, strokeWidth: 0, fill: colors.semantic.success }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expired" 
                  name="Expired Contracts"
                  stroke={colors.semantic.error} 
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0, fill: colors.semantic.error }} 
                  dot={{ r: 3, strokeWidth: 0, fill: colors.semantic.error }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 
            className="text-sm font-medium mb-3 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Contract Value by Type
          </h4>
          <div 
            className="h-64 rounded-md p-2 transition-colors"
            style={{ backgroundColor: colors.utility.primaryBackground }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contractValueData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={colors.utility.secondaryText + '30'} 
                  opacity={0.3} 
                />
                <XAxis 
                  dataKey="type" 
                  stroke={colors.utility.secondaryText} 
                  fontSize={12} 
                />
                <YAxis 
                  stroke={colors.utility.secondaryText} 
                  fontSize={12} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: '12px', 
                    paddingTop: '10px',
                    color: colors.utility.primaryText
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  name="Contract Value" 
                  fill={colors.brand.primary} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div 
        className="p-4 border-t transition-colors"
        style={{
          borderColor: colors.utility.secondaryText + '20',
          backgroundColor: colors.utility.secondaryText + '05'
        }}
      >
        <div 
          className="flex items-start space-x-3 border rounded-md p-3 transition-colors"
          style={{
            backgroundColor: colors.semantic.warning + '05',
            borderColor: colors.semantic.warning + '20'
          }}
        >
          <AlertCircle 
            size={18} 
            className="mt-0.5 flex-shrink-0"
            style={{ color: colors.semantic.warning }}
          />
          <div className="text-sm space-y-1">
            <p 
              className="font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Contract Insights
            </p>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              15 contracts are up for renewal in the next 30 days. Consider setting up automatic renewal reminders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractsOverview;