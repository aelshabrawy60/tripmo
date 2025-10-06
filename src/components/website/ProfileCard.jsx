"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import RateShow from './RateShow';

// Verified Badge Component
function VerifiedBadge({ size = 'md', className = '' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg 
        className={`${sizeClasses[size]} text-blue-500 cursor-pointer transition-colors hover:text-blue-600`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Verified by Rehla"
      >
        <path 
          fillRule="evenodd" 
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
          clipRule="evenodd" 
        />
      </svg>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10 shadow-lg">
          <div className="relative">
            Verified by Rehla Now
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading Skeleton Component
function ProfileCardSkeleton({ type = 0 }) {
  if (type == 1) {
    return (
      <div className='flex gap-5 justify-center items-center w-full p-6 shadow-sm rounded-2xl bg-white border border-gray-100'>
        <div className='w-[72px] h-[72px] rounded-full bg-gray-200 animate-pulse mb-2'></div>
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
    );
  }

  return (
    <div className='flex flex-col justify-center items-center min-w-[300px] max-w-[320px] w-full p-6 shadow-sm rounded-2xl bg-white border border-gray-100'>
      <div className='w-[104px] h-[104px] rounded-full bg-gray-200 animate-pulse mb-2'></div>
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
  );
}

function ProfileCard({ profileData, type = 0, profileId = null, showPhone = false }) {
  const [profileDataState, setProfileDataState] = useState(profileData || {
    name: '',
    profile_image: '',
    rating_avg: 0,
    rating_count: 0,
    clients_contact_phone: '',
    is_verified: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profileId || !profileData) {
      async function fetchProfileData() {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/client/host?id=${profileId}`);
          if (!response.ok) throw new Error('Failed to fetch profile data');
          const data = await response.json();
          setProfileDataState(data.group || data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchProfileData();
    }
  }, [profileData, profileId]);

  if (isLoading) return <ProfileCardSkeleton type={type} />;

  const imageSrc = profileDataState.profile_image || '/profile-fallback.jpg';

  if (type == 1) {
    return (
      <>
        <a href={`/host/${profileDataState.id}`} className={`flex gap-5 items-center w-full ${!showPhone && ''} border-gray-200 pt-4`}>
          <div className='relative w-[72px] h-[72px] min-w-[72px] rounded-full  mb-1'>
            <Image
              src={imageSrc}
              alt='Profile Image'
              fill
              className='object-cover rounded-full'
            />
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='font-bold text-lg'>
                {profileDataState.name}
              </span>
              {profileDataState.is_verified && (
                <VerifiedBadge size="md" />
              )}
            </div>
            <RateShow rate={profileDataState.rating_avg} count={profileDataState.rating_count} type={type} />
          </div>
        </a>
        {showPhone && (
          <div className='flex items-center pt-4 px-2 gap-2 text-lg'>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className='text-gray-700'>{profileDataState.clients_contact_phone}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className='flex flex-col justify-center items-center min-w-[300px] max-w-[340px] w-full p-6 shadow-sm rounded-2xl bg-white border border-gray-100'>
      <div className='relative w-[104px] h-[104px] rounded-full overflow-hidden mb-2'>
        <Image
          src={imageSrc}
          alt='Profile Image'
          fill
          className='object-cover rounded-full'
        />
      </div>
      <div className='flex flex-col justify-center items-center text-center'>
        <div className='flex items-center gap-2 mb-4'>
          <span className='font-bold text-xl'>
            {profileDataState.name}
          </span>
          {profileDataState.is_verified && (
            <VerifiedBadge size="md" />
          )}
        </div>
        <RateShow rate={profileDataState.rating_avg} count={profileDataState.rating_count} />
      </div>
    </div>
  );
}

export default ProfileCard;