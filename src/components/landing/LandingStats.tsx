// src/components/landing/LandingStats.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle,
  Clock,
  FileX,
  TrendingDown,
  Eye,
  Users,
  Building,
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Calculator
} from 'lucide-react';

// Types
interface StatItem {
  number: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: 'red' | 'orange' | 'yellow' | 'blue';
  source?: string;
}

interface StatsProps {
  onCalculatorOpen?: () => void;
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

// Animated Counter Component
const AnimatedCounter = ({ 
  end, 
  duration = 2000,
  isVisible = false,
  suffix = '',
  prefix = ''
}: { 
  end: number;
  duration?: number;
  isVisible?: boolean;
  suffix?: string;
  prefix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [end, duration, isVisible]);

  return <span>{prefix}{count}{suffix}</span>;
};

// Individual Stat Card Component
const StatCard = ({ 
  stat, 
  isVisible,
  delay = 0 
}: { 
  stat: StatItem;
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
      border: 'border-red-200',
      icon: 'text-red-500',
      number: 'text-red-600',
      hover: 'hover:bg-red-100'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-500',
      number: 'text-orange-600',
      hover: 'hover:bg-orange-100'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      number: 'text-yellow-700',
      hover: 'hover:bg-yellow-100'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      number: 'text-blue-600',
      hover: 'hover:bg-blue-100'
    }
  };

  const colors = colorClasses[stat.color];

  // Extract number and suffix for animation
  const numberMatch = stat.number.match(/(\d+)/);
  const number = numberMatch ? parseInt(numberMatch[1]) : 0;
  const suffix = stat.number.replace(number.toString(), '');

  return (
    <div className={`${colors.bg} ${colors.border} ${colors.hover} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg group cursor-pointer`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center ${colors.icon} group-hover:scale-110 transition-transform`}>
          {stat.icon}
        </div>
        {stat.source && (
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {stat.source}
          </span>
        )}
      </div>
      
      <div className={`text-3xl md:text-4xl font-bold ${colors.number} mb-2`}>
        <AnimatedCounter 
          end={number}
          isVisible={shouldAnimate}
          suffix={suffix}
          duration={1500}
        />
      </div>
      
      <div className="text-sm font-semibold text-gray-800 mb-2">
        {stat.label}
      </div>
      
      <div className="text-xs text-gray-600 leading-relaxed">
        {stat.description}
      </div>
    </div>
  );
};

const LandingStats: React.FC<StatsProps> = ({ 
  onCalculatorOpen,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Track stats section view
          if (typeof gtag !== 'undefined') {
            gtag('event', 'stats_section_view', {
              event_category: 'engagement',
              event_label: 'problem_stats'
            });
          }
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Stats data based on industry research
  const problemStats: StatItem[] = [
    {
      number: '65%',
      label: 'Not Digitized',
      description: 'Service contracts still managed manually through Excel, email, and paper documents',
      icon: <FileX className="h-6 w-6" />,
      color: 'red',
      source: 'Industry Study'
    },
    {
      number: '50%',
      label: 'SLA Breaches',
      description: 'Service level agreements missed due to poor tracking and communication gaps',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'red',
      source: 'Customer Data'
    },
    {
      number: '2.5',
      label: 'Hours Daily',
      description: 'Average time spent on manual contract administration and compliance tracking',
      icon: <Clock className="h-6 w-6" />,
      color: 'orange',
      source: 'Time Study'
    },
    {
      number: '90%',
      label: 'No Visibility',
      description: 'Businesses lack real-time insights into contract performance and service delivery',
      icon: <Eye className="h-6 w-6" />,
      color: 'yellow',
      source: 'Survey Data'
    }
  ];

  // Success metrics for comparison
  const successStats = [
    { number: '70%', label: 'Time Reduction', icon: <Zap className="h-5 w-5" /> },
    { number: '95%', label: 'SLA Compliance', icon: <CheckCircle className="h-5 w-5" /> },
    { number: '500+', label: 'Businesses Exploring', icon: <Building className="h-5 w-5" /> },
    { number: '₹50+ Cr', label: 'Contracts in Pipeline', icon: <BarChart3 className="h-5 w-5" /> }
  ];

  const handleCalculatorClick = () => {
    if (onCalculatorOpen) {
      onCalculatorOpen();
    }
    
    // Track calculator CTA click from stats
    if (typeof gtag !== 'undefined') {
      gtag('event', 'calculator_cta_click', {
        event_category: 'conversion',
        event_label: 'stats_section',
        value: 5
      });
    }
  };

  return (
    <section ref={sectionRef} className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingDown className="h-4 w-4 mr-2" />
            Current Industry Reality
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Problem with Service Contracts Today
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Based on industry research and real customer feedback from healthcare, manufacturing, 
            and consulting businesses across India
          </p>
        </div>
        
        {/* Problem Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {problemStats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              isVisible={isVisible}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Impact Statement */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              The Real Cost of Manual Contract Management
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              For a business managing 50 service contracts, these inefficiencies translate to significant losses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600 mb-2">
                <AnimatedCounter end={125} isVisible={isVisible} suffix=" hrs" />
              </div>
              <div className="text-sm text-gray-600">
                Lost per month to manual processes
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-2">
                <AnimatedCounter end={25} isVisible={isVisible} suffix=" SLAs" />
              </div>
              <div className="text-sm text-gray-600">
                Breached due to poor tracking
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-700 mb-2">
                ₹<AnimatedCounter end={5} isVisible={isVisible} suffix="L+" />
              </div>
              <div className="text-sm text-gray-600">
                Annual cost of inefficiencies
              </div>
            </div>
          </div>
        </div>

        {/* Solution Preview */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              ContractNest Solution
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What ContractNest Users Experience
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {successStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <div className="text-green-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    <AnimatedCounter 
                      end={parseInt(stat.number.replace(/[^\d]/g, ''))}
                      isVisible={isVisible}
                      suffix={stat.number.replace(/\d+/g, '')}
                      duration={2000}
                    />
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button onClick={handleCalculatorClick} className="bg-green-600 hover:bg-green-700">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Your Savings
              </Button>
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white">
                See How It Works
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            📊 Data sources: Industry surveys, customer interviews, and time-motion studies across 
            <span className="font-semibold"> 200+ service businesses</span> in India
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingStats;