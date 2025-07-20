// src/pages/settings/business-profile/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Phone, Mail, Globe, MapPin, Palette, Pencil } from 'lucide-react';
import { useTenantProfile } from '@/hooks/useTenantProfile';
import { analyticsService } from '@/services/analytics.service';
import { businessTypes } from '@/utils/constants/businessTypes';
import { industries } from '@/utils/constants/industries';
import { countries } from '@/utils/constants/countries';
import { cn } from '@/lib/utils';

const BusinessProfilePage = () => {
  const navigate = useNavigate();
  
  // Track page view
  React.useEffect(() => {
    analyticsService.trackPageView('settings/business-profile', 'Business Profile');
  }, []);
  
  // Use the tenant profile hook
  const {
    loading,
    profile
  } = useTenantProfile();
  
  // Handle edit button click
  const handleEditClick = () => {
    navigate('/settings/business-profile/edit');
  };
  
  // Handle Back
  const handleBack = () => {
    navigate('/settings');
  };
  
  // Find matching business type and industry
  const businessType = profile?.business_type_id ? 
    businessTypes.find(type => type.id === profile.business_type_id) : null;
    
  const industry = profile?.industry_id ? 
    industries.find(ind => ind.id === profile.industry_id) : null;
    
  const country = profile?.country_code ? 
    countries.find(c => c.code === profile.country_code) : null;
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Business Profile</h1>
          <p className="text-muted-foreground">Manage your business information and settings</p>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : !profile ? (
          <div className="bg-card rounded-lg shadow-sm border border-border p-10 text-center">
            <h3 className="text-lg font-medium mb-2">No Business Profile Found</h3>
            <p className="text-muted-foreground mb-6">
              You haven't set up your business profile yet. Create one to customize your experience.
            </p>
            <button 
              onClick={handleEditClick}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Create Business Profile
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Business Profile</h2>
              <button 
                onClick={handleEditClick}
                className="flex items-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/5 transition-colors"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </button>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Card */}
              <div className="bg-card rounded-lg border border-border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Building size={20} />
                    </div>
                    <h3 className="font-semibold text-lg">Organization</h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Logo and Name */}
                  <div className="flex items-center space-x-4">
                    {profile.logo_url ? (
                      <div className="w-16 h-16 rounded overflow-hidden border border-border">
                        <img 
                          src={profile.logo_url} 
                          alt={profile.business_name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded flex items-center justify-center bg-muted">
                        <Building size={24} className="text-muted-foreground" />
                      </div>
                    )}
                    
                    <div>
                      <div className="font-semibold text-lg">{profile.business_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {businessType?.name || 'Not specified'} • {industry?.name || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  {(profile.address_line1 || profile.city || profile.country_code) && (
                    <div className="flex space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        {profile.address_line1 && <div>{profile.address_line1}</div>}
                        {profile.address_line2 && <div>{profile.address_line2}</div>}
                        {(profile.city || profile.state_code || profile.postal_code) && (
                          <div>
                            {profile.city && `${profile.city}, `}
                            {profile.state_code && `${profile.state_code} `}
                            {profile.postal_code && profile.postal_code}
                          </div>
                        )}
                        {country?.name && <div>{country.name}</div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contact Information Card */}
              <div className="bg-card rounded-lg border border-border shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Phone */}
                  {profile.business_phone && (
                    <div className="flex space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        {profile.business_phone_country_code || ''} {profile.business_phone}
                      </div>
                    </div>
                  )}
                  
                  {/* Email */}
                  {profile.business_email && (
                    <div className="flex space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>{profile.business_email}</div>
                    </div>
                  )}
                  
                  {/* Website */}
                  {profile.website_url && (
                    <div className="flex space-x-3">
                      <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <a 
                          href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {profile.website_url.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {!profile.business_phone && !profile.business_email && !profile.website_url && (
                    <div className="text-sm text-muted-foreground">
                      No contact information provided
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Brand Colors Card */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Palette size={20} />
                </div>
                <h3 className="font-semibold text-lg">Brand Colors</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Primary Color */}
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full border border-border"
                    style={{ backgroundColor: profile.primary_color || '#4F46E5' }}
                  />
                  <div>
                    <div className="font-medium">Primary Color</div>
                    <div className="text-sm text-muted-foreground">
                      {profile.primary_color || '#4F46E5'}
                    </div>
                  </div>
                </div>
                
                {/* Secondary Color */}
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full border border-border"
                    style={{ backgroundColor: profile.secondary_color || '#10B981' }}
                  />
                  <div>
                    <div className="font-medium">Secondary Color</div>
                    <div className="text-sm text-muted-foreground">
                      {profile.secondary_color || '#10B981'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessProfilePage;