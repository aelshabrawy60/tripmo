import React from 'react'

function TermsAcceptance({link}) {
  return (
    <div className="flex items-center justify-center rounded-lg">
      <p className="text-sm text-gray-700 text-center">
        بالمتابعة انت توافق علي{' '}
        <a 
          href={link} 
          className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors duration-200"
        >
          الشروط والأحكام
        </a>
      </p>
    </div>
  )
}

export default TermsAcceptance