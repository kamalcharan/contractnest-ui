// src/components/CRO/SocialProof.tsx
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Users, TrendingUp, Award, Shield, Building2, Clock, ArrowRight } from 'lucide-react';
import { useCRO } from '../../hooks/useCRO';
import { TrustSignal } from '../../types/cro.types';

interface SocialProofProps {
  variant?: 'testimonials' | 'logos' | 'stats' | 'combined' | 'floating';
  position?: 'hero' | 'features' | 'pricing' | 'footer';
  className?: string;
  showRealTimeActivity?: boolean;
  autoRotate?: boolean;
  maxItems?: number;
}

const SocialProof: React.FC<SocialProofProps> = ({
  variant = 'combined',
  position = 'hero',
  className = '',
  showRealTimeActivity = true,
  autoRotate = true,
  maxItems = 6
}) => {
  const { trackConversion, sessionId } = useCRO();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [visitorCount, setVisitorCount] = useState(247);
  const [recentSignups, setRecentSignups] = useState(12);

  // Testimonials data with high-impact social proof
  const testimonials = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      title: "Operations Director",
      company: "Apollo Hospitals",
      industry: "Healthcare",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      quote: "ContractNest reduced our compliance tracking time by 75%. Managing 200+ equipment maintenance contracts is now effortless.",
      metrics: "₹12L saved annually",
      rating: 5,
      verified: true,
      contractsManaged: 200,
      timeUsing: "8 months"
    },
    {
      id: 2,
      name: "Priya Sharma",
      title: "CFO",
      company: "CoolAir HVAC",
      industry: "HVAC Services",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=80&h=80&fit=crop&crop=face",
      quote: "Our receivables cycle improved by 40 days. Customers love the transparency and automated reminders.",
      metrics: "40 days faster collection",
      rating: 5,
      verified: true,
      contractsManaged: 150,
      timeUsing: "6 months"
    },
    {
      id: 3,
      name: "Amit Patel",
      title: "Founder",
      company: "TechServe Consultancy",
      industry: "Consulting",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      quote: "From 2 hours daily admin to 15 minutes. Now I focus on clients, not chasing payments.",
      metrics: "300% productivity gain",
      rating: 5,
      verified: true,
      contractsManaged: 85,
      timeUsing: "4 months"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      title: "Operations Manager",
      company: "MedEquip Solutions",
      industry: "Medical Equipment",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      quote: "HIPAA compliance is automatic now. Our audit preparation time went from weeks to hours.",
      metrics: "95% compliance score",
      rating: 5,
      verified: true,
      contractsManaged: 180,
      timeUsing: "10 months"
    },
    {
      id: 5,
      name: "Karthik Reddy",
      title: "Director of Operations",
      company: "Industrial Maintenance Co",
      industry: "Manufacturing",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      quote: "Scheduling 500+ maintenance events across 12 locations is now seamless. Zero missed SLAs last quarter.",
      metrics: "100% SLA compliance",
      rating: 5,
      verified: true,
      contractsManaged: 500,
      timeUsing: "1 year"
    }
  ];

  // Company logos with credibility indicators
  const companyLogos = [
    { name: "Apollo Hospitals", logo: "/images/logos/apollo.png", industry: "Healthcare", contracts: 200 },
    { name: "Tata Motors", logo: "/images/logos/tata.png", industry: "Manufacturing", contracts: 150 },
    { name: "Max Healthcare", logo: "/images/logos/max.png", industry: "Healthcare", contracts: 120 },
    { name: "L&T Services", logo: "/images/logos/lt.png", industry: "Engineering", contracts: 300 },
    { name: "Fortis Healthcare", logo: "/images/logos/fortis.png", industry: "Healthcare", contracts: 180 },
    { name: "Blue Star", logo: "/images/logos/bluestar.png", industry: "HVAC", contracts: 250 }
  ];

  // Trust statistics
  const trustStats = [
    { 
      value: "500+", 
      label: "Businesses Trust Us", 
      icon: <Building2 className="w-5 h-5" />,
      detail: "Across healthcare, manufacturing, and services"
    },
    { 
      value: "₹50Cr+", 
      label: "Contracts Managed", 
      icon: <TrendingUp className="w-5 h-5" />,
      detail: "In annual contract value"
    },
    { 
      value: "99.9%", 
      label: "Uptime SLA", 
      icon: <Shield className="w-5 h-5" />,
      detail: "Enterprise-grade reliability"
    },
    { 
      value: "4.9/5", 
      label: "Customer Rating", 
      icon: <Star className="w-5 h-5" />,
      detail: "Based on 150+ reviews"
    }
  ];

  // Certifications and awards
  const certifications = [
    { name: "ISO 27001", icon: <Shield className="w-6 h-6" />, description: "Information Security" },
    { name: "SOC 2 Type II", icon: <CheckCircle className="w-6 h-6" />, description: "Security & Compliance" },
    { name: "GDPR Compliant", icon: <Award className="w-6 h-6" />, description: "Data Protection" },
    { name: "HIPAA Ready", icon: <Shield className="w-6 h-6" />, description: "Healthcare Compliance" }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoRotate || variant !== 'testimonials') return;

    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate, variant, testimonials.length]);

  // Simulate real-time activity
  useEffect(() => {
    if (!showRealTimeActivity) return;

    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
      
      // Occasionally update recent signups
      if (Math.random() < 0.3) {
        setRecentSignups(prev => prev + 1);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [showRealTimeActivity]);

  // Track social proof interactions
  const handleTestimonialClick = (testimonial: any) => {
    trackConversion({
      eventName: 'social_proof_interaction',
      eventCategory: 'engagement',
      eventLabel: `testimonial_${testimonial.id}`,
      customParameters: {
        testimonial_company: testimonial.company,
        testimonial_industry: testimonial.industry,
        position: position
      }
    });
  };

  const handleLogoClick = (company: any) => {
    trackConversion({
      eventName: 'social_proof_interaction',
      eventCategory: 'engagement',
      eventLabel: `logo_${company.name}`,
      customParameters: {
        company_name: company.name,
        company_industry: company.industry,
        position: position
      }
    });
  };

  // Render testimonials
  const renderTestimonials = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Trusted by Service Leaders
        </h3>
        <div className="flex items-center justify-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-2 text-gray-600 dark:text-gray-300">4.9/5 from 150+ reviews</span>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
          >
            {testimonials.slice(0, maxItems).map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
                  onClick={() => handleTestimonialClick(testimonial)}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" title="Verified Customer" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{testimonial.title}</p>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">{testimonial.company}</p>
                      
                      <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {testimonial.metrics}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {testimonial.contractsManaged} contracts • {testimonial.timeUsing}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.slice(0, maxItems).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Render company logos
  const renderLogos = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Trusted by Leading Organizations
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Join 500+ companies managing their service contracts with ContractNest
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-70 hover:opacity-100 transition-opacity">
        {companyLogos.slice(0, maxItems).map((company, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 cursor-pointer group"
            onClick={() => handleLogoClick(company)}
          >
            <div className="w-20 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow">
              <img
                src={company.logo}
                alt={company.name}
                className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-xs font-medium text-gray-600">${company.name}</span>`;
                  }
                }}
              />
            </div>
            <div className="text-xs text-center">
              <div className="font-medium text-gray-700 dark:text-gray-300">{company.contracts} contracts</div>
              <div className="text-gray-500 dark:text-gray-400">{company.industry}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render trust statistics
  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {trustStats.map((stat, index) => (
        <div key={index} className="text-center group">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {stat.label}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {stat.detail}
          </div>
        </div>
      ))}
    </div>
  );

  // Render certifications
  const renderCertifications = () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      {certifications.map((cert, index) => (
        <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-green-600 dark:text-green-400">
            {cert.icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{cert.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{cert.description}</div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render floating activity
  const renderFloatingActivity = () => (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-4 animate-slide-up">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Someone from Mumbai just signed up!
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {recentSignups} people joined in the last hour
            </p>
          </div>
        </div>
      </div>

      {showRealTimeActivity && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              <strong>{visitorCount}</strong> people exploring ContractNest right now
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Render combined view
  const renderCombined = () => (
    <div className="space-y-12">
      {/* Stats row */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Trusted by Service Leaders Across India
        </h3>
        {renderStats()}
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
        {renderTestimonials()}
      </div>

      {/* Company logos */}
      <div>
        {renderLogos()}
      </div>

      {/* Certifications */}
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Enterprise-Grade Security & Compliance
        </h4>
        {renderCertifications()}
      </div>
    </div>
  );

  // Main render logic
  const renderContent = () => {
    switch (variant) {
      case 'testimonials':
        return renderTestimonials();
      case 'logos':
        return renderLogos();
      case 'stats':
        return renderStats();
      case 'floating':
        return renderFloatingActivity();
      case 'combined':
      default:
        return renderCombined();
    }
  };

  if (variant === 'floating') {
    return renderContent();
  }

  return (
    <div className={`social-proof-${variant} ${className}`}>
      {renderContent()}
    </div>
  );
};

export default SocialProof;

// Additional component for inline social proof snippets
export const InlineSocialProof: React.FC<{
  type: 'customer_count' | 'rating' | 'recent_signup' | 'time_saved';
  className?: string;
}> = ({ type, className = '' }) => {
  const snippets = {
    customer_count: (
      <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Users className="w-4 h-4" />
        <span>Join 500+ businesses using ContractNest</span>
      </div>
    ),
    rating: (
      <div className="inline-flex items-center space-x-2 text-sm">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="text-gray-600 dark:text-gray-400">4.9/5 (150+ reviews)</span>
      </div>
    ),
    recent_signup: (
      <div className="inline-flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>12 businesses joined this week</span>
      </div>
    ),
    time_saved: (
      <div className="inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
        <Clock className="w-4 h-4" />
        <span>Save 2+ hours daily on contract management</span>
      </div>
    )
  };

  return (
    <div className={`inline-social-proof ${className}`}>
      {snippets[type]}
    </div>
  );
};