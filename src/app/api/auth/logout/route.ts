import { HttpStatusCode } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        cookies().delete("token");
        return NextResponse.json({
            success: true,
            message: "Logged out"
        }, { status: HttpStatusCode.Ok });
    } catch (error) {
        console.log("Error logging out: ", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to Logout"
            },
            { status: HttpStatusCode.InternalServerError }
        );
    }
}