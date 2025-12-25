import { 
  GameInfoFragment, 
  GameInfoLocationFragment, 
  RunPageCycleFragment, 
  GameInfoBossInstanceFragment, 
  RunPageBossCompletionFragment} from "@/generated/graphql/graphql";
import { Card, List, Typography, Checkbox } from "antd";
import { compact } from "lodash";
import { useCallback, useMemo } from "react";

const { Title} = Typography;
const { Item: ListItem} = List;



interface BossCompletionCardProps{
  gameInfo: GameInfoFragment;
  cycle: RunPageCycleFragment;
}
export function BossCompletionCard({gameInfo, cycle}: BossCompletionCardProps){
  const locationCompletionProps = useMemo<LocationCompletionProps[]>(() => {
    return compact((gameInfo?.gameLocations ?? []).map((gameLocation) => {
      if(!gameLocation.location){
        return undefined;
      }
      return {
        location: gameLocation.location,
        bossInstances: compact(gameLocation.bossInstances ?? []),
        bossesCompleted: compact(cycle.bossesCompleted ?? [])
      }
    }))
  }, [gameInfo, cycle]);

  const content = useMemo(() => {
    return locationCompletionProps.map((props) => <LocationCompletion key={props.location.id} {...props} />)
  }, [locationCompletionProps])

  return <Card>
    <div className="flex flex-col max-h-96 max-w-full w-full overflow-y-scroll">
      {content}
    </div>
  </Card>
}

interface LocationCompletionProps{
  location: GameInfoLocationFragment;
  bossInstances: GameInfoBossInstanceFragment[];
  bossesCompleted: RunPageBossCompletionFragment[];
}

function locationCompletionRowKey(row: GameInfoBossInstanceFragment){
  return row.id;
}

function LocationCompletion({location, bossInstances, bossesCompleted}: LocationCompletionProps){

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
      <div className="flex justify-between">
        <Checkbox checked={completed}/>
        <Typography>{row?.boss?.name ?? ""}</Typography>  
      </div>
    </ListItem>
  }, [bossCompletionMap])




  return <div className="pr-2">
    <List<GameInfoBossInstanceFragment>
      header={<Title level={3} >{location.name ?? ""}</Title>}
      dataSource={bossInstances}
      renderItem={renderListItem}
      rowKey={locationCompletionRowKey}
    >
    </List>
  </div>
}