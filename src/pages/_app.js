import '../components/styles/globals.css';
import {createTheme, NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {Layout} from '../components/layout/layout';
import Head from "next/head";
import React from "react";
import {useRouter} from "next/router";

const lightTheme = createTheme({
    type: 'light',
    theme: {
        colors: {},
    },
});

const darkTheme = createTheme({
    type: 'dark',
    theme: {
        colors: {},
    },
});

function MyApp({Component, pageProps}) {
    const router= useRouter()
    const manifest = router.basePath + "/manifest.webmanifest";
    return (
        <NextThemesProvider
            defaultTheme="system"
            attribute="class"
            value={{
                light: lightTheme.className,
                dark: darkTheme.className,
            }}
        >
            <NextUIProvider>
                <Head>
                    <link rel='manifest' href={manifest} />
                </Head>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </NextUIProvider>
        </NextThemesProvider>
    );
}

export default MyApp;
