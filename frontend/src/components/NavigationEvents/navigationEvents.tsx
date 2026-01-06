'use client'
 
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import * as createRunFormSlice from '@/state/runs/createRunForm/createRunFormSlice'
import { useAppDispatch } from '@/state/hooks'

const reCreateRunsPage = /^\/user\/.*?\/runs\/create/;
const reCreateRunCyclePage = /^\/user\/.*?\/runs\/create\/cycle\/.*?/
export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevUrl = useRef<string>(null);
  const dispatch = useAppDispatch();
 
  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(`url is ${url}`);

    if((prevUrl.current ?? "").match(reCreateRunsPage) && !url.match(reCreateRunsPage) && !url.match(reCreateRunCyclePage)){
      console.log('createRunForm reset')
      dispatch(createRunFormSlice.reset())
    }

    prevUrl.current = url;
  }, [pathname, searchParams, dispatch])
 
  return (
    <div>
    </div>
  )
}