import { GameInfoFragment, RunPageCycleFragment, RunPageDetailedCycleFragment } from "@/generated/graphql/graphql";
import { BossCompletionCard } from "./bossCompletionCard";

import { Select } from "antd";
import { useCallback, useMemo } from "react";

interface BossCompletionSectionProps{
  gameInfo: GameInfoFragment;
  currentCycle: RunPageDetailedCycleFragment;
  cycles: RunPageCycleFragment[];
  onChangeCycle: (cycle: RunPageCycleFragment) => void;
  loading?: boolean;
}

export function BossCompletionSection({
  gameInfo,
  currentCycle,
  cycles,
  onChangeCycle,
  loading
}: BossCompletionSectionProps){

  const cycleOptions = useMemo(() => {
    return cycles.map((cycle) => ({value: cycle.id, label: `NG+${cycle.level}`}))
  }, [cycles])

  const onCycleSelected = useCallback((cycleId: string) => {
    const selectedCycle = cycles.find((cycle) => cycle.id === cycleId);
    if(selectedCycle){
      onChangeCycle(selectedCycle)
    }
    else{
      console.log(`BossCompletionSection something went wrong. No cycle found for cycleId=${cycleId}`)
    }
  }, [cycles, onChangeCycle])

  return (
    <div className="flex flex-col gap-6">
      <Select<string>
        value={currentCycle.id}
        style={{width: '120px'}}
        onChange={onCycleSelected}
        options={cycleOptions}
      />
      <BossCompletionCard
        cycle={currentCycle}
        gameInfo={gameInfo}
        loading={loading}
      />
    </div>
  )
}