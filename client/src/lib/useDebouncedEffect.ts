import { useEffect, useRef } from 'react'

export function useDebouncedEffect(effect: () => void, deps: unknown[], delayMs: number) {
  const isFirstRun = useRef(true)

  useEffect(() => {
    // Skip firing on initial mount — we only want to save on real edits,
    // not the moment the resume first loads.
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    const handle = setTimeout(effect, delayMs)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
