"use client"
import {use, useCallback, useContext, useMemo, useEffect} from 'react';
import { Button, Row, Typography } from 'antd';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import lodash from 'lodash';


import { RunPageLayout } from '@/components/RunPageLayout';
import { RunPageTitle } from '@/components/RunPageTitle';
import { GetRunDocument } from '@/generated/graphql/graphql';
import { BossCompletionCard } from '@/components/BossCompletionCard';
import { BasicPageLayoutContext } from '@/components/BasicPageLayout/context';


export default function RunPage(props: PageProps<'/user/[userId]/runs/[runId]'>){
  const params = use(props.params);
  const {handleGraphqlError, setError: setPageError} = useContext(BasicPageLayoutContext);
  
  
  const {data: runData, loading: runLoading, error: runError} = useQuery(GetRunDocument, {
    variables: {
      where: {
        id: params.runId
      }
    }
  })

  
  useEffect(() => {
    const errors = lodash.compact([runError]);
    if(errors.length > 0){
      handleGraphqlError(errors[0]);
    } else{
      setPageError(undefined);
    }
  }, [handleGraphqlError, runError, setPageError]);

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

  const footer = useMemo(() => {
    return (
      <Row>
        <Link href={`/user/${params.userId}/runs/${params.runId}/edit`}>
          <Button>Edit</Button>
        </Link>
        
      </Row>
    )
  }, [params.runId, params.userId])

  
  return <RunPageLayout 
          title={runLoading ? undefined : title}
          summaryBlock={statsBlock}
          bossCompletionBlock={bossCompletionBlock}
          loading={runLoading}
          footer={footer}
          />
}