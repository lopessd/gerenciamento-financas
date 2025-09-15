import { useRouter } from "next/navigation"
import { useCallback } from "react"

const prefetchedRoutes = new Set<string>()

export function usePrefetch() {
  const router = useRouter()

  const prefetchRoute = useCallback((href: string) => {
    if (!prefetchedRoutes.has(href)) {
      router.prefetch(href)
      prefetchedRoutes.add(href)
    }
  }, [router])

  const prefetchMultiple = useCallback((routes: string[]) => {
    routes.forEach(route => prefetchRoute(route))
  }, [prefetchRoute])

  const navigateWithPrefetch = useCallback((href: string) => {
    prefetchRoute(href)
    router.push(href)
  }, [router, prefetchRoute])

  return {
    prefetchRoute,
    prefetchMultiple,
    navigateWithPrefetch
  }
}