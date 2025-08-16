// src/components/Landing/ContractTypeSection.tsx
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion'; // You'll need to install framer-motion

const ContractTypeSection: React.FC = () => {
  // Access theme context with fallback
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;

  // Theme-specific styling
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const secondaryTextColor = theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  const contractTypes = [
    {
      id: 'lease-plans',
      name: 'Lease Plans',
      position: 'left',
      description: 'Manage property and equipment lease contracts with automated renewal reminders and compliance tracking.',
      benefits: ['Automated lease expiration alerts', 'Payment schedule tracking', 'Maintenance obligation monitoring'],
      image: '/images/lease-contract-example.png'
    },
    {
      id: 'financial-services',
      name: 'Financial Services',
      position: 'right',
      description: 'Streamline financial service agreements with automated billing cycles and compliance documentation.',
      benefits: ['Automated payment reminders', 'Regulatory compliance tracking', 'Document version control'],
      image: '/images/financial-services-example.png'
    },
    {
      id: 'equipment-maintenance',
      name: 'Equipment Maintenance',
      position: 'left',
      description: 'Schedule and track regular maintenance events for critical equipment with SLA compliance monitoring.',
      benefits: ['Preventive maintenance scheduling', 'Service history documentation', 'Technician assignment', 'Test 1','Test2','test 3'],
      image: '/images/equipment-maintenance-example.png'
    },
    {
      id: 'equipment-calibrations',
      name: 'Equipment Calibrations',
      position: 'right',
      description: 'Manage calibration schedules and certifications for precision equipment and instruments.',
      benefits: ['Calibration due date tracking', 'Certification documentation', 'Compliance reporting'],
      image: '/images/equipment-calibration-example.png'
    },
    {
      id: 'health-plans',
      name: 'Health Plans',
      position: 'left',
      description: 'Manage healthcare service agreements with privacy compliance and appointment scheduling.',
      benefits: ['HIPAA compliance tools', 'Appointment scheduling', 'Patient communication automation'],
      image: '/images/health-plans-example.png'
    },
    {
      id: 'digital-marketing',
      name: 'Digital Marketing',
      position: 'right',
      description: 'Manage marketing service agreements with deliverable tracking and performance reporting.',
      benefits: ['Campaign milestone tracking', 'Deliverable management', 'Performance reporting'],
      image: '/images/digital-marketing-example.png'
    },
    {
      id: 'your-own',
      name: 'Your Own',
      position: 'center',
      description: 'Have a unique service model? ContractNest is flexible enough to accommodate custom contract types and workflows specific to your business.',
      benefits: ['Custom contract structures', 'Tailored workflows', 'Personalized automation'],
      isSpecial: true
    }
  ];

  // State to track which contract type is selected to display on the right
  const [selectedType, setSelectedType] = useState(contractTypes[0].id);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Continuous floating animation
  const floatingAnimation = {
    y: ["-3px", "3px", "-3px"],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    }
  };

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 mb-24" style={{ backgroundColor: theme.mode === 'dark' ? '#1a1a1a' : '#f4f4f5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
            Service Contracts : Digitally Transformed
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${secondaryTextColor}`}>
            Purpose built for service business with automated events, compliance tracking and payment integration
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className={`text-2xl font-semibold ${textColor}`}>A few types of Service Contracts</h3>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left side - Card layout */}
          <div className="w-full lg:w-5/12">
            <motion.div 
              className="flex flex-col space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contractTypes.map((type, index) => {
                if (index >= 6) return null; // Handle "Your Own" separately
                const isSelected = selectedType === type.id;
                const isLeft = type.position === 'left';
                
                return (
                  <motion.div
                    key={type.id}
                    className={`${isLeft ? 'self-start' : 'self-end'} ${index >= 3 ? 'lg:mt-4' : ''}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    animate={floatingAnimation}
                    custom={index}
                    style={{ marginTop: index * 20 }} // Add some increasing margin to create staggered effect
                  >
                    <div 
                      className={`
                        relative p-5 cursor-pointer rounded-lg border-2 w-72
                        ${isSelected 
                          ? type.id === 'your-own' 
                            ? 'bg-black text-white border-red-500' 
                            : 'bg-white border-red-600' 
                          : type.id === 'your-own'
                            ? 'bg-black text-white border-red-500' 
                            : 'bg-white border-red-600' 
                        }
                        transition-all duration-500
                      `}
                      onClick={() => setSelectedType(type.id)}
                    >
                      {/* Black circle icon in top left */}
                      <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-black"></div>
                      
                      {/* Contract type name */}
                      <div className="text-xl font-medium ml-10 mt-1">{type.name}</div>
                      
                      {/* Click.gif animation in bottom right */}
                      <div className="absolute bottom-2 right-2">
                        <img src="/images/click.gif" alt="Click" className="w-6 h-6" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Your Own card - special case */}
              <motion.div
                className="self-center mt-12"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={floatingAnimation}
                custom={6}
              >
                <div 
                  className={`
                    relative p-4 cursor-pointer rounded-lg border-2 w-72
                    bg-black text-white border-red-500
                    ${selectedType === 'your-own' ? 'shadow-lg shadow-red-500/30' : ''}
                    transition-all duration-300
                  `}
                  onClick={() => setSelectedType('your-own')}
                >
                  {/* Red circle icon in top left */}
                  <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-red-500"></div>
                  
                  {/* Your Own label */}
                  <div className="text-xl font-medium ml-10 mt-1">Your Own</div>
                  
                  {/* Click.gif animation in bottom right */}
                  <div className="absolute bottom-2 right-2">
                    <img src="/images/click.gif" alt="Click" className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
              
              {/* Contract Solutions card */}
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div 
                  className="rounded-xl p-6"
                  style={{
                    backgroundColor: '#FFF1F1',
                    border: '2px solid #FFD7D7'
                  }}
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-red-600">
                    Contract Solutions
                    <br/>
                    customized to your Service
                    <br/>
                    Business
                  </h3>
                  <p className="text-gray-700">
                    Whatever your service commitment model, 
                    ContractNest adapts to your specific needs
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right side - Content display */}
          <div className="w-full lg:w-7/12 mt-10 lg:mt-0">
            <motion.div 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              key={selectedType} // Re-animate when selection changes
            >
              {(() => {
                const currentType = contractTypes.find(type => type.id === selectedType);
                if (!currentType) return null;
                
                return (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{currentType.name}</h3>
                    <p className="mb-6 text-gray-600">{currentType.description}</p>
                    
                    <h4 className="font-semibold mb-2">Key Benefits</h4>
                    <ul className="list-disc pl-5 mb-6">
                      {currentType.benefits.map((benefit, i) => (
                        <motion.li 
                          key={i} 
                          className="text-gray-600"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + (i * 0.1) }}
                        >
                          {benefit}
                        </motion.li>
                      ))}
                    </ul>
                    
                    {!currentType.isSpecial && (
                      <motion.div 
                        className="bg-gray-100 rounded-lg p-4 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                          <img 
                            src={currentType.image} 
                            alt={`${currentType.name} Example`}
                            className="max-w-full max-h-full rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const placeholder = document.createElement('div');
                                placeholder.className = 'flex items-center justify-center h-full w-full';
                                placeholder.innerHTML = `
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="ml-2 text-gray-400">${currentType.name} Example</span>
                              `;
                                parent.appendChild(placeholder);
                              }
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {currentType.isSpecial && (
                      <motion.div 
                        className="bg-gray-100 rounded-lg p-6 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center">
                          <div className="mr-4 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Contract-Centric Pricing</h5>
                            <p className="text-gray-600">
                              Unlike traditional solutions that charge per user, ContractNest is priced based on the number of contracts - making it more affordable for businesses of all sizes.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button 
                        onClick={() => {
                          // Scroll to email signup
                          document.getElementById('email-signup')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{ 
                          backgroundColor: currentTheme?.colors?.brand?.primary || '#E53E3E'
                        }}
                      >
                        {currentType.isSpecial ? 'Contact Us' : 'Get Early Access'}
                      </Button>
                    </motion.div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractTypeSection;