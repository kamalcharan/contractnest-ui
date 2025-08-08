// src/components/CRO/TrustSignals.tsx
import React, { useState, useEffect } from 'react';
import { Shield, Award, Users, CheckCircle, Star, Clock, Lock, Zap } from 'lucide-react';
import { useCRO } from '../../hooks/useCRO';

interface TrustSignal {
  id: string;
  type: 'security' | 'social_proof' | 'guarantee' | 'certification' | 'performance';
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  verified?: boolean;
}

interface TrustSignalsProps {
  variant?: 'horizontal' | 'vertical' | 'compact' | 'banner';
  showAll?: boolean;
  maxItems?: number;
  className?: string;
  animated?: boolean;
}

const trustSignalsData: TrustSignal[] = [
  {
    id: 'security',
    type: 'security',
    icon: <Shield className="w-6 h-6" />,
    title: 'Bank-Level Security',
    description: 'Your contract data is protected with enterprise-grade encryption',
    badge: 'ISO 27001',
    verified: true
  },
  {
    id: 'uptime',
    type: 'performance',
    icon: <Zap className="w-6 h-6" />,
    title: '99.9% Uptime SLA',
    description: 'Reliable service with guaranteed availability',
    verified: true
  },
  {
    id: 'users',
    type: 'social_proof',
    icon: <Users className="w-6 h-6" />,
    title: '500+ Active Users',
    description: 'Trusted by businesses across India',
    verified: true
  },
  {
    id: 'compliance',
    type: 'certification',
    icon: <Award className="w-6 h-6" />,
    title: 'GDPR Compliant',
    description: 'Full compliance with data privacy regulations',
    badge: 'Certified',
    verified: true
  },
  {
    id: 'support',
    type: 'guarantee',
    icon: <Clock className="w-6 h-6" />,
    title: '24/7 Support',
    description: 'Round-the-clock assistance when you need it',
    verified: true
  },
  {
    id: 'money_back',
    type: 'guarantee',
    icon: <CheckCircle className="w-6 h-6" />,
    title: '30-Day Money Back',
    description: 'Full refund if not completely satisfied',
    verified: true
  }
];

