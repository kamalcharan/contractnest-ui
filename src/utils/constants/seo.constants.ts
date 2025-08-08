// src/utils/constants/seo.constants.ts
export const SEO_CONSTANTS = {
  SITE_NAME: 'ContractNest',
  SITE_URL: 'https://contractnest.com',
  SITE_DESCRIPTION: 'Digital service contract exchange platform for automating service agreements, compliance tracking, and partner collaboration. Transform your service commitments into living assets.',
  DEFAULT_IMAGE: 'https://contractnest.com/og-image.jpg',
  TWITTER_HANDLE: '@contractnest',
  
  // Primary Keywords
  PRIMARY_KEYWORDS: [
    'service contract management',
    'digital contract platform',
    'service agreement automation',
    'contract compliance tracking',
    'service contract exchange',
    'automated invoicing platform',
    'SLA management software',
    'partner collaboration platform'
  ],
  
  // Industry-specific Keywords
  INDUSTRY_KEYWORDS: {
    healthcare: [
      'healthcare contract management',
      'medical equipment maintenance contracts',
      'hospital service agreements',
      'biomedical compliance tracking'
    ],
    manufacturing: [
      'OEM service contracts',
      'equipment maintenance agreements',
      'manufacturing compliance software',
      'industrial service management'
    ],
    hvac: [
      'HVAC maintenance contracts',
      'cooling system service agreements',
      'AMC management software',
      'HVAC compliance tracking'
    ],
    consulting: [
      'consulting contract management',
      'professional services automation',
      'milestone tracking software',
      'consulting invoice automation'
    ]
  },
  
  // Location-based Keywords
  LOCATION_KEYWORDS: [
    'contract management software India',
    'service agreement platform Hyderabad',
    'digital contract solution Telangana',
    'automated compliance tracking India'
  ]
};

// src/utils/seo.utils.ts
import { SEO_CONSTANTS } from '../constants/seo.constants';

export class SEOUtils {
  static generateTitle(pageTitle: string, includeCompany = true): string {
    if (includeCompany) {
      return `${pageTitle} | ${SEO_CONSTANTS.SITE_NAME}`;
    }
    return pageTitle;
  }

  static generateDescription(content: string, maxLength = 160): string {
    if (content.length <= maxLength) {
      return content;
    }
    
    // Trim and add ellipsis
    return content.substring(0, maxLength - 3).trim() + '...';
  }

  static generateKeywords(primary: string[], secondary: string[] = []): string {
    const allKeywords = [...primary, ...secondary, ...SEO_CONSTANTS.PRIMARY_KEYWORDS];
    // Remove duplicates and limit to 15 keywords max
    const uniqueKeywords = [...new Set(allKeywords)].slice(0, 15);
    return uniqueKeywords.join(', ');
  }

  static generateCanonicalUrl(path: string): string {
    return `${SEO_CONSTANTS.SITE_URL}${path}`;
  }

  static generateImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${SEO_CONSTANTS.SITE_URL}${imagePath}`;
  }

  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}