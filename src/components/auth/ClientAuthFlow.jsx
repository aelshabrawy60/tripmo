'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import PhoneInputForm from './PhoneInputFom';
import OTPInputForm from './OTPInputForm';
import NameInputForm from './NameInputForm';
import LoadingCirc from '../Loading/LoadingCirc';
import TermsAcceptance from '../website/TermsAcceptance';
import { country_codes } from "./country_codes";


const countryMap = {};
country_codes.forEach(c => {
  countryMap[c.name.toLowerCase()] = c;
});

const ClientAuthFlow = ({ onSuccess, onFail, primary_color = '#2563EB', locale }) => {
  const [currentStep, setCurrentStep] = useState('loading'); // loading, phone, otp, name
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState({ code: '+20', name: 'Egypt', flag: '🇪🇬' });
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [verificationId, setVerificationId] = useState(null)

  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingToken = async () => {
      const token = Cookies.get('client_token');
      console.log("token", token)
      
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


  useEffect(() => {
    const fetchCountryByIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        const countryName = data.country_name; // e.g. "Egypt"
        const match = countryMap[countryName.toLowerCase()];

        if (match) {
          setSelectedCountryCode(match);
        } else {
          // fallback to Egypt if not found
          setSelectedCountryCode(country_codes.find(c => c.name === "Egypt"));
        }
      } catch (err) {
        console.error("Failed to fetch country:", err);
        setSelectedCountryCode(country_codes.find(c => c.name === "Egypt"));
      }
    };

    fetchCountryByIP();
  }, []);

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
              onSuccess={handlePhoneSuccess}
              primary_color={primary_color}
              locale={locale}
            />
            <div className='mt-4'>
            <TermsAcceptance link={`/terms`} locale={locale}/>
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
            locale={locale}
          />
        )}

        {currentStep === 'name' && (
          <div>
            <NameInputForm
              onSuccess={handleNameSuccess}
              primary_color={primary_color}
              locale={locale}
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