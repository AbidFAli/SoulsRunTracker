import React, { useContext } from 'react';
import { Alert } from 'antd';
import { PageErrorMessengerContext } from '../../hooks/pageError/context';

import styles from './styles.module.scss'
import { CenteredSpinner } from '../CenteredSpinner';

interface BasicPageLayoutProps{
  title: React.ReactNode,
  children?: React.ReactNode
  loading?: boolean;
}
export function BasicPageLayout(props: BasicPageLayoutProps){
  const {errorText} = useContext(PageErrorMessengerContext)

  return <div className="flex-col h-full py-10">
    {props.title}
    <div className={`bg-card p-6 rounded-lg ${props.loading ? styles['loading-block'] : ""} mb-10 ${styles['main-banner']}`}>
      {errorText && <Alert type="error" title={errorText} /> }
      {props.loading ? <CenteredSpinner /> : props.children}
    </div>
  </div>
}