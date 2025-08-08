// src/components/Performance/PreloadCriticalResources.tsx
import React from 'react';

const PreloadCriticalResources: React.FC = () => {
  return (
    <>
      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      
      {/* Preload hero image */}
      <link
        rel="preload"
        href="/images/hero-dashboard.webp"
        as="image"
        media="(min-width: 768px)"
      />
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
      
      {/* Preconnect to critical third-party origins */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* Resource hints for likely navigation */}
      <link rel="prefetch" href="/api/demo-request" />
      <link rel="prefetch" href="/features" />
      <link rel="prefetch" href="/pricing" />
    </>
  );
};

export default PreloadCriticalResources;

// src/utils/performance.utils.ts
export class PerformanceUtils {
  // Debounce function for performance optimization
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }

  // Throttle function for scroll events
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Optimize images for different screen sizes
  static getOptimizedImageUrl(
    baseUrl: string,
    width: number,
    format: 'webp' | 'jpeg' | 'png' = 'webp'
  ): string {
    // This would integrate with an image optimization service
    return `${baseUrl}?w=${width}&f=${format}&q=85`;
  }

  // Generate responsive image srcSet
  static generateSrcSet(baseUrl: string, sizes: number[]): string {
    return sizes
      .map(size => `${this.getOptimizedImageUrl(baseUrl, size)} ${size}w`)
      .join(', ');
  }

  // Detect if user prefers reduced motion
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Check if user is on slow connection
  static isSlowConnection(): boolean {
    const connection = (navigator as any).connection;
    if (!connection) return false;
    
    return (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      (connection.effectiveType === '3g' && connection.downlink < 1.5)
    );
  }

  // Measure and report custom metrics
  static measureCustomMetric(name: string, startTime?: number): void {
    const endTime = performance.now();
    const duration = startTime ? endTime - startTime : endTime;
    
    // Report to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(duration)
      });
    }
    
    console.log(`${name}: ${duration.toFixed(2)}ms`);
  }
}