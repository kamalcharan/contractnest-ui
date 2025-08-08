// src/components/CRO/UrgencyElements.tsx
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  Zap, 
  AlertCircle, 
  X, 
  Calendar,
  TrendingUp,
  CheckCircle,
  Star,
  Timer,
  Bell
} from 'lucide-react';

const UrgencyElements = ({ 
  variant = 'countdown', // 'countdown', 'limited-spots', 'exit-intent', 'scarcity-banner', 'demo-slots'
  className = '',
  onTrigger = null,
  autoShow = true
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 45,
    seconds: 30
  });
  
  const [showElement, setShowElement] = useState(false);
  const [spotsRemaining, setSpotsRemaining] = useState(12);
  const [demoSlotsLeft, setDemoSlotsLeft] = useState(5);
  const [exitIntentShown, setExitIntentShown] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  // Countdown timer logic
  useEffect(() => {
    if (variant !== 'countdown') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [variant]);

  // Spots remaining simulation
  useEffect(() => {
    if (variant !== 'limited-spots') return;
    
    const spotsTimer = setInterval(() => {
      setSpotsRemaining(prev => {
        const newCount = prev - (Math.random() > 0.8 ? 1 : 0);
        return Math.max(newCount, 3); // Never go below 3
      });
    }, 45000); // Decrease every 45 seconds
    
    return () => clearInterval(spotsTimer);
  }, [variant]);

  // Demo slots simulation
  useEffect(() => {
    if (variant !== 'demo-slots') return;
    
    const slotsTimer = setInterval(() => {
      setDemoSlotsLeft(prev => {
        const newCount = prev - (Math.random() > 0.7 ? 1 : 0);
        return Math.max(newCount, 1); // Never go below 1
      });
    }, 60000); // Decrease every minute
    
    return () => clearInterval(slotsTimer);
  }, [variant]);

  // Exit intent detection
  useEffect(() => {
    if (variant !== 'exit-intent') return;
    
    const handleMouseMove = (e) => {
      setMouseY(e.clientY);
    };
    
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !exitIntentShown && mouseY > 50) {
        setShowElement(true);
        setExitIntentShown(true);
        
        if (onTrigger) {
          onTrigger('exit-intent-triggered');
        }
        
        // Track exit intent
        if (typeof gtag !== 'undefined') {
          gtag('event', 'exit_intent', {
            event_category: 'urgency',
            event_label: 'exit_intent_popup'
          });
        }
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [variant, exitIntentShown, mouseY, onTrigger]);

  // Auto-show logic for other variants
  useEffect(() => {
    if (!autoShow || variant === 'exit-intent') return;
    
    const showTimer = setTimeout(() => {
      setShowElement(true);
    }, variant === 'scarcity-banner' ? 2000 : 5000);
    
    return () => clearTimeout(showTimer);
  }, [autoShow, variant]);

  const handleClose = () => {
    setShowElement(false);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'urgency_element_closed', {
        event_category: 'urgency',
        event_label: variant
      });
    }
  };

  const handleCTAClick = () => {
    if (onTrigger) {
      onTrigger('urgency-cta-clicked', { variant, spotsRemaining, demoSlotsLeft });
    }
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'urgency_cta_click', {
        event_category: 'conversion',
        event_label: variant,
        value: variant === 'exit-intent' ? 10 : 5
      });
    }
  };

  // Countdown Timer Component
  const CountdownTimer = () => (
    <div className={`bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg shadow-lg ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <Timer className="h-5 w-5 mr-2" />
          <span className="font-semibold text-lg">Early Access Ends In:</span>
        </div>
        
        <div className="flex justify-center space-x-4 mb-4">
          <div className="text-center">
            <div className="bg-white text-red-600 font-bold text-2xl px-3 py-2 rounded">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">DAYS</div>
          </div>
          <div className="text-center">
            <div className="bg-white text-red-600 font-bold text-2xl px-3 py-2 rounded">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">HRS</div>
          </div>
          <div className="text-center">
            <div className="bg-white text-red-600 font-bold text-2xl px-3 py-2 rounded">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">MIN</div>
          </div>
          <div className="text-center">
            <div className="bg-white text-red-600 font-bold text-2xl px-3 py-2 rounded">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">SEC</div>
          </div>
        </div>
        
        <p className="text-sm mb-4">
          🔥 Lock in founding member pricing before it expires
        </p>
        
        <button
          onClick={handleCTAClick}
          className="bg-white text-red-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition-colors"
        >
          Claim Your Spot Now
        </button>
      </div>
    </div>
  );

  // Limited Spots Component
  const LimitedSpots = () => (
    <div className={`bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg shadow-sm ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Users className="h-5 w-5 text-orange-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-orange-800">
            Limited Beta Access
          </h3>
          <div className="mt-2 text-sm text-orange-700">
            <p className="mb-2">
              Only <span className="font-bold text-lg">{spotsRemaining}</span> spots remaining in our early access program
            </p>
            
            {/* Progress bar */}
            <div className="w-full bg-orange-200 rounded-full h-2 mb-3">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((20 - spotsRemaining) / 20) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs">
                ⚡ 3 businesses joined in the last hour
              </span>
              <button
                onClick={handleCTAClick}
                className="bg-orange-500 text-white text-sm font-medium px-4 py-1 rounded hover:bg-orange-600 transition-colors"
              >
                Reserve My Spot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Exit Intent Modal
  const ExitIntentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Wait! Don't Miss Out
            </h2>
            <p className="text-gray-600">
              Get your free consultation before you leave. See exactly how ContractNest can transform your service contracts.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Free 30-minute consultation
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Personalized demo for your industry
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              No pressure, just insights
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleCTAClick}
              className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Yes, Get My Free Consultation
            </button>
            <button
              onClick={handleClose}
              className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              No thanks, I'll figure it out myself
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Scarcity Banner
  const ScarcityBanner = () => (
    <div className={`bg-yellow-400 text-black py-2 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            🔥 High demand: 47 demos scheduled this week • Only {demoSlotsLeft} slots left today
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCTAClick}
            className="bg-black text-yellow-400 text-sm font-medium px-4 py-1 rounded hover:bg-gray-800 transition-colors"
          >
            Book Now
          </button>
          <button
            onClick={handleClose}
            className="text-black hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Demo Slots Component
  const DemoSlots = () => (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Calendar className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Demo Availability Today
          </h3>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-600">Booked</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1 mb-3">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`h-6 rounded text-xs flex items-center justify-center ${
                  i < (12 - demoSlotsLeft) 
                    ? 'bg-red-200 text-red-800' 
                    : 'bg-green-200 text-green-800'
                }`}
              >
                {9 + i}:00
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              <span className="font-semibold">{demoSlotsLeft}</span> slots remaining
            </span>
            <button
              onClick={handleCTAClick}
              className="bg-blue-500 text-white text-sm font-medium px-4 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              Book Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Floating Action Button
  const FloatingUrgency = () => (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="bg-red-500 text-white p-4 rounded-full shadow-lg animate-pulse">
        <div className="flex items-center space-x-3">
          <Zap className="h-5 w-5" />
          <div className="text-sm">
            <div className="font-semibold">Early Access</div>
            <div className="text-xs opacity-90">{spotsRemaining} spots left</div>
          </div>
          <button
            onClick={handleCTAClick}
            className="bg-white text-red-500 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'countdown':
      return showElement || autoShow ? <CountdownTimer /> : null;
      
    case 'limited-spots':
      return showElement || autoShow ? <LimitedSpots /> : null;
      
    case 'exit-intent':
      return showElement ? <ExitIntentModal /> : null;
      
    case 'scarcity-banner':
      return showElement ? <ScarcityBanner /> : null;
      
    case 'demo-slots':
      return showElement || autoShow ? <DemoSlots /> : null;
      
    case 'floating':
      return showElement || autoShow ? <FloatingUrgency /> : null;
      
    default:
      return null;
  }
};

// Multi-variant urgency component
export const UrgencyStack = ({ 
  variants = ['scarcity-banner', 'limited-spots'],
  onTrigger = null,
  className = ''
}) => {
  const [activeVariants, setActiveVariants] = useState([]);
  
  useEffect(() => {
    // Stagger the appearance of different urgency elements
    variants.forEach((variant, index) => {
      setTimeout(() => {
        setActiveVariants(prev => [...prev, variant]);
      }, index * 3000);
    });
  }, [variants]);
  
  return (
    <div className={`space-y-4 ${className}`}>
      {activeVariants.map((variant, index) => (
        <UrgencyElements
          key={`${variant}-${index}`}
          variant={variant}
          onTrigger={onTrigger}
          autoShow={true}
        />
      ))}
    </div>
  );
};

export default UrgencyElements;