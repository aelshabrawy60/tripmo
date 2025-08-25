import React from 'react'

function BlogCard({title, img, slug}) {
  return (
    <a href={`/blog/${slug}`}>
        <div className='w-full max-w-md'>
        <img src={img} alt={title} className='w-full h-64 object-cover rounded-lg' />
        <h2 className='mt-4 text-xl font-semibold'>{title}</h2>
        </div>
    </a>
  )
}

export default BlogCard