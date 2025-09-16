'use client'

// components/SettingsSwitcher.js
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

const currencies = {
  EGP: { name: 'Egyptian Pound', code: 'EGP', symbol: '£' },
  USD: { name: 'US Dollar', code: 'USD', symbol: '$' },
  GBP: { name: 'British Pound', code: 'GBP', symbol: '£' },
}

const languages = {
  en: { name: 'English', code: 'EN', dir: 'ltr' },
  ar: { name: 'العربية', code: 'AR', dir: 'rtl' },
}

export default function SettingsSwitcher({ className = '', onCurrencyChange }) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentCurrency, setCurrentCurrency] = useState('EGP')
  const [currentLocale, setCurrentLocale] = useState('en')
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({})
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  // Initialize currency from cookie
  useEffect(() => {
    const getCurrencyFromCookie = () => {
      if (typeof document === 'undefined') return 'EGP'
      const cookies = document.cookie.split(';')
      const currencyCookie = cookies.find(cookie => 
        cookie.trim().startsWith('currency=')
      )
      
      if (currencyCookie) {
        const currency = currencyCookie.split('=')[1].trim()
        if (Object.keys(currencies).includes(currency)) {
          return currency
        }
      }
      return 'EGP'
    }

    const savedCurrency = getCurrencyFromCookie()
    setCurrentCurrency(savedCurrency)
    
    if (onCurrencyChange) {
      onCurrencyChange(savedCurrency)
    }
  }, [onCurrencyChange])

  // Initialize language from pathname
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const locale = pathSegments[0]
    if (Object.keys(languages).includes(locale)) {
      setCurrentLocale(locale)
    }
  }, [pathname])

  // Calculate dropdown position before opening
  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return { top: '100%', left: '0' }

    const buttonRect = buttonRef.current.getBoundingClientRect()
    // Estimated dropdown dimensions
    const dropdownWidth = 208 // w-52 = 208px
    const dropdownHeight = 300 // Approximate height
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const margin = 8

    let topPosition = buttonRect.height + 8
    let leftPosition = 0

    // Check vertical space
    const spaceBelow = viewportHeight - buttonRect.bottom
    if (spaceBelow < dropdownHeight + margin && buttonRect.top > dropdownHeight + margin) {
      topPosition = -(dropdownHeight + 8)
    }

    // Check horizontal space
    if (buttonRect.left + dropdownWidth > viewportWidth - margin) {
      leftPosition = buttonRect.width - dropdownWidth
    }

    return {
      top: `${topPosition}px`,
      left: `${leftPosition}px`,
    }
  }

  const handleToggleDropdown = () => {
    if (!isOpen) {
      // Calculate position before opening
      const newPosition = calculateDropdownPosition()
      setDropdownStyle(newPosition)
    }
    setIsOpen(!isOpen)
  }

  const switchCurrency = (newCurrency) => {
    document.cookie = `currency=${newCurrency}; path=/; max-age=${365 * 24 * 60 * 60}`
    setCurrentCurrency(newCurrency)
    
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency)
    }
    
    setIsOpen(false)
    window.location.reload()
  }

  const switchLanguage = (newLocale) => {
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`
    
    const pathSegments = pathname.split('/').filter(Boolean)
    const currentPathLocale = pathSegments[0]
    
    let newPath
    if (Object.keys(languages).includes(currentPathLocale)) {
      const restPath = pathSegments.slice(1).join('/')
      newPath = `/${newLocale}${restPath ? '/' + restPath : ''}`
    } else {
      newPath = `/${newLocale}${pathname}`
    }
    
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className="group flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Language and Currency Settings"
      >
        {/* Settings Icon */}
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
        
        {/* Current Settings Display */}
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium tracking-wide">
            {languages[currentLocale]?.code}
          </span>
          <span className="text-gray-400">·</span>
          <span className="text-sm font-medium tracking-wide">
            {currencies[currentCurrency]?.code}
          </span>
        </div>
        
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
          <div 
            ref={dropdownRef}
            className="absolute py-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200"
            style={dropdownStyle}
          >
            {/* Language Section */}
            <div className="px-3 py-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Language
              </h3>
              <div className="space-y-0.5">
                {Object.entries(languages).map(([locale, { name, code, dir }]) => (
                  <button
                    key={locale}
                    onClick={() => switchLanguage(locale)}
                    className={`w-full text-left px-2 py-2 text-sm rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors duration-150 ${
                      locale === currentLocale
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    dir={dir}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                        />
                      </svg>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{name}</span>
                        <span className="text-xs text-gray-500">{code}</span>
                      </div>
                    </div>
                    
                    {locale === currentLocale && (
                      <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-2 border-t border-gray-100" />

            {/* Currency Section */}
            <div className="px-3 py-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Currency
              </h3>
              <div className="space-y-0.5">
                {Object.entries(currencies).map(([currency, { name, code, symbol }]) => (
                  <button
                    key={currency}
                    onClick={() => switchCurrency(currency)}
                    className={`w-full text-left px-2 py-2 text-sm rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors duration-150 ${
                      currency === currentCurrency
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{code} ({symbol})</span>
                        <span className="text-xs text-gray-500">{name}</span>
                      </div>
                    </div>
                    
                    {currency === currentCurrency && (
                      <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Export the utility hooks from the original language switcher
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