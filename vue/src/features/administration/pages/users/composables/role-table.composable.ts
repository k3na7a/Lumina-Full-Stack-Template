import { Order, PaginationDto, PaginationMeta, PaginationOptions } from '@/core/apis/localhost/dto/pagination.dto'
import { columns } from '@/shared/components/table/composables/paginated-table.composable'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocationQuery, useRoute } from 'vue-router'

import { parseQuery } from '@/../../library/utilities/parse-query.util'

import { useRoleAdminHandler } from '../handlers/roles.handler'
import { RoleDto } from '@/core/apis/localhost/administration/users/dto/role.dto'

const tableColumns: columns = [
  { name: 'role', label: 'forms.role', sort: 'role.label' },
  { name: 'key', label: 'forms.key', sort: 'role.label' },
  { name: 'permissions', label: 'forms.permissions' },
  { name: 'actions' }
]

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'role.createdAt',
  search: undefined
}

function useRoleTable() {
  const $route = useRoute()

  const { t } = useI18n()
  const handler = useRoleAdminHandler(t)

  const loading = ref<boolean>(true)
  const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))

  const response = reactive<{ data: Array<RoleDto>; meta: PaginationMeta }>({
    data: [],
    meta: new PaginationMeta({ pageOptions: options.value, itemCount: 0 })
  })

  async function getPaginatedData(payload: PaginationOptions): Promise<void> {
    loading.value = true

    await handler
      .getPaginated(payload)
      .then((res: PaginationDto<RoleDto>) => {
        response.data = res.data
        response.meta = res.meta
      })
      .finally(() => (loading.value = false))
  }

  async function promise() {
    await getPaginatedData(options.value)
  }

  function create(): void {
    handler.create((_: RoleDto) => getPaginatedData(options.value))
  }

  function update(row: RoleDto): void {
    handler.update(row, (_: RoleDto) => getPaginatedData(options.value))
  }
  function remove(row: RoleDto): void {
    handler.remove(row, (_: RoleDto) => getPaginatedData(options.value))
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

export { useRoleTable, defaultOptions }
