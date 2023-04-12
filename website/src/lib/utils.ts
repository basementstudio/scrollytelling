export const isClient = typeof document !== 'undefined'

export const isApiSupported = (api: string) => isClient && api in window
