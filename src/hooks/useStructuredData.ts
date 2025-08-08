
// src/hooks/useStructuredData.ts
import { useEffect } from 'react';

export const useStructuredData = (schemaData: object | object[]) => {
  useEffect(() => {
    const schemas = Array.isArray(schemaData) ? schemaData : [schemaData];
    const scriptElements: HTMLScriptElement[] = [];

    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      script.setAttribute('data-schema-id', `schema-${index}`);
      document.head.appendChild(script);
      scriptElements.push(script);
    });

    // Cleanup function
    return () => {
      scriptElements.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [schemaData]);
};

// Build-time script to generate static files
// scripts/generate-seo-files.js
const fs = require('fs');
const path = require('path');
const { SitemapGenerator } = require('../src/utils/sitemap.utils');
const { RobotsGenerator } = require('../src/utils/robots.utils');

function generateSEOFiles() {
  const publicDir = path.join(__dirname, '../public');
  
  // Generate sitemap.xml
  const sitemap = SitemapGenerator.generateContractNestSitemap();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Generated sitemap.xml');
  
  // Generate robots.txt
  const robots = RobotsGenerator.generateContractNestRobots();
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
  console.log('✅ Generated robots.txt');
  
  // Generate security.txt (optional but good for SEO)
  const securityTxt = `Contact: mailto:security@contractnest.com
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Preferred-Languages: en
Canonical: https://contractnest.com/.well-known/security.txt`;
  
  const wellKnownDir = path.join(publicDir, '.well-known');
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir);
  }
  fs.writeFileSync(path.join(wellKnownDir, 'security.txt'), securityTxt);
  console.log('✅ Generated security.txt');
}

// Run if called directly
if (require.main === module) {
  generateSEOFiles();
}

module.exports = { generateSEOFiles };