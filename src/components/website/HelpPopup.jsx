"use client";
import React, { useState, useEffect } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";

const WhatsAppPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("whatsappPopupShown");

    if (true) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        setIsAnimating(true);
        sessionStorage.setItem("whatsappPopupShown", "true");
      }, 20000); // Show after 20 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleWhatsAppClick = () => {
    const businessNumber = "201061410951";
    const message = `Hi! I'm interested in booking a Nile Cruise. Can you help me with more details?`;

    window.open(
      `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    handleClose();
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setShowPopup(false), 300);
  };

  if (!showPopup) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-xs z-50 p-4 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden transform transition-all duration-300 ${
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>

        {/* Close button */}
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-red-500 hover:bg-gray-200 transition-all duration-200 group z-30 shadow-md"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-white group-hover:text-gray-900 transition-colors" />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Icon with animation */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-tripmo-400 animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            Plan Your Dream<br />Nile Cruise
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed max-w-sm">
            Connect with our travel experts on WhatsApp for instant assistance with bookings, itineraries, and exclusive deals.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleWhatsAppClick}
            className="group relative w-full bg-gradient-to-r from-tripmo-500 to-tripmo-400 hover:from-tripmo-400 hover:to-tripmo-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative flex items-center justify-center gap-3">
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </span>
          </button>

          {/* Trust badge */}
          <p className="mt-6 text-xs text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-tripmo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Trusted by 10,000+ travelers
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPopup;