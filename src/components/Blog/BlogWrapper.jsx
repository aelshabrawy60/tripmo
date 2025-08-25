import React from 'react'

function BlogWrapper({ children }) {
  return (
    <div className='max-w-6xl mx-auto p-4 mt-4 md:mt-10'>
      {children}
    </div>
  )
}

export default BlogWrapper