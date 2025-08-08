// src/components/landing/LandingTestimonials.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Building,
  Users,
  TrendingUp,
  CheckCircle,
  Award,
  Heart,
  Shield,
  Settings,
  Briefcase,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

// Types
interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  rating: number;
  quote: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  image?: string;
  companyLogo?: string;
  verified: boolean;
  featured: boolean;
  videoUrl?: string;
}

interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  contractValue: string;
  timeframe: string;
  logo?: string;
}

interface TestimonialsProps {
  onVideoPlay?: (videoUrl: string) => void;
  onCaseStudyView?: (caseStudyId: string) => void;
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

// Star Rating Component
const StarRating = ({ rating, size = 'default' }: { rating: number; size?: 'sm' | 'default' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Individual Testimonial Card
const TestimonialCard = ({ 
  testimonial, 
  isActive = false,
  onVideoPlay 
}: { 
  testimonial: Testimonial;
  isActive?: boolean;
  onVideoPlay?: (videoUrl: string) => void;
}) => {
  const industryIcons = {
    'Healthcare': <Heart className="h-4 w-4" />,
    'Manufacturing': <Settings className="h-4 w-4" />,
    'Consulting': <Briefcase className="h-4 w-4" />,
    'Pharmaceutical': <Shield className="h-4 w-4" />
  };

  const handleVideoClick = () => {
    if (testimonial.videoUrl && onVideoPlay) {
      onVideoPlay(testimonial.videoUrl);
    }
  };

  return (
    <div className={`bg-white rounded-xl p-8 shadow-lg border transition-all duration-300 ${
      isActive ? 'border-red-200 shadow-xl' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
            {testimonial.image ? (
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-600">
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
              {testimonial.verified && (
                <CheckCircle className="h-4 w-4 text-blue-500" title="Verified Customer" />
              )}
              {testimonial.featured && (
                <Award className="h-4 w-4 text-yellow-500" title="Featured Review" />
              )}
            </div>
            <div className="text-sm text-gray-600">{testimonial.role}</div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {industryIcons[testimonial.industry] || <Building className="h-4 w-4" />}
              <span>{testimonial.company}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <StarRating rating={testimonial.rating} />
          {testimonial.videoUrl && (
            <button
              onClick={handleVideoClick}
              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Play className="h-3 w-3" />
              <span>Watch Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Quote */}
      <div className="relative mb-6">
        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-gray-200" />
        <blockquote className="text-lg text-gray-700 italic leading-relaxed pl-6">
          "{testimonial.quote}"
        </blockquote>
      </div>

      {/* Results Metrics */}
      {testimonial.results && testimonial.results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          {testimonial.results.map((result, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {result.value}
              </div>
              <div className="text-xs text-gray-600 font-medium mb-1">
                {result.metric}
              </div>
              <div className="text-xs text-gray-500">
                {result.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Case Study Card
const CaseStudyCard = ({ 
  caseStudy, 
  onView 
}: { 
  caseStudy: CaseStudy;
  onView?: (id: string) => void;
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {caseStudy.logo ? (
            <img src={caseStudy.logo} alt={caseStudy.company} className="h-8 w-8" />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
              <Building className="h-4 w-4 text-gray-600" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{caseStudy.company}</h4>
            <p className="text-sm text-gray-600">{caseStudy.industry}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-green-600">{caseStudy.contractValue}</div>
          <div className="text-xs text-gray-500">{caseStudy.timeframe}</div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-red-600">Challenge:</span>
          <p className="text-gray-700 mt-1">{caseStudy.challenge}</p>
        </div>
        
        <div>
          <span className="font-medium text-blue-600">Solution:</span>
          <p className="text-gray-700 mt-1">{caseStudy.solution}</p>
        </div>
        
        <div>
          <span className="font-medium text-green-600">Results:</span>
          <ul className="mt-1 space-y-1">
            {caseStudy.results.map((result, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                {result}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onView?.(caseStudy.id)}
          className="group-hover:text-red-600"
        >
          Read Full Case Study
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const LandingTestimonials: React.FC<TestimonialsProps> = ({ 
  onVideoPlay,
  onCaseStudyView,
  className = ''
}) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Mock testimonials data
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      role: 'Operations Director',
      company: 'City General Hospital',
      industry: 'Healthcare',
      rating: 5,
      quote: 'ContractNest eliminated our Excel chaos. We now manage ₹7.6 crore worth of contracts with complete transparency. The automated compliance alerts alone have saved us from three potential SLA breaches.',
      results: [
        { metric: 'Time Saved', value: '70%', description: 'Monthly admin time' },
        { metric: 'Contract Value', value: '₹7.6Cr', description: 'Under management' },
        { metric: 'SLA Compliance', value: '98%', description: 'Up from 65%' }
      ],
      verified: true,
      featured: true,
      videoUrl: 'https://example.com/video1'
    },
    {
      id: '2',
      name: 'Raj Malhotra',
      role: 'Plant Manager',
      company: 'Precision Manufacturing Ltd',
      industry: 'Manufacturing',
      rating: 5,
      quote: 'From manual tracking to automated compliance - 70% time savings in contract administration. Our vendor relationships have never been better, and we\'ve eliminated billing disputes entirely.',
      results: [
        { metric: 'Vendor Relations', value: '100%', description: 'Satisfaction score' },
        { metric: 'Billing Disputes', value: '0', description: 'Last 6 months' },
        { metric: 'Process Time', value: '70%', description: 'Reduction' }
      ],
      verified: true,
      featured: false
    },
    {
      id: '3',
      name: 'CA Sunita Reddy',
      role: 'Managing Partner',
      company: 'Reddy & Associates',
      industry: 'Consulting',
      rating: 5,
      quote: 'Milestone-based invoicing became effortless. Our clients love the transparency, and we\'ve reduced payment collection time by 60%. The collaboration features are game-changing.',
      results: [
        { metric: 'Payment Time', value: '60%', description: 'Faster collection' },
        { metric: 'Client Satisfaction', value: '4.8/5', description: 'Average rating' },
        { metric: 'Invoice Accuracy', value: '99.8%', description: 'Error reduction' }
      ],
      verified: true,
      featured: true,
      videoUrl: 'https://example.com/video3'
    },
    {
      id: '4',
      name: 'Dr. Amit Patel',
      role: 'Quality Head',
      company: 'PharmaCorp India',
      industry: 'Pharmaceutical',
      rating: 5,
      quote: 'The regulatory compliance tracking is phenomenal. We passed our recent FDA audit with zero findings related to service contracts. The audit trail feature saved us weeks of preparation.',
      results: [
        { metric: 'Audit Findings', value: '0', description: 'Service contracts' },
        { metric: 'Compliance Score', value: '100%', description: 'FDA standards' },
        { metric: 'Audit Prep Time', value: '80%', description: 'Reduction' }
      ],
      verified: true,
      featured: false
    }
  ];

  // Mock case studies
  const caseStudies: CaseStudy[] = [
    {
      id: 'cs1',
      company: 'Metro Hospital Chain',
      industry: 'Healthcare Network',
      challenge: '15 hospitals, 200+ medical equipment contracts, manual tracking causing compliance issues',
      solution: 'Centralized contract management with automated SLA monitoring and vendor performance tracking',
      results: [
        '95% improvement in SLA compliance',
        '₹2.5Cr cost savings through better vendor management',
        '50% reduction in equipment downtime'
      ],
      contractValue: '₹25+ Crores',
      timeframe: '18 months'
    },
    {
      id: 'cs2',
      company: 'TechManufacturing Corp',
      industry: 'Electronics Manufacturing',
      challenge: 'Complex multi-vendor service ecosystem with poor visibility and coordination',
      solution: 'Automated workflow management with real-time collaboration and performance analytics',
      results: [
        '40% faster issue resolution',
        'Eliminated vendor coordination delays',
        '₹1.2Cr annual savings in operational efficiency'
      ],
      contractValue: '₹8+ Crores',
      timeframe: '12 months'
    },
    {
      id: 'cs3',
      company: 'Global Consulting Partners',
      industry: 'Management Consulting',
      challenge: '100+ client projects with milestone-based billing and deliverable tracking challenges',
      solution: 'Client collaboration portals with automated milestone tracking and transparent billing',
      results: [
        '60% faster client payment cycles',
        '90% reduction in billing queries',
        '25% increase in client retention'
      ],
      contractValue: '₹12+ Crores',
      timeframe: '9 months'
    }
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, testimonials.length]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Track testimonials section view
          if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonials_section_view', {
              event_category: 'engagement',
              event_label: 'social_proof'
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

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const handleTestimonialSelect = (index: number) => {
    setIsAutoPlaying(false);
    setActiveTestimonial(index);
  };

  const handleVideoPlay = (videoUrl: string) => {
    if (onVideoPlay) {
      onVideoPlay(videoUrl);
    }
    
    // Track video play
    if (typeof gtag !== 'undefined') {
      gtag('event', 'testimonial_video_play', {
        event_category: 'engagement',
        event_label: 'customer_story'
      });
    }
  };

  const handleCaseStudyView = (caseStudyId: string) => {
    if (onCaseStudyView) {
      onCaseStudyView(caseStudyId);
    }
    
    // Track case study view
    if (typeof gtag !== 'undefined') {
      gtag('event', 'case_study_view', {
        event_category: 'engagement',
        event_label: caseStudyId
      });
    }
  };

  // Calculate overall statistics
  const totalContracts = testimonials.reduce((sum, t) => {
    const contractValue = t.results?.find(r => r.metric.includes('Contract'))?.value;
    if (contractValue && contractValue.includes('₹')) {
      const numValue = parseFloat(contractValue.replace(/[₹,Cr]/g, ''));
      return sum + (contractValue.includes('Cr') ? numValue : numValue / 100);
    }
    return sum;
  }, 0);

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <section ref={sectionRef} id="testimonials" className={`py-20 bg-gray-50 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="h-4 w-4 mr-2" />
            Customer Success Stories
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Join hundreds of businesses who have transformed their service contract management 
            and are seeing measurable results
          </p>

          {/* Overall Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <StarRating rating={Math.round(averageRating)} size="sm" />
              <span className="font-semibold">{averageRating.toFixed(1)}/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>₹{totalContracts.toFixed(1)}+ Crores Under Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>{testimonials.filter(t => t.verified).length} Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-16">
          <div className="max-w-4xl mx-auto">
            <TestimonialCard 
              testimonial={testimonials[activeTestimonial]} 
              isActive={true}
              onVideoPlay={handleVideoPlay}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleTestimonialSelect(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-red-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-900"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Auto-play toggle */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isAutoPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
            </button>
          </div>
        </div>

        {/* Case Studies Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Detailed Case Studies
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dive deeper into how ContractNest has transformed service contract management 
              across different industries and business sizes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                onView={handleCaseStudyView}
              />
            ))}
          </div>
        </div>

        {/* Featured Testimonials Grid */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              More Success Stories
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.filter(t => t.featured).map((testimonial) => (
              <div key={testimonial.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                  <div className="ml-auto">
                    <StarRating rating={testimonial.rating} size="sm" />
                  </div>
                </div>
                
                <blockquote className="text-gray-700 italic mb-4">
                  "{testimonial.quote.substring(0, 120)}..."
                </blockquote>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{testimonial.company}</span>
                  {testimonial.videoUrl && (
                    <button
                      onClick={() => handleVideoPlay(testimonial.videoUrl!)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <Play className="h-3 w-3" />
                      <span>Watch</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Join These Success Stories?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            See how ContractNest can transform your service contract management 
            and deliver measurable results for your business.
          </p>
          
          <Button size="lg" className="text-lg px-8 py-4">
            Get Your Success Story Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;