// src/hooks/usePerformance.ts
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export const usePerformance = () => {
  const trackMetrics = useCallback(() => {
    const metrics: PerformanceMetrics = {};

    // Track FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
          console.log('FCP:', entry.startTime);
          
          // Send to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
              name: 'first_contentful_paint',
              value: Math.round(entry.startTime)
            });
          }
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Track LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.lcp = lastEntry.startTime;
      console.log('LCP:', lastEntry.startTime);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'largest_contentful_paint',
          value: Math.round(lastEntry.startTime)
        });
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Track FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        metrics.fid = entry.processingStart - entry.startTime;
        console.log('FID:', metrics.fid);
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'timing_complete', {
            name: 'first_input_delay',
            value: Math.round(metrics.fid)
          });
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      metrics.cls = clsValue;
      console.log('CLS:', clsValue);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'cumulative_layout_shift',
          value: Math.round(clsValue * 1000)
        });
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Track TTFB (Time to First Byte)
    if ('navigation' in performance) {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      metrics.ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
      console.log('TTFB:', metrics.ttfb);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'time_to_first_byte',
          value: Math.round(metrics.ttfb)
        });
      }
    }

    return metrics;
  }, []);

  useEffect(() => {
    // Only track on production
    if (process.env.NODE_ENV === 'production') {
      trackMetrics();
    }
  }, [trackMetrics]);

  return { trackMetrics };
};

