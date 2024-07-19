import { MyPayload } from "@/types/auth";
import { JWTPayload, jwtVerify, JWTVerifyResult, SignJWT } from "jose";

type AuthPayload = JWTPayload & MyPayload;

export const verifyToken = async (token: string) => {
    try {
        const payload = <JWTVerifyResult<AuthPayload>>(await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)));
        return payload.payload;
    } catch (error) {
        return null;
    }
}

export const craeteToken = async (payload: any) => {
    const jwt = new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    return jwt;
}