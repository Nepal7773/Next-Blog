"use client"

import { TwitterIcon } from 'next-share'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SiTwitter } from 'react-icons/si'
import { TfiWorld } from 'react-icons/tfi'

export default function Footer() {
    return (
        <footer className="text-gray-600 bg-neutral-200/90 dark:bg-neutral-900/90 dark:text-white flex justify-between items-center">
            <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
                <div className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900 dark:text-gray-50">
                    <Image
                        src={"/logo.png"}
                        alt='Nepalsinh'
                        width={38}
                        height={38}
                        className='text-white bg-violet-600 rounded-full'
                    />
                    <span className="ml-3 text-xl">{"NEPAL'S BLOG"}</span>
                </div>
                <Link target="_blank" href={"https://nepalsinh.vercel.app/"}>
                    <p className="text-sm text-gray-500 dark:text-gray-200 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                        ©2024 Nepalsinh
                    </p>
                </Link>
            </div>
            <div className="flex items-center justify-center gap-3">
                <Link
                    target="_blank"
                    href={"https://nepalsinh.vercel.app/"}
                    title="Nepal's Portfolio"
                >
                    <TfiWorld className="text-2xl" />
                </Link>
                <Link
                    target="_blank"
                    href={"https://x.com/nepalsinh7773"}
                    title="X"
                >
                    <TwitterIcon className="text-2xl" />
                </Link>
            </div>
        </footer>
    )
}
