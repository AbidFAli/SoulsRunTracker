"use client"
import { useMutation, useQuery } from "@apollo/client/react";
import { use, useCallback, useEffect, useMemo } from "react";
import {useForm } from 'react-hook-form';
import type { SubmitHandler } from "react-hook-form";
import { Button, Col, Row, Space, Typography } from "antd";
import lodash from 'lodash';
import { useRouter, usePathname } from "next/navigation";


import { RunPageLayout } from "@/components/RunPageLayout";
import { RunPageTitle } from "@/components/RunPageTitle";
import { BossCompletionUpsertWithoutCycleInput, CycleCreateWithoutRunInput, CycleUpdateWithoutRunInput, GetRunDocument, RunPageCycleFragment, RunUpdateCycleOptions, UpdateUserRunDocument } from "@/generated/graphql/graphql";
import { RunNameInput } from "@/components/RunForm";
import { unnullify } from "@/util/graphql";
import { PageErrorMessengerContext } from "@/hooks/pageError/context";
import { usePageError } from "@/hooks/pageError/usePageError";
import { FormCheckbox } from "@/components/Form/formCheckbox";
import { CycleList } from "@/components/CycleList";
import { EditRunFormCycle, EditRunFormData } from "./types";
import { useEditRunFormCycles } from "./useFormCycles";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import * as editRunFormSlice from "@/state/runs/editRunFormSlice"
import * as apolloQueryCacheKeySlice from "@/state/runs/apolloQueryCacheKey"



function applyCycleEditToRunPageCycleFragment(edit: editRunFormSlice.EditRunFormGlobalDataEditCycle, gqlCycle: RunPageCycleFragment): EditRunFormCycle {
  return {
    id: gqlCycle.id,
    completed: edit.completed ?? gqlCycle.completed,
    level: gqlCycle.level ?? 0,
    bossesCompleted: edit.bossesCompleted,
  }
}

function cycleAscendingComparator(a: EditRunFormCycle, b: EditRunFormCycle){
  return a.level - b.level
}



export default function EditRunPage(props: PageProps<'/user/[userId]/runs/[runId]/edit'>){
  const params = use(props.params);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const savedFormData = useAppSelector(editRunFormSlice.selectAll);

  
  

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

  const createDefaultFormValuesNoRedux = useCallback<() => EditRunFormData>(() => {

    const cycles = (cleanedRunData?.run?.cycles ?? []).map<EditRunFormCycle>((cycle) => {
      if(cycle.level === undefined){
        throw new Error("Cycle level missing")
      }

      return {
        ...cycle,
        level: cycle.level as number,
        bossesCompleted: {}
      }
    });

    const returnValue: EditRunFormData = {
      id: cleanedRunData?.run?.id ?? "",
      name: cleanedRunData?.run?.name,
      completed: cleanedRunData?.run?.completed,
      cycles: cycles,
    }

    cycles.sort(cycleAscendingComparator)

    return returnValue;


  }, [cleanedRunData])

  const defaultFormValues = useMemo<EditRunFormData>(() => {

    if(!savedFormData.id){
      return createDefaultFormValuesNoRedux()
    }
    else{
      let cycles: EditRunFormCycle[] = [];

      if(cleanedRunData?.run?.cycles){
        cycles = savedFormData.cycles.map<EditRunFormCycle>((cycleId) => {
          if(savedFormData.createdCycles[cycleId]){
            return savedFormData.createdCycles[cycleId]
          }
          else if(savedFormData.editedCycles[cycleId]){
            const existingCycle = cleanedRunData?.run?.cycles?.find((cycle) => cycle.id === cycleId);
            if(!existingCycle){
              throw new Error("this should not happen");
            }

            return applyCycleEditToRunPageCycleFragment(savedFormData.editedCycles[cycleId], existingCycle);

          }
          else{
            const existingCycle = cleanedRunData?.run?.cycles?.find((cycle) => cycle.id === cycleId);
            if(!existingCycle){
              throw new Error("this should not happen");
            }

            if(lodash.isNil(existingCycle.level)){
              console.error('existing cycle is mising the field level');
            }

            return {
              ...existingCycle,
              level: existingCycle.level ?? 0,
              bossesCompleted: {},
            };
          }
        })
      }

      const returnValue: EditRunFormData = {
        ...lodash.pick(savedFormData, ['id', 'name', 'completed']),
        cycles,
      }
      returnValue.cycles.sort(cycleAscendingComparator)
      return returnValue
    }
  }, [
    cleanedRunData, 
    savedFormData,
    createDefaultFormValuesNoRedux
  ])

  const formDisabled = useMemo<boolean>(() => !!runError, [runError])

  const {
    getValues: getFormValues,
    handleSubmit,
    control,
    reset
  } = useForm<EditRunFormData>({defaultValues: defaultFormValues, disabled: formDisabled});

  useEffect(() => {
    if(cleanedRunData?.run){
      reset(defaultFormValues);
    }
  }, [cleanedRunData, defaultFormValues, reset]);

  const {cycles: cycleListCycles, onAddCycle, onDeleteCycle} = useEditRunFormCycles({control, disabled: formDisabled})

  const runsQueryCacheKeys = useAppSelector(apolloQueryCacheKeySlice.selectRunsQueryCacheKeys);
  const [updateRun, {error: updateRunError, loading: updateRunLoading}] = useMutation(UpdateUserRunDocument,
    {
      update(cache, result, options){
        cache.batch({
          update(batchedCache) {
            for(const key of runsQueryCacheKeys){
              batchedCache.evict({id: 'ROOT_QUERY', fieldName: key })
            }
            //don't need to update the GetRunQuery since this mutation should return a run and update the cache
            options.variables?.data.cycles?.delete?.forEach((cycle) => {
              batchedCache.evict({id: `Cycle:${cycle}`})
            })

            options.variables?.data.cycles?.update?.forEach((cycle) => {
              batchedCache.evict({id: `Cycle:${cycle.id}`})
            })
            
            batchedCache.gc();

          },
        })
        dispatch(apolloQueryCacheKeySlice.resetGetUserRuns())


        //also evict queries for Cycles
      }
    }
  )

  const pageError = useMemo(() => {
    const errors = lodash.compact([updateRunError, runError]);
    if(errors.length > 0){
      return errors[0];
    } else{
      return undefined;
    }
  }, [runError, updateRunError])

  const {context: pageErrorContext} = usePageError({error: pageError})
  
  const formProps = useMemo(() => {
    return {}
  }, [])

  /**
   * Combine form + editRunFormSlice + cleanedRunData to produce the next value for editRunFormSlice
   */
  const createNewFormGlobalData = useCallback(() => {
    const formValues = getFormValues();
    const cyclesInDB = new Set((cleanedRunData?.run?.cycles ?? []).map((existingCycle) => existingCycle.id));
    const cyclesInForm = new Set(formValues.cycles.map((formCycle) => formCycle.id))
    const newFormGlobalData: editRunFormSlice.EditRunFormGlobalData = {
      name: formValues.name,
      completed: formValues.completed,
      cycles: Array.from(cyclesInForm.values()),
      gameName: cleanedRunData?.run?.game?.name ?? "",
      id: cleanedRunData?.run?.id ?? "",
      createdCycles: {...savedFormData.createdCycles},
      editedCycles: {...savedFormData.editedCycles},
    }
    /*
      delete entries from newFormGlobalData.createdCycles/newFormGlobalData.editedCycles 
        if they are no longer in newFormGlobalData.cycles as they have been deleted from the form.
    */
    Object.keys(newFormGlobalData.editedCycles).forEach((cycleId) => {
      if(!cyclesInForm.has(cycleId)){
        delete newFormGlobalData.editedCycles[cycleId];
      }
    })

    Object.keys(newFormGlobalData.createdCycles).forEach((cycleId) => {
      if(!cyclesInForm.has(cycleId)){
        delete newFormGlobalData.createdCycles[cycleId];
      }
    })

    formValues.cycles.forEach((formCycle) => {
      if(cyclesInDB.has(formCycle.id)){
        return;
      }

      if(!newFormGlobalData.createdCycles[formCycle.id]){
        newFormGlobalData.createdCycles[formCycle.id] = {
          ...formCycle,
          level: formCycle.level ?? 0,
        };
      }
    })

    return newFormGlobalData;
  }, [cleanedRunData, getFormValues, savedFormData])


  const onSubmit = useCallback<SubmitHandler<EditRunFormData>>((formData) => {
    const newGlobalFormData = createNewFormGlobalData();
    const cyclesToDelete = lodash.without(cleanedRunData?.run?.cycles?.map(cycle => cycle.id) ?? [],
      ...newGlobalFormData.cycles)

    const cycleUpdateOptions: RunUpdateCycleOptions = {
      delete: cyclesToDelete,
      create: Object.values(newGlobalFormData.createdCycles).map<CycleCreateWithoutRunInput>((cycle) => {
        const upserts = Object.values(cycle.bossesCompleted)
          .map<BossCompletionUpsertWithoutCycleInput>((bossCompletion) => {
              return lodash.omit(bossCompletion, ['id']);
            });

        return {
          level: cycle.level,
          completed: cycle.completed,
          bossesCompleted: upserts.length > 0 ? {upsert: upserts} : undefined,
        }
      }),
      update: Object.values(newGlobalFormData.editedCycles).map<CycleUpdateWithoutRunInput>((cycle) => {
        const upserts = Object.values(cycle.bossesCompleted)
          .map<BossCompletionUpsertWithoutCycleInput>((bossCompletion) => {
              return lodash.omit(bossCompletion, ['id']);
            })

        return {
          id: cycle.id,
          completed: cycle.completed,
          bossesCompleted: upserts.length > 0 ? { upsert: upserts} : undefined,
        }
      })
    }

    updateRun({
      variables: {
        where: {
          id : params.runId
        },
        data: {
          completed: formData.completed ?? undefined,
          name: formData.name ?? undefined,
          cycles: cycleUpdateOptions
        }
      },
      refetchQueries: [GetRunDocument]
    }).then(() => {
      router.push(`/user/${params.userId}/runs/${params.runId}`)
    })
  }, [params, 
    updateRun, 
    createNewFormGlobalData,
    cleanedRunData,
    router
  ])

  const onSaveClick= useCallback((e: React.BaseSyntheticEvent) => {
    handleSubmit(onSubmit)(e);
  }, [handleSubmit, onSubmit]);
  
  const onResetClick = useCallback(() => {
    dispatch(editRunFormSlice.reset())
    reset(createDefaultFormValuesNoRedux());
  }, [reset, dispatch, createDefaultFormValuesNoRedux])

  const cycleBlock = useMemo(() => {
    return (
      <CycleList
        cycles={cycleListCycles}
        onAddCycle={onAddCycle}
        onDeleteCycle={onDeleteCycle}
        editable={true}
        onCycleClick={(cycle) => {
          const newFormGlobalData = createNewFormGlobalData();

          dispatch(editRunFormSlice.setAll(newFormGlobalData))
          router.push(pathname+`/cycle/${cycle.id}`)
        }} 
      /> 
    )
  }, [
    cycleListCycles, 
    onAddCycle, 
    onDeleteCycle, 
    pathname, 
    router,
    dispatch,
    createNewFormGlobalData
  ]);

  const footer = useMemo(() => {
      return (
        <Space>
          <Button onClick={onSaveClick}>Save</Button>
          <Button onClick={onResetClick}>Reset</Button>
        </Space>
      )
  }, [onSaveClick, onResetClick]);

  return (
    <PageErrorMessengerContext value={pageErrorContext}>
      <RunPageLayout
          title={
            runLoading ? 
            undefined : 
            <RunPageTitle gameName={runData?.run?.game?.name ?? ""} titleText={runData?.run?.name ?? ""} />
          }
          summaryBlock={
            <Space orientation="vertical" className="w-full" size="middle">
              <RunNameInput<EditRunFormData>
                control={control}
              />
              <Row>
                <Col span={2}>
                  <Row justify={"space-between"}>
                    <Typography>Completed</Typography>
                    <FormCheckbox
                      controllerProps={{control, name: "completed"}}
                    />
                  </Row>
                </Col>
              </Row>
            </Space>
          }
          loading={runLoading || updateRunLoading}
          footer={footer}
          formProps={formProps}
          cyclesBlock={cycleBlock}
        />
    </PageErrorMessengerContext>
  )

}