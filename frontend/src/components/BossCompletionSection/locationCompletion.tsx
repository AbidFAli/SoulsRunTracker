import { 
  GameInfoLocationFragment, 
  GameInfoBossInstanceFragment, 
  } from "@/generated/graphql/graphql";
import { CreateRunFormBossCompletion, CreateRunFormCycle } from "@/state/runs/createRunForm/createRunFormSlice";

import { List, Typography, Checkbox, Space } from "antd";
import type { CheckboxChangeEvent } from "antd";
import React, { useCallback, useMemo } from "react";
import { Controller, type Control } from "react-hook-form";
import lodash from 'lodash';
import { FormCheckbox } from "../Form/formCheckbox";


const { Title} = Typography;
const { Item: ListItem} = List;

export interface LocationCompletionProps{
  location: GameInfoLocationFragment;
  bossInstances: GameInfoBossInstanceFragment[];
  bossesCompleted?: CreateRunFormCycle["bossesCompleted"];
  control?: Control<CreateRunFormCycle>;
}

function locationCompletionRowKey(row: GameInfoBossInstanceFragment){
  return row.id;
}

export function LocationCompletion({
  location, 
  bossInstances, 
  bossesCompleted,
  control
}: LocationCompletionProps){



  const renderListItem = useCallback((row: GameInfoBossInstanceFragment) => {
    const completed = bossesCompleted?.[row.id] ? bossesCompleted[row.id]?.completed as boolean : false;

    let checkbox: React.ReactNode;
    if(control){
      checkbox = (
        <FormCheckbox
          controllerProps={{
            control,
            name: `bossesCompleted.${row.id}.completed`
          }}
        />
      )
    }
    else{
      checkbox = (
        <Checkbox checked={completed}/>
      )
    }


    return <ListItem>
      <Space>
        {checkbox}
        <Typography>{row?.boss?.name ?? ""}</Typography>  
      </Space>
    </ListItem>
  }, [bossesCompleted, control])




  return <div>
    <List<GameInfoBossInstanceFragment>
      header={<Title level={3} >{location.name ?? ""}</Title>}
      dataSource={bossInstances}
      renderItem={renderListItem}
      rowKey={locationCompletionRowKey}
    >
    </List>
  </div>
}