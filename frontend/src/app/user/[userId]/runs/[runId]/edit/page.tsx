"use client"

import { RunPageLayout } from "@/components/RunPageLayout";
import { RunPageTitle } from "@/components/RunPageTitle";
import { GetRunDocument, UpdateUserRunDocument } from "@/generated/graphql/graphql";
import { RunNameInput } from "@/components/RunForm";
import { unnullify } from "@/util/graphql";
import { BasicPageLayoutContext } from "@/components/BasicPageLayout/context";

import { useMutation, useQuery } from "@apollo/client/react";
import { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from "react-hook-form";
import { Button, Checkbox, Col, Row, Space, Typography } from "antd";
import lodash from 'lodash';

interface EditRunFormData{
  name?: string;
  completed?: boolean;
}

export default function EditRunPage(props: PageProps<'/user/[userId]/runs/[runId]/edit'>){
  const params = use(props.params);

  const {handleGraphqlError, setError: setPageError} = useContext(BasicPageLayoutContext);
  
  

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

  const defaultFormValues = useMemo<EditRunFormData>(() => {
    return {
      name: cleanedRunData?.run?.name,
      completed: cleanedRunData?.run?.completed,
    }
  }, [cleanedRunData])

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors: formErrors },
    setValue,
    reset
  } = useForm<EditRunFormData>({defaultValues: defaultFormValues});

  useEffect(() => {
    if(cleanedRunData?.run){
      reset(defaultFormValues);
    }
  }, [cleanedRunData, defaultFormValues, reset])

  const [updateRun, {error: updateRunError, loading: updateRunLoading}] = useMutation(UpdateUserRunDocument)

  useEffect(() => {
    const errors = lodash.compact([updateRunError, runError]);
    if(errors.length > 0){
      handleGraphqlError(errors[0]);
    } else{
      setPageError(undefined);
    }
  }, [handleGraphqlError, runError, setPageError, updateRunError])
  
  
  const title = useMemo(() => {
    return <RunPageTitle gameName={runData?.run?.game?.name ?? ""} titleText={runData?.run?.name ?? ""} />
  }, [runData])

  const summaryBlock = useMemo(() => {
    return (
      <Space orientation="vertical" className="w-full" size="middle">
        <RunNameInput<EditRunFormData>
          control={control}
        />
        <Controller
          name="completed"
          control={control}
          render={({field}) => {
            return (
              <Row>
                <Col span={2}>
                  <Row justify={"space-between"}>
                    <Typography>Completed</Typography>
                    <Checkbox
                      {...(lodash.omit(field, 'value'))}
                      checked={field.value}
                    />
                  </Row>
                </Col>
              </Row>
            )
          }}
        />
      </Space>
    )
  }, [control])

  const onSubmit = useCallback<SubmitHandler<EditRunFormData>>((formData) => {
    updateRun({
      variables: {
        where: {
          id : params.runId
        },
        data: {
          ...formData
        }
      },
      refetchQueries: [GetRunDocument]
    })
  }, [params, updateRun])

  const onSaveClick= useCallback((e: React.BaseSyntheticEvent) => {
    handleSubmit(onSubmit)(e);
  }, [handleSubmit, onSubmit]);
  
  const onResetClick = useCallback(() => {
    reset();
  }, [reset])

  const footer = useMemo(() => {
      return (
        <Space>
          <Button onClick={onSaveClick}>Save</Button>
          <Button onClick={onResetClick}>Reset</Button>
        </Space>
      )
  }, [onSaveClick, onResetClick]);



  const formProps = useMemo(() => {
    return {}
  }, [])



  return <RunPageLayout
    title={runLoading ? undefined : title}
    summaryBlock={summaryBlock}
    loading={runLoading || updateRunLoading}
    footer={footer}
    formProps={formProps}
  />
}