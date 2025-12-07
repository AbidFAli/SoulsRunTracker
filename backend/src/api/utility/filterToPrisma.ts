import * as graphql from '#generated/graphql/types.js';
import type {
  BoolFilter,
  BoolWithAggregatesFilter,
  IntFilter,
  IntNullableFilter,
  IntNullableWithAggregatesFilter,
  IntWithAggregatesFilter,
  NestedFloatFilter,
  SortOrderInput,
  StringFilter,
  StringNullableFilter,
  StringNullableWithAggregatesFilter,
  StringWithAggregatesFilter
} from '#generated/prisma/commonInputTypes.js';
import type {
  NullsOrder as NullsOrderValue,
  QueryMode as QueryModeValue,
  SortOrder as SortOrderValue
} from '#generated/prisma/internal/prismaNamespace.js';
import { NullsOrder, QueryMode, SortOrder } from '#generated/prisma/internal/prismaNamespace.js';
import { Unnullified } from '#src/util/utilityTypes.js';
import * as lodash from 'lodash';

const { omit, isNumber, isString, pick} = lodash;

//these functions convert graphql filters to prisma filters

//TODO fix cavalier treatment of null. Should convert to undefined in these methods.
//TODO can probably reduce LOC by identifying common fields in graphql
//TODO could add more validation to the float functions

export function convertQueryMode(data: graphql.QueryMode): QueryModeValue {
  if(data === graphql.QueryMode.Default){
    return QueryMode.default
  }
  else{
    return QueryMode.insensitive
  }
}

export function convertSortOrder(data: graphql.SortOrder): SortOrderValue{
  if(data === graphql.SortOrder.Asc){
    return SortOrder.asc
  }
  else{
    return SortOrder.desc
  }
}

export function convertNullsOrder(data: graphql.NullsOrder): NullsOrderValue{
  if(data === graphql.NullsOrder.First){
    return NullsOrder.first;
  }
  else{
    return NullsOrder.last;
  }
}

export function convertStringFilter(data: graphql.StringFilter): StringFilter{
  const goodAttributes = omit(data, ["mode", "not"]);
  let not: StringFilter | undefined = undefined;

  if(data.not){
    not = convertStringFilter(data.not)
  }

  const returnValue ={
    ...goodAttributes,
    mode: data.mode ? convertQueryMode(data.mode) : undefined,
    not
  }
  return returnValue as Unnullified<typeof returnValue>; 
}

export function convertStringWithAggregatesFilter(data: graphql.StringWithAggregatesFilter): StringWithAggregatesFilter{
  const goodAttributes = omit(data, ["mode", "not", "_count", "_min", "_max"]);

  const returnValue ={
    ...goodAttributes,
    mode: data.mode ? convertQueryMode(data.mode) : undefined,
    not: data.not ? convertStringFilter(data.not) : undefined,
    _count: data._count ? convertIntFilter(data._count) : undefined,
    _min: data._min ? convertStringFilter(data._min) : undefined,
    _max:  data._max ? convertStringFilter(data._max) : undefined,
  }
  return returnValue as Unnullified<typeof returnValue>; 
}

export function convertBoolFilter(data: graphql.BoolFilter) : BoolFilter{
  return data as Unnullified<graphql.BoolFilter>;
}

export function convertBoolWithAggregatesFilter(data: graphql.BoolWithAggregatesFilter): BoolWithAggregatesFilter{
  return {
    equals: data.equals ?? undefined,
    not: data.not ? convertBoolWithAggregatesFilter(data.not) : undefined,
    _count: data._count ? convertIntFilter(data._count) : undefined,
    _min: data._min ? convertBoolFilter(data._min) : undefined,
    _max : data._max ? convertBoolFilter(data._max) : undefined,
  }
}

export function convertIntFilter(data: graphql.IntFilter) : IntFilter{
  return data as Unnullified<graphql.IntFilter>;
}

export function convertIntWithAggregatesFilter(data: graphql.IntWithAggregatesFilter): IntWithAggregatesFilter{
  const goodData = omit(data, ["not", "_count", "_avg"]);
  const returnValue = {
    ...goodData,
    not: data.not ? convertIntWithAggregatesFilter(data.not) : undefined,
    _count: data._count ? convertIntFilter(data._count) : undefined,
    _avg: data._avg ? convertFloatFilter(data._avg) : undefined,
    _sum: data._sum ? convertIntFilter(data._sum) : undefined,
    _min : data._min ? convertIntFilter(data._min) : undefined,
    _max : data._max ? convertIntFilter(data._max) : undefined,
  }
  return returnValue as Unnullified<typeof returnValue>;
}

export function convertFloatFilter(data:graphql.FloatFilter) : NestedFloatFilter{
  return data as Unnullified<graphql.FloatFilter>;
}

interface NullableInputField<T>{
  value?: T | null
  null?: boolean | null
}

//TODO handle invalid circumstances. Both value and null. null is false
function handleNullableInputField<T>(data: NullableInputField<T> | null | undefined, 
  isValue: (t: T | null | undefined) => boolean): T | null | undefined{

  let returnValue: null | undefined | T = undefined;
  if(isValue(data?.value)){
    returnValue = data?.value
  }
  else if(data?.null === true){
    returnValue = null;
  }

  return returnValue
}

interface NullableNot<T, Filter>{
  value?: T | null;
  filter?: Filter | null;
  null?: boolean | null;
}

