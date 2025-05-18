import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

function DateChooser({ tripData = {}, onDateChange, intiateDate = new Date() }) {
  const [selectedDate, setSelectedDate] = useState(intiateDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDays, setSelectedDays] = useState(tripData.weekly_days || []);
  // Set language to Arabic with Gregorian calendar
  const [language, setLanguage] = useState('ar');

  useEffect(()=>{
    if(tripData.availability_type == "fixed"){
      onDateChange(tripData.available_day)
    }else{
      const date = new Date()
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');

      const localDateString = `${year}-${month}-${day}`;
      onDateChange(localDateString)
    }
    
  }, [])
  // If trip data changes, update our state
  useEffect(() => {
    if (tripData.weekly_days) {
      setSelectedDays(tripData.weekly_days);
    }
  }, [tripData]);

  // Arabic day names
  const daysOfWeekArabic = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const daysOfWeekArabicShort = ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];
  
  const formatDate = (date) => {
    if (!date) return "اختر تاريخًا" // "Select a date" in Arabic
    // Use Intl.DateTimeFormat to ensure Gregorian calendar with Arabic locale
    return new Intl.DateTimeFormat(language, { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      calendar: 'gregory' // Explicitly use Gregorian calendar
    }).format(date);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (tripData.availability_type !== "fixed") {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    }
  };

  const handleNextMonth = () => {
    if (tripData.availability_type !== "fixed") {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    }
  };

  const handleDateClick = (e, date) => {
    // Prevent default form submission
    e.preventDefault();
    // Skip if type is fixed
    if (tripData.availability_type === "fixed") return;

    // For daily type, all days are selectable
    // For weekly type, only days matching selectedDays are selectable
    const dayOfWeek = date.getDay();
    if (tripData.availability_type === "daily" || selectedDays.includes(dayOfWeek)) {
      setSelectedDate(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');

      const localDateString = `${year}-${month}-${day}`;
      onDateChange(localDateString); // Notify parent component of date change
      setShowCalendar(false);
    }
  };

  const isDateSelectable = (date) => {
    // For fixed trips, no dates are selectable
    if (tripData.availability_type === "fixed") {
      return false;
    }
    // For daily trips, all dates are selectable
    if (tripData.availability_type === "daily") {
      return true;
    }
    // For weekly trips, only dates matching selectedDays are selectable
    return selectedDays.includes(date.getDay());
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelectable = isDateSelectable(date);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() && 
        date.getMonth() === selectedDate.getMonth() && 
        date.getFullYear() === selectedDate.getFullYear();
      
      
      days.push(
        <div 
          key={`day-${day}`} 
          onClick={(e) => isSelectable && handleDateClick(e, date)}
          className={`h-12 w-full flex flex-col items-center justify-center rounded text-sm
            ${isSelected ? 'bg-blue-600 text-white' : ''}
            ${isSelectable && !isSelected ? 'hover:bg-blue-100 cursor-pointer' : ''}
            ${!isSelectable ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}`}
        >
          <span>{day}</span>
        </div>
      );
    }
    
    return days;
  };

  // For fixed type, show calendar but in disabled mode
  if (tripData.availability_type === "fixed") {
    return (
      <div className="w-full max-w-md min-w-[200px] flex-1 opacity-75"> 
        <div className="">
          <div className="relative">
            <div className="w-full flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-sm cursor-not-allowed">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>{formatDate(new Date(tripData.available_day))}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For daily trip type, show calendar with all days selectable
  if (tripData.availability_type === "daily") {
    return (
      <div className="w-full max-w-md min-w-[200px] flex-1"> {/* RTL direction for Arabic */}
        <div className="">
          <div className="relative">
            <button
              type='button'
              className="w-full flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>{formatDate(selectedDate)}</span>
            </button>
          </div>
        </div>

        {showCalendar && (
          <div className="absolute mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <div className="flex items-center justify-between mb-2">
              <button 
                type='button'
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="font-medium">
                {new Intl.DateTimeFormat(language, { 
                  month: 'long', 
                  year: 'numeric',
                  calendar: 'gregory' // Explicitly use Gregorian calendar
                }).format(currentMonth)}
              </div>
              <button
                type='button' 
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {/* Display Arabic day names */}
              {daysOfWeekArabicShort.map((day) => (
                <div 
                  key={day} 
                  className="h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
            
            <div className="mt-3 flex justify-end">
              <button
                type='button'
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
              >
                تم {/* Done in Arabic */}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render weekly date chooser with calendar that only allows weekly days
  if (tripData.availability_type === "weekly") {
    return (
      <div className="w-full max-w-md min-w-[200px] flex-1"> {/* RTL direction for Arabic */}
        <div className="">
          <div className="relative">
            <button
              type='button'
              className="w-full flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>{formatDate(selectedDate)}</span>
            </button>
          </div>
        </div>

        {showCalendar && (
          <div className="absolute mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <div className="flex items-center justify-between mb-2">
              <button 
                type='button'
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="font-medium">
                {new Intl.DateTimeFormat(language, { 
                  month: 'long', 
                  year: 'numeric',
                  calendar: 'gregory' // Explicitly use Gregorian calendar
                }).format(currentMonth)}
              </div>
              <button 
                type='button'
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeekArabicShort.map((day, index) => (
                <div 
                  key={day} 
                  className={`h-8 w-8 flex items-center justify-center text-xs font-medium 
                    ${selectedDays.includes(index) ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
            
            <div className="flex justify-between mt-3">
              <button
                type='button'
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
              >
                تم {/* Done in Arabic */}
              </button>
              <div className="text-xs text-gray-500 italic">
                متاح فقط في {selectedDays.map(dayIndex => daysOfWeekArabic[dayIndex]).join('، ')} {/* Only available on x days in Arabic */}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default fallback
  return null;
}

export default DateChooser;