import { verifyToken } from "@/utils/auth";
import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const payload = await verifyToken(cookies().get("token")?.value!);
        if (payload) {
            return NextResponse.json({
                success: true,
                user: payload,
                message: "User is authenticated"
            }, { status: HttpStatusCode.Ok });
        } else {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
                user: null
            }, { status: HttpStatusCode.Unauthorized });
        }
    } catch (error) {
        console.log("Error in auth route: ", error);
        return NextResponse.json({
            success: false,
            message: (error as Error).message,
        }, { status: HttpStatusCode.InternalServerError });
    }
}