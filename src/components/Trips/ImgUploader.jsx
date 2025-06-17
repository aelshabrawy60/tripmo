'use client'
import React, { useEffect, useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

function ImgUploader({ intitImgs = [], onUpload, groupId, onUploading }) {
  const [imgs, setImgs] = useState(intitImgs)
  const [progress, setProgress] = useState({})
  const [deleting, setDeleting] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    console.log("imgs", imgs)
  }, [])

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files)
    await processFiles(files)
  }

  const processFiles = async (files) => {
    if (files.length === 0) return

    // Validate files
    const validFiles = []
    const newErrors = []

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        newErrors.push(`${file.name} ليس ملف صورة صالح`)
        return
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        newErrors.push(`${file.name} حجم كبير جداً (الحد الأقصى 10 ميجابايت)`)
        return
      }
      validFiles.push(file)
    })

    setErrors(newErrors)

    // Upload valid files
    for (const file of validFiles) {
      const fileId = uuidv4()
      const filePath = `trips/${groupId}/${fileId}-${file.name}`

      const formData = new FormData()
      formData.append('file', file)

      onUploading(true)

      await uploadImageWithProgress(fileId, filePath, formData)

      onUploading(false)
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadImageWithProgress = (fileId, filePath, formData) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          setProgress((prev) => ({ ...prev, [fileId]: percent }))
        }
      })

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          setProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })

          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText)
              const newImgs = [...imgs, response.url]
              setImgs(newImgs)
              onUpload(newImgs)
              resolve()
            } catch (err) {
              console.error('Invalid JSON response', err)
              setErrors(prev => [...prev, 'فشل الرفع: استجابة غير صحيحة'])
              reject()
            }
          } else {
            console.error('Upload failed:', xhr.responseText)
            setErrors(prev => [...prev, 'فشل الرفع: خطأ في الخادم'])
            reject()
          }
        }
      }

      xhr.open('POST', `/api/storage/upload?path=${filePath}`)
      xhr.send(formData)
    })
  }

  const handleRemoveImage = async (urlToRemove) => {
    const filePath = new URL(urlToRemove).pathname.replace(/^\/+/, '')
    setDeleting(urlToRemove)

    try {
      const res = await fetch(`/api/storage/remove?path=${filePath}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        const newImgs = imgs.filter((url) => url !== urlToRemove)
        setImgs(newImgs)
        onUpload(newImgs)
      } else {
        console.error('Failed to delete image from server')
        setErrors(prev => [...prev, 'فشل في حذف الصورة'])
      }
    } catch (err) {
      console.error('Error while deleting image:', err)
      setErrors(prev => [...prev, 'خطأ في حذف الصورة'])
    } finally {
      setDeleting(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }

  const dismissError = (index) => {
    setErrors(prev => prev.filter((_, i) => i !== index))
  }

  const hasUploading = Object.keys(progress).length > 0

  return (
    <div className="space-y-6" dir="rtl">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={() => dismissError(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label="إغلاق الخطأ"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 
          ${dragOver 
            ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
          }
          ${hasUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={hasUploading}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {dragOver ? 'ضع الصور هنا' : 'رفع الصور'}
            </p>
            <p className="text-sm text-gray-500">
              اسحب وأسقط الصور هنا، أو انقر للتصفح
            </p>
            <p className="text-xs text-gray-400 mt-1">
              يدعم JPG, PNG, GIF حتى 10 ميجابايت لكل صورة
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {hasUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
            <span className="text-sm font-medium text-blue-800">جاري رفع الصور...</span>
          </div>
          <div className="space-y-3">
            {Object.entries(progress).map(([id, percent]) => (
              <div key={id} className="space-y-1">
                <div className="flex justify-between text-xs text-blue-700">
                  <span>جاري الرفع...</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {imgs.length > 0 && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imgs.map((url, i) => (
              <div key={i} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={url}
                    alt={`صورة-مرفوعة-${i}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-200 items-center justify-center">
                    <span className="text-gray-500 text-sm">فشل في تحميل الصورة</span>
                  </div>
                </div>
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <button
                    type="button"
                    disabled={deleting === url}
                    onClick={() => handleRemoveImage(url)}
                    className={`
                      bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium
                      opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0
                      ${deleting === url ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}
                      shadow-lg
                    `}
                  >
                    {deleting === url ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white ml-1"></div>
                        جاري الحذف...
                      </div>
                    ) : (
                      'حذف'
                    )}
                  </button>
                </div>
                
                {/* Delete loading overlay */}
                {deleting === url && (
                  <div className="absolute inset-0 bg-black/50 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="bg-white rounded-full p-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImgUploader