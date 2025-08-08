// src/utils/sitemap.utils.ts
interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapUrl[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  addUrl(url: SitemapUrl): void {
    this.urls.push({
      ...url,
      url: this.baseUrl + url.url
    });
  }

  addUrls(urls: SitemapUrl[]): void {
    urls.forEach(url => this.addUrl(url));
  }

  generateXML(): string {
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

  static generateContractNestSitemap(): string {
    const generator = new SitemapGenerator('https://contractnest.com');
    
    // Static pages
    const staticPages: SitemapUrl[] = [
      {
        url: '/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        url: '/features',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.9
      },
      {
        url: '/industries',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.9
      },
      {
        url: '/industries/healthcare',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: '/industries/manufacturing',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: '/industries/hvac',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: '/industries/consulting',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: '/pricing',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        url: '/how-it-works',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: '/contact',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        url: '/demo',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        url: '/about',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        url: '/privacy-policy',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: 0.3
      },
      {
        url: '/terms-of-service',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: 0.3
      }
    ];

    // Blog/Resource pages (example)
    const blogPages: SitemapUrl[] = [
      {
        url: '/blog',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        url: '/blog/service-contract-automation-guide',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        url: '/blog/healthcare-compliance-management',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        url: '/resources',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.6
      },
      {
        url: '/resources/contract-templates',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.5
      }
    ];

    generator.addUrls([...staticPages, ...blogPages]);
    return generator.generateXML();
  }
}
