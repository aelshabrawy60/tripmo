"use client"

import ClientAuthFlow from "@/components/auth/ClientAuthFlow";
import MainLayout from "@/components/Templates/Main/MainLayout";
import MainNavbar from "@/components/Templates/Main/MainNavbar";
import CityChooser from "@/components/Trips/CityChooser";
import ImgUploader from "@/components/Trips/ImgUploader";
import ProfileAbout from "@/components/website/ProfileAbout";
import ProfileCard from "@/components/website/ProfileCard";
import RateShow from "@/components/website/RateShow";
import StarsRates from "@/components/website/StarsRates";
import WithdrawMethodsManager from "@/components/Withdraw/WithdrawManager";
import { useState } from "react";



export default function Home() {

  const [imgs, setImgs] = useState()

  function updateImgs(imgs){
    setImgs(imgs)
  }
  return (
    <MainLayout>
      <ImgUploader onUpload={updateImgs} groupId={1}/>
      <div className="flex flex-col gap-10">
        {imgs}
      </div>
    </MainLayout>
  );
}
