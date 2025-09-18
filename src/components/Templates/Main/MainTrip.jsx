import GalleryViewer from './GalleryViewer'
import MainTripDetails from './MainTripDetails'
import MainBookingCard from './MainBookingCard'
import MainRatingsSection from './MainRatingsSection'
import StarsRates from '@/components/website/StarsRates'
import InlineCancelationPolicy from '@/components/Trips/InlineCancelationPolicy'
import MiniBookingCard from '@/components/website/MiniBookingCard'

function MainTrip({tripData, locale}) {

  return (
    <div className="max-w-7xl mx-auto p-2">
      {/* Gallery Section */}
      
      
      <div className="w-full relative overflow-hidden">
        <GalleryViewer images={tripData.images} locale={locale}/>
      </div>
      
      {/* Content Section - Responsive Grid */}
      <div className="py-4 md:py-8 lg:py-6">
        <div className='flex gap-5 flex-wrap gap-y-0'>
          {tripData.rates_sum && tripData.rates_count?
          (
            <div className='flex mb-4 gap-1 items-center text-gray-600'>
              <span className='leading-none'>{(tripData.rates_sum / tripData.rates_count).toFixed(1)}</span>
              <StarsRates rate={tripData.rates_sum / tripData.rates_count} size={5}/>
              <span className='leading-none'>{`(${tripData.rates_count})`}</span>
            </div>
          ): 
          null
          }
          <div className='mb-2'>
              <InlineCancelationPolicy policy={tripData.cancellation_policy} locale={locale}/>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Trip Details - Takes full width on mobile, half on larger screens */}
          <div className="order-2 lg:order-1">
            <MainTripDetails 
              name={tripData.name}
              about={tripData.about}
              groupId={tripData.group_id}
              depature_city={locale == "en"? tripData.depature_city.name_en : tripData.depature_city.name}
              dest_city={locale == "en"? tripData.dest_city.name_en : tripData.dest_city.name}
              startLocation={tripData?.start_location}
              locale={locale}
              policy={tripData.cancellation_policy}
              duration={tripData.duration}
              translation={tripData.translation}
              guideLangs={tripData.guide_langs}
              itinerary={tripData?.itinerary}
            />
          </div>
          
          {/* Booking Card - Takes full width on mobile, half on larger screens */}
          <div className="order-2 lg:order-2">
            <div className="sticky flex flex-col items-end top-4 z-10" id="booking-section">
              <MainBookingCard 
                tripData={tripData}
                locale={locale}
              />
            </div>
          </div>

          <MiniBookingCard pricing={tripData.pricing} locale={locale}/>
        </div>
      </div>
      <MainRatingsSection ratings={tripData.ratings} tripId={tripData.id} locale={locale}/>
    </div>
  )
}

export default MainTrip
