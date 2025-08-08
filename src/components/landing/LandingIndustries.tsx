// src/components/landing/LandingIndustries.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight,
  Building,
  TrendingUp,
  Users,
  CheckCircle,
  Heart,
  Settings,
  Shield,
  Briefcase,
  DollarSign,
  Factory,
  ShoppingBag,
  Cpu,
  GraduationCap,
  Landmark,
  Phone,
  Truck,
  Zap,
  Construction,
  UtensilsCrossed,
  Film,
  Wheat,
  Pill,
  Car,
  Plane,
  MoreHorizontal,
  Clock,
  Target,
  Lightbulb,
  BarChart3,
  Globe
} from 'lucide-react';

// Types
interface Industry {
  id: string;
  name: string;
  description?: string;
  icon: string;
}

interface IndustryDetails {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  contractTypes: string[];
  painPoints: string[];
  solutions: string[];
  benefits: string[];
  caseStudy: {
    company: string;
    scenario: string;
    result: string;
    metric: string;
  };
  contractRange: string;
  averageValue: string;
}

interface IndustriesProps {
  onIndustrySelect?: (industryId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

// Mock Button component
const Button = ({ children, className = '', variant = 'primary', onClick, size = 'default', ...props }) => {
  const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };
  
  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Icon mapping for industries
const getIndustryIcon = (iconName: string, size: string = 'h-6 w-6') => {
  const iconMap = {
    'Stethoscope': <Heart className={size} />,
    'DollarSign': <DollarSign className={size} />,
    'Factory': <Factory className={size} />,
    'ShoppingBag': <ShoppingBag className={size} />,
    'Cpu': <Cpu className={size} />,
    'GraduationCap': <GraduationCap className={size} />,
    'Landmark': <Landmark className={size} />,
    'Heart': <Heart className={size} />,
    'Briefcase': <Briefcase className={size} />,
    'Phone': <Phone className={size} />,
    'Truck': <Truck className={size} />,
    'Zap': <Zap className={size} />,
    'Construction': <Construction className={size} />,
    'UtensilsCrossed': <UtensilsCrossed className={size} />,
    'Film': <Film className={size} />,
    'Wheat': <Wheat className={size} />,
    'Pill': <Pill className={size} />,
    'Car': <Car className={size} />,
    'Plane': <Plane className={size} />,
    'MoreHorizontal': <MoreHorizontal className={size} />
  };
  return iconMap[iconName] || <Building className={size} />;
};

// Industry Card Component
const IndustryCard = ({ 
  industry, 
  onClick,
  isVisible,
  delay = 0 
}: { 
  industry: IndustryDetails;
  onClick: (id: string) => void;
  isVisible: boolean;
  delay?: number;
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  const handleClick = () => {
    onClick(industry.id);
    
    // Track industry card click
    if (typeof gtag !== 'undefined') {
      gtag('event', 'industry_card_click', {
        event_category: 'navigation',
        event_label: industry.id,
        value: 5
      });
    }
  };

  return (
    <div className={`group cursor-pointer transition-all duration-300 ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div 
        onClick={handleClick}
        className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-${industry.color}-200 transition-all duration-300 h-full`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 bg-${industry.color}-50 rounded-xl flex items-center justify-center text-${industry.color}-600 group-hover:scale-110 transition-transform`}>
            {getIndustryIcon(industry.icon, 'h-7 w-7')}
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{industry.contractRange}</div>
            <div className="text-xs text-gray-500">Contract Range</div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
            {industry.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {industry.description}
          </p>
          
          {/* Contract Types */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Common Contract Types:</h4>
            <div className="flex flex-wrap gap-1">
              {industry.contractTypes.slice(0, 3).map((type, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {type}
                </span>
              ))}
              {industry.contractTypes.length > 3 && (
                <span className="text-xs text-gray-500">+{industry.contractTypes.length - 3} more</span>
              )}
            </div>
          </div>
        </div>

        {/* Case Study Preview */}
        <div className={`bg-${industry.color}-50 rounded-lg p-3 mb-4`}>
          <div className="text-xs font-semibold text-gray-700 mb-1">Success Story:</div>
          <div className="text-xs text-gray-600 mb-2">{industry.caseStudy.company}</div>
          <div className="text-xs text-gray-700 leading-relaxed mb-2">
            {industry.caseStudy.scenario}
          </div>
          <div className={`text-sm font-bold text-${industry.color}-700`}>
            {industry.caseStudy.metric}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Avg: {industry.averageValue}
          </span>
          <div className="flex items-center text-sm font-medium text-red-600 group-hover:text-red-700">
            <span>Explore Solutions</span>
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Industry Showcase
const FeaturedIndustryShowcase = ({ 
  industry,
  isVisible 
}: { 
  industry: IndustryDetails;
  isVisible: boolean;
}) => {
  return (
    <div className={`bg-gradient-to-r from-${industry.color}-50 to-${industry.color}-100 rounded-2xl p-8 border border-${industry.color}-200 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 bg-${industry.color}-200 rounded-xl flex items-center justify-center text-${industry.color}-700`}>
              {getIndustryIcon(industry.icon, 'h-8 w-8')}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{industry.name}</h3>
              <p className="text-gray-600">Specialized Contract Management</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Challenges We Solve:</h4>
              <ul className="space-y-1">
                {industry.painPoints.slice(0, 3).map((point, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <Target className={`h-4 w-4 text-${industry.color}-600 mr-2 flex-shrink-0`} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Our Solutions:</h4>
              <ul className="space-y-1">
                {industry.solutions.slice(0, 3).map((solution, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <Lightbulb className={`h-4 w-4 text-${industry.color}-600 mr-2 flex-shrink-0`} />
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-4">
            {industry.caseStudy.company} Success Story
          </h4>
          
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-red-600">Challenge:</span>
              <p className="text-sm text-gray-700 mt-1">{industry.caseStudy.scenario}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-green-600">Result:</span>
              <p className="text-sm text-gray-700 mt-1">{industry.caseStudy.result}</p>
            </div>
            
            <div className={`bg-${industry.color}-50 rounded-lg p-4 text-center`}>
              <div className={`text-2xl font-bold text-${industry.color}-700 mb-1`}>
                {industry.caseStudy.metric}
              </div>
              <div className="text-sm text-gray-600">Key Achievement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingIndustries: React.FC<IndustriesProps> = ({ 
  onIndustrySelect,
  onViewAll,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredIndustry, setFeaturedIndustry] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Mock detailed industry data
  const detailedIndustries: IndustryDetails[] = [
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Medical services, hospitals, clinics, and healthcare product maintenance contracts',
      icon: 'Stethoscope',
      color: 'red',
      contractTypes: ['Medical Equipment AMC', 'Facility Management', 'IT System Maintenance', 'Biomedical Calibration', 'HVAC Services'],
      painPoints: ['Equipment downtime costs', 'Regulatory compliance tracking', 'Multi-vendor coordination', 'SLA breach penalties'],
      solutions: ['Automated compliance alerts', 'Equipment lifecycle tracking', 'Vendor performance monitoring', 'Regulatory audit trails'],
      benefits: ['95% SLA compliance', '60% reduced downtime', 'HIPAA compliance', 'Automated reporting'],
      caseStudy: {
        company: 'City General Hospital',
        scenario: 'Managing ₹15L worth of CT-scan maintenance with compliance tracking challenges',
        result: 'Achieved 98% SLA compliance and eliminated regulatory findings in recent audit',
        metric: '₹7.6Cr+ Managed'
      },
      contractRange: '₹50K - ₹50L',
      averageValue: '₹8.5L'
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      description: 'Production facilities, machinery maintenance, and industrial service contracts',
      icon: 'Factory',
      color: 'blue',
      contractTypes: ['Production Line Maintenance', 'HVAC Services', 'Electrical Systems', 'Safety Equipment', 'Quality Control'],
      painPoints: ['Production delays from service issues', 'Multi-vendor coordination', 'Preventive maintenance scheduling', 'Cost optimization'],
      solutions: ['Automated work order generation', 'Predictive maintenance alerts', 'Vendor performance analytics', 'Cost tracking dashboards'],
      benefits: ['40% faster resolution', '25% cost reduction', 'Zero production delays', 'Improved vendor relations'],
      caseStudy: {
        company: 'Precision Manufacturing Ltd',
        scenario: 'Complex multi-vendor ecosystem with poor visibility and coordination delays',
        result: 'Streamlined vendor management with real-time performance tracking',
        metric: '70% Time Saved'
      },
      contractRange: '₹1L - ₹25L',
      averageValue: '₹5.2L'
    },
    {
      id: 'pharma',
      name: 'Pharmaceutical',
      description: 'Drug manufacturing, regulatory compliance, and specialized equipment maintenance',
      icon: 'Pill',
      color: 'green',
      contractTypes: ['Clean Room Maintenance', 'Equipment Validation', 'Regulatory Compliance', 'Quality Assurance', 'Environmental Controls'],
      painPoints: ['Regulatory audit preparation', 'Equipment validation tracking', 'Compliance documentation', 'FDA audit readiness'],
      solutions: ['Automated compliance tracking', 'Validation status monitoring', 'Audit trail generation', 'Regulatory reporting'],
      benefits: ['100% audit compliance', '80% less prep time', 'Zero FDA findings', 'Automated documentation'],
      caseStudy: {
        company: 'PharmaCorp India',
        scenario: 'FDA audit preparation taking weeks with manual compliance tracking',
        result: 'Passed FDA audit with zero service contract findings',
        metric: '100% Compliance'
      },
      contractRange: '₹2L - ₹1Cr',
      averageValue: '₹12L'
    },
    {
      id: 'professional_services',
      name: 'Consulting',
      description: 'Professional service firms, client project management, and milestone-based contracts',
      icon: 'Briefcase',
      color: 'purple',
      contractTypes: ['Client Projects', 'Milestone Billing', 'Resource Allocation', 'Deliverable Tracking', 'Performance Reviews'],
      painPoints: ['Milestone tracking complexity', 'Client billing disputes', 'Project deliverable management', 'Payment collection delays'],
      solutions: ['Automated milestone tracking', 'Client collaboration portals', 'Transparent billing systems', 'Performance analytics'],
      benefits: ['60% faster payments', '90% fewer disputes', '25% better retention', 'Improved satisfaction'],
      caseStudy: {
        company: 'Reddy & Associates',
        scenario: '100+ client projects with milestone billing and deliverable tracking challenges',
        result: 'Reduced payment collection time by 60% with transparent client portals',
        metric: '4.8/5 Client Rating'
      },
      contractRange: '₹50K - ₹10L',
      averageValue: '₹2.8L'
    }
  ];

  // Mock basic industries for grid display
  const basicIndustries: Industry[] = [
    { id: 'financial_services', name: 'Financial Services', description: 'Banking, insurance, investments', icon: 'DollarSign' },
    { id: 'retail', name: 'Retail', description: 'Sale of goods to consumers', icon: 'ShoppingBag' },
    { id: 'technology', name: 'Technology', description: 'Software, hardware, IT services', icon: 'Cpu' },
    { id: 'education', name: 'Education', description: 'Schools, universities, e-learning', icon: 'GraduationCap' },
    { id: 'government', name: 'Government', description: 'Public administration', icon: 'Landmark' },
    { id: 'telecommunications', name: 'Telecom', description: 'Communication services', icon: 'Phone' },
    { id: 'transportation', name: 'Transport & Logistics', description: 'Logistics operations', icon: 'Truck' },
    { id: 'energy', name: 'Energy & Utilities', description: 'Power and utility services', icon: 'Zap' }
  ];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Track industries section view
          if (typeof gtag !== 'undefined') {
            gtag('event', 'industries_section_view', {
              event_category: 'engagement',
              event_label: 'industry_focus'
            });
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate featured industry
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndustry(prev => (prev + 1) % detailedIndustries.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [detailedIndustries.length]);

  const handleIndustryClick = (industryId: string) => {
    if (onIndustrySelect) {
      onIndustrySelect(industryId);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
    
    // Track view all industries click
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_all_industries', {
        event_category: 'navigation',
        event_label: 'industries_overview'
      });
    }
  };

  return (
    <section ref={sectionRef} className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building className="h-4 w-4 mr-2" />
            Industry Expertise
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for Service-Focused Industries
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From ₹23K lift maintenance to ₹40L medical equipment contracts - 
            every industry has unique needs, and every contract size matters
          </p>
        </div>

        {/* Featured Industry Showcase */}
        <div className="mb-16">
          <FeaturedIndustryShowcase 
            industry={detailedIndustries[featuredIndustry]}
            isVisible={isVisible}
          />
          
          {/* Featured Industry Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {detailedIndustries.map((_, index) => (
              <button
                key={index}
                onClick={() => setFeaturedIndustry(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === featuredIndustry ? 'bg-red-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Primary Industries Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Primary Focus Industries
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Specialized solutions designed for the unique challenges of each industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {detailedIndustries.map((industry, index) => (
              <IndustryCard
                key={industry.id}
                industry={industry}
                onClick={handleIndustryClick}
                isVisible={isVisible}
                delay={index * 200}
              />
            ))}
          </div>
        </div>

        {/* Additional Industries */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              We Also Serve Many Other Industries
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ContractNest adapts to any service contract management need across all sectors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8">
            {basicIndustries.map((industry, index) => (
              <button
                key={industry.id}
                onClick={() => handleIndustryClick(industry.id)}
                className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 text-center group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-gray-600 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  {getIndustryIcon(industry.icon, 'h-6 w-6')}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-gray-700">
                  {industry.name}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {industry.description}
                </p>
              </button>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={handleViewAll} variant="outline" size="lg">
              <Globe className="mr-2 h-5 w-5" />
              View All {detailedIndustries.length + basicIndustries.length + 8} Industries
            </Button>
          </div>
        </div>

        {/* Industry Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Serving Businesses Across All Scales
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-sm text-gray-600">Businesses Exploring</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">₹50+ Cr</div>
              <div className="text-sm text-gray-600">Contracts in Pipeline</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">₹23K - ₹1Cr</div>
              <div className="text-sm text-gray-600">Contract Range</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">70%</div>
              <div className="text-sm text-gray-600">Average Time Savings</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Don't See Your Industry Listed?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            ContractNest is flexible enough to handle service contracts in any industry. 
            Let's discuss how we can customize our solution for your specific needs.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="text-lg px-8 py-4">
              Schedule Industry Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={handleViewAll}>
              Explore All Solutions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingIndustries;