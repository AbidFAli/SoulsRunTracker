'use client'

import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { ThemeConfig } from "antd";
import { ConfigProvider, theme } from "antd";



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




export function RootLayoutBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <ConfigProvider theme={themeConfig}>
        <AntdRegistry>
          <div className="2xl:mx-64 lg:mx-12 p-10">
            {children}
          </div>
        </AntdRegistry>
      </ConfigProvider>
  );
}
