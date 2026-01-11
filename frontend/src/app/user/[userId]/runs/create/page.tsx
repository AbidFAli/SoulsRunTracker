'use client'

import { useMutation, useQuery } from "@apollo/client/react";
import {  Button, Space, Spin } from "antd";
import dynamic from "next/dynamic";
import type Quill from "quill";
import React, { use, useCallback,  useMemo, useRef,  } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from 'react-hook-form';
import { useRouter, usePathname } from "next/navigation";
import lodash from 'lodash';

import { ABBREVIATION_TO_GAME } from "@/util/gameAbbreviation";
import type { RunDescriptionEditorProps } from "@/components/RunDescriptionEditor/index";
import { 
  CreateRunDocument, 
  GetGameInformationDocument, 
  CycleCreateWithoutRunInput,
  BossCompletionUpsertWithoutCycleInput,
} from "@/generated/graphql/graphql";
import { useMounted } from "@/hooks/useMounted";
import { ZRunCreatePageUrlSearchParams} from "@/util/routing"
import { RunPageTitle } from "@/components/RunPageTitle";
import { RunPageLayout } from "@/components/RunPageLayout";
import { RunNameInput } from "@/components/RunForm";
import { PageErrorMessengerContext } from "@/hooks/pageError/context";
import { usePageError } from "@/hooks/pageError/usePageError";
import { CycleList } from "@/components/CycleList";
import { useFormCycles } from "./useFormCycles";
import type { CreateRunFormData } from "./useFormCycles";
import { useAppDispatch, useAppSelector } from "@/state/hooks"
import * as createRunFormSlice from '@/state/runs/createRunForm/createRunFormSlice'
import * as apolloQueryCacheKeySlice from "@/state/runs/apolloQueryCacheKey"

const RunDescriptionEditor: React.ComponentType<RunDescriptionEditorProps> = dynamic(() => import('../../../../../components/RunDescriptionEditor/index'), {
  ssr: false,
  loading: () => <p>loading...</p>
});







export default function CreateRunPage(props: PageProps<'/user/[userId]/runs/create'>){
  const params = use(props.params);
  const searchParams = use(props.searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();


  
  const parsedSearchParams = useMemo(() => {
    return ZRunCreatePageUrlSearchParams.parse(searchParams);
  }, [searchParams])

  const gameName = useMemo(() => {
    return ABBREVIATION_TO_GAME.get(parsedSearchParams.game) ?? ""
  }, [parsedSearchParams.game])

  const {data: gameData, loading: gameDataLoading, error: gameDataError} = useQuery(GetGameInformationDocument, 
    {
      variables : {
        where: {
          name: gameName
        }
      }
    }
  );
  
  const runsQueryCacheKeys = useAppSelector(apolloQueryCacheKeySlice.selectRunsQueryCacheKeys);
  const [createRunMutation, {loading: createRunLoading, error: createRunError}] = useMutation(CreateRunDocument, {
    update(cache){
      cache.batch({
        update(batchedCache) {
          for(const key of runsQueryCacheKeys){
            batchedCache.evict({id: 'ROOT_QUERY', fieldName: key })
          }
          batchedCache.gc();
        },
      })
      dispatch(apolloQueryCacheKeySlice.resetGetUserRuns())
    }
  });

  const mounted = useMounted();
  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill| null>(null);


  const pageError = useMemo(() => {
    const errors = lodash.compact([gameDataError, createRunError]);
    if(errors.length > 0){
      return errors[0];
    } else{
      return undefined;
    }
  }, [gameDataError, createRunError])

  const {context: pageErrorContext} = usePageError({error: pageError})


  const savedFormData = useAppSelector(createRunFormSlice.selectAll);
  const defaultFormValues = useMemo<CreateRunFormData>(() => {
    return {
      name: savedFormData.name,
      cycles: [...savedFormData.cycles]
    }
  }, [savedFormData])
  

  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    reset,
    getValues: getFormValues
  } = useForm<CreateRunFormData>({
    defaultValues: defaultFormValues
  });

  const {
    cycles,
    onAddCycle,
    onDeleteCycle,
  } = useFormCycles({control});

  const onSubmit = useCallback<SubmitHandler<CreateRunFormData>>((formData) => {
    if(formData.name && gameData?.game?.id){
      createRunMutation({
        variables: {
          input: {
            name: formData.name,
            cycles: formData.cycles.map<CycleCreateWithoutRunInput>((cycle) => {
              return {
                completed: cycle.completed,
                level: cycle.level,
                bossesCompleted: {
                  upsert: Object.keys(cycle.bossesCompleted).map<BossCompletionUpsertWithoutCycleInput>((instanceId) => {
                    const bossCompletion = cycle.bossesCompleted[instanceId];
                    return {
                      instanceId,
                      completed: bossCompletion.completed
                    }
                  })
                }
              }
            }),
            userId: params.userId,
            gameId: gameData?.game?.id
          },
        },
        onCompleted(runMutationReturnData) {
          if(runMutationReturnData.createRun){
            router.push(`/user/${params.userId}/runs/${runMutationReturnData.createRun?.id}`)
          }
        },
        onError(gqlError) {
          console.error(gqlError);
        },
      });
    }

  }, [
    params.userId, 
    createRunMutation, 
    gameData?.game?.id, 
    router
  ]);

  const onSaveClick= useCallback((e: React.BaseSyntheticEvent) => {
    handleSubmit(onSubmit)(e);
  }, [handleSubmit, onSubmit])
  
  const title = useMemo(() => {
    return <RunPageTitle gameName={gameName} titleText="Create your run" />
  }, [gameName])
  
  const onResetClick = useCallback(() => {
    reset();
  }, [reset])
  const footer = useMemo(() => {
    return (
      <div>
        {createRunLoading && <Spin size="large" fullscreen={true}/> }
        <Space>
          <Button onClick={onSaveClick}>Save</Button>
          <Button onClick={onResetClick}>Reset</Button>
        </Space>
      </div>      
    )
  }, [onSaveClick, onResetClick, createRunLoading])

  const summaryBlock = useMemo(() => {
    return (
      <Space orientation="vertical" className="w-full" size="middle">
        <RunNameInput<CreateRunFormData>
          control={control}
        />
        {mounted && <RunDescriptionEditor ref={quillRef} readOnly={false}   /> }
      </Space>
    )
  }, [control, mounted])

  const formProps = useMemo(() => {
    return {};
  }, [])

  const saveFormDataInRedux = useCallback(() => {
    const values = getFormValues();
    dispatch(createRunFormSlice.setAll({
      ...values,
      gameName,
    }))
  }, [getFormValues, dispatch, gameName])

  const cycleBlock = useMemo(() => {
    return (
      <CycleList 
        cycles={cycles}
        onCycleClick={(cycle) => {
          saveFormDataInRedux();
          router.push(pathname+`/cycle/${cycle.level}`)
        }}
        editable={true}
        onAddCycle={onAddCycle}
        onDeleteCycle={onDeleteCycle}
      />
    )
  }, [
      cycles, 
      onAddCycle, 
      onDeleteCycle, 
      saveFormDataInRedux,
      pathname,
      router
    ])

  


  return (
    <PageErrorMessengerContext value={pageErrorContext}>
      <RunPageLayout 
        title={title} 
        formProps={formProps}
        footer={footer}
        summaryBlock={summaryBlock}
        cyclesBlock={cycleBlock}
        loading={gameDataLoading}
        />
    </PageErrorMessengerContext>
  )      
}