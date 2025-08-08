// src/utils/helpers/seo.utils.ts
import { SEO_CONSTANTS } from '../constants/seo.constants';

export class SEOUtils {
  /**
   * Generate optimized page title
   */
  static generateTitle(pageTitle: string, includeCompany = true): string {
    if (includeCompany) {
      return `${pageTitle} | ${SEO_CONSTANTS.SITE_NAME}`;
    }
    return pageTitle;
  }

  /**
   * Generate optimized meta description with length validation
   */
  static generateDescription(content: string, maxLength = 160): string {
    if (content.length <= maxLength) {
      return content;
    }
    
    // Find the last complete sentence within the limit
    const trimmed = content.substring(0, maxLength - 3);
    const lastSentence = trimmed.lastIndexOf('.');
    const lastSpace = trimmed.lastIndexOf(' ');
    
    // Use sentence boundary if available and reasonable, otherwise use word boundary
    const cutPoint = lastSentence > maxLength - 50 ? lastSentence + 1 : lastSpace;
    
    return content.substring(0, cutPoint).trim() + '...';
  }

  /**
   * Generate keyword string with optimization
   */
  static generateKeywords(primary: string[], secondary: string[] = []): string {
    const allKeywords = [...primary, ...secondary, ...SEO_CONSTANTS.PRIMARY_KEYWORDS];
    
    // Remove duplicates and normalize
    const uniqueKeywords = [...new Set(allKeywords.map(k => k.toLowerCase()))]
      .slice(0, 15) // Limit to 15 keywords max
      .map(k => k.charAt(0).toUpperCase() + k.slice(1)); // Capitalize first letter
    
    return uniqueKeywords.join(', ');
  }

  /**
   * Generate canonical URL
   */
  static generateCanonicalUrl(path: string): string {
    // Remove trailing slash and ensure leading slash
    const cleanPath = path.replace(/\/$/, '').replace(/^(?!\/)/, '/');
    return `${SEO_CONSTANTS.SITE_URL}${cleanPath}`;
  }

