import { Loader } from 'lucide-react'
import React from 'react'

function LoadingCirc() {
  return (
    <div className="flex justify-center p-12 items-center">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  )
}

export default LoadingCirc