import { ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, LocationQuery } from 'vue-router'

import { parseQuery } from '@lib/utilities/parse-query.util.ts'
import { Order, PaginationOptions, PaginationDto, PaginationMeta } from '@lib/dto/pagination.dto'
import { usePlatformAdminHandler } from '../handlers/platforms.handler'
import { PlatformDto } from '@lib/dto/platform.dto'
import { columns } from '@/shared/components/table/composables/paginated-table.composable'

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'gameCount',
  search: undefined
}

const tableColumns: columns = [
  { name: 'platform', label: 'administration.games-and-software.platforms.label', sort: 'platform.name' },
  { name: 'count', label: 'administration.games-and-software.no-of-games', sort: 'gameCount' },
  { name: 'release', label: 'forms.release-date', sort: 'platform.release_date' },
  { name: 'actions' }
]

function usePlatformTable() {
  const { t } = useI18n()
  const $route = useRoute()
  const { create, paginate, remove, update, view } = usePlatformAdminHandler(t)

  const loading = ref<boolean>(false)
  const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))

  const response = reactive<{ data: Array<PlatformDto>; meta: PaginationMeta }>({
    data: [],
    meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
  })

  async function getPaginatedData(payload: PaginationOptions): Promise<void> {
    loading.value = true

    await paginate(payload)
      .then((res: PaginationDto<PlatformDto>) => {
        response.data = res.data
        response.meta = res.meta
      })
      .finally(() => (loading.value = false))
  }

  function createPlatform(): void {
    create((_: PlatformDto) => getPaginatedData(options.value))
  }

  function removePlatform(platform: PlatformDto): void {
    remove(platform, (_: PlatformDto) => getPaginatedData(options.value))
  }

  function updatePlatform(platform: PlatformDto): void {
    update(platform, (_: PlatformDto) => getPaginatedData(options.value))
  }

  function viewPlatform(platform: PlatformDto): void {
    view(platform)
  }

  watch(
    () => $route.query,
    async (newQuery: LocationQuery): Promise<void> => {
      const parsed = parseQuery<PaginationOptions>(newQuery, defaultOptions)
      await getPaginatedData(parsed)
    }
  )

  return {
    t,
    response,
    options,
    loading,
    tableColumns,
    createPlatform,
    removePlatform,
    updatePlatform,
    getPaginatedData,
    viewPlatform
  }
}

export { usePlatformTable }
