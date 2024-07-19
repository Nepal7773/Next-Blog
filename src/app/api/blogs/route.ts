import BlogModel from "@/models/Blog";
import CommentModel from "@/models/Comment";
import dbConnect from "@/models/dbConnect";
import UserModel from "@/models/User";
import { authenticate } from "@/utils/handlers";
import { HttpStatusCode } from "axios";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BlogSchema = z.object(
    {
        title: z.string(),
        content: z.string(),
        description: z.string(),
        slug: z.string(),
        image: z.string().optional(),
        likedBy: z.array(z.string()).default([]),
        comments: z.array(z.string()).default([]),
        keywords: z.array(z.string()).default([]),
    }
)

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const blogs = await BlogModel.find({}).sort({ createdBy: -1 });
        return NextResponse.json({
            success: true,
            blogs: blogs,
            message: "Blogs fetched successfully"
        }, { status: HttpStatusCode.Ok });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: (error as Error).message
        }, { status: HttpStatusCode.InternalServerError });;
    }
}

export const POST = authenticate(async (req: NextRequest) => {
    await dbConnect();
    const data = BlogSchema.safeParse(await req.json());
    if (data.success === false) {
        return NextResponse.json({
            success: false,
            message: "Invalid data",
            error: data.error
        }, { status: HttpStatusCode.BadRequest });
    }

    const blogData = data.data;
    const blog = await BlogModel.create({
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        slug: blogData.slug,
        image: blogData.image,
        likedBy: blogData.likedBy,
        comments: blogData.comments,
        keywords: blogData.keywords,
    });

    if (!blog) {
        return NextResponse.json({
            success: false,
            message: "Failed to Add blog"
        }, { status: HttpStatusCode.InternalServerError });
    }

    return NextResponse.json({
        success: true,
        blog: blog,
        message: "Blog added successfully"
    }, { status: HttpStatusCode.Created });
})