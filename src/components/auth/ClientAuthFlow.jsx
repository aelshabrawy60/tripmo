'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import PhoneInputForm from './PhoneInputFom';
import OTPInputForm from './OTPInputForm';
import NameInputForm from './NameInputForm';
import { LoaderCircle } from 'lucide-react';
import LoadingCirc from '../Loading/LoadingCirc';
import TermsAcceptance from '../website/TermsAcceptance';


const ClientAuthFlow = ({ onSuccess, onFail, primary_color = '#2563EB' }) => {
  const [currentStep, setCurrentStep] = useState('loading'); // loading, phone, otp, name
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState({ code: '+20', name: 'Egypt', flag: '🇪🇬' });
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [verificationId, setVerificationId] = useState(null)

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
    { code: '+212', name: 'Morocco', flag: '🇲🇦' },
    { code: '+213', name: 'Algeria', flag: '🇩🇿' },
    { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
  ];



  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingToken = async () => {
      const token = Cookies.get('client_token');
      
      if (token) {
        try {
          // Verify token validity by making a request to a protected endpoint
          const response = await fetch('/api/client/auth/verify-token', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.client) {
              // Token is valid, call onSuccess
              if (onSuccess) onSuccess(data.client);
              return;
            }
          }
          
          // Token is invalid, remove it
          Cookies.remove('client_token');
        } catch (error) {
          console.error('Token verification error:', error);
          Cookies.remove('client_token');
        }
      }
      
      // No valid token found, start with phone input
      setCurrentStep('phone');
    };

    checkExistingToken();
  }, [onSuccess]);

  const handlePhoneSuccess = (phone, verificationId) => {
    setPhoneNumber(phone);
    setVerificationId(verificationId)
    setCurrentStep('otp');
  };

  const handleOTPVerified = (data) => {
    setOtpData(data);
    setIsExistingUser(data.isExistingUser || false);
    
    // If clientName is null, show name input form
    if (!data.clientName) {
      setCurrentStep('name');
    } else {
      // User already has a name, authentication complete
      if (onSuccess) onSuccess(data.client || data);
    }
  };

  const handleNameSuccess = (client) => {
    if (onSuccess) onSuccess(client);
  };

  const handleCountryCodeChange = (country) => {
    setSelectedCountryCode(country);
  };

  const handleError = (error) => {
    console.error('Auth flow error:', error);
    if (onFail) onFail(error);
  };

  // Loading state
  if (currentStep === 'loading') {
    return (
      <div className="flex items-center justify-center p-8 w-full max-w-md mx-auto lg:relative lg:bottom-auto fixed bottom-0 left-0 right-0 lg:left-auto lg:right-auto bg-white lg:bg-transparent rounded-t-3xl lg:rounded-none shadow-2xl lg:shadow-none border-t lg:border-0 z-50">
        <LoadingCirc/>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto lg:relative lg:bottom-auto fixed bottom-0 left-0 right-0 lg:left-auto lg:right-auto bg-white lg:bg-transparent rounded-t-3xl lg:rounded-none shadow-2xl lg:shadow-none border-t border-gray-300 lg:border-0 z-50">
      {/* Handle for mobile bottom sheet */}
      
      
      <div className="p-6 pb-4 lg:p-0">
        {currentStep === 'phone' && (
          <div>
            <PhoneInputForm
              selectedCountryCode={selectedCountryCode}
              onCountryCodeChange={handleCountryCodeChange}
              countryCodes={countryCodes}
              onSuccess={handlePhoneSuccess}
              primary_color={primary_color}
            />
            <div className='mt-4'>
            <TermsAcceptance link={`/terms`}/>
            </div>
          </div>
        )}

        {currentStep === 'otp' && (
          <OTPInputForm
            phoneNumber={phoneNumber}
            isExistingUser={isExistingUser}
            primary_color={primary_color}
            onVerified={handleOTPVerified}
            verificationId={verificationId}
          />
        )}

        {currentStep === 'name' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">إكمال التسجيل</h2>
              <p className="text-gray-600">أدخل اسمك لإكمال إنشاء الحساب</p>
            </div>
            <NameInputForm
              onSuccess={handleNameSuccess}
              primary_color={primary_color}
            />
          </div>
        )}
      </div>
      
      {/* Safe area for mobile devices with home indicator */}
      <div className="lg:hidden pb-safe h-4"></div>
    </div>
  );
};

export default ClientAuthFlow;