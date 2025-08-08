// src/pages/service-contracts/contracts/index.tsx
import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

const ContractsPage = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className="p-8 min-h-screen transition-colors"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Contracts
          </h1>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Manage all your service contracts and partnerships
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="border rounded-lg p-6 text-center transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.secondaryText + '20'
            }}
          >
            <div className="text-4xl mb-4">📄</div>
            <h3 
              className="text-lg font-semibold mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Service Contracts
            </h3>
            <p 
              className="text-sm mb-4 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Create and manage service agreements with comprehensive SLA tracking
            </p>
            <button 
              className="w-full text-white py-2 px-4 rounded-md transition-colors hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              View Service Contracts
            </button>
          </div>
          
          <div 
            className="border rounded-lg p-6 text-center transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.secondaryText + '20'
            }}
          >
            <div className="text-4xl mb-4">🤝</div>
            <h3 
              className="text-lg font-semibold mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Partnership Contracts
            </h3>
            <p 
              className="text-sm mb-4 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Manage partnership agreements with revenue sharing and commission tracking
            </p>
            <button 
              className="w-full text-white py-2 px-4 rounded-md transition-colors hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              View Partnerships
            </button>
          </div>
          
          <div 
            className="border rounded-lg p-6 text-center transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.secondaryText + '20'
            }}
          >
            <div className="text-4xl mb-4">➕</div>
            <h3 
              className="text-lg font-semibold mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Create New Contract
            </h3>
            <p 
              className="text-sm mb-4 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Start a new contract using our template marketplace
            </p>
            <button 
              className="w-full text-white py-2 px-4 rounded-md transition-colors hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              Browse Templates
            </button>
          </div>
        </div>
        
        <div 
          className="mt-12 rounded-lg p-8 text-center transition-colors"
          style={{ backgroundColor: colors.utility.secondaryText + '05' }}
        >
          <div className="text-6xl mb-4">🚧</div>
          <h2 
            className="text-xl font-semibold mb-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Full Contract Management Coming Soon
          </h2>
          <p 
            className="max-w-2xl mx-auto transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            The complete contract creation flow with block-based builder, timeline management, 
            and billing integration will be available soon. For now, you can browse and preview templates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;