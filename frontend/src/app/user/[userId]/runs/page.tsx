"use client"
import type { GetGamesQuery } from '@/generated/graphql/graphql';
import { GetUserRunsDocument, QueryMode, RunWhereInput } from '@/generated/graphql/graphql';
import { GAME_TO_ABBREVIATION } from '@/util/gameAbbreviation';
import { useQuery } from "@apollo/client/react";
import type { MenuProps, TablePaginationConfig } from 'antd';
import { Dropdown, Space, Typography, ConfigProvider } from 'antd';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { use } from 'react';
import { createRunCreatePageUrlSearchParams} from '@/util/routing'
import { BasicPageLayout } from '@/components/BasicPageLayout';
import { DownOutlined } from '@ant-design/icons';
import lodash from 'lodash';
import { OffsetPaginationConfig, RunsTable, RunsTableFilters } from '@/components/RunsTable';
import { useGetGames } from '@/app/user/[userId]/runs/useGetGames';
import { themeConfig } from './theme';

const { compact} = lodash;
const { Title} = Typography;




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
  const params = use(props.params);
  const [filters, setFilters] = useState<RunsTableFilters>({})

  const [paginationState, setPaginationState] = useState<OffsetPaginationConfig>({page: 1, pageSize: 20})

  const {data: cleanedGamesData, loading: gamesLoading, gameNameToId} = useGetGames();

  const runsQueryWhere = useMemo<RunWhereInput>(() => {
    const queryWhere: RunWhereInput = {
      userId: {
        equals: params.userId
      },
    }

    if(filters.completed !== undefined){
      queryWhere.completed = {
        equals: filters.completed
      }
    }
    if(filters.game && filters.game.length > 0){
      queryWhere.gameId = {
        in: compact(filters.game.map((gameName) => gameNameToId(gameName) ?? ""))
      }
    }
    if(filters.name){
      queryWhere.name = {
        contains: filters.name.trim(),
        mode: QueryMode.Insensitive
      }
    }


    return queryWhere
  }, [filters, gameNameToId, params.userId]);


  const { loading: runsLoading, data: runsData} = useQuery(GetUserRunsDocument, {
    variables: {
      where: runsQueryWhere,
      pagination: {
        offset: {
          skip: (paginationState.page-1) * paginationState.pageSize,
          take: paginationState.pageSize
        }
      }
    }
  });



  const menuItems: MenuProps['items'] = useMemo(() => {
    if(gamesLoading){
      return []
    }
    const tempGames: Exclude<GetGamesQuery["games"], null | undefined> =  cleanedGamesData.slice(0);
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
  }, [cleanedGamesData, gamesLoading, params.userId]);

  const menuProps = useMemo<MenuProps>(() => {
    return {
      items: menuItems
    }
  }, [menuItems]);
  
  const tablePaginationConfig = useMemo<TablePaginationConfig>(() => {
    return {
      pageSize: paginationState.pageSize,
      current: paginationState.page,
      total: runsLoading ? 1 : (runsData?.runs?.pageInfo.totalCount ?? 1),
    }
  }, [paginationState.page, paginationState.pageSize, runsData?.runs?.pageInfo.totalCount, runsLoading])


  return <BasicPageLayout
    title={<Title level={1}>My Runs</Title>}
  >
    <ConfigProvider theme={themeConfig}>
      <Dropdown menu={menuProps}>
        <div className="border rounded-md border-white w-32 flex justify-center">
          <Space>
            <Typography>Create Run</Typography>
            <DownOutlined />
          </Space>
        </div>
      </Dropdown>
      <RunsTable 
        data={runsData?.runs?.edges ?? []}
        gamesData={cleanedGamesData}
        pagination={tablePaginationConfig}
        filters={filters}
        updateFilters={setFilters}
        updatePagination={setPaginationState}
      />
    </ConfigProvider>
  </BasicPageLayout>
}