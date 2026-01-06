'use client'
import {use, useMemo} from "react";
import { Layout, Menu, GetProps, ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";
import { LinkNoStyle } from "@/components/LinkNoStyle";

const { Header, Content } = Layout;


const headerCustomizations: ThemeConfig = {
  components: {
    Menu: {
      horizontalItemSelectedColor: "white"
    }
  }
}

export default function UserPageLayout({children, params}: LayoutProps<'/user/[userId]'>){
  const {userId} = use(params);
  const menuItems = useMemo<GetProps<typeof Menu>['items']>(() => {
    return [
      {
        key: 'myRuns',
        label: <LinkNoStyle href={`/user/${userId}/runs`}>My Runs</LinkNoStyle>
      }
    ]
  }, [userId])
  return <Layout>
    <ConfigProvider
      theme={headerCustomizations}
    >
      <Header style={{padding: "0px"}}>
        <Menu
          items={menuItems}
          mode="horizontal"
          styles={{root: {backgroundColor: "black"}}}
        />
      </Header>
    </ConfigProvider>

    <Content>
      {children}
    </Content>
  </Layout>
}