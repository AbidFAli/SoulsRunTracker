"use client"
import React from 'react';
import { Divider, Typography } from 'antd';

import { BasicPageLayout } from '@/components/BasicPageLayout';


const { Title} = Typography;

interface RunPageLayoutProps{
  title?: React.ReactNode;
  summaryBlock?: React.ReactNode;
  characterBlock?: React.ReactNode;
  bossCompletionBlock?: React.ReactNode;
  formProps?: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
  footer?: React.ReactNode;
  loading?: boolean;
}

interface ConditionalFormProps{
  formProps?: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
  children?: React.ReactNode;
}

function ConditionalForm({formProps, children} : ConditionalFormProps ){
    if(formProps){
      return <form>
        {children}
      </form>
    }
    return <div>
      {children}
    </div>
}

export function RunPageLayout({
  title, 
  summaryBlock, 
  characterBlock, 
  bossCompletionBlock, 
  formProps,
  footer,
  loading
}: RunPageLayoutProps){

  if(loading){
    return (
      <BasicPageLayout title={title} loading={true}>
      </BasicPageLayout>
    )
  }

  return <BasicPageLayout title={title}>
    <ConditionalForm formProps={formProps}>
      <Title level={2}>Summary</Title>
      {summaryBlock}
      <Divider />
      <Title level={2} >Character</Title>
      {characterBlock}
      <Divider />
      <Title level={2}>Boss Completion</Title>
      {bossCompletionBlock}
      {footer}
    </ConditionalForm>
  </BasicPageLayout>
}