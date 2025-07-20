//src/components/businessmodel/dashboard/PlanList.tsx

import React, { useState } from 'react';
import { Eye, Archive, Tag, Calendar, Users, FileText } from 'lucide-react';

export interface PricingPlanSummary {
  id: string;
  name: string;
  version: string;
  isActive: boolean;
  planType: 'Per User' | 'Per Contract';
  userCount: number;
  featuresCount: number;
  lastUpdated: string;
}

interface PlanListProps {
  plans: PricingPlanSummary[];
  onViewPlan: (planId: string) => void;
  onArchivePlan: (planId: string) => void;
  isLoading?: boolean;
}

const PlanList: React.FC<PlanListProps> = ({
  plans,
  onViewPlan,
  onArchivePlan,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(true);
  
  // Filter plans based on search and active filter
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActiveFilter = filterActive ? plan.isActive : true;
    return matchesSearch && matchesActiveFilter;
  });
  
  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
            <div className="mt-4 flex space-x-6">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-40"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Render no plans found
  if (filteredPlans.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-lg font-medium">No Plans Found</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          {searchTerm 
            ? 'No plans match your search criteria.' 
            : 'You haven\'t created any pricing plans yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="filter-active"
            checked={filterActive}
            onChange={() => setFilterActive(!filterActive)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="filter-active" className="ml-2 text-sm">
            Show active plans only
          </label>
        </div>
      </div>
      
      {/* Plans list */}
      <div className="space-y-4">
        {filteredPlans.map(plan => (
          <div key={plan.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    v{plan.version}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    plan.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {plan.isActive ? 'active' : 'inactive'}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="inline-flex items-center">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {plan.planType}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => onViewPlan(plan.id)}
                  className="px-3 py-1.5 rounded-md border border-input bg-background hover:bg-muted text-sm flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                
                <button 
                  onClick={() => onArchivePlan(plan.id)}
                  className="px-3 py-1.5 rounded-md border border-input bg-background hover:bg-muted text-sm flex items-center"
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {plan.userCount} active users
              </div>
              
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {plan.featuresCount} features
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Last updated: {plan.lastUpdated}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanList;