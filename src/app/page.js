"use client"
import MainLayout from "@/components/Templates/Main/MainLayout";
import ImgUploader from "@/components/Trips/ImgUploader";
import NewTripCard from "@/components/website/NewTripCard";
import { useState } from "react";

export default function Home() {

  const [imgs, setImgs] = useState()

  function updateImgs(imgs){
    setImgs(imgs)
  }
  
  return (
    <MainLayout>
      
    </MainLayout>
  );
}
