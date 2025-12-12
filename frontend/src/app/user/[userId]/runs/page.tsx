"use client"
import type { GetGamesQuery } from '@/generated/graphql/graphql';
import { GetGamesDocument } from '@/generated/graphql/graphql';
import { GAME_TO_ABBREVIATION } from '@/util/gameAbbreviation';
import { RunCreatePageUrlSearchParams } from '@/util/routing';
import { useQuery } from "@apollo/client/react";
import type { MenuProps } from 'antd';
import { Dropdown, Typography } from 'antd';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { use } from 'react';
import { createRunCreatePageUrlSearchParams} from '@/util/routing'


const gameOrder= new Map<string, number>([
    ["Demon's Souls", 1],
		["Dark Souls", 2],
    ["Dark Souls 2", 3],
    ["Dark Souls 2: Scholar of the First Sin", 4],
    ["Bloodborne", 5],
    ["Dark Souls 3", 6],
    ["Sekiro: Shadows Die Twice", 7],
    ["Elden Ring", 8]
  ]
);

interface GameLinkProps{
  href?: string;
  gameName: string;
}

function GameLink(props: GameLinkProps): React.ReactNode{
  return props.href ? <Link href={props.href}>{props.gameName}</Link> : undefined
}

export default function MyRunsPage(props: PageProps<"/user/[userId]/runs">){
  const {loading, data} = useQuery(GetGamesDocument);
  const params = use(props.params);

  const menuItems: MenuProps['items'] = useMemo(() => {
    if(loading){
      return []
    }
    const tempGames: Exclude<GetGamesQuery["games"], null | undefined> = data && data.games ? [...data.games] : [];
    return tempGames.sort((a,b) => (gameOrder.get(a.name ?? "") ?? 0) - (gameOrder.get(b.name ?? "") ?? 0))
      .map((game) => {
        const abbreviation = GAME_TO_ABBREVIATION.get(game.name ?? "");
        const searchParams = createRunCreatePageUrlSearchParams({game: abbreviation ?? ""});
        const href = game.name ?`/user/${params.userId}/runs/create?${searchParams.toString()}` : undefined;
        
        return {
          key: game.id,
          label: (
            <GameLink href={href} gameName={game.name ?? ""} />
          )
        }
    });
  }, [data, loading, params.userId]);

  const menuProps = useMemo<MenuProps>(() => {
    return {
      items: menuItems
    }
  }, [menuItems]);
  return <div>
    <Typography>My Runs</Typography>
    <Dropdown menu={menuProps}>
      <Typography>Create Run</Typography>
    </Dropdown>
  </div>
}