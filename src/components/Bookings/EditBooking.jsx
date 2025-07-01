import React, { useState, useEffect } from 'react';
import DateChooser from './DateChooser';
import PersonsNumChooser from './PersonsNumChooser';

const EditBooking = ({ 
  bookingId,
  tripData,
  initialDate,
  initialNumberOfSeats,
  isOpen = false,
  onClose,
  onSuccess
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(initialDate);
  const [numberOfSeats, setNumberOfSeats] = useState(initialNumberOfSeats);

  // Update modal state when isOpen prop changes
  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  // Update form data when initialData changes
  useEffect(() => {
    setDate(initialDate);
    setNumberOfSeats(initialNumberOfSeats);
  }, [initialDate, initialNumberOfSeats]);

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // Handle seats change
  const handleSeatsChange = (newSeats) => {
    setNumberOfSeats(newSeats);
  };

  const handleEditBooking = async () => {
    try {
      const response = await fetch('/api/dashboard/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          tripId: tripData.id,
          date,
          numberOfSeats,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(`${result.message}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error editing booking:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await handleEditBooking();
      console.log('Booking edited successfully:', result);
      
      // Close modal and call success callback
      setIsModalOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error editing booking:', error);
      setError(error.message || 'فشل في تعديل الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // If modal is closed and we're controlling externally, don't render
  if (!isModalOpen && onClose) {
    return null;
  }

  return (
    <>
      {/* Button to open modal - only show if we're not controlling externally */}
      {!onClose && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className='w-full bg-tripmo-500 text-white py-2 px-4 rounded-md font-medium text-base transition-all duration-300 hover:bg-tripmo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
          dir="rtl"
        >
          تعديل الحجز
        </button>
      )}
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600/80 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" dir="rtl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                تعديل الحجز
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <DateChooser 
                  tripData={tripData} 
                  onDateChange={handleDateChange} 
                  intiateDate={new Date(date)}
                />
              </div>
              
              <PersonsNumChooser
                onChange={handleSeatsChange}
                initialValue={numberOfSeats}
              />
              
              <div className="flex mt-4 items-center justify-between">
                <button
                  type="submit"
                  className={`w-full bg-tripmo-500 text-white py-2 px-4 rounded-md font-medium text-base transition-all duration-300 hover:bg-tripmo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري التعديل...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditBooking;