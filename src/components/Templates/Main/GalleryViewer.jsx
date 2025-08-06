"use client";
import React, { useState } from 'react';
import Image from 'next/image';

function GalleryViewer({ images = [] , locale = 'ar'}) {
  const [showSlider, setShowSlider] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const hasMoreImages = images.length > 3;
  const visibleImages = images.slice(0, 3);

  const handleImageClick = (index) => {
    setActiveSlide(index);
    setShowSlider(true);
  };

  const closeSlider = () => {
    setShowSlider(false);
  };

  const nextSlider = () => {
    setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full relative">
      {/* If only one image, render it full width */}
      {images.length === 1 ? (
        <div 
          className="w-full h-64 md:h-[420px] rounded-lg overflow-hidden cursor-pointer relative"
          onClick={() => handleImageClick(0)}
        >
          <Image 
            src={images[0]} 
            alt="Single image"
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 90vw"
          />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <div 
            className={`col-span-3 md:col-span-2 h-64 md:h-[420px] ${locale == "en"? 'rounded-tl-lg md:rounded-bl-lg md:rounded-tr-none md:rounded-br-none rounded-tr-lg': 'rounded-tl-lg md:rounded-tl-none md:rounded-bl-none md:rounded-tr-lg md:rounded-br-lg'} overflow-hidden cursor-pointer relative`}
            onClick={() => handleImageClick(0)}
          >
            <Image 
              src={images[0]} 
              alt="Main gallery image"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              priority
            />
          </div>

          <div className="col-span-3 md:col-span-1 flex md:flex-col justify-between gap-2 h-32 md:h-[420px]">
            {visibleImages.slice(1).map((image, index) => {
              let roundedClasses = '';
              if (index === 0) {
                // First small image (top right)
                roundedClasses = locale == "en"? 'rounded-bl-lg md:rounded-tl-none md:rounded-bl-none md:rounded-tr-lg' : 'rounded-br-lg md:rounded-br-none md:rounded-bl-none md:rounded-tl-lg';
              } else if (index === visibleImages.length - 2) {
                // Last small image (bottom right)
                roundedClasses = locale == "en"? 'rounded-br-lg md:rounded-tl-none md:rounded-bl-none': 'rounded-bl-lg md:rounded-tr-none md:rounded-br-none md:rounded-bl-lg';
              }
              
              return (
                <div 
                  key={index}
                  className={`h-32 md:h-40 flex-1 ${roundedClasses} overflow-hidden cursor-pointer relative`}
                  onClick={() => handleImageClick(index + 1)}
                >
                  <Image 
                    src={image} 
                    alt={`Gallery image ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes={`(max-width: 768px) 33vw, (max-width: 1200px) ${images.length == 2? '40vw': '30vw'}, ${images.length == 2? '35vw': '25vw'}`}
                  />
                  {hasMoreImages && index === visibleImages.length - 2 && (
                    <div className="absolute inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-10">
                      <span className="text-white font-medium text-lg">
                        +{images.length - 4} صور
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Full Screen Slider */}
      {showSlider && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
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

          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute top-4 left-0 right-0 text-center text-white z-10">
              {activeSlide + 1} / {images.length}
            </div>

            <div className="h-[calc(100vh-200px)] w-full max-w-full px-4 relative">
              <Image 
                src={images[activeSlide]} 
                alt={`Slide ${activeSlide + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <button 
              onClick={prevSlide}
              className="absolute left-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlider}
              className="absolute right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="p-4 overflow-x-auto">
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-16 w-24 flex-shrink-0 rounded overflow-hidden cursor-pointer transition-all duration-200 relative ${
                    activeSlide === index 
                      ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-black' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
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