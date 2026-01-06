'use client'
import { use, useMemo, useCallback } from "react";
import { Divider, Row, Space, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import lodash from 'lodash';


import { BasicPageLayout } from "@/components/BasicPageLayout";
import { useAppDispatch, useAppSelector } from "@/state/hooks"
import * as createRunFormSlice from '@/state/runs/createRunForm/createRunFormSlice'
import { RunPageTitle } from "@/components/RunPageTitle";
import { makeCreateRunPageUrl } from "@/util/routing";
import { GetGameInformationDocument } from "@/generated/graphql/graphql";
import { BossCompletionCard } from "@/components/BossCompletionSection";
import type { CreateRunFormCycle} from "@/state/runs/createRunForm/createRunFormSlice"
import { CyclePageCycleLabel } from "@/components/CyclePage/cyclePageCycleLabel";
import { FormCheckbox } from "@/components/Form/formCheckbox";
import { LinkNoStyle } from "@/components/LinkNoStyle";
import { usePageError } from "@/hooks/pageError/usePageError";
import { PageErrorMessengerContext } from "@/hooks/pageError/context";


const { Title} = Typography;


export default function CreateRunCyclePage(props: PageProps<'/user/[userId]/runs/create/cycle/[level]'>){
  const {level, userId} = use(props.params)
  const parsedLevel = useMemo<number>(() => parseInt(level), [level]);

  const dispatch = useAppDispatch();
  const gameName = useAppSelector(createRunFormSlice.selectGameName);
  const savedCycleData = useAppSelector(state => createRunFormSlice.selectCycleByLevel(state, parsedLevel))

  const title = useMemo(() => {
      return <RunPageTitle gameName={gameName ?? ""} titleText="Create your run" />
  }, [gameName])

  const backLink = useMemo(() => makeCreateRunPageUrl(gameName ?? '', userId), [gameName, userId])

  const {data: gameData, loading: gameDataLoading, error: gameDataError} = useQuery(GetGameInformationDocument, 
    {
      variables : {
        where: {
          name: gameName
        }
      }
    }
  );

  const {context: pageErrorContext} = usePageError({error: gameDataError})
  

  const formDefaultValues = useMemo<CreateRunFormCycle>(() => {
    const returnValue: CreateRunFormCycle = savedCycleData ? 
    {...lodash.cloneDeep(savedCycleData), level: parsedLevel} : {bossesCompleted: {}, level: parsedLevel};

    gameData?.game?.gameLocations?.forEach((gameLocation) => {
      gameLocation?.bossInstances?.forEach((bossInstance) => {
        if(!returnValue.bossesCompleted[bossInstance.id]){
          returnValue.bossesCompleted[bossInstance.id] = {
            instanceId: bossInstance.id,
            completed: false
          }
        }
      })
    })

    return returnValue;

  }, [gameData, parsedLevel, savedCycleData])


  const {control, getValues: getFormValues} = useForm<CreateRunFormCycle>({
    defaultValues: formDefaultValues,
  })

  const onBackClick = useCallback(() => {
    const cycle = getFormValues();
    dispatch(createRunFormSlice.setCycle({index: parsedLevel, cycle}))
  }, [dispatch, getFormValues, parsedLevel])


  return (
    <PageErrorMessengerContext value={pageErrorContext}>
      <BasicPageLayout
        title={title}
        loading={gameDataLoading}
      >
        <div className="flex">
          <LinkNoStyle
            href={backLink}
            onClick={onBackClick}
          >
            <ArrowLeftOutlined className="text-3xl" />
          </LinkNoStyle>
        </div>
        <Row>
          <CyclePageCycleLabel cycle={level}/>
        </Row>
        <Divider />
        <Space orientation="vertical">
          <Row>
            <Space>
              <Typography>Completed:</Typography>
              <FormCheckbox
                controllerProps={{control, name: "completed"}}
              />
            </Space>
          </Row>
          <Title level={3}>Boss Completion</Title>
        </Space>
        {
          gameData?.game && (
            <BossCompletionCard
              gameInfo={gameData.game}
              control={control}
            />
          )
        }
      </BasicPageLayout>
    </PageErrorMessengerContext>
  )
}