// src/pages/settings/business-profile/index.tsx - Theme Integrated Version
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Phone, Mail, Globe, MapPin, Palette, Pencil } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTenantProfile } from '@/hooks/useTenantProfile';
import { analyticsService } from '@/services/analytics.service';
import { businessTypes } from '@/utils/constants/businessTypes';
import { industries } from '@/utils/constants/industries';
import { countries } from '@/utils/constants/countries';
import { cn } from '@/lib/utils';

const BusinessProfilePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
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
    <div 
      className="p-6 transition-colors"
      style={{ backgroundColor: colors.utility.secondaryText + '10' }}
    >
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:opacity-80 transition-colors"
          style={{ backgroundColor: colors.utility.secondaryText + '20' }}
        >
          <ArrowLeft 
            className="h-5 w-5"
            style={{ color: colors.utility.secondaryText }}
          />
        </button>
        <div>
          <h1 
            className="text-2xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Business Profile
          </h1>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Manage your business information and settings
          </p>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div 
              className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full"
              style={{ borderColor: colors.brand.primary }}
            ></div>
          </div>
        ) : !profile ? (
          <div 
            className="rounded-lg shadow-sm border p-10 text-center transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <h3 
              className="text-lg font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              No Business Profile Found
            </h3>
            <p 
              className="mb-6 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              You haven't set up your business profile yet. Create one to customize your experience.
            </p>
            <button 
              onClick={handleEditClick}
              className="px-4 py-2 rounded-md hover:opacity-90 transition-colors"
              style={{
                backgroundColor: colors.brand.primary,
                color: '#ffffff'
              }}
            >
              Create Business Profile
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center">
              <h2 
                className="text-xl font-semibold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Business Profile
              </h2>
              <button 
                onClick={handleEditClick}
                className="flex items-center px-4 py-2 rounded-md border hover:opacity-80 transition-colors"
                style={{
                  borderColor: colors.brand.primary,
                  color: colors.brand.primary,
                  backgroundColor: colors.brand.primary + '10'
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </button>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Card */}
              <div 
                className="rounded-lg border shadow-sm p-6 transition-colors"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: colors.utility.primaryText + '20'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: colors.brand.primary + '20',
                        color: colors.brand.primary
                      }}
                    >
                      <Building size={20} />
                    </div>
                    <h3 
                      className="font-semibold text-lg transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Organization
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Logo and Name */}
                  <div className="flex items-center space-x-4">
                    {profile.logo_url ? (
                      <div 
                        className="w-16 h-16 rounded overflow-hidden border"
                        style={{ borderColor: colors.utility.primaryText + '20' }}
                      >
                        <img 
                          src={profile.logo_url} 
                          alt={profile.business_name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-16 h-16 rounded flex items-center justify-center"
                        style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                      >
                        <Building 
                          size={24} 
                          style={{ color: colors.utility.secondaryText }}
                        />
                      </div>
                    )}
                    
                    <div>
                      <div 
                        className="font-semibold text-lg transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {profile.business_name}
                      </div>
                      <div 
                        className="text-sm transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {businessType?.name || 'Not specified'} • {industry?.name || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  {(profile.address_line1 || profile.city || profile.country_code) && (
                    <div className="flex space-x-3">
                      <MapPin 
                        className="h-5 w-5 shrink-0 mt-0.5"
                        style={{ color: colors.utility.secondaryText }}
                      />
                      <div style={{ color: colors.utility.primaryText }}>
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
              <div 
                className="rounded-lg border shadow-sm p-6 transition-colors"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: colors.utility.primaryText + '20'
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: colors.brand.primary + '20',
                      color: colors.brand.primary
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <h3 
                    className="font-semibold text-lg transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Contact Information
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {/* Phone */}
                  {profile.business_phone && (
                    <div className="flex space-x-3">
                      <Phone 
                        className="h-5 w-5 shrink-0"
                        style={{ color: colors.utility.secondaryText }}
                      />
                      <div style={{ color: colors.utility.primaryText }}>
                        {profile.business_phone_country_code || ''} {profile.business_phone}
                      </div>
                    </div>
                  )}
                  
                  {/* Email */}
                  {profile.business_email && (
                    <div className="flex space-x-3">
                      <Mail 
                        className="h-5 w-5 shrink-0"
                        style={{ color: colors.utility.secondaryText }}
                      />
                      <div style={{ color: colors.utility.primaryText }}>
                        {profile.business_email}
                      </div>
                    </div>
                  )}
                  
                  {/* Website */}
                  {profile.website_url && (
                    <div className="flex space-x-3">
                      <Globe 
                        className="h-5 w-5 shrink-0"
                        style={{ color: colors.utility.secondaryText }}
                      />
                      <div>
                        <a 
                          href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline transition-colors"
                          style={{ color: colors.brand.primary }}
                        >
                          {profile.website_url.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {!profile.business_phone && !profile.business_email && !profile.website_url && (
                    <div 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      No contact information provided
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Brand Colors Card */}
            <div 
              className="rounded-lg border shadow-sm p-6 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.primaryText + '20'
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: colors.brand.primary + '20',
                    color: colors.brand.primary
                  }}
                >
                  <Palette size={20} />
                </div>
                <h3 
                  className="font-semibold text-lg transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Brand Colors
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Primary Color */}
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full border"
                    style={{ 
                      backgroundColor: profile.primary_color || '#4F46E5',
                      borderColor: colors.utility.primaryText + '20'
                    }}
                  />
                  <div>
                    <div 
                      className="font-medium transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Primary Color
                    </div>
                    <div 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {profile.primary_color || '#4F46E5'}
                    </div>
                  </div>
                </div>
                
                {/* Secondary Color */}
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full border"
                    style={{ 
                      backgroundColor: profile.secondary_color || '#10B981',
                      borderColor: colors.utility.primaryText + '20'
                    }}
                  />
                  <div>
                    <div 
                      className="font-medium transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Secondary Color
                    </div>
                    <div 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
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