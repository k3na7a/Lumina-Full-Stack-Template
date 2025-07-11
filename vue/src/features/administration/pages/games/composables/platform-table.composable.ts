import { ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, LocationQuery } from 'vue-router'

import { parseQuery } from '@/core/utils/parse-query.util.ts'
import { SortOptions, Order, PaginationOptions, PaginationDto, PaginationMeta } from '@/library/dto/pagination.dto'
import { PlatformDto } from '@/library/dto/platform.dto'
import { columns } from '@/library/types/table-column.type'
import { usePlatformAdminHandler } from '../handlers/platforms.handler'

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'platform.name',
  search: undefined
}

const sort: Array<SortOptions> = [
  { sort: 'platform.name', order: Order.ASC, label: 'forms.name' },
  { sort: 'platform.release_date', order: Order.ASC, label: 'forms.release-date' },
  { sort: 'gameCount', order: Order.DESC, label: '# of Games' },
  { sort: 'platform.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'platform.createdAt', order: Order.ASC, label: 'forms.oldest' }
]

const tableColumns: columns = [
  { name: 'platform', label: 'Platform' },
  { name: 'count', label: '# of Games' },
  { name: 'release', label: 'forms.release-date' },
  { name: 'actions' }
]

function usePlatformTable() {
  const { t } = useI18n()
  const $route = useRoute()
  const { create, paginate, remove, update } = usePlatformAdminHandler(t)

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
    sort,
    createPlatform,
    removePlatform,
    updatePlatform,
    getPaginatedData
  }
}

export { usePlatformTable }
