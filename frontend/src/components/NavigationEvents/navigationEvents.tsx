'use client'
 
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import * as createRunFormSlice from '@/state/runs/createRunForm/createRunFormSlice'
import * as editRunFormSlice from '@/state/runs/editRunFormSlice'
import { useAppDispatch } from '@/state/hooks'

const reCreateRunsPage = /^\/user\/.*?\/runs\/create/; //TODO low chance of clashing with /user/[userId]/runs/[runId]

const reEditRunsPage = /^\/user\.*?\/runs\/.*?\/edit/;
export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevUrl = useRef<string>(null);
  const dispatch = useAppDispatch();
 
  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    //console.log(`url is ${url}`);

    if((prevUrl.current ?? "").match(reCreateRunsPage) && !url.match(reCreateRunsPage)){
      console.log('createRunForm reset')
      dispatch(createRunFormSlice.reset())
    }

    if((prevUrl.current ?? "").match(reEditRunsPage) && !url.match(reEditRunsPage)){
      console.log('editRunForm reset')
      dispatch(editRunFormSlice.reset())
    }

    prevUrl.current = url;
  }, [pathname, searchParams, dispatch])
 
  return (
    <div>
    </div>
  )
}