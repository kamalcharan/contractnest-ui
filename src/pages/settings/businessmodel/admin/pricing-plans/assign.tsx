// src/pages/settings/businessmodel/admin/pricing-plans/assign.tsx - UPDATED

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Users, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { isDarkMode, currentTheme } = useTheme();
  
  const { selectedPlan, loadPlanDetails } = useBusinessModel();
  
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
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
      <div 
        className="min-h-screen transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="p-6">
          <div className="flex items-center mb-8">
            <button 
              onClick={handleBack} 
              className="mr-4 p-2 rounded-full hover:opacity-80 transition-colors"
              style={{ backgroundColor: colors.utility.secondaryBackground }}
            >
              <ArrowLeft 
                className="h-5 w-5 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              />
            </button>
            <div>
              <div 
                className="h-7 rounded-md w-48 animate-pulse"
                style={{ backgroundColor: colors.utility.secondaryBackground }}
              ></div>
              <div 
                className="h-4 rounded-md w-64 mt-2 animate-pulse"
                style={{ backgroundColor: colors.utility.secondaryBackground }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 
              className="h-8 w-8 animate-spin transition-colors"
              style={{ color: colors.brand.primary }}
            />
            <span 
              className="ml-2 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Loading tenants...
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  // 404 state
  if (!selectedPlan) {
    return (
      <div 
        className="min-h-screen transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="p-6">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate('/settings/businessmodel/admin/pricing-plans')} 
              className="mr-4 p-2 rounded-full hover:opacity-80 transition-colors"
              style={{ backgroundColor: colors.utility.secondaryBackground }}
            >
              <ArrowLeft 
                className="h-5 w-5 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              />
            </button>
            <div>
              <h1 
                className="text-2xl font-bold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Plan Not Found
              </h1>
              <p 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                The requested pricing plan does not exist or has been deleted
              </p>
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
    <div 
      className="min-h-screen transition-colors"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:opacity-80 transition-colors"
            style={{ backgroundColor: colors.utility.secondaryBackground }}
          >
            <ArrowLeft 
              className="h-5 w-5 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            />
          </button>
          <div>
            <h1 
              className="text-2xl font-bold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Assign Plan to Tenants
            </h1>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Select tenants to assign the {planName} plan ({currency})
            </p>
          </div>
        </div>
        
        {/* Plan Summary */}
        <div 
          className="rounded-lg border mb-6 p-4 transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '40'
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 
                className="text-xl font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {planName}
              </h2>
              <p 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {planDescription}
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <span 
                className="px-3 py-1 rounded-md text-sm transition-colors"
                style={{
                  backgroundColor: `${colors.utility.primaryBackground}50`,
                  color: colors.utility.primaryText
                }}
              >
                {planType}
              </span>
              <span 
                className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: `${colors.brand.primary}10`,
                  color: colors.brand.primary
                }}
              >
                {currency}
              </span>
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search 
              className="h-5 w-5 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            />
          </div>
          <input
            type="text"
            placeholder="Search tenants..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
            style={{
              borderColor: colors.utility.secondaryText + '40',
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText,
              '--tw-ring-color': colors.brand.primary
            } as React.CSSProperties}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Tenants List */}
        <div 
          className="rounded-lg border overflow-hidden mb-6 transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '40'
          }}
        >
          <div 
            className="divide-y transition-colors"
            style={{ borderColor: colors.utility.secondaryText + '40' }}
          >
            {filteredTenants.length === 0 ? (
              <div className="py-8 text-center">
                <Users 
                  className="h-12 w-12 mx-auto opacity-50 mb-4 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                />
                <p 
                  className="transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  No tenants found
                </p>
              </div>
            ) : (
              filteredTenants.map(tenant => (
                <div 
                  key={tenant.id} 
                  className="p-4 flex items-center hover:opacity-80 transition-colors"
                  style={{ backgroundColor: colors.utility.secondaryBackground }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.utility.primaryBackground}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.utility.secondaryBackground;
                  }}
                >
                  <div className="flex-1">
                    <h3 
                      className="font-medium transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {tenant.name}
                    </h3>
                    <p 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {tenant.email}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {tenant.currentPlanId === id ? (
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-4 transition-colors"
                        style={{
                          backgroundColor: `${colors.semantic.success}20`,
                          color: colors.semantic.success
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Current Plan
                      </span>
                    ) : tenant.currentPlanId ? (
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-4 transition-colors"
                        style={{
                          backgroundColor: `${colors.brand.primary}20`,
                          color: colors.brand.primary
                        }}
                      >
                        Has Other Plan
                      </span>
                    ) : null}
                    <div className="flex items-center h-5">
                      <input
                        id={`tenant-${tenant.id}`}
                        type="checkbox"
                        className="h-4 w-4 rounded focus:ring-2 transition-colors"
                        style={{
                          borderColor: colors.utility.secondaryText + '40',
                          color: colors.brand.primary,
                          '--tw-ring-color': colors.brand.primary
                        } as React.CSSProperties}
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
            className="px-4 py-2 rounded-md border hover:opacity-80 transition-colors disabled:opacity-50"
            style={{
              borderColor: colors.utility.secondaryText + '40',
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleAssignClick}
            disabled={selectedTenants.length === 0 || submitting}
            className="px-6 py-2 rounded-md text-white hover:opacity-90 transition-colors disabled:opacity-50 flex items-center"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
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