//TODO handle invalid circumstances. Two or more of {value, filter, null}. null is false
function handleNullableNot<T, Filter extends Record<string, unknown>, ConvertedFilter extends Record<string, unknown>
>(data: NullableNot<T, Filter> | null | undefined,
  hasValue: (t: T | null | undefined) => boolean,
  convertFilter: (filter: Filter) => ConvertedFilter
): T | ConvertedFilter | null | undefined{
  let returnValue: null | undefined | T | ConvertedFilter = undefined;
  if(hasValue(data?.value)){
    returnValue = data?.value
  }
  else if(data?.filter){
    returnValue = convertFilter(data.filter);
  }
  else if(data?.null === true){
    returnValue = null;
  }

  return returnValue;
}

function arrayExists(data: undefined |  null | unknown[]): boolean{
  return !data;
}

export function convertIntNullableFilter(data: graphql.IntNullableFilter) : IntNullableFilter{
  const goodData = omit(data, ["equals", "in", "notIn", "not"]);


  const returnValue = {
    ...goodData,
    equals: handleNullableInputField<number>(data.equals, isNumber),
    not: handleNullableNot<number, graphql.IntNullableFilter, IntNullableFilter>(data.not, isNumber, convertIntNullableFilter),
    in: handleNullableInputField<number[]>(data.in, arrayExists),
    notIn: handleNullableInputField(data.notIn, arrayExists)
  }

  return returnValue as Unnullified<typeof returnValue>;
  //equals, in, notIn, not
}

export function convertStringNullableFilter(data: graphql.StringNullableFilter) : StringNullableFilter{
  const goodData = omit(data, ["equals", "in", "notIn", "mode", "not"]);
  const returnValue = {
    ...goodData,
    equals: handleNullableInputField<string>(data.equals, isString),
    in: handleNullableInputField<string[]>(data.in, arrayExists),
    notIn: handleNullableInputField<string[]>(data.notIn, arrayExists),
    mode: data.mode ? convertQueryMode(data.mode) : undefined,
    not: handleNullableNot<string, graphql.StringNullableFilter, StringNullableFilter>(data.not,
      isString, convertStringNullableFilter
    )
  }

  return returnValue as Unnullified<typeof returnValue>;
}

export function convertSortOrderInput(data: graphql.SortOrderInput): SortOrderInput{
  return {
    sort: convertSortOrder(data.sort),
    nulls: data.nulls ? convertNullsOrder(data.nulls) : undefined,
  }
}

export function convertIntNullableWithAggregatesFilter(
  data: graphql.IntNullableWithAggregatesFilter) : IntNullableWithAggregatesFilter{
  const goodData = pick(data, ["lt", "lte", "gt", "gte"]);
  const returnValue = {
    ...goodData,
    equals: handleNullableInputField(data.equals, isNumber),
    in: handleNullableInputField(data.in, arrayExists),
    notIn: handleNullableInputField(data.notIn, arrayExists),
    not: handleNullableNot<number, graphql.IntNullableWithAggregatesFilter,IntNullableWithAggregatesFilter>(
      data.not, isNumber, convertIntNullableWithAggregatesFilter
    ),
    _count: data._count ?convertIntNullableFilter(data._count) : undefined,
    _avg: data._avg ? convertFloatNullableFilter(data._avg) : undefined,
    _sum : data._sum ? convertIntNullableFilter(data._sum) : undefined,
    _min : data._min ? convertIntNullableFilter(data._min) : undefined,
    _max : data._max ? convertIntNullableFilter(data._max): undefined
  }
  return returnValue as Unnullified<typeof returnValue>;
}

export function convertStringNullableWithAggregatesFilter(
  data: graphql.StringNullableWithAggregatesFilter): StringNullableWithAggregatesFilter
{
  const goodData = omit(data, ["equals", "in", "notIn", "mode", "not", "_count", "_min", "_max"]);
  //equals = string, in/notIn = string[]
  const returnValue = {
    ...goodData,
    equals: handleNullableInputField(data.equals, isString),
    in: handleNullableInputField(data.in, arrayExists),
    notIn: handleNullableInputField(data.notIn, arrayExists),
    mode: data.mode ? convertQueryMode(data.mode) : undefined,
    not: handleNullableNot<string, graphql.StringNullableWithAggregatesFilter, StringNullableWithAggregatesFilter>(
      data.not,
      isString,
      convertStringNullableWithAggregatesFilter
    ),
    _count: data._count ? convertIntNullableFilter(data._count) : undefined,
    _min: data._min ? convertStringNullableFilter(data._min): undefined,
    _max: data._max ? convertStringNullableFilter(data._max) : undefined,
  }
  return returnValue as Unnullified<typeof returnValue>;
}

export function convertFloatNullableFilter(data: graphql.FloatNullableFilter) : IntNullableFilter{
  const goodData = omit(data, ["equals", "in", "notIn", "not"]);


  const returnValue = {
    ...goodData,
    equals: handleNullableInputField<number>(data.equals, isNumber),
    not: handleNullableNot<number, graphql.FloatNullableFilter, IntNullableFilter>(data.not, isNumber, convertFloatNullableFilter),
    in: handleNullableInputField<number[]>(data.in, arrayExists),
    notIn: handleNullableInputField(data.notIn, arrayExists)
  }

  return returnValue as Unnullified<typeof returnValue>;
}

export function convertFloatWithAggregatesFilter(data: graphql.FloatWithAggregatesFilter): IntWithAggregatesFilter{
  return convertIntWithAggregatesFilter(data);
}

export function convertFloatNullableWithAggregatesFilter(
  data: graphql.FloatNullableWithAggregatesFilter) : IntNullableWithAggregatesFilter
{
  return convertIntNullableWithAggregatesFilter(data);
}