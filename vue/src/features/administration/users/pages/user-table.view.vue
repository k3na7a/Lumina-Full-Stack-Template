<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { LocationQuery, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import { useUserAdminHandler } from '@/features/administration/users/handlers/user.handler'
import { defaultOptions, tableColumns, sort, badges } from '../schema/users.schema'
import { parseQuery } from '@/core/utilities/parse-query.util'
import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { PaginationOptions, PaginationMeta, PaginationDto } from '@/core/apis/dto/pagination.dto'
import { UserDto } from '@/core/apis/dto/user.dto'

import ActionsComponent from '@/layouts/admin/components/actions.component.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated.component.vue'
import ContentLayout from '@/layouts/admin/components/admin-layout.component.vue'

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

function deleteUser(user: UserDto): void {
  handler.remove(user, (_: UserDto) => getPaginatedData(options.value))
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
              <RouterLink
                :to="{ name: ROUTE_NAMES.ADMIN_USERS_SINGLE, params: { id: row.id } }"
                class="fw-semibold link-light link-underline link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover link-opacity-75-hover"
              >
                {{ row.getFullName() }}
              </RouterLink>
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
          <ActionsComponent :id="row.id" type="user" :deleteCallback="() => deleteUser(row)" />
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
