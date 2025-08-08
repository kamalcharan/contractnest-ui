
//src/components/CRO/InteractiveDemo.tsx

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Monitor, Users, FileText, Bell, IndianRupee, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('giver');

  const personas = {
    giver: {
      name: 'Service Provider',
      role: 'Dr. Sarah (Hospital Equipment Manager)',
      color: 'blue',
      icon: <Users className="h-4 w-4" />,
      description: 'Manages multiple service contracts for medical equipment'
    },
    receiver: {
      name: 'Service Recipient', 
      role: 'Raj (Manufacturing Plant Manager)',
      color: 'green',
      icon: <Monitor className="h-4 w-4" />,
      description: 'Needs visibility into equipment maintenance schedules'
    }
  };

  const demoSteps = {
    giver: [
      {
        title: 'Create Service Contract',
        description: 'Set up a new equipment maintenance contract in under 3 minutes',
        mockData: {
          contractTitle: 'CT-Scan Annual Maintenance',
          client: 'City General Hospital',
          value: '₹40,00,000',
          duration: '12 months',
          slaItems: ['Monthly preventive maintenance', 'Emergency repairs (4hr response)', 'Quarterly calibration']
        },
        ui: 'contract-creation'
      },
      {
        title: 'Invite Client & Set Visibility',
        description: 'Client gets automatic access to track service commitments',
        mockData: {
          inviteEmail: 'operations@citygeneral.hospital',
          permissions: ['View service schedules', 'Receive compliance reports', 'Access payment history'],
          status: 'Invitation sent - Auto-accepted'
        },
        ui: 'client-invitation'
      },
      {
        title: 'Automated Compliance Tracking',
        description: 'System monitors SLA adherence and sends proactive alerts',
        mockData: {
          upcomingServices: [
            { type: 'Preventive Maintenance', due: '2024-02-15', status: 'scheduled' },
            { type: 'Calibration Check', due: '2024-02-20', status: 'pending' }
          ],
          complianceScore: 94,
          alerts: ['Service due in 3 days', 'Client approval pending for calibration']
        },
        ui: 'compliance-dashboard'
      },
      {
        title: 'Smart Invoicing & Payments',
        description: 'Automated invoices based on completed services and milestones',
        mockData: {
          invoiceAmount: '₹10,00,000',
          servicesPeriod: 'Q1 2024',
          paymentStatus: 'Paid',
          nextInvoice: '₹10,00,000 due Apr 1, 2024'
        },
        ui: 'invoicing-system'
      }
    ],
    receiver: [
      {
        title: 'View All Service Contracts',
        description: 'Complete visibility into all active service agreements',
        mockData: {
          totalContracts: 23,
          totalValue: '₹2,30,00,000',
          activeServices: [
            { vendor: 'MedEquip Services', type: 'CT-Scan Maintenance', status: 'active', nextService: 'Feb 15' },
            { vendor: 'HVAC Solutions', type: 'Climate Control', status: 'active', nextService: 'Feb 18' },
            { vendor: 'Elevator Co.', type: 'Lift Maintenance', status: 'pending', nextService: 'Feb 12' }
          ]
        },
        ui: 'contract-overview'
      },
      {
        title: 'Real-time Service Tracking',
        description: 'Know exactly what services are happening when',
        mockData: {
          todayServices: [
            { time: '10:00 AM', vendor: 'MedEquip', service: 'Preventive maintenance - CT Scanner Room 3', status: 'in-progress' },
            { time: '2:00 PM', vendor: 'HVAC Solutions', service: 'Filter replacement - ICU Wing', status: 'scheduled' }
          ],
          weeklySchedule: 7,
          completionRate: '96%'
        },
        ui: 'service-tracking'
      },
      {
        title: 'Compliance & Documentation',
        description: 'Automatic compliance reports and service documentation',
        mockData: {
          complianceStatus: 'Fully Compliant',
          lastAudit: 'Jan 2024 - No issues found',
          documents: ['Service certificates', 'Calibration reports', 'Maintenance logs'],
          upcomingAudits: 'Biomedical audit - Mar 15, 2024'
        },
        ui: 'compliance-reports'
      },
      {
        title: 'Payment & Budget Tracking',
        description: 'Clear visibility into service costs and upcoming payments',
        mockData: {
          monthlySpend: '₹18,50,000',
          budgetUtilization: '78%',
          upcomingPayments: [
            { vendor: 'MedEquip Services', amount: '₹10,00,000', due: 'Mar 1' },
            { vendor: 'HVAC Solutions', amount: '₹2,50,000', due: 'Mar 5' }
          ]
        },
        ui: 'payment-tracking'
      }
    ]
  };

  const currentSteps = demoSteps[selectedPersona];
  const currentData = currentSteps[currentStep];

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < currentSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000);
    } else if (currentStep >= currentSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, currentSteps.length]);

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const PersonaCard = ({ persona, personaKey, isSelected, onClick }) => (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? `border-${persona.color}-500 bg-${persona.color}-50` : 'border-gray-200 hover:border-gray-300'}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-sm">
          {persona.icon}
          <span>{persona.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-medium text-gray-700">{persona.role}</p>
        <p className="text-xs text-gray-500 mt-1">{persona.description}</p>
      </CardContent>
    </Card>
  );

  const renderMockUI = () => {
    const { ui, mockData } = currentData;
    
    switch (ui) {
      case 'contract-creation':
        return (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">New Service Contract</h3>
              <Badge variant="outline" className="text-green-600">Draft</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500">Contract Title</label>
                <p className="font-medium">{mockData.contractTitle}</p>
              </div>
              <div>
                <label className="text-gray-500">Client</label>
                <p className="font-medium">{mockData.client}</p>
              </div>
              <div>
                <label className="text-gray-500">Annual Value</label>
                <p className="font-medium text-green-600">{mockData.value}</p>
              </div>
              <div>
                <label className="text-gray-500">Duration</label>
                <p className="font-medium">{mockData.duration}</p>
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-sm">SLA Commitments</label>
              <ul className="mt-1 space-y-1">
                {mockData.slaItems.map((item, idx) => (
                  <li key={idx} className="text-sm flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'client-invitation':
        return (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Client Access Setup</h3>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-500">Invited Email</label>
                <p className="font-medium">{mockData.inviteEmail}</p>
              </div>
              <div>
                <label className="text-gray-500">Client Permissions</label>
                <ul className="mt-1 space-y-1">
                  {mockData.permissions.map((permission, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-sm">{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <p className="text-green-700 text-sm">✓ {mockData.status}</p>
              </div>
            </div>
          </div>
        );

      case 'compliance-dashboard':
        return (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Compliance Dashboard</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">{mockData.complianceScore}%</span>
                <span className="text-sm text-gray-500">SLA Score</span>
              </div>
            </div>
            
            <div>
              <label className="text-gray-500 text-sm">Upcoming Services</label>
              <div className="mt-2 space-y-2">
                {mockData.upcomingServices.map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{service.type}</p>
                      <p className="text-xs text-gray-500">Due: {service.due}</p>
                    </div>
                    <Badge variant={service.status === 'scheduled' ? 'default' : 'secondary'}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Active Alerts</label>
              <div className="mt-2 space-y-1">
                {mockData.alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <Bell className="h-4 w-4 text-orange-500" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'invoicing-system':
        return (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Smart Invoicing</h3>
              <Badge className="bg-green-100 text-green-800">Automated</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500">Current Invoice</label>
                <p className="font-bold text-lg text-green-600">{mockData.invoiceAmount}</p>
                <p className="text-xs text-gray-500">For {mockData.servicesPeriod}</p>
              </div>
              <div>
                <label className="text-gray-500">Payment Status</label>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-600">{mockData.paymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Next Scheduled Invoice</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">{mockData.nextInvoice}</p>
            </div>
          </div>
        );

      case 'contract-overview':
        return (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">My Service Contracts</h3>
              <div className="text-right text-sm">
                <p className="font-bold">{mockData.totalContracts} Active</p>
                <p className="text-gray-500">{mockData.totalValue} Total Value</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {mockData.activeServices.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-sm">{service.vendor}</p>
                    <p className="text-xs text-gray-500">{service.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                      {service.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">Next: {service.nextService}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'service-tracking':
        return (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Today's Services</h3>
              <div className="text-right text-sm">
                <p className="font-bold text-green-600">{mockData.completionRate}</p>
                <p className="text-gray-500">Completion Rate</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {mockData.todayServices.map((service, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2 border-l-4 border-blue-500 bg-blue-50">
                  <div className="text-sm font-medium text-blue-700">{service.time}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.vendor}</p>
                    <p className="text-xs text-gray-600">{service.service}</p>
                  </div>
                  <Badge variant={service.status === 'in-progress' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm text-gray-600">
                <strong>{mockData.weeklySchedule} services</strong> scheduled this week
              </p>
            </div>
          </div>
        );

      case 'compliance-reports':
        return (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Compliance Status</h3>
              <Badge className="bg-green-100 text-green-800">{mockData.complianceStatus}</Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <label className="text-gray-500">Last Audit</label>
                <p className="font-medium">{mockData.lastAudit}</p>
              </div>
              
              <div>
                <label className="text-gray-500">Available Documents</label>
                <div className="mt-1 space-y-1">
                  {mockData.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800 text-sm font-medium">Upcoming</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">{mockData.upcomingAudits}</p>
              </div>
            </div>
          </div>
        );

      case 'payment-tracking':
        return (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Payment Dashboard</h3>
              <div className="text-right text-sm">
                <p className="font-bold text-lg">{mockData.monthlySpend}</p>
                <p className="text-gray-500">This Month</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Budget Utilization</span>
                <span className="font-medium">{mockData.budgetUtilization}</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div>
              <label className="text-gray-500 text-sm">Upcoming Payments</label>
              <div className="mt-2 space-y-2">
                {mockData.upcomingPayments.map((payment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium text-sm">{payment.vendor}</p>
                      <p className="text-xs text-gray-500">Due: {payment.due}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{payment.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Demo content loading...</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">See ContractNest in Action</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience how service providers and recipients collaborate seamlessly. 
          Choose your perspective and see the platform from your viewpoint.
        </p>
      </div>

      {/* Persona Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {Object.entries(personas).map(([key, persona]) => (
          <PersonaCard 
            key={key}
            persona={persona}
            personaKey={key}
            isSelected={selectedPersona === key}
            onClick={() => {
              setSelectedPersona(key);
              resetDemo();
            }}
          />
        ))}
      </div>

      {/* Demo Controls */}
      <div className="flex justify-center items-center space-x-4">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          variant={isPlaying ? "secondary" : "default"}
          className="flex items-center space-x-2"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{isPlaying ? 'Pause Demo' : 'Start Demo'}</span>
        </Button>
        
        <Button onClick={resetDemo} variant="outline" className="flex items-center space-x-2">
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentStep + 1} of {currentSteps.length}</span>
          <span>{Math.round(((currentStep + 1) / currentSteps.length) * 100)}% Complete</span>
        </div>
        <Progress value={((currentStep + 1) / currentSteps.length) * 100} className="h-2" />
      </div>

      {/* Demo Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step Description */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  {currentStep + 1}
                </span>
                <span>{currentData.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{currentData.description}</p>
              
              {/* Step Navigation */}
              <div className="mt-4 flex space-x-2">
                {currentSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`px-3 py-1 text-xs rounded ${
                      idx === currentStep 
                        ? 'bg-blue-500 text-white' 
                        : idx < currentStep
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Why {personas[selectedPersona].name}s Love This
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {selectedPersona === 'giver' ? [
                  '70% reduction in administrative time',
                  'Automated compliance tracking and alerts', 
                  'Improved client satisfaction and retention',
                  'Faster payment cycles with automated invoicing'
                ] : [
                  'Complete visibility into all service commitments',
                  'Proactive alerts for upcoming services',
                  'Automated compliance documentation',
                  'Clear payment tracking and budget management'
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Mock UI */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-500 ml-2">ContractNest Dashboard</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {personas[selectedPersona].role}
              </Badge>
            </div>
            
            {renderMockUI()}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold">Ready to Transform Your Service Contracts?</h3>
        <p className="text-gray-600">
          See how ContractNest can work specifically for your business. 
          Book a personalized demo with real scenarios from your industry.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2">
            Book Live Demo Call
          </Button>
          <Button variant="outline" className="px-6 py-2">
            Start Free Trial
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          ✓ 30-minute personalized consultation ✓ No pressure, just insights ✓ First 10 contracts free
        </p>
      </div>
    </div>
  );
};

export default InteractiveDemo;