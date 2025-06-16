"use client"

import ClientAuthFlow from "@/components/auth/ClientAuthFlow";
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import CityChooser from "@/components/Trips/CityChooser";
import ProfileAbout from "@/components/website/ProfileAbout";
import ProfileCard from "@/components/website/ProfileCard";
import RateShow from "@/components/website/RateShow";
import StarsRates from "@/components/website/StarsRates";
import WithdrawMethodsManager from "@/components/Withdraw/WithdrawManager";



export default function Home() {
  return (
    <MainLayout>
      <div className="p-4 min-h-screen flex-col flex items-center">
        <div className='w-full flex justify-center items-center mb-10'>
          <img src='logo.png' width={150} height={150}></img>
        </div>
       <ClientAuthFlow/>
      </div>
        
    </MainLayout>
  );
}
