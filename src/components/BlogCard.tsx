import { BlogType } from '@/types/models'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AiOutlineLink } from 'react-icons/ai'

export default function BlogCard({ blog }: { blog: BlogType }) {

    return (
        <div className='border dark:border-neutral-700 border-neutral-300 p-3 bg-neutral-200 dark:bg-neutral-900 rounded-md shadow-lg'>
            <div className='group relative'>
                <img
                    src={blog.image!}
                    alt={blog.title}
                    loading="eager"
                    className="transition-all aspect-video w-full duration-300 rounded-md object-cover group-hover:blur-[2px]"
                />
                <Link
                    href={`/blog/${blog.slug}`}
                    className='group-hover:opacity-100 group-hover:scale-110 opacity-0  w-full h-full flex justify-center items-center transition-all duration-300 absolute top-0 right-0'
                >
                    <AiOutlineLink className='text-4xl text-white' />
                </Link>
            </div>
            <h3 className='text-lg my-2'>{blog.title}</h3>
            <p className='text-sm dark:text-gray-300 text-gray-700 line-clamp-2'>
                {blog.description}
            </p>
            <div className="flex flex-wrap gap-3 my-2">
                {
                    blog.keywords?.map((keyword, index) => {
                        return (
                            <span
                                key={index}
                                className='rounded-3xl bg-emerald-400 text-black py-0.5 px-3 transition-all duration-300 hover:scale-90 shadow-lg '
                            >
                                {keyword}
                            </span>
                        )
                    })
                }
            </div>
        </div>
    )
}
