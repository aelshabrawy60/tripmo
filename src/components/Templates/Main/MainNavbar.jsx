"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import CurrencySwitcher from '@/components/LanguageSwitcher/CurrencySwitcher';
import SettingsSwitcher from '@/components/LanguageSwitcher/SettingsSwitcher';

function MainNavbar({ pages, logo = "/logo.png", theme = "#3B82F6", locale, type = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="absloute top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo section */}
          <Link href={'/'} className="flex items-center">
            <div className="flex-shrink-0">
              {logo ? (
                <img className="h-14 w-auto" src={logo} alt="شعار الموقع" />
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
                  href={page.link}
                  className="text-gray-700 hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                  style={{
                    ':hover': { color: theme }
                  }}
                >
                  {locale == "ar" ? page.name.ar: page.name.en}
                </a>
              ))}
            </div>
          </div>

          {type == 0 ? 
            <div>
              <SettingsSwitcher/>
            </div>
           :
            <a target='_blank' href='https://rehlanow.com' className='block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium text-right'>
              عرض الموقع
            </a>
           }

        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          {pages?.map((page, index) => (
            <a
              key={index}
              href={page.link}
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium text-right"
              style={{
                ':hover': { color: theme }
              }}
            >
              {locale == "ar" ? page.name.ar: page.name.en}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;