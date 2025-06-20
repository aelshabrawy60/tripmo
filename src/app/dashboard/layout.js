"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from "@/components/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { SharedContext } from "@/context/ShareAut";
import SignInPage from "../signin/page";
import ProfileOnboarding from "@/components/Onboarding/Onboarding";


export default function RootLayout({ children }) {
  const { user, groupId, role, loading, onboardStep } = useAuth();
  
  if(loading){
    return(
      <Loading/>
    )
  }
  if(!loading && !user){
    return <SignInPage/>
  }

  return (
    <>
        <SharedContext.Provider value={{ groupId, role }}>
          {onboardStep == null && <Sidebar title="TRIPMO" groupId={groupId} role={role}/>}
          {onboardStep !== null && <ProfileOnboarding profileId={groupId}/>}
          {
          onboardStep == null &&
          <div className={'lg:mr-[260px]'}>
              {children}
          </div>
          } 
        </SharedContext.Provider>
    </>
  );
}
