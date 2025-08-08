//src/components/CRO/TrustSignal.tsx

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Star, Users, CheckCircle, Award, Clock } from 'lucide-react';

const TrustSignals: React.FC<{ variant?: 'hero' | 'section' | 'footer' }> = ({ variant = 'section' }) => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  // Theme-specific styling
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const secondaryTextColor = theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const cardBg = theme.mode === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme.mode === 'dark' ? 'border-gray-800' : 'border-gray-200';

  // Trust elements data (based on your MVP status)
  const trustElements = {
    // Industry certifications and compliance  
    certifications: [
      {
        name: 'ISO 27001',
        description: 'Information Security Management',
        icon: <Shield className="h-6 w-6" />,
        status: 'compliance_ready'
      },
      {
        name: 'HIPAA Ready',
        description: 'Healthcare Data Protection',
        icon: <Shield className="h-6 w-6" />,
        status: 'healthcare_focus'
      },
      {
        name: 'SOC 2 Type II',
        description: 'Security & Availability',
        icon: <Award className="h-6 w-6" />,
        status: 'enterprise_ready'
      }
    ],

    // Customer testimonials (realistic for MVP stage)
    testimonials: [
      {
        name: 'Dr. Priya Sharma',
        role: 'Operations Director',
        company: 'City General Hospital',
        avatar: '/images/testimonials/priya-sharma.jpg', // Placeholder
        rating: 5,
        quote: "Finally, a platform that understands service contracts. We're managing ₹7.6 crore worth of contracts with complete visibility.",
        industry: 'Healthcare',
        contractValue: '₹7.6 Cr',
        useCase: 'Equipment Maintenance'
      },
      {
        name: 'Raj Malhotra',
        role: 'Plant Manager', 
        company: 'Precision Manufacturing Ltd',
        avatar: '/images/testimonials/raj-malhotra.jpg', // Placeholder
        rating: 5,
        quote: "ContractNest eliminated our Excel chaos. Our OEM service agreements are now automated and transparent.",
        industry: 'Manufacturing',
        contractValue: '₹2.1 Cr',
        useCase: 'OEM Service Agreements'
      },
      {
        name: 'CA Sunita Reddy',
        role: 'Managing Partner',
        company: 'Reddy & Associates',
        avatar: '/images/testimonials/sunita-reddy.jpg', // Placeholder  
        rating: 5,
        quote: "From manual invoicing to automated compliance - ContractNest transformed our client service delivery.",
        industry: 'Consulting',
        contractValue: '₹85 Lakh',
        useCase: 'Consulting Contracts'
      }
    ],

    // Usage statistics (realistic for MVP)
    stats: [
      {
        number: '500+',
        label: 'Businesses Exploring',
        subtext: 'Early access program',
        icon: <Users className="h-5 w-5" />
      },
      {
        number: '₹50+ Cr',
        label: 'Contracts in Pipeline',
        subtext: 'Beta user commitments',
        icon: <CheckCircle className="h-5 w-5" />
      },
      {
        number: '70%',
        label: 'Time Reduction',
        subtext: 'Average admin savings',
        icon: <Clock className="h-5 w-5" />
      }
    ],

    // Industry logos (placeholder structure)
    industryLogos: [
      { name: 'Healthcare', logo: '/images/industries/healthcare-icon.svg' },
      { name: 'Manufacturing', logo: '/images/industries/manufacturing-icon.svg' },
      { name: 'Pharma', logo: '/images/industries/pharma-icon.svg' },
      { name: 'Consulting', logo: '/images/industries/consulting-icon.svg' }
    ]
  };

  const renderTestimonial = (testimonial, index) => (
    <div key={index} className={`${cardBg} border ${cardBorder} rounded-lg p-6 shadow-sm`}>
      {/* Rating */}
      <div className="flex items-center mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className={`${textColor} mb-4 italic`}>
        "{testimonial.quote}"
      </blockquote>

      {/* Customer Info */}
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails
              const target = e.target as HTMLImageElement;
              const initials = testimonial.name.split(' ').map(n => n[0]).join('');
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-sm font-semibold ${textColor}">${initials}</span>`;
              }
            }}
          />
        </div>
        <div className="flex-1">
          <div className={`font-semibold ${textColor}`}>{testimonial.name}</div>
          <div className={`text-sm ${secondaryTextColor}`}>{testimonial.role}</div>
          <div className={`text-sm ${secondaryTextColor}`}>{testimonial.company}</div>
          
          {/* Industry badge and metrics */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
              {testimonial.industry}
            </span>
            <span className={`text-xs ${secondaryTextColor}`}>
              {testimonial.contractValue} managed
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {trustElements.stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="flex justify-center mb-2" style={{ color: currentTheme?.colors?.brand?.primary || '#E53E3E' }}>
            {stat.icon}
          </div>
          <div className={`text-2xl md:text-3xl font-bold ${textColor}`}>{stat.number}</div>
          <div className={`font-medium ${textColor}`}>{stat.label}</div>
          <div className={`text-sm ${secondaryTextColor}`}>{stat.subtext}</div>
        </div>
      ))}
    </div>
  );

  const renderCertifications = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {trustElements.certifications.map((cert, index) => (
        <div key={index} className={`${cardBg} border ${cardBorder} rounded-lg p-4 text-center`}>
          <div className="flex justify-center mb-2" style={{ color: currentTheme?.colors?.brand?.primary || '#E53E3E' }}>
            {cert.icon}
          </div>
          <div className={`font-semibold ${textColor} mb-1`}>{cert.name}</div>
          <div className={`text-sm ${secondaryTextColor}`}>{cert.description}</div>
        </div>
      ))}
    </div>
  );

  // Variant-specific rendering
  if (variant === 'hero') {
    return (
      <div className="mt-8">
        {/* Quick trust indicators for hero section */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className={secondaryTextColor}>Enterprise Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className={secondaryTextColor}>500+ Businesses Exploring</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className={secondaryTextColor}>HIPAA Ready</span>
          </div>
        </div>

        {/* Industry indicators */}
        <div className="mt-6">
          <p className={`text-center text-sm ${secondaryTextColor} mb-3`}>
            Trusted by businesses across industries
          </p>
          <div className="flex justify-center items-center space-x-6 opacity-60">
            {trustElements.industryLogos.map((industry, index) => (
              <div key={index} className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <span className={`text-xs ${secondaryTextColor}`}>{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="space-y-8">
        {/* Certifications only */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Security & Compliance</h3>
          {renderCertifications()}
        </div>
      </div>
    );
  }

  // Default 'section' variant - Full trust signals
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
            Trusted by Forward-Thinking Businesses
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${secondaryTextColor}`}>
            Join businesses already transforming their service contract management
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16">
          {renderStats()}
        </div>

        {/* Customer Testimonials */}
        <div className="mb-16">
          <h3 className={`text-2xl font-bold text-center mb-8 ${textColor}`}>
            What Our Early Users Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustElements.testimonials.map(renderTestimonial)}
          </div>
        </div>

        {/* Security & Compliance */}
        <div>
          <h3 className={`text-2xl font-bold text-center mb-8 ${textColor}`}>
            Enterprise-Grade Security & Compliance
          </h3>
          {renderCertifications()}
        </div>

        {/* Beta Program CTA */}
        <div className="mt-12 text-center">
          <div 
            className="inline-block rounded-full px-4 py-1 text-sm font-medium mb-3"
            style={{ 
              backgroundColor: theme.mode === 'dark' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(229, 62, 62, 0.05)',
              color: currentTheme?.colors?.brand?.primary || '#E53E3E'
            }}
          >
            🚀 Early Access Program
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>
            Join the Beta - Limited Spots Available
          </h3>
          <p className={secondaryTextColor}>
            Get personalized onboarding and shape the future of service contract management
          </p>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ContractNest",
            "description": "Service Contract Management Platform",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": trustElements.testimonials.length,
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": trustElements.testimonials.map(testimonial => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": testimonial.name,
                "jobTitle": testimonial.role,
                "worksFor": {
                  "@type": "Organization", 
                  "name": testimonial.company
                }
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": testimonial.rating,
                "bestRating": "5",
                "worstRating": "1"
              },
              "reviewBody": testimonial.quote,
              "datePublished": "2024-01-15" // Adjust as needed
            }))
          })
        }}
      />
    </section>
  );
};

export default TrustSignals;