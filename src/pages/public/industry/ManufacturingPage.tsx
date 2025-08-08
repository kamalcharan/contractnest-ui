// src/pages/industries/ManufacturingPage.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Settings, 
  Cog, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Factory,
  Wrench,
  Shield,
  Star,
  Phone,
  Calendar,
  ArrowRight,
  Zap
} from 'lucide-react';

// Import CRO components
import ConversionForm from '@/components/CRO/ConversionForm';
import SocialProof from '@/components/CRO/SocialProof';
import UrgencyElements from '@/components/CRO/UrgencyElements';

const ManufacturingPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeCase, setActiveCase] = useState(0);

  const manufacturingStats = [
    { number: '₹2.1 Cr', label: 'OEM Contracts', sublabel: 'Precision Manufacturing' },
    { number: '85%', label: 'Uptime Improvement', sublabel: 'Equipment Availability' },
    { number: '60%', label: 'Maintenance Cost Reduction', sublabel: 'Predictive Analytics' },
    { number: '134', label: 'Manufacturing Plants', sublabel: 'Using ContractNest' }
  ];

  const painPoints = [
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: 'Equipment Downtime',
      description: 'Unplanned maintenance shutdowns costing production hours',
      impact: '₹2-5 lakhs per hour of production loss',
      color: 'red'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Multi-Vendor Coordination',
      description: 'Managing OEM services, spare parts, and maintenance schedules',
      impact: '3+ hours daily on vendor coordination',
      color: 'orange'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Compliance Documentation',
      description: 'Quality certifications, safety audits, and regulatory requirements',
      impact: 'Manual documentation increases audit risk',
      color: 'blue'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Reactive Maintenance',
      description: 'Lack of predictive maintenance leads to emergency repairs',
      impact: '40% higher maintenance costs',
      color: 'purple'
    }
  ];

  const manufacturingSolutions = [
    {
      title: 'OEM Service Agreements',
      description: 'Manage original equipment manufacturer service contracts and warranties',
      features: ['Service level agreements', 'Warranty tracking', 'Spare parts management'],
      contractExample: 'CNC Machine Service: ₹8L/year',
      icon: <Factory className="h-8 w-8" />
    },
    {
      title: 'Predictive Maintenance',
      description: 'Schedule maintenance based on equipment usage and performance data',
      features: ['Usage-based scheduling', 'Performance monitoring', 'Cost optimization'],
      contractExample: 'Preventive Maintenance: ₹15L/year',
      icon: <Wrench className="h-8 w-8" />
    },
    {
      title: 'Quality Control Services',
      description: 'Third-party testing, calibration, and quality assurance contracts',
      features: ['Testing protocols', 'Calibration schedules', 'Quality certifications'],
      contractExample: 'Quality Testing: ₹6L/year',
      icon: <CheckCircle className="h-8 w-8" />
    },
    {
      title: 'Facility Management',
      description: 'Plant utilities, security, cleaning, and infrastructure maintenance',
      features: ['Utility management', 'Security contracts', 'Cleaning services'],
      contractExample: 'Facility Services: ₹12L/year',
      icon: <Settings className="h-8 w-8" />
    }
  ];

  const caseStudies = [
    {
      company: 'Precision Manufacturing Ltd',
      industry: 'Automotive Parts',
      challenge: 'Managing 47 service contracts across 3 plants with frequent equipment breakdowns',
      solution: 'Automated maintenance scheduling and vendor performance tracking',
      results: ['85% reduction in unplanned downtime', '₹2.1 Cr contracts digitized', '60% faster vendor response'],
      contractValue: '₹2.1 Cr',
      equipmentTypes: ['CNC Machines', 'Assembly Lines', 'Quality Control Systems'],
      avatar: 'PM'
    },
    {
      company: 'Gujarat Steel Industries',
      industry: 'Steel Manufacturing',
      challenge: 'Complex OEM agreements with international suppliers and local maintenance providers',
      solution: 'Centralized contract management with multi-language support',
      results: ['40% cost reduction in maintenance', '99.2% equipment uptime', 'ISO certification maintained'],
      contractValue: '₹4.8 Cr',
      equipmentTypes: ['Blast Furnaces', 'Rolling Mills', 'Quality Labs'],
      avatar: 'GS'
    },
    {
      company: 'Pharma Equipment Co',
      industry: 'Pharmaceutical Manufacturing',
      challenge: 'FDA compliance requirements for equipment validation and maintenance',
      solution: 'Automated compliance tracking with digital audit trails',
      results: ['100% FDA audit compliance', '₹1.8 Cr savings annually', 'Zero compliance violations'],
      contractValue: '₹3.2 Cr',
      equipmentTypes: ['Clean Room Systems', 'Packaging Lines', 'Laboratory Equipment'],
      avatar: 'PE'
    }
  ];

  const equipmentTypes = [
    { name: 'CNC Machines', contracts: 89, avgValue: '₹8L' },
    { name: 'Assembly Lines', contracts: 67, avgValue: '₹15L' },
    { name: 'Quality Control', contracts: 54, avgValue: '₹6L' },
    { name: 'HVAC Systems', contracts: 43, avgValue: '₹12L' },
    { name: 'Power Systems', contracts: 38, avgValue: '₹20L' },
    { name: 'Safety Equipment', contracts: 32, avgValue: '₹5L' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCase(prev => (prev + 1) % caseStudies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = (formData) => {
    console.log('Manufacturing form submission:', formData);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'manufacturing_lead', {
        event_category: 'industry_conversion',
        event_label: 'manufacturing_page',
        value: formData.leadScore,
        custom_parameters: {
          plant_size: formData.businessSize,
          equipment_count: formData.currentContracts,
          industry_focus: 'manufacturing'
        }
      });
    }
    
    setShowForm(false);
    alert(`Thank you ${formData.fullName}! Our manufacturing specialist will contact you within 4 hours to discuss equipment maintenance optimization.`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Manufacturing Contract Management - Equipment Maintenance Solutions",
    "description": "Specialized service contract management for manufacturing plants with OEM agreements, predictive maintenance, and quality control automation.",
    "url": "https://contractnest.com/industries/manufacturing",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "ContractNest for Manufacturing",
      "applicationCategory": "ManufacturingApplication",
      "description": "Equipment maintenance and OEM service contract management for manufacturing facilities",
      "featureList": [
        "OEM service agreement management",
        "Predictive maintenance scheduling",
        "Quality control automation",
        "Equipment uptime tracking",
        "Vendor performance monitoring"
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Manufacturing Contract Management - Equipment Maintenance Solutions | ContractNest</title>
        <meta name="description" content="Specialized service contract management for manufacturing plants with OEM agreements, predictive maintenance, and quality control automation. Reduce downtime by 85%." />
        <meta name="keywords" content="manufacturing contract management, OEM service agreements, equipment maintenance, predictive maintenance, manufacturing quality control, plant maintenance software" />
        <link rel="canonical" href="https://contractnest.com/industries/manufacturing" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Factory className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold">ContractNest</span>
                <span className="ml-2 text-sm text-gray-500">for Manufacturing</span>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Manufacturing Demo
              </button>
            </div>
          </div>
        </nav>

        {/* Urgency Banner */}
        <UrgencyElements variant="scarcity-banner" />

        {/* Hero Section */}
        <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    🏭 Manufacturing Specialized
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Reduce Equipment Downtime by 
                  <span className="text-blue-600"> 85% with Smart</span> Contract Management
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                  Streamline OEM service agreements, predictive maintenance, and quality control contracts. 
                  <strong>From ₹5L safety equipment to ₹20L power systems contracts.</strong>
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    85% Uptime Improvement
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    60% Cost Reduction
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ISO Compliance Ready
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
                >
                  Get Manufacturing Demo
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>

                <p className="text-sm text-gray-500">
                  ✓ Free plant assessment ✓ 30-day trial ✓ ROI guarantee
                </p>
              </div>

              <div className="relative">
                <div className="bg-white rounded-xl shadow-2xl p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Equipment Service Contracts</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                      <div>
                        <p className="font-medium text-sm">CNC Machine Service</p>
                        <p className="text-xs text-gray-600">Line 2 - Haas Automation</p>
                        <p className="text-xs text-green-600">✓ 99.8% Uptime</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₹8L</p>
                        <p className="text-xs text-gray-500">Next: Feb 15</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-500">
                      <div>
                        <p className="font-medium text-sm">Assembly Line Maintenance</p>
                        <p className="text-xs text-gray-600">Production Unit A</p>
                        <p className="text-xs text-green-600">✓ Predictive Schedule</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹15L</p>
                        <p className="text-xs text-gray-500">Next: Feb 20</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                      <div>
                        <p className="font-medium text-sm">Quality Control Systems</p>
                        <p className="text-xs text-gray-600">Testing Lab - ISO Certified</p>
                        <p className="text-xs text-green-600">✓ Automated Calibration</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">₹6L</p>
                        <p className="text-xs text-gray-500">Next: Feb 18</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Equipment Uptime</span>
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-green-600">99.2%</span>
                        <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '99.2%'}}></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating metrics */}
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">₹2.1Cr</div>
                    <div className="text-xs text-gray-500">Contracts Managed</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-lg border">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">85% Less Downtime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Manufacturing Equipment Challenges
              </h2>
              <p className="text-xl text-gray-600">
                Based on analysis of 150+ manufacturing plants
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {manufacturingStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="font-medium text-gray-900">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.sublabel}</div>
                </div>
              ))}
            </div>

            {/* Pain Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {painPoints.map((point, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className={`w-12 h-12 bg-${point.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <div className={`text-${point.color}-600`}>
                      {point.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                  <p className="text-gray-600 mb-3">{point.description}</p>
                  <p className={`text-sm font-medium text-${point.color}-600 bg-${point.color}-50 px-3 py-1 rounded`}>
                    Impact: {point.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Manufacturing-Specific Solutions
              </h2>
              <p className="text-xl text-gray-600">
                Purpose-built for production facilities with uptime optimization
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {manufacturingSolutions.map((solution, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 border shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <div className="text-blue-600">
                        {solution.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{solution.title}</h3>
                      <p className="text-sm text-green-600 font-medium">{solution.contractExample}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  
                  <div className="space-y-2">
                    {solution.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Manufacturing Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Real results from manufacturing plants using ContractNest
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-semibold text-blue-600">
                        {caseStudies[activeCase].avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {caseStudies[activeCase].company}
                      </h3>
                      <p className="text-sm text-gray-600">{caseStudies[activeCase].industry}</p>
                      <p className="text-sm text-green-600 font-medium">
                        {caseStudies[activeCase].contractValue} managed
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                      <p className="text-gray-600">{caseStudies[activeCase].challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                      <p className="text-gray-600">{caseStudies[activeCase].solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Equipment Types:</h4>
                      <div className="flex flex-wrap gap-2">
                        {caseStudies[activeCase].equipmentTypes.map((type, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Results Achieved:</h4>
                  <div className="space-y-3">
                    {caseStudies[activeCase].results.map((result, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Case study indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {caseStudies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCase(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeCase ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Equipment Types */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Equipment We Help Manage
              </h2>
              <p className="text-xl text-gray-600">
                Service contracts for all types of manufacturing equipment
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipmentTypes.map((equipment, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border shadow-sm text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{equipment.name}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{equipment.contracts} contracts</span>
                    <span className="font-medium text-green-600">{equipment.avgValue} avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <SocialProof variant="stats-bar" />

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Optimize Your Manufacturing Operations?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join 134+ manufacturing plants already using ContractNest to reduce downtime and maintenance costs
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Calendar className="mr-2 h-5 w-5 inline" />
                Get Manufacturing Demo
              </button>
              <a
                href="tel:+919949701175"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                <Phone className="mr-2 h-5 w-5 inline" />
                Call Manufacturing Expert
              </a>
            </div>
            
            <p className="text-sm text-blue-200 mt-6">
              ✓ Free plant assessment ✓ ROI analysis ✓ 30-day trial
            </p>
          </div>
        </section>

        {/* Urgency Elements */}
        <UrgencyElements variant="limited-spots" />
        <UrgencyElements variant="exit-intent" onTrigger={() => setShowForm(true)} />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Factory className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">ContractNest</span>
              <span className="ml-2 text-gray-400">for Manufacturing</span>
            </div>
            <p className="text-gray-400 mb-6">
              Equipment maintenance and OEM service contract management
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <span>+91-9949701175</span>
              <span>•</span>
              <span>charan@contractnest.com</span>
              <span>•</span>
              <span>Hyderabad, India</span>
            </div>
          </div>
        </footer>

        {/* Conversion Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ConversionForm
                onSubmit={handleFormSubmit}
                className="relative"
              />
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManufacturingPage;