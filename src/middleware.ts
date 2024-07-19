import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const isAuthRoute = url.pathname.startsWith("/auth");
    const isDashboardRoute = url.pathname.startsWith("/admin");
    const authToken = cookies().get("token");
    if (isDashboardRoute) {
        if (!authToken) {
            return NextResponse.redirect(new URL("/auth", req.url));
        }
        const payload = await verifyToken(authToken.value);
        if (!payload || !payload.isAdmin) {
            return NextResponse.redirect(new URL("/auth", req.url));
        }

        return NextResponse.next();
    } else {
        return NextResponse.next();
    }
}