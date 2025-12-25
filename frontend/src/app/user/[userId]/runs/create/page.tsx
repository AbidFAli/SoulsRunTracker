'use client'
import type { RunDescriptionEditorProps } from "@/components/RunDescriptionEditor/index";
import type { GetGameInformationQueryVariables } from "@/generated/graphql/graphql";
import { CreateRunDocument, GetGameInformationDocument } from "@/generated/graphql/graphql";
import { useMounted } from "@/hooks/useMounted";
import { ABBREVIATION_TO_GAME } from "@/util/gameAbbreviation";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button, Input, Space } from "antd";
import dynamic from "next/dynamic";
import type Quill from "quill";
import React, { use, useCallback, useMemo, useRef } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from 'react-hook-form';
import { ZRunCreatePageUrlSearchParams} from "@/util/routing"
import { RunPageTitle } from "@/components/RunPageTitle";
import { RunPageLayout } from "@/components/RunPageLayout";

const RunDescriptionEditor: React.ComponentType<RunDescriptionEditorProps> = dynamic(() => import('../../../../../components/RunDescriptionEditor/index'), {
  ssr: false,
  loading: () => <p>loading...</p>
});

interface CreateRunFormData{
  name?: string;
}



export default function CreateRunPage(props: PageProps<'/user/[userId]/runs/create'>){
  // Use a ref to access the quill instance directly
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

  const {data: gameData, loading: gameDataLoading, error: gameDataError} = useQuery(GetGameInformationDocument, {variables : getGameInfoQueryVars});
  const [createRunMutation, {data, loading, error}] = useMutation(CreateRunDocument);

  const mounted = useMounted();
  const quillRef = useRef<Quill| null>(null);



  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors: formErrors },
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
          console.log(`createRunMutation returned ${runMutationReturnData}`)
        },
        onError(gqlError) {
          console.log(gqlError);
        },
      });
    }

  }, [params.userId, createRunMutation, gameData?.game?.id]);

  const onSaveClick= useCallback((e: React.BaseSyntheticEvent) => {
    handleSubmit(onSubmit)(e);
  }, [handleSubmit, onSubmit])
  
  const title = useMemo(() => {
    return <RunPageTitle gameName={gameName} titleText="Create your run" />
  }, [gameName])
  
  const footer = useMemo(() => {
    return (
      <Button onClick={onSaveClick}>Save</Button>
    )
  }, [onSaveClick])

  const summaryBlock = useMemo(() => {
    return (
      <Space orientation="vertical" className="w-full" size="middle">
        <Controller 
          name="name"
          control={control}
          render={({field}) => (
            <Input {...field} placeholder="Enter a name for your run" className="border-white"/>
          )} 
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