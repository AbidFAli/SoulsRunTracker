import { 
  GameInfoLocationFragment, 
  GameInfoBossInstanceFragment, 
  RunPageBossCompletionFragment,
  } from "@/generated/graphql/graphql";
import { List, Typography, Checkbox, Space } from "antd";
import { useCallback, useMemo } from "react";

const { Title} = Typography;
const { Item: ListItem} = List;

export interface LocationCompletionProps{
  location: GameInfoLocationFragment;
  bossInstances: GameInfoBossInstanceFragment[];
  bossesCompleted: RunPageBossCompletionFragment[];
}

function locationCompletionRowKey(row: GameInfoBossInstanceFragment){
  return row.id;
}

export function LocationCompletion({location, bossInstances, bossesCompleted}: LocationCompletionProps){

  const bossCompletionMap = useMemo<Map<string, RunPageBossCompletionFragment>>(() => {
    const returnValue = new Map<string, RunPageBossCompletionFragment>();
    bossesCompleted.forEach((bossCompletion) => {
      returnValue.set(bossCompletion.instanceId, bossCompletion)
    })
    return returnValue;
  }, [bossesCompleted])

  const renderListItem = useCallback((row: GameInfoBossInstanceFragment) => {
    const completed = bossCompletionMap.has(row.id) ? (bossCompletionMap.get(row.id)?.completed as boolean) : false;

    return <ListItem>
      <Space>
        <Checkbox checked={completed}/>
        <Typography>{row?.boss?.name ?? ""}</Typography>  
      </Space>
    </ListItem>
  }, [bossCompletionMap])




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