"use client"

import React from 'react';
import { Users, Globe, Phone, Shield, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import BlockHostModal from './BlockHostModal'; // This will be created later

function AdminHostCard({ data, onStatusChange }) {
  const router = useRouter();
  
  // Status configuration with Arabic labels and colors
  const statusConfig = {
    active: {
      label: 'نشط',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-100'
    },
    blocked: {
      label: 'محظور',
      color: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
      ring: 'ring-red-100'
    }
  };

  // Handle external link click - prevent event bubbling
  const handleExternalLinkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(`${process.env.NEXT_PUBLIC_SITE_URL}/site/${data.subdomain}`, '_blank', 'noopener,noreferrer');
  };

  const currentStatus = statusConfig[data.status] || statusConfig.active;
  const isBlocked = data.status === 'blocked';

  return (
    <a
      href={`${process.env.NEXT_PUBLIC_SITE_URL}/host/${data.id}`}
      target='_blank'
      className="group relative bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 overflow-hidden cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Host info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Host thumbnail */}
            <div className="relative flex-shrink-0">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-300">
                <Image
                  src={data.profile_image || '/profile-fallback.jpg'}
                  alt={data.name || 'Host thumbnail'}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  sizes="56px"
                />
                {isBlocked && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Host details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 truncate">
                {data.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{data.subdomain}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{data.clients_contact_phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default AdminHostCard;
