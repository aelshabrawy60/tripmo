import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

function DateChooserBottomSheet({ 
  tripData = {}, 
  onDateChange, 
  initialDate = null, 
  locale = "ar",
  isOpen,
  onClose
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState(initialDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [language, setLanguage] = useState('ar');

  // Translation helper
  const t = {
    title: locale === 'ar' ? 'اختر التاريخ' : 'Choose Date',
    save: locale === 'ar' ? 'حفظ' : 'Save',
    cancel: locale === 'ar' ? 'إغلاق' : 'Cancel',
    selectDate: locale === 'ar' ? "اختر تاريخًا" : "Select a date",
    availableOnly: locale === 'ar' ? 'متاح فقط في' : 'Available only on'
  };

  useEffect(() => {
    setLanguage(locale === 'ar' ? 'ar' : 'en');
  }, [locale]);

  // Reset temp date when opened
  useEffect(() => {
    if (isOpen) {
      setTempSelectedDate(selectedDate);
      setCurrentMonth(selectedDate || new Date());
    }
  }, [isOpen, selectedDate]);

  // Update internal date when initialDate changes
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

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
      setTempSelectedDate(new Date(localDateString));
    };

    if (!initialDate) {
      if (tripData.availability_type === "fixed") {
        const fixedDate = new Date(tripData.available_day);
        setSelectedDate(fixedDate);
        setTempSelectedDate(fixedDate);
      } else if (tripData.availability_type === "weekly" && tripData.weekly_days?.length > 0) {
        const nearestDate = findNearestWeeklyDay(tripData.weekly_days);
        updateDate(nearestDate);
      } else {
        updateDate(new Date());
      }
    }
  }, [tripData.availability_type, tripData, initialDate]);

  const formatDate = (date) => {
    if (!date) return t.selectDate;
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

  const handleDateClick = (date) => {
    if (tripData.availability_type === "fixed") return;

    const dayOfWeek = date.getDay();
    if (tripData.availability_type === "daily" || tripData.weekly_days?.includes(dayOfWeek)) {
      setTempSelectedDate(date);
    }
  };

  const isDateSelectable = (date) => {
    if (tripData.availability_type === "fixed") return false;
    if (tripData.availability_type === "daily") return true;
    return tripData.weekly_days?.includes(date.getDay());
  };

  const handleSave = () => {
    setSelectedDate(tempSelectedDate);
    const year = tempSelectedDate.getFullYear();
    const month = String(tempSelectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(tempSelectedDate.getDate()).padStart(2, '0');
    const localDateString = `${year}-${month}-${day}`;
    onDateChange(localDateString);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedDate(selectedDate);
    onClose();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-full"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelectable = isDateSelectable(date);
      const isSelected =
        tempSelectedDate &&
        date.getDate() === tempSelectedDate.getDate() &&
        date.getMonth() === tempSelectedDate.getMonth() &&
        date.getFullYear() === tempSelectedDate.getFullYear();

      days.push(
        <div
          key={`day-${day}`}
          onClick={() => isSelectable && handleDateClick(date)}
          className={`h-12 w-full flex flex-col items-center justify-center rounded-lg text-base
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

  if (!isOpen) return null;

  // For fixed dates, show a read-only version
  if (tripData.availability_type === "fixed") {
    return (
      <div className="fixed inset-0 z-[100]">
        <div 
          className="absolute inset-0 bg-black/50 bg-opacity-40"
          onClick={handleCancel}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
          {/* Handle bar */}
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{t.title}</h3>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Fixed date content */}
          <div className="px-6 py-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-lg font-medium text-gray-700 mb-2">
              {formatDate(new Date(tripData.available_day))}
            </div>
            <div className="text-sm text-gray-500">
              {locale === 'ar' ? 'التاريخ محدد مسبقاً' : 'Date is pre-fixed'}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-4 py-3 text-base font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <div 
        className="absolute inset-0 bg-black/50 bg-opacity-40"
        onClick={handleCancel}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Handle bar */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{t.title}</h3>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            {locale === "ar" ? 
              <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-gray-200 rounded-full">
                <ChevronRight className="h-6 w-6" />
              </button>
            :
              <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-gray-200 rounded-full">
                <ChevronLeft className="h-6 w-6" />
              </button>
            }

            <div className="font-semibold text-lg">
              {new Intl.DateTimeFormat(language, {
                month: 'long',
                year: 'numeric',
                calendar: 'gregory'
              }).format(currentMonth)}
            </div>

            {locale === "ar" ? 
              <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-gray-200 rounded-full">
                <ChevronLeft className="h-6 w-6" />
              </button>
            :
              <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-gray-200 rounded-full">
                <ChevronRight className="h-6 w-6" />
              </button>
            }
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {(locale === 'ar' ? daysOfWeekArabicShort : daysOfWeekEnglishShort).map((day, index) => (
              <div
                key={day}
                className={`h-10 w-full flex items-center justify-center text-sm font-medium ${
                  tripData.availability_type === "weekly" && tripData.weekly_days?.includes(index)
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">{renderCalendar()}</div>

          {/* Weekly availability info */}
          {tripData.availability_type === "weekly" && (
            <div className="text-sm text-gray-500 italic text-center py-2 bg-gray-50 rounded-lg">
              {locale === 'ar'
                ? `${t.availableOnly} ${tripData.weekly_days?.map(i => daysOfWeekArabic[i]).join('، ')}`
                : `${t.availableOnly} ${tripData.weekly_days?.map(i => daysOfWeekEnglish[i]).join(', ')}`}
            </div>
          )}
        </div>

        {/* Footer with buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 text-base font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateChooserBottomSheet;