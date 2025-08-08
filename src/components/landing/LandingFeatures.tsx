// src/components/landing/LandingFeatures.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText,
  Bell,
  IndianRupee,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Smartphone,
  Globe,
  Database,
  Settings,
  Mail,
  Calendar,
  FileCheck,
  TrendingUp,
  Eye,
  Lock,
  Workflow,
  MessageSquare,
  Download
} from 'lucide-react';

// Types
interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  color: 'red' | 'blue' | 'green' | 'purple' | 'orange';
  category: 'core' | 'automation' | 'collaboration' | 'analytics';
}

interface IndustryUseCase {
  industry: string;
  icon: React.ReactNode;
  title: string;
  scenario: string;
  solution: string;
  result: string;
}

interface FeaturesProps {
  onDemoRequest?: () => void;
  className?: string;
}

// Mock Button component
const Button = ({ children, className = '', variant = 'primary', onClick, ...props }) => {
  const baseClass = 'inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500'
  };
  
  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  feature, 
  isVisible,
  delay = 0 
}: { 
  feature: Feature;
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

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-500',
      accent: 'bg-red-500',
      hover: 'hover:bg-red-100'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-500',
      accent: 'bg-blue-500',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-500',
      accent: 'bg-green-500',
      hover: 'hover:bg-green-100'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-500',
      accent: 'bg-purple-500',
      hover: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-500',
      accent: 'bg-orange-500',
      hover: 'hover:bg-orange-100'
    }
  };

  const colors = colorClasses[feature.color];

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${colors.hover} transition-all duration-300 hover:shadow-lg group ${shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Feature Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className={`flex-shrink-0 w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center ${colors.icon} group-hover:scale-110 transition-transform`}>
          {feature.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Benefits List */}
      <div className="space-y-2">
        {feature.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center text-sm text-gray-700">
            <div className={`w-1.5 h-1.5 ${colors.accent} rounded-full mr-3 flex-shrink-0`}></div>
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Industry Use Case Component
const UseCaseCard = ({ 
  useCase, 
  isVisible,
  delay = 0 
}: { 
  useCase: IndustryUseCase;
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

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 ${shouldAnimate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 mr-3">
          {useCase.icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{useCase.industry}</h4>
          <p className="text-sm text-gray-600">{useCase.title}</p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-red-600">Challenge:</span>
          <p className="text-gray-700 mt-1">{useCase.scenario}</p>
        </div>
        
        <div>
          <span className="font-medium text-blue-600">Solution:</span>
          <p className="text-gray-700 mt-1">{useCase.solution}</p>
        </div>
        
        <div>
          <span className="font-medium text-green-600">Result:</span>
          <p className="text-gray-700 mt-1">{useCase.result}</p>
        </div>
      </div>
    </div>
  );
};

const LandingFeatures: React.FC<FeaturesProps> = ({ 
  onDemoRequest,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('core');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Track features section view
          if (typeof gtag !== 'undefined') {
            gtag('event', 'features_section_view', {
              event_category: 'engagement',
              event_label: 'solution_features'
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

  // Core features that solve the main problems
  const coreFeatures: Feature[] = [
    {
      id: 'digital-contracts',
      icon: <FileText className="h-6 w-6" />,
      title: 'Digital Contract Creation',
      description: 'Transform paper-based service agreements into intelligent digital contracts with built-in workflows and automated events.',
      benefits: [
        'Industry-specific templates for healthcare, manufacturing, consulting',
        'Drag-and-drop contract builder with legal compliance',
        'Version control and approval workflows',
        'Digital signatures with legal validity'
      ],
      color: 'red',
      category: 'core'
    },
    {
      id: 'compliance-alerts',
      icon: <Bell className="h-6 w-6" />,
      title: 'Automated Compliance Tracking',
      description: 'Never miss an SLA deadline or compliance requirement with intelligent monitoring and proactive notifications.',
      benefits: [
        'Real-time SLA monitoring with escalation alerts',
        'Regulatory compliance tracking (HIPAA, ISO, etc.)',
        'Automated milestone reminders and deadlines',
        'Custom alert rules for different stakeholders'
      ],
      color: 'blue',
      category: 'automation'
    },
    {
      id: 'smart-invoicing',
      icon: <IndianRupee className="h-6 w-6" />,
      title: 'Milestone-Based Invoicing',
      description: 'Automatically generate and send invoices based on completed service milestones and contract terms.',
      benefits: [
        'Automated invoice generation on milestone completion',
        'Integration with popular accounting software',
        'Payment tracking and reminder systems',
        'Multi-currency and tax compliance support'
      ],
      color: 'green',
      category: 'automation'
    },
    {
      id: 'collaboration',
      icon: <Users className="h-6 w-6" />,
      title: 'Real-Time Collaboration',
      description: 'Enable seamless communication between service providers and recipients with shared workspaces and real-time updates.',
      benefits: [
        'Shared contract dashboards with role-based access',
        'Real-time messaging and file sharing',
        'Activity feeds and notification systems',
        'Mobile app for field service teams'
      ],
      color: 'purple',
      category: 'collaboration'
    }
  ];

  // Additional features by category
  const additionalFeatures: Feature[] = [
    {
      id: 'analytics',
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Performance Analytics',
      description: 'Comprehensive insights into contract performance, service delivery, and business metrics.',
      benefits: [
        'Contract performance dashboards',
        'SLA compliance reporting',
        'Revenue forecasting and trends',
        'Custom report builder'
      ],
      color: 'blue',
      category: 'analytics'
    },
    {
      id: 'integrations',
      icon: <Globe className="h-6 w-6" />,
      title: 'System Integrations',
      description: 'Connect with your existing business tools and systems for seamless workflow automation.',
      benefits: [
        'CRM integration (Salesforce, HubSpot)',
        'ERP connectivity (SAP, Oracle)',
        'Accounting software sync',
        'API access for custom integrations'
      ],
      color: 'orange',
      category: 'automation'
    }
  ];

  // Industry-specific use cases
  const useCases: IndustryUseCase[] = [
    {
      industry: 'Healthcare',
      icon: <Shield className="h-5 w-5" />,
      title: 'Medical Equipment AMC',
      scenario: 'Hospital managing ₹15L worth of CT-scan maintenance contracts with multiple vendors, struggling with manual tracking and compliance.',
      solution: 'Automated SLA monitoring, preventive maintenance scheduling, and real-time performance dashboards.',
      result: '95% SLA compliance achieved, 60% reduction in equipment downtime, automated billing saves 15 hours/month.'
    },
    {
      industry: 'Manufacturing',
      icon: <Settings className="h-5 w-5" />,
      title: 'Production Line Services',
      scenario: 'Factory with 25+ service contracts for HVAC, electrical, and machinery maintenance, facing coordination challenges.',
      solution: 'Centralized contract management, automated work order generation, and vendor performance tracking.',
      result: 'Reduced service response time by 40%, improved vendor accountability, eliminated contract disputes.'
    },
    {
      industry: 'Consulting',
      icon: <FileCheck className="h-5 w-5" />,
      title: 'Client Project Management',
      scenario: 'Consulting firm managing 50+ client engagements with milestone-based billing and deliverable tracking.',
      solution: 'Milestone automation, client collaboration portals, and transparent billing processes.',
      result: 'Faster client payments, 80% reduction in billing disputes, improved client satisfaction scores.'
    }
  ];

  const categories = [
    { id: 'core', label: 'Core Features', icon: <Zap className="h-4 w-4" /> },
    { id: 'automation', label: 'Automation', icon: <Settings className="h-4 w-4" /> },
    { id: 'collaboration', label: 'Collaboration', icon: <Users className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> }
  ];

  const allFeatures = [...coreFeatures, ...additionalFeatures];
  const filteredFeatures = allFeatures.filter(feature => feature.category === activeCategory);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    // Track category selection
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feature_category_select', {
        event_category: 'engagement',
        event_label: categoryId
      });
    }
  };

  const handleDemoClick = () => {
    if (onDemoRequest) {
      onDemoRequest();
    }
    
    // Track demo request from features
    if (typeof gtag !== 'undefined') {
      gtag('event', 'demo_request', {
        event_category: 'conversion',
        event_label: 'features_section',
        value: 10
      });
    }
  };

  return (
    <section ref={sectionRef} id="features" className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Solution
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How ContractNest Solves This
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Purpose-built for service businesses with automated workflows, compliance tracking, 
            and seamless collaboration between all stakeholders
          </p>
        </div>

        {/* Feature Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredFeatures.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              isVisible={isVisible}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Industry Use Cases */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Real-World Success Stories
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how ContractNest transforms service contract management across different industries
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <UseCaseCard
                key={index}
                useCase={useCase}
                isVisible={isVisible}
                delay={index * 300}
              />
            ))}
          </div>
        </div>

        {/* Integration Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Seamless Integration with Your Existing Tools
              </h3>
              <p className="text-gray-600 mb-6">
                ContractNest connects with your current business systems to create a unified workflow 
                without disrupting your established processes.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span>CRM Systems</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <IndianRupee className="h-4 w-4 text-green-500" />
                  <span>Accounting Software</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-purple-500" />
                  <span>Email Platforms</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span>Calendar Apps</span>
                </div>
              </div>
              
              <Button onClick={handleDemoClick}>
                See Integration Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Connected Systems</h4>
                  <div className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    All Systems Active
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Salesforce CRM</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <IndianRupee className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Tally ERP</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-medium">WhatsApp Business</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Service Contracts?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join forward-thinking businesses who have already digitized their service relationships 
            and are seeing measurable results.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button onClick={handleDemoClick} className="text-lg px-8 py-4">
              Get Personalized Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              <Download className="mr-2 h-5 w-5" />
              Download Feature Guide
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;