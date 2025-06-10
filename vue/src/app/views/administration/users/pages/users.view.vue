<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { LocationQuery, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { UserDto } from '@/library/apis/localhost/dto/user.dto'
import { UserAdminController } from '@/app/views/administration/users/controllers/user-admin.controller'
import { defaultOptions, tableColumns, sort, badges } from '../schema/users.schema'
import { parseQuery } from '@/library/utils/parse-query.util'
import { ROUTE_NAMES } from '@/app/router/routes'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'
import ContentLayout from '@/app/layouts/admin/components/admin-layout.component.vue'

const $route = useRoute()

const { t } = useI18n()
const controller = new UserAdminController(t)

const loading = ref<boolean>(true)
const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))

const response = reactive<{ data: Array<UserDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: options.value, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await controller
    .getUsersPaginated(payload)
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
        <template v-slot>
          <div class="d-flex gap-2">
            <button class="btn btn-dark btn-icon" disabled type="button">
              <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
            </button>
          </div>
        </template>

        <template #user="{ row }">
          <div class="d-flex align-items-center gap-2">
            <img class="avatar-icon rounded-circle" :src="row.profile.avatar" />

            <div class="d-flex flex-column flex-grow-1">
              <RouterLink
                :to="{ name: ROUTE_NAMES.ADMIN_USERS_SINGLE, params: { id: row.id } }"
                class="fw-semibold text-decoration-none link-light link-opacity-75-hover"
              >
                {{ row.getFullName() }}
              </RouterLink>

              <small class="text-muted">{{ row.email }}</small>
            </div>
          </div>
        </template>

        <template #role="{ row }">
          <div class="d-flex align-items-center">
            <small class="fw-semibold text-truncate text-light-alt" :class="`text-${badges[row.role].theme}`">
              {{ $t(badges[row.role].label).toUpperCase() }}
            </small>
          </div>
        </template>

        <template #created="{ row }">
          <small class="fw-semibold text-muted">{{ moment(row.createdAt).format('LL') }}</small>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
