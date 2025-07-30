import DestintaionCard from "./DestintaionCard"

function TopDestinations({ destinations, title }) {
  if (!destinations || destinations.length === 0) {
    return <div className="text-center text-gray-500">No destinations available</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">{title}</h2>

      {/* Grid container */}
      <div className="grid gap-4">
        {/* Show only first 3 on small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
          {destinations.slice(0, 5).map((destination, index) => (
            <DestintaionCard key={index} data={destination} />
          ))}
        </div>

        {/* Full layout for md and up */}
        <div className="hidden md:grid gap-4">
          {/* First row - 2 columns */}
          {destinations.length >= 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DestintaionCard data={destinations[0]} />
              <DestintaionCard data={destinations[1]} />
            </div>
          )}

          {/* Second row - 3 columns */}
          {destinations.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.slice(2, 5).map((destination, index) => (
                <DestintaionCard key={index + 2} data={destination} />
              ))}
            </div>
          )}

          {/* Additional destinations if more than 5 */}
          {destinations.length > 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {destinations.slice(5).map((destination, index) => (
                <DestintaionCard key={index + 5} data={destination} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopDestinations;
