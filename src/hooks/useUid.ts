import { useEffect, useMemo, useState } from 'react'
import { APP_CONFIG } from '../config'

const UID_QUERY_KEY = 'uid'

export function useUid() {
  const [uid, setUid] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryUid = params.get(UID_QUERY_KEY)?.trim() ?? ''
    const storedUid = localStorage.getItem(APP_CONFIG.uidStorageKey)?.trim() ?? ''

    if (queryUid) {
      localStorage.setItem(APP_CONFIG.uidStorageKey, queryUid)
      setUid(queryUid)
      return
    }

    if (storedUid) {
      setUid(storedUid)
      return
    }

    setUid('')
  }, [])

  const hasUid = useMemo(() => uid.length > 0, [uid])

  return { uid, hasUid }
}
