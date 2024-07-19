"use client"

import useAuth from "@/hooks/useAuth"
import { LoginFormType, SignupFormType } from "@/types/forms"
import { useState } from "react"
import { BiLoader } from "react-icons/bi"
import { toast } from "react-toastify"

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<LoginFormType>({
        username: "",
        password: ""
    })

    const { signIn } = useAuth();

    const handleSubmit = async () => {
        setLoading(true);
        const res = await signIn(data);
        setLoading(false);
    }

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        required
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="input"
                        onChange={(e) => {
                            data.username = e.target.value;
                            setData({ ...data });
                        }}
                        value={data.username}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        required
                        type="password"
                        id="password"
                        className="input"
                        onChange={(e) => {

                            setData({ ...data, password: e.target.value });
                        }}
                        value={data.password}
                        placeholder="Password"
                    />
                </div>
                <div>
                    <button type="submit" className="btn w-full" disabled={loading}>
                        {loading ? <BiLoader className="animate-spin inline-block" /> : "Login"}
                    </button>
                </div>
            </form>
        </>
    )
}

const Signup = () => {
    const [data, setData] = useState<SignupFormType>({
        username: "",
        password: "",
        email: "",
    })

    const { signUp } = useAuth();

    const handleSubmit = async () => {
        await toast.promise(signUp(data), {
            pending: "Signing up...",
            success: "Signed up successfully",
            error: "An error occurred"
        })
    }

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        required
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="input"
                        onChange={(e) => {
                            data.username = e.target.value;
                            setData({ ...data });
                        }}
                        value={data.username}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        required
                        type="email"
                        id="email"
                        placeholder="email@gmail.com"
                        className="input"
                        onChange={(e) => {
                            data.email = e.target.value;
                            setData({ ...data });
                        }}
                        value={data.email}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        required
                        type="password"
                        id="password"
                        className="input"
                        onChange={(e) => {

                            setData({ ...data, password: e.target.value });
                        }}
                        value={data.password}
                        placeholder="Password"
                    />
                </div>
                <div>
                    <button type="submit" className="btn w-full">Sign up</button>
                </div>
            </form>
        </>
    )
}

const AuthenticationForm = () => {
    const [selected, setSelected] = useState<"login" | "signup">("login");
    return (
        <>
            <div className="max-w-lg mx-auto my-5 dark:bg-neutral-900 bg-neutral-200 rounded-md p-4 flex flex-col gap-4">
                <div className="flex border-b dark:border-neutral-700 border-neutral-500 pb-3">
                    <div
                        onClick={() => setSelected("login")}
                        className={`flex-1 cursor-pointer hover:text-emerald-600 ${selected === "login" ? "text-emerald-600" : ""} text-center transition-all flex justify-center items-center`}
                    >
                        Login
                    </div>
                    <div
                        onClick={() => setSelected("signup")}
                        className={`flex-1 cursor-pointer hover:text-emerald-600 ${selected === "signup" ? "text-emerald-600" : ""} text-center transition-all flex justify-center items-center`}
                    >
                        SignUp
                    </div>
                </div>
                <div>{selected === "login" ? <Login /> : <Signup />}</div>
            </div>
        </>
    )
}

export default AuthenticationForm;