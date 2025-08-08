// src/pages/contracts/create/templates/preview.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  X, 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Tag,
  Building2,
  User,
  AlertCircle,
  Loader2,
  Download,
  BookOpen,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';

// Import components and hooks
import { useTemplates, useTemplateSelection } from '../../../../hooks/contracts/useTemplates';
import { Template } from '../../../../types/contracts/template';
import { 
  getContractTypeConfig, 
  getIndustryConfig,
  TEMPLATE_COMPLEXITY_LABELS,
  TEMPLATE_COMPLEXITY_DESCRIPTIONS 
} from '../../../../utils/constants/contracts/contractTypes';

// Mock block data for preview
const BLOCK_PREVIEW_DATA = {
  'contact': {
    name: 'Contact Information',
    description: 'Customer or partner contact details and business information',
    icon: Users,
    category: 'core',
    estimatedFields: 8,
    required: true,
    features: ['Contact details', 'Business information', 'Communication preferences']
  },
  'base-details': {
    name: 'Contract Details', 
    description: 'Basic contract information including title, dates, and description',
    icon: FileText,
    category: 'core',
    estimatedFields: 6,
    required: true,
    features: ['Contract title', 'Start/end dates', 'Description', 'Priority level']
  },
  'equipment': {
    name: 'Equipment Selection',
    description: 'Select and configure equipment or assets covered by this contract',
    icon: Settings,
    category: 'core',
    estimatedFields: 12,
    required: false,
    features: ['Equipment catalog', 'Serial numbers', 'Specifications', 'Location tracking']
  },
  'acceptance-criteria': {
    name: 'Acceptance Criteria',
    description: 'Define how and when the contract becomes active',
    icon: CheckCircle,
    category: 'core',
    estimatedFields: 4,
    required: true,
    features: ['Payment triggers', 'Sign-off requirements', 'Auto-activation rules']
  },
  'calibration': {
    name: 'Calibration Services',
    description: 'Equipment calibration schedules and procedures',
    icon: Settings,
    category: 'event',
    estimatedFields: 10,
    required: false,
    features: ['Calibration cycles', 'Parameter tracking', 'Compliance reports', 'Scheduling']
  },
  'billing': {
    name: 'Billing Configuration',
    description: 'Payment terms, billing frequency, and invoice settings',
    icon: DollarSign,
    category: 'commercial',
    estimatedFields: 8,
    required: true,
    features: ['Billing frequency', 'Payment terms', 'Late fees', 'Tax configuration']
  },
  'terms': {
    name: 'Terms & Conditions',
    description: 'Legal clauses, terms, and conditions for the contract',
    icon: BookOpen,
    category: 'content',
    estimatedFields: 5,
    required: true,
    features: ['Legal clauses', 'Terms library', 'Custom conditions', 'Compliance requirements']
  }
};

const TemplatePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  
  const templateId = searchParams.get('id');
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(0);

  // Template selection hook
  const { selectedTemplate, selectTemplate, isSelected } = useTemplateSelection();
  
  // Get template by ID hook
  const { getTemplateById } = useTemplates();

  // Load template data
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) {
        setError('Template ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const templateData = getTemplateById(templateId);
        if (!templateData) {
          setError('Template not found');
        } else {
          setTemplate(templateData);
        }
      } catch (err) {
        setError('Failed to load template');
        console.error('Error loading template:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, getTemplateById]);

  // Handle template selection
  const handleTemplateSelect = () => {
    if (!template) return;
    
    selectTemplate(template);
    toast({
      title: "Template Selected",
      description: `${template.name} is ready for contract creation.`
    });
    
    // Navigate to next step
    navigate(`/contracts/create/contract-type?template=${template.id}`);
  };

  // Get configurations
  const contractTypeConfig = template ? getContractTypeConfig(template.contractType) : null;
  const industryConfig = template ? getIndustryConfig(template.industry) : null;
  const complexityLabel = template ? TEMPLATE_COMPLEXITY_LABELS[template.complexity] : '';
  const complexityDescription = template ? TEMPLATE_COMPLEXITY_DESCRIPTIONS[template.complexity] : '';

  // Get block details for preview
  const getBlockDetails = (blockId: string) => {
    return BLOCK_PREVIEW_DATA[blockId as keyof typeof BLOCK_PREVIEW_DATA] || {
      name: blockId,
      description: 'Configuration block',
      icon: FileText,
      category: 'content',
      estimatedFields: 5,
      required: false,
      features: ['Custom configuration']
    };
  };

  // Calculate total estimated fields
  const totalEstimatedFields = template?.blocks.reduce((total, blockId) => {
    const blockDetails = getBlockDetails(blockId);
    return total + blockDetails.estimatedFields;
  }, 0) || 0;

  // Render rating stars
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }} />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800';
      case 'complex':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading template preview...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Template Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The requested template could not be found.'}
          </p>
          <button
            onClick={() => navigate('/contracts/create/templates')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/contracts/create/templates')}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Template Preview</h1>
                <p className="text-sm text-muted-foreground">Review template details before selection</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleTemplateSelect}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isSelected(template.id)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {isSelected(template.id) ? 'Selected' : 'Use This Template'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Header */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                  {industryConfig?.icon || '📄'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">{template.name}</h2>
                    {template.isPopular && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center gap-1 dark:bg-orange-900/20 dark:text-orange-200">
                        <TrendingUp className="h-3 w-3" />
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{template.description}</p>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {industryConfig?.name || template.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {renderRating(template.rating)}
                      </div>
                      <span className="text-foreground font-medium ml-1">{template.rating.toFixed(1)}</span>
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {template.usageCount} times used
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {template.estimatedDuration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border border-border"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contract Type & Complexity */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  template.contractType === 'service' 
                    ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800'
                    : 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-800'
                }`}>
                  {contractTypeConfig?.name}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getComplexityColor(template.complexity)}`}>
                  {complexityLabel}
                </span>
              </div>
            </div>

            {/* Template Features */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Template Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contractTypeConfig?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suitable For */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Best Suited For</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contractTypeConfig?.suitableFor.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Block Configuration */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Contract Blocks ({template.blocks.length})
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                This template includes the following configuration blocks:
              </p>
              
              <div className="space-y-3">
                {template.blocks.map((blockId, index) => {
                  const blockDetails = getBlockDetails(blockId);
                  const IconComponent = blockDetails.icon;
                  
                  return (
                    <div
                      key={blockId}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedBlockIndex === index 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/30 hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedBlockIndex(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          blockDetails.category === 'core' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' :
                          blockDetails.category === 'event' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                          blockDetails.category === 'commercial' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-900/20'
                        }`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{blockDetails.name}</h4>
                            {blockDetails.required && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/20 dark:text-red-200">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{blockDetails.description}</p>
                          <div className="text-xs text-muted-foreground">
                            ~{blockDetails.estimatedFields} fields
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contract Type</span>
                  <span className="text-sm font-medium text-foreground">{contractTypeConfig?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Complexity</span>
                  <span className="text-sm font-medium text-foreground">{complexityLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Setup Time</span>
                  <span className="text-sm font-medium text-foreground">{contractTypeConfig?.estimatedSetupTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Fields</span>
                  <span className="text-sm font-medium text-foreground">~{totalEstimatedFields}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Blocks</span>
                  <span className="text-sm font-medium text-foreground">{template.blocks.length}</span>
                </div>
              </div>
            </div>

            {/* Complexity Details */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Complexity Level</h3>
              <div className={`p-4 rounded-lg border ${getComplexityColor(template.complexity)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">{complexityLabel}</span>
                </div>
                <p className="text-sm">{complexityDescription}</p>
              </div>
            </div>

            {/* Selected Block Details */}
            {template.blocks[selectedBlockIndex] && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Block Details</h3>
                {(() => {
                  const blockDetails = getBlockDetails(template.blocks[selectedBlockIndex]);
                  const IconComponent = blockDetails.icon;
                  
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          blockDetails.category === 'core' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' :
                          blockDetails.category === 'event' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                          blockDetails.category === 'commercial' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-900/20'
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{blockDetails.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{blockDetails.category} Block</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{blockDetails.description}</p>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-foreground">Includes:</h5>
                        {blockDetails.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                            <span className="text-xs text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-card border border-border rounded-lg p-6">
              <button
                onClick={handleTemplateSelect}
                className={`w-full mb-3 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isSelected(template.id)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <CheckCircle className="h-5 w-5" />
                {isSelected(template.id) ? 'Template Selected' : 'Use This Template'}
              </button>
              
              <button
                onClick={() => navigate('/contracts/create/templates')}
                className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-foreground"
              >
                Back to Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewPage;