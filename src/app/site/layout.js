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
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import MainFooter from "@/components/Templates/Main/MainFooter";


const pages = [
  { name: 'الرئيسية', link: '/' },
  { name: 'الرحلات', link: '/trips' },
  { name: 'اتصل بنا', link: '/contact' },
  { name: 'اعرض رحلاتك', link: '/offers' },
];

const socialMedia = [
  {name: "facebook", link: 'https://www.facebook.com/share/1AcqvmjMYw'},
  {name: "instagram", link: 'https://www.instagram.com/rehlanow/profilecard/?igsh=cWl0dm4zMzcxZW1l'}
]

export default function RootLayout({ children }) {
  
  return (
    <>
        <MainLayout>
            <MainNavbar pages={pages}/>
            <div>
                {children}
            </div>
            <MainFooter logo={'/logo.png'} socialMedia={socialMedia}/>
        </MainLayout>
    </>
  );
}
