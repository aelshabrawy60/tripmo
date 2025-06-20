"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from "@/components/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { SharedContext } from "@/context/ShareAut";
import SignInPage from "../signin/page";
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import MainFooter from "@/components/Templates/Main/MainFooter";

const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';

const pages = [
  { name: 'اعرض رحلاتك', link: `${protocol}//host.${currentHost}`, },
];

const socialMedia = [
  {name: "facebook", link: 'https://www.facebook.com/share/1AcqvmjMYw'},
  {name: "instagram", link: 'https://www.instagram.com/rehlanow/profilecard/?igsh=cWl0dm4zMzcxZW1l'}
]

export default function RootLayout({ children }) {
  
  const pathname = usePathname()

  // Define routes where you want to HIDE the navbar
  const hideNavbarRoutes = ['/booking']

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname)

  return (
    <>
        <MainLayout>
            {!shouldHideNavbar && <MainNavbar pages={pages}/>}
            <div>
                {children}
            </div>
            {!shouldHideNavbar && <MainFooter logo={'/logo.png'} socialMedia={socialMedia}/>}
        </MainLayout>
    </>
  );
}
