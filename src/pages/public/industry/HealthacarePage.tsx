// src/pages/industries/HealthcarePage.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Heart, 
  Shield, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  AlertTriangle,
  Activity,
  Stethoscope,
  Building2,
  TrendingUp,
  Star,
  Phone,
  Calendar,
  ArrowRight
} from 'lucide-react';

// Import CRO components
import ConversionForm from '@/components/CRO/ConversionForm';
import SocialProof from '@/components/CRO/SocialProof';
import UrgencyElements from '@/components/CRO/UrgencyElements';

const HealthcarePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const healthcareStats = [
    { number: '₹7.6 Cr', label: 'Contracts Managed', sublabel: 'Apollo Jubilee Hills' },
    { number: '95%', label: 'SLA Compliance', sublabel: 'HIPAA Compliant' },
    { number: '70%', label: 'Time Saved', sublabel: 'Administrative Work' },
    { number: '156', label: 'Healthcare Facilities', sublabel: 'Already Exploring' }
  ];

  const painPoints = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Paper-Based Contract Management',
      description: 'Most healthcare contracts stored in filing cabinets or basic scanned documents',
      impact: '2+ hours daily spent searching for contract information',
      color: 'red'
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: 'SLA Compliance Gaps',
      description: 'Missing critical equipment maintenance and calibration deadlines',
      impact: '50%+ of service commitments exceed agreed timelines',
      color: 'orange'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Regulatory Documentation',
      description: 'Difficulty maintaining audit trails for HIPAA and accreditation',
      impact: 'Manual documentation increases compliance risk',
      color: 'blue'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Vendor Coordination Chaos',
      description: 'Multiple service providers with no central communication',
      impact: 'Equipment downtime due to poor coordination',
      color: 'purple'
    }
  ];

  const healthcareSolutions = [
    {
      title: 'Medical Equipment Maintenance',
      description: 'Automated scheduling for CT scanners, MRIs, ventilators, and critical care equipment',
      features: ['Preventive maintenance alerts', 'Emergency repair SLAs', 'Equipment history tracking'],
      contractExample: 'CT-Scan Annual Maintenance: ₹40L/year',
      icon: <Activity className="h-8 w-8" />
    },
    {
      title: 'Biomedical Calibration',
      description: 'Ensure accuracy of diagnostic equipment with automated calibration tracking',
      features: ['Calibration due date alerts', 'Certificate management', 'Compliance reporting'],
      contractExample: 'Lab Equipment Calibration: ₹15L/year',
      icon: <Stethoscope className="h-8 w-8" />
    },
    {
      title: 'Facility Management',
      description: 'HVAC, electrical, plumbing, and infrastructure maintenance for healthcare facilities',
      features: ['Critical system monitoring', 'Emergency response SLAs', 'Energy efficiency tracking'],
      contractExample: 'HVAC Maintenance: ₹25L/year',
      icon: <Building2 className="h-8 w-8" />
    },
    {
      title: 'HIPAA Compliance Tracking',
      description: 'Maintain audit trails and documentation for healthcare compliance',
      features: ['Automatic documentation', 'Audit trail generation', 'Compliance reporting'],
      contractExample: 'IT Security Services: ₹12L/year',
      icon: <Shield className="h-8 w-8" />
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Operations Director',
      hospital: 'City General Hospital',
      quote: 'ContractNest transformed how we manage our ₹7.6 crore worth of service contracts. Complete visibility into equipment maintenance schedules and vendor performance.',
      rating: 5,
      equipmentTypes: ['CT Scanners', 'MRI Machines', 'Ventilators'],
      contractCount: 47,
      avatar: 'PS'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Facilities Manager', 
      hospital: 'Apollo Jubilee Hills',
      quote: 'Finally, a platform that understands healthcare compliance. Our biomedical maintenance is now 100% on schedule with automated alerts.',
      rating: 5,
      equipmentTypes: ['Lab Equipment', 'HVAC Systems', 'Emergency Generators'],
      contractCount: 62,
      avatar: 'RK'
    },
    {
      name: 'Dr. Meera Patel',
      role: 'Chief Medical Officer',
      hospital: 'Fortis Healthcare',
      quote: 'The HIPAA compliance features give us peace of mind. Audit trails are automatically generated for all our service contracts.',
      rating: 5,
      equipmentTypes: ['Diagnostic Equipment', 'IT Infrastructure', 'Medical Devices'],
      contractCount: 89,
      avatar: 'MP'
    }
  ];

  const complianceFeatures = [
    { feature: 'HIPAA Compliance', status: 'Built-in' },
    { feature: 'Joint Commission Ready', status: 'Supported' },
    { feature: 'FDA 21 CFR Part 11', status: 'Compatible' },
    { feature: 'ISO 13485', status: 'Audit Trail' },
    { feature: 'State Health Dept', status: 'Reporting' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = (formData) => {
    console.log('Healthcare form submission:', formData);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'healthcare_lead', {
        event_category: 'industry_conversion',
        event_label: 'healthcare_page',
        value: formData.leadScore,
        custom_parameters: {
          hospital_size: formData.businessSize,
          contract_count: formData.currentContracts,
          compliance_focus: 'healthcare'
        }
      });
    }
    
    setShowForm(false);
    alert(`Thank you ${formData.fullName}! Our healthcare specialist will contact you within 4 hours to discuss HIPAA-compliant contract management.`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Healthcare Contract Management - HIPAA Compliant Solutions",
    "description": "Specialized service contract management for healthcare organizations with automated compliance tracking and equipment maintenance scheduling.",
    "url": "https://contractnest.com/industries/healthcare",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "ContractNest for Healthcare",
      "applicationCategory": "HealthcareApplication",
      "operatingSystem": "Web Browser",
      "description": "HIPAA-compliant contract management platform for hospitals and healthcare facilities",
      "featureList": [
        "Medical equipment maintenance tracking",
        "HIPAA compliance automation",
        "Biomedical calibration management", 
        "Facility management contracts",
        "Regulatory audit trails"
      ],
      "offers": {
        "@type": "Offer",
        "price": "150",
        "priceCurrency": "INR", 
        "billingPeriod": "P3M"
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "ContractNest",
      "url": "https://contractnest.com"
    }
  };

  return (
    <>
      <Helmet>
        <title>Healthcare Contract Management - HIPAA Compliant Solutions | ContractNest</title>
        <meta name="description" content="Specialized service contract management for healthcare organizations with automated compliance tracking and equipment maintenance scheduling. HIPAA compliant with audit trails." />
        <meta name="keywords" content="healthcare contract management, HIPAA compliant software, medical equipment maintenance, biomedical calibration, hospital facility management, healthcare compliance tracking" />
        <link rel="canonical" href="https://contractnest.com/industries/healthcare" />
        
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
                <Heart className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-xl font-bold">ContractNest</span>
                <span className="ml-2 text-sm text-gray-500">for Healthcare</span>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Get Healthcare Demo
              </button>
            </div>
          </div>
        </nav>

        {/* Urgency Banner */}
        <UrgencyElements variant="scarcity-banner" />

        {/* Hero Section */}
        <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    🏥 Healthcare Specialized
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  HIPAA-Compliant Contract Management for 
                  <span className="text-blue-600"> Healthcare Facilities</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                  Streamline medical equipment maintenance, biomedical calibration, 
                  and facility management contracts with automated compliance tracking. 
                  <strong>From ₹12L IT services to ₹40L medical equipment contracts.</strong>
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    HIPAA Compliant
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Joint Commission Ready
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automated Audit Trails
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
                >
                  Get Healthcare Demo
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>

                <p className="text-sm text-gray-500">
                  ✓ Free HIPAA compliance consultation ✓ 30-day trial ✓ No setup fees
                </p>
              </div>

              <div className="relative">
                <div className="bg-white rounded-xl shadow-2xl p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Medical Equipment Contracts</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Live</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                      <div>
                        <p className="font-medium text-sm">CT-Scan Maintenance</p>
                        <p className="text-xs text-gray-600">Room 3 - GE Healthcare</p>
                        <p className="text-xs text-green-600">✓ HIPAA Compliant</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₹40L</p>
                        <p className="text-xs text-gray-500">Next: Feb 15</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-500">
                      <div>
                        <p className="font-medium text-sm">Biomedical Calibration</p>
                        <p className="text-xs text-gray-600">Lab Equipment - 47 devices</p>
                        <p className="text-xs text-green-600">✓ FDA 21 CFR Part 11</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹15L</p>
                        <p className="text-xs text-gray-500">Next: Feb 20</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded border-l-4 border-purple-500">
                      <div>
                        <p className="font-medium text-sm">HVAC Critical Systems</p>
                        <p className="text-xs text-gray-600">OR & ICU Climate Control</p>
                        <p className="text-xs text-green-600">✓ Joint Commission Ready</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">₹25L</p>
                        <p className="text-xs text-gray-500">Next: Feb 18</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compliance Score</span>
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-green-600">98%</span>
                        <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '98%'}}></div>
                    </div>
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
                Healthcare Contract Management Challenges
              </h2>
              <p className="text-xl text-gray-600">
                Based on research from 200+ healthcare facilities
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {healthcareStats.map((stat, index) => (
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
                Healthcare-Specific Solutions
              </h2>
              <p className="text-xl text-gray-600">
                Purpose-built for medical facilities with compliance automation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {healthcareSolutions.map((solution, index) => (
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

        {/* Testimonials */}
        <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              What Healthcare Professionals Say
            </h2>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl text-gray-700 mb-6 italic">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {testimonials[activeTestimonial].avatar}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</div>
                  <div className="text-sm text-gray-600">{testimonials[activeTestimonial].role}</div>
                  <div className="text-sm text-blue-600">{testimonials[activeTestimonial].hospital}</div>
                </div>
              </div>
              
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
                <span>{testimonials[activeTestimonial].contractCount} contracts managed</span>
                <span>•</span>
                <span>{testimonials[activeTestimonial].equipmentTypes.join(', ')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Built for Healthcare Compliance
              </h2>
              <p className="text-xl text-gray-600">
                Automated compliance tracking for healthcare regulations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {complianceFeatures.map((item, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-lg border shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.feature}</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {item.status}
                  </span>
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
              Ready to Streamline Your Healthcare Contracts?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join 156+ healthcare facilities already using ContractNest for HIPAA-compliant contract management
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Calendar className="mr-2 h-5 w-5 inline" />
                Get Healthcare Demo
              </button>
              <a
                href="tel:+919949701175"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                <Phone className="mr-2 h-5 w-5 inline" />
                Call Healthcare Specialist
              </a>
            </div>
            
            <p className="text-sm text-blue-200 mt-6">
              ✓ HIPAA compliance consultation ✓ Free 30-day trial ✓ Dedicated healthcare support
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
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-2xl font-bold">ContractNest</span>
              <span className="ml-2 text-gray-400">for Healthcare</span>
            </div>
            <p className="text-gray-400 mb-6">
              HIPAA-compliant contract management for healthcare facilities
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

export default HealthcarePage;