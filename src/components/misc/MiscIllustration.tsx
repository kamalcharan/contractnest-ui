//src/components/misc/MiscIllustration.tsx

import React, { useState } from 'react';

interface MiscIllustrationProps {
  name: string;
  className?: string;
}

const MiscIllustration: React.FC<MiscIllustrationProps> = ({ name, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  // Fallback SVG illustrations
  const fallbackIllustrations: Record<string, React.ReactNode> = {
    'no-internet': (
      <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className={className}>
        <circle cx="120" cy="90" r="80" fill="currentColor" opacity="0.1"/>
        <path d="M120 50 L120 130 M80 90 L160 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="120" cy="90" r="10" fill="currentColor"/>
        <path d="M90 60 L90 60.01 M150 60 L150 60.01 M90 120 L90 120.01 M150 120 L150 120.01" 
              stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    ),
    'error': (
      <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className={className}>
        <circle cx="120" cy="90" r="80" fill="#EF4444" opacity="0.1"/>
        <path d="M120 40 L120 100 M120 120 L120 120.01" stroke="#EF4444" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    ),
    'maintenance': (
      <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className={className}>
        <circle cx="120" cy="90" r="80" fill="currentColor" opacity="0.1"/>
        <path d="M95 65 L145 65 L145 115 L95 115 Z" fill="currentColor" opacity="0.2"/>
        <path d="M110 50 L110 130 M130 50 L130 130" stroke="currentColor" strokeWidth="3"/>
        <circle cx="110" cy="50" r="8" fill="currentColor"/>
        <circle cx="130" cy="50" r="8" fill="currentColor"/>
      </svg>
    ),
    'not-found': (
      <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className={className}>
        <circle cx="120" cy="90" r="80" fill="currentColor" opacity="0.1"/>
        <text x="120" y="110" fontSize="60" fontWeight="bold" textAnchor="middle" fill="currentColor">
          404
        </text>
      </svg>
    ),
    'unauthorized': (
      <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className={className}>
        <circle cx="120" cy="90" r="80" fill="#F59E0B" opacity="0.1"/>
        <path d="M120 60 C100 60 80 70 80 85 L80 115 L160 115 L160 85 C160 70 140 60 120 60 Z" 
              stroke="#F59E0B" strokeWidth="3" fill="none"/>
        <circle cx="120" cy="85" r="20" fill="#F59E0B" opacity="0.3"/>
      </svg>
    ),
    'coming-soon': (
      <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className={className}>
        <circle cx="120" cy="90" r="80" fill="currentColor" opacity="0.1"/>
        <path d="M120 130 L100 110 L100 70 L120 50 L140 70 L140 110 Z" 
              fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="120" cy="50" r="15" fill="currentColor" opacity="0.3"/>
        <path d="M100 140 L140 140" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'session-conflict': (
      <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className={className}>
        <circle cx="90" cy="90" r="40" fill="currentColor" opacity="0.1"/>
        <circle cx="150" cy="90" r="40" fill="currentColor" opacity="0.1"/>
        <circle cx="90" cy="90" r="15" fill="currentColor"/>
        <circle cx="150" cy="90" r="15" fill="currentColor"/>
      </svg>
    )
  };

  if (hasError) {
    return <>{fallbackIllustrations[name] || fallbackIllustrations['error']}</>;
  }

  return (
    <>
      <img
        src={`/assets/images/misc/${name}.svg`}
        alt={name}
        className={className}
        width={240}
        height={180}
        onError={() => setHasError(true)}
        style={{ display: hasError ? 'none' : 'block' }}
      />
      {hasError && (fallbackIllustrations[name] || fallbackIllustrations['error'])}
    </>
  );
};

export default MiscIllustration;