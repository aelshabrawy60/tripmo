// components/TripCreationWizard.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BasicInfoStep from "./TripCreation/BasicInfoStep";
import LocationStep from "./TripCreation/LocationStep";
import StartLocationStep from "./TripCreation/StartLocationStep";
import AvailabilityStep from "./TripCreation/AvailabilityStep";
import PricingStep from "./TripCreation/PricingStep";
import ImagesStep from "./TripCreation/ImagesStep";
import ReviewStep from "./TripCreation/ReviewStep";

const STEPS = [
  { id: 1, title: "المعلومات الأساسية", component: BasicInfoStep },
  { id: 2, title: "المواقع", component: LocationStep },
  { id: 3, title: "نقطة البدء", component: StartLocationStep },
  { id: 4, title: "التواريخ المتاحة", component: AvailabilityStep },
  { id: 5, title: "الأسعار والإلغاء", component: PricingStep },
  { id: 6, title: "صور الرحلة", component: ImagesStep },
  { id: 7, title: "مراجعة وإنشاء", component: ReviewStep },
];

export default function TripCreationWizard({ groupId }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState({
    name: "",
    about: "",
    max_clients: 10,
    availability_type: "fixed",
    available_day: "",
    start_date: null,
    end_date: null,
    weekly_days: [],
    pricing: {},
    cancellation_policy: {},
    group_id: groupId || "",
    depature_city: null,
    dest_city: null,
    start_location: null,
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const updateTripData = (newData) => {
    setTripData((prev) => ({ ...prev, ...newData }));
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const clearErrors = (fieldNames) => {
    if (Array.isArray(fieldNames)) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        fieldNames.forEach((field) => delete newErrors[field]);
        return newErrors;
      });
    } else {
      setErrors((prev) => ({ ...prev, [fieldNames]: "" }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Basic Info
        if (!tripData.name.trim()) newErrors.name = "العنوان مطلوب";
        if (!tripData.about.trim()) newErrors.about = "الوصف مطلوب";
        if (!tripData.max_clients || tripData.max_clients < 1)
          newErrors.max_clients = "اكبر عدد للافراد مطلوب";
        break;

      case 2: // Locations
        if (!tripData.depature_city) newErrors.depature_city = "مكان الانطلاق مطلوب";
        if (!tripData.dest_city) newErrors.dest_city = "وجهة الرحلة مطلوبة";
        break;

      case 3: // Start Location
        if (!tripData.start_location || !tripData.start_location.type) {
          newErrors.start_location = "من فضلك اختر نوع موقع الأنطلاق";
        }
        break;

      case 4: // Availability
        if (tripData.availability_type === "fixed" && !tripData.available_day) {
          newErrors.available_day = "من فضلك اختر يوم الرحلة";
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
        break;

      case 5: // Pricing
        if (!tripData.pricing || Object.keys(tripData.pricing).length === 0) {
          newErrors.pricing = "معلومات الأسعار مطلوبة";
        }
        if (!tripData.cancellation_policy || Object.keys(tripData.cancellation_policy).length === 0) {
          newErrors.cancellation_policy = "سياسة الإلغاء مطلوبة";
        }
        break;

      case 6: // Images
        if (!images || images.length === 0) {
          newErrors.images = "يجب إضافة صورة واحدة على الأقل";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo(0, 0); // Scroll to top on step change
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0); // Scroll to top on step change
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const tripPayload = {
        name: tripData.name,
        about: tripData.about,
        images: images,
        max_clients: parseInt(tripData.max_clients),
        availability_type: tripData.availability_type,
        group_id: tripData.group_id,
        pricing: tripData.pricing,
        cancellation_policy: tripData.cancellation_policy,
        depature_city: tripData.depature_city,
        dest_city: tripData.dest_city,
        start_location: tripData.start_location,
      };

      if (tripData.availability_type === "fixed") {
        tripPayload.available_day = tripData.available_day;
      } else {
        tripPayload.start_date = tripData.start_date;
        tripPayload.end_date = tripData.end_date;

        if (tripData.availability_type === "weekly") {
          tripPayload.weekly_days = tripData.weekly_days;
        }
      }

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

      await response.json(); 
      setSubmitStatus({
        type: "success",
        message: "تم إنشاء الرحلة بنجاح!",
      });

      setTimeout(() => {
        router.push('/dashboard/trips');
      }, 500);
    } catch (error) {
      console.error("Error creating trip:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "فشل في إنشاء الرحلة. حاول مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = STEPS.find((step) => step.id === currentStep)?.component;

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-4">
      {/* Progress Bar */}
      <div className="mb-6 md:mb-8">
        <div className="md:flex hidden items-start justify-between mb-3 space-x-1 sm:space-x-2">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 ${
                  currentStep >= step.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-400 border-gray-300"
                }`}
              >
                {step.id}
              </div>
              <span className="text-[9px] leading-[1.1] sm:text-[10px] sm:leading-tight md:text-xs text-center mt-1 sm:mt-1.5 md:mt-2 max-w-full break-words">
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus.message && (
        <div
          className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-md text-sm ${
            submitStatus.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          {STEPS.find((step) => step.id === currentStep)?.title}
        </h2>

        {CurrentStepComponent && (
          <CurrentStepComponent
            tripData={tripData}
            images={images}
            errors={errors}
            groupId={groupId}
            loading={loading}
            onUpdateTripData={updateTripData}
            onUpdateImages={updateImages}
            onClearErrors={clearErrors}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-colors duration-150 ${
            currentStep === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-400 text-white hover:bg-gray-700"
          }`}
        >
          السابق
        </button>

        {currentStep < STEPS.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base font-medium transition-colors duration-150"
          >
            التالي
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-colors duration-150 ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {loading ? "جاري الإنشاء..." : "إنشاء الرحلة"}
          </button>
        )}
      </div>
    </div>
  );
}
