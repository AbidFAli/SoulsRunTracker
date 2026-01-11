'use client'
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { use, useCallback, useEffect, useMemo, useState } from "react"
import lodash from 'lodash'
import { useForm } from "react-hook-form";
import { Divider, Row, Space, Typography } from "antd";


import { 
  GetRunDocument,
  GetRunEditPageCycleInfoDocument,
  GetRunEditPageCycleInfoQuery
 } from "@/generated/graphql/graphql";
import { unnullify } from "@/util/graphql";
import { useAppDispatch, useAppSelector} from "@/state/hooks"
import * as editRunFormSlice from '@/state/runs/editRunFormSlice'
import { EditRunFormBossCompletion, EditRunFormCycle } from "../../types";
import { populateBossCompletions } from "@/util/cycle";
import { BasicPageLayout } from "@/components/BasicPageLayout";
import { RunPageTitle } from "@/components/RunPageTitle";
import { CyclePageBackButton } from "@/components/CyclePage/cyclePageBackButton";
import { CyclePageCycleLabel } from "@/components/CyclePage/cyclePageCycleLabel";
import { FormCheckbox } from "@/components/Form/formCheckbox";
import { BossCompletionCard } from "@/components/BossCompletionSection";
import { PageErrorMessengerContext } from "@/hooks/pageError/context";
import { usePageError } from "@/hooks/pageError/usePageError";

const { Title} = Typography;


