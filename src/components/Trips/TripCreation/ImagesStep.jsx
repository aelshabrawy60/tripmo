// components/steps/ImagesStep.jsx
import { useEffect, useState } from "react";
import ImgUploader from "../ImgUploader"; // Assuming path

export default function ImagesStep({ 
  images, 
  errors, 
  groupId, 
  onUpdateImages, 
  onClearErrors 
}) {
  const [isUploading, setIsUploading] = useState(false)
  const handleImageChange = (imgs) => {
    onUpdateImages(imgs);
    if (errors.images) {
      onClearErrors("images");
    }
  };

  useEffect(()=>{
    console.log("med", images)
  },[images])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          صور الرحلة* (اختر صور جذابة تعبر عن الرحلة)
        </label>
        <ImgUploader 
          groupId={groupId} 
          intitImgs={images} // Allow ImgUploader to show current images
          onUpload={handleImageChange} 
          onUploading={setIsUploading} // This prop might be for showing a loading state in ImgUploader
        />
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images}</p>
        )}
      </div>
    </div>
  );
}