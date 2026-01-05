import { 
  GameInfoFragment, 
  RunPageDetailedCycleFragment} from "@/generated/graphql/graphql";
import {  Spin } from "antd";
import { compact } from "lodash";
import { useMemo } from "react";
import { RunPageListCard } from "../RunPageListCard";
import { LocationCompletion, LocationCompletionProps } from "./locationCompletion";
import { CreateRunFormBossCompletion, CreateRunFormCycle } from "@/state/runs/createRunForm/createRunFormSlice";
import type { Control } from "react-hook-form";



export interface BossCompletionCardProps{
  gameInfo: GameInfoFragment;
  bossesCompleted?: CreateRunFormCycle["bossesCompleted"];
  loading?: boolean;
  onBossCompletionClick?: (completion: CreateRunFormBossCompletion) => void;
  control?: Control<CreateRunFormCycle>;
}

export function BossCompletionCard({
  gameInfo, 
  bossesCompleted, 
  loading,
  onBossCompletionClick,
  control
}: BossCompletionCardProps){



  const locationCompletionProps = useMemo<LocationCompletionProps[]>(() => {
    return compact((gameInfo?.gameLocations ?? []).map<LocationCompletionProps | undefined>((gameLocation) => {
      if(!gameLocation.location){
        return undefined;
      }
      return {
        location: gameLocation.location,
        bossInstances: gameLocation.bossInstances ?? [],
        bossesCompleted: bossesCompleted,
        onBossCompletionClick: onBossCompletionClick,
        control: control
      }
    }))
  }, [
    gameInfo, 
    bossesCompleted, 
    onBossCompletionClick,
    control
  ]);

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

