'use client'
import {use, useCallback, useContext, useMemo, useEffect, useRef, useState} from 'react';
import { Button, Row, Typography } from 'antd';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import lodash from 'lodash';


import { RunPageLayout } from '@/components/RunPageLayout';
import { RunPageTitle } from '@/components/RunPageTitle';
import {  GetRunDocument } from '@/generated/graphql/graphql';
import { PageErrorMessengerContext } from '@/hooks/pageError/context';
import { usePageError } from '@/hooks/pageError/usePageError';
import { CycleList, CycleListCycle } from '@/components/CycleList';
import { usePathname, useRouter } from 'next/navigation';


export default function RunPage(props: PageProps<'/user/[userId]/runs/[runId]'>){
  const params = use(props.params);
  const router = useRouter();
  const pathname = usePathname();
  

  
  const {data: runData, loading: runLoading, error: runError} = useQuery(GetRunDocument, {
    variables: {
      where: {
        id: params.runId
      }
    },
  })

  const pageError = useMemo(() => {
    const errors = lodash.compact([runError]);
    if(errors.length > 0){
      return errors[0];
    } else{
      return undefined;
    }
  }, [runError])

  const {context: pageErrorContext} = usePageError({error: pageError})


  const title = useMemo(() => {
    return <RunPageTitle gameName={runData?.run?.game?.name ?? ""} titleText={runData?.run?.name ?? ""} />
  }, [runData])

  const statsBlock = useMemo(() => {
    return (
      <>
        <Typography>Completed: {runData?.run?.completed ? "Yes" : "No"}</Typography>
        <Typography style={{color: 'firebrick'}}>Deaths: {runData?.run?.deaths ?? 0}</Typography>
      </>
    )
  }, [runData])

  const cycles = useMemo<CycleListCycle[]>(() => {
    if(!runData?.run?.cycles){
      return []
    }

    const errors: string[] = [];
    const filteredCycles = runData.run.cycles.filter((cycle) => {
      if(lodash.isNumber(cycle.level)){
        return true;
      }
      else{
        errors.push(cycle.id)
        return false;
      }
    });

    if(errors.length > 0){
      console.error(`The following cycles did not have a level: ${filteredCycles} `)
    }
    return filteredCycles as CycleListCycle[];
  }, [runData])

  const cycleBlock = useMemo(() => {
    return runData?.run?.cycles && (
      <CycleList
        cycles={cycles}
        onCycleClick={(cycle) => {
          if(cycle.id){
            router.push(pathname+`/cycle/${cycle.id}`)
          }
        }}
      />
    )
  }, [runData, cycles, router, pathname])

  const footer = useMemo(() => {
    return (
      <Row className="mt-6">
        <Link href={`/user/${params.userId}/runs/${params.runId}/edit`}>
          <Button>Edit</Button>
        </Link>
        
      </Row>
    )
  }, [params.runId, params.userId])

  
  return (
    <PageErrorMessengerContext value={pageErrorContext}>
      <RunPageLayout 
        title={runLoading ? undefined : title}
        summaryBlock={statsBlock}
        cyclesBlock={cycleBlock}
        loading={runLoading}
        footer={footer}
        />
   </PageErrorMessengerContext> 
  )

}