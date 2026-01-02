'use client'
import React from "react";
import { CreateRunFormDataContextProvider} from './context'

interface CreateRunPageLayoutProps{
  children?: React.ReactNode;
}

export default function CreateRunPageLayout({children}: CreateRunPageLayoutProps){
  return <CreateRunFormDataContextProvider>
    {children}
  </CreateRunFormDataContextProvider>
}