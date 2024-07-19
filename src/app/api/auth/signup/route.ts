import dbConnect from "@/models/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { HttpStatusCode } from "axios";
import { MyPayload } from "@/types/auth";
import { craeteToken } from "@/utils/auth";
import { cookies } from "next/headers";

const schema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(10, { message: "Username must be at most 10 characters long" }),
    email: z
        .string()
        .email({ message: "Invalid email" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
})

export async function POST(request: NextRequest) {
    try {
        const body = schema.safeParse(await request.json());
        if (body.success) {
            await dbConnect()
            const { username, email, password } = body.data;
            if (await UserModel.findOne({ username })) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Username already exists"

                    }, { status: HttpStatusCode.BadRequest });
            }
            if (await UserModel.findOne({ email })) {
                return NextResponse.json({
                    success: false,
                    message: "Email already exists",
                }, { status: HttpStatusCode.BadRequest });
            }

            const newUser = await UserModel.create({
                username,
                email,
                password
            })

            if (!newUser) {
                return NextResponse.json({
                    success: false,
                    message: "Failed to create user"
                }, { status: HttpStatusCode.InternalServerError })
            }

            const payload: MyPayload = {
                id: newUser._id as string,
                isAdmin: newUser.isAdmin,
                username: newUser.username,
                email: newUser.email,
            }

            const token = await craeteToken(payload);
            cookies().set("token", token, { maxAge: 30 * 24 * 60 * 60 });
            return NextResponse.json({
                success: true,
                message: "User created successfully",
                user: payload,
            }, { status: HttpStatusCode.Created });
        } else {
            return NextResponse.json({
                success: false,
                message: "Validation error",
                errors: body.error.errors,
            }, {
                status: HttpStatusCode.BadRequest
            });
        }
    } catch (error) {
        console.log("Error creating user :", error)
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: HttpStatusCode.InternalServerError }
        );
    }
}