import { useEffect, useState } from 'react'

const coarsePointerQuery = '(pointer: coarse)'

export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(coarsePointerQuery).matches : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const queryList = window.matchMedia(coarsePointerQuery)
    const handleChange = (event: MediaQueryListEvent) => {
      setIsTouchDevice(event.matches)
    }

    try {
      queryList.addEventListener('change', handleChange)
    } catch {
      // Safari < 14
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(queryList as any).addListener(handleChange)
    }

    return () => {
      try {
        queryList.removeEventListener('change', handleChange)
      } catch {
        // Safari < 14
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(queryList as any).removeListener(handleChange)
      }
    }
  }, [])

  return isTouchDevice
}
