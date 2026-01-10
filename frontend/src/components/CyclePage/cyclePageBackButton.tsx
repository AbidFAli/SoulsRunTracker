'use client'

import { ArrowLeftOutlined } from "@ant-design/icons"
import { LinkNoStyle } from "../LinkNoStyle"

interface CyclePageBackButtonProps{
  href: string;
  onClick?: () => void;
}

export function CyclePageBackButton({href, onClick}: CyclePageBackButtonProps){
  return (
    <LinkNoStyle
      href={href}
      onClick={onClick}
    >
      <ArrowLeftOutlined className="text-3xl" />
    </LinkNoStyle>
  )
}