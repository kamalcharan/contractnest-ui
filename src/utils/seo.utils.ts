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