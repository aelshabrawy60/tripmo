const fs = require('fs');
const { resolve } = require('path');
const prettier = require('prettier');

// Get all routes from the pages directory
const routes = [
  '/',
  '/site',
  '/site/booking',
  '/site/trips',
  '/site/host',
  '/site/terms',
  '/terms'
];

// Generate sitemap XML
async function generateSitemap() {
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes
        .map((route) => {
          const priority = route === '/' ? '1.0' : 
                         route.startsWith('/site') ? '0.8' : '0.6';
          
          const changefreq = route === '/' || route.startsWith('/site') ? 
                           'daily' : 'monthly';

          return `
            <url>
              <loc>https://rehlanow.com${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>${changefreq}</changefreq>
              <priority>${priority}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  const formatted = await prettier.format(sitemap, { parser: 'html' });
  fs.writeFileSync('public/sitemap.xml', formatted);
}

generateSitemap()
  .then(() => {
    console.log('Sitemap generated successfully!');
  })
  .catch((err) => {
    console.error('Error generating sitemap:', err);
  });
