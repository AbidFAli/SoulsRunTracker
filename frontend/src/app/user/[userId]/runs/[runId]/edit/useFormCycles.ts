import type { EditRunFormData} from './types'
import type { CycleListCycle } from "@/components/CycleList";


import { useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import { useCallback, useMemo } from "react";
import {isNil, uniqueId} from 'lodash';



interface UseEditRunFormCyclesProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<EditRunFormData, any, EditRunFormData>
  disabled?: boolean;
}

export function useEditRunFormCycles({control, disabled}: UseEditRunFormCyclesProps){
  const {fields, append, remove} = useFieldArray({
    control: control,
    name: "cycles",
    keyName: "key",
  })

  const onAddCycle = useCallback(() => {
    if(!disabled){
      append({
        id: uniqueId(),
        completed: false,
        bossesCompleted: {},
        level: fields.length //levels start at 0
      })
    }

  }, [append, fields.length, disabled])

  const onDeleteCycle = useCallback(() => {
    if(!disabled){
      remove(fields.length - 1);
    }
  }, [fields.length, remove, disabled])

  const cycles = useMemo<CycleListCycle[]>(() => {
    return fields.map<CycleListCycle>((cycle) => {
      if(isNil(cycle.level)){
        throw new Error("ImplementationError. CycleListCycle: cycles should always have a level")
      }

      return {
        id: cycle.id,
        level: cycle.level,
        completed: cycle.completed,
      }
    })
  }, [fields])

  return {
    onAddCycle,
    onDeleteCycle,
    cycles,
  }
}