import { BlogFormType } from '@/types/forms';
import { BlogType, BlogTypeWithComments, CommentType } from '@/types/models';
import { errorHandler } from '@/utils/handlers';
import axios from 'axios';
import { NextRequest } from 'next/server';

export class BlogService {
    static getBlogs = errorHandler(async () => {
        const res = await axios.get('/api/blogs');
        console.log("this log is from blogservice : ", res);
        return res.data.blogs as BlogType[];
    });

    static getBlogBySlug = errorHandler(async (slug: string) => {
        const res = await axios.get(`/api/blogs/${slug}`);
        return res.data.blog as BlogTypeWithComments;
    });

    static addBlog = errorHandler(async (data: BlogFormType) => {
        const res = await axios.post('/api/blogs', data);
        return res.data.blog as BlogType;
    });

    static updateBlog = errorHandler(async (slug: string, data: BlogFormType) => {
        const res = await axios.put(`/api/blogs/${slug}`, data);
        return res.data.blog as BlogType;
    });

    static deleteBlog = errorHandler(async (slug: string) => {
        const res = await axios.delete(`/api/blogs/${slug}`);
        return res.data.message;
    });

    static likeBlog = errorHandler(async (slug: string) => {
        const res = await axios.get(`/api/blogs/${slug}/like`);
        return res.data.blog as BlogType;
    });

    static unlikeBlog = errorHandler(async (slug: string) => {
        const res = await axios.get(`/api/blogs/${slug}/unlike`);
        return res.data.blog as BlogType;
    });

    static commentOnBlog = errorHandler(async (slug: string, content: string) => {
        const res = await axios.post(`/api/blogs/${slug}/comment`, { content });
        return res.data.blog as BlogTypeWithComments;
    });
}