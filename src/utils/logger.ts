import { useMemo } from 'react'

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'
export type LogTarget = 'console' | 'silent'

const LOG_TARGET = (import.meta.env.VITE_LOG_TARGET as LogTarget | undefined) ?? 'console'

type LogMetadata = Record<string, unknown>

const emit = (
  level: LogLevel,
  scope: string,
  message: string,
  metadata?: LogMetadata,
) => {
  if (LOG_TARGET === 'silent') {
    return
  }

  const prefix = `[${scope}] ${message}`

  const args = metadata !== undefined ? [prefix, metadata] : [prefix]

  switch (level) {
    case 'info':
      console.info(...args)
      break
    case 'warn':
      console.warn(...args)
      break
    case 'error':
      console.error(...args)
      break
    case 'debug':
      console.debug(...args)
      break
    default:
      console.log(...args)
  }
}

export const useLogger = (scope: string) =>
  useMemo(
    () => ({
      info: (message: string, metadata?: LogMetadata) =>
        emit('info', scope, message, metadata),
      warn: (message: string, metadata?: LogMetadata) =>
        emit('warn', scope, message, metadata),
      error: (message: string, metadata?: LogMetadata) =>
        emit('error', scope, message, metadata),
      debug: (message: string, metadata?: LogMetadata) =>
        emit('debug', scope, message, metadata),
    }),
    [scope],
  )

export const createLogger = (scope: string) => ({
  info: (message: string, metadata?: LogMetadata) =>
    emit('info', scope, message, metadata),
  warn: (message: string, metadata?: LogMetadata) =>
    emit('warn', scope, message, metadata),
  error: (message: string, metadata?: LogMetadata) =>
    emit('error', scope, message, metadata),
  debug: (message: string, metadata?: LogMetadata) =>
    emit('debug', scope, message, metadata),
})