export default function EditRunCyclePage(props: PageProps<'/user/[userId]/runs/[runId]/edit/cycle/[cycleId]'>){
  const params = use(props.params);
  const createdCycle = useAppSelector(state => editRunFormSlice.selectCreatedCycle(state, params.cycleId))
  const cycleEdits = useAppSelector(state => editRunFormSlice.selectedEditedCycle(state, params.cycleId))
  const dispatch = useAppDispatch();

  const {data: runData, loading: runLoading, error: runError} = useQuery(GetRunDocument, {
    variables: {
      where: {
        id: params.runId
      }
    }
  })

  const cleanedRunData = useMemo(() => {
    return unnullify(runData);
  }, [runData]);

  const [getCycleInfo, 
    {
      called: cycleInfoQueryCalled,
      loading: cycleInfoLoading, 
      error: cycleInfoError, 
      data: cycleInfo}] = useLazyQuery(GetRunEditPageCycleInfoDocument
      );
  

  const cleanedCycleInfo = useMemo(() => {
    return unnullify(cycleInfo);
  }, [cycleInfo])
  const existingCycle = useMemo(() => {
    return cleanedRunData?.run?.cycles?.find((cycle) => cycle.id === params.cycleId)
  }, [cleanedRunData?.run?.cycles, params.cycleId])

  const calcFormDefaultsForExistingCycle = useCallback<(cycle: GetRunEditPageCycleInfoQuery) => EditRunFormCycle>((cycle) => {
    const returnValue: EditRunFormCycle = {
      id: existingCycle?.id ?? '',
      completed: existingCycle?.completed ?? false,
      level: existingCycle?.level ?? 0,
      bossesCompleted: Object.fromEntries(
        (cycle.cycle?.bossesCompleted ?? []).map<[string, EditRunFormBossCompletion]>((bossCompletion) => {
          return [bossCompletion.instanceId, {...bossCompletion}] as const
        })
      )
    }

    if(runData?.run?.game){
      returnValue.bossesCompleted = populateBossCompletions(runData.run.game, returnValue.bossesCompleted)
    }
    
    return returnValue;
  }, [existingCycle, runData])

  const formDefaultValues = useMemo<EditRunFormCycle>(() => {
    const returnValue: EditRunFormCycle = createdCycle ? lodash.cloneDeep(createdCycle) : 
      calcFormDefaultsForExistingCycle(cleanedCycleInfo ?? {})

    /*
      don't like doing this twice but I want to populate boss completions to set instanceId
      and I need calcFormDefaultsForExistingCycles to be able to set the formDefaultValues after getCycleInfo completes
    */
    if(runData?.run?.game && createdCycle){
      returnValue.bossesCompleted = populateBossCompletions(runData.run.game, returnValue.bossesCompleted)
    }
    
    return returnValue;
    
  }, [
    createdCycle,
    runData,
    cleanedCycleInfo,
    calcFormDefaultsForExistingCycle
  ])


  const [formDefaultValuesSet, setFormDefaultValuesSet] = useState<boolean>(!!createdCycle)

  const {
    control, 
    getValues: getFormValues, 
    setValue: setFormValue, 
    reset: resetForm,
    formState: {dirtyFields, isDirty}
  } = useForm<EditRunFormCycle>({
    defaultValues: formDefaultValues,
    disabled: !!runError || !!cycleInfoError
  })

  useEffect(() => {
    if(existingCycle && !cycleInfoQueryCalled){
      getCycleInfo({
        variables: {
          where: {
            id: params.cycleId
          }
        }
      }).then((cycle) => {
        if(cycle.data?.cycle){
          resetForm(calcFormDefaultsForExistingCycle(cycle.data));
          if(cycleEdits){
            if(!lodash.isNil(cycleEdits.completed)){
              setFormValue('completed', cycleEdits.completed, {shouldDirty: true})
            }
            lodash.forEach(cycleEdits.bossesCompleted, (bossCompletionRecord, bossInstanceId) => {
              setFormValue(`bossesCompleted.${bossInstanceId}.completed`, bossCompletionRecord.completed, {shouldDirty: true})
            })
          }
          setFormDefaultValuesSet(true);
        }
      }).catch((error: unknown) => {
        if(lodash.isObject(error) && "name" in error && error.name === 'AbortError'){
          //do nothing
        }
        else{
          throw error;
        }
      })
    }
  }, [
      existingCycle, 
      getCycleInfo, 
      params.cycleId, 
      cycleInfoQueryCalled,
      resetForm,
      calcFormDefaultsForExistingCycle,
      setFormValue,
      cycleEdits
    ])


  useEffect(() => {
    if( !runLoading && !existingCycle && !createdCycle){
      console.error('Cycle missing');
    }
  }, [createdCycle, existingCycle, runLoading])

  useEffect(() => {
    if(createdCycle && cycleEdits){
      console.error('Form state error. Redux save was performed incorrectly')
    }
  }, [createdCycle, cycleEdits])






  //TODO make this into a generic function in the future
  const getDirtyFieldValues = useCallback<() => Partial<EditRunFormCycle>>(() => {
    const formValues = getFormValues();
    const bossesCompleted: Record<string, EditRunFormBossCompletion>  = {};
    lodash.forEach(dirtyFields.bossesCompleted ?? {}, (value, key) => {
      if(value.completed){ //values are whether the field is dirty or not
        bossesCompleted[key] = {
          instanceId: key,
          completed: formValues.bossesCompleted[key].completed
        }
      }
    })

    return {
      completed: dirtyFields.completed ? formValues.completed : undefined,
      bossesCompleted: bossesCompleted,
    }

  }, [dirtyFields, getFormValues])



  const onBackClick = useCallback(() => {
    if(!existingCycle){
      const formValues = getFormValues();
      dispatch(editRunFormSlice.setCreatedCycle(formValues))
    }
    else if(isDirty){
      const edits = {
        id: params.cycleId,
        ...getDirtyFieldValues(),
      }
      dispatch(editRunFormSlice.setEditedCycle({
        ...edits,
        bossesCompleted: edits.bossesCompleted ?? {}
      }))
    }
  }, [existingCycle, 
    dispatch, 
    getFormValues,
    isDirty,
    params,
    getDirtyFieldValues
  ])

  const pageError = useMemo(() => {
    const errors = lodash.compact([cycleInfoError, runError]);
    if(errors.length > 0){
      return errors[0];
    } else{
      return undefined;
    }
  }, [runError, cycleInfoError])

  const {context: pageErrorContext} = usePageError({error: pageError})


  return (
    <PageErrorMessengerContext value={pageErrorContext}>
      <BasicPageLayout
        title={
          <RunPageTitle 
            gameName={cleanedRunData?.run?.game?.name ?? ''} 
            titleText={cleanedRunData?.run?.name ?? ""} />
        }
        loading={runLoading || cycleInfoLoading}
      >
      <div className="flex">
        <CyclePageBackButton
          href={`/user/${params.userId}/runs/${params.runId}/edit`}
          onClick={onBackClick}
        />
      </div>
      <Row>
        <CyclePageCycleLabel cycle={formDefaultValues.level}/>
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
        cleanedRunData?.run?.game && (
          <BossCompletionCard<EditRunFormCycle>
            gameInfo={cleanedRunData.run.game}
            control={control}
            loading={!formDefaultValuesSet}
          />
        )
      }
      </BasicPageLayout>
    </PageErrorMessengerContext>
  )
}