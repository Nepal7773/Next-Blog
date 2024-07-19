import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export const errorHandler = <T extends any[], R>(
    func: (...args: T) => Promise<R>
): ((...args: T) => Promise<R | undefined>) => {
    return async (...args: T) => {
        try {
            return await func(...args); // Execute the passed function with arguments
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
            } else {
                console.log("error", error)
            }
            return undefined;
        }
    }
}

export const authenticate = (
    handler: (req: NextRequest, ...args: any) => Promise<any>
) => {
    return async (req: NextRequest, ...args: any) => {
        try {
            const token = req.cookies.get("token")?.value;
            if (!token) {
                return NextResponse.json({
                    success: false,
                    message: "Unauthorized"
                }, { status: HttpStatusCode.Unauthorized });
            }

            const decodedToken = await verifyToken(token);
            if (!decodedToken) {
                return NextResponse.json({
                    success: false,
                    message: "Unauthorized"
                }, { status: HttpStatusCode.Unauthorized });
            }

            if (!decodedToken.isAdmin) {
                return NextResponse.json({
                    success: false,
                    message: "Unauthorized"
                }, { status: HttpStatusCode.Unauthorized });
            }

            try {
                return await handler(req, ...args);
            } catch (error) {
                console.error(error);
                return NextResponse.json(
                    { message: (error as Error).message },
                    { status: HttpStatusCode.InternalServerError }
                );
            }
        } catch (error) {
            console.log("Error in authenticate handler", error);
            return NextResponse.json(
                { message: (error as Error).message },
                { status: HttpStatusCode.Unauthorized }
            );
        }
    }
}