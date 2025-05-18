// app/components/MainTripsSections.jsx (or .js)
// This is now a Server Component by default (no 'use client' directive)

import MainTripsSection from "./MainTripsSection";


const MainTripsSections = ({ tripsData }) => {
  // Categorize trips based on category.name (no hooks needed)
  const categorizedTrips = {};

  tripsData.forEach(trip => {
    if (!trip.categories || !trip.categories.name) return;

    const categoryName = trip.categories.name;
    if (!categorizedTrips[categoryName]) {
      categorizedTrips[categoryName] = [];
    }

    categorizedTrips[categoryName].push(trip);
  });


  return (
    <div className="w-full mt-10 mb-10">
      <div className="space-y-6">
        {/* Render a section for each category */}
        {Object.entries(categorizedTrips).map(([categoryName, trips]) => (
          <div key={categoryName} className="border-b pb-6 last:border-b-0">
            <MainTripsSection 
              tripsData={trips} 
              title={categoryName} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainTripsSections;
