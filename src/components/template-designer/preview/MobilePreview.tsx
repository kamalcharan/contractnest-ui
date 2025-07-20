// src/components/template-designer/preview/MobilePreview.tsx
import React from 'react';
import {
  Smartphone,
  Wifi,
  Battery,
  Signal,
  ArrowLeft,
  MoreVertical,
  Send,
  Paperclip,
  Camera,
  Mic,
  X,
  Check,
  AlertCircle,
  Clock,
  ChevronRight,
  User,
  Calendar,
  FileText,
  Edit3,
  Download,
  Share2
} from 'lucide-react';

interface MobilePreviewProps {
  templateId: string;
  templateName: string;
  contractData?: {
    clientName?: string;
    contractValue?: string;
    status?: 'draft' | 'pending' | 'signed' | 'completed';
    lastModified?: Date;
  };
  onClose?: () => void;
  mode?: 'preview' | 'interactive' | 'embedded';
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({
  templateId,
  templateName,
  contractData = {
    clientName: 'John Doe',
    contractValue: '$50,000',
    status: 'pending',
    lastModified: new Date()
  },
  onClose,
  mode = 'preview'
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [showActions, setShowActions] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<Array<{
    id: string;
    type: 'system' | 'user' | 'bot';
    content: string;
    timestamp: Date;
  }>>([
    {
      id: '1',
      type: 'system',
      content: 'Contract ready for review',
      timestamp: new Date()
    }
  ]);

  const steps = [
    { id: 'review', label: 'Review Contract', icon: FileText },
    { id: 'sign', label: 'Add Signature', icon: Edit3 },
    { id: 'confirm', label: 'Confirm & Send', icon: Send }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-500 bg-gray-100';
      case 'pending': return 'text-orange-500 bg-orange-100';
      case 'signed': return 'text-blue-500 bg-blue-100';
      case 'completed': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }]);

    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I can help you with that. The contract terms are standard and include a 30-day payment period.',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-[390px] mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
        {/* Screen */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden" style={{ height: '844px' }}>
          {/* Status Bar */}
          <div className="bg-white px-6 py-2 flex justify-between items-center text-xs">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-3" />
            </div>
          </div>

          {/* App Header */}
          <div className="bg-blue-600 text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onClose && (
                  <button onClick={onClose} className="p-1">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="font-semibold text-lg">{templateName}</h1>
                  <p className="text-sm text-blue-100">Contract #{templateId.slice(0, 8)}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Action Menu */}
            {showActions && (
              <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg py-2 w-48 z-10">
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <Share2 className="w-4 h-4" />
                  Share Contract
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  View History
                </button>
              </div>
            )}
          </div>

          {/* Contract Status Card */}
          <div className="p-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-semibold text-gray-900">{contractData.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="font-semibold text-gray-900">{contractData.contractValue}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contractData.status || 'draft')}`}>
                  {contractData.status?.charAt(0).toUpperCase() + contractData.status?.slice(1)}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {contractData.lastModified?.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          {mode === 'interactive' && (
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div 
                      className={`flex flex-col items-center cursor-pointer ${
                        index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        index < currentStep ? 'bg-blue-600 text-white' :
                        index === currentStep ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100'
                      }`}>
                        {index < currentStep ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-center">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-6 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto" style={{ height: mode === 'interactive' ? '400px' : '500px' }}>
            {mode === 'preview' ? (
              // Document Preview Mode
              <div className="px-4 pb-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">1. Service Agreement</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    This Service Agreement is entered into between {contractData.clientName} ("Client") 
                    and the Company for professional services valued at {contractData.contractValue}.
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">2. Terms & Conditions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                      Payment terms: Net 30 days
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                      Deliverables as per Appendix A
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                      Confidentiality clause applies
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">3. Signatures</h3>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 mb-1">Client Signature</p>
                      <p className="text-xs text-gray-400">Click to sign</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 mb-1">Company Representative</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Chat/Interactive Mode
              <div className="px-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : message.type === 'bot'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-orange-100 text-orange-800 text-center w-full rounded-lg'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Area */}
          {mode === 'interactive' ? (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Edit3 className="w-5 h-5" />
                Sign Contract
              </button>
            </div>
          )}

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full" />
        </div>

        {/* Phone Notch */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl" />
      </div>
    </div>
  );
};

// Simplified mobile preview for embedding
export const MobilePreviewSimple: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full max-w-[390px] mx-auto">
      <div className="relative bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
        <div className="bg-white rounded-[1.75rem] overflow-hidden" style={{ minHeight: '600px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;