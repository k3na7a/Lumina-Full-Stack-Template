import { Router, useRouter, RouteLocationNormalizedLoaded, useRoute, LocationQueryRaw } from 'vue-router'
import { Order, PaginationOptions, SortOptions } from '@lib/dto/pagination.dto'
import { computed, ComputedRef, ref, Ref } from 'vue'
import { BaseDto } from '@lib/dto/base.dto'

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

function usePaginatedTable<T extends BaseDto>(): {
  resetPageAndUpdateQuery: (params: LocationQueryRaw) => void
  updateQuery: (params: LocationQueryRaw) => void
  handleSort: (columnName: string) => void
  updateSelected: (value: boolean, item: T) => void
  selected: Ref<T[]>
  sortParam: ComputedRef<string | undefined>
  orderParam: ComputedRef<Order | undefined>
} {
  const $router: Router = useRouter()
  const $route: RouteLocationNormalizedLoaded = useRoute()

  const selected: Ref<T[]> = ref([])

  const sortParam: ComputedRef<string | undefined> = computed(() => $route.query.sort as string | undefined)
  const orderParam: ComputedRef<Order | undefined> = computed(() => $route.query.order as Order | undefined)

  function updateQuery(params: LocationQueryRaw): void {
    const next = { ...$route.query, ...params }

    if (JSON.stringify($route.query) !== JSON.stringify(next)) {
      $router.replace({ query: next })
    }
  }

  function updateSelected(value: boolean, item: T): void {
    const isChecked = value === true

    if (isChecked) {
      selected.value.push(item)
      return
    }

    selected.value = selected.value.filter((r) => r.id !== item.id)
  }

  function resetPageAndUpdateQuery(params: LocationQueryRaw): void {
    updateQuery({ ...params, page: undefined })
  }

  function handleSort(columnName: string): void {
    let nextSort: string | undefined = columnName
    let nextOrder: Order | undefined = Order.ASC

    if (sortParam.value !== nextSort) {
      nextOrder = Order.ASC
    } else if (orderParam.value === Order.ASC) {
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
    handleSort,
    selected,
    updateSelected
  }
}

export type { proptype, columns }
export { usePaginatedTable }
