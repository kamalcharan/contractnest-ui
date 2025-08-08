// src/components/Performance/CriticalCSS.tsx
import React from 'react';

const CriticalCSS: React.FC = () => {
  return (
    <style>
      {`
        /* Critical CSS for above-the-fold content */
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Hero section critical styles */
        .hero-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          color: #1a202c;
        }
        
        .hero-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.25rem);
          color: #4a5568;
          margin-bottom: 2rem;
          max-width: 600px;
        }
        
        /* Form critical styles */
        .cta-form {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #e53e3e;
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
        
        .btn-primary {
          background: #e53e3e;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .btn-primary:hover {
          background: #c53030;
          transform: translateY(-1px);
        }
        
        /* Loading states */
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Utility classes */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #e53e3e;
          color: white;
          padding: 8px;
          border-radius: 4px;
          text-decoration: none;
          z-index: 100;
        }
        
        .skip-link:focus {
          top: 6px;
        }
        
        /* Responsive utilities */
        @media (max-width: 768px) {
          .hero-container {
            min-height: 60vh;
            padding: 1rem;
          }
          
          .cta-form {
            padding: 1.5rem;
          }
        }
      `}
    </style>
  );
};

export default CriticalCSS;