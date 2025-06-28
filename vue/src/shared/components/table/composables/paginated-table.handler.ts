import { Router, useRouter, RouteLocationNormalizedLoaded, useRoute, LocationQueryRaw } from 'vue-router'
import { PaginationOptions, SortOptions } from '@/library/dto/pagination.dto'

type proptype<T> = {
  columns: Array<{ label?: string; name: string }>
  rows: Array<T>
  pages: number | undefined
  options: PaginationOptions
  loading?: boolean
  sortOptions?: Array<SortOptions>
  caption?: string
}

function usePaginatedTable(): {
  resetPageAndUpdateQuery: (params: LocationQueryRaw) => void
  updateQuery: (params: LocationQueryRaw) => void
} {
  const $router: Router = useRouter()
  const $route: RouteLocationNormalizedLoaded = useRoute()

  function updateQuery(params: LocationQueryRaw): void {
    const next = { ...$route.query, ...params }

    if (JSON.stringify($route.query) !== JSON.stringify(next)) {
      $router.replace({ query: next })
    }
  }

  function resetPageAndUpdateQuery(params: LocationQueryRaw) {
    updateQuery({ ...params, page: undefined })
  }

  return {
    updateQuery,
    resetPageAndUpdateQuery
  }
}

export type { proptype }
export { usePaginatedTable }
