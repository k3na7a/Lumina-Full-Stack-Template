<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { LocationQuery, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import { parseQuery } from '@/core/utils/parse-query.util'
import { PaginationOptions, PaginationMeta, PaginationDto } from '@/library/dto/pagination.dto'
import { UserDto } from '@/library/dto/user.dto'

import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'

import ContentLayout from '@/features/administration/layouts/content.layout.vue'

import { defaultOptions, tableColumns, sort, badges } from '../config/users-table.config'
import { useUserAdminHandler } from '../handlers/user.handler'

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

await getPaginatedData(options.value)

watch(
  () => $route.query,
  async (newQuery: LocationQuery): Promise<void> => {
    const parsed = parseQuery<PaginationOptions>(newQuery, defaultOptions)
    await getPaginatedData(parsed)
  }
)
</script>

<template>
  <ContentLayout title="administration.users.user-table.title" subtitle="administration.users.user-table.subtitle">
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :sort-options="sort"
        :caption="
          t('administration.users.user-table.caption', { showing: response.data.length }, response.meta.itemCount)
        "
      >
        <template #user="{ row }">
          <div class="d-flex align-items-center gap-2">
            <img class="avatar-icon rounded-circle" :src="row.profile.avatar" />

            <div class="d-flex flex-column flex-grow-1">
              <small class="fst-italic text-muted">{{ row.id }}</small>
              <p class="fw-semibold text-light">{{ row.getFullName() }}</p>
            </div>
          </div>
        </template>

        <template #email="{ row }">
          <small class="fst-italic text-light-alt">{{ row.email }}</small>
        </template>

        <template #role="{ row }">
          <div class="d-flex align-items-center">
            <small class="fw-semibold text-truncate text-light-alt" :class="`text-light-alt`">
              {{ $t(badges[row.role].label).toUpperCase() }}
            </small>
          </div>
        </template>

        <template #created="{ row }">
          <small class="fw-semibold text-muted">{{ moment(row.createdAt).format('L') }}</small>
        </template>

        <template #actions="{ row }">
          <ActionsComponent
            type="user"
            :id="row.id"
            :updateCallback="() => handler.update(row, (_: UserDto) => getPaginatedData(options))"
            :deleteCallback="() => handler.remove(row, (_: UserDto) => getPaginatedData(options))"
          />
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
