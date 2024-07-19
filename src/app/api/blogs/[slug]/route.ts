import BlogModel from "@/models/Blog";
import dbConnect from "@/models/dbConnect";
import { authenticate } from "@/utils/handlers";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const schema = z.object({
    title: z.string(),
    content: z.string(),
    description: z.string(),
    slug: z.string(),
    image: z.string().optional(),
    likedBy: z.array(z.string()).default([]),
    comments: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
})

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;
    if (!slug) {
        return NextResponse.json({
            success: false,
            message: "Please provide a slug"
        }, { status: HttpStatusCode.BadRequest });
    }

    await dbConnect();
    let blog = await BlogModel.findOne({ slug }).populate({
        path: "comments",
        populate: {
            path: "user",
        }
    });

    if (!blog) {
        return NextResponse.json({
            success: false,
            message: "Blog not found"
        }, { status: HttpStatusCode.NotFound });
    }
    // console.log("fetched blog", blog);
    return NextResponse.json({
        success: true,
        message: "Blog fetched successfully",
        blog: blog,
    }, { status: HttpStatusCode.Ok });
}

export const PUT = authenticate(
    async (req: NextRequest, { params }: { params: { slug: string } }) => {
        const { slug } = params;
        if (!slug) {
            return NextResponse.json({
                success: false,
                message: "Please provide a slug"
            }, { status: HttpStatusCode.BadRequest });
        }

        await dbConnect();
        const data = schema.safeParse(await req.json());
        if (data.success === false) {
            return NextResponse.json({
                success: false,
                message: "Invalid data",
                errors: data.error
            }, { status: HttpStatusCode.BadRequest });
        }

        const blogData = data.data;

        let newBlog = await BlogModel.findOneAndUpdate({ slug }, blogData, { new: true });
        if (!newBlog) {
            return NextResponse.json({
                success: false,
                message: "Failed to update blog"
            }, { status: HttpStatusCode.InternalServerError });
        }

        return NextResponse.json({
            success: true,
            message: "Blog updated successfully",
            blog: newBlog
        }, { status: HttpStatusCode.Ok });

    })

export const DELETE = authenticate(
    async (req: NextRequest, { params }: { params: { slug: string } }) => {
        const { slug } = params;
        if (!slug) {
            return NextResponse.json({
                success: false,
                message: "Please provide a slug"
            }, { status: HttpStatusCode.BadRequest });
        }

        await dbConnect();
        let res = await BlogModel.findOneAndDelete({ slug });
        if (!res) {
            return NextResponse.json({
                success: false,
                message: "Failed to delete blog"
            }, { status: HttpStatusCode.InternalServerError });
        }

        return NextResponse.json({
            success: true,
            message: "Blog deleted successfully"
        }, { status: HttpStatusCode.Ok });
    }
)