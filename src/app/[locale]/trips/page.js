import TripsViewer from '@/components/website/TripsViewer'
import React, { Suspense } from 'react'
import Loading from '@/components/Loading'

// Server-side data fetching function
async function fetchTrips(searchParams) {
  const { departure_city, depature_city, dest_city, q } = searchParams
  
  // Handle both old and new parameter names
  const departureCity = depature_city || departure_city

  try {
    const params = new URLSearchParams()
    
    // Only add string parameters
    if (typeof departureCity === 'string' && departureCity) {
      params.append('depature_city', departureCity)
    }
    if (typeof dest_city === 'string' && dest_city) {
      params.append('dest_city', dest_city)
    }
    if (typeof q === 'string' && q) {
      params.append('q', q)
    }
    
    // Use absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/client/trips?${params.toString()}`, {
      cache: 'no-store', // Ensure fresh data for dynamic content
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch trips:', response.status)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching trips:', error)
    return null
  }
}

// Helper function to safely convert searchParams to URL string
function createSafeURLParams(searchParams) {
  const safeParams = new URLSearchParams()
  
  // Only include string values and filter out Symbol values
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof key === 'string' && typeof value === 'string' && value) {
      safeParams.append(key, value)
    }
  })
  
  return safeParams.toString()
}

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }) {
  const locale = params.locale || 'en'
  const { departure_city, depature_city, dest_city, q } = searchParams
  const departureCity = departure_city || depature_city
  
  // Fetch trips data for dynamic metadata
  const trips = await fetchTrips(searchParams)
  
  const isEnglish = locale === 'en'
  
  // Base metadata
  let title = isEnglish ? 'Travel Trips & Tours' : 'رحلات سياحية وسفر'
  let description = isEnglish 
    ? 'Discover amazing travel trips and tours. Book your perfect vacation with the best deals and destinations.'
    : 'اكتشف رحلات سياحية مذهلة. احجز عطلتك المثالية بأفضل العروض والوجهات.'
  
  // Dynamic metadata based on search parameters and actual data
  if (trips && trips.length > 0) {
    if (dest_city && trips[0]?.dest) {
      const destName = isEnglish ? trips[0].dest.name_en : trips[0].dest.name
      title = isEnglish 
        ? `Best Trips to ${destName} - Travel Tours & Packages`
        : `أفضل الرحلات إلى ${destName} - جولات سياحية وحزم سفر`
      description = isEnglish
        ? `Explore ${trips.length} amazing trips and tours to ${destName}. Find great deals, activities, and travel packages for your perfect vacation.`
        : `استكشف ${trips.length} رحلة وجولة مذهلة إلى ${destName}. اعثر على عروض رائعة وأنشطة وحزم سفر لعطلتك المثالية.`
    } else if (departureCity && trips[0]?.depature) {
      const depName = isEnglish ? trips[0].depature.name_en : trips[0].depature.name
      title = isEnglish 
        ? `${trips.length} Trips from ${depName} - Travel Tours & Packages`
        : `${trips.length} رحلة من ${depName} - جولات سياحية وحزم سفر`
      description = isEnglish
        ? `Find ${trips.length} amazing trips departing from ${depName}. Book tours, vacation packages, and travel deals starting from your city.`
        : `اعثر على ${trips.length} رحلة مذهلة تنطلق من ${depName}. احجز جولات وحزم عطلات وعروض سفر تبدأ من مدينتك.`
    } else if (q) {
      title = isEnglish 
        ? `"${q}" - ${trips.length} Trip Search Results`
        : `"${q}" - ${trips.length} نتيجة بحث رحلات`
      description = isEnglish
        ? `Found ${trips.length} trips matching "${q}". Discover the best tours and travel packages for your search.`
        : `تم العثور على ${trips.length} رحلة مطابقة لـ "${q}". اكتشف أفضل الجولات وحزم السفر لبحثك.`
    } else {
      title = isEnglish ? `${trips.length} Trending Travel Trips & Tours` : `${trips.length} رحلة سياحية رائجة`
      description = isEnglish
        ? `Discover ${trips.length} trending travel trips and tours. Find the most popular destinations and travel packages.`
        : `اكتشف ${trips.length} رحلة سياحية رائجة. اعثر على أشهر الوجهات وحزم السفر.`
    }
  }
  
  const keywords = isEnglish 
    ? 'trips, travel, tours, vacation, travel packages, destinations, booking, tourism'
    : 'رحلات, سفر, جولات, عطلات, حزم سفر, وجهات, حجز, سياحة'

  // Create safe URL params string
  const urlParamsString = createSafeURLParams(searchParams)
  const queryString = urlParamsString ? `?${urlParamsString}` : ''

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Your Travel Company' }], // Replace with actual company name
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'ar_SA',
      siteName: 'Your Travel Site', // Replace with actual site name
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      languages: {
        'en': `/en/trips${queryString}`,
        'ar': `/ar/trips${queryString}`,
      }
    }
  }
}

