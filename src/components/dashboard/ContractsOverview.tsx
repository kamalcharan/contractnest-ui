// src/components/dashboard/ContractsOverview.tsx
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface ContractsOverviewProps {
  className?: string;
}

const ContractsOverview: React.FC<ContractsOverviewProps> = ({ className = '' }) => {
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

  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="font-medium">Contracts Overview</h3>
        <div className="flex items-center">
          <button 
            className="text-sm flex items-center gap-1 py-1 px-3 rounded-md bg-muted hover:bg-muted/70 transition-colors"
            onClick={() => setViewMode(viewMode === 'monthly' ? 'quarterly' : 'monthly')}
          >
            {viewMode === 'monthly' ? 'Monthly' : 'Quarterly'} <ChevronDown size={14} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
        <div>
          <h4 className="text-sm font-medium mb-3">Contract Status</h4>
          <div className="h-64 bg-card rounded-md p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={contractData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--popover)', 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }} 
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  name="Active Contracts"
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  dot={{ r: 3, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  name="New Contracts"
                  stroke="#4ade80" 
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  dot={{ r: 3, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expired" 
                  name="Expired Contracts"
                  stroke="#f87171" 
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  dot={{ r: 3, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3">Contract Value by Type</h4>
          <div className="h-64 bg-card rounded-md p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contractValueData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="type" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--popover)', 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}
                  itemStyle={{ padding: '2px 0' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar 
                  dataKey="value" 
                  name="Contract Value" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-start space-x-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
          <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Contract Insights</p>
            <p className="text-muted-foreground">15 contracts are up for renewal in the next 30 days. Consider setting up automatic renewal reminders.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractsOverview;