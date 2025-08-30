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
    {
        title: "Egypt Tour Packages: Your Complete Guide for 2025/2026",
        date: "September 5, 2025",
        img: "/Egypt-tour-guide-at-temple.jpg",
        slug: "egypt-tours-packages"
    },
    {
        title: "Sail Back in Time: Discover Egypt’s Wonders on a Nile Cruise",
        date: "September 15, 2025",
        img: "/d2e58f0d_1755338167484.webp",
        slug: "sail-back-in-time-discover-egypts-wonders-on-a-nile-cruise"
    }
]