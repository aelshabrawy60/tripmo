import React from 'react'
import ItinerarySteps from '../ItinerarySteps/ItinerarySteps'
import AccordionItem from '@/components/website/AccordionItem'

function Itinerary({data, locale}) {

  if(data.length < 2){
    return (
        <div>
            <ItinerarySteps steps={data[0].steps}/>
        </div>
    )
  }
  return (
    <div>
        {data.map((itinerary, index) => (
            <AccordionItem title={locale == "en" ? `Day ${index + 1}` : `اليوم ${index + 1}`} key={index} defaultOpen={index == 0}>
                <div className="mt-4">
                    <ItinerarySteps steps={itinerary.steps} locale={locale}/>
                </div>
            </AccordionItem>
        ))}
    </div>
  )
}

export default Itinerary