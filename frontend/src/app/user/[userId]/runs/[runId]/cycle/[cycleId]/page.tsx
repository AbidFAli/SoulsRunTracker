'use client'
import { use, useMemo } from "react";
import { useQuery, useLazyQuery } from '@apollo/client/react';

import { GetCyclePageInfoDocument } from "@/generated/graphql/graphql";
import { BasicPageLayout } from "@/components/BasicPageLayout";
import { RunPageTitle } from "@/components/RunPageTitle";
import { Divider, Typography } from "antd";
import Link from 'next/link';
import { ArrowLeftOutlined } from "@ant-design/icons";
import { BossCompletionCard } from "@/components/BossCompletionSection";

const { Title} = Typography;


export default function CyclePage(props: PageProps<'/user/[userId]/runs/[runId]/cycle/[cycleId]'>){
  const params = use(props.params);

  const {data: cyclePageInfo, loading: queryLoading}= useQuery(GetCyclePageInfoDocument, {
    variables: {
      cycleWhere: {
        id : params.cycleId
      },
      runWhere: {
        id: params.runId,
      }
    }
  });

    const title = useMemo(() => {
      return <RunPageTitle gameName={cyclePageInfo?.run?.game?.name ?? ""} titleText={cyclePageInfo?.run?.name ?? ""} />
    }, [cyclePageInfo])

  return (
    <BasicPageLayout
      title={title}
    >
      <div className="flex">
        <Link
          href={`/user/${params.userId}/runs/${params.runId}`}
        >
          <ArrowLeftOutlined className="text-3xl" />
        </Link>
      </div>
      {!queryLoading && (
        <Title level={2}>Cycle: NG+{cyclePageInfo?.cycle?.level}</Title>
      )}
      <Divider />
      <Title level={3}>Boss Completion</Title>
      {
        cyclePageInfo?.cycle && cyclePageInfo.run?.game && (
            <BossCompletionCard
              cycle={cyclePageInfo.cycle}
              gameInfo={cyclePageInfo.run.game}
            />
        )
      }


    </BasicPageLayout>
  )


  
}