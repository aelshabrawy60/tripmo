// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://rehlanow.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: [
    '/dashboard*',
    '/api*',
    '/signin*',
    '/auth*',
    '/manual_payment*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/api',
          '/signin',
          '/auth',
          '/manual_payment',
        ],
      },
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  generateIndexSitemap: true,
  alternateRefs: [],
};
