#!/usr/bin/env node

// scripts/generate-seo-files.js
// Vite + TypeScript compatible version

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SitemapGenerator {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.urls = [];
  }

  addUrl(url) {
    this.urls.push({
      ...url,
      url: this.baseUrl + url.url
    });
  }

  addUrls(urls) {
    urls.forEach(url => this.addUrl(url));
  }

  generateXML() {
    const urlset = this.urls.map(url => {
      let urlElement = `    <url>\n        <loc>${url.url}</loc>\n`;
      
      if (url.lastmod) {
        urlElement += `        <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        urlElement += `        <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        urlElement += `        <priority>${url.priority}</priority>\n`;
      }
      
      urlElement += `    </url>`;
      return urlElement;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
  }
}

class RobotsGenerator {
  constructor() {
    this.rules = [];
    this.sitemaps = [];
    this.host = null;
    this.crawlDelay = null;
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  addSitemap(sitemapUrl) {
    this.sitemaps.push(sitemapUrl);
  }

  setHost(host) {
    this.host = host;
  }

  setCrawlDelay(delay) {
    this.crawlDelay = delay;
  }

  generateRobotsTxt() {
    let robotsTxt = '';

    this.rules.forEach(rule => {
      robotsTxt += `User-agent: ${rule.userAgent}\n`;
      
      if (rule.allow) {
        rule.allow.forEach(path => {
          robotsTxt += `Allow: ${path}\n`;
        });
      }
      
      if (rule.disallow) {
        rule.disallow.forEach(path => {
          robotsTxt += `Disallow: ${path}\n`;
        });
      }
      
      if (this.crawlDelay) {
        robotsTxt += `Crawl-delay: ${this.crawlDelay}\n`;
      }
      
      robotsTxt += '\n';
    });

    if (this.host) {
      robotsTxt += `Host: ${this.host}\n\n`;
    }

    this.sitemaps.forEach(sitemap => {
      robotsTxt += `Sitemap: ${sitemap}\n`;
    });

    return robotsTxt.trim();
  }
}

// ContractNest specific configuration
const CONTRACTNEST_CONFIG = {
  baseUrl: 'https://contractnest.com',
  pages: [
    // Main pages
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/features', changefreq: 'monthly', priority: 0.9 },
    { url: '/industries', changefreq: 'monthly', priority: 0.9 },
    { url: '/pricing', changefreq: 'weekly', priority: 0.9 },
    { url: '/how-it-works', changefreq: 'monthly', priority: 0.8 },
    { url: '/demo', changefreq: 'weekly', priority: 0.9 },
    
    // Industry pages
    { url: '/industries/healthcare', changefreq: 'monthly', priority: 0.8 },
    { url: '/industries/manufacturing', changefreq: 'monthly', priority: 0.8 },
    { url: '/industries/hvac', changefreq: 'monthly', priority: 0.8 },
    { url: '/industries/consulting', changefreq: 'monthly', priority: 0.8 },
    
    // Support pages
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    { url: '/about', changefreq: 'monthly', priority: 0.6 },
    { url: '/blog', changefreq: 'weekly', priority: 0.7 },
    { url: '/resources', changefreq: 'weekly', priority: 0.6 },
    
    // Legal pages
    { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
    { url: '/terms-of-service', changefreq: 'yearly', priority: 0.3 }
  ],
  
  blogPosts: [
    '/blog/service-contract-automation-guide',
    '/blog/healthcare-compliance-management',
    '/blog/manufacturing-service-contracts',
    '/blog/hvac-maintenance-automation',
    '/blog/consulting-contract-management'
  ],
  
  resources: [
    '/resources/contract-templates',
    '/resources/sla-tracking-guide',
    '/resources/compliance-checklists',
    '/resources/roi-calculator'
  ]
};

// Generate ContractNest sitemap
function generateContractNestSitemap() {
  const generator = new SitemapGenerator(CONTRACTNEST_CONFIG.baseUrl);
  const today = new Date().toISOString().split('T')[0];
  
  // Add main pages
  const mainPages = CONTRACTNEST_CONFIG.pages.map(page => ({
    ...page,
    lastmod: today
  }));
  
  // Add blog posts
  const blogPages = CONTRACTNEST_CONFIG.blogPosts.map(url => ({
    url,
    lastmod: today,
    changefreq: 'monthly',
    priority: 0.6
  }));
  
  // Add resource pages
  const resourcePages = CONTRACTNEST_CONFIG.resources.map(url => ({
    url,
    lastmod: today,
    changefreq: 'monthly',
    priority: 0.5
  }));

  generator.addUrls([...mainPages, ...blogPages, ...resourcePages]);
  return generator.generateXML();
}

// Generate ContractNest robots.txt
function generateContractNestRobots() {
  const generator = new RobotsGenerator();
  
  // Allow all crawlers with restrictions
  generator.addRule({
    userAgent: '*',
    allow: ['/'],
    disallow: [
      '/admin/',
      '/api/',
      '/private/',
      '/temp/',
      '/node_modules/',
      '/*.json$',
      '/auth/',
      '/dashboard/',
      '/user/',
      '/checkout/',
      '/payment/',
      '/*?utm_*',
      '/*?ref=*',
      '/*?source=*',
      '/*?fbclid=*',
      '/*?gclid=*',
      '/*?__cf_chl*',
      '/dist/',
      '/.vite/'
    ]
  });

  // Specific rules for major search engines
  generator.addRule({
    userAgent: 'Googlebot',
    allow: [
      '/',
      '/features',
      '/industries/',
      '/pricing',
      '/how-it-works',
      '/blog/',
      '/resources/'
    ]
  });

  generator.addRule({
    userAgent: 'Bingbot',
    allow: ['/']
  });

  // Block aggressive crawlers
  const blockedBots = [
    'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot',
    'PetalBot', 'DataForSEOBot', 'SeekportBot', 'Amazonbot'
  ];

  blockedBots.forEach(bot => {
    generator.addRule({
      userAgent: bot,
      disallow: ['/']
    });
  });

  generator.setHost(CONTRACTNEST_CONFIG.baseUrl);
  generator.addSitemap(`${CONTRACTNEST_CONFIG.baseUrl}/sitemap.xml`);
  
  return generator.generateRobotsTxt();
}

// Generate enhanced security.txt
function generateSecurityTxt() {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  
  return `Contact: mailto:security@contractnest.com
Contact: mailto:charan@contractnest.com
Expires: ${expiryDate.toISOString()}
Preferred-Languages: en
Canonical: https://contractnest.com/.well-known/security.txt
Policy: https://contractnest.com/security-policy
Hiring: https://contractnest.com/careers

# Security Policy
# We appreciate responsible disclosure of security vulnerabilities.
# Please allow up to 48 hours for our initial response.
# For non-security issues, please use our support channels.

# Bug Bounty
# We currently do not have a formal bug bounty program.
# However, we appreciate and acknowledge security researchers.

# Scope
# In scope: contractnest.com and all subdomains
# Out of scope: Third-party integrations and services`;
}

// Generate ads.txt
function generateAdsTxt() {
  return `# Ads.txt file for contractnest.com
# This file authorizes digital advertising sellers
# Updated: ${new Date().toISOString().split('T')[0]}

# We currently do not serve ads on our platform
# This file prevents unauthorized ad inventory sales

# Google AdSense (if we add it in future):
# google.com, pub-XXXXXXXXXX, DIRECT, f08c47fec0942fa0

# Placeholder entry to prevent fraud
contractnest.com, placeholder, DIRECT`;
}

// Generate humans.txt
function generateHumansTxt() {
  return `/* TEAM */
Founder & CEO: Charan Kamal B
Email: charan [at] contractnest.com
Location: Hyderabad, Telangana, India

/* THANKS */
React Team - https://reactjs.org/
Vite Team - https://vitejs.dev/
TypeScript Team - https://www.typescriptlang.org/
Tailwind CSS - https://tailwindcss.com/
Radix UI - https://www.radix-ui.com/
Open Source Community

/* SITE */
Last update: ${new Date().toISOString().split('T')[0]}
Language: English
Doctype: HTML5
Standards: W3C compliant HTML5, CSS3, ES2022
Components: React 19, TypeScript 5.7, Vite 6
IDE: VS Code
Version Control: Git
Hosting: Vercel/Netlify
CDN: Cloudflare

/* TECHNOLOGY STACK */
Frontend: React + TypeScript + Vite
Styling: Tailwind CSS + Radix UI
State: Zustand + React Query
Backend: Supabase
Analytics: Google Analytics 4
Monitoring: Sentry
Communication: react-hot-toast

/* PERFORMANCE */
Core Web Vitals: Optimized
Accessibility: WCAG 2.1 AA compliant
SEO: Fully optimized
Mobile: Responsive design
PWA: Progressive Web App ready`;
}

// Generate PWA manifest
function generateManifest() {
  return JSON.stringify({
    "name": "ContractNest - Service Contract Exchange",
    "short_name": "ContractNest",
    "description": "Transform your service commitments into living assets with automated contract management",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#e53e3e",
    "orientation": "portrait-primary",
    "categories": ["business", "productivity", "utilities", "finance"],
    "lang": "en-IN",
    "id": "contractnest-app",
    "icons": [
      {
        "src": "/favicon-16x16.png",
        "sizes": "16x16",  
        "type": "image/png"
      },
      {
        "src": "/favicon-32x32.png",
        "sizes": "32x32",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/android-chrome-512x512.png", 
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/apple-touch-icon.png",
        "sizes": "180x180",
        "type": "image/png"
      }
    ],
    "screenshots": [
      {
        "src": "/screenshots/desktop-1.png",
        "sizes": "1280x720",
        "type": "image/png",
        "form_factor": "wide"
      },
      {
        "src": "/screenshots/mobile-1.png", 
        "sizes": "750x1334",
        "type": "image/png",
        "form_factor": "narrow"
      }
    ],
    "shortcuts": [
      {
        "name": "Create Contract",
        "short_name": "New Contract",
        "description": "Create a new service contract",
        "url": "/contracts/create",
        "icons": [
          {
            "src": "/icons/create-contract.png",
            "sizes": "96x96"
          }
        ]
      },
      {
        "name": "Dashboard",
        "short_name": "Dashboard", 
        "description": "View contract dashboard",
        "url": "/dashboard",
        "icons": [
          {
            "src": "/icons/dashboard.png",
            "sizes": "96x96"
          }
        ]
      }
    ]
  }, null, 2);
}

// Generate _headers file for Netlify (optional)
function generateNetlifyHeaders() {
  return `# Netlify Headers Configuration
/*
  # Security headers
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  
  # Cache headers
  Cache-Control: public, max-age=31536000, immutable

# Cache busting for HTML
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Service Worker
/sw.js
  Cache-Control: public, max-age=0, must-revalidate

# SEO files
/sitemap.xml
  Content-Type: application/xml
  Cache-Control: public, max-age=3600

/robots.txt
  Content-Type: text/plain
  Cache-Control: public, max-age=3600`;
}

// Main function to generate all SEO files
async function generateSEOFiles() {
  const publicDir = path.join(__dirname, '../public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('🚀 Generating SEO files for ContractNest...\n');

  try {
    // Generate sitemap.xml
    const sitemap = generateContractNestSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('✅ Generated sitemap.xml');
    
    // Generate robots.txt
    const robots = generateContractNestRobots();
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
    console.log('✅ Generated robots.txt');
    
    // Generate security.txt
    const wellKnownDir = path.join(publicDir, '.well-known');
    if (!fs.existsSync(wellKnownDir)) {
      fs.mkdirSync(wellKnownDir, { recursive: true });
    }
    const securityTxt = generateSecurityTxt();
    fs.writeFileSync(path.join(wellKnownDir, 'security.txt'), securityTxt);
    console.log('✅ Generated .well-known/security.txt');
    
    // Generate ads.txt
    const adsTxt = generateAdsTxt();
    fs.writeFileSync(path.join(publicDir, 'ads.txt'), adsTxt);
    console.log('✅ Generated ads.txt');
    
    // Generate humans.txt
    const humansTxt = generateHumansTxt();
    fs.writeFileSync(path.join(publicDir, 'humans.txt'), humansTxt);
    console.log('✅ Generated humans.txt');
    
    // Generate PWA manifest
    const manifest = generateManifest();
    fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), manifest);
    console.log('✅ Generated site.webmanifest');

    // Generate Netlify headers (optional)
    const headers = generateNetlifyHeaders();
    fs.writeFileSync(path.join(publicDir, '_headers'), headers);
    console.log('✅ Generated _headers (Netlify)');
    
    console.log('\n🎉 All SEO files generated successfully!');
    console.log('\n📋 Generated files:');
    console.log('   • sitemap.xml - Search engine sitemap');
    console.log('   • robots.txt - Crawler instructions');
    console.log('   • .well-known/security.txt - Security contact info');
    console.log('   • ads.txt - Ad fraud prevention');
    console.log('   • humans.txt - Team credits');
    console.log('   • site.webmanifest - PWA manifest');
    console.log('   • _headers - Security & cache headers');

    // Validation summary
    console.log('\n🔍 Next steps:');
    console.log('   1. Submit sitemap to Google Search Console');
    console.log('   2. Test robots.txt at /robots.txt');
    console.log('   3. Verify structured data with Google Rich Results Test');
    console.log('   4. Check PWA manifest with Lighthouse');
    
  } catch (error) {
    console.error('❌ Error generating SEO files:', error);
    process.exit(1);
  }
}

// Watch mode for development
async function watchAndGenerate() {
  console.log('👀 Watching for SEO-related changes...');
  
  const srcDir = path.join(__dirname, '../src');
  
  if (fs.existsSync(srcDir)) {
    // Using fs.watch for file changes
    fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
      if (filename && (
        filename.includes('seo') || 
        filename.includes('sitemap') || 
        filename.includes('constants')
      )) {
        console.log(`\n🔄 Detected change in ${filename}`);
        console.log('   Regenerating SEO files...');
        await generateSEOFiles();
      }
    });
  }
  
  // Initial generation
  await generateSEOFiles();
  console.log('\n👀 Watching for changes... (Press Ctrl+C to stop)');
}

// CLI interface
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watchAndGenerate().catch(console.error);
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
ContractNest SEO File Generator (Vite Compatible)

Usage:
  node scripts/generate-seo-files.js [options]

Options:
  --watch, -w    Watch for changes and regenerate files
  --help, -h     Show this help message

Examples:
  node scripts/generate-seo-files.js        # Generate files once
  node scripts/generate-seo-files.js -w     # Watch mode for development
  npm run seo:generate                      # Via npm script
  npm run seo:watch                         # Watch via npm script
  `);
} else {
  generateSEOFiles().catch(console.error);
}

// Export for use in other modules
export {
  generateSEOFiles,
  generateContractNestSitemap,
  generateContractNestRobots,
  generateSecurityTxt,
  generateAdsTxt,
  generateHumansTxt,
  generateManifest,
  SitemapGenerator,
  RobotsGenerator,
  CONTRACTNEST_CONFIG
};