'use client'

import TripsViewer from '@/components/website/TripsViewer'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading'

function TripsContent() {
  const [trips, setTrips] = useState(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  const departureCity = searchParams.get('depature_city')
  const destCity = searchParams.get('dest_city')
  const query = searchParams.get('q')

  const fetchTrips = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (departureCity) params.append('depature_city', departureCity)
      if (destCity) params.append('dest_city', destCity)
      if (query) params.append('q', query)

      const response = await fetch(`/api/client/trips?${params.toString()}`)
      if (!response.ok) throw new Error('Network response was not ok')

      const data = await response.json()
      setTrips(data)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setTrips(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [departureCity, destCity, query])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <div>
      <TripsViewer trips={trips} />
    </div>
  )
}

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <TripsContent />
    </Suspense>
  )
}

export default page
