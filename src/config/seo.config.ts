// src/config/seo.config.ts
import { SEOData } from '../types/seo.types';
import { SEO_CONSTANTS } from '../utils/constants/seo.constants';

export const SEO_CONFIG = {
  // Global SEO settings
  GLOBAL: {
    titleTemplate: '%s | ContractNest - Service Contract Exchange',
    defaultTitle: 'ContractNest - Turn Service Commitments into Living Assets',
    description: SEO_CONSTANTS.SITE_DESCRIPTION,
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: SEO_CONSTANTS.SITE_URL,
      siteName: SEO_CONSTANTS.SITE_NAME,
      images: [
        {
          url: `${SEO_CONSTANTS.SITE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'ContractNest - Service Contract Exchange Platform'
        }
      ]
    },
    twitter: {
      handle: SEO_CONSTANTS.TWITTER_HANDLE,
      site: SEO_CONSTANTS.TWITTER_HANDLE,
      cardType: 'summary_large_image'
    },
    additionalMetaTags: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=5'
      },
      {
        name: 'theme-color',
        content: '#e53e3e'
      },
      {
        name: 'msapplication-TileColor',
        content: '#e53e3e'
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes'
      }
    ]
  },

  // Critical performance settings
  PERFORMANCE: {
    preloadFonts: [
      '/fonts/inter-var.woff2'
    ],
    preloadImages: [
      '/images/hero-dashboard.webp',
      '/images/logo.png'
    ],
    dnsPrefetch: [
      '//www.google-analytics.com',
      '//fonts.googleapis.com',
      '//cdn.jsdelivr.net'
    ],
    preconnect: [
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com'
    ],
    prefetch: [
      '/api/demo-request',
      '/features',
      '/pricing',
      '/industries'
    ]
  },

  // Core Web Vitals targets
  CORE_WEB_VITALS: {
    LCP_TARGET: 2500, // Largest Contentful Paint (ms)
    FID_TARGET: 100,  // First Input Delay (ms)
    CLS_TARGET: 0.1,  // Cumulative Layout Shift
    FCP_TARGET: 1800, // First Contentful Paint (ms)
    TTFB_TARGET: 800  // Time to First Byte (ms)
  },

  // Industry-specific SEO settings
  INDUSTRIES: {
    healthcare: {
      keywords: SEO_CONSTANTS.INDUSTRY_KEYWORDS.healthcare,
      structuredDataType: 'MedicalOrganization',
      complianceTerms: ['HIPAA', 'FDA', 'Healthcare compliance']
    },
    manufacturing: {
      keywords: SEO_CONSTANTS.INDUSTRY_KEYWORDS.manufacturing,
      structuredDataType: 'Organization',
      complianceTerms: ['ISO certification', 'Quality management', 'Manufacturing compliance']
    },
    hvac: {
      keywords: SEO_CONSTANTS.INDUSTRY_KEYWORDS.hvac,
      structuredDataType: 'LocalBusiness',
      complianceTerms: ['HVAC certification', 'Energy efficiency', 'Maintenance compliance']
    },
    consulting: {
      keywords: SEO_CONSTANTS.INDUSTRY_KEYWORDS.consulting,
      structuredDataType: 'ProfessionalService',
      complianceTerms: ['Professional services', 'Consulting standards', 'Project management']
    }
  },

  // AEO (Answer Engine Optimization) settings
  AEO: {
    featuredSnippetTargets: [
      'What is service contract management?',
      'How to automate service contracts?',
      'Best practices for SLA compliance',
      'Service contract automation benefits',
      'Digital contract management solutions'
    ],
    faqSchema: true,
    howToSchema: true,
    breadcrumbsSchema: true
  },

  // Local SEO settings
  LOCAL_SEO: {
    businessName: 'ContractNest',
    address: {
      streetAddress: 'Hyderabad',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '',
      addressCountry: 'IN'
    },
    telephone: '+91-9949701175',
    email: 'charan@contractnest.com',
    priceRange: '₹₹',
    serviceArea: ['Hyderabad', 'Telangana', 'India'],
    languages: ['English', 'Hindi']
  },

  // Technical SEO settings
  TECHNICAL: {
    xmlSitemap: {
      enabled: true,
      changefreq: {
        homepage: 'weekly',
        features: 'monthly',
        blog: 'weekly',
        static: 'yearly'
      },
      priority: {
        homepage: 1.0,
        mainPages: 0.9,
        subPages: 0.8,
        blog: 0.7,
        static: 0.5
      }
    },
    robotsTxt: {
      enabled: true,
      disallowPatterns: [
        '/admin/',
        '/api/',
        '/private/',
        '/temp/',
        '/_next/',
        '/node_modules/',
        '/*.json$',
        '/auth/',
        '/dashboard/',
        '/user/',
        '/checkout/',
        '/payment/',
        '/*?utm_*',
        '/*?ref=*',
        '/*?source=*'
      ]
    },
    canonicalization: {
      enabled: true,
      trailingSlash: false,
      protocol: 'https',
      www: false
    }
  },

  // Content optimization
  CONTENT: {
    titleLength: {
      min: 30,
      max: 60,
      optimal: 55
    },
    descriptionLength: {
      min: 120,
      max: 160,
      optimal: 155
    },
    keywordDensity: {
      primary: 0.02, // 2%
      secondary: 0.01 // 1%
    },
    headingStructure: {
      h1Count: 1,
      h2Min: 2,
      h3Min: 3
    }
  },

  // Analytics and tracking
  ANALYTICS: {
    googleAnalytics: {
      enabled: true,
      trackingId: process.env.REACT_APP_GA_TRACKING_ID || '',
      anonymizeIp: true,
      cookieConsent: true
    },
    googleTagManager: {
      enabled: true,
      containerId: process.env.REACT_APP_GTM_ID || '',
    },
    searchConsole: {
      enabled: true,
      verificationCode: process.env.REACT_APP_GSC_VERIFICATION || ''
    },
    bingWebmaster: {
      enabled: true,
      verificationCode: process.env.REACT_APP_BING_VERIFICATION || ''
    }
  }
};

// Utility function to get page-specific SEO config
export const getPageSEOConfig = (pageName: string, customData?: Partial<SEOData>): SEOData => {
  const baseConfig = SEO_CONFIG.GLOBAL;
  const pageConfig = SEO_CONFIG.INDUSTRIES[pageName as keyof typeof SEO_CONFIG.INDUSTRIES];
  
  return {
    title: customData?.title || baseConfig.defaultTitle,
    description: customData?.description || baseConfig.description,
    keywords: customData?.keywords || pageConfig?.keywords?.join(', ') || SEO_CONSTANTS.PRIMARY_KEYWORDS.join(', '),
    canonical: customData?.canonical || `${SEO_CONSTANTS.SITE_URL}${customData?.canonical || '/'}`,
    ogImage: customData?.ogImage || baseConfig.openGraph.images[0].url,
    ogType: customData?.ogType || 'website',
    twitterCard: 'summary_large_image',
    ...customData
  };
};

export default SEO_CONFIG;