// src/components/CRO/UrgencyElements.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Users, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { UrgencyConfig } from '../../types/cro.types';
import { useCRO } from '../../hooks/useCRO';

interface UrgencyElementProps {
  config: UrgencyConfig;
  onInteraction?: (action: string) => void;
  className?: string;
  autoHide?: boolean;
  hideDelay?: number; // milliseconds
}

// Base Urgency Element Component
export const UrgencyElement: React.FC<UrgencyElementProps> = ({
  config,
  onInteraction,
  className = '',
  autoHide = false,
  hideDelay = 10000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [visitorCount, setVisitorCount] = useState(0);
  const { trackConversion } = useCRO();

  // Initialize timer for time-limited urgency
  useEffect(() => {
    if (config.trigger?.type === 'timer' && config.trigger.value instanceof Date) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const targetTime = config.trigger!.value.getTime();
        const difference = targetTime - now;

        if (difference > 0) {
          setTimeLeft(difference);
        } else {
          setTimeLeft(0);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [config.trigger]);

  // Initialize visitor count
  useEffect(() => {
    if (config.trigger?.type === 'visitor_count') {
      // Simulate realistic visitor count with some randomness
      const baseCount = typeof config.trigger.value === 'number' ? config.trigger.value : 47;
      const randomVariation = Math.floor(Math.random() * 10) - 5; // ±5 variation
      setVisitorCount(Math.max(1, baseCount + randomVariation));

      // Increment occasionally to show activity
      const interval = setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every 30 seconds
          setVisitorCount(prev => prev + 1);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [config.trigger]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay]);

  // Handle user interaction
  const handleInteraction = useCallback((action: string) => {
    trackConversion({
      eventName: 'urgency_interaction',
      eventCategory: 'urgency',
      eventLabel: `${config.type}_${action}`,
      customParameters: {
        urgency_type: config.type,
        urgency_style: config.style,
        action: action
      }
    });

    onInteraction?.(action);

    if (action === 'dismiss') {
      setIsVisible(false);
    }
  }, [config.type, config.style, onInteraction, trackConversion]);

  // Format time remaining
  const formatTimeLeft = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Get icon based on urgency type
  const getIcon = () => {
    switch (config.type) {
      case 'time_limited':
        return <Clock className="w-4 h-4" />;
      case 'scarcity':
        return <AlertTriangle className="w-4 h-4" />;
      case 'social_proof':
        return <Users className="w-4 h-4" />;
      case 'exclusive':
        return <Zap className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  // Get color scheme based on urgency type
  const getColorScheme = () => {
    switch (config.type) {
      case 'time_limited':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'scarcity':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'social_proof':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'exclusive':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!isVisible) return null;

  // Render based on style
  switch (config.style) {
    case 'banner':
      return (
        <div className={`w-full ${getColorScheme()} border-b px-4 py-3 ${className}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <span className="font-medium">
                {config.message}
                {timeLeft !== null && timeLeft > 0 && (
                  <span className="ml-2 font-mono font-bold">
                    {formatTimeLeft(timeLeft)}
                  </span>
                )}
                {config.trigger?.type === 'visitor_count' && (
                  <span className="ml-2 font-semibold">
                    {visitorCount} people viewing
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={() => handleInteraction('dismiss')}
              className="text-current hover:opacity-70 transition-opacity"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      );

    case 'popup':
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md mx-4 ${getColorScheme()} border rounded-lg p-6 shadow-xl ${className}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="flex-1">
                <p className="font-medium mb-3">{config.message}</p>
                {timeLeft !== null && timeLeft > 0 && (
                  <div className="bg-white bg-opacity-50 rounded px-3 py-2 mb-3">
                    <div className="text-center">
                      <div className="font-mono text-lg font-bold">
                        {formatTimeLeft(timeLeft)}
                      </div>
                      <div className="text-xs opacity-75">remaining</div>
                    </div>
                  </div>
                )}
                {config.trigger?.type === 'visitor_count' && (
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">
                      <strong>{visitorCount}</strong> people currently viewing this offer
                    </span>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleInteraction('accept')}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-600 transition-colors"
                  >
                    Get Started Now
                  </button>
                  <button
                    onClick={() => handleInteraction('dismiss')}
                    className="px-4 py-2 text-current opacity-70 hover:opacity-100 transition-opacity"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'floating':
      return (
        <div className={`fixed bottom-4 right-4 ${getColorScheme()} border rounded-lg p-4 shadow-lg max-w-sm z-40 ${className}`}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">{config.message}</p>
              {timeLeft !== null && timeLeft > 0 && (
                <div className="text-xs font-mono font-bold mb-2">
                  ⏰ {formatTimeLeft(timeLeft)}
                </div>
              )}
              {config.trigger?.type === 'visitor_count' && (
                <div className="text-xs mb-2">
                  👥 {visitorCount} people viewing
                </div>
              )}
              <button
                onClick={() => handleInteraction('accept')}
                className="w-full bg-red-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Act Now
              </button>
            </div>
            <button
              onClick={() => handleInteraction('dismiss')}
              className="text-current opacity-70 hover:opacity-100 transition-opacity text-sm"
            >
              ×
            </button>
          </div>
        </div>
      );

    default: // inline
      return (
        <div className={`${getColorScheme()} border rounded-lg p-4 ${className}`}>
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div className="flex-1">
              <span className="font-medium">{config.message}</span>
              {timeLeft !== null && timeLeft > 0 && (
                <span className="ml-3 font-mono font-bold text-red-600">
                  {formatTimeLeft(timeLeft)}
                </span>
              )}
              {config.trigger?.type === 'visitor_count' && (
                <span className="ml-3 text-sm">
                  ({visitorCount} people viewing)
                </span>
              )}
            </div>
          </div>
        </div>
      );
  }
};

// Pre-configured urgency components
export const EarlyAccessUrgency: React.FC<{className?: string}> = ({ className }) => (
  <UrgencyElement
    config={{
      type: 'exclusive',
      message: 'Limited Early Access - Only 100 spots remaining for founding members',
      style: 'banner',
      trigger: {
        type: 'signup_count',
        value: 47
      }
    }}
    className={className}
  />
);

export const PricingUrgency: React.FC<{className?: string}> = ({ className }) => (
  <UrgencyElement
    config={{
      type: 'time_limited',
      message: 'Founding Member Pricing ends soon',
      style: 'inline',
      trigger: {
        type: 'timer',
        value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    }}
    className={className}
  />
);

export const DemoUrgency: React.FC<{className?: string}> = ({ className }) => (
  <UrgencyElement
    config={{
      type: 'scarcity',
      message: 'Only 3 demo slots available this week',
      style: 'floating',
      trigger: {
        type: 'visitor_count',
        value: 3
      }
    }}
    className={className}
    autoHide={true}
    hideDelay={15000}
  />
);

export const SocialProofUrgency: React.FC<{className?: string}> = ({ className }) => {
  const [activeCount, setActiveCount] = useState(23);

  useEffect(() => {
    // Simulate live activity
    const interval = setInterval(() => {
      if (Math.random() < 0.4) { // 40% chance every 20 seconds
        setActiveCount(prev => {
          const change = Math.random() < 0.7 ? 1 : -1; // 70% chance to increase
          return Math.max(1, Math.min(50, prev + change));
        });
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <UrgencyElement
      config={{
        type: 'social_proof',
        message: `${activeCount} people are currently exploring ContractNest`,
        style: 'inline',
        trigger: {
          type: 'visitor_count',
          value: activeCount
        }
      }}
      className={className}
    />
  );
};

// Urgency Banner Component (for top of page)
export const UrgencyBanner: React.FC<{
  message?: string;
  type?: UrgencyConfig['type'];
  showTimer?: boolean;
  timerEndDate?: Date;
  onDismiss?: () => void;
}> = ({
  message = "🚀 Early Access: Join 500+ businesses transforming their service contracts",
  type = 'exclusive',
  showTimer = false,
  timerEndDate,
  onDismiss
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user previously dismissed this banner
  useEffect(() => {
    const dismissed = localStorage.getItem('urgency_banner_dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const hoursSinceDismissal = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60);
      
      // Show again after 24 hours
      if (hoursSinceDismissal < 24) {
        setIsDismissed(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('urgency_banner_dismissed', new Date().toISOString());
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <UrgencyElement
      config={{
        type,
        message,
        style: 'banner',
        trigger: showTimer && timerEndDate ? {
          type: 'timer',
          value: timerEndDate
        } : undefined
      }}
      onInteraction={(action) => {
        if (action === 'dismiss') {
          handleDismiss();
        }
      }}
    />
  );
};

// Countdown Timer Component
export const CountdownTimer: React.FC<{
  endDate: Date;
  onComplete?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ endDate, onComplete, className = '', size = 'md' }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, onComplete]);

  if (!timeLeft) return null;

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  const numberSizeClasses = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold'
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {timeLeft.days > 0 && (
        <div className={`bg-red-500 text-white rounded ${sizeClasses[size]} text-center min-w-[3rem]`}>
          <div className={numberSizeClasses[size]}>{timeLeft.days}</div>
          <div className="text-xs opacity-75">DAYS</div>
        </div>
      )}
      <div className={`bg-red-500 text-white rounded ${sizeClasses[size]} text-center min-w-[3rem]`}>
        <div className={numberSizeClasses[size]}>{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs opacity-75">HOURS</div>
      </div>
      <div className={`bg-red-500 text-white rounded ${sizeClasses[size]} text-center min-w-[3rem]`}>
        <div className={numberSizeClasses[size]}>{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs opacity-75">MINS</div>
      </div>
      <div className={`bg-red-500 text-white rounded ${sizeClasses[size]} text-center min-w-[3rem]`}>
        <div className={numberSizeClasses[size]}>{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs opacity-75">SECS</div>
      </div>
    </div>
  );
};

// Stock Counter Component (for scarcity)
export const StockCounter: React.FC<{
  currentStock: number;
  totalStock: number;
  itemName?: string;
  className?: string;
}> = ({ currentStock, totalStock, itemName = 'spots', className = '' }) => {
  const percentage = (currentStock / totalStock) * 100;
  const isLow = percentage <= 20;
  const isCritical = percentage <= 10;

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {currentStock} {itemName} remaining
        </span>
        <span className={`text-sm ${isCritical ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-green-600'}`}>
          {percentage.toFixed(0)}% left
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isCritical ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isLow && (
        <p className={`text-xs mt-1 ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
          {isCritical ? '⚠️ Almost sold out!' : '🔥 Limited availability'}
        </p>
      )}
    </div>
  );
};

export default UrgencyElement;