"use client"
import React, { useState } from 'react'
import { Copy, Check, Link, Sparkles } from 'lucide-react'

function MainLinkButton({ refCode }) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const link = `https://www.rehlanow.com?ref=${refCode}`
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full mx-auto p-6">

      {/* Link Display */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 font-mono text-sm truncate bg-white px-3 py-2 rounded-lg">
              {link}
            </p>
          </div>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={copyToClipboard}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-full relative overflow-hidden font-semibold py-3 px-6 rounded-xl
          ${copied 
            ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-500/25' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/25'
          }
          ${isHovered && !copied ? 'from-blue-600 to-blue-700' : ''}
          focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
        `}
        disabled={copied}
      >
        {/* Background Animation */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
          transform ${isHovered && !copied ? 'translate-x-full' : '-translate-x-full'}
          transition-transform duration-700 ease-in-out
        `} />
        
        {/* Button Content */}
        <div className="relative flex items-center justify-center gap-3">
          {copied ? (
            <>
              <Check className="w-5 h-5 animate-bounce" />
              <span>تم النسخ بنجاح!</span>
            </>
          ) : (
            <>
              <Copy className={`w-5 h-5 transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`} />
              <span>نسخ الرابط</span>
            </>
          )}
        </div>

        {/* Ripple Effect on Click */}
        {copied && (
          <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping" />
        )}
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default MainLinkButton