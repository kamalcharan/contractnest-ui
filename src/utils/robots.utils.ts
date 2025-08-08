// src/utils/robots.utils.ts
interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
}

export class RobotsGenerator {
  private rules: RobotsRule[] = [];
  private sitemaps: string[] = [];
  private host?: string;
  private crawlDelay?: number;

  addRule(rule: RobotsRule): void {
    this.rules.push(rule);
  }

  addSitemap(sitemapUrl: string): void {
    this.sitemaps.push(sitemapUrl);
  }

  setHost(host: string): void {
    this.host = host;
  }

  setCrawlDelay(delay: number): void {
    this.crawlDelay = delay;
  }

  generateRobotsTxt(): string {
    let robotsTxt = '';

    // Add rules
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

    // Add host
    if (this.host) {
      robotsTxt += `Host: ${this.host}\n\n`;
    }

    // Add sitemaps
    this.sitemaps.forEach(sitemap => {
      robotsTxt += `Sitemap: ${sitemap}\n`;
    });

    return robotsTxt.trim();
  }

  static generateContractNestRobots(): string {
    const generator = new RobotsGenerator();
    
    // Allow all crawlers to access most content
    generator.addRule({
      userAgent: '*',
      allow: ['/'],
      disallow: [
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
    });

    // Specific rules for Google
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
      ],
      disallow: [
        '/admin/',
        '/api/',
        '/private/',
        '/auth/',
        '/dashboard/'
      ]
    });

    // Specific rules for Bing
    generator.addRule({
      userAgent: 'Bingbot',
      allow: ['/'],
      disallow: [
        '/admin/',
        '/api/',
        '/private/',
        '/auth/',
        '/dashboard/'
      ]
    });

    // Block aggressive crawlers
    generator.addRule({
      userAgent: 'AhrefsBot',
      disallow: ['/']
    });

    generator.addRule({
      userAgent: 'SemrushBot',
      disallow: ['/']
    });

    generator.addRule({
      userAgent: 'MJ12bot',
      disallow: ['/']
    });

    // Set host and sitemap
    generator.setHost('https://contractnest.com');
    generator.addSitemap('https://contractnest.com/sitemap.xml');
    generator.addSitemap('https://contractnest.com/sitemap-blog.xml');
    
    return generator.generateRobotsTxt();
  }
}