"use client"
import React, { useEffect, useState } from 'react'
import RateShow from '../website/RateShow';

// Loading Skeleton Component
function ProfileCardSkeleton({ type = 0 }) {
  if (type == 1) {
    return (
      <div className='flex gap-5 justify-center items-center w-full p-6 shadow-sm rounded-2xl bg-white border border-gray-100'>
        <div className='w-26 h-26 rounded-full bg-gray-200 animate-pulse mb-2'></div>
        <div className='flex flex-col justify-center items-center text-center'>
          <div className='h-6 w-32 bg-gray-200 rounded animate-pulse mb-4'></div>
          <div className='flex items-center gap-2'>
            <div className='flex gap-1'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
              ))}
            </div>
            <div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className='flex flex-col justify-center items-center min-w-[300px] max-w-[320px] w-full p-6 shadow-sm rounded-2xl bg-white border border-gray-100'>
      <div className='w-26 h-26 rounded-full bg-gray-200 animate-pulse mb-2'></div>
      <div className='flex flex-col justify-center items-center text-center'>
        <div className='h-6 w-32 bg-gray-200 rounded animate-pulse mb-4'></div>
        <div className='flex items-center gap-2'>
          <div className='flex gap-1'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
            ))}
          </div>
          <div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
        </div>
      </div>
    </div>
  )
}

function AdminProfileCard({ profileData, profileId = null, onUpdate }) {
  const [profileDataState, setProfileDataState] = useState(profileData || {
    name: '',
    profile_image: '',
    about: '',
    rating_avg: 0,
    rating_count: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    about: '',
    profile_image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (profileId || !profileData) {
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
          setEditForm({
            name: profileInfo.name || '',
            about: profileInfo.about || '',
            profile_image: profileInfo.profile_image || ''
          });
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchProfileData();
    } else {
      setEditForm({
        name: profileDataState.name || '',
        about: profileDataState.about || '',
        profile_image: profileDataState.profile_image || ''
      });
    }
  }, [profileData, profileId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      name: profileDataState.name || '',
      about: profileDataState.about || '',
      profile_image: profileDataState.profile_image || ''
    });
    setImagePreview('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview('');
    setEditForm({
      name: profileDataState.name || '',
      about: profileDataState.about || '',
      profile_image: profileDataState.profile_image || ''
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const filePath = `profiles/${Date.now()}_${file.name}`;
    
    try {
      const response = await fetch(`/api/storage/upload?path=${filePath}`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.url || data.path;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let updatedProfile = {
        name: editForm.name,
        about: editForm.about,
        profile_image: editForm.profile_image
      };

      // Upload new image if selected
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        updatedProfile.profile_image = imageUrl;
      }

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
      
      setIsEditing(false);
      setImageFile(null);
      setImagePreview('');
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate(updatedData);
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  return (
    <div className='flex flex-col justify-center items-center min-w-[300px] max-w-[620px] w-full p-6 shadow-sm rounded-2xl bg-white border border-gray-100'>
      {/* Profile Image Section */}
      <div className='relative w-26 h-26 rounded-full overflow-hidden mb-4 group'>
        <img 
          src={imagePreview || profileDataState.profile_image} 
          className='w-full h-full object-cover transition-all duration-200'
          alt={profileDataState.name}
        />
        {isEditing && (
          <>
            <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer'>
              <label className='text-white text-sm font-medium cursor-pointer flex flex-col items-center gap-1'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className='hidden'
                />
              </label>
            </div>
            <div className='absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1'>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </>
        )}
      </div>

      <div className='flex flex-col justify-center items-center text-center w-full'>
        {/* Name Section */}
        {isEditing ? (
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            className='font-bold text-xl mb-4 text-center border-b-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-transparent px-2 py-1 transition-all duration-200'
            placeholder="ادخل الأسم"
          />
        ) : (
          <div className='font-bold text-xl mb-4'>
            {profileDataState.name}
          </div>
        )}

        {/* About Section */}
        {isEditing ? (
          <textarea
            value={editForm.about}
            onChange={(e) => setEditForm(prev => ({ ...prev, about: e.target.value }))}
            className='w-full p-3 mb-4 border border-gray-300 rounded-md resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg min-h-[100px]'
            placeholder="Tell us about yourself, your experience, skills, or anything you'd like guests to know..."
            rows="4"
          />
        ) : (
          profileDataState.about && (
            <div className='text-gray-600 text-lg mb-4 text-center max-w-full break-words'>
              {profileDataState.about}
            </div>
          )
        )}

        {/* Rating Section */}
        <div className='mb-4'>
          <RateShow rate={profileDataState.rating_avg} count={profileDataState.rating_count} />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 w-full mt-2'>
          {isEditing ? (
            <>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium flex items-center justify-center gap-2'
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    حفظ
                  </>
                )}
              </button>

              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className='flex-1 px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200 font-medium'
              >
                الغاء
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className='w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2'
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              تعديل
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminProfileCard