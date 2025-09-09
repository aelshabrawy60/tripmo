async function fetchTrips() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/client/trips?admin_key=AbdoElshaqi`, {
      next: {
        revalidate: 3600 // Cache for 6 hours
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch trips: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching trips for sitemap:', error);
    return [];
  }
}

async function generateSitemap() {
  const trips = await fetchTrips();
  const currentDate = new Date().toISOString().split('T')[0];

  console.log("trips", trips)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://www.rehlanow.com/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Terms -->
  <url>
    <loc>https://www.rehlanow.com/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- about -->
  <url>
    <loc>https://www.rehlanow.com/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Trips listing -->
  <url>
    <loc>https://www.rehlanow.com/trips</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Host platform -->
  <url>
    <loc>https://host.rehlanow.com</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Dynamic Trip Pages -->
  ${trips.map(trip => `
    <url>
      <loc>https://www.rehlanow.com/en/trips/${trip.slug || trip.id}</loc>
      <lastmod>${trip.updatedAt?.split('T')[0] || currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`).join('')
  }
  ${trips.map(trip => `
    <url>
      <loc>https://www.rehlanow.com/ar/trips/${trip.slug || trip.id}</loc>
      <lastmod>${trip.updatedAt?.split('T')[0] || currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`).join('')
  }
</urlset>`;
}

export async function GET() {
  const sitemap = await generateSitemap();
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=21600' // 6 hours
    }
  });
}
