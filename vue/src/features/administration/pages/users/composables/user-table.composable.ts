import { Order, PaginationDto, PaginationMeta, PaginationOptions } from '@/library/dto/pagination.dto'
import { columns } from '@/library/types/table-column.type'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocationQuery, useRoute } from 'vue-router'
import { useUserAdminHandler } from '../handlers/user.handler'
import { UserDto } from '@/library/dto/user.dto'
import { parseQuery } from '@/core/utils/parse-query.util'

const tableColumns: columns = [
  { name: 'user', label: 'forms.user' },
  { name: 'email', label: 'forms.email' },
  { name: 'roles', label: 'forms.roles' },
  { name: 'created', label: 'forms.date-registered', sort: 'user.createdAt' },
  { name: 'actions' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'user.createdAt',
  search: undefined
}

function useUserTable() {
  const $route = useRoute()

  const { t } = useI18n()
  const handler = useUserAdminHandler(t)

  const loading = ref<boolean>(true)
  const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))

  const response = reactive<{ data: Array<UserDto>; meta: PaginationMeta }>({
    data: [],
    meta: new PaginationMeta({ pageOptions: options.value, itemCount: 0 })
  })

  async function getPaginatedData(payload: PaginationOptions): Promise<void> {
    loading.value = true

    await handler
      .getPaginated(payload)
      .then((res: PaginationDto<UserDto>) => {
        response.data = res.data
        response.meta = res.meta
      })
      .finally(() => (loading.value = false))
  }

  async function promise() {
    await getPaginatedData(options.value)
  }

  function update(row: UserDto): void {
    handler.update(row, (_: UserDto) => getPaginatedData(options.value))
  }
  function remove(row: UserDto): void {
    handler.remove(row, (_: UserDto) => getPaginatedData(options.value))
  }

  watch(
    () => $route.query,
    async (newQuery: LocationQuery): Promise<void> => {
      const parsed = parseQuery<PaginationOptions>(newQuery, defaultOptions)
      await getPaginatedData(parsed)
    }
  )

  return { defaultOptions, tableColumns, response, options, loading, t, promise, update, remove }
}

export { useUserTable }
