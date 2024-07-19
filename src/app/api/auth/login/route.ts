import dbConnect from "@/models/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { HttpStatusCode } from "axios";
import { MyPayload } from "@/types/auth";
import { craeteToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { error } from "console";

const loginSchema = z.object(
    {
        username: z.string({ required_error: "Email is required" }),
        password: z
            .string({ required_error: "Password is required" })
            .min(6, { message: "Password must be at least 6 characters long" }),
    }
)

export async function POST(request: NextRequest) {
    try {
        const body = loginSchema.safeParse(await request.json());
        if (body.success) {
            await dbConnect();
            const { username, password } = body.data;
            const user = await UserModel.findOne({ username });
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    const payload: MyPayload = {
                        id: user._id as string,
                        username: user.username,
                        email: user.email,
                        isAdmin: user.isAdmin
                    }
                    const token = await craeteToken(payload);
                    cookies().set("token", token, { maxAge: 30 * 24 * 60 * 60 });
                    return NextResponse.json({
                        success: true,
                        message: "User logged in successfully",
                        user: payload,
                        token,
                    }, { status: HttpStatusCode.Ok });
                } else {
                    return NextResponse.json({
                        success: false,
                        message: "Invalid password",
                    }, { status: HttpStatusCode.Unauthorized });
                }
            } else {
                return NextResponse.json({
                    success: false,
                    message: "User not found",
                }, { status: HttpStatusCode.NotFound });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "Validation error",
                errors: body.error.errors
            }, { status: HttpStatusCode.BadRequest })
        }
    } catch (error) {
        console.log("Error in login route", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: HttpStatusCode.InternalServerError });
    }
}
