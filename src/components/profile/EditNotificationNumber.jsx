import React, { useState, useEffect } from 'react';

function EditNotificationNumber({ profileId, profileData, onUpdate }) {
  // State management
  const [profileDataState, setProfileDataState] = useState(profileData || {
    notifications_number: '',
  });

  const [editForm, setEditForm] = useState({
    notifications_number: '',
  });

  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState({
    code: '+20',
    name: 'Egypt',
    flag: '🇪🇬'
  });

  // Country codes data
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

  // Fetch profile data on component mount
  useEffect(() => {
    if (profileId) {
      // Fetch profile data if profileId is provided
      async function fetchProfileData() {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/client/host?id=${profileId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }
          const data = await response.json();
          const profileInfo = data.group || data;
          setProfileDataState(profileInfo);
          
          // Parse existing phone number
          if (profileInfo.notifications_number) {
            parseExistingPhoneNumber(profileInfo.notifications_number);
          }
          
          setEditForm({
            notifications_number: profileInfo.notifications_number || '',
          });
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setError('فشل في جلب بيانات الملف الشخصي');
        } finally {
          setIsLoading(false);
        }
      }
      fetchProfileData();
    } else {
      // Use provided profileData
      if (profileDataState.notifications_number) {
        parseExistingPhoneNumber(profileDataState.notifications_number);
      }
      setEditForm({
        notifications_number: profileDataState.notifications_number || '',
      });
    }
  }, [profileId, profileData]);

  // Parse existing phone number to extract country code and phone
  const parseExistingPhoneNumber = (fullPhoneNumber) => {
    if (!fullPhoneNumber) return;
    
    // Find matching country code
    const matchingCountry = countryCodes.find(country => 
      fullPhoneNumber.startsWith(country.code.substring(1))
    );
    
    if (matchingCountry) {
      setSelectedCountryCode(matchingCountry);
      const phoneWithoutCountryCode = fullPhoneNumber.substring(matchingCountry.code.length - 1);
      setPhone(phoneWithoutCountryCode);
    } else {
      // Default parsing - assume it starts with country code
      setPhone(fullPhoneNumber);
    }
  };

  // Handle country code change
  const onCountryCodeChange = (country) => {
    setSelectedCountryCode(country);
  };

  // Get full phone number combining country code and phone
  const getFullPhoneNumber = (inputPhone = phone, country = selectedCountryCode) => {
    if (!inputPhone) return "";
    const cleanPhone = inputPhone.startsWith("0") ? inputPhone.substring(1) : inputPhone;
    return `${country.code.substring(1)}${cleanPhone}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Get full phone number
    const fullPhone = getFullPhoneNumber();

    // Validate the full phone number
    if (!/^\d{10,15}$/.test(fullPhone)) {
      setError('صيغة رقم الهاتف غير صحيحة');
      return;
    }

    // Update the form with full phone number
    setEditForm(prev => ({
      ...prev,
      notifications_number: fullPhone
    }));

    // Call handleSave
    await handleSave(fullPhone);
  };

  // Save profile data
  const handleSave = async (phoneNumber = null) => {
    setIsSaving(true);
    try {
      const phoneToSave = phoneNumber || getFullPhoneNumber();
      
      let updatedProfile = {
        notifications_number: phoneToSave,
      };

      // Update profile via API
      const response = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profileId,
          ...updatedProfile
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      
      // Update local state
      setProfileDataState(prev => ({
        ...prev,
        ...updatedProfile
      }));
      
      setEditForm(prev => ({
        ...prev,
        notifications_number: phoneToSave
      }));
      
      setIsEditing(false);
      setError('');
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate(updatedData);
      }
      
      alert('تم حفظ رقم الهاتف بنجاح');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('فشل في حفظ رقم الهاتف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit mode toggle
  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    // Reset phone to original value
    if (profileDataState.notifications_number) {
      parseExistingPhoneNumber(profileDataState.notifications_number);
    } else {
      setPhone('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-right">رقم اشعارات واتساب</h3>
      
      {!isEditing ? (
        // Display mode
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            disabled={isSaving}
          >
            تعديل
          </button>
          <div className="text-right">
            <div className="text-sm text-gray-600">رقم الهاتف الحالي:</div>
            <div className="font-medium">
              {profileDataState.notifications_number || 'لم يتم تحديد رقم'}
            </div>
          </div>
        </div>
      ) : (
        // Edit mode
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium mb-2 text-right">
              رقم الهاتف
            </label>
            <div className="relative flex">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="أدخل رقم الهاتف"
                className="flex-grow p-3 py-2 border rounded-r-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-left placeholder:text-right border-l-0"
                disabled={isSaving}
                required
              />
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center justify-center h-full px-3 border bg-white border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  disabled={isSaving}
                >
                  <span className="flex items-center">
                    <span className="mr-1">{selectedCountryCode.flag}</span>
                    <span>{selectedCountryCode.code}</span>
                  </span>
                </button>

                {showCountryDropdown && (
                  <div className="absolute z-50 left-0 w-[250px] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {countryCodes.map((country) => (
                      <div
                        key={country.code}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center transition-colors duration-150"
                        onClick={() => {
                          onCountryCodeChange(country);
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
            {error && <p className="text-red-600 text-sm mt-2 text-right">{error}</p>}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 space-x-reverse">
            <button
              type="submit"
              className="px-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || !phone.trim()}
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              إلغاء
            </button>
            
          </div>
        </form>
      )}
    </div>
  );
}

export default EditNotificationNumber;