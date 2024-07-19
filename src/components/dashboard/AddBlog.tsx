"use client"

import { useRouter } from "next/navigation"
import { BlogFormType } from "@/types/forms"
import { BlogService } from "@/services/blogService";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import initFullProps from "./tinymceProps";


export default function AddBlog({ editBlog }: { editBlog?: BlogFormType }) {
    const router = useRouter();
    const [blog, setBlog] = useState<BlogFormType>(
        editBlog ? editBlog : {
            content: "",
            title: "",
            description: "",
            image: "",
            slug: "",
            keywords: [],
        }
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(blog);
        try {
            if (editBlog) {
                let res = await toast.promise(BlogService.updateBlog(editBlog.slug, blog), {
                    pending: "Updating Blog...",
                    success: "Blog Updated Successfully",
                    error: "Error in Updating Blog"
                });
                console.log(res);
                router.push("/blog/" + blog.slug);
            } else {
                let res = await toast.promise(BlogService.addBlog(blog), {
                    pending: "Adding Blog...",
                    success: "Blog Added Successfully",
                    error: "Error in Adding Blog"
                });
                console.log(res);
                router.push("/blog/" + blog.slug);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className="sm:max-w-4xl max-w-full max-sm:mx-2 my-10 px-3 py-5 dark:bg-neutral-900 bg-neutral-100 mx-auto rounded-md border dark:border-neutral-800 border-neutral-200 shadow-lg">
                <h1 className="text-center text-2xl my-2">Add Blog</h1>
                <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        required
                        className="input"
                        value={blog.title}
                        onChange={(e) => {
                            blog.title = (e.target as any).value;
                            setBlog({ ...blog });
                        }}
                    />
                    <input
                        required
                        type="text"
                        placeholder="Description"
                        className="input"
                        value={blog.description}
                        onChange={(e) => {
                            blog.description = (e.target as any).value;
                            setBlog({ ...blog });
                        }}
                    />
                    <input
                        required
                        type="url"
                        placeholder="Image Link"
                        className="input"
                        value={blog.image}
                        onChange={(e) => {
                            blog.image = (e.target as any).value;
                            setBlog({ ...blog });
                        }}
                    />
                    <input
                        required
                        type="text"
                        placeholder="Keyword comma separted"
                        className="input"
                        value={blog.keywords?.join(",")}
                        onChange={(e) => {
                            blog.keywords = (e.target as any).value.split(",");
                            setBlog({ ...blog });
                        }}
                    />
                    <input
                        required
                        type="text"
                        pattern="^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$"
                        placeholder="Slug only include hyphen or alphanumeric characters"
                        className="input"
                        value={blog.slug}
                        onChange={(e) => {
                            blog.slug = (e.target as any).value;
                            setBlog({ ...blog });
                        }}
                    />
                    <Editor
                        id="content"
                        value={blog.content}
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        init={{
                            ...initFullProps,
                        }}

                        onEditorChange={(content) => {
                            blog.content = content;
                            setBlog({ ...blog });
                        }}

                    />

                    <button
                        type="submit"
                        className="w-full px-3 py-1 my-3 text-neutral-200 rounded-md bg-violet-600 hover:bg-violet-500 transition-all duration-300"
                    >
                        {editBlog ? "Update" : "Add"}
                    </button>

                </form>

            </div>
        </>
    )
}
