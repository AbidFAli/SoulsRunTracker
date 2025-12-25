"use client"
import type { GetGamesQuery, GetUserRunsQueryVariables, PageInfo, DeleteUserRunsMutationVariables, PaginationOffsetInput } from '@/generated/graphql/graphql';
import { GetUserRunsDocument, QueryMode, RunOrderByInput, RunWhereInput, NullsOrder, DeleteUserRunsDocument } from '@/generated/graphql/graphql';
import { GAME_TO_ABBREVIATION } from '@/util/gameAbbreviation';
import { useMutation, useQuery } from "@apollo/client/react";
import type { MenuProps, TablePaginationConfig, AlertProps } from 'antd';
import { Dropdown, Space, Typography, ConfigProvider, Button, Spin, Alert } from 'antd';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { use } from 'react';
import { createRunCreatePageUrlSearchParams} from '@/util/routing'
import { BasicPageLayout } from '@/components/BasicPageLayout';
import { DownOutlined } from '@ant-design/icons';
import lodash, {compact} from 'lodash';
import { OffsetPaginationConfig, RunsTable, RunsTableFilters, RunsTableSelection, RunsTableSorter } from '@/components/RunsTable';
import { useGetGames } from '@/app/user/[userId]/runs/useGetGames';
import { themeConfig } from './theme';
import { MyRunsPageContext, MyRunsPageContextType } from './context';
import { colors } from '@/util/colors';
import styles from './page.module.scss'
import { runsQueryGenerateCacheKey } from '@/util/apollo';
import { Reference } from '@apollo/client';

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

interface GetUserRunsQueryCachedData{
  __typename: "RunConnection",
  pageInfo: PageInfo,
  edges?: (Reference | null | undefined)[]
}

function createPaginationOffsetInput(config: OffsetPaginationConfig): PaginationOffsetInput{
  return {
    skip: (config.page-1) * config.pageSize,
    take: config.pageSize
  }
}

