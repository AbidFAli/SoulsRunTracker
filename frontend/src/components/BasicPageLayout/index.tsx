import React, { useCallback, useMemo, useState } from 'react';
import { Alert, AlertProps, Spin } from 'antd';
import type { ErrorLike } from '@apollo/client';
import { BasicPageLayoutContext, BasicPageLayoutContextType, handleGraphqlError } from './context';

import styles from './styles.module.scss'

interface BasicPageLayoutProps{
  title: React.ReactNode,
  children?: React.ReactNode
  loading?: boolean;
}
export function BasicPageLayout(props: BasicPageLayoutProps){
  const [pageError, setError] = useState<ErrorLike | undefined>();



  const errorHandler = useCallback((error?: ErrorLike) => {
    if(error === undefined){
      setError(undefined)
    }
    else{
      handleGraphqlError(error, setError)
    }
  }, [])

  const basicPageLayoutContextValue = useMemo<BasicPageLayoutContextType>(() => {
    return {
      error: pageError,
      setError,
      handleGraphqlError: errorHandler,
    }
  }, [pageError, setError, errorHandler]);

  return <div className="flex-col h-full ">
    {props.title}
    <BasicPageLayoutContext value={basicPageLayoutContextValue }>
      <div className={`bg-card p-6 rounded-lg ${props.loading ? styles['loading-block'] : ""} mb-10 ${styles['main-banner']}`}>
        {pageError && <Alert type="error" title={pageError?.message} /> }
        {props.loading ? <Spin spinning={true} size="large" className='left-1/2 top-1/2 -translate-1/2 '/> : props.children}
      </div>
    </BasicPageLayoutContext>
  </div>
}