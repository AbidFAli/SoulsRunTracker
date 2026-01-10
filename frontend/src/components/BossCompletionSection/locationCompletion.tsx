import { 
  GameInfoLocationFragment, 
  GameInfoBossInstanceFragment, 
  } from "@/generated/graphql/graphql";
import { CreateRunFormBossCompletion, CreateRunFormCycle } from "@/state/runs/createRunForm/createRunFormSlice";

import { List, Typography, Checkbox, Space } from "antd";
import type { CheckboxChangeEvent } from "antd";
import React, { useCallback, useMemo } from "react";
import { Controller, Path, type Control } from "react-hook-form";
import lodash from 'lodash';
import { FormCheckbox } from "../Form/formCheckbox";


const { Title} = Typography;
const { Item: ListItem} = List;

export interface LocationCompletionProps<T extends CreateRunFormCycle = CreateRunFormCycle>{
  location: GameInfoLocationFragment;
  bossInstances: GameInfoBossInstanceFragment[];
  bossesCompleted?: CreateRunFormCycle["bossesCompleted"];
  control?: Control<T>;
}

function locationCompletionRowKey(row: GameInfoBossInstanceFragment){
  return row.id;
}

export function LocationCompletion<T extends CreateRunFormCycle = CreateRunFormCycle>({
  location, 
  bossInstances, 
  bossesCompleted,
  control
}: LocationCompletionProps<T>){



  const renderListItem = useCallback((row: GameInfoBossInstanceFragment) => {
    

    let checkbox: React.ReactNode;
    if(control){
      checkbox = (
        <FormCheckbox
          controllerProps={{
            control,
            name: `bossesCompleted.${row.id}.completed` as Path<T>
          }}
        />
      )
    }
    else{
      const completed = bossesCompleted?.[row.id] ? bossesCompleted[row.id]?.completed as boolean : false;
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