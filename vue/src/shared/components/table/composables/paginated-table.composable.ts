import { Router, useRouter, RouteLocationNormalizedLoaded, useRoute, LocationQueryRaw } from 'vue-router'
import { Order, PaginationOptions, SortOptions } from '@/core/apis/localhost/dto/pagination.dto'
import { computed, ComputedRef } from 'vue'

type proptype<T> = {
  columns: columns
  rows: Array<T>
  pages: number | undefined
  options: PaginationOptions
  loading?: boolean
  sortOptions?: Array<SortOptions>
  caption?: string
}

type columns = Array<{ name: string; label?: string; sort?: string }>

function usePaginatedTable(): {
  resetPageAndUpdateQuery: (params: LocationQueryRaw) => void
  updateQuery: (params: LocationQueryRaw) => void
  handleSort: (columnName: string) => void
  sortParam: ComputedRef<string | undefined>
  orderParam: ComputedRef<Order | undefined>
} {
  const $router: Router = useRouter()
  const $route: RouteLocationNormalizedLoaded = useRoute()

  const sortParam: ComputedRef<string | undefined> = computed(() => $route.query.sort as string | undefined)
  const orderParam: ComputedRef<Order | undefined> = computed(() => $route.query.order as Order | undefined)

  function updateQuery(params: LocationQueryRaw): void {
    const next = { ...$route.query, ...params }

    if (JSON.stringify($route.query) !== JSON.stringify(next)) {
      $router.replace({ query: next })
    }
  }

  function resetPageAndUpdateQuery(params: LocationQueryRaw): void {
    updateQuery({ ...params, page: undefined })
  }

  function handleSort(columnName: string): void {
    let nextSort: string | undefined = columnName
    let nextOrder: Order | undefined = Order.ASC

    if (orderParam.value === Order.ASC) {
      nextOrder = Order.DESC
    } else if (orderParam.value === Order.DESC) {
      nextSort = undefined
      nextOrder = undefined
    }

    resetPageAndUpdateQuery({ sort: nextSort, order: nextOrder })
  }

  return {
    updateQuery,
    resetPageAndUpdateQuery,
    sortParam,
    orderParam,
    handleSort
  }
}

export type { proptype, columns }
export { usePaginatedTable }
