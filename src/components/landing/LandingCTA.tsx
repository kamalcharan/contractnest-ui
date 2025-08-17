// src/components/landing/LandingCTA.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight,
  Calendar,
  Play,
  Phone,
  Mail,
  MessageSquare,
  Users,
  Building,
  TrendingUp,
  CheckCircle,
  Star,
  Clock,
  Shield,
  Zap,
  Award,
  Sparkles,
  Rocket,
  Heart,
  Target,
  Gift,
  Timer,
  AlertCircle,
  ExternalLink,
  Download,
  Video,
  BookOpen,
  Headphones
} from 'lucide-react';

// Import existing components
import UrgencyElements from '../CRO/UrgencyElements';

// Types
interface CTAOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'outline';
  popular?: boolean;
  urgent?: boolean;
  action: 'signup' | 'demo' | 'contact' | 'video' | 'download';
}

interface SocialProofMetric {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}

interface CTAProps {
  onSignup?: () => void;
  onDemo?: () => void;
  onContact?: () => void;
  onVideoPlay?: (videoUrl: string) => void;
  onDownload?: (resourceType: string) => void;
  className?: string;
}

// Mock Button component
const Button = ({ children, className = '', variant = 'primary', onClick, size = 'default', disabled = false, ...props }) => {
  const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
    white: 'bg-white hover:bg-gray-50 text-gray-900 focus:ring-gray-500 shadow-lg hover:shadow-xl'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  };
  
  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Badge Component
const Badge = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    urgent: 'bg-red-50 text-red-700 border border-red-200 animate-pulse',
    popular: 'bg-blue-500 text-white',
    featured: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// CTA Option Card
