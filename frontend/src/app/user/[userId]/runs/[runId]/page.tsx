"use client"
import {use, useMemo} from 'react';
import { Spin, Typography } from 'antd';
import { useQuery } from '@apollo/client/react';


import { RunPageLayout } from '@/components/RunPageLayout';
import { RunPageTitle } from '@/components/RunPageTitle';
import { GetRunDocument } from '@/generated/graphql/graphql';
import { BossCompletionCard } from '@/components/BossCompletionCard';
import { BasicPageLayout } from '@/components/BasicPageLayout';


export default function RunPage(props: PageProps<'/user/[userId]/runs/[runId]'>){
  const params = use(props.params);
  
  const {data: runData, loading: runLoading, error: runError} = useQuery(GetRunDocument, {
    variables: {
      where: {
        id: params.runId
      }
    }
  })

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

  const bossCompletionBlock = useMemo(() => {
    return runData?.run?.cycles?.[0] && runData?.run?.game && (
          <BossCompletionCard
            cycle={runData?.run.cycles[0]}
            gameInfo={runData.run.game}
          />
        )
  }, [runData])

  if(runLoading){
    return (
      <BasicPageLayout title={undefined} loading={true}>
      </BasicPageLayout>
    )
  }
  
  return <RunPageLayout 
          title={title}
          summaryBlock={statsBlock}
          bossCompletionBlock={bossCompletionBlock}
          />
}