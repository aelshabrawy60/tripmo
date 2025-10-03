import MainTripPage from "@/components/Templates/Main/MainTripPage";
import WhatsAppPopup from "@/components/website/HelpPopup";
import MetaPixelTripEvent from "@/components/website/MetaPixelTripViewEvent";
import TripsStripSection from "@/components/website/TripsStripSection";
import { getSimilarTrips } from "@/utils/trips_engine/trips_engine";
import { notFound } from 'next/navigation';

async function fetchTripData(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/client/trips?slug=${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch trip data: ${res.status}`);
  }

  return res.json();
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const tripData = await fetchTripData(params.tripId);
    
    if (!tripData) {
      return {
        title: 'Trip Not Found',
        description: 'The requested trip could not be found.'
      };
    }


    return {
      title: `${tripData.name}`,
      description: tripData.about,
      keywords: `${tripData.about} ${tripData.dest_city.name_en} trips, ${tripData.dest_city.name_en} travel, ${tripData.dest_city.country_en} tours, travel packages, adventure travel, cultural tours`,
      openGraph: {
        title: tripData.name,
        description: tripData.about,
        images: [
          {
            url: tripData.images?.[0],
            width: 1200,
            height: 630,
            alt: `${tripData.name}`,
          }
        ],
        type: 'article',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/trips/${tripData.slug}`,
        siteName: 'Rehla Now | رحلة ناو',
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/trips/${tripData.slug}`,
        languages: {
          'en': `${process.env.NEXT_PUBLIC_SITE_URL}/en/trips/${tripData.slug}`,
          'ar': `${process.env.NEXT_PUBLIC_SITE_URL}/ar/trips/${tripData.slug}`,
        },
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
    };
  
}

// Generate structured data for search engines
function generateStructuredData(tripData) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    "name": tripData.name,
    "description": tripData.about,
    "image": tripData.images?.[0],
    "location": {
      "@type": "Place",
      "name": tripData.dest_city.name,
      "address": tripData.address || tripData.dest_city.name
    },
    "offers": tripData.pricing ? {
      "@type": "Offer",
      "price": tripData.pricing.PersonPrice,
      "priceCurrency": "EGP"
    } : undefined,
    "provider": {
      "@type": "Organization",
      "name": "رحلة ناو",
      "url": process.env.NEXT_PUBLIC_SITE_URL
    }
  };
}

export default async function Page({ params }) {

  const locale = params.locale
  let tripData;
  let similarTripsData;

  
  try {
    tripData = await fetchTripData(params.tripId);
    similarTripsData = await getSimilarTrips(tripData.id);
  } catch (error) {
    console.error('Error fetching trip data:', error);
    notFound();
  }

  if (!tripData) {
    notFound();
  }

  const structuredData = generateStructuredData(tripData);
  
  return (
    <div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Meta Pixel Tracking */}
      <MetaPixelTripEvent trip={tripData} />
      
      {/* Main Content */}
      <MainTripPage tripData={tripData} locale={locale}/>
      {
        similarTripsData && similarTripsData.length > 0 && (
          <div className="mt-10">
            <TripsStripSection tripsData={similarTripsData} title={locale == "en"? "You might also like..." : "قد يعجبك ايضا..."} locale={locale}/>
          </div>
        )
      }
      <WhatsAppPopup/>
      
    </div>
  );
}