'use client'

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ApolloProvider } from "@apollo/client/react";
import type { ThemeConfig } from "antd";
import { ConfigProvider, theme } from "antd";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppContextProvider } from "@/state/appContext";
import { apolloClient } from "@/util/apollo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  components: {
    Input: {
      colorBorder: "#FFFFFF"
    },
    Table: {
      colorBgContainer: "#0F0E0E",
      headerBg: "#0F0E0E",
    }
  }
}




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

//bg-black p-10
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-10`}
      >
        <ApolloProvider client={apolloClient}>
          <AppContextProvider>
            <ConfigProvider theme={themeConfig}>
              <AntdRegistry>
                <div className="2xl:mx-64 lg:mx-12">
                  {children}
                </div>
              </AntdRegistry>
            </ConfigProvider>
          </AppContextProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
