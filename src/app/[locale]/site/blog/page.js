import BlogCard from '@/components/Blog/BlogCard'
import React from 'react'

function page() {
  return (
    <div className='p-4'>
        {blogs.map((blog, index) => (
            <div key={index} className="mb-12">
                <BlogCard
                    title={blog.title}
                    date={blog.date}
                    img={blog.img}
                    slug={blog.slug}
                />
            </div>
        ))}
    </div>
  )
}

export default page


const blogs = [
    {
        title: "Egypt Tours: The Ultimate Guide to an Unforgettable Adventure (2025/2026)",
        date: "August 25, 2025",
        img: "/blog1.jpg",
        slug: "egypt-tours-the-ultimate-guide-to-an-unforgettable-adventure"
    },
]