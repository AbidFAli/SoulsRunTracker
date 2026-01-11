export interface EditRunFormData{
  id: string;
  name?: string;
  completed?: boolean;
  cycles: EditRunFormCycle[];
}

export interface EditRunFormCycle{
  id: string; //this may be a client generated id
  level: number; 
  completed: boolean;
  bossesCompleted: Record<string, EditRunFormBossCompletion>; //map BossInstance.id to BossCompletion
}

export interface EditRunFormBossCompletion{
  id?: string;
  completed: boolean;
  instanceId: string;
}

