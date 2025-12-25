import React from 'react';
import styles from './styles.module.scss'
import { Spin } from 'antd';

interface BasicPageLayoutProps{
  title: React.ReactNode,
  children?: React.ReactNode
  loading?: boolean;
}
export function BasicPageLayout(props: BasicPageLayoutProps){
  return <div className="flex-col h-full ">
    {props.title}
    <div className={`bg-card p-6 rounded-lg ${props.loading ? 'h-full' : ""} mb-10 ${styles['main-banner']}`}>
      {props.loading ? <Spin spinning={true} size="large" className='left-1/2 top-1/2 -translate-1/2 '/> : props.children}
    </div>
  </div>
}