  /**
   * Generate optimized image URL with CDN optimization
   */
  static generateImageUrl(imagePath: string, options?: {
    width?: number;
    height?: number;
    format?: 'webp' | 'jpeg' | 'png';
    quality?: number;
  }): string {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    let url = `${SEO_CONSTANTS.SITE_URL}${imagePath}`;
    
    // Add optimization parameters if provided
    if (options) {
      const params = new URLSearchParams();
      if (options.width) params.set('w', options.width.toString());
      if (options.height) params.set('h', options.height.toString());
      if (options.format) params.set('f', options.format);
      if (options.quality) params.set('q', options.quality.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return url;
  }

  /**
   * Validate URL format
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate responsive image srcSet
   */
  static generateSrcSet(baseUrl: string, sizes: number[]): string {
    return sizes
      .map(size => `${this.generateImageUrl(baseUrl, { width: size, format: 'webp' })} ${size}w`)
      .join(', ');
  }

  /**
   * Generate sizes attribute for responsive images
   */
  static generateSizes(breakpoints: { [key: string]: string }): string {
    const sizeQueries = Object.entries(breakpoints)
      .map(([query, size]) => `${query} ${size}`)
      .join(', ');
    
    return sizeQueries;
  }

  /**
   * Extract and clean text content for SEO
   */
  static extractTextContent(htmlString: string): string {
    // Remove HTML tags and normalize whitespace
    return htmlString
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculate keyword density
   */
  static calculateKeywordDensity(text: string, keyword: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => 
      word.includes(keyword.toLowerCase())
    ).length;
    
    return words.length > 0 ? (keywordCount / words.length) * 100 : 0;
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  /**
   * Optimize content for featured snippets
   */
  static optimizeForFeaturedSnippet(content: string, question: string): string {
    // Ensure the content directly answers the question
    const questionWords = question.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();
    
    // Check if content contains question keywords
    const hasRelevantKeywords = questionWords.some(word => 
      contentLower.includes(word) && word.length > 3
    );
    
    if (!hasRelevantKeywords) {
      console.warn(`Content may not be optimized for question: ${question}`);
    }
    
    // Ensure content is concise (40-60 words for snippets)
    const words = content.split(' ');
    if (words.length > 60) {
      return words.slice(0, 55).join(' ') + '...';
    }
    
    return content;
  }

  /**
   * Generate industry-specific keywords
   */
  static getIndustryKeywords(industry: keyof typeof SEO_CONSTANTS.INDUSTRY_KEYWORDS): string[] {
    return SEO_CONSTANTS.INDUSTRY_KEYWORDS[industry] || [];
  }

  /**
   * Generate location-based keywords
   */
  static getLocationKeywords(): string[] {
    return SEO_CONSTANTS.LOCATION_KEYWORDS;
  }

  /**
   * Combine and prioritize keywords
   */
  static prioritizeKeywords(
    primary: string[],
    secondary: string[],
    industry?: keyof typeof SEO_CONSTANTS.INDUSTRY_KEYWORDS
  ): string[] {
    const industryKeywords = industry ? this.getIndustryKeywords(industry) : [];
    const locationKeywords = this.getLocationKeywords();
    
    // Combine with priority order
    const allKeywords = [
      ...primary,
      ...industryKeywords,
      ...secondary,
      ...locationKeywords.slice(0, 2), // Limit location keywords
      ...SEO_CONSTANTS.PRIMARY_KEYWORDS.slice(0, 3) // Limit generic keywords
    ];
    
    // Remove duplicates and return
    return [...new Set(allKeywords)];
  }

  /**
   * Validate SEO content requirements
   */
  static validateSEOContent(content: {
    title: string;
    description: string;
    keywords: string;
    headings?: string[];
  }): {
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Title validation
    if (content.title.length < 30) {
      warnings.push('Title is too short (minimum 30 characters)');
    }
    if (content.title.length > 60) {
      warnings.push('Title is too long (maximum 60 characters)');
    }

    // Description validation
    if (content.description.length < 120) {
      warnings.push('Meta description is too short (minimum 120 characters)');
    }
    if (content.description.length > 160) {
      warnings.push('Meta description is too long (maximum 160 characters)');
    }

    // Keywords validation
    const keywordArray = content.keywords.split(',').map(k => k.trim());
    if (keywordArray.length > 15) {
      suggestions.push('Consider reducing keywords to 10-15 for better focus');
    }
    if (keywordArray.length < 5) {
      suggestions.push('Consider adding more relevant keywords');
    }

    // Heading structure validation
    if (content.headings) {
      const h1Count = content.headings.filter(h => h.startsWith('H1')).length;
      if (h1Count === 0) {
        warnings.push('Missing H1 heading');
      }
      if (h1Count > 1) {
        warnings.push('Multiple H1 headings found');
      }
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      suggestions
    };
  }

  /**
   * Generate Open Graph image URL with text overlay
   */
  static generateOGImage(
    title: string,
    subtitle?: string,
    templateType: 'default' | 'industry' | 'feature' = 'default'
  ): string {
    const baseUrl = 'https://contractnest.com/api/og';
    const params = new URLSearchParams({
      title: title.substring(0, 60), // Limit title length
      template: templateType
    });
    
    if (subtitle) {
      params.set('subtitle', subtitle.substring(0, 100));
    }
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate Twitter Card data
   */
  static generateTwitterCard(data: {
    title: string;
    description: string;
    image?: string;
    type?: 'summary' | 'summary_large_image';
  }) {
    return {
      'twitter:card': data.type || 'summary_large_image',
      'twitter:title': data.title.substring(0, 70),
      'twitter:description': data.description.substring(0, 200),
      'twitter:image': data.image || SEO_CONSTANTS.DEFAULT_IMAGE,
      'twitter:site': SEO_CONSTANTS.TWITTER_HANDLE,
      'twitter:creator': SEO_CONSTANTS.TWITTER_HANDLE
    };
  }

  /**
   * Generate JSON-LD structured data
   */
  static generateJSONLD(schemaType: string, data: any): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      ...data
    };
    
    return JSON.stringify(schema, null, 2);
  }

  /**
   * Check if content is mobile-friendly
   */
  static validateMobileFriendly(content: {
    title: string;
    description: string;
    imageUrl?: string;
  }): {
    isMobileFriendly: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Mobile title should be shorter
    if (content.title.length > 50) {
      issues.push('Title may be truncated on mobile devices');
    }

    // Mobile description should be shorter
    if (content.description.length > 120) {
      issues.push('Description may be truncated on mobile devices');
    }

    // Check image optimization
    if (content.imageUrl && !content.imageUrl.includes('webp')) {
      issues.push('Consider using WebP format for better mobile performance');
    }

    return {
      isMobileFriendly: issues.length === 0,
      issues
    };
  }

  /**
   * Generate hreflang tags for multi-language support
   */
  static generateHreflang(currentPath: string, languages: string[] = ['en-IN', 'hi-IN']): Array<{
    hreflang: string;
    href: string;
  }> {
    return languages.map(lang => ({
      hreflang: lang,
      href: `${SEO_CONSTANTS.SITE_URL}${lang === 'en-IN' ? '' : `/${lang.split('-')[0]}`}${currentPath}`
    }));
  }
}