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
import { CycleList, CycleListCycle } from '@/components/CycleList';
import { BossCompletionSection } from '@/components/BossCompletionSection/bossCompletionSection';
import { scrollToBossCompletionTitle } from '@/util/RunPage';


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
          scrollToBossCompletionTitle(bossCompletionBlockRef);
          onChangeCycle(cycle as RunPageCycleFragment);
        }}
      />
    )
  }, [runData, onChangeCycle, cycles])

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