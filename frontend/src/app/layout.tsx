import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "../config";

import "./global.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import Header from "src/components/Header";
import { ToastProvider } from "src/context/ToastContext";

const OnchainProviders = dynamic(
    () => import("src/components/OnchainProviders"),
    {
        ssr: false,
    }
);

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

export const metadata: Metadata = {
    title: "Basedpay",
    description: "The Based way to pay",

    openGraph: {
        title: "Basedpay",
        description: "The Based way to pay",
        images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="px-4 flex justify-center">
                <OnchainProviders>
                    <ToastProvider>
                        <Header />
                        {children}
                    </ToastProvider>
                </OnchainProviders>
            </body>
        </html>
    );
}
