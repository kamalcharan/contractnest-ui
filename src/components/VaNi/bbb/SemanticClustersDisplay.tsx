// src/components/VaNi/bbb/SemanticClustersDisplay.tsx
// File 8/13 - BBB Semantic Clusters Display Component

import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { 
  Brain, 
  Sparkles,
  CheckCircle,
  Search,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Tag
} from 'lucide-react';
import { SemanticCluster } from '../../../types/bbb';

interface SemanticClustersDisplayProps {
  clusters: SemanticCluster[];
  businessCategory?: string;
  onGenerate?: () => void;
  isGenerating?: boolean;
  showGenerateButton?: boolean;
}

const SemanticClustersDisplay: React.FC<SemanticClustersDisplayProps> = ({
  clusters,
  businessCategory,
  onGenerate,
  isGenerating = false,
  showGenerateButton = true
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  // Example clusters by industry for explanation
  const industryExamples = {
    'IT Services': [
      { term: 'Software', related: ['application', 'program', 'app', 'system', 'solution'] },
      { term: 'Cloud', related: ['AWS', 'Azure', 'hosting', 'server', 'storage'] },
      { term: 'Development', related: ['coding', 'programming', 'website', 'mobile', 'web'] }
    ],
    'Digital Marketing': [
      { term: 'SEO', related: ['search engine', 'ranking', 'keywords', 'optimization', 'Google'] },
      { term: 'Social Media', related: ['Facebook', 'Instagram', 'content', 'engagement', 'posts'] },
      { term: 'Advertising', related: ['ads', 'campaign', 'marketing', 'promotion', 'PPC'] }
    ],
    'Legal Services': [
      { term: 'Contracts', related: ['agreement', 'legal document', 'terms', 'clause', 'binding'] },
      { term: 'Litigation', related: ['court', 'lawsuit', 'case', 'dispute', 'trial'] },
      { term: 'Advisory', related: ['consultation', 'legal advice', 'counsel', 'guidance'] }
    ],
    'Healthcare': [
      { term: 'Treatment', related: ['therapy', 'care', 'healing', 'medicine', 'procedure'] },
      { term: 'Wellness', related: ['health', 'fitness', 'wellbeing', 'lifestyle', 'prevention'] },
      { term: 'Natural', related: ['herbal', 'organic', 'traditional', 'holistic', 'Ayurveda'] }
    ],
    'Default': [
      { term: 'Services', related: ['offerings', 'solutions', 'products', 'expertise', 'support'] },
      { term: 'Business', related: ['company', 'enterprise', 'organization', 'firm', 'corporate'] },
      { term: 'Professional', related: ['expert', 'specialist', 'consultant', 'advisor', 'skilled'] }
    ]
  };

  const exampleClusters = industryExamples[businessCategory as keyof typeof industryExamples] || industryExamples.Default;

  return (
    <Card
      style={{
        backgroundColor: colors.utility.primaryBackground,
        borderColor: `${colors.utility.primaryText}20`
      }}
    >
      <CardHeader
        style={{
          background: `linear-gradient(135deg, ${colors.brand.primary}15 0%, ${colors.brand.secondary}15 100%)`,
          borderBottom: `1px solid ${colors.utility.primaryText}15`
        }}
      >
        <CardTitle>
          <div className="flex items-start space-x-3">
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor: `${colors.brand.primary}20`
              }}
            >
              <Brain className="w-6 h-6" style={{ color: colors.brand.primary }} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold" style={{ color: colors.utility.primaryText }}>
                Semantic Clusters
              </h3>
              <p className="text-sm mt-1 font-normal" style={{ color: colors.utility.secondaryText }}>
                {showGenerateButton 
                  ? 'AI-powered keyword grouping for intelligent search discovery'
                  : 'Your business is now discoverable through these intelligent keyword clusters'}
              </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Explanation Section */}
        <div
          className="p-5 rounded-lg"
          style={{
            backgroundColor: `${colors.semantic.info}15`,
            border: `1px solid ${colors.semantic.info}40`
          }}
        >
          <div className="flex items-start space-x-3 mb-4">
            <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.semantic.info }} />
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: colors.utility.primaryText }}>
                What are Semantic Clusters?
              </p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: colors.utility.secondaryText }}>
                Semantic clusters are groups of related keywords that help people find your business even when 
                they don't use exact terminology. VaNi's AI identifies synonyms, related terms, and common search 
                patterns specific to your industry.
              </p>
              <div className="flex items-start space-x-2 text-xs" style={{ color: colors.utility.secondaryText }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.semantic.success }} />
                <span>Increases discoverability by 300% through related search terms</span>
              </div>
            </div>
          </div>

          {/* How It Helps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                border: `1px solid ${colors.utility.primaryText}10`
              }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Search className="w-4 h-4" style={{ color: colors.brand.primary }} />
                <span className="text-xs font-semibold" style={{ color: colors.utility.primaryText }}>
                  Better Search
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                Found even with different search terms
              </p>
            </div>

            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                border: `1px solid ${colors.utility.primaryText}10`
              }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4" style={{ color: colors.semantic.success }} />
                <span className="text-xs font-semibold" style={{ color: colors.utility.primaryText }}>
                  User Behavior
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                Understand how members search for services
              </p>
            </div>

            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                border: `1px solid ${colors.utility.primaryText}10`
              }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4" style={{ color: colors.brand.secondary }} />
                <span className="text-xs font-semibold" style={{ color: colors.utility.primaryText }}>
                  Smart Matching
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                AI connects intent with your services
              </p>
            </div>
          </div>
        </div>

        {/* Industry Examples */}
        {showGenerateButton && (
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: colors.utility.primaryText }}>
              Example Clusters for {businessCategory || 'Your Industry'}:
            </h4>
            <div className="space-y-3">
              {exampleClusters.map((example, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border transition-all hover:shadow-md"
                  style={{
                    backgroundColor: colors.utility.secondaryBackground,
                    borderColor: `${colors.utility.primaryText}15`
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: `${colors.brand.primary}20`
                      }}
                    >
                      <Tag className="w-4 h-4" style={{ color: colors.brand.primary }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-sm" style={{ color: colors.utility.primaryText }}>
                          {example.term}
                        </span>
                        <ArrowRight className="w-3 h-3" style={{ color: colors.utility.secondaryText }} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {example.related.map((term, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-md text-xs"
                            style={{
                              backgroundColor: `${colors.semantic.success}20`,
                              color: colors.semantic.success
                            }}
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Clusters */}
        {!showGenerateButton && clusters.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: colors.utility.primaryText }}>
              Your Generated Semantic Clusters:
            </h4>
            <div className="space-y-3">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer"
                  style={{
                    backgroundColor: colors.utility.secondaryBackground,
                    borderColor: expandedCluster === cluster.id 
                      ? colors.brand.primary 
                      : `${colors.utility.primaryText}15`
                  }}
                  onClick={() => setExpandedCluster(expandedCluster === cluster.id ? null : cluster.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: `${colors.semantic.success}20`
                      }}
                    >
                      <CheckCircle className="w-4 h-4" style={{ color: colors.semantic.success }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm" style={{ color: colors.utility.primaryText }}>
                            {cluster.primary_term}
                          </span>
                          {cluster.category && (
                            <span
                              className="px-2 py-0.5 rounded-full text-xs"
                              style={{
                                backgroundColor: `${colors.brand.secondary}20`,
                                color: colors.brand.secondary
                              }}
                            >
                              {cluster.category}
                            </span>
                          )}
                        </div>
                        <span className="text-xs" style={{ color: colors.utility.secondaryText }}>
                          {cluster.related_terms.length} related terms
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cluster.related_terms.slice(0, expandedCluster === cluster.id ? undefined : 5).map((term, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-md text-xs"
                            style={{
                              backgroundColor: `${colors.semantic.success}15`,
                              color: colors.utility.primaryText
                            }}
                          >
                            {term}
                          </span>
                        ))}
                        {!expandedCluster && cluster.related_terms.length > 5 && (
                          <span
                            className="px-2 py-1 rounded-md text-xs font-medium"
                            style={{
                              backgroundColor: `${colors.brand.primary}20`,
                              color: colors.brand.primary
                            }}
                          >
                            +{cluster.related_terms.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        {showGenerateButton && onGenerate && (
          <div className="space-y-3">
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: `${colors.brand.primary}10`,
                border: `1px solid ${colors.brand.primary}40`
              }}
            >
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.brand.primary }} />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: colors.utility.primaryText }}>
                    Ready to Generate Your Clusters?
                  </p>
                  <p className="text-xs" style={{ color: colors.utility.secondaryText }}>
                    VaNi will now analyze your business profile and generate semantic clusters 
                    tailored to your industry and services. Click the button below to proceed.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Clusters...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Generate Semantic Clusters</span>
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SemanticClustersDisplay;