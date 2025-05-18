import React from 'react'

function MainAboutUs({about,img}) {
  return (
    <div className='flex flex-wrap gap-5'>
        <div className='px-3 flex-1 min-w-[300px] flex flex-col justify-center'>
            <div className='font-bold text-3xl mb-5'>من نحن</div>
            <div className='max-w-lg text-xl'>{about}</div>
        </div>
        <div className='px-3 flex-1 min-w-[300px]'>
            <img className='rounded-lg' src={img}></img>
        </div>
    </div>
  )
}

export default MainAboutUs