"use client"
import MainLayout from "@/components/Templates/Main/MainLayout";
import ImgUploader from "@/components/Trips/ImgUploader";
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
