// src/components/tenantprofile/TenantProfileView.tsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext'; // Fixed import path
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button'; // Fixed casing - use uppercase Button
import { 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Palette,
  Pencil,
  ChevronLeft 
} from 'lucide-react';
import { TenantProfile } from '@/hooks/useTenantProfile';
import { businessTypes } from '@/utils/constants/businessTypes';
import { industries } from '@/utils/constants/industries';
import { countries } from '@/utils/constants/countries';
import { Link } from 'react-router-dom';

interface TenantProfileViewProps {
  profile: TenantProfile | null;
  isLoading?: boolean;
  onEdit?: () => void;
}

const TenantProfileView: React.FC<TenantProfileViewProps> = ({
  profile,
  isLoading = false,
  onEdit
}) => {
  const { isDarkMode } = useTheme();
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-muted rounded-md w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-muted rounded-md"></div>
          <div className="h-40 bg-muted rounded-md"></div>
        </div>
        <div className="h-40 bg-muted rounded-md"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center p-10 rounded-lg border border-dashed">
        <h3 className="text-lg font-medium mb-2">No Business Profile Found</h3>
        <p className="text-muted-foreground mb-6">
          You haven't set up your business profile yet. Create one to customize your experience.
        </p>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create Business Profile
          </button>
        )}
      </div>
    );
  }
  
  const businessType = businessTypes.find(bt => bt.id === profile?.business_type_id);
  const industry = industries.find(ind => ind.id === profile?.industry_id);
  const country = countries.find(c => c.code === profile?.country_code);  

  return (
    <div className="space-y-8">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Business Profile</h2>
        {onEdit && (
          <Button 
            variant="outline" 
            onClick={onEdit}
            className="flex items-center"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Card */}
        <div className={cn(
          "p-6 rounded-lg border shadow-sm",
          isDarkMode ? "bg-card border-border" : "bg-card border-border/50"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isDarkMode ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"
              )}>
                <Building size={20} />
              </div>
              <h3 className="font-semibold text-lg">Organization</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Logo and Name */}
            <div className="flex items-center space-x-4">
              {profile.logo_url ? (
                <div className="w-16 h-16 rounded overflow-hidden border">
                  <img 
                    src={profile.logo_url} 
                    alt={profile.business_name} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className={cn(
                  "w-16 h-16 rounded flex items-center justify-center",
                  isDarkMode ? "bg-muted" : "bg-muted/50"
                )}>
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
        <div className={cn(
          "p-6 rounded-lg border shadow-sm",
          isDarkMode ? "bg-card border-border" : "bg-card border-border/50"
        )}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isDarkMode ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"
            )}>
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
      <div className={cn(
        "p-6 rounded-lg border shadow-sm",
        isDarkMode ? "bg-card border-border" : "bg-card border-border/50"
      )}>
        <div className="flex items-center space-x-3 mb-4">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isDarkMode ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"
          )}>
            <Palette size={20} />
          </div>
          <h3 className="font-semibold text-lg">Brand Colors</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Primary Color */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded-full border shadow-sm"
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
              className="w-10 h-10 rounded-full border shadow-sm"
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
  );
};

export default TenantProfileView;