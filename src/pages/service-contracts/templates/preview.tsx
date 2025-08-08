// src/pages/service-contracts/templates/preview.tsx

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
import { useTheme } from "../../../contexts/ThemeContext";
import { useToast } from '@/components/ui/use-toast';

// Import components and hooks
import { useTemplates, useTemplateSelection } from "../../../hooks/service-contracts/templates/useTemplates.ts";
import { Template } from '../../../../types/service-contracts/template.ts';
import { 
  getContractTypeConfig, 
  getIndustryConfig
} from '@/utils/service-contracts/contractTypes';

import {
  TEMPLATE_COMPLEXITY_LABELS,
  TEMPLATE_COMPLEXITY_DESCRIPTIONS 
} from '@/types/service-contracts/template';

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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
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
    navigate(`/contracts?action=create&template=${template.id}`);
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
        <Star 
          key={i} 
          className="h-4 w-4"
          style={{ 
            fill: colors.semantic.warning, 
            color: colors.semantic.warning 
          }}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star 
            className="h-4 w-4"
            style={{ color: colors.utility.secondaryText + '50' }}
          />
          <Star 
            className="h-4 w-4 absolute top-0 left-0 overflow-hidden"
            style={{ 
              width: '50%',
              fill: colors.semantic.warning, 
              color: colors.semantic.warning 
            }}
          />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="h-4 w-4"
          style={{ color: colors.utility.secondaryText + '50' }}
        />
      );
    }

    return stars;
  };

  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return {
          bg: colors.semantic.success + '10',
          text: colors.semantic.success,
          border: colors.semantic.success + '20'
        };
      case 'medium':
        return {
          bg: colors.semantic.warning + '10',
          text: colors.semantic.warning,
          border: colors.semantic.warning + '20'
        };
      case 'complex':
        return {
          bg: colors.semantic.error + '10',
          text: colors.semantic.error,
          border: colors.semantic.error + '20'
        };
      default:
        return {
          bg: colors.utility.secondaryText + '10',
          text: colors.utility.secondaryText,
          border: colors.utility.secondaryText + '20'
        };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core':
        return colors.brand.primary + '10';
      case 'event':
        return colors.semantic.success + '10';
      case 'commercial':
        return colors.brand.secondary + '10';
      default:
        return colors.utility.secondaryText + '10';
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case 'core':
        return colors.brand.primary;
      case 'event':
        return colors.semantic.success;
      case 'commercial':
        return colors.brand.secondary;
      default:
        return colors.utility.secondaryText;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center">
          <Loader2 
            className="h-8 w-8 animate-spin mx-auto mb-4"
            style={{ color: colors.brand.primary }}
          />
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Loading template preview...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !template) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center max-w-md">
          <AlertCircle 
            className="h-16 w-16 mx-auto mb-4"
            style={{ color: colors.semantic.error }}
          />
          <h2 
            className="text-xl font-semibold mb-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Template Not Found
          </h2>
          <p 
            className="mb-6 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {error || 'The requested template could not be found.'}
          </p>
          <button
            onClick={() => navigate('/templates/admin/global-templates')}
            className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  const complexityColors = getComplexityColor(template.complexity);

  return (
    <div 
      className="min-h-screen transition-colors"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      {/* Header */}
      <div 
        className="border-b sticky top-0 z-40 transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/templates/admin/global-templates')}
                className="p-2 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: colors.utility.secondaryText + '10' }}
              >
                <ArrowLeft 
                  className="h-5 w-5"
                  style={{ color: colors.utility.secondaryText }}
                />
              </button>
              <div>
                <h1 
                  className="text-xl font-semibold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Template Preview
                </h1>
                <p 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Review template details before selection
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleTemplateSelect}
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-white hover:opacity-90"
                style={{
                  background: isSelected(template.id)
                    ? `linear-gradient(to right, ${colors.semantic.success}, ${colors.semantic.success}dd)`
                    : `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
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
            <div 
              className="border rounded-lg p-6 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl transition-colors"
                  style={{ backgroundColor: colors.brand.primary + '10' }}
                >
                  {industryConfig?.icon || '📄'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 
                      className="text-2xl font-bold transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {template.name}
                    </h2>
                    {template.isPopular && (
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 transition-colors"
                        style={{
                          backgroundColor: colors.semantic.warning + '10',
                          color: colors.semantic.warning
                        }}
                      >
                        <TrendingUp className="h-3 w-3" />
                        Popular
                      </span>
                    )}
                  </div>
                  <p 
                    className="mb-3 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {template.description}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span 
                      className="flex items-center gap-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      <Building2 className="h-4 w-4" />
                      {industryConfig?.name || template.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {renderRating(template.rating)}
                      </div>
                      <span 
                        className="font-medium ml-1 transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {template.rating.toFixed(1)}
                      </span>
                    </span>
                    <span 
                      className="flex items-center gap-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      <Users className="h-4 w-4" />
                      {template.usageCount} times used
                    </span>
                    <span 
                      className="flex items-center gap-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
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
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border transition-colors"
                    style={{
                      backgroundColor: colors.utility.secondaryText + '10',
                      color: colors.utility.secondaryText,
                      borderColor: colors.utility.secondaryText + '20'
                    }}
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contract Type & Complexity */}
              <div className="flex items-center gap-3">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium border transition-colors"
                  style={{
                    backgroundColor: template.contractType === 'service' 
                      ? colors.brand.primary + '10'
                      : colors.brand.secondary + '10',
                    color: template.contractType === 'service' 
                      ? colors.brand.primary
                      : colors.brand.secondary,
                    borderColor: template.contractType === 'service' 
                      ? colors.brand.primary + '20'
                      : colors.brand.secondary + '20'
                  }}
                >
                  {contractTypeConfig?.name}
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium border transition-colors"
                  style={{
                    backgroundColor: complexityColors.bg,
                    color: complexityColors.text,
                    borderColor: complexityColors.border
                  }}
                >
                  {complexityLabel}
                </span>
              </div>
            </div>

            {/* Template Features */}
            <div 
              className="border rounded-lg p-6 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Template Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contractTypeConfig?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle 
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: colors.semantic.success }}
                    />
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suitable For */}
            <div 
              className="border rounded-lg p-6 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Best Suited For
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contractTypeConfig?.suitableFor.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Zap 
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: colors.brand.primary }}
                    />
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {useCase}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Block Configuration */}
            <div 
              className="border rounded-lg p-6 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Contract Blocks ({template.blocks.length})
              </h3>
              <p 
                className="text-sm mb-4 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                This template includes the following configuration blocks:
              </p>
              
              <div className="space-y-3">
                {template.blocks.map((blockId, index) => {
                  const blockDetails = getBlockDetails(blockId);
                  const IconComponent = blockDetails.icon;
                  
                  return (
                    <div
                      key={blockId}
                      className="p-4 rounded-lg border cursor-pointer transition-all"
                      style={{
                        borderColor: selectedBlockIndex === index 
                          ? colors.brand.primary 
                          : colors.utility.secondaryText + '20',
                        backgroundColor: selectedBlockIndex === index 
                          ? colors.brand.primary + '05' 
                          : 'transparent'
                      }}
                      onClick={() => setSelectedBlockIndex(index)}
                      onMouseEnter={(e) => {
                        if (selectedBlockIndex !== index) {
                          e.currentTarget.style.borderColor = colors.brand.primary + '30';
                          e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '05';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedBlockIndex !== index) {
                          e.currentTarget.style.borderColor = colors.utility.secondaryText + '20';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{
                            backgroundColor: getCategoryColor(blockDetails.category),
                            color: getCategoryTextColor(blockDetails.category)
                          }}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 
                              className="font-medium transition-colors"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {blockDetails.name}
                            </h4>
                            {blockDetails.required && (
                              <span 
                                className="px-2 py-0.5 text-xs rounded-full transition-colors"
                                style={{
                                  backgroundColor: colors.semantic.error + '10',
                                  color: colors.semantic.error
                                }}
                              >
                                Required
                              </span>
                            )}
                          </div>
                          <p 
                            className="text-sm mb-2 transition-colors"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            {blockDetails.description}
                          </p>
                          <div 
                            className="text-xs transition-colors"
                            style={{ color: colors.utility.secondaryText }}
                          >
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
            <div 
              className="border rounded-lg p-6 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Contract Type
                  </span>
                  <span 
                    className="text-sm font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {contractTypeConfig?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Complexity
                  </span>
                  <span 
                    className="text-sm font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {complexityLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Setup Time
                  </span>
                  <span 
                    className="text-sm font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {contractTypeConfig?.estimatedSetupTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Total Fields
                  </span>
                  <span 
                    className="text-sm font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    ~{totalEstimatedFields}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Blocks
                  </span>
                  <span 
                    className="text-sm font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {template.blocks.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Complexity Details */}
            <div 
              className="border rounded-lg p-6 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Complexity Level
              </h3>
              <div 
                className="p-4 rounded-lg border transition-colors"
                style={{
                  backgroundColor: complexityColors.bg,
                  borderColor: complexityColors.border
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield 
                    className="h-5 w-5"
                    style={{ color: complexityColors.text }}
                  />
                  <span 
                    className="font-medium"
                    style={{ color: complexityColors.text }}
                  >
                    {complexityLabel}
                  </span>
                </div>
                <p 
                  className="text-sm"
                  style={{ color: complexityColors.text }}
                >
                  {complexityDescription}
                </p>
              </div>
            </div>

            {/* Selected Block Details */}
            {template.blocks[selectedBlockIndex] && (
              <div 
                className="border rounded-lg p-6 transition-colors"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: colors.utility.secondaryText + '20'
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Block Details
                </h3>
                {(() => {
                  const blockDetails = getBlockDetails(template.blocks[selectedBlockIndex]);
                  const IconComponent = blockDetails.icon;
                  
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                          style={{
                            backgroundColor: getCategoryColor(blockDetails.category),
                            color: getCategoryTextColor(blockDetails.category)
                          }}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 
                            className="font-medium transition-colors"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {blockDetails.name}
                          </h4>
                          <p 
                            className="text-sm capitalize transition-colors"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            {blockDetails.category} Block
                          </p>
                        </div>
                      </div>
                      
                      <p 
                        className="text-sm mb-4 transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {blockDetails.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h5 
                          className="text-sm font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          Includes:
                        </h5>
                        {blockDetails.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle 
                              className="h-3 w-3 flex-shrink-0"
                              style={{ color: colors.semantic.success }}
                            />
                            <span 
                              className="text-xs transition-colors"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div 
              className="border rounded-lg p-6 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <button
                onClick={handleTemplateSelect}
                className="w-full mb-3 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white hover:opacity-90"
                style={{
                  background: isSelected(template.id)
                    ? `linear-gradient(to right, ${colors.semantic.success}, ${colors.semantic.success}dd)`
                    : `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <CheckCircle className="h-5 w-5" />
                {isSelected(template.id) ? 'Template Selected' : 'Use This Template'}
              </button>
              
              <button
                onClick={() => navigate('/templates/admin/global-templates')}
                className="w-full px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: 'transparent',
                  color: colors.utility.primaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
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