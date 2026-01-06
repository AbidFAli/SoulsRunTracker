'use client'

import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { ThemeConfig } from "antd";
import { ConfigProvider, theme } from "antd";
import { colors } from "@/util/colors";



const themeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  components: {
    Input: {
      colorBorder: "#FFFFFF"
    },
    Table: {
      colorBgContainer: colors.card,
      headerBg: colors.card,
    },
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
        <div className="2xl:mx-64 lg:mx-12">
          {children}
        </div>
      </AntdRegistry>
    </ConfigProvider>
  );
}
