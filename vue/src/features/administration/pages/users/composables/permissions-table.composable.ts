import { Order, PaginationDto, PaginationMeta, PaginationOptions } from '@/core/apis/localhost/dto/pagination.dto'
import { columns } from '@/shared/components/table/composables/paginated-table.composable'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocationQuery, useRoute } from 'vue-router'

import { parseQuery } from '@/../../library/utilities/parse-query.util'
import { usePermissionAdminHandler } from '../handlers/permissions.handler'
import { PermissionDto } from '@/core/apis/localhost/administration/users/dto/permission.dto'

const tableColumns: columns = [
  { name: 'permission', label: 'forms.permissions', sort: 'permission.label' },
  { name: 'domain', label: 'forms.domain', sort: 'permission.label' },
  { name: 'key', label: 'forms.key', sort: 'permission.label' },
  { name: 'actions' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'permission.createdAt',
  search: undefined
}

function usePermissionsTable() {
  const $route = useRoute()

  const { t } = useI18n()
  const handler = usePermissionAdminHandler(t)

  const loading = ref<boolean>(true)
  const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))

  const response = reactive<{ data: Array<PermissionDto>; meta: PaginationMeta }>({
    data: [],
    meta: new PaginationMeta({ pageOptions: options.value, itemCount: 0 })
  })

  async function getPaginatedData(payload: PaginationOptions): Promise<void> {
    loading.value = true

    await handler
      .getPaginated(payload)
      .then((res: PaginationDto<PermissionDto>) => {
        response.data = res.data
        response.meta = res.meta
      })
      .finally(() => (loading.value = false))
  }

  async function promise() {
    await getPaginatedData(options.value)
  }

  function create(): void {
    handler.create((_: PermissionDto) => getPaginatedData(options.value))
  }

  function update(row: PermissionDto): void {
    handler.update(row, (_: PermissionDto) => getPaginatedData(options.value))
  }
  function remove(row: PermissionDto): void {
    handler.remove(row, (_: PermissionDto) => getPaginatedData(options.value))
  }

  watch(
    () => $route.query,
    async (newQuery: LocationQuery): Promise<void> => {
      const parsed = parseQuery<PaginationOptions>(newQuery, defaultOptions)
      await getPaginatedData(parsed)
    }
  )

  return { defaultOptions, tableColumns, response, options, loading, t, promise, update, remove, create }
}

export { usePermissionsTable, defaultOptions }
