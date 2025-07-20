// src/pages/settings/businessmodel/admin/pricing-plans/assign.tsx - UPDATED

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Users, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { analyticsService } from '@/services/analytics.service';
import { useBusinessModel } from '@/hooks/useBusinessModel';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import toast from 'react-hot-toast';

// Mock tenant data (replace with API call)
const fakeTenants = [
  { id: 'tenant_1', name: 'Acme Inc.', email: 'admin@acme.com', currentPlanId: null },
  { id: 'tenant_2', name: 'Globex Corp', email: 'admin@globex.com', currentPlanId: 'plan_1' },
  { id: 'tenant_3', name: 'Initech', email: 'admin@initech.com', currentPlanId: 'plan_2' },
  { id: 'tenant_4', name: 'Umbrella Corp', email: 'admin@umbrella.com', currentPlanId: null },
  { id: 'tenant_5', name: 'Stark Industries', email: 'admin@stark.com', currentPlanId: null }
];

const AssignPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency') || 'USD';
  
  const { selectedPlan, loadPlanDetails } = useBusinessModel();
  
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('settings/businessmodel/admin/pricing-plans/assign', 'Assign Plan to Tenants');
  }, []);
  
  // Fetch plan details and tenants
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Load plan if not already loaded
        if (!selectedPlan || selectedPlan.id !== id) {
          await loadPlanDetails(id);
        }
        
        // Simulate loading tenants (replace with API call)
        await new Promise(resolve => setTimeout(resolve, 500));
        setTenants(fakeTenants);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load plan details');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, selectedPlan, loadPlanDetails]);
  
  // Handle Back
  const handleBack = () => {
    navigate(`/settings/businessmodel/admin/pricing-plans/${id}`);
  };
  
  // Toggle tenant selection
  const toggleTenantSelection = (tenantId: string) => {
    if (selectedTenants.includes(tenantId)) {
      setSelectedTenants(selectedTenants.filter(id => id !== tenantId));
    } else {
      setSelectedTenants([...selectedTenants, tenantId]);
    }
  };
  
  // Handle assign button click
  const handleAssignClick = () => {
    if (selectedTenants.length === 0) return;
    setShowConfirmDialog(true);
  };
  
  // Handle actual assignment
  const handleConfirmAssign = async () => {
    setSubmitting(true);
    setShowConfirmDialog(false);
    
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Plan assigned to ${selectedTenants.length} tenant(s) successfully`);
      navigate(`/settings/businessmodel/admin/pricing-plans/${id}`);
    } catch (error) {
      console.error('Error assigning plan:', error);
      toast.error('Failed to assign plan to tenants');
      setSubmitting(false);
    }
  };
  
  // Filter tenants based on search term
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <button 
              onClick={handleBack} 
              className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <div className="h-7 bg-muted rounded-md w-48 animate-pulse"></div>
              <div className="h-4 bg-muted rounded-md w-64 mt-2 animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading tenants...</span>
          </div>
        </div>
      </div>
    );
  }
  
  // 404 state
  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate('/settings/businessmodel/admin/pricing-plans')} 
              className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Plan Not Found</h1>
              <p className="text-muted-foreground">The requested pricing plan does not exist or has been deleted</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const planName = selectedPlan.name || 'Untitled Plan';
  const planDescription = selectedPlan.description || '';
  const planType = selectedPlan.planType || selectedPlan.plan_type || 'Per User';
  
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Assign Plan to Tenants</h1>
            <p className="text-muted-foreground">Select tenants to assign the {planName} plan ({currency})</p>
          </div>
        </div>
        
        {/* Plan Summary */}
        <div className="bg-card rounded-lg border border-border mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{planName}</h2>
              <p className="text-muted-foreground">{planDescription}</p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <span className="bg-muted/50 px-3 py-1 rounded-md text-sm">
                {planType}
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                {currency}
              </span>
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search tenants..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Tenants List */}
        <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
          <div className="divide-y divide-border">
            {filteredTenants.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No tenants found</p>
              </div>
            ) : (
              filteredTenants.map(tenant => (
                <div key={tenant.id} className="p-4 flex items-center hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">{tenant.name}</h3>
                    <p className="text-sm text-muted-foreground">{tenant.email}</p>
                  </div>
                  <div className="flex items-center">
                    {tenant.currentPlanId === id ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mr-4">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Current Plan
                      </span>
                    ) : tenant.currentPlanId ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mr-4">
                        Has Other Plan
                      </span>
                    ) : null}
                    <div className="flex items-center h-5">
                      <input
                        id={`tenant-${tenant.id}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedTenants.includes(tenant.id)}
                        onChange={() => toggleTenantSelection(tenant.id)}
                        disabled={tenant.currentPlanId === id || submitting}
                      />
                      <label htmlFor={`tenant-${tenant.id}`} className="sr-only">
                        Select tenant
                      </label>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleBack}
            disabled={submitting}
            className="px-4 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleAssignClick}
            disabled={selectedTenants.length === 0 || submitting}
            className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Assigning...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Assign to {selectedTenants.length} Tenant(s)
              </>
            )}
          </button>
        </div>
        
        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleConfirmAssign}
          title="Confirm Plan Assignment"
          description={`Are you sure you want to assign the ${planName} plan (${currency}) to ${selectedTenants.length} tenant(s)? This will update their subscription immediately.`}
          confirmText="Assign Plan"
          type="primary"
          icon={<Users className="h-6 w-6" />}
        />
      </div>
    </div>
  );
};

export default AssignPlanPage;