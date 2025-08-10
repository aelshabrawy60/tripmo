import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ExternalLink, MapPin, Star } from 'lucide-react';
import { useSharedContext } from '@/context/ShareAffiliateAuth';

const AffiliateTripCard = ({ trip }) => {
  const [copied, setCopied] = useState(false);
  const {user} = useSharedContext()

  const handleCopyLink = async () => {
    const link = `https://rehlanow.com/trips/${trip.slug}?ref=${user?.ref_code}`;
    
    try {
      // Check if clipboard API is available
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback method for older browsers or insecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed: ', err);
          // Show user that copy failed
          alert('Could not copy link. Please copy manually: ' + link);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Copy failed: ', err);
      // Show user that copy failed
      alert('Could not copy link. Please copy manually: ' + link);
    }
  };

  // Get the first image or use a placeholder
  const imageUrl = trip.images && trip.images.length > 0 ? trip.images[0] : '/placeholder-trip.jpg';

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={trip.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        

        {/* Quick action button - appears on hover */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Trip Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200" dir="rtl">
          {trip.name}
        </h3>

        {/* Action Button */}
        <button
          onClick={handleCopyLink}
          disabled={copied}
          className="w-full mt-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/button"
          dir="rtl"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 transition-transform duration-200" />
              <span>تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 transition-transform duration-200 group-hover/button:scale-110" />
              <span>نسخ الرابط</span>
            </>
          )}
        </button>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none" />
    </div>
  );
};

export default AffiliateTripCard;