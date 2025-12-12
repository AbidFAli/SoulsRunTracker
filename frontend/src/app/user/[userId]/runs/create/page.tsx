'use client'
import type { RunDescriptionEditorProps } from "@/components/RunDescriptionEditor/index";
import type { GetGameInformationQueryVariables } from "@/generated/graphql/graphql";
import { CreateRunDocument, GetGameInformationDocument } from "@/generated/graphql/graphql";
import { useMounted } from "@/hooks/useMounted";
import { ABBREVIATION_TO_GAME } from "@/util/gameAbbreviation";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button, Col, Divider, Input, Row, Space, Typography } from "antd";
import dynamic from "next/dynamic";
import type Quill from "quill";
import React, { use, useCallback, useContext, useMemo, useRef } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from 'react-hook-form';
import { AppContext } from "@/state/appContext";
import { ZRunCreatePageUrlSearchParams} from "@/util/routing"
const { Title} = Typography;

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
  

  return <div className="lg:mx-64">
    <Row>
      <Col span= {8}>
        <Title className="inline w-lg">Create your run</Title>
      </Col>
      <Col offset={8} span={8} >
        <div className="w-full flex justify-end">
          <Title className="inline text-right w-full">{gameName}</Title>
        </div>
      </Col>
    </Row>
    
    <form className="bg-card p-6 rounded-lg">
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
      <Divider />
      <Title level={2} >Character</Title>
      <Divider />
      <Title level={2}>Boss Completion</Title>
      <Button onClick={onSaveClick}>Save</Button>
      
    </form>

    
    


    
  </div>
}