export default function MyRunsPage(props: PageProps<"/user/[userId]/runs">){
  const params = use(props.params);
  const [filters, setFilters] = useState<RunsTableFilters>({});
  const [sorter, setSorter] = useState<RunsTableSorter>({});
  const [selection, setSelection] = useState<RunsTableSelection>({all: false, selectedRows: []});

  const [paginationState, setPaginationState] = useState<OffsetPaginationConfig>({page: 1, pageSize: 20})

  const {data: cleanedGamesData, loading: gamesLoading, gameNameToId, error: getGamesError} = useGetGames();

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


  const runsQueryOrderBy = useMemo<RunOrderByInput | undefined>(() => {
    const orderBy: RunOrderByInput = {};
    if(sorter.column === undefined) {
      return undefined
    }
    switch(sorter.column){
      case "deaths":
        orderBy.deaths = sorter.direction;
        break;
      case 'game':
        orderBy.game = {
          name: sorter.direction,
        }
        break;
      case 'level':
        if(!sorter.direction){
          throw new Error("missing sorter.direction");
        }
        orderBy.character ={
          level: {
            sort: sorter.direction,
            nulls: NullsOrder.Last,
          },
        }
        break;
      default:
        throw new Error(`invalid sorter.column. was ${sorter.column}`);
    }
    return orderBy;
  }, [sorter])

  const runsQueryVariables = useMemo<GetUserRunsQueryVariables>(() => {
    return {
      where: runsQueryWhere,
      orderBy: runsQueryOrderBy ? [runsQueryOrderBy] : undefined,
      pagination: {
        offset: createPaginationOffsetInput(paginationState)
      }
    }
  }, [paginationState, runsQueryOrderBy, runsQueryWhere]);

  const { loading: runsLoading, data: runsData, fetchMore, error: getUserRunsError} = useQuery(GetUserRunsDocument, {
    variables: runsQueryVariables
  });

  const fetchMoreRuns = useCallback((pagination: OffsetPaginationConfig) => {
    return fetchMore({
      variables: {
        pagination: {
          offset: createPaginationOffsetInput(pagination)
        }
      }
    })
  }, [fetchMore])

  const [deleteUserRuns, {loading: deleteRunning, error: deletionError}] = useMutation(DeleteUserRunsDocument, {
    refetchQueries: [GetUserRunsDocument]
  })

  const loading = useMemo(() => {
    return gamesLoading || runsLoading || deleteRunning
  }, [deleteRunning, gamesLoading, runsLoading])


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
      total: runsData?.runs?.pageInfo.totalCount ?? 0,
      disabled: loading,
    }
  }, [paginationState.page, paginationState.pageSize, runsData?.runs?.pageInfo.totalCount, loading])

  const myRunsPageContext = useMemo<MyRunsPageContextType>(() => {
    return {
      updateSorter: setSorter,
      loading,
      sorter,
      userId: params.userId,
    }
  }, [loading, sorter, params.userId])



  const onCancelDelete = useCallback(() => {
    setSelection({
      all: false,
      selectedRows: []
    })
  }, [])

  const executeDelete = useCallback((all?: true) => {
    const deleteUserRunsVariables: DeleteUserRunsMutationVariables = {
      where: {
        all: all ? all : undefined,
        userId: params.userId,
        ids: all ? undefined : selection.selectedRows
      }
    }

    const runsOnPage: number = runsData?.runs?.edges?.length ?? 0
    const lastRowIndex = ((paginationState.page - 1) * paginationState.pageSize) + runsOnPage;
    const totalRuns = runsData?.runs?.pageInfo.totalCount ?? 0;
    const hasNextPage: boolean = lastRowIndex < totalRuns;

    deleteUserRuns({
      variables: deleteUserRunsVariables,
      update(cache){
        let orderBy: RunOrderByInput[] | undefined = undefined;
        if(Array.isArray(runsQueryVariables.orderBy)){
          orderBy = runsQueryVariables.orderBy;
        }
        else if(runsQueryVariables.orderBy){
          orderBy = [runsQueryVariables.orderBy]
        }
        
        const cacheKey = runsQueryGenerateCacheKey(
            {
              ...runsQueryVariables, 
              orderBy: orderBy
            }
          );
        cache.modify({
          id: 'ROOT_QUERY',
          fields: {
            [cacheKey]: (value, details) => {
              const cachedValue = value as GetUserRunsQueryCachedData;
              let edges: GetUserRunsQueryCachedData['edges'] = []
              if(!deleteUserRunsVariables.where.all){
                const ids = new Set(deleteUserRunsVariables.where.ids ?? [])
                edges = cachedValue.edges?.filter((edgeRef) => lodash.isNil(edgeRef) || !ids.has(details.readField("id", edgeRef) ?? ""));
              }

              const storeObject = cachedValue.pageInfo;
              let totalCount = deleteUserRunsVariables.where.all ? 0: storeObject.totalCount;
              if(deleteUserRunsVariables.where.ids && (deleteUserRunsVariables.where.ids.length > 0) && totalCount){
                totalCount -= deleteUserRunsVariables.where.ids.length;
              }

              const returnValue: GetUserRunsQueryCachedData = {
                __typename: cachedValue.__typename,
                edges: edges,
                pageInfo: {
                  ...storeObject,
                  totalCount
                }
              }

              return returnValue;
            }
          }
        })

        if(all){
          setPaginationState({page: 1, pageSize: paginationState.pageSize})
        }
        else if(selection.selectedRows.length === runsData?.runs?.edges?.length){
          setPaginationState({
            page: hasNextPage ? paginationState.page : Math.max(paginationState.page - 1, 1), 
            pageSize: paginationState.pageSize
          })
        }
      },
      onQueryUpdated(observableQuery){
        if(!all && (selection.selectedRows.length === runsData?.runs?.edges?.length)){
          const paginationConfig: OffsetPaginationConfig = {
            page: hasNextPage ? paginationState.page : Math.max(paginationState.page - 1, 1), 
            pageSize: paginationState.pageSize
          }

          const queryVars: Partial<GetUserRunsQueryVariables> = {
            pagination: {
              offset: createPaginationOffsetInput(paginationConfig)
            }
          }
          observableQuery.refetch(queryVars)
        }
      }
    })





    setSelection({
      all: false,
      selectedRows: []
    })
  }, [
    deleteUserRuns, 
    params.userId, 
    selection.selectedRows, 
    runsQueryVariables,
    paginationState,
    runsData?.runs?.edges,
    runsData?.runs?.pageInfo
  ])

  const anySelected = useMemo<boolean>(() => {
    return selection.all || selection.selectedRows.length > 0
  }, [selection.all, selection.selectedRows.length])

  const errorText = useMemo<string>(() => {
    const errors = compact([deletionError, getGamesError, getUserRunsError]);
    if(errors.length > 0){
      return "There was an error"
    }
    return "";
  }, [deletionError, getGamesError, getUserRunsError])

  const alertCloseableProps = useMemo<NonNullable<AlertProps['closable']>>(() => {
    return {
      closeIcon: true
    }
  }, [])

  const onDeleteAll = useCallback(() => {
    if(window.confirm("Are you sure you want to delete all of your runs?")){
      executeDelete(true)
    }
  }, [executeDelete])

  const onConfirmDelete = useCallback(() => {
    executeDelete();
  }, [executeDelete])

  return <BasicPageLayout
    title={<Title level={1}>My Runs</Title>}
  >

    <ConfigProvider theme={themeConfig}>
      {loading && <Spin spinning={true} fullscreen size="large"/>}
      {errorText && (
        <Alert type="error" title={errorText} closable={alertCloseableProps} />
      ) }
      <div className="flex min-w-full w-full">
        <Dropdown menu={menuProps}>
          <div className="border rounded-md border-white w-32 flex justify-center">
            <Space>
              <Typography>Create Run</Typography>
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>
      </div>
      
      <MyRunsPageContext value={myRunsPageContext}>
        <RunsTable 
          data={runsData?.runs?.edges ?? []}
          gamesData={cleanedGamesData}
          pagination={tablePaginationConfig}
          filters={filters}
          updateFilters={setFilters}
          updatePagination={setPaginationState}
          selection={selection}
          updateSelection={setSelection}
          showSelection={true}
          fetchMore={fetchMoreRuns}
        />
      </MyRunsPageContext>
      {
        anySelected && (
        <div className={`${styles['delete-action-bar']}`}>
          <div className="p-1.5 w-full rounded-md flex justify-center items-center gap-4"style={{backgroundColor: colors.dropdown}}>
            <Typography>{selection.selectedRows.length} selected</Typography>
            <Button danger={true} disabled={loading} onClick={onConfirmDelete}>Delete</Button>
            <Button onClick={onCancelDelete}>Cancel</Button>
          </div>
        </div>
        )
      }

      <div>
        <Button danger={true} onClick={onDeleteAll}>Delete All Runs</Button>
      </div>

    </ConfigProvider>
  </BasicPageLayout>
}