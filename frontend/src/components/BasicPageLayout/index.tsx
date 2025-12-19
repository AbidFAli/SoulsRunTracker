import React from 'react';

interface BasicPageLayoutProps{
  title: React.ReactNode,
  children: React.ReactNode
}
export function BasicPageLayout(props: BasicPageLayoutProps){
  return <div>
    {props.title}
    <div className="bg-card p-6 rounded-lg">
      {props.children}
    </div>
  </div>
}