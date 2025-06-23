// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://rehlanow.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/dashboard*',
    '/signin*',
    '/api*',
    '/manual_payment*',
    '/error*'
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
          '/manual_payment',
          '/error'
        ],
      },
    ],
    additionalSitemaps: [
      'https://rehlanow.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority for specific pages
    const priorities = {
      '/': 1.0,
      '/site': 0.9,
      '/site/booking': 0.8,
      '/site/trips': 0.8,
      '/site/host': 0.8,
      '/terms': 0.6
    };

    // Custom change frequencies
    const changefreqs = {
      '/': 'daily',
      '/site': 'daily',
      '/site/trips': 'daily',
      '/site/booking': 'daily',
      '/terms': 'monthly'
    };

    return {
      loc: path,
      changefreq: changefreqs[path] || config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString()
    };
  }
};
