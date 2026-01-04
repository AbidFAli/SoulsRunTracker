'use client'

import { ApolloProvider } from "@apollo/client/react";
;
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { apolloClient } from "@/util/apollo";
import { RootLayoutBody} from './rootLayoutBody'
import { StoreProvider } from "@/components/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

//bg-black p-10
  return (
    <StoreProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RootLayoutBody>
            <ApolloProvider client={apolloClient}>
              {children}
            </ApolloProvider>
          </RootLayoutBody>
        </body>
      </html>
    </StoreProvider>
  );
}
