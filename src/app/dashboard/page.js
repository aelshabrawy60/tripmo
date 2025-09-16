"use client"

import Itinerary from '@/components/Itinerary/Itinerary/Itinerary'
import React from 'react'

const data = [
  {
    "steps": [
        {
          title: "Arrival at Destination",
          description: "Arrive at your destination and check into your hotel. Take some time to relax and freshen up after your journey.",
          duration: "1"
        },
        {
          title: "City Tour",
          description: "Explore the city's main attractions with a guided tour. Visit historical landmarks, museums, and local markets.",
          duration: "3"
        },
        {
          title: "Lunch at Local Restaurant",
          description: "Enjoy a delicious lunch at a popular local restaurant, savoring traditional dishes and flavors.",
          duration: "1"
        },
        { 
          title: "Evening Stroll",
          description: "Take a leisurely stroll through the city streets, enjoying the local atmosphere and perhaps stopping for a drink.",
          duration: "2"
        }
    ]
  },
  {
    "steps": [
        {
          title: "Breakfast at Hotel",
          description: "Start your day with a hearty breakfast at your hotel, preparing for a day of adventure.",
          duration: "1"
        },
        {
          title: "Visit to Local Museum",
          description: "Spend the morning exploring a renowned local museum, learning about the area's history and culture.",
          duration: "2"
        },
      ]
    }
]

function page() {
  return (
    <div className='max-w-md'>
      <Itinerary data={data} locale={"en"}/>
    </div>
  )
}

export default page