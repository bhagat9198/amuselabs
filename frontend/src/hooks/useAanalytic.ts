import { getAanalyticsApi } from '@/apis/home'
import React, { useEffect } from 'react'

export default function useAanalyticHook() {

  useEffect(() => {
      async function fetchData() {
        const _res = await getAanalyticsApi({})
        console.log('useAanalytic :: fetchData :: _res :: ', _res);
        
        return
      }

      fetchData()
  }, [])

  return;
}
