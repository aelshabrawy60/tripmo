import React from 'react'

function Loading() {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <img 
        src='/logo.svg' 
        width={150}
        className='animate-pulse'
        style={{ animationDuration: '3s' }}
      ></img>
    </div>
  )
}

export default Loading