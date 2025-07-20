'use client'

// components/LanguageSwitcher.js
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const languages = {
  en: { name: 'English', code: 'EN', dir: 'ltr' },
  ar: { name: 'العربية', code: 'AR', dir: 'rtl' },
}

export default function LanguageSwitcher({ className = '' }) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState('en')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extract locale from current path
    const pathSegments = pathname.split('/').filter(Boolean)
    const locale = pathSegments[0]
    if (Object.keys(languages).includes(locale)) {
      setCurrentLocale(locale)
    }
  }, [pathname])

  const switchLanguage = (newLocale) => {
    // Save preference to cookie
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}` // 1 year
    
    // Get current path without locale
    const pathSegments = pathname.split('/').filter(Boolean)
    const currentPathLocale = pathSegments[0]
    
    let newPath
    if (Object.keys(languages).includes(currentPathLocale)) {
      // Replace existing locale
      const restPath = pathSegments.slice(1).join('/')
      newPath = `/${newLocale}${restPath ? '/' + restPath : ''}`
    } else {
      // Add locale to current path
      newPath = `/${newLocale}${pathname}`
    }
    
    // Navigate to new path
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Current language: ${languages[currentLocale]?.name}`}
      >
        {/* Globe Icon */}
        <svg
          className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
        
        {/* Language Code */}
        <span className="text-sm font-medium tracking-wide">
          {languages[currentLocale]?.code}
        </span>
        
        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 py-1.5 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-20 animate-in slide-in-from-top-2 duration-200">
            {Object.entries(languages).map(([locale, { name, code, dir }]) => (
              <button
                key={locale}
                onClick={() => switchLanguage(locale)}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between group transition-colors duration-150 ${
                  locale === currentLocale
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                dir={dir}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-semibold bg-gray-100 group-hover:bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                    {code}
                  </span>
                  <span className="font-medium">{name}</span>
                </div>
                
                {locale === currentLocale && (
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Hook to get current locale for App Router
export function useLocale() {
  const pathname = usePathname()
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const currentLocale = pathSegments[0]
    if (Object.keys(languages).includes(currentLocale)) {
      setLocale(currentLocale)
    }
  }, [pathname])

  return locale
}

// HOC for setting document direction based on language
export function withLanguageDirection(Component) {
  return function LanguageDirectionWrapper(props) {
    const locale = useLocale()
    
    useEffect(() => {
      const direction = languages[locale]?.dir || 'ltr'
      document.documentElement.dir = direction
      document.documentElement.lang = locale
    }, [locale])

    return <Component {...props} />
  }
}