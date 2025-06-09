// app/trip/[tripId]/page.js (or wherever your route lives)
import { Templates } from "@/components/Templates/Templates";
import { fetchSiteData } from "@/utils/sites/sites";

// Import all possible components statically
import MainTripPage from "@/components/Templates/Main/MainTripPage";

const componentMap = {
  MainTripPage,
};

async function fetchTripData(tripId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/client/trips?id=${tripId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch trip data: ${res.status}`);
  }

  return res.json();
}

export default async function Page({ params }) {
  const { id ,tripId } = params;

  let tripData;
  try {
    tripData = await fetchTripData(tripId);
  } catch (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No trip data found
      </div>
    );
  }

  return (
    <div>
      <MainTripPage tripData={tripData} />
    </div>
  );
}
