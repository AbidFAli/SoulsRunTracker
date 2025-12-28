'use client'

import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Button, Col, Input, Row, Space } from "antd";
import dynamic from "next/dynamic";
import type Quill from "quill";
import React, { use, useCallback, useContext, useMemo, useRef, useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import lodash from 'lodash';

import { ABBREVIATION_TO_GAME } from "@/util/gameAbbreviation";
import type { RunDescriptionEditorProps } from "@/components/RunDescriptionEditor/index";
import type { GetGameInformationQueryVariables } from "@/generated/graphql/graphql";
import { CreateRunDocument, GetGameInformationDocument } from "@/generated/graphql/graphql";
import { useMounted } from "@/hooks/useMounted";
import { ZRunCreatePageUrlSearchParams} from "@/util/routing"
import { RunPageTitle } from "@/components/RunPageTitle";
import { RunPageLayout } from "@/components/RunPageLayout";
import { FormInput } from "@/components/Form/formInput";
import { RunNameInput } from "@/components/RunForm";
import { BasicPageLayoutContext } from "@/components/BasicPageLayout/context";

const RunDescriptionEditor: React.ComponentType<RunDescriptionEditorProps> = dynamic(() => import('../../../../../components/RunDescriptionEditor/index'), {
  ssr: false,
  loading: () => <p>loading...</p>
});

const {Compact: CompactSpace} = Space;

interface CreateRunFormData{
  name?: string;
}




export default function CreateRunPage(props: PageProps<'/user/[userId]/runs/create'>){
  
  const router = useRouter();
  const params = use(props.params);
  const searchParams = use(props.searchParams);
  
  const parsedSearchParams = useMemo(() => {
    return ZRunCreatePageUrlSearchParams.parse(searchParams);
  }, [searchParams])

  const gameName = useMemo(() => {
    return ABBREVIATION_TO_GAME.get(parsedSearchParams.game) ?? ""
  }, [parsedSearchParams.game])

  const getGameInfoQueryVars = useMemo<GetGameInformationQueryVariables>(() => {
    return {
      where: {
        name: gameName
      }
    }
  }, [gameName])

  const {handleGraphqlError, setError: setPageError} = useContext(BasicPageLayoutContext);

  const {data: gameData, loading: gameDataLoading, error: gameDataError} = useQuery(GetGameInformationDocument, {variables : getGameInfoQueryVars});
  const [createRunMutation, {data, loading, error: createRunError}] = useMutation(CreateRunDocument);

  const mounted = useMounted();
  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill| null>(null);


  useEffect(() => {
    const errors = lodash.compact([gameDataError, createRunError]);
    if(errors.length > 0){
      handleGraphqlError(errors[0]);
    } else{
      setPageError(undefined);
    }
  }, [createRunError, gameDataError, handleGraphqlError, setPageError])

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors: formErrors },
    reset
  } = useForm<CreateRunFormData>()

  const onSubmit = useCallback<SubmitHandler<CreateRunFormData>>((formData) => {
    if(formData.name && gameData?.game?.id){
      createRunMutation({
        variables: {
          input: {
            name: formData.name,
            userId: params.userId,
            gameId: gameData?.game?.id
          }
        },
        onCompleted(runMutationReturnData) {
          if(runMutationReturnData.createRun){
            router.push(`/user/${params.userId}/runs/${runMutationReturnData.createRun?.id}`)
          }
        },
        onError(gqlError) {
          console.log(gqlError);
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
      <Space>
        <Button onClick={onSaveClick}>Save</Button>
        <Button onClick={onResetClick}>Reset</Button>
      </Space>
      
    )
  }, [onSaveClick, onResetClick])

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

  return <RunPageLayout 
    title={title} 
    formProps={formProps}
    footer={footer}
    summaryBlock={summaryBlock}
    />


      
}