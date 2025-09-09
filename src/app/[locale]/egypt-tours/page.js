import React from 'react'
import Hero from './components/Hero'
import TripsStripSection from '@/components/website/TripsStripSection'
import { unstable_cache } from 'next/cache'
import { TrendingDestinations , egyptToursPageData} from '@/utils/trips_engine/trips_engine'
import TopDestinations from '@/components/website/TopDestinations'
import WhyChooseUs from '@/components/website/WhyChooseUs'
import EgyptToursFAQ from './components/FAQ'

// SEO Metadata
export const metadata = {
  title: 'Book Egypt Tours: See the Pyramids & Cruise the Nile',
  description: 'Egypt tours made easy with Rehla Now. Enjoy luxury hotels, Nile cruises, and private guides in our all-inclusive packages. Book your Egypt tour today.',
  keywords: 'Egypt tours, Egypt travel guide, Nile cruise, Cairo tours, Luxor tours, Aswan tours, Pyramids of Giza, best Egypt tours, Egypt vacation packages, Egypt travel tips',
  
  // Open Graph tags for social media
  openGraph: {
    title: 'Book Egypt Tours: See the Pyramids & Cruise the Nile',
    description: 'Discover the magic of Egypt, hassle-free. Rela Now has all-inclusive tours cover everything from luxury hotels and Nile cruises to private guides. Explore our packages and book today.',
    url: 'https://www.rehlanow.com/en/egypt-tours', // Update with your actual URL
    images: [
      {
        url: '/blog1.jpg', // Update with full URL in production
        width: 1200,
        height: 630,
        alt: 'Egypt Tours Guide - Pyramids and Ancient Wonders',
      }
    ],
    locale: 'en_US',
    siteName: 'Rehla Now', // Update with your site name
  },
  
  // Additional SEO tags
  alternates: {
    canonical: 'https://www.rehlanow.com/en/egypt-tours', // Update with your actual URL
  },
  
  // Article specific metadata
  category: 'Travel',
  modifiedTime: new Date().toISOString(),
  
  // Additional meta tags
  other: {
    'article:section': 'Travel',
    'article:tag': 'Egypt, Travel, Tours, Vacation, Ancient Egypt, Pyramids',
  },
}


// Cache the data fetching functions
const getCachedDestinations = unstable_cache(
  async (locale) => await TrendingDestinations(locale),
  ['trending-destinations'],
  {
    revalidate: 21600, // 6 hours
    tags: ['destinations']
  }
)

const getCachedEgyptToursPageData = unstable_cache(
  async (locale) => await egyptToursPageData(locale),
  ['egypt-tours-page-data'],
  {
    revalidate: 1, // 6 hours
    tags: ['trips']
  }
)

async function page() {

  const topDestinations = await getCachedDestinations("en")
  const topTrips = await getCachedEgyptToursPageData("en")
  
  console.log("Top Trips Data:", topTrips.categories); // Debugging line to check the structure of topTrips
  const cairoTrips = topTrips.categories.find(category => category.city === "Cairo");
  const luxorTrips = topTrips.categories.find(category => category.city === "Luxor");
  const aswanTrips = topTrips.categories.find(category => category.city === "Aswan");
  const gizaTrips = topTrips.categories.find(category => category.city === "Giza");

  return (
    <div>
        <Hero/>
        <div className='mt-10'>
          <TripsStripSection tripsData={topTrips.top} locale={"en"} title={"Trending Egypt Tours"}/>
          <div className='mt-16 mb-30'>
            <WhyChooseUs/>
          </div>
          <div>
            <TopDestinations destinations={topDestinations} title={"Egypt Best Destinations"} />
          </div>

          {/* Section: Must-See Destinations */}
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2 md:px-0">
              Must-See Destinations & Attractions on Your Tour
            </h2>
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <div>
                <div className='px-2 md:px-0 md:mb-10'>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">The Giza Plateau</h3>
                  <p>
                    No trip to Egypt is complete without a visit to the Giza Plateau. Home to the last surviving wonder of the ancient world, the <strong className="font-bold">Great Pyramids of Giza</strong>. Standing before the Pyramid of Khufu, the Pyramid of Khafre, the Pyramid of Menkaure, and the enigmatic <strong className="font-bold">Great Sphinx</strong> is a truly humbling, bucket-list experience.
                  </p>
                </div>
                <TripsStripSection tripsData={gizaTrips?.trips || []} locale={"en"}/>
              </div>
              <div>
                <div className='px-2 md:px-0 md:mb-10'>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Cairo and the Grand Egyptian Museum (GEM)</h3>
                  <p>
                    The bustling capital is a sensory overload of history and modern life. The city is the location of the highly anticipated <strong className="font-bold">Grand Egyptian Museum</strong>, set to be the world's largest archaeological museum. It will house the full <strong className="font-bold">Tutankhamun collection</strong>, providing an unparalleled look into the life of the boy king.
                  </p>
                </div>
                <TripsStripSection tripsData={cairoTrips?.trips || []} locale={"en"}/>
              </div>
              <div>
                <div className='px-2 md:px-0 md:mb-10'>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Luxor: The World's Greatest Open-Air Museum</h3>
                  <p>
                    This city, built on the site of ancient Thebes, is a monument to Egypt's imperial past. It is home to the sprawling <strong className="font-bold">Karnak Temple Complex</strong>, a city of temples dedicated to the Theban Triad. On the West Bank, you'll explore the famous <strong className="font-bold">Valley of the Kings</strong>, the royal necropolis where Tutankhamun's tomb was discovered, and the majestic mortuary Temple of Hatshepsut.
                  </p>
                </div>
                <TripsStripSection tripsData={luxorTrips?.trips || []} locale={"en"}/>
              </div>
              <div>
                <div className='px-2 md:px-0 md:mb-10'>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Aswan and the Colossal Temples of Abu Simbel</h3>
                  <p>
                    From the relaxed city of <strong className="font-bold">Aswan</strong>, you can sail a traditional felucca on the Nile, visit the beautiful <strong className="font-bold">Philae Temple</strong> (dedicated to the goddess Isis), and discover the Unfinished Obelisk. The highlight is the optional (but highly recommended) trip to the colossal rock-cut temples of <strong className="font-bold">Abu Simbel</strong>, a true marvel of ancient engineering saved from the rising waters of the Aswan Dam.
                  </p>
                </div>
                <TripsStripSection tripsData={aswanTrips?.trips || []} locale={"en"}/>
              </div>
            </div>
          </section>
          {/* Add the FAQ Component */}
          <div className='mt-20'>
            <EgyptToursFAQ />
          </div>
        </div>
    </div>
  )
}

export default page