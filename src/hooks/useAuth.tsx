"use client"

import { UserService } from "@/services/userService";
import { MyPayload } from "@/types/auth";
import { LoginFormType, SignupFormType } from "@/types/forms";
import axios, { HttpStatusCode, isAxiosError } from "axios";
import { useRouter } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<MyPayload | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkToken();
    }, [pathname]);

    const checkToken = async () => {
        try {
            if (user) {
                return;
            }
            console.log("checking token....");
            const { data } = await axios.get("/api/auth");
            console.log("Token checked: ", data);
            const payload = data.user;
            setUser(payload);

        } catch (error) {
            if (isAxiosError(error)) {
                if (error.status === HttpStatusCode.Unauthorized) {
                    signOut();
                    router.push('/auth/login')
                }
                console.log(error.response?.data);
            } else {
                console.log((error as Error).message);
            }
        }
    }

    const signIn = async (formData: LoginFormType) => {

        const data = await UserService.login(formData);
        if (data) {
            setUser(data.user);
            toast.success("Logged in successfully");
            router.push("/");
        } else {
            toast.error("Invalid credentials");
        }
    }

    const signUp = async (formData: SignupFormType) => {
        try {
            const data = await UserService.signup(formData);
            setUser(data.user);
            router.push("/");
            return true;
        } catch (error) {
            if (isAxiosError(error)) {
                console.log(error.response?.data);
                toast.error(
                    error.response?.data.message ||
                    error.response?.data.error ||
                    "An error occurred"
                );
            } else {
                console.log((error as Error).message);
            }
            return false;
        }
    }

    const signOut = async () => {
        try {
            await UserService.logout();
            setUser(null);
        } catch (error) {
            if (isAxiosError(error)) {
                console.log(error.response?.data);
                toast.error(
                    error.response?.data.message ||
                    error.response?.data.error ||
                    "An error occurred"
                );
            } else {
                console.log((error as Error).message);
            }
        }
    }

    const memoedValue = useMemo(() => ({
        user, signIn, signOut, signUp, setUser
    }), [user]);

    return (
        <AuthContext.Provider value={memoedValue} >
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext) as {
        user: MyPayload | null,
        signIn: (FormData: LoginFormType) => Promise<void>,
        signUp: (FormData: SignupFormType) => Promise<boolean>,
        signOut: () => Promise<void>,
        setUser: React.Dispatch<React.SetStateAction<MyPayload | null>>;
    }
}

export default useAuth;