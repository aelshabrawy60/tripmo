"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { Trash2, Pencil, Save, X, Plus } from "lucide-react";
import TripPricingEditor from "@/components/Trips/TripPricingEditor";
import CityChooser from "@/components/Trips/CityChooser";
import TripCancellationPolicyEditor from "@/components/Trips/TripCancellationPolicyEditor";

export default function TripDetailPage({ params }) {
    const { id: tripId } = React.use(params);
    const router = useRouter();
    const fileInputRef = React.useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [editData, setEditData] = useState(null);
  
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

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

  // Fetch trip data
  useEffect(() => {
    async function fetchTripData() {
      try {
        const response = await fetch(`/api/dashboard/trips?id=${tripId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch trip data");
        }
        
        const data = await response.json();
        setTripData(data);
        
        // Convert existing images to the format expected by the UI
        const existingImages = data.images?.map(url => ({
          id: uuidv4(),
          url,
          existing: true
        })) || [];
        
        setImages(existingImages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trip:", error);
        setStatusMessage({
          type: "error",
          message: "Failed to load trip data. Please try again."
        });
        setLoading(false);
      }
    }
    
    fetchTripData();
  }, [tripId]);

  // When entering edit mode, copy trip data to editable state
  const handleEditMode = () => {
    setEditData({...tripData});
    setEditing(true);
    // Reset errors and status message
    setErrors({});
    setStatusMessage({ type: "", message: "" });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    // Reset to original data
    setEditData(null);
    
    // Reset images to original
    const existingImages = tripData.images?.map(url => ({
      id: uuidv4(),
      url,
      existing: true
    })) || [];
    
    setImages(existingImages);
    setImageFiles([]);
    setDeletedImages([]);
    setEditing(false);
    setErrors({});
    setStatusMessage({ type: "", message: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  function handleDepCityChange(city){
    setEditData((prev) => ({ ...prev, depature_city: city.id }));
  }

  function handleDestCityChange(city){
    setEditData((prev) => ({ ...prev, dest_city: city.id }));
  }

  const handleWeekDayToggle = (day) => {
    setEditData(prev => {
      const weekly_days = prev.weekly_days || [];
      const updatedDays = weekly_days.includes(day)
        ? weekly_days.filter(d => d !== day)
        : [...weekly_days, day];
      
      return { ...prev, weekly_days: updatedDays };
    });
    
    // Clear weekly_days error if it exists
    if (errors.weekly_days) {
      setErrors(prev => ({ ...prev, weekly_days: "" }));
    }
  };

  const handlePricingChange = (price) => {
    setEditData(prev => ({ 
      ...prev, 
      pricing: { ...(prev.pricing || {}), ...price } 
    }));
    
    // Clear pricing error if it exists
    if (errors.pricing) {
      setErrors(prev => ({ ...prev, pricing: "" }));
    }
  };

  function handleCancellationPolicyChange(policy){
    setEditData((prev) => ({ ...prev, cancellation_policy: policy }));
    
    // Clear cancellation policy error if it exists
    if (errors.cancellation_policy) {
      setErrors((prev) => ({ ...prev, cancellation_policy: "" }));
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Clear image errors
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: "" }));
    }

    // Preview images
    const newImagePreviews = files.map(file => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file,
      new: true
    }));

    setImages(prev => [...prev, ...newImagePreviews]);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (idToRemove) => {
    const imageToRemove = images.find(img => img.id === idToRemove);
    
    if (imageToRemove) {
      // Revoke object URL to prevent memory leaks if it's a new image
      if (imageToRemove.new) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      
      // If it's an existing image, add to deletedImages array
      if (imageToRemove.existing) {
        setDeletedImages(prev => [...prev, imageToRemove.url]);
      }
    }
    
    setImages(prev => prev.filter(img => img.id !== idToRemove));
    
    // Remove from imageFiles as well if it's a new image
    if (imageToRemove?.new) {
      setImageFiles(prev => prev.filter(file => 
        !images.find(img => img.id === idToRemove && img.file === file)
      ));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!editData.name?.trim()) newErrors.name = "العنوان مطلوب";
    if (!editData.about?.trim()) newErrors.about = "الوصف مطلوب";
    if (!editData.max_clients || editData.max_clients < 1) 
      newErrors.max_clients = "اكبر عدد للافراد مطلوب";
    
    // Availability type specific validation
    if (editData.availability_type === "fixed" && !editData.available_day) {
      newErrors.available_day = "من افضلك اختر يوم الرحلة";
    }
    
    if (["daily", "weekly"].includes(editData.availability_type)) {      
      if (editData.start_date && editData.end_date) {
        const start = new Date(editData.start_date);
        const end = new Date(editData.end_date);
        if (start > end) {
          newErrors.end_date = "تاريخ الانتهاء يجب ان يكون بعد تاريخ البدء";
        }
      }
    }
    
    if (editData.availability_type === "weekly" && (!editData.weekly_days || !editData.weekly_days.length)) {
      newErrors.weekly_days = "من فضلك اختر يوم واحد علي الاقل في الاسبوع";
    }
    
    // Ensure we have at least one image
    if (images.length === 0) {
      newErrors.images = "يجب اضافة صورة واحدة علي الاقل";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    
    for (const file of imageFiles) {
      // Create a unique file path for each image
      const filePath = `trips/${tripData.group_id}/${uuidv4()}-${file.name}`;
      
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

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatusMessage({
        type: "error",
        message: "Please fix the errors before saving"
      });
      return;
    }
    
    setSaving(true);
    setStatusMessage({ type: "", message: "" });
    
    try {
      // 1. Upload any new images to Supabase storage
      const newImageUrls = await uploadImages();
      
      // 2. Get all existing images that weren't deleted
      const existingImageUrls = images
        .filter(img => img.existing && !deletedImages.includes(img.url))
        .map(img => img.url);
      
      // 3. Combine existing and new image URLs
      const allImageUrls = [...existingImageUrls, ...newImageUrls];
      
      // 4. Prepare trip data based on availability type
      const tripPayload = {
        id: tripId,
        name: editData.name,
        about: editData.about,
        images: allImageUrls,
        max_clients: parseInt(editData.max_clients),
        availability_type: editData.availability_type,
        group_id: editData.group_id,
        pricing: editData.pricing || {},
        cancellation_policy: editData.cancellation_policy || "",
        depature_city: editData.depature_city.id,
        dest_city: editData.dest_city.id,
      };
      
      // Add specific fields based on availability type
      if (editData.availability_type === "fixed") {
        tripPayload.available_day = editData.available_day;
      } else {
        tripPayload.start_date = editData.start_date;
        tripPayload.end_date = editData.end_date;
        
        if (editData.availability_type === "weekly") {
          tripPayload.weekly_days = editData.weekly_days || [];
        }
      }
      
      // 5. Update the trip using the API
      const response = await fetch("/api/dashboard/trips", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripPayload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update trip");
      }
      
      // 6. Handle success
      const updatedTrip = await response.json();
      setTripData(updatedTrip);
      setStatusMessage({
        type: "success",
        message: "Trip updated successfully!"
      });
      
      // Reset state
      setEditing(false);
      setEditData(null);
      
      // Reset images to new state
      const refreshedImages = updatedTrip.images?.map(url => ({
        id: uuidv4(),
        url,
        existing: true
      })) || [];
      
      setImages(refreshedImages);
      setImageFiles([]);
      setDeletedImages([]);
      
    } catch (error) {
      console.error("Error updating trip:", error);
      setStatusMessage({
        type: "error",
        message: error.message || "Failed to update trip. Please try again."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل انت متأكد من حذف هذه الرحلة؟ لن تتمكن من استرجاعها.")) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/dashboard/trips?id=${tripId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete trip");
      }
      
      // Handle success
      setStatusMessage({
        type: "success",
        message: "Trip deleted successfully! Redirecting..."
      });
      
      // Redirect to trips list after a short delay
      setTimeout(() => {
        router.push("/dashboard/trips");
      }, 1500);
      
    } catch (error) {
      console.error("Error deleting trip:", error);
      setStatusMessage({
        type: "error",
        message: error.message || "Failed to delete trip. Please try again."
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="mx-auto p-6 max-w-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">خطأ</h1>
        <p className="text-lg text-gray-700">لم يتم العثور على الرحلة المطلوبة.</p>
        <button
          onClick={() => router.push("/dashboard/trips")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          العودة الى الرحلات
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 p-6 max-w-xl bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          {editing ? "تعديل الرحلة" : "تفاصيل الرحلة"}
        </h1>
        
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
              >
                <X size={16} className="mr-1" />
                الغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    حفظ...
                  </span>
                ) : (
                  <>
                    <Save size={16} className="mr-1" />
                    حفظ
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDelete}
                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                <Trash2 size={16} className="mr-1" />
                حذف
              </button>
              <button
                onClick={handleEditMode}
                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Pencil size={16} className="mr-1" />
                تعديل
              </button>
            </>
          )}
        </div>
      </div>
      
      {statusMessage.message && (
        <div className={`p-4 mb-6 rounded-md ${
            statusMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {statusMessage.message}
        </div>
      )}
      
      {editing ? (
        // Edit Form
        <form onSubmit={handleSave} className="space-y-6">
          {/* Trip Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              العنوان*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editData?.name || ""}
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
              value={editData?.about || ""}
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
          
          {/*depature location*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مكان الانطلاق*
            </label>
            <CityChooser defaultCity={editData.depature_city} onChange={handleDepCityChange}/>
          </div>

          {/* Destination location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وجهة الرحلة*
            </label>
            <CityChooser  defaultCity={editData.dest_city} onChange={handleDestCityChange}/>
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
              value={editData?.max_clients || 1}
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
                      checked={editData?.availability_type === type}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`availability-${type}`} className="mr-2 text-sm text-gray-700 capitalize">
                      {type === "fixed" ? "يوم واحد" : type === "daily" ? "كل يوم" : "اسبوعي"}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
          
          {/* Conditional fields based on availability type */}
          {editData?.availability_type === "fixed" && (
            <div>
              <label htmlFor="available_day" className="block text-sm font-medium text-gray-700 mb-1">
                اختر اليوم*
              </label>
              <input
                type="date"
                id="available_day"
                name="available_day"
                value={editData?.available_day || ""}
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
          
          {["daily", "weekly"].includes(editData?.availability_type) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ البدء*
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={editData?.start_date || ""}
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
                  value={editData?.end_date || ""}
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
          {editData?.availability_type === "weekly" && (
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
                      editData?.weekly_days?.includes(day.code)
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
          
          <TripPricingEditor 
            fixedDate={editData?.availability_type === "fixed"} 
            onChange={handlePricingChange}
            initialValue={editData?.pricing || {}}
          />

          <TripCancellationPolicyEditor onChange={handleCancellationPolicyChange} intialPolicy={editData.cancellation_policy}/>
          
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
                      <img 
                        src={image.url} 
                        alt="Trip preview"  
                        className="object-cover w-full h-full"

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
                    <Plus className="mx-auto h-8 w-8 text-gray-400" />
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
        </form>
      ) : (
        // View Mode
        <div className="space-y-6">
          {/* Trip Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{tripData.name}</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{tripData.about}</p>
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">اقصي عدد للافراد</h3>
                  <p className="text-gray-600">{tripData.max_clients}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">مكان الانطلاق</h3>
                  <p className="text-gray-600">{tripData.depature_city.name}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">نوع التوافر</h3>
                  <p className="text-gray-600 capitalize">
                    {tripData.availability_type === "fixed" 
                      ? "يوم واحد" 
                      : tripData.availability_type === "daily" 
                        ? "كل يوم" 
                        : "اسبوعي"}
                  </p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                {tripData.availability_type === "fixed" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">تاريخ الرحلة</h3>
                    <p className="text-gray-600">
                      {new Date(tripData.available_day).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">وجهة الرحلة</h3>
                  <p className="text-gray-600">{tripData.dest_city.name}</p>
                </div>
                
                {["daily", "weekly"].includes(tripData.availability_type) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">فترة الإتاحة</h3>
                    <p className="text-gray-600">
                      من {new Date(tripData.start_date).toLocaleDateString('ar-EG')} إلى {new Date(tripData.end_date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                )}
                
                {tripData.availability_type === "weekly" && tripData.weekly_days?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">أيام الإتاحة</h3>
                    <div className="flex flex-wrap gap-2">
                      {tripData.weekly_days.map((dayCode) => {
                        const day = weekDays.find(d => d.code === dayCode);
                        return day ? (
                          <span key={dayCode} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                            {day.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">صور الرحلة</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tripData.images?.map((url, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                    <div className="relative w-full h-40">
                      <img 
                        src={url} 
                        alt={`${tripData.name} - صورة ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}