// src/pages/VaNi/channels/BBBDirectoryPage.tsx
// File 10/13 - BBB Directory Landing Page

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import {
  Users,
  Search,
  Brain,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Building2,
  Network,
  MessageSquare
} from 'lucide-react';
import JoinBBBModal from '../../../components/VaNi/bbb/JoinBBBModal';

const BBBDirectoryPage: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const navigate = useNavigate();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleJoinSuccess = (branch: string) => {
    setIsJoinModalOpen(false);
    // Navigate to onboarding page
    navigate('/vani/channels/bbb/onboarding', { state: { branch } });
  };

  const features = [
    {
      icon: Search,
      title: 'AI-Powered Search',
      description: 'Find members using natural language and semantic clustering',
      color: colors.brand.primary
    },
    {
      icon: Brain,
      title: 'Semantic Clusters',
      description: 'Intelligent keyword grouping for better discoverability',
      color: colors.semantic.success
    },
    {
      icon: Shield,
      title: 'Password Protected',
      description: 'Exclusive access for verified BBB members only',
      color: colors.semantic.error
    },
    {
      icon: Users,
      title: 'Community Directory',
      description: '45+ entrepreneurs across diverse industries',
      color: colors.brand.secondary
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Sub-second search with cached query optimization',
      color: colors.semantic.warning
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Integration',
      description: 'Access directory via WhatsApp with "Hi BBB" command',
      color: colors.semantic.info
    }
  ];

  const benefits = [
    {
      stat: '45+',
      label: 'Active Members',
      description: 'Verified entrepreneurs in Bagyanagar chapter'
    },
    {
      stat: '70+',
      label: 'Chapters',
      description: 'Pan-India network of business communities'
    },
    {
      stat: '< 2s',
      label: 'Search Time',
      description: 'Lightning-fast AI-powered directory search'
    },
    {
      stat: '300%',
      label: 'Discoverability',
      description: 'Increased visibility through semantic clusters'
    }
  ];

  const useCases = [
    {
      category: 'Service Discovery',
      items: [
        'Find IT service providers in your area',
        'Discover legal or financial consultants',
        'Connect with marketing agencies',
        'Locate healthcare service providers'
      ]
    },
    {
      category: 'Business Networking',
      items: [
        'Build partnerships with complementary businesses',
        'Find vendors and suppliers',
        'Discover potential clients',
        'Expand professional network'
      ]
    },
    {
      category: 'Community Support',
      items: [
        'Get referrals from trusted members',
        'Share business opportunities',
        'Access member-only resources',
        'Participate in BBB events'
      ]
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden rounded-2xl p-12"
        style={{
          background: `linear-gradient(135deg, ${colors.brand.primary}15 0%, ${colors.brand.secondary}15 100%)`,
          borderColor: `${colors.brand.primary}30`
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: `${colors.semantic.success}20`,
              color: colors.semantic.success
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-POWERED DIRECTORY</span>
          </div>

          <div className="flex items-center justify-center space-x-3 mb-6">
            <Network className="w-16 h-16" style={{ color: colors.brand.primary }} />
            <h1
              className="text-5xl font-bold"
              style={{ color: colors.utility.primaryText }}
            >
              BBB Directory
              <br />
              <span
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Bagyanagar Business Network
              </span>
            </h1>
          </div>

          <p
            className="text-xl mb-8"
            style={{ color: colors.utility.secondaryText }}
          >
            An intelligent, AI-powered business directory connecting 45+ verified entrepreneurs 
            in the Bagyanagar chapter. Discover services, build partnerships, and grow your network 
            with semantic search and WhatsApp integration.
          </p>

          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="px-8 py-4 rounded-lg font-semibold text-white flex items-center space-x-2 mx-auto transition-all hover:opacity-90 transform hover:scale-105"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
              boxShadow: `0 4px 12px ${colors.brand.primary}40`
            }}
          >
            <Users className="w-5 h-5" />
            <span>Join BBB Group</span>
          </button>
        </div>

        {/* Decorative background */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${colors.brand.primary}, transparent)`
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${colors.brand.secondary}, transparent)`
          }}
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <Card
            key={index}
            className="text-center p-6"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <div
              className="text-4xl font-bold mb-2"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {benefit.stat}
            </div>
            <div
              className="font-semibold mb-2"
              style={{ color: colors.utility.primaryText }}
            >
              {benefit.label}
            </div>
            <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
              {benefit.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: colors.utility.primaryText }}
          >
            Powered by Advanced AI
          </h2>
          <p className="text-lg" style={{ color: colors.utility.secondaryText }}>
            Our directory uses cutting-edge semantic search and clustering to help you 
            find exactly what you need, even without exact keywords
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: `${colors.utility.primaryText}15`
                }}
              >
                <div className="mb-4">
                  <div
                    className="p-3 rounded-lg inline-flex"
                    style={{
                      backgroundColor: `${feature.color}20`
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.utility.primaryText }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: colors.utility.secondaryText }}>
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => (
          <Card
            key={index}
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20`
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.utility.primaryText }}>
                {useCase.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {useCase.items.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: colors.semantic.success }}
                    />
                    <span style={{ color: colors.utility.secondaryText }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: colors.utility.primaryText }}>
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span>How BBB Directory Works</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Join with Password',
                description: 'Enter the BBB group password to verify membership',
                icon: Shield
              },
              {
                step: '2',
                title: 'Create Your Profile',
                description: 'Build your business profile with AI assistance',
                icon: Building2
              },
              {
                step: '3',
                title: 'AI Enhancement',
                description: 'VaNi generates semantic clusters for discoverability',
                icon: Brain
              },
              {
                step: '4',
                title: 'Get Discovered',
                description: 'Members find you through intelligent search',
                icon: Search
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                    }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div
                    className="text-sm font-bold mb-2"
                    style={{
                      color: colors.brand.primary
                    }}
                  >
                    STEP {step.step}
                  </div>
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card
        className="text-center p-8"
        style={{
          backgroundColor: colors.utility.primaryBackground,
          borderColor: `${colors.brand.primary}40`,
          background: `linear-gradient(135deg, ${colors.brand.primary}10 0%, ${colors.brand.secondary}10 100%)`
        }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <h2
            className="text-3xl font-bold"
            style={{ color: colors.utility.primaryText }}
          >
            Ready to Join BBB Directory?
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.utility.secondaryText }}
          >
            Connect with 45+ verified entrepreneurs, discover services, 
            and grow your business network in the Bagyanagar chapter.
          </p>
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="px-8 py-4 rounded-lg font-semibold text-white flex items-center space-x-2 mx-auto transition-all hover:opacity-90 transform hover:scale-105"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
              boxShadow: `0 4px 12px ${colors.brand.primary}40`
            }}
          >
            <Users className="w-5 h-5" />
            <span>Join BBB Group Now</span>
          </button>
        </div>
      </Card>

      {/* Join BBB Modal */}
      <JoinBBBModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default BBBDirectoryPage;