"use client"
import {use, useCallback, useContext, useMemo, useEffect, useRef, useState} from 'react';
import { Button, Row, Typography } from 'antd';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import Link from 'next/link';
import lodash from 'lodash';


import { RunPageLayout } from '@/components/RunPageLayout';
import { RunPageTitle } from '@/components/RunPageTitle';
import { GetCycleDocument, GetRunDocument, RunPageCycleFragment, RunPageDetailedCycleFragment } from '@/generated/graphql/graphql';
import { BossCompletionCard } from '@/components/BossCompletionSection';
import { PageErrorMessengerContext } from '@/hooks/pageError/context';
import { usePageError } from '@/hooks/pageError/usePageError';
import { CycleList } from '@/components/CycleList';
import { BossCompletionSection } from '@/components/BossCompletionSection/bossCompletionSection';


export default function RunPage(props: PageProps<'/user/[userId]/runs/[runId]'>){
  const params = use(props.params);
  
  const [currentCycleDetails, setCurrentCycleDetails] = useState<RunPageDetailedCycleFragment>();
  const [currentCycle, setCurrentCycle] = useState<RunPageCycleFragment>();
  
  const {data: runData, loading: runLoading, error: runError} = useQuery(GetRunDocument, {
    variables: {
      where: {
        id: params.runId
      }
    },
  })

  useEffect(() => {
    if(runData?.run?.currentCycle){
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentCycleDetails({...runData.run.currentCycle})
      setCurrentCycle({...runData.run.currentCycle});
    }
  }, [runData])

  const [getCycle, {loading: cycleLoading}] = useLazyQuery(GetCycleDocument);

  const onChangeCycle = useCallback((cycle: RunPageCycleFragment) => {
    setCurrentCycle({...cycle});
    getCycle({
      variables: {
        where: {
          id: cycle.id
        }
      }
    }).then((newCycle) => {
      if(newCycle.data?.cycle){
        setCurrentCycleDetails({...newCycle.data?.cycle})
      }
    })
  }, [getCycle])



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

  const bossCompletionBlockRef = useRef<HTMLDivElement | null>(null);

  const bossCompletionBlock = useMemo(() => {
    return currentCycleDetails && runData?.run?.game && (
      <BossCompletionSection
        currentCycle={currentCycleDetails}
        gameInfo={runData.run.game}
        cycles={runData.run.cycles ?? []}
        onChangeCycle={onChangeCycle}
        loading={cycleLoading}
      />
    )
  }, [runData, onChangeCycle, currentCycleDetails, cycleLoading])

  const cycleBlock = useMemo(() => {
    return runData?.run?.cycles && (
      <CycleList
        cycles={runData.run.cycles}
        onCycleClick={(cycle) => {
          if(bossCompletionBlockRef.current){
            const coords = bossCompletionBlockRef.current.getBoundingClientRect();
            window.scrollTo(window.scrollX, Math.max(coords.y + window.scrollY - 20, 0));
          }
          onChangeCycle(cycle)
        }}
      />
    )
  }, [runData, onChangeCycle])

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
        bossCompletionBlock={bossCompletionBlock}
        bossCompletionTitleRef={bossCompletionBlockRef}
        cyclesBlock={cycleBlock}
        loading={runLoading}
        footer={footer}
        />
   </PageErrorMessengerContext> 
  )

}