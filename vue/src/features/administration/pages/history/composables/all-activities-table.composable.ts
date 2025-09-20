import { ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, LocationQuery } from 'vue-router'

import { parseQuery } from '@lib/utilities/parse-query.util.ts'
import { Order, PaginationOptions, PaginationDto, PaginationMeta } from '@lib/dto/pagination.dto'
import { columns } from '@/shared/components/table/composables/paginated-table.composable'
import { useHistoryAdminHandler } from '../handlers/history.handler'
import { AuditEventDto, AuditPaginationOptions } from '@lib/dto/audit.dto'

const defaultOptions: AuditPaginationOptions = {
  take: 25,
  order: Order.DESC,
  page: 1,
  sort: 'audit_event.createdAt',
  search: undefined,
  domain: undefined
}

const tableColumns: columns = [
  { name: 'time', label: 'forms.time', sort: 'audit_event.createdAt' },
  { name: 'actor', label: 'forms.actor' },
  { name: 'action', label: 'forms.action' },
  { name: 'entity', label: 'forms.entity' },
  { name: 'reason', label: 'forms.reason' },
  { name: 'actions' }
]

export function useActivitiesTable() {
  const { t } = useI18n()
  const $route = useRoute()
  const { paginate } = useHistoryAdminHandler(t)

  const loading = ref<boolean>(false)
  const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))

  const response = reactive<{ data: Array<AuditEventDto>; meta: PaginationMeta }>({
    data: [],
    meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
  })

  async function getPaginatedData(payload: PaginationOptions): Promise<void> {
    loading.value = true

    await paginate(payload)
      .then((res: PaginationDto<AuditEventDto>) => {
        response.data = res.data
        response.meta = res.meta
      })
      .finally(() => (loading.value = false))
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
    getPaginatedData
  }
}
