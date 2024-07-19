import BlogModel from "@/models/Blog";
import dbConnect from "@/models/dbConnect";
import { verifyToken } from "@/utils/auth";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
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
    }

    const user = await verifyToken(token);
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: HttpStatusCode.Unauthorized });
    }

    await dbConnect();
    const blog = await BlogModel.findOneAndUpdate(
        { slug },
        { $pull: { likedBy: user.id } },
        { new: true }
    );

    if (!blog) {
        return NextResponse.json({
            success: false,
            message: "Blog not found"
        }, { status: HttpStatusCode.NotFound });
    }

    // blog.likedBy.push(user.id);
    // await blog.save();
    return NextResponse.json({
        success: true,
        message: "Unliked",
        blog,
    }, { status: HttpStatusCode.Ok });

}