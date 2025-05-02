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


export default function RootLayout({ children }) {
  const { user, groupId, role, loading } = useAuth();
  
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
          <Sidebar title="TRIPMO" groupId={groupId} role={role}/>
          <div className="lg:mr-[260px]">
              {children}
          </div>
        </SharedContext.Provider>
    </>
  );
}
