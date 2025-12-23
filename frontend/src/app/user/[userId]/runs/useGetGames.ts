"use client"
import { GetGamesDocument } from '@/generated/graphql/graphql';
import { useQuery } from "@apollo/client/react";

import { useMemo, useCallback } from 'react';

import { Unnullified } from '@/util/types';


export interface GamesData{
  id: string;
  name?: string;
}

export function useGetGames(){
    const {loading, data: gamesData, error} = useQuery(GetGamesDocument);

    const cleanedGamesData = useMemo<GamesData[]>(() => {
      if(gamesData?.games){
        return gamesData?.games as Unnullified<typeof gamesData.games>
      }
      return []
    }, [gamesData])

    const nameIdMap = useMemo<Map<string, string>>(() => {
      return new Map<string, string>(
        cleanedGamesData.map((gameData) => [gameData.name ?? "", gameData.id])
      );
    }, [cleanedGamesData])
    
    const idNameMap = useMemo<Map<string, string>>(() => {
      return new Map<string, string>(
        cleanedGamesData.map((gameData) => [gameData.id, gameData.name ?? "",])
      );
    }, [cleanedGamesData])

    const gameNameToId = useCallback((name: string) => {
      return nameIdMap.get(name)
    }, [nameIdMap])

    const gameIdToName = useCallback((id: string) => {
      return idNameMap.get(id)
    }, [idNameMap]);
  

    return {
      loading,
      data: cleanedGamesData,
      gameNameToId,
      gameIdToName,
      error
    }
}