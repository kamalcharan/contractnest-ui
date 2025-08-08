// src/components/landing/LandingHero.tsx
import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Calculator,
  TrendingUp,
  IndianRupee,
  Heart,
  Settings,
  Building,
  Clock,
  Timer,
  Flame
} from 'lucide-react';

// Import existing components
import ValueCalculator from '../CRO/ValueCalculator';
import UrgencyElements from '../CRO/UrgencyElements';

// Types
interface Industry {
  id: string;
  name: string;
  description?: string;
  icon: string;
}

interface HeroProps {
  onSubmit?: (data: FormData) => void;
  onCalculatorOpen?: () => void;
  className?: string;
}

interface FormData {
  email: string;
  companyName: string;
  industry: string;
}

// Mock components
const Button = ({ children, className = '', variant = 'primary', onClick, disabled = false, ...props }) => {
  const baseClass = 'inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500'
  };
  
  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${className}`}
    {...props}
  />
);

const Badge = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    urgent: 'bg-red-50 text-red-700 border border-red-200'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ValueCalculator CTA Component
const ValueCalculatorCTA = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculate Your ROI</h3>
          <p className="text-sm text-gray-600">
            See how much ContractNest can save your business in the first year
          </p>
        </div>
        <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white">
          <Calculator className="mr-2 h-4 w-4" />
          Calculate Savings
        </Button>
      </div>
      <div className="mt-4 flex items-center space-x-4 text-sm text-blue-600">
        <span>⚡ 2-minute assessment</span>
        <span>📊 Industry benchmarks</span>
        <span>💡 Personalized insights</span>
      </div>
    </div>
  );
};

// Mock Dashboard Component
const MockDashboard = () => {
  return (
    <div className="relative">
      <div className="bg-gray-100 rounded-xl p-8 shadow-2xl">
        {/* Active Contracts Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Contracts</h3>
            <Badge variant="success">23 Active</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-sm">CT-Scan Maintenance</p>
                <p className="text-xs text-gray-500">City General Hospital</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">₹40L</p>
                <p className="text-xs text-gray-500">Next: Feb 15</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-sm">HVAC Maintenance</p>
                <p className="text-xs text-gray-500">Manufacturing Plant</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">₹2.1L</p>
                <p className="text-xs text-gray-500">Next: Feb 20</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Compliance Score Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Compliance Score</h3>
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
          </div>
        </div>
      </div>
      
      {/* Floating Success Elements */}
      <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border-2 border-green-100 animate-pulse">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">SLA Compliant</span>
        </div>
      </div>
      
      <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border-2 border-blue-100 animate-bounce">
        <div className="flex items-center space-x-2">
          <IndianRupee className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">Auto-invoiced</span>
        </div>
      </div>
    </div>
  );
};

const LandingHero: React.FC<HeroProps> = ({ 
  onSubmit,
  onCalculatorOpen,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Environment URLs
  const signupUrl = import.meta.env.VITE_SIGNUP_URL || 'http://localhost:5173/signup';

  // Mock industries - would be imported from constants
  const industries: Industry[] = [
    { id: 'healthcare', name: 'Healthcare', icon: 'Heart' },
    { id: 'manufacturing', name: 'Manufacturing', icon: 'Settings' },
    { id: 'pharma', name: 'Pharmaceutical', icon: 'Shield' },
    { id: 'consulting', name: 'Consulting', icon: 'Users' },
    { id: 'financial_services', name: 'Financial Services', icon: 'Building' }
  ];

  // Form submission handler
  const handleSubmit = async () => {
    if (!email || !companyName || !selectedIndustry) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    const formData: FormData = {
      email,
      companyName,
      industry: selectedIndustry
    };
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Track conversion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
          event_category: 'conversion',
          event_label: 'hero_signup',
          value: 1,
          custom_parameters: {
            industry: selectedIndustry,
            company: companyName
          }
        });
      }
      
      if (onSubmit) {
        onSubmit(formData);
      } else {
        // Default behavior - redirect to signup
        alert('Thank you! We\'ll be in touch soon for your personalized demo.');
        window.location.href = signupUrl;
      }
      
      // Reset form
      setEmail('');
      setCompanyName('');
      setSelectedIndustry('');
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculator modal handlers
  const handleCalculatorOpen = () => {
    setShowCalculator(true);
    
    if (onCalculatorOpen) {
      onCalculatorOpen();
    }
    
    // Track calculator open
    if (typeof gtag !== 'undefined') {
      gtag('event', 'calculator_open', {
        event_category: 'engagement',
        event_label: 'hero_calculator'
      });
    }
  };

  const handleCalculatorClose = () => {
    setShowCalculator(false);
  };

  return (
    <>
      <section className={`pt-8 pb-20 px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              {/* Urgency Elements */}
              <div className="mb-6 space-y-3">
                <Badge variant="urgent" className="animate-pulse">
                  🚀 Early Access Program - Limited Time
                </Badge>
                <UrgencyElements 
                  variant="limited-spots" 
                  autoShow={true}
                  onTrigger={(event, data) => {
                    console.log('Urgency triggered:', event, data);
                  }}
                />
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Turn Service Commitments Into 
                <span className="text-red-500"> Profitable Relationships</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform scattered service agreements into an automated, collaborative exchange. 
                From healthcare equipment maintenance to manufacturing service contracts - 
                <strong> digitize, automate, and scale your service relationships.</strong>
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  Enterprise Security
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-500 mr-2" />
                  500+ Businesses Exploring
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  HIPAA Ready
                </div>
              </div>

              {/* ValueCalculator CTA */}
              <div className="mb-8">
                <ValueCalculatorCTA onClick={handleCalculatorOpen} />
              </div>

              {/* Lead Capture Form */}
              <div className="max-w-md">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Business Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required
                  >
                    <option value="">Select Your Industry</option>
                    {industries.map(industry => (
                      <option key={industry.id} value={industry.id}>{industry.name}</option>
                    ))}
                  </select>
                  <Button 
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Get Personalized Demo'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Form Footer */}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  ✓ Free 30-min consultation ✓ No pressure, just insights ✓ First 10 contracts free
                </p>
              </div>
            </div>

            {/* Right: Visual Dashboard */}
            <div className="relative">
              <MockDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">ROI Calculator</h2>
                <button
                  onClick={handleCalculatorClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                <ValueCalculator />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Urgency */}
      <UrgencyElements 
        variant="exit-intent" 
        autoShow={false}
        onTrigger={(event, data) => {
          console.log('Exit intent triggered:', event, data);
          // Could redirect to signup or show special offer
        }}
      />
    </>
  );
};

export default LandingHero;