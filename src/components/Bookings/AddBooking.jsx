import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-phone-number-input/style.css';
import UserChooser from '../Users/UserChooser';
import PersonsNumChooser from './PersonsNumChooser';
import DateChooser from './DateChooser';
import TimeChooser from '../Trips/TimeChooser';


const AddBooking = ({ 
  groupId,
  initialData,
  isOpen = false,
  onClose,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    numberOfSeats: 1,
    date: '',
    time: null,
    tripData: initialData?.tripData || {},
    groupId: groupId,
  });
  
  // Update modal state when isOpen prop changes
  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);
  
  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        date: initialData?.date? initialData.date : initialData?.tripData?.availability_type == "fixed" ? initialData?.tripData?.available_day : '',
        tripData: initialData?.tripData || {},
        groupId: groupId,
      }));
    }
  }, [initialData]);
  
    
  // Handle time select changes
  const handlePersonsChange = (num) => {
    setFormData(prevData => ({
      ...prevData,
      numberOfSeats: num
    }));
  };
  // Handle time select changes
  const handleDateChange = (date) => {
    console.log("changing date", date)
    setFormData(prevData => ({
      ...prevData,
      date: date
    }));
  };

  const handleTimeChange = (time) =>{
    setFormData(prevData =>({
      ...prevData,
      time: time
    }))
  }
  
  // Handle player selection from PlayerChooser
  const handlePlayerChange = (player) => {
    if (player) {
      setFormData(prevData => ({
        ...prevData,
        name: player.name,
        phone: player.phone,
        playerId: player.id || ''
      }));
      
      // Clear phone error if a valid player is selected
      setPhoneError(null);
    } else {
      setFormData(prevData => ({
        ...prevData,
        name: '',
        phone: '',
        playerId: ''
      }));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    setError(null);
    setPhoneError(null);
    
    // Check if player is selected (name and phone are required)
    if (!formData.name || formData.name.trim() === '') {
      setError('الاسم مطلوب');
      return false;
    }
    
    if (!formData.phone || formData.phone.trim() === '') {
      setPhoneError('رقم الهاتف مطلوب');
      return false;
    }
    
    return true;
  };
  
  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };
  
  // Add a slot after player registration
  const addSlot = async (playerData) => {
    try {
      
      const response = await axios.post('/api/dashboard/bookings', playerData);
      
      if (response.status === 200) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          phone: '',
          groupId: groupId,
          numberOfSeats: 1,
          date: initialData?.date? initialData.date : initialData?.tripData?.availability_type == "fixed" ? initialData?.tripData?.available_day : '',
          time: null,
          tripData: initialData?.tripData || {},
        });
        
        // Call success callback if provided
        if (onSuccess) onSuccess();
      } else {
        throw new Error(`Error adding slot: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error adding slot:", err);
      setError(err.response?.data?.message || 'فشل في إضافة الموعد. يرجى المحاولة مرة أخرى.');
      throw err; // Rethrow to propagate the error
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a copy of form data to modify
      const submitData = {
        ...formData,
        tripId: formData.tripData.id,
      };

      
      console.log("Submitting data:", submitData);
      // Now add the slot with complete player information
      await addSlot(submitData);
      console.log("Slot added successfully");
      
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      // Error handling is done in the individual functions
    } finally {
      setIsLoading(false);
      setRegistrationStatus(null);
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
          إضافة حجز جديد
        </button>
      )}
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600/80 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" dir="rtl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
               إضافة حجز جديد
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {registrationStatus && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">{registrationStatus}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <DateChooser tripData={formData.tripData} onDateChange={handleDateChange} intiateDate={new Date(formData.date)}/>
              </div>
              
              <PersonsNumChooser onChange={handlePersonsChange}/>
              <div className='mt-4'>
                <TimeChooser tripData={formData.tripData} onChange={handleTimeChange}/>
              </div>
              {/* Player selection with PlayerChooser */}
              <div className="mt-4">
                <UserChooser 
                  groupId={formData.groupId} 
                  onChange={handlePlayerChange}
                />
              </div>
                            
              <div className="flex mt-4 items-center justify-between">
                <button
                  type="submit"
                  className={`w-full bg-tripmo-500 text-white py-2 px-4 rounded-md font-medium text-base transition-all duration-300 hover:bg-tripmo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري الإضافة...' :  'إضافة موعد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBooking;