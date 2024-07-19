import BlogPage from '@/components/BlogPage'
import React from 'react'

export default function page({ params }: { params: { slug: string } }) {
    return (
        <>
            <BlogPage slug={params.slug} />
        </>
    )
}
