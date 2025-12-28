import React, { useContext } from 'react';
import { Alert, Spin } from 'antd';
import { PageErrorMessengerContext } from '../../hooks/pageError/context';

import styles from './styles.module.scss'

interface BasicPageLayoutProps{
  title: React.ReactNode,
  children?: React.ReactNode
  loading?: boolean;
}
export function BasicPageLayout(props: BasicPageLayoutProps){
  const {errorText} = useContext(PageErrorMessengerContext)

  return <div className="flex-col h-full ">
    {props.title}
    <div className={`bg-card p-6 rounded-lg ${props.loading ? styles['loading-block'] : ""} mb-10 ${styles['main-banner']}`}>
      {errorText && <Alert type="error" title={errorText} /> }
      {props.loading ? <Spin spinning={true} size="large" className='left-1/2 top-1/2 -translate-1/2 '/> : props.children}
    </div>
  </div>
}