const CTAOptionCard = ({ 
  option, 
  onClick,
  isVisible,
  delay = 0 
}: { 
  option: CTAOption;
  onClick: () => void;
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

  const cardClasses = `group relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
    option.popular ? 'border-blue-500 ring-4 ring-blue-100' : 
    option.urgent ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-200 hover:border-red-300'
  } ${shouldAnimate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Badges */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {option.popular && (
          <Badge variant="popular">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        )}
        {option.urgent && (
          <Badge variant="urgent">
            <Timer className="h-3 w-3 mr-1" />
            Limited Time
          </Badge>
        )}
      </div>

      {/* Icon */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors group-hover:scale-110 transform duration-300">
          <div className="text-red-600 group-hover:text-red-700">
            {option.icon}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700">
          {option.title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-6">
          {option.description}
        </p>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Button 
          variant={option.buttonVariant}
          size="lg"
          className="w-full group-hover:scale-105 transform transition-transform"
        >
          {option.buttonText}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};

// Social Proof Metrics
const SocialProofSection = ({ isVisible }: { isVisible: boolean }) => {
  const metrics: SocialProofMetric[] = [
    {
      icon: <Building className="h-8 w-8" />,
      value: '500+',
      label: 'Businesses Exploring',
      description: 'Companies evaluating ContractNest'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: '₹50+ Cr',
      label: 'Contracts in Pipeline',
      description: 'Total contract value being managed'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      value: '70%',
      label: 'Time Savings',
      description: 'Average reduction in admin time'
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      value: '95%',
      label: 'SLA Compliance',
      description: 'Average compliance improvement'
    },
    {
      icon: <Star className="h-8 w-8" />,
      value: '4.9/5',
      label: 'Customer Rating',
      description: 'Average satisfaction score'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      value: '24/7',
      label: 'Support Available',
      description: 'Always here when you need us'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {metrics.map((metric, index) => (
        <div key={index} className="text-center group">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all group-hover:scale-110">
            <div className="text-white">
              {metric.icon}
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {metric.value}
          </div>
          <div className="text-red-100 font-medium text-sm mb-1">
            {metric.label}
          </div>
          <div className="text-red-200 text-xs opacity-80">
            {metric.description}
          </div>
        </div>
      ))}
    </div>
  );
};

const LandingCTA: React.FC<CTAProps> = ({ 
  onSignup,
  onDemo,
  onContact,
  onVideoPlay,
  onDownload,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Environment URLs
 const signupUrl = import.meta.env.VITE_SIGNUP_URL || 'https://contractnest-ui-production.up.railway.app/signup';
const loginUrl = import.meta.env.VITE_LOGIN_URL || 'https://contractnest-ui-production.up.railway.app/login';

  // CTA Options
  const ctaOptions: CTAOption[] = [
    {
      id: 'start_trial',
      title: 'Start Free Trial',
      description: 'Begin with 10 free contracts and explore all features. No credit card required, setup in minutes.',
      icon: <Rocket className="h-12 w-12" />,
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary',
      popular: true,
      action: 'signup'
    },
    {
      id: 'book_demo',
      title: 'Book Personal Demo',
      description: 'Get a personalized walkthrough tailored to your industry and specific contract management needs.',
      icon: <Calendar className="h-12 w-12" />,
      buttonText: 'Schedule Demo',
      buttonVariant: 'outline',
      action: 'demo'
    },
    {
      id: 'talk_expert',
      title: 'Talk to Expert',
      description: 'Speak with our contract management specialists about your specific requirements and challenges.',
      icon: <Headphones className="h-12 w-12" />,
      buttonText: 'Contact Expert',
      buttonVariant: 'secondary',
      urgent: true,
      action: 'contact'
    }
  ];

  // Additional resources
  const resources = [
    {
      id: 'watch_demo',
      title: 'Watch Demo Video',
      description: '5-minute overview of ContractNest features',
      icon: <Video className="h-5 w-5" />,
      action: 'video'
    },
    {
      id: 'download_guide',
      title: 'Download Buyer\'s Guide',
      description: 'Complete guide to service contract management',
      icon: <Download className="h-5 w-5" />,
      action: 'download'
    },
    {
      id: 'read_cases',
      title: 'Read Case Studies',
      description: 'Success stories from our customers',
      icon: <BookOpen className="h-5 w-5" />,
      action: 'download'
    }
  ];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Track CTA section view
          if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_section_view', {
              event_category: 'engagement',
              event_label: 'final_conversion'
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

  // Action handlers
  const handleCTAClick = (action: string, optionId: string) => {
    // Track CTA interaction
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        event_category: 'conversion',
        event_label: optionId,
        value: action === 'signup' ? 20 : action === 'demo' ? 15 : 10
      });
    }

    switch (action) {
      case 'signup':
        if (onSignup) {
          onSignup();
        } else {
          window.location.href = signupUrl;
        }
        break;
      
      case 'demo':
        if (onDemo) {
          onDemo();
        } else {
          // Default demo booking behavior
          window.open('https://calendly.com/contractnest-demo', '_blank');
        }
        break;
      
      case 'contact':
        if (onContact) {
          onContact();
        } else {
          // Default contact behavior
          window.location.href = 'mailto:charan@contractnest.com?subject=ContractNest Inquiry';
        }
        break;
      
      case 'video':
        if (onVideoPlay) {
          onVideoPlay('https://www.youtube.com/watch?v=demo-video');
        }
        break;
      
      case 'download':
        if (onDownload) {
          onDownload(optionId);
        }
        break;
    }
  };

  const handleResourceClick = (resource: any) => {
    // Track resource interaction
    if (typeof gtag !== 'undefined') {
      gtag('event', 'resource_click', {
        event_category: 'engagement',
        event_label: resource.id
      });
    }

    handleCTAClick(resource.action, resource.id);
  };

  return (
    <section ref={sectionRef} className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20 opacity-50"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Ready to Transform Your Business?
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Service Contract Success 
              <br />
              <span className="text-yellow-300">Starts Today</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Join forward-thinking businesses who have already transformed their service contract management 
              and are seeing <strong className="text-white">measurable results from day one.</strong>
            </p>

            {/* Urgency Element */}
            <div className="flex justify-center mb-8">
              <UrgencyElements 
                variant="limited-spots" 
                autoShow={true}
                className="bg-white bg-opacity-20 backdrop-blur-sm"
                onTrigger={(event, data) => {
                  console.log('Final CTA urgency triggered:', event, data);
                }}
              />
            </div>
          </div>
        </div>

        {/* Main CTA Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {ctaOptions.map((option, index) => (
            <CTAOptionCard
              key={option.id}
              option={option}
              onClick={() => handleCTAClick(option.action, option.id)}
              isVisible={isVisible}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Social Proof Metrics */}
        <div className="mb-16">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join the Growing Community of Success Stories
            </h3>
            <p className="text-red-100 max-w-2xl mx-auto">
              These metrics represent real businesses seeing real results with ContractNest
            </p>
          </div>
          
          <SocialProofSection isVisible={isVisible} />
        </div>

        {/* Additional Resources */}
        <div className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Not Ready to Start? Explore More Resources
            </h3>
            <p className="text-red-100">
              Learn more about service contract management and see ContractNest in action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <button
                key={resource.id}
                onClick={() => handleResourceClick(resource)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center text-white group-hover:bg-opacity-40 transition-all">
                    {resource.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-red-100 group-hover:text-white transition-colors">
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-red-200 group-hover:text-white transition-colors ml-auto" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Guarantee & Trust Signals */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-300" />
                </div>
                <h4 className="font-semibold text-white mb-2">First 10 Contracts Free</h4>
                <p className="text-sm text-red-100">No credit card required</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-300" />
                </div>
                <h4 className="font-semibold text-white mb-2">Enterprise Security</h4>
                <p className="text-sm text-red-100">Bank-level encryption</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-300" />
                </div>
                <h4 className="font-semibold text-white mb-2">Setup in Minutes</h4>
                <p className="text-sm text-red-100">Not months or weeks</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-yellow-300" />
                </div>
                <h4 className="font-semibold text-white mb-2">24/7 Support</h4>
                <p className="text-sm text-red-100">Always here to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Push */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-gray-900">
            <div className="flex items-center justify-center mb-6">
              <Timer className="h-8 w-8 text-gray-800 mr-3" />
              <h3 className="text-2xl md:text-3xl font-bold">
                Limited Time: Early Adopter Benefits
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Gift className="h-5 w-5 text-gray-700" />
                <span className="font-medium">50% off regular pricing</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Target className="h-5 w-5 text-gray-700" />
                <span className="font-medium">Priority onboarding</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5 text-gray-700" />
                <span className="font-medium">Direct founder access</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={() => handleCTAClick('signup', 'final_cta')}
                className="bg-gray-900 hover:bg-gray-800 text-white text-xl px-12 py-6 shadow-2xl"
                size="xl"
              >
                <Rocket className="mr-3 h-6 w-6" />
                Claim Your Early Adopter Spot
                <Sparkles className="ml-3 h-6 w-6" />
              </Button>
            </div>

            <p className="text-sm text-gray-700 mt-4">
              ⚡ Setup takes less than 5 minutes • 🚀 Start seeing results immediately
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className={`text-center mt-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
            <h4 className="font-semibold text-white mb-4">
              Questions? We're Here to Help
            </h4>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <a 
                href="mailto:charan@contractnest.com"
                className="flex items-center space-x-2 text-red-100 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>charan@contractnest.com</span>
              </a>
              
              <a 
                href="tel:+919949701175"
                className="flex items-center space-x-2 text-red-100 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+91-9949701175</span>
              </a>
              
              <button
                onClick={() => handleCTAClick('demo', 'contact_demo')}
                className="flex items-center space-x-2 text-red-100 hover:text-white transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Schedule a Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => handleCTAClick('signup', 'floating_cta')}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 shadow-2xl animate-bounce"
          size="lg"
        >
          <Rocket className="mr-2 h-5 w-5" />
          Start Free
        </Button>
      </div>
    </section>
  );
};

export default LandingCTA;