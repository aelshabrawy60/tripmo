"use client";
import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";


const SignInWithGoogleButton = ({ loading, onClick }) => {
  const handleClick = async () => {
    // Call the onClick callback to update the loading state in the parent component
    if (onClick) {
      onClick();
    }
    
    // Then call the server action
    // The server action will handle the redirect
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      // If there's an error, the loading state would need to be reset in the parent component
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center mb-5 justify-center gap-2 bg-white text-gray-700 py-[12px] px-[30px] rounded-[10px] font-medium text-base transition-all duration-300 hover:bg-gray-50 border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span>{loading ? 'جاري تسجيل الدخول...' : 'تسجيل باستخدام جوجل'}</span>
    </button>
  );
};

export default SignInWithGoogleButton;