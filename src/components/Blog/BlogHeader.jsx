import React from 'react'

function BlogHeader({title, date, img}) {
  return (
    <div className='mb-10'>
      <div className='mb-10'>
        <h1 className='text-4xl font-bold mb-4'>{title}</h1>
        <p className='text-gray-500'>{date}</p>
      </div>
      <img className='w-full h-[400px] object-cover rounded-xl' src={img} alt={title} />
    </div>
  )
}

export default BlogHeader