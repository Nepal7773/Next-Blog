'use client'

import useAuth from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";
import { toast } from "react-toastify";

export default function Navbar() {

    const [mounted, setMounted] = useState(false);
    const { user, signOut } = useAuth();
    const path = usePathname();

    useEffect(() => {
        setMounted(true);
        console.log("first")
    }, []);

    const { systemTheme, theme, setTheme } = useTheme();

    const renderThemeChanger = () => {
        if (!mounted) return null;

        const currenTheme = theme === "system" ? systemTheme : theme;

        if (currenTheme != "dark") {
            return (
                <BsMoon
                    className="tetx-2xl"
                    role="button"
                    onClick={() => setTheme("dark")}
                />
            )
        } else {
            return (
                <BsSun
                    className="tetx-2xl"
                    role="button"
                    onClick={() => setTheme("light")}
                />
            )
        }
    }
    return (
        <>
            <div className="flex items-center p-3 sticky top-0 sm:justify-center  bg-neutral-200/90 dark:bg-neutral-900/90 z-50 backdrop-blur-sm ">
                <Link href={"/"} className="flex items-center gap-3">
                    <Image
                        src={"/logo.png"}
                        alt="Nepalsinh"
                        height={50}
                        width={50}
                        quality={100}
                        priority
                        unoptimized
                    />
                    <span className="text-2xl">{"NEPAL'S BLOG"}</span>
                </Link>
                <div className="absolute right-4 flex items-center gap-3">
                    {renderThemeChanger()}
                    {
                        user && user.isAdmin ?
                            (<Link href={"/admin"} >
                                <GrUserAdmin className="text-2xl" />
                            </Link>)
                            : null
                    }
                    {
                        user ? (
                            <button
                                className="btn"
                                onClick={async () => {
                                    await toast.promise(signOut(), {
                                        success: "Logged out successfully",
                                        pending: "Logging out...",
                                    });
                                }}
                            >Logout</button>
                        ) : (
                            <Link href={"/auth"} className="btn">
                                Login
                            </Link>
                        )
                    }
                </div>
            </div>
        </>
    )
}
