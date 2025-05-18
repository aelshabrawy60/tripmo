"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

function MainNavbar({ pages, logo, theme = "#3B82F6" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="absloute top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo section */}
          <Link href={'/'} className="flex items-center">
            <div className="flex-shrink-0">
              {logo ? (
                <img className="h-10 w-auto" src={logo} alt="شعار الموقع" />
              ) : (
                <div className="text-xl font-bold" style={{ color: theme }}>شعاري</div>
              )}
            </div>
          </Link>

          {/* Primary navigation - Desktop */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {pages?.map((page, index) => (
                <a
                  key={index}
                  href={page.link || "#"}
                  className="text-gray-700 hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                  style={{
                    ':hover': { color: theme }
                  }}
                >
                  {page.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:opacity-80 focus:outline-none"
              style={{
                ':hover': { color: theme }
              }}
              aria-expanded="false"
            >
              <span className="sr-only">فتح القائمة الرئيسية</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          {pages?.map((page, index) => (
            <a
              key={index}
              href={page.link || "#"}
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium text-right"
              style={{
                ':hover': { color: theme }
              }}
            >
              {page.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;