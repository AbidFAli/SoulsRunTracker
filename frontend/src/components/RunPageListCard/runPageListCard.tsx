import { Card, List, Typography } from "antd";
import React from "react";

interface RunPageListCardProps{
  children?: React.ReactNode;
}

export function RunPageListCard({children}: RunPageListCardProps){
  return (
    <Card className="max-h-96 overflow-y-scroll">
      {children}
    </Card>
  )
}