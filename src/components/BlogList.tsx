'use client'

import { BlogService } from '@/services/blogService';
import { BlogType } from '@/types/models'
import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import BlogCard from './BlogCard';

export default function BlogList() {
    const [blogs, setBlogs] = useState<BlogType[]>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBlogs = async () => {
        setLoading(true);
        const res = await BlogService.getBlogs();
        if (res) {
            setBlogs(res);

        } else {
            setBlogs([]);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchBlogs();
    }, [])

    return (
        <>
            {loading || !blogs ? (
                <Loading />
            ) : (
                <div className='grid my-5 lg:grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
                    {blogs.map((blog, index) => {

                        return <BlogCard key={index} blog={blog} />
                    }
                    )}
                </div>
            )

            }
        </>
    )
}
