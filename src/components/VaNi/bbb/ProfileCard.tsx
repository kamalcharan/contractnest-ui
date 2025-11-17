// src/components/VaNi/bbb/ProfileCard.tsx
// File 4/13 - BBB Profile Card Display Component

import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Tag,
  ExternalLink,
  User
} from 'lucide-react';
import { TenantProfile } from '../../../types/bbb';

interface ProfileCardProps {
  profile: TenantProfile;
  showTitle?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, showTitle = true }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const profileItems = [
    {
      icon: Building2,
      label: 'Business Name',
      value: profile.business_name,
      color: colors.brand.primary
    },
    {
      icon: Tag,
      label: 'Category',
      value: profile.business_category || 'Not specified',
      color: colors.semantic.success
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile.business_phone 
        ? `${profile.business_phone_code || '+91'} ${profile.business_phone}`
        : 'Not provided',
      link: profile.business_phone ? `tel:${profile.business_phone_code || '+91'}${profile.business_phone}` : undefined,
      color: colors.semantic.info
    },
    {
      icon: Mail,
      label: 'Email',
      value: profile.business_email || 'Not provided',
      link: profile.business_email ? `mailto:${profile.business_email}` : undefined,
      color: colors.semantic.warning
    },
    {
      icon: Globe,
      label: 'Website',
      value: profile.website_url || 'Not provided',
      link: profile.website_url,
      color: colors.brand.secondary
    },
    {
      icon: MapPin,
      label: 'Location',
      value: profile.city || 'Not specified',
      color: colors.semantic.error
    }
  ];

  return (
    <Card
      className="overflow-hidden"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: `${colors.utility.primaryText}20`,
        boxShadow: `0 4px 6px ${colors.utility.primaryText}10`
      }}
    >
      {showTitle && (
        <CardHeader
          style={{
            background: `linear-gradient(135deg, ${colors.brand.primary}15 0%, ${colors.brand.secondary}15 100%)`,
            borderBottom: `1px solid ${colors.utility.primaryText}15`
          }}
        >
          <CardTitle
            className="flex items-center space-x-2"
            style={{ color: colors.utility.primaryText }}
          >
            <User className="w-5 h-5" />
            <span>This is the profile we have about you</span>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Logo and Business Name Header */}
          <div className="flex items-center space-x-4 pb-4 border-b" style={{ borderColor: `${colors.utility.primaryText}15` }}>
            {profile.logo_url ? (
              <img
                src={profile.logo_url}
                alt={`${profile.business_name} logo`}
                className="w-20 h-20 rounded-lg object-cover"
                style={{
                  border: `2px solid ${colors.brand.primary}30`
                }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.brand.primary}20`,
                  border: `2px solid ${colors.brand.primary}30`
                }}
              >
                <Building2 className="w-10 h-10" style={{ color: colors.brand.primary }} />
              </div>
            )}
            <div className="flex-1">
              <h3
                className="text-2xl font-bold"
                style={{ color: colors.utility.primaryText }}
              >
                {profile.business_name}
              </h3>
              {profile.business_category && (
                <div className="flex items-center space-x-2 mt-2">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${colors.semantic.success}20`,
                      color: colors.semantic.success
                    }}
                  >
                    {profile.business_category}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileItems.map((item, index) => {
              const Icon = item.icon;
              
              // Skip if already shown in header
              if (item.label === 'Business Name' || item.label === 'Category') {
                return null;
              }

              return (
                <div
                  key={index}
                  className="p-4 rounded-lg transition-all hover:shadow-md"
                  style={{
                    backgroundColor: colors.utility.primaryBackground,
                    border: `1px solid ${colors.utility.primaryText}10`
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: `${item.color}20`
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {item.label}
                      </p>
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.label === 'Website' ? '_blank' : undefined}
                          rel={item.label === 'Website' ? 'noopener noreferrer' : undefined}
                          className="text-sm font-semibold hover:underline flex items-center space-x-1 group truncate"
                          style={{ color: colors.utility.primaryText }}
                        >
                          <span className="truncate">{item.value}</span>
                          {item.label === 'Website' && (
                            <ExternalLink 
                              className="w-3 h-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" 
                              style={{ color: item.color }} 
                            />
                          )}
                        </a>
                      ) : (
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Address (if available) */}
          {(profile.address_line1 || profile.address_line2) && (
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                border: `1px solid ${colors.utility.primaryText}10`
              }}
            >
              <div className="flex items-start space-x-3">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor: `${colors.semantic.info}20`
                  }}
                >
                  <MapPin className="w-5 h-5" style={{ color: colors.semantic.info }} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Full Address
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {[
                      profile.address_line1,
                      profile.address_line2,
                      profile.city,
                      profile.state_code,
                      profile.postal_code
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;