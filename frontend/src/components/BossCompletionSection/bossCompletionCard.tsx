import { 
  GameInfoFragment, 
  RunPageDetailedCycleFragment} from "@/generated/graphql/graphql";
import {  Spin } from "antd";
import { compact } from "lodash";
import { useMemo } from "react";
import { RunPageListCard } from "../RunPageListCard";
import { LocationCompletion, LocationCompletionProps } from "./locationCompletion";


export interface BossCompletionCardProps{
  gameInfo: GameInfoFragment;
  cycle: RunPageDetailedCycleFragment;
  loading?: boolean;
}
export function BossCompletionCard({gameInfo, cycle, loading}: BossCompletionCardProps){
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

  if(loading){
    return <RunPageListCard>
      <div className="h-96">
        <Spin spinning={true} size="large" className='left-1/2 top-1/2 -translate-x-1/2  '/>
      </div>
    </RunPageListCard>
  }

  return (
    <RunPageListCard>
      <div className="flex flex-col">
        {content}
      </div>
    </RunPageListCard>

  )
}

