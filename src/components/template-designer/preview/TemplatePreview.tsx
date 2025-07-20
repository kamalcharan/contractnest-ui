// src/components/template-designer/preview/TemplatePreview.tsx
import React from 'react';
import {
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Sun,
  Moon,
  FileText,
  User,
  Calendar,
  Building
} from 'lucide-react';

interface TemplatePreviewProps {
  templateId: string;
  initialDevice?: 'mobile' | 'tablet' | 'desktop';
  onClose: () => void;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type ThemeType = 'light' | 'dark';

const deviceSizes = {
  mobile: { width: 375, height: 667, scale: 0.8 },
  tablet: { width: 768, height: 1024, scale: 0.6 },
  desktop: { width: 1200, height: 800, scale: 0.5 }
};

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateId,
  initialDevice = 'desktop',
  onClose
}) => {
  const [device, setDevice] = React.useState<DeviceType>(initialDevice);
  const [theme, setTheme] = React.useState<ThemeType>('light');
  const [zoom, setZoom] = React.useState(100);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait');
  const previewRef = React.useRef<HTMLDivElement>(null);

  // Sample preview data
  const sampleData = {
    companyName: 'Acme Corporation',
    clientName: 'John Doe',
    contractDate: new Date().toLocaleDateString(),
    contractValue: '$50,000',
    terms: '30 days',
    signatureFields: 2
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleRotate = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  const handleFullscreen = () => {
    if (!isFullscreen && previewRef.current) {
      previewRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleExport = () => {
    console.log('Exporting preview...');
  };

  const handleShare = () => {
    console.log('Sharing preview...');
  };

  const getDeviceFrameStyle = () => {
    const size = deviceSizes[device];
    const isLandscape = orientation === 'landscape' && device !== 'desktop';
    
    return {
      width: isLandscape ? size.height : size.width,
      height: isLandscape ? size.width : size.height,
      transform: `scale(${size.scale * (zoom / 100)})`,
      transformOrigin: 'center center'
    };
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col" ref={previewRef}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Template Preview
            </h2>

            {/* Device Selector */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded transition-colors ${
                  device === 'mobile' ? 'bg-white shadow-sm' : ''
                }`}
                title="Mobile"
              >
                <Smartphone className={`w-4 h-4 ${
                  device === 'mobile' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-2 rounded transition-colors ${
                  device === 'tablet' ? 'bg-white shadow-sm' : ''
                }`}
                title="Tablet"
              >
                <Tablet className={`w-4 h-4 ${
                  device === 'tablet' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </button>
              <button
                onClick={() => setDevice('desktop')}
                className={`p-2 rounded transition-colors ${
                  device === 'desktop' ? 'bg-white shadow-sm' : ''
                }`}
                title="Desktop"
              >
                <Monitor className={`w-4 h-4 ${
                  device === 'desktop' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 min-w-[50px] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Orientation */}
            {device !== 'desktop' && (
              <>
                <div className="h-6 w-px bg-gray-300" />
                <button
                  onClick={handleRotate}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4 text-gray-600" />
                </button>
              </>
            )}

            <div className="h-6 w-px bg-gray-300" />

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-gray-600" />
              ) : (
                <Sun className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Export"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden p-8">
        <div className="relative">
          {/* Device Frame */}
          <div
            className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
              device === 'mobile' ? 'rounded-3xl border-8 border-gray-800' : ''
            } ${
              device === 'tablet' ? 'rounded-2xl border-8 border-gray-700' : ''
            }`}
            style={getDeviceFrameStyle()}
          >
            {/* Device Notch (for mobile) */}
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl" />
            )}

            {/* Preview Content */}
            <div
              className={`h-full overflow-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
              style={{ padding: device === 'mobile' ? '20px' : '40px' }}
            >
              {/* Sample Contract Preview */}
              <div className={`max-w-4xl mx-auto ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold mb-2">Service Agreement</h1>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Contract ID: #{templateId.slice(0, 8)}
                  </p>
                </div>

                {/* Meta Information */}
                <div className={`grid grid-cols-2 gap-4 mb-8 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Company
                      </div>
                      <div className="font-medium">{sampleData.companyName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    <div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Client
                      </div>
                      <div className="font-medium">{sampleData.clientName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Date
                      </div>
                      <div className="font-medium">{sampleData.contractDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Value
                      </div>
                      <div className="font-medium">{sampleData.contractValue}</div>
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                  <section>
                    <h2 className="text-xl font-semibold mb-3">1. Scope of Services</h2>
                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3">2. Terms and Conditions</h2>
                    <ul className={`list-disc list-inside space-y-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <li>Payment terms: {sampleData.terms}</li>
                      <li>Service delivery within agreed timeframe</li>
                      <li>Quality assurance and support included</li>
                      <li>Confidentiality agreement in effect</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-3">3. Payment Schedule</h2>
                    <div className={`overflow-x-auto`}>
                      <table className="w-full">
                        <thead>
                          <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <th className="text-left py-2">Milestone</th>
                            <th className="text-left py-2">Amount</th>
                            <th className="text-left py-2">Due Date</th>
                          </tr>
                        </thead>
                        <tbody className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <td className="py-2">Initial Payment</td>
                            <td className="py-2">$20,000</td>
                            <td className="py-2">Upon signing</td>
                          </tr>
                          <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <td className="py-2">Milestone 1</td>
                            <td className="py-2">$15,000</td>
                            <td className="py-2">30 days</td>
                          </tr>
                          <tr>
                            <td className="py-2">Final Payment</td>
                            <td className="py-2">$15,000</td>
                            <td className="py-2">Upon completion</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Signature Section */}
                  <section className="mt-12">
                    <h2 className="text-xl font-semibold mb-6">4. Signatures</h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className={`border-2 border-dashed ${
                          theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                        } rounded-lg p-8 text-center`}>
                          <div className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mb-2`}>
                            Company Representative
                          </div>
                          <div className="font-medium">Sign Here</div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div>{sampleData.companyName}</div>
                          <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Date: _____________
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className={`border-2 border-dashed ${
                          theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                        } rounded-lg p-8 text-center`}>
                          <div className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mb-2`}>
                            Client
                          </div>
                          <div className="font-medium">Sign Here</div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div>{sampleData.clientName}</div>
                          <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Date: _____________
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
            {device.charAt(0).toUpperCase() + device.slice(1)} 
            {device !== 'desktop' && ` • ${orientation.charAt(0).toUpperCase() + orientation.slice(1)}`}
            {` • ${zoom}%`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;