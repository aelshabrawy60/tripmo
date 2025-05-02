// components/TripCreationForm.jsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function TripCreationForm({ groupId }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState({
    name: "",
    about: "",
    max_clients: 1,
    availability_type: "fixed", // Default: fixed, daily, weekly
    available_day: "", // For fixed availability
    start_date: "", // For daily/weekly availability
    end_date: "", // For daily/weekly availability
    weekly_days: [], // For weekly availability - sun, mon, tue, wed, thu, fri, sat
    group_id: groupId || "",
  });
  
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  // Week days for selection
  const weekDays = [
    { code: "sun", label: "الأحد" },
    { code: "mon", label: "الأتنين" },
    { code: "tue", label: "الثلاثاء" },
    { code: "wed", label: "الاربعاء" },
    { code: "thu", label: "الخميس" },
    { code: "fri", label: "الجمعة" },
    { code: "sat", label: "السبت" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleWeekDayToggle = (day) => {
    setTripData((prev) => {
      const updatedDays = prev.weekly_days.includes(day)
        ? prev.weekly_days.filter((d) => d !== day)
        : [...prev.weekly_days, day];
      
      return { ...prev, weekly_days: updatedDays };
    });
    
    // Clear weekly_days error if it exists
    if (errors.weekly_days) {
      setErrors((prev) => ({ ...prev, weekly_days: "" }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Clear image errors
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }

    // Preview images
    const newImagePreviews = files.map((file) => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file
    }));

    setImages((prev) => [...prev, ...newImagePreviews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (idToRemove) => {
    const imageToRemove = images.find(img => img.id === idToRemove);
    if (imageToRemove) {
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    setImages(prev => prev.filter(img => img.id !== idToRemove));
    setImageFiles(prev => prev.filter((_, index) => 
      images[index].id !== idToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!tripData.name.trim()) newErrors.name = "العنوان مطلوب";
    if (!tripData.about.trim()) newErrors.about = "الوصف مطلوب";
    if (!tripData.max_clients || tripData.max_clients < 1) 
      newErrors.max_clients = "اكبر عدد للافراد مطلوب";
    
    // Availability type specific validation
    if (tripData.availability_type === "fixed" && !tripData.available_day) {
      newErrors.available_day = "من افضلك اختر يوم الرحلة";
    }
    
    if (["daily", "weekly"].includes(tripData.availability_type)) {      
      if (tripData.start_date && tripData.end_date) {
        const start = new Date(tripData.start_date);
        const end = new Date(tripData.end_date);
        if (start > end) {
          newErrors.end_date = "تاريخ الانتهاء يجب ان يكون بعد تاريخ البدء";
        }
      }
    }
    
    if (tripData.availability_type === "weekly" && !tripData.weekly_days.length) {
      newErrors.weekly_days = "من فضلك اختر يوم واحد علي الاقل في الاسبوع";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    
    for (const file of imageFiles) {
      // Create a unique file path for each image
      const filePath = `trips/${groupId}/${uuidv4()}-${file.name}`;
      
      // Create FormData for the upload
      const formData = new FormData();
      formData.append("file", file);
      
      // Upload to Supabase Storage
      try {
        const response = await fetch(`/api/storage/upload?path=${filePath}`, {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${file.name}`);
        }
        
        const data = await response.json();
        uploadedUrls.push(data.url);
      } catch (error) {
        console.error("Image upload error:", error);
        throw new Error("Failed to upload one or more images");
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors before submitting"
      });
      return;
    }
    
    setLoading(true);
    setSubmitStatus({ type: "", message: "" });
    
    try {
      // 1. Upload images to Supabase storage
      const imageUrls = await uploadImages();
      
      // 2. Prepare trip data based on availability type
      const tripPayload = {
        name: tripData.name,
        about: tripData.about,
        images: imageUrls,
        max_clients: parseInt(tripData.max_clients),
        availability_type: tripData.availability_type,
        group_id: tripData.group_id,
      };
      
      // Add specific fields based on availability type
      if (tripData.availability_type === "fixed") {
        tripPayload.available_day = tripData.available_day;
      } else {
        tripPayload.start_date = tripData.start_date;
        tripPayload.end_date = tripData.end_date;
        
        if (tripData.availability_type === "weekly") {
          tripPayload.weekly_days = tripData.weekly_days;
        }
      }
      
      // 3. Create the trip using the API
      const response = await fetch("/api/dashboard/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripPayload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create trip");
      }
      
      // 4. Handle success
      const newTrip = await response.json();
      setSubmitStatus({
        type: "success",
        message: "Trip created successfully!"
      });
      
      // Optional: Redirect to the trip page or list after a short delay
      setTimeout(() => {
        router.push(`/dashboard/trips`);
      }, 1500);
      
    } catch (error) {
      console.error("Error creating trip:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to create trip. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">انشاء رحلة جديدة</h1>
      
      {submitStatus.message && (
        <div className={`p-4 mb-6 rounded-md ${
            submitStatus.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            العنوان*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={tripData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="ادخل عنوان للرحلة"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        {/* Trip Description */}
        <div>
          <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
            الوصف*
          </label>
          <textarea
            id="about"
            name="about"
            value={tripData.about}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-md ${
              errors.about ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="ادخل وصف للرحلة"
          ></textarea>
          {errors.about && (
            <p className="mt-1 text-sm text-red-600">{errors.about}</p>
          )}
        </div>
        
        {/* Max Clients */}
        <div>
          <label htmlFor="max_clients" className="block text-sm font-medium text-gray-700 mb-1">
            اقصي عدد للافراد*
          </label>
          <input
            type="number"
            id="max_clients"
            name="max_clients"
            value={tripData.max_clients}
            onChange={handleInputChange}
            min="1"
            className={`w-full px-4 py-2 border rounded-md ${
              errors.max_clients ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.max_clients && (
            <p className="mt-1 text-sm text-red-600">{errors.max_clients}</p>
          )}
        </div>
        
        {/* Availability Type */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              التواريخ المتاحة*
            </legend>
            <div className="flex flex-wrap gap-4">
              {["fixed", "daily", "weekly"].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="radio"
                    id={`availability-${type}`}
                    name="availability_type"
                    value={type}
                    checked={tripData.availability_type === type}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`availability-${type}`} className="mr-2 text-sm text-gray-700 capitalize">
                    {type == "fixed" ? "يوم واحد" : type === "daily" ? "كل يوم" : "اسبوعي"}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
        
        {/* Conditional fields based on availability type */}
        {tripData.availability_type === "fixed" && (
          <div>
            <label htmlFor="available_day" className="block text-sm font-medium text-gray-700 mb-1">
              اختر اليوم*
            </label>
            <input
              type="date"
              id="available_day"
              name="available_day"
              value={tripData.available_day}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.available_day ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.available_day && (
              <p className="mt-1 text-sm text-red-600">{errors.available_day}</p>
            )}
          </div>
        )}
        
        {["daily", "weekly"].includes(tripData.availability_type) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ البدء*
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={tripData.start_date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.start_date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الانتهاء*
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={tripData.end_date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.end_date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Weekly days selection (only for weekly availability) */}
        {tripData.availability_type === "weekly" && (
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              اختر ايام الاسبوع*
            </div>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.code}
                  type="button"
                  onClick={() => handleWeekDayToggle(day.code)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    tripData.weekly_days.includes(day.code)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {errors.weekly_days && (
              <p className="mt-1 text-sm text-red-600">{errors.weekly_days}</p>
            )}
          </div>
        )}
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صور الرحلة*
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                  <div className="relative w-full h-32">
                    <Image 
                      src={image.url} 
                      alt="Trip preview" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            
            {/* Add image button */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-w-1 aspect-h-1 w-full cursor-pointer"
            >
              <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 transition-colors">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="mt-1 block text-sm text-gray-500">اضف صورة</span>
                </div>
              </div>
            </div>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            اختر صورة
          </button>
          
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 text-white bg-blue-600 rounded-md shadow-sm text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الانشاء ...
              </span>
            ) : (
              "انشئ رحلة"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}