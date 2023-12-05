"use client";

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";

import Image from 'next/image';
import Map from './Map'
import Form from './Form';
import { Header } from "./Header";

export default function Home() {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='light'>
        <main className='min-h-screen'>
          <title>
            Feedback Map
          </title>
          <header className="h-10 bg-transparent">
            <Header />
          </header>
          <div className="top-10 flex flex-col sm:flex-row items-center justify-between bg">
            <Map />
            <Form />
          </div>

        </main>

      </NextThemesProvider>
    </NextUIProvider>
  )
}
