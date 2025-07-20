import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

function DateChooser({ tripData = {}, onDateChange, intiateDate = null, locale = "ar" }) {
  const [selectedDate, setSelectedDate] = useState(intiateDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    setLanguage(locale === 'ar' ? 'ar' : 'en');
  }, [locale]);

  const daysOfWeekArabic = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const daysOfWeekArabicShort = ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

  const daysOfWeekEnglish = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysOfWeekEnglishShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const findNearestWeeklyDay = (availableDays) => {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const sortedDays = [...availableDays].sort((a, b) => {
      const diffA = (a - todayDayOfWeek + 7) % 7;
      const diffB = (b - todayDayOfWeek + 7) % 7;
      return diffA - diffB;
    });
    const nearestDayOfWeek = sortedDays[0];
    const daysToAdd = (nearestDayOfWeek - todayDayOfWeek + 7) % 7;
    const nearestDate = new Date(today);
    nearestDate.setDate(today.getDate() + daysToAdd);
    return nearestDate;
  };

  useEffect(() => {
    const updateDate = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;
      setSelectedDate(new Date(localDateString));
      onDateChange(localDateString);
    };

    if (!intiateDate) {
      if (tripData.availability_type === "fixed") {
        onDateChange(tripData.available_day);
      } else if (tripData.availability_type === "weekly" && tripData.weekly_days?.length > 0) {
        const nearestDate = findNearestWeeklyDay(tripData.weekly_days);
        updateDate(nearestDate);
      } else {
        updateDate(new Date());
      }
    } else {
      updateDate(intiateDate);
    }
  }, [tripData.availability_type, tripData]);

  const formatDate = (date) => {
    if (!date) return locale === 'ar' ? "اختر تاريخًا" : "Select a date";
    return new Intl.DateTimeFormat(language, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      calendar: 'gregory'
    }).format(date);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

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
    e.preventDefault();
    if (tripData.availability_type === "fixed") return;

    const dayOfWeek = date.getDay();
    if (tripData.availability_type === "daily" || tripData.weekly_days?.includes(dayOfWeek)) {
      setSelectedDate(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;
      onDateChange(localDateString);
      setShowCalendar(false);
    }
  };

  const isDateSelectable = (date) => {
    if (tripData.availability_type === "fixed") return false;
    if (tripData.availability_type === "daily") return true;
    return tripData.weekly_days?.includes(date.getDay());
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelectable = isDateSelectable(date);
      const isSelected =
        selectedDate &&
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

  const commonCalendarHeader = (
    <div className="flex items-center justify-between mb-2">
      <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-200 rounded-full">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="font-medium">
        {new Intl.DateTimeFormat(language, {
          month: 'long',
          year: 'numeric',
          calendar: 'gregory'
        }).format(currentMonth)}
      </div>
      <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 rounded-full">
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );

  const commonWeekDaysHeader = (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {(locale === 'ar' ? daysOfWeekArabicShort : daysOfWeekEnglishShort).map((day, index) => (
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center text-xs font-medium ${
            tripData.availability_type === "weekly" && tripData.weekly_days?.includes(index)
              ? 'text-blue-600 font-bold'
              : 'text-gray-500'
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );

  const commonCalendarFooter = (
    <div className="mt-3 flex justify-between items-center">
      <button
        type="button"
        onClick={() => setShowCalendar(false)}
        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
      >
        {locale === 'ar' ? "تم" : "Done"}
      </button>
      {tripData.availability_type === "weekly" && (
        <div className="text-xs text-gray-500 italic">
          {locale === 'ar'
            ? `متاح فقط في ${tripData.weekly_days?.map(i => daysOfWeekArabic[i]).join('، ')}`
            : `Available only on ${tripData.weekly_days?.map(i => daysOfWeekEnglish[i]).join(', ')}`}
        </div>
      )}
    </div>
  );

  const calendarPopup = (
    <div className="absolute mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg z-10">
      {commonCalendarHeader}
      {commonWeekDaysHeader}
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
      {commonCalendarFooter}
    </div>
  );

  if (tripData.availability_type === "fixed") {
    return (
      <div className="w-full max-w-md min-w-[200px] flex-1 opacity-75">
        <div className="relative">
          <div className="w-full flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-sm cursor-not-allowed">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span>{formatDate(new Date(tripData.available_day))}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md min-w-[200px] flex-1">
      <div className="relative">
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <Calendar className="h-5 w-5 text-gray-400" />
          <span>{formatDate(selectedDate)}</span>
        </button>
      </div>
      {showCalendar && calendarPopup}
    </div>
  );
}

export default DateChooser;
