"use client"
import React, { useState } from 'react';

function GalleryViewer({ images = [] }) {
  const [showSlider, setShowSlider] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Handle empty images array
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Determine how many images to show in the preview grid
  const hasMoreImages = images.length > 4;
  const visibleImages = images.slice(0, 4);
  
  // Handle image click
  const handleImageClick = (index) => {
    setActiveSlide(index);
    setShowSlider(true);
  };

  // Close slider
  const closeSlider = () => {
    setShowSlider(false);
  };

  // Navigate through slides
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full relative">
      {/* Image Grid Preview */}
      <div className="grid grid-cols-3 gap-2">
        {/* Main/First Image (larger) */}
        <div 
          className="col-span-3 md:col-span-2 h-64 md:h-[420px] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <img 
            src={images[0]} 
            alt="Main gallery image"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right side grid (3 smaller images) */}
        <div className="col-span-3 md:col-span-1 flex md:flex-col justify-between gap-2 h-32 md:h-[420px]">
          {visibleImages.slice(1).map((image, index) => (
            <div 
              key={index}
              className="h-32 md:h-40 flex-1 rounded-lg overflow-hidden cursor-pointer relative"
              onClick={() => handleImageClick(index + 1)}
            >
              <img 
                src={image} 
                alt={`Gallery image ${index + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              
              {/* Show "See more" overlay on the last visible image if there are more */}
              {hasMoreImages && index === visibleImages.length - 2 && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    +{images.length - 4} more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Image Slider */}
      {showSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button 
              onClick={closeSlider}
              className="text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main slider area */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Image counter */}
            <div className="absolute top-4 left-0 right-0 text-center text-white">
              {activeSlide + 1} / {images.length}
            </div>

            {/* Main image */}
            <div className="max-h-full max-w-full px-4">
              <img 
                src={images[activeSlide]} 
                alt={`Slide ${activeSlide + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Navigation buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Thumbnails */}
          <div className="p-4 overflow-x-auto">
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-16 w-24 flex-shrink-0 rounded overflow-hidden cursor-pointer transition-all duration-200 ${
                    activeSlide === index 
                      ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-black' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryViewer;