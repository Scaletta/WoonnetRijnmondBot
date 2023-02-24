import '../components/styles/globals.css';
import {createTheme, NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {Layout} from '../components/layout/layout';

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
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </NextUIProvider>
        </NextThemesProvider>
    );
}

export default MyApp;