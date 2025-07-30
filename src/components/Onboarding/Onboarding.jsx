import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { ChevronRight, ChevronLeft, User, Phone, FileText, Camera, Check, Star, MessageCircle } from 'lucide-react';
import LoadingCirc from '../Loading/LoadingCirc';
import TermsAcceptance from '../website/TermsAcceptance';

const ProfileOnboarding = ({profileId}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    profile_image: '', // Will store image URL
    clients_contact_phone: '',
    notifications_number: '', // Will be populated before saving from phone and selectedCountryCode
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Used for both fetching and saving
  
  // WhatsApp notification states
  const [phone, setPhone] = useState(''); // Local part of WhatsApp number
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Country codes data - Note: Moved outside component if it's truly static, or keep inside if preferred.
  // For this example, keeping it inside.
  const countryCodes = [
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '+968', name: 'Oman', flag: '🇴🇲' },
    { code: '+962', name: 'Jordan', flag: '🇯🇴' },
    { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  ];
  
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0]); // Default to Egypt

  // useEffect for fetching initial profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) {
        // No profileId, start with a fresh form (default state is already empty)
        setIsLoading(false); // Ensure loading is false if it was set by something else
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/client/host?id=${profileId}`);
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Profile not found (404), starting with an empty form for new profile.');
            // Reset form to ensure clean state if there were previous values
            setFormData({
                name: '', about: '', profile_image: '',
                clients_contact_phone: '', notifications_number: ''
            });
            setImagePreview('');
            setImageFile(null);
            setPhone('');
            setSelectedCountryCode(countryCodes[0]); // Reset to default country
            return; // Exit fetch logic
          }
          throw new Error(`Failed to fetch profile data: ${response.statusText}`);
        }
        
        const data = await response.json();
        const profileInfo = data.group || data; // Adapt based on your API response structure

        if (profileInfo) {
          setFormData(prev => ({
            ...prev,
            name: profileInfo.name || '',
            about: profileInfo.about || '',
            profile_image: profileInfo.profile_image || '',
            clients_contact_phone: profileInfo.clients_contact_phone || '',
            // `notifications_number` from `profileInfo` will be used to set `phone` and `selectedCountryCode`
          }));

          if (profileInfo.profile_image) {
            setImagePreview(profileInfo.profile_image);
          } else {
            setImagePreview(''); // Clear preview if no image
          }

          // Parse notifications_number to populate WhatsApp phone and country code
          if (profileInfo.notifications_number) {
            let bestMatch = null;
            // Find the longest matching country code prefix
            for (const country of countryCodes) {
              const codeWithoutPlus = country.code.substring(1); // e.g., "20"
              if (profileInfo.notifications_number.startsWith(codeWithoutPlus)) {
                if (!bestMatch || codeWithoutPlus.length > bestMatch.parsedCode.length) {
                  bestMatch = { country, parsedCode: codeWithoutPlus };
                }
              }
            }

            if (bestMatch) {
              setSelectedCountryCode(bestMatch.country);
              setPhone(profileInfo.notifications_number.substring(bestMatch.parsedCode.length));
            } else {
              // No matching prefix found. Assume it's a local number for the default country, or just set it.
              setPhone(profileInfo.notifications_number);
              // setSelectedCountryCode remains its current value (default or previously set)
              console.warn(
                `notifications_number "${profileInfo.notifications_number}" did not match any known country prefix. ` +
                `Setting phone input directly. Current selected country: ${selectedCountryCode.name}`
              );
            }
          } else {
            // No notifications_number in fetched data, reset WhatsApp phone field
            setPhone('');
            // setSelectedCountryCode remains default or as is
          }
        } else {
            // Fetched profileInfo is null or undefined, treat as new profile
            console.log('Fetched profile data is empty. Starting with an empty form.');
            setFormData({ name: '', about: '', profile_image: '', clients_contact_phone: '', notifications_number: '' });
            setImagePreview('');
            setImageFile(null);
            setPhone('');
            setSelectedCountryCode(countryCodes[0]);
        }

      } catch (error) {
        console.error('Error fetching profile data:', error);
        // In case of error, form remains with initial (empty) values or last valid state
        // You might want to display an error message to the user here
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]); // Re-run if profileId changes. countryCodes is stable.

  const steps = [ // ... (steps array remains the same)
    {
      id: 'welcome',
      title: 'مرحباً بك!',
      subtitle: 'دعنا نساعدك في إنشاء ملفك الشخصي',
      icon: Star,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'name',
      title: 'ما اسمك؟',
      subtitle: 'أدخل اسمك الكامل كما تريد أن يراه العملاء',
      icon: User,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'about',
      title: 'أخبرنا عن نفسك',
      subtitle: 'اكتب وصفاً موجزاً عن خبرتك ومهاراتك (اختياري)',
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'phone',
      title: 'رقم التواصل',
      subtitle: 'أدخل رقم هاتفك للتواصل مع العملاء',
      icon: Phone,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'whatsapp',
      title: 'رقم اشعارات واتساب',
      subtitle: 'أدخل رقم واتساب لاستقبال الإشعارات',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'image',
      title: 'صورة الملف الشخصي',
      subtitle: 'أضف صورة شخصية لتعريف العملاء بك (اختياري)',
      icon: Camera,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'complete',
      title: 'تم الانتهاء!',
      subtitle: 'ملفك الشخصي جاهز الآن',
      icon: Check,
      color: 'from-green-500 to-teal-500'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
      // When a new image is selected, we clear the old profile_image URL from formData
      // as the new file takes precedence. It will be uploaded on save.
      handleInputChange('profile_image', ''); 
    }
  };

  const uploadImage = async (file) => {
    const imageFormData = new FormData(); // Use a different FormData for image upload
    imageFormData.append('file', file);
    
    const filePath = `profiles/${Date.now()}_${file.name}`;
    
    try {
      const response = await fetch(`/api/storage/upload?path=${filePath}`, {
        method: "POST",
        body: imageFormData,
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to upload image: ${errorData}`);
      }
      
      const data = await response.json();
      return data.url || data.path; // Prefer 'url' if available
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const getFullPhoneNumber = useCallback((inputPhone = phone, country = selectedCountryCode) => {
    if (!inputPhone || !country || !country.code) return "";
    const cleanPhone = inputPhone.startsWith("0") ? inputPhone.substring(1) : inputPhone;
    return `${country.code.substring(1)}${cleanPhone}`;
  }, [phone, selectedCountryCode]); // Add dependencies for useCallback

  const handleNext = async () => {
    if (currentStep === steps.length - 2) { // Penultimate step (before 'complete')
      setIsLoading(true);
      try {
        let finalData = { ...formData };

        // Handle image: Upload if a new file is present, otherwise use existing formData.profile_image
        if (imageFile) {
          const imageUrl = await uploadImage(imageFile);
          finalData.profile_image = imageUrl;
        } 
        // If imageFile is null, finalData.profile_image already holds
        // the fetched URL or "" if it was cleared.

        // Construct notifications_number from WhatsApp phone state
        if (phone.trim()) {
          finalData.notifications_number = getFullPhoneNumber();
        } else {
          finalData.notifications_number = ''; // Clear if WhatsApp phone is empty
        }
        
        const payload = { profileId, ...finalData };
        // If profileId is undefined/null, backend should handle as create, else update
        // Or adjust API endpoint for create vs update if needed e.g. POST vs PUT

        const response = await fetch('/api/dashboard/profile', {
          method: 'PUT', // Assuming PUT for update, or POST if creating and ID is not in URL
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to save profile. Unknown error.' }));
          throw new Error(errorData.message || 'Failed to save profile');
        }

        const savedProfile = await response.json();
        
        // Update formData with the potentially new image URL and notifications_number from server response if needed
        setFormData(prev => ({
            ...prev,
            profile_image: savedProfile.profile_image || finalData.profile_image, // Prefer server response if available
            notifications_number: savedProfile.notifications_number || finalData.notifications_number,
        }));

        setCurrentStep(currentStep + 1); // Move to completion step
        
        if (onComplete) {
          onComplete(savedProfile);
        }
        
      } catch (error) {
        console.error('Error saving profile:', error);
        alert(`فشل في حفظ الملف الشخصي: ${error.message}. حاول مرة أخرى.`);
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (steps[currentStep].id) {
      case 'name':
        return formData.name.trim().length > 0;
      case 'about':
        return true; // Optional
      case 'phone': // clients_contact_phone
        // Basic validation: at least 9 digits for many regions, can be more specific
        return formData.clients_contact_phone.trim().length >= 9 && /^\d+$/.test(formData.clients_contact_phone.trim());
      case 'whatsapp': // Optional, uses `phone` state
        // If phone is entered, it should be valid-ish (e.g. digits only, reasonable length)
        if (phone.trim()) {
            return phone.trim().length >= 7 && /^\d+$/.test(phone.trim()); // Adjust min length as needed
        }
        return true; // Valid if empty (optional)
      case 'image':
        return true; // Optional
      default:
        return true;
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  async function onComplete() {
    try {
        setIsLoading(true)
        const res = await fetch(`/api/dashboard/onboarding?groupId=${profileId}`);
        const result = await res.json();

        if (!res.ok) {
        console.error("Failed to finish onboarding:", result.error);
        return;
        }

        
        console.log("Onboarding finished successfully:", result.data);
        window.location.reload()
        setIsLoading(false)
        // Optional: redirect, show message, etc.
    } catch (error) {
        console.error("Unexpected error:", error);
    }
   }


  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'welcome':
        return (
          // ... Welcome JSX unchanged
          <div className="text-center space-y-6">
            <div className="relative">
              <div className='w-full flex justify-center'>
              <img src='/logo.png' width={150}></img>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">✨</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-lg">سنساعدك في إنشاء ملف شخصي مميز في خطوات بسيطة</p>
              <p className="text-sm text-gray-500">سيستغرق الأمر دقيقتين فقط</p>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          // ... WhatsApp JSX uses `phone` and `selectedCountryCode` states
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-4`}>
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative flex">
                <input
                  type="tel"
                  value={phone} // Uses `phone` state
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Allow only digits
                  placeholder="أدخل رقم واتساب"
                  className="flex-grow p-4 text-lg border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-left placeholder:text-right border-l-0"
                  dir="ltr"
                />
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-center h-full px-4 border-2 bg-white border-gray-200 rounded-l-xl hover:bg-gray-50 transition-colors"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <span className="flex items-center">
                      <span className="mr-1">{selectedCountryCode.flag}</span>
                      <span>{selectedCountryCode.code}</span>
                    </span>
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute z-50 left-0 w-[250px] mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                      {countryCodes.map((country) => (
                        <div
                          key={country.code}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center transition-colors duration-150"
                          onClick={() => {
                            setSelectedCountryCode(country);
                            setShowCountryDropdown(false);
                          }}
                        >
                          <span className="mr-2">{country.flag}</span>
                          <span className="mr-2">{country.code}</span>
                          <span className="text-gray-600 text-sm">{country.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                اختياري: سيتم إرسال إشعارات الحجوزات على هذا الرقم
              </p>
            </div>
          </div>
        );

      case 'name':
        return (
          // ... Name JSX uses formData.name
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-4`}>
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                dir="rtl"
              />
              <p className="text-sm text-gray-500 text-center">
                مثال: أحمد محمد او مصر للسياحة
              </p>
            </div>
          </div>
        );

      case 'about':
        return (
          // ... About JSX uses formData.about
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-4`}>
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <textarea
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                placeholder="اكتب وصفاً موجزاً عن خبرتك ومهاراتك..."
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 min-h-[120px] resize-none"
                dir="rtl"
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          // ... Contact Phone JSX uses formData.clients_contact_phone
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-4`}>
                <Phone className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="tel"
                value={formData.clients_contact_phone}
                onChange={(e) => handleInputChange('clients_contact_phone', e.target.value.replace(/\D/g, ''))} // Allow only digits
                placeholder="01xxxxxxxxx"
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                dir="ltr" 
              />
              <p className="text-sm text-gray-500 text-center">
                سيتم استخدام هذا الرقم للتواصل معك من قبل العملاء
              </p>
            </div>
          </div>
        );

      case 'image':
        return (
          // ... Image JSX uses imagePreview
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-4`}>
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        handleInputChange('profile_image', ''); // Clear stored image URL
                        const imageInputElement = document.getElementById('image-input');
                        if (imageInputElement) imageInputElement.value = ''; // Reset file input
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <label className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  {imagePreview ? 'تغيير الصورة' : 'اختر صورة'}
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 text-center">
                اختياري: يمكنك تخطي هذه الخطوة وإضافة الصورة لاحقاً
              </p>
            </div>
          </div>
        );

      case 'complete':
        return (
          // ... Complete JSX uses formData and getFullPhoneNumber()
           <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <Check className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-sm">🎉</span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 text-lg">تم إنشاء ملفك الشخصي بنجاح!</p>
              <p className="text-sm text-gray-500">يمكنك الآن البدء في استقبال العملاء</p>
              
              <div className="bg-gray-50 rounded-xl p-6 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">هاتف العملاء:</span>
                  <span className="font-medium">{formData.clients_contact_phone}</span>
                </div>
                {/* Display WhatsApp number using the current `phone` and `selectedCountryCode` states */}
                {phone.trim() && ( 
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">واتساب:</span>
                    {/* Use getFullPhoneNumber with current `phone` and `selectedCountryCode` */}
                    <span className="font-medium">{getFullPhoneNumber(phone, selectedCountryCode)}</span>
                  </div>
                )}
                 {formData.profile_image && !imagePreview && ( // If image was cleared but existed in formData
                    <p className="text-sm text-gray-500">تم حذف الصورة الشخصية.</p>
                )}
                {imagePreview && ( // If there's an image preview (new or existing)
                    <div className="flex items-center justify-between">
                         <span className="text-gray-600">الصورة الشخصية:</span>
                         <img src={imagePreview} alt="Profile" className="w-10 h-10 rounded-full object-cover"/>
                    </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ... Rest of the component (return with main layout, progress bar, navigation, etc.) unchanged
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">الخطوة {currentStep + 1} من {steps.length}</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-tripmo-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {isLoading && currentStep !== steps.length -1 && steps[currentStep].id !== 'complete' ? ( // Show loader for fetching data, but not on complete step
                <div className="flex justify-center items-center h-48">
                    <LoadingCirc/>
                </div>
            ) : renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <button
                onClick={handlePrev}
                className="flex-1 px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                السابق
              </button>
            )}
            
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className={`flex-1 px-6 py-3 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                  !isStepValid() || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-tripmo-500 hover:from-blue-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <>
                    جاري...
                  </>
                ) : (
                  <>
                    {'التالي'}
                    <ChevronLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            )}

            {currentStep === steps.length - 1 && (
              <button
                // Example: redirect to dashboard or reload if appropriate
                onClick={() => {
                    if (onComplete) onComplete(formData); // Or pass the savedProfile from handleNext if it's stored in state
                    else window.location.reload(); 
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    جاري...
                  </>
                ) : (
                  <>
                    البدء الأن
                  </>
                )}
              </button>
            )}
          </div>
          <div className='mt-4'>
            <TermsAcceptance link={'/terms'}/>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileOnboarding;