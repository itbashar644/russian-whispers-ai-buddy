
const fs = require('fs');
const path = require('path');

class SitemapGenerator {
  constructor(baseUrl = 'https://the-x.shop') {
    this.baseUrl = baseUrl;
  }

  // Генерация XML sitemap
  generateSitemap(products) {
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/catalog', priority: '0.9', changefreq: 'daily' },
      { url: '/auth', priority: '0.5', changefreq: 'monthly' },
      { url: '/profile', priority: '0.5', changefreq: 'weekly' },
      { url: '/cart', priority: '0.7', changefreq: 'daily' },
      { url: '/orders', priority: '0.6', changefreq: 'weekly' }
    ];

    const productPages = products.map(product => ({
      url: `/product-${product.id}.html`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: product.updated_at || new Date().toISOString()
    }));

    const allPages = [...staticPages, ...productPages];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemapXml;
  }

  // Сохранение sitemap в файл
  saveSitemap(products, outputPath) {
    const sitemapContent = this.generateSitemap(products);
    const sitemapPath = path.join(outputPath, 'sitemap.xml');
    
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log(`✅ Sitemap сохранен: ${sitemapPath}`);
    
    return sitemapPath;
  }
}

module.exports = SitemapGenerator;