const TrustSignals: React.FC<TrustSignalsProps> = ({
  variant = 'horizontal',
  showAll = false,
  maxItems = 4,
  className = '',
  animated = true
}) => {
  const [visibleItems, setVisibleItems] = useState<TrustSignal[]>([]);
  const { trackConversion } = useCRO();

  useEffect(() => {
    const items = showAll ? trustSignalsData : trustSignalsData.slice(0, maxItems);
    setVisibleItems(items);
  }, [showAll, maxItems]);

  const handleTrustSignalClick = (signalId: string) => {
    trackConversion({
      eventName: 'trust_signal_click',
      eventCategory: 'engagement',
      eventLabel: signalId,
      customParameters: {
        trust_signal_type: signalId,
        variant: variant
      }
    });
  };

  const getContainerStyles = () => {
    const styles = {
      horizontal: 'flex flex-wrap justify-center items-center gap-6 lg:gap-8',
      vertical: 'space-y-4',
      compact: 'flex flex-wrap justify-center gap-4',
      banner: 'flex items-center justify-center space-x-8 bg-gray-50 py-4 px-6 rounded-lg'
    };
    return `${styles[variant]} ${className}`;
  };

  const getItemStyles = () => {
    const styles = {
      horizontal: 'flex flex-col items-center text-center max-w-xs',
      vertical: 'flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow',
      compact: 'flex items-center space-x-2 bg-white px-3 py-2 rounded-full border border-gray-200',
      banner: 'flex items-center space-x-2 text-sm'
    };
    return styles[variant];
  };

  if (variant === 'banner') {
    return (
      <div className={getContainerStyles()}>
        {visibleItems.map((signal, index) => (
          <div 
            key={signal.id} 
            className={`${getItemStyles()} ${animated ? 'animate-fadeIn' : ''}`}
            style={animated ? { animationDelay: `${index * 0.1}s` } : {}}
            onClick={() => handleTrustSignalClick(signal.id)}
          >
            <div className="text-green-500">{signal.icon}</div>
            <span className="font-medium text-gray-700">{signal.title}</span>
            {signal.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={getContainerStyles()}>
      {visibleItems.map((signal, index) => (
        <div 
          key={signal.id} 
          className={`${getItemStyles()} ${animated ? 'animate-fadeIn' : ''} cursor-pointer`}
          style={animated ? { animationDelay: `${index * 0.1}s` } : {}}
          onClick={() => handleTrustSignalClick(signal.id)}
        >
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-3">
              {signal.icon}
            </div>
          </div>
          
          <div className={variant === 'vertical' ? 'flex-1' : ''}>
            <div className="flex items-center justify-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900">{signal.title}</h3>
              {signal.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
            
            {signal.badge && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                {signal.badge}
              </span>
            )}
            
            {variant !== 'compact' && (
              <p className="text-sm text-gray-600">{signal.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// src/components/CRO/SocialProof.tsx
interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  industry?: string;
  verified: boolean;
  contractsSaved?: number;
  timeSaved?: string;
}

interface SocialProofProps {
  variant?: 'testimonials' | 'logos' | 'stats' | 'reviews' | 'combined';
  showRatings?: boolean;
  showImages?: boolean;
  maxItems?: number;
  autoRotate?: boolean;
  className?: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    title: 'Operations Director',
    company: 'MedTech Solutions',
    industry: 'Healthcare',
    content: 'ContractNest transformed our equipment maintenance contracts. We reduced compliance tracking time by 75% and never miss SLA deadlines anymore.',
    rating: 5,
    verified: true,
    contractsSaved: 45,
    timeSaved: '15 hours/week'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    title: 'CFO',
    company: 'CoolAir HVAC',
    industry: 'HVAC',
    content: 'Our receivables cycle improved by 40 days after implementing ContractNest. Customers love the transparency and automated reminders.',
    rating: 5,
    verified: true,
    contractsSaved: 120,
    timeSaved: '20 hours/week'
  },
  {
    id: '3',
    name: 'Amit Patel',
    title: 'Founder',
    company: 'TechServe Consultancy',
    industry: 'Consulting',
    content: 'From 2 hours daily admin work to just 15 minutes. Now I focus on clients, not chasing payments. ContractNest is a game-changer.',
    rating: 5,
    verified: true,
    contractsSaved: 78,
    timeSaved: '1.5 hours/day'
  },
  {
    id: '4',
    name: 'Dr. Sunita Reddy',
    title: 'Hospital Administrator',
    company: 'Apollo Hospitals',
    industry: 'Healthcare',
    content: 'Managing 200+ service contracts across departments became effortless. The compliance reporting feature is excellent for regulatory audits.',
    rating: 5,
    verified: true,
    contractsSaved: 200,
    timeSaved: '25 hours/week'
  }
];

const companyLogos = [
  { name: 'MedTech Solutions', logo: '/logos/medtech.png' },
  { name: 'CoolAir HVAC', logo: '/logos/coolair.png' },
  { name: 'TechServe Consultancy', logo: '/logos/techserve.png' },
  { name: 'Apollo Hospitals', logo: '/logos/apollo.png' },
  { name: 'IndusCore Manufacturing', logo: '/logos/induscore.png' },
  { name: 'ServiceMax Solutions', logo: '/logos/servicemax.png' }
];

const SocialProof: React.FC<SocialProofProps> = ({
  variant = 'testimonials',
  showRatings = true,
  showImages = false,
  maxItems = 3,
  autoRotate = false,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([]);
  const { trackConversion } = useCRO();

  useEffect(() => {
    setVisibleTestimonials(testimonialsData.slice(0, maxItems));
  }, [maxItems]);

  useEffect(() => {
    if (autoRotate && variant === 'testimonials') {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % visibleTestimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRotate, variant, visibleTestimonials.length]);

  const handleTestimonialClick = (testimonialId: string) => {
    trackConversion({
      eventName: 'testimonial_click',
      eventCategory: 'social_proof',
      eventLabel: testimonialId,
      customParameters: {
        testimonial_id: testimonialId,
        variant: variant
      }
    });
  };

  if (variant === 'logos') {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-gray-600 mb-8">Trusted by leading businesses across India</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-80 transition-opacity">
          {companyLogos.map((company, index) => (
            <div key={index} className="h-12 w-24 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'stats') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 text-center ${className}`}>
        <div>
          <div className="text-3xl font-bold text-red-600">500+</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-600">10,000+</div>
          <div className="text-sm text-gray-600">Contracts Managed</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-600">75%</div>
          <div className="text-sm text-gray-600">Time Saved</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-600">₹50L+</div>
          <div className="text-sm text-gray-600">Revenue Tracked</div>
        </div>
      </div>
    );
  }

  if (variant === 'reviews') {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex items-center justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-2 text-lg font-semibold">4.9/5</span>
        </div>
        <p className="text-gray-600">
          Rated excellent by <strong>150+</strong> verified users
        </p>
      </div>
    );
  }

  // Testimonials variant
  const currentTestimonial = autoRotate ? visibleTestimonials[currentIndex] : null;
  const displayTestimonials = autoRotate ? [currentTestimonial].filter(Boolean) : visibleTestimonials;

  return (
    <div className={className}>
      {variant === 'combined' && (
        <div className="mb-8">
          <SocialProof variant="reviews" />
        </div>
      )}
      
      <div className={autoRotate ? 'relative' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {displayTestimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
              autoRotate ? 'animate-fadeIn' : ''
            }`}
            onClick={() => handleTestimonialClick(testimonial.id)}
          >
            {/* Rating */}
            {showRatings && (
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {testimonial.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                )}
              </div>
            )}

            {/* Content */}
            <blockquote className="text-gray-700 mb-6 italic">
              "{testimonial.content}"
            </blockquote>

            {/* Stats */}
            {(testimonial.contractsSaved || testimonial.timeSaved) && (
              <div className="bg-red-50 p-3 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  {testimonial.contractsSaved && (
                    <div>
                      <div className="font-bold text-red-600">{testimonial.contractsSaved}</div>
                      <div className="text-xs text-gray-600">Contracts Managed</div>
                    </div>
                  )}
                  {testimonial.timeSaved && (
                    <div>
                      <div className="font-bold text-red-600">{testimonial.timeSaved}</div>
                      <div className="text-xs text-gray-600">Time Saved</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="flex items-center">
              {showImages && testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              {!showImages && (
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">
                  {testimonial.title}, {testimonial.company}
                </div>
                {testimonial.industry && (
                  <div className="text-xs text-red-600 font-medium">
                    {testimonial.industry}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots for auto-rotate */}
      {autoRotate && visibleTestimonials.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {visibleTestimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-red-500' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {variant === 'combined' && (
        <div className="mt-8">
          <SocialProof variant="logos" />
        </div>
      )}
    </div>
  );
};

// Urgency Elements Component
interface UrgencyElementProps {
  type?: 'scarcity' | 'time_limited' | 'social_proof' | 'exclusive';
  message?: string;
  countdown?: Date;
  visitorCount?: number;
  signupCount?: number;
  className?: string;
}

export const UrgencyElement: React.FC<UrgencyElementProps> = ({
  type = 'social_proof',
  message,
  countdown,
  visitorCount = 47,
  signupCount = 12,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { trackConversion } = useCRO();

  useEffect(() => {
    if (type === 'time_limited' && countdown) {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdown.getTime() - now;
        
        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('Expired');
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [type, countdown]);

  const handleUrgencyClick = () => {
    trackConversion({
      eventName: 'urgency_element_click',
      eventCategory: 'conversion',
      eventLabel: type,
      customParameters: {
        urgency_type: type,
        message: message
      }
    });
  };

  const getUrgencyContent = () => {
    switch (type) {
      case 'scarcity':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertCircle className="w-4 h-4" />,
          text: message || `Only ${10 - signupCount} early access spots remaining`
        };
      case 'time_limited':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <Clock className="w-4 h-4" />,
          text: message || `Limited time offer ends in ${timeLeft}`
        };
      case 'social_proof':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <Users className="w-4 h-4" />,
          text: message || `${visitorCount} people viewing this page • ${signupCount} signed up today`
        };
      case 'exclusive':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <Star className="w-4 h-4" />,
          text: message || 'Exclusive early access - invitation only'
        };
      default:
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <CheckCircle className="w-4 h-4" />,
          text: message || 'Limited availability'
        };
    }
  };

  const urgencyContent = getUrgencyContent();

  return (
    <div 
      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer hover:shadow-md transition-all ${urgencyContent.color} ${className}`}
      onClick={handleUrgencyClick}
    >
      {urgencyContent.icon}
      <span>{urgencyContent.text}</span>
    </div>
  );
};

export { TrustSignals, SocialProof };
export default TrustSignals;