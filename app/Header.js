"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {

    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    })

    if (!mounted) return null

    return (
        <div className="z-10 top-0 w-full h-10 p-1 bg-transparent">
            <button className="absolute right-1 p-1 border-stone-100 bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-800"
                onClick={() => { theme == "dark" ? setTheme("llight") : setTheme("dark") }}
            >
                <p>Toggle Mode</p>
                
            </button>
        </div>
    )
}