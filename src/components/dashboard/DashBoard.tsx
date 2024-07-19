"use client"

import { BlogService } from "@/services/blogService"
import Loading from "../Loading"
import { BlogType } from "@/types/models";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

const TableRow = ({ blog, onDelete, }: { blog: BlogType; onDelete: () => void; }) => {
    const handleDelete = async () => {
        if (window.confirm("Are you sure to delete Blog ? " + blog.title)) {
            try {
                let res = await toast.promise(BlogService.deleteBlog(blog.slug), {
                    pending: "Deleting Blog...",
                    success: "Blog Deleted Successfully",
                    error: "Error in Deleting Blog"
                });
                onDelete();
            } catch (err) {
                console.log(err);
            }
        }
    };

    // return the jsx for table row 
    return (
        <>
            <tr>
                <td className="px-5 py-5 border-b border-r border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm">
                    <p className="text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        {blog.title}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-r border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm">
                    <p className="text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        {blog.createdAt}
                    </p>
                </td>
                <td className="px-5 py-5 border-b  border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm flex justify-center">
                    <Link
                        href={`/blog/${blog.slug}`}
                        className="text-emerald-400 underline underline-offset-2 p-3 font-bold rounded  mr-2"
                    >
                        View
                    </Link>
                    <Link
                        href={`/admin/edit/${blog.slug}`}
                        className="text-emerald-400 underline underline-offset-2 p-3 font-bold rounded  mr-2"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="text-emerald-400 underline underline-offset-2 p-3 font-bold rounded"
                    >
                        Delete
                    </button>

                </td>
            </tr>
        </>
    )
}



export default function DashBoard() {

    const [blogs, setBlogs] = useState<BlogType[]>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBlogs = async () => {
        setLoading(true);
        const data = await BlogService.getBlogs();
        setBlogs(data ?? []);
        setLoading(false);
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <>
            <div className="sm:w-2/3 max-sm:w-full mx-auto flex flex-col px-2 sm:px-8 py-4">
                {
                    !blogs || loading ? (
                        < Loading />
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full shadow rounded-lg overflow-x-auto">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-5 py-3 border-b border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            blogs.map((blog) => (
                                                <TableRow
                                                    key={blog.slug}
                                                    blog={blog}
                                                    onDelete={() => {
                                                        setBlogs(blogs.filter((b) => b.slug !== blog.slug))
                                                    }} />
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }
                <div className="my-5">
                    <Link
                        href={'admin/add'}
                        className="btn"
                    >
                        Add Blog
                    </Link>
                </div>
            </div>
        </>
    )
}
