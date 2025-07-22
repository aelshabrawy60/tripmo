'use client'

// components/CurrencySwitcher.js
import { useEffect, useState } from 'react'

const currencies = {
  EGP: { name: 'Egyptian Pound', code: 'EGP', symbol: '£' },
  USD: { name: 'US Dollar', code: 'USD', symbol: '$' },
}

export default function CurrencySwitcher({ className = '', onCurrencyChange }) {
  const [currentCurrency, setCurrentCurrency] = useState('EGP')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Get currency from cookie on component mount
    const getCurrencyFromCookie = () => {
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
      return 'EGP' // Default currency
    }

    const savedCurrency = getCurrencyFromCookie()
    setCurrentCurrency(savedCurrency)
    
    // Notify parent component of initial currency
    if (onCurrencyChange) {
      onCurrencyChange(savedCurrency)
    }
  }, [onCurrencyChange])

  const switchCurrency = (newCurrency) => {
    // Save preference to cookie
    document.cookie = `currency=${newCurrency}; path=/; max-age=${365 * 24 * 60 * 60}` // 1 year
    
    setCurrentCurrency(newCurrency)
    setIsOpen(false)
    
    // Notify parent component of currency change
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency)
    }
    window.location.reload()
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Current currency: ${currencies[currentCurrency]?.name}`}
      >
        {/* Currency Icon */}
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        
        {/* Currency Code */}
        <span className="text-sm font-medium tracking-wide">
          {currencies[currentCurrency]?.code}
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
          <div className="absolute right-0 mt-2 py-1.5 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-20 animate-in slide-in-from-top-2 duration-200">
            {Object.entries(currencies).map(([currency, { name, code, symbol }]) => (
              <button
                key={currency}
                onClick={() => switchCurrency(currency)}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between group transition-colors duration-150 ${
                  currency === currentCurrency
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-semibold bg-gray-100 group-hover:bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 min-w-[32px] text-center">
                    {symbol}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">{code}</span>
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
        </>
      )}
    </div>
  )
}