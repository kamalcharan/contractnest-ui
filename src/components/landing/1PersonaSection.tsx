import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';

const PersonaTriangleSVG = ({ theme, currentTheme }) => {
  const isDark = theme.mode === 'dark';
  
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 py-8 px-4 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="700" viewBox="0 0 1200 700" className="mx-auto">
        <style>
          {`
            /* Light mode theme colors */
            :root {
              --primary: ${currentTheme?.colors?.brand?.primary || '#E53E3E'};
              --secondary: #000000;
              --tertiary: #757575;
              --bg-primary: #FFFFFF;
              --bg-secondary: #F5F5F5;
              --text-primary: #000000;
              --text-secondary: #525252;
              --success: #2E7D32;
              --error: #E53E3E;
              --warning: #F57C00;
              --info: #0277BD;
              --red: #E53E3E;
              --blue: #3182CE;
              --purple: #805AD5;
              --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            /* Dark mode theme colors */
            .dark {
              --primary: ${currentTheme?.colors?.brand?.primary || '#F56565'};
              --secondary: #FFFFFF;
              --tertiary: #AAAAAA;
              --bg-primary: #000000;
              --bg-secondary: #1F1F1F;
              --text-primary: #FFFFFF;
              --text-secondary: #BBBBBB;
              --success: #66BB6A;
              --error: #EF5350;
              --warning: #FFA726;
              --info: #42A5F5;
              --red: #F56565;
              --blue: #63B3ED;
              --purple: #B794F4;
              --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            
            .card-bg { fill: var(--bg-primary); }
            .card-border { stroke: var(--tertiary); stroke-width: 1; stroke-opacity: 0.2; }
            .primary-text { fill: var(--text-primary); }
            .secondary-text { fill: var(--text-secondary); }
            
            .giver-color { fill: var(--red); }
            .giver-bg { fill: var(--red); fill-opacity: 0.1; }
            .giver-border { stroke: var(--red); stroke-width: 1.5; }
            
            .receiver-color { fill: var(--blue); }
            .receiver-bg { fill: var(--blue); fill-opacity: 0.1; }
            .receiver-border { stroke: var(--blue); stroke-width: 1.5; }
            
            .partner-color { fill: var(--purple); }
            .partner-bg { fill: var(--purple); fill-opacity: 0.1; }
            .partner-border { stroke: var(--purple); stroke-width: 1.5; }
            
            .arrow { stroke: var(--tertiary); stroke-width: 1.5; fill: none; }
            .arrow-head { fill: var(--tertiary); }
            
            .badge { font-size: 11px; font-weight: bold; }
            .tag { font-size: 10px; }
            
            .card {
              filter: drop-shadow(var(--card-shadow));
            }
            
            @keyframes pulse {
              0% { opacity: 0.8; }
              50% { opacity: 1; }
              100% { opacity: 0.8; }
            }
            
            .pulse {
              animation: pulse 2s infinite ease-in-out;
            }
          `}
        </style>
        
        {/* Triangle Connection Lines (behind cards) */}
        <g>
          {/* Giver to Partner */}
          <path d="M350 220 L550 450" className="arrow" strokeDasharray="5,3" />
          <polygon points="550,450 535,435 530,448" className="arrow-head" />
          <text x="400" y="320" fontFamily="Inter, Arial, sans-serif" fontSize="14" textAnchor="middle" className="secondary-text">Assigns</text>
          
          {/* Partner to Receiver */}
          <path d="M650 450 L850 220" className="arrow" strokeDasharray="5,3" />
          <polygon points="850,220 835,225 843,235" className="arrow-head" />
          <text x="770" y="350" fontFamily="Inter, Arial, sans-serif" fontSize="14" textAnchor="middle" className="secondary-text">Serves</text>
          
          {/* Receiver to Giver */}
          <path d="M750 180 L450 180" className="arrow" strokeDasharray="5,3" />
          <polygon points="450,180 462,190 465,175" className="arrow-head" />
          <text x="600" y="160" fontFamily="Inter, Arial, sans-serif" fontSize="14" textAnchor="middle" className="secondary-text">Pays</text>
        </g>
        
        {/* Giver Card (Top Left) */}
        <g transform="translate(150, 120)" className="card">
          <rect x="0" y="0" width="240" height="200" rx="10" className="card-bg giver-border" />
          
          {/* Badge */}
          <rect x="140" y="15" width="85" height="20" rx="10" className="giver-bg" />
          <text x="182" y="28" fontFamily="Inter, Arial, sans-serif" className="badge giver-color" textAnchor="middle">Can Initiate</text>
          
          {/* Icon and Title */}
          <circle cx="50" cy="50" r="24" className="giver-bg" />
          <path d="M50 38 C43 38 38 44 38 50 C38 56 43 62 50 62 C57 62 62 56 62 50 C62 44 57 38 50 38 M35 76 C35 68 42 62 50 62 C58 62 65 68 65 76" className="giver-color" fill="none" strokeWidth="2" />
          
          <text x="120" y="55" fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="bold" className="primary-text">The Giver</text>
          
          {/* Description */}
          <text x="120" y="85" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">Creates and manages service</text>
          <text x="120" y="105" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">contracts, schedules events,</text>
          <text x="120" y="125" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">and ensures compliance</text>
          
          {/* Key Benefits */}
          <g transform="translate(20, 145)">
            <circle cx="6" cy="6" r="4" className="giver-color" />
            <text x="20" y="10" fontFamily="Inter, Arial, sans-serif" fontSize="11" className="secondary-text">Streamlined contract management</text>
            
            <circle cx="6" cy="26" r="4" className="giver-color" />
            <text x="20" y="30" fontFamily="Inter, Arial, sans-serif" fontSize="11" className="secondary-text">Enhanced receivables management</text>
          </g>
          
          {/* Tags */}
          <rect x="25" y="175" width="60" height="16" rx="8" fill="#FDE8E8" />
          <text x="55" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#C53030">Provider</text>
          
          <rect x="90" y="175" width="60" height="16" rx="8" fill="#EBF8FF" />
          <text x="120" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#2C5282">Vendor</text>
          
          <rect x="155" y="175" width="60" height="16" rx="8" fill="#FAF5FF" />
          <text x="185" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#553C9A">Consultant</text>
        </g>
        
        {/* Receiver Card (Top Right) */}
        <g transform="translate(810, 120)" className="card">
          <rect x="0" y="0" width="240" height="200" rx="10" className="card-bg receiver-border" />
          
          {/* Badge */}
          <rect x="140" y="15" width="85" height="20" rx="10" className="receiver-bg" />
          <text x="182" y="28" fontFamily="Inter, Arial, sans-serif" className="badge receiver-color" textAnchor="middle">Can Initiate</text>
          
          {/* Icon and Title */}
          <circle cx="50" cy="50" r="24" className="receiver-bg" />
          <path d="M50 38 C43 38 38 44 38 50 C38 56 43 62 50 62 C57 62 62 56 62 50 C62 44 57 38 50 38 M35 76 C35 68 42 62 50 62 C58 62 65 68 65 76" className="receiver-color" fill="none" strokeWidth="2" />
          
          <text x="120" y="55" fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="bold" className="primary-text">The Receiver</text>
          
          {/* Description */}
          <text x="120" y="85" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">Accepts contracts, makes</text>
          <text x="120" y="105" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">payments, and receives</text>
          <text x="120" y="125" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">the promised services</text>
          
          {/* Key Benefits */}
          <g transform="translate(20, 145)">
            <circle cx="6" cy="6" r="4" className="receiver-color" />
            <text x="20" y="10" fontFamily="Inter, Arial, sans-serif" fontSize="11" className="secondary-text">Visibility into service commitments</text>
            
            <circle cx="6" cy="26" r="4" className="receiver-color" />
            <text x="20" y="30" fontFamily="Inter, Arial, sans-serif" fontSize="11" className="secondary-text">Simplified payment processes</text>
          </g>
          
          {/* Tags */}
          <rect x="20" y="175" width="60" height="16" rx="8" fill="#F0FFF4" />
          <text x="50" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#22543D">Customer</text>
          
          <rect x="90" y="175" width="50" height="16" rx="8" fill="#FFFBEB" />
          <text x="115" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#744210">Client</text>
          
          <rect x="150" y="175" width="70" height="16" rx="8" fill="#EBF4FF" />
          <text x="185" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#2A4365">Beneficiary</text>
        </g>
        
        {/* Partner Card (Bottom Center) */}
        <g transform="translate(480, 400)" className="card">
          <rect x="0" y="0" width="240" height="200" rx="10" className="card-bg partner-border" />
          
          {/* Badge */}
          <rect x="130" y="15" width="95" height="20" rx="10" className="partner-bg" />
          <text x="177" y="28" fontFamily="Inter, Arial, sans-serif" className="badge partner-color" textAnchor="middle">Service Executor</text>
          
          {/* Icon and Title */}
          <circle cx="50" cy="50" r="24" className="partner-bg" />
          <path d="M50 30 L50 70 M30 50 L70 50" strokeWidth="0" className="partner-color" />
          <path d="M56 38 C50 35 38 40 38 50 C38 60 50 65 56 62" fill="none" className="partner-color" strokeWidth="2" />
          <path d="M44 38 C50 40 62 45 62 50 C62 55 50 60 44 62" fill="none" className="partner-color" strokeWidth="2" />
          
          <text x="100" y="55" fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="bold" className="primary-text">Vendor Partner</text>
          
          {/* Description */}
          <text x="120" y="85" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">Executes services on behalf</text>
          <text x="120" y="105" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">of the Giver, documents work,</text>
          <text x="120" y="125" fontFamily="Inter, Arial, sans-serif" fontSize="12" textAnchor="middle" className="secondary-text">and validates completion</text>
          
          {/* Key Benefits */}
          <g transform="translate(20, 145)">
            <circle cx="6" cy="6" r="4" className="partner-color" />
            <text x="20" y="10" fontFamily="Inter, Arial, sans-serif" fontSize="11" className="secondary-text">Clear service instructions</text>
            
            <circle cx="6" cy="26" r="4" className="partner-color" />
            <text x="20" y="30" fontFamily="Inter, Arial, sans-serif" fontSize="11" className="secondary-text">Streamlined documentation</text>
          </g>
          
          {/* Tags */}
          <rect x="20" y="175" width="60" height="16" rx="8" fill="#FAF5FF" />
          <text x="50" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#553C9A">Technician</text>
          
          <rect x="90" y="175" width="60" height="16" rx="8" fill="#F3E8FF" />
          <text x="120" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#5B21B6">Contractor</text>
          
          <rect x="160" y="175" width="60" height="16" rx="8" fill="#EDE9FE" />
          <text x="190" y="185" fontFamily="Inter, Arial, sans-serif" className="tag" textAnchor="middle" fill="#5521B5">Implementer</text>
        </g>
        
        {/* Key Benefits */}
        <g transform="translate(250, 630)">
          <text x="350" y="10" fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="bold" textAnchor="middle" className="primary-text">Key Benefits of the Triangle Relationship:</text>
          
          <g transform="translate(0, 30)">
            <text x="150" y="0" fontFamily="Inter, Arial, sans-serif" fontSize="13" className="secondary-text">• Complete visibility across the entire service chain</text>
            <text x="150" y="20" fontFamily="Inter, Arial, sans-serif" fontSize="13" className="secondary-text">• Streamlined communication between all parties</text>
            <text x="150" y="40" fontFamily="Inter, Arial, sans-serif" fontSize="13" className="secondary-text">• Automated tracking of outsourced work</text>
            
            <text x="500" y="0" fontFamily="Inter, Arial, sans-serif" fontSize="13" className="secondary-text">• Clear accountability at every stage</text>
            <text x="500" y="20" fontFamily="Inter, Arial, sans-serif" fontSize="13" className="secondary-text">• Reduced administrative overhead</text>
            <text x="500" y="40" fontFamily="Inter, Arial, sans-serif" fontSize="13" className="secondary-text">• Enhanced customer satisfaction</text>
          </g>
        </g>
        
        {/* Center Contract Element */}
        <g transform="translate(570, 300)">
          <circle cx="30" cy="30" r="35" fill="var(--bg-primary)" stroke="var(--tertiary)" strokeWidth="1" className="pulse" />
          
          {/* Document Icon */}
          <rect x="12" y="12" width="36" height="42" rx="3" fill="none" stroke="var(--primary)" strokeWidth="2" />
          <line x1="18" y1="24" x2="42" y2="24" stroke="var(--primary)" strokeWidth="2" />
          <line x1="18" y1="32" x2="42" y2="32" stroke="var(--primary)" strokeWidth="2" />
          <line x1="18" y1="40" x2="42" y2="40" stroke="var(--primary)" strokeWidth="2" />
          <line x1="18" y1="48" x2="30" y2="48" stroke="var(--primary)" strokeWidth="2" />
          
          {/* Label */}
          <text x="87" y="35" fontFamily="Inter, Arial, sans-serif" fontSize="14" fontWeight="bold" className="primary-text">ContractNest</text>
        </g>
      </svg>
    </div>
  );
};
const PersonaSection: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  // Theme-specific styling
  const sectionBg = theme.mode === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const cardBg = theme.mode === 'dark' ? 'bg-gray-900' : 'bg-white';
  const cardBorder = theme.mode === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const secondaryTextColor = theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  // Contract types with icons and descriptions
  const contractTypes = [
    {
      name: "Maintenance Contracts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      description: "Regular service and upkeep agreements for equipments"
    },
    {
      name: "Lease Contracts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      description: "Equipment or property rental agreements"
    },
    {
      name: "Milestone Contracts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      description: "Progress-based deliverable agreements"
    },
    {
      name: "   Payment Plans",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Recurring payment scheduling"
    },
    {
      name: "Calibrations",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: "Equipment testing and adjustment schedules"
    },
    {
      name: "Health & Wellness Plans",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      description: "Longer Healthplan delivery & service"
    }
  ];

  return (
    <section className={`py-20 px-4 md:px-6 lg:px-8 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
            We Enable 3 Key Personas in Service Relationship
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${secondaryTextColor}`}>
            ContractNest serves the entire service ecosystem with tailored solutions
          </p>
        </div>
        
        {/* Triangle SVG diagram */}
        <div className="mb-16 max-w-full"> 
  <PersonaTriangleSVG theme={theme} currentTheme={currentTheme} />
</div>
        
        {/* Contract Types Cards */}
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
            Service Contracts : Digitally Transformed
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${secondaryTextColor}`}>
            Purpose built for service business with automated events, compliance tracking and payment integration
          </p>
        </div>
         
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {contractTypes.map((type, index) => (
              <div 
                key={index} 
                className={`${cardBg} border ${cardBorder} rounded-lg p-5 hover:shadow-lg transition-shadow duration-300 flex flex-col`}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white"
                    style={{ 
                      backgroundColor: index % 3 === 0 
                        ? currentTheme?.colors?.brand?.primary || '#E53E3E' 
                        : index % 3 === 1 
                          ? theme.mode === 'dark' ? '#3182CE' : '#2B6CB0'
                          : theme.mode === 'dark' ? '#805AD5' : '#6B46C1'
                    }}
                  >
                    {type.icon}
                  </div>
                  <h4 className={`text-lg font-semibold ${textColor}`}>{type.name}</h4>
                </div>
                <p className={`text-sm ${secondaryTextColor}`}>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Your Own Custom Solutions Section */}
        <div className="mb-12 mt-16">
          <div className={`max-w-3xl mx-auto rounded-xl border ${cardBorder} overflow-hidden`}>
            {/* Header with highlighted "Your Own" */}
            <div className="bg-black border border-red-500 p-4 flex items-center">
              <div className="w-6 h-6 rounded-full bg-red-500 mr-3"></div>
              <span className="text-white text-xl font-bold">Your Own</span>
            </div>
            
            {/* Content area */}
            <div className="bg-red-50 dark:bg-red-900/10 p-6 md:p-8">
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
                Contract Solutions customized to your Service Business
              </h3>
              <p className={`text-lg ${secondaryTextColor}`}>
                Whatever your service commitment model, ContractNest adapts to your specific needs
              </p>
            </div>
          </div>
        </div>
        
        {/* Call to Action - Link to login */}
        <div className="text-center mt-12">
          <Link to="/auth/login">
            <button
              className="inline-block px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: currentTheme?.colors?.brand?.primary || '#E53E3E' }}
            >
              Configure Your Contract Solution
            </button>
          </Link>
          <p className={`mt-3 ${secondaryTextColor}`}>
            Flexible contracts to match your business model
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonaSection;