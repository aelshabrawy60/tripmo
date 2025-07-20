import React from 'react';

function TermsAcceptance({ link, locale = "ar" }) {
  const t = {
    textBefore: {
      ar: "بالمتابعة انت توافق علي",
      en: "By continuing, you agree to the"
    },
    terms: {
      ar: "الشروط والأحكام",
      en: "terms and conditions"
    }
  };

  return (
    <div className="flex items-center justify-center rounded-lg">
      <p className="text-sm text-gray-700 text-center">
        {t.textBefore[locale]}{' '}
        <a 
          href={link} 
          className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors duration-200"
        >
          {t.terms[locale]}
        </a>
      </p>
    </div>
  );
}

export default TermsAcceptance;
