'use client'
import { use, useMemo } from "react";
import { useQuery } from '@apollo/client/react';
import { Col, Divider, Row, Typography } from "antd";


import { GetCyclePageInfoDocument } from "@/generated/graphql/graphql";
import { BasicPageLayout } from "@/components/BasicPageLayout";
import { RunPageTitle } from "@/components/RunPageTitle";
import { BossCompletionCard } from "@/components/BossCompletionSection";
import { CreateRunFormCycle } from "@/state/runs/createRunForm/createRunFormSlice";
import { RunCompletedIcon } from "@/components/Icons";
import { CyclePageCycleLabel } from "@/components/CyclePage/cyclePageCycleLabel";
import { usePageError } from "@/hooks/pageError/usePageError";
import { PageErrorMessengerContext } from "@/hooks/pageError/context";
import { CyclePageBackButton } from "@/components/CyclePage/cyclePageBackButton";

const { Title} = Typography;


export default function CyclePage(props: PageProps<'/user/[userId]/runs/[runId]/cycle/[cycleId]'>){
  const params = use(props.params);

  const {data: cyclePageInfo, loading: queryLoading, error: cycleQueryError}= useQuery(GetCyclePageInfoDocument, {
    variables: {
      cycleWhere: {
        id : params.cycleId
      },
      runWhere: {
        id: params.runId,
      }
    }
  });

  const {context: pageErrorContext} = usePageError({error: cycleQueryError})
  

  const title = useMemo(() => {
    return <RunPageTitle gameName={cyclePageInfo?.run?.game?.name ?? ""} titleText={cyclePageInfo?.run?.name ?? ""} />
  }, [cyclePageInfo])

  const bossesCompleted = useMemo<CreateRunFormCycle["bossesCompleted"]>(() => {
    const returnValue: CreateRunFormCycle["bossesCompleted"] = {};
    cyclePageInfo?.cycle?.bossesCompleted?.forEach((bossCompleted) => {
      returnValue[bossCompleted.instanceId] = bossCompleted;
    })

    return returnValue;
  }, [cyclePageInfo])

  return (
    <PageErrorMessengerContext value={pageErrorContext}>
      <BasicPageLayout
        title={title}
        loading={queryLoading}
      >
        <div className="flex">
          <CyclePageBackButton
            href={`/user/${params.userId}/runs/${params.runId}`}
          />
        </div>
        <Row >
          <Col span={12}>
            <CyclePageCycleLabel cycle={cyclePageInfo?.cycle?.level}/>
          </Col>
          <Col span={12} >
            <Row justify={"end"} >
              {
                cyclePageInfo?.cycle?.completed && (
                  <RunCompletedIcon className="text-3xl" />
                )
              }
            </Row>
          </Col>
        </Row>
        <div >
          <Divider  />
        </div>
        <Title level={3}>Boss Completion</Title>
        {
          cyclePageInfo?.cycle && cyclePageInfo.run?.game && (
              <BossCompletionCard
                bossesCompleted={bossesCompleted}
                gameInfo={cyclePageInfo.run.game}
              />
          )
        }
      </BasicPageLayout>
    </PageErrorMessengerContext>
  )


  
}