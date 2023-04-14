import { useEffect, useLayoutEffect } from 'react'

export const useIsoLayoutEffect =
  typeof document === 'undefined' ? useEffect : useLayoutEffect