// Generate structured data for SEO
function generateStructuredData(trips, locale, searchParams) {
  if (!trips || trips.length === 0) return null
  
  const { dest_city, departure_city, depature_city } = searchParams
  const departureCity = departure_city || depature_city
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": locale === 'en' ? "Travel Trips and Tours" : "الرحلات السياحية والجولات",
    "description": locale === 'en' 
      ? `A collection of ${trips.length} travel trips and tour packages`
      : `مجموعة من ${trips.length} رحلة سياحية وحزم جولات`,
    "numberOfItems": trips.length,
    "itemListElement": trips.slice(0, 10).map((trip, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TouristTrip",
        "name": locale === 'en' ? trip.name_en || trip.name : trip.name,
        "description": locale === 'en' ? trip.description_en || trip.description : trip.description,
        "touristType": "sightseeing",
        ...(trip.price && {
          "offers": {
            "@type": "Offer",
            "price": trip.price,
            "priceCurrency": trip.currency || "USD"
          }
        }),
        "provider": {
          "@type": "Organization",
          "name": "Your Travel Company" // Replace with actual company name
        }
      }
    }))
  }
  
  return structuredData
}

// Generate page heading
function generateHeading(trips, locale, searchParams) {
  const { dest_city, departure_city, depature_city, q } = searchParams
  const departureCity = departure_city || depature_city
  
  if (!trips || trips.length === 0) {
    return locale === "en" ? "Travel Trips & Tours" : "الرحلات السياحية والجولات"
  }

  if (dest_city && trips[0]?.dest) {
    const destName = locale === "en" ? trips[0].dest.name_en : trips[0].dest.name
    return locale === "en" 
      ? `Best Trips to ${destName}`
      : `أفضل الرحلات إلى ${destName}`
  }
  
  if (departureCity && trips[0]?.depature) {
    const depName = locale === "en" ? trips[0].depature.name_en : trips[0].depature.name
    return locale === "en" 
      ? `Trips from ${depName}`
      : `الرحلات من ${depName}`
  }
  
  if (q) {
    return locale === "en" 
      ? `Search Results: "${q}"`
      : `نتائج البحث: "${q}"`
  }
  
  return locale === "en" ? "Trending Travel Trips" : "الرحلات السياحية الرائجة"
}

// Generate breadcrumb data
function generateBreadcrumbs(trips, locale, searchParams) {
  const { dest_city, departure_city, depature_city } = searchParams
  const departureCity = departure_city || depature_city
  
  const breadcrumbs = [
    {
      name: locale === 'en' ? 'Home' : 'الرئيسية',
      href: `/${locale}`
    },
    {
      name: locale === 'en' ? 'Trips' : 'الرحلات',
      href: `/${locale}/trips`
    }
  ]
  
  if ((dest_city || departureCity) && trips?.[0]) {
    const locationName = dest_city && trips[0]?.dest 
      ? (locale === 'en' ? trips[0].dest.name_en : trips[0].dest.name)
      : departureCity && trips[0]?.depature
      ? (locale === 'en' ? trips[0].depature.name_en : trips[0].depature.name)
      : null
      
    if (locationName) {
      breadcrumbs.push({
        name: locationName,
        href: null // Current page
      })
    }
  }
  
  return breadcrumbs
}

// Main page component
export default async function TripsPage({ params, searchParams }) {
  const locale = params.locale || 'en'
  
  // Fetch trips data server-side
  const trips = await fetchTrips(searchParams)
  
  // Generate structured data
  const structuredData = generateStructuredData(trips, locale, searchParams)
  
  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(trips, locale, searchParams)
  
  return (
    <>
      {/* Structured data script */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <main>
        {/* Semantic HTML with proper heading hierarchy */}
        <header>
          <h1 className="text-3xl font-bold mt-8 mx-2 text-gray-900">
            {generateHeading(trips, locale, searchParams)}
          </h1>
          
          {/* Breadcrumb navigation for better UX and SEO */}
          <nav aria-label="Breadcrumb" className="mx-2 mt-4">
            <ol className="flex space-x-2 text-sm text-gray-600 rtl:space-x-reverse rtl:space-x-2">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 rtl:rotate-180">/</span>}
                  {item.href ? (
                    <a href={item.href} className="hover:text-blue-600 transition-colors">
                      {item.name}
                    </a>
                  ) : (
                    <span className="text-gray-800 font-medium">
                      {item.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {/* Main content with semantic structure */}
        <section aria-label={locale === 'en' ? 'Available trips' : 'الرحلات المتاحة'}>
          <Suspense fallback={<Loading />}>
            <TripsViewer trips={trips} language={locale} />
          </Suspense>
        </section>
      </main>
    </>
  )
}