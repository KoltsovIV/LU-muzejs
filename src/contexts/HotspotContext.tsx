import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { hotspotDataFileSchema } from '@/schemas/hotspot-schema'
import type { Hotspot, HotspotDataFile } from '@/types/hotspot'

import { useI18n } from './I18nContext'
import { useLogger } from '@/utils/logger'

type HotspotStatus = 'idle' | 'loading' | 'ready' | 'error'
type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error'

const BASE_URL = import.meta.env.BASE_URL ?? '/'
const WORKSPACE_IMAGE_SRC = `${BASE_URL}assets/hotspots/workspace-scene.svg`
const DATA_ENDPOINT = `${BASE_URL}data`
const MAX_RETRIES = 2

type HotspotContextValue = {
  hotspots: Hotspot[]
  hotspotsMap: Map<string, Hotspot>
  status: HotspotStatus
  error?: string
  selectedHotspotId: string | null
  selectHotspot: (id: string | null) => void
  retry: () => void
  loadingProgress: number
  imageStatus: ImageStatus
  updatedAt?: string
}

type HotspotState = {
  hotspots: Hotspot[]
  status: HotspotStatus
  error?: string
  updatedAt?: string
}

type HotspotAction =
  | { type: 'loading' }
  | { type: 'loaded'; payload: { hotspots: Hotspot[]; updatedAt?: string } }
  | { type: 'error'; payload: { message: string } }

const reducer = (state: HotspotState, action: HotspotAction): HotspotState => {
  switch (action.type) {
    case 'loading':
      return { ...state, status: 'loading', error: undefined }
    case 'loaded':
      return {
        hotspots: action.payload.hotspots,
        status: 'ready',
        error: undefined,
        updatedAt: action.payload.updatedAt,
      }
    case 'error':
      return { ...state, status: 'error', error: action.payload.message }
    default:
      return state
  }
}

const HotspotContext = createContext<HotspotContextValue | undefined>(undefined)

const fetchHotspotData = async (language: string, signal?: AbortSignal) => {
  const cacheBuster = new URLSearchParams({ v: new Date().toISOString().slice(0, 10) })
  const response = await fetch(
    `${DATA_ENDPOINT}/hotspots.${language}.json?${cacheBuster}`,
    {
      signal,
    },
  )
  if (!response.ok) {
    throw new Error(`Unable to load hotspots (${response.status})`)
  }
  const parsedJson = await response.json()
  return hotspotDataFileSchema.parse(parsedJson) as HotspotDataFile
}

const useImagePreload = (src: string) => {
  const [status, setStatus] = useState<ImageStatus>('idle')

  useEffect(() => {
    let isSubscribed = true
    setStatus('loading')
    const image = new Image()
    image.src = src
    image.onload = () => {
      if (isSubscribed) {
        setStatus('loaded')
      }
    }
    image.onerror = () => {
      if (isSubscribed) {
        setStatus('error')
      }
    }

    return () => {
      isSubscribed = false
    }
  }, [src])

  return status
}

type HotspotProviderProps = {
  children: ReactNode
  initialData?: { hotspots: Hotspot[]; updatedAt?: string }
  fetchOnMount?: boolean
}

export const HotspotProvider = ({
  children,
  initialData,
  fetchOnMount = true,
}: HotspotProviderProps) => {
  const { language, t } = useI18n()
  const logger = useLogger('HotspotContext')
  const [state, dispatch] = useReducer(reducer, {
    hotspots: [],
    status: 'idle',
  })
  const [retryCount, setRetryCount] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const imageStatus = useImagePreload(WORKSPACE_IMAGE_SRC)

  useEffect(() => {
    setRetryCount(0)
  }, [language])

  useEffect(() => {
    if (!initialData) {
      return
    }
    dispatch({
      type: 'loaded',
      payload: { hotspots: initialData.hotspots, updatedAt: initialData.updatedAt },
    })
    setLoadingProgress(1)
  }, [initialData])

  useEffect(() => {
    if (!fetchOnMount) {
      return
    }

    const controller = new AbortController()
    abortControllerRef.current?.abort()
    abortControllerRef.current = controller

    let cancelled = false
    const load = async (attempt = 0) => {
      dispatch({ type: 'loading' })
      setLoadingProgress(0.2)
      try {
        const data = await fetchHotspotData(language, controller.signal)
        if (cancelled) return
        setLoadingProgress(prev => Math.max(prev, 0.8))
        dispatch({
          type: 'loaded',
          payload: { hotspots: data.hotspots, updatedAt: data.updatedAt },
        })
        setLoadingProgress(1)
        logger.info('Hotspot data loaded', { language, hotspots: data.hotspots.length })
      } catch (error) {
        if (cancelled) return
        if (attempt < MAX_RETRIES) {
          logger.warn('Hotspot data load failed, retrying', {
            attempt,
            language,
            error,
          })
          setTimeout(() => load(attempt + 1), 500 * (attempt + 1))
          return
        }
        const message =
          error instanceof Error ? error.message : 'Unexpected error while loading data'
        dispatch({ type: 'error', payload: { message } })
        setLoadingProgress(0)
        logger.error('Hotspot data load failed', { error, language })
      }
    }

    load()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [language, retryCount, fetchOnMount, logger])

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null)

  useEffect(() => {
    setSelectedHotspotId(null)
  }, [language])

  const selectHotspot = useCallback((id: string | null) => {
    setSelectedHotspotId(id)
  }, [])

  const retry = useCallback(() => {
    setRetryCount(count => count + 1)
  }, [])

  const hotspotsMap = useMemo(
    () => new Map(state.hotspots.map(hotspot => [hotspot.id, hotspot])),
    [state.hotspots],
  )

  const combinedProgress =
    state.status === 'ready' && imageStatus === 'loaded'
      ? 1
      : Math.min(1, loadingProgress * 0.6 + (imageStatus === 'loaded' ? 0.4 : 0))

  const value = useMemo<HotspotContextValue>(
    () => ({
      hotspots: state.hotspots,
      hotspotsMap,
      status: state.status,
      error:
        state.error || (state.status === 'error' ? t('errorLoadingData') : undefined),
      selectedHotspotId,
      selectHotspot,
      retry,
      loadingProgress: combinedProgress,
      imageStatus,
      updatedAt: state.updatedAt,
    }),
    [
      state.hotspots,
      hotspotsMap,
      state.status,
      state.error,
      t,
      selectedHotspotId,
      selectHotspot,
      retry,
      combinedProgress,
      imageStatus,
      state.updatedAt,
    ],
  )

  return <HotspotContext.Provider value={value}>{children}</HotspotContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useHotspotContext = () => {
  const context = useContext(HotspotContext)
  if (!context) {
    throw new Error('useHotspotContext must be used within a HotspotProvider')
  }
  return context
}
