import { CreateRunFormData } from "@/app/user/[userId]/runs/create/page";
import type { CycleListCycle } from "@/components/CycleList";


import { useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import { useCallback, useMemo } from "react";
import {isNil} from 'lodash';


interface FormCycleListProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CreateRunFormData, any, CreateRunFormData>
}

export function useFormCycles({control}: FormCycleListProps){
    //be careful. useFieldArray adds its own id. What will happen if we pass in data that already has an id?
  const {fields, append, remove} = useFieldArray({
    control: control,
    name: "cycles"
  })

  const onAddCycle = useCallback(() => {
    append({
      completed: false,
      bossesCompleted: [],
      level: fields.length //levels start at 0
    })
  }, [append, fields.length])

  const onDeleteCycle = useCallback(() => {
    remove(fields.length - 1);
  }, [fields.length, remove])

  const cycles = useMemo<CycleListCycle[]>(() => {
    return fields.map<CycleListCycle>((cycle) => {
      if(isNil(cycle.level)){
        throw new Error("ImplementationError. CycleListCycle: cycles should always have a level")
      }

      return {
        level: cycle.level,
        completed: cycle.completed,
      }
    })
  }, [fields])

  return {
    onAddCycle,
    onDeleteCycle,
    cycles
  }
}