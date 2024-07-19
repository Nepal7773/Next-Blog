import BlogModel from "@/models/Blog";
import CommentModel from "@/models/Comment";
import dbConnect from "@/models/dbConnect";
import UserModel from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (
    req: NextRequest,
    { params }: { params: { slug: string } }
) => {
    const { slug } = params;
    if (!slug) {
        return NextResponse.json({
            success: false,
            message: "Please provide a slug"
        }, { status: HttpStatusCode.BadRequest });
    }

    const token = cookies().get("token")?.value;
    if (!token) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: HttpStatusCode.Unauthorized });
    };

    const user = await verifyToken(token);
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: HttpStatusCode.Unauthorized });
    }

    const body = await req.json();
    await dbConnect();
    let blog = await BlogModel.findOne({ slug });
    if (!blog) {
        return NextResponse.json({
            success: false,
            message: "Blog not found"
        }, { status: HttpStatusCode.NotFound });
    }

    const comment = await CommentModel.create(
        {
            content: body.content,
            user: user.id,
        }
    )

    blog.comments.push(comment.id);
    await blog.save();
    blog = await blog.populate({
        path: "comments",
        populate: {
            path: "user",
        }
    });

    return NextResponse.json({
        success: true,
        message: "Comment added",
        blog: blog,
    }, { status: HttpStatusCode.Created });
}