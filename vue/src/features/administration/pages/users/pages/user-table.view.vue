<script setup lang="ts">
import moment from 'moment'

import { UserDto } from '@/library/dto/user.dto'

import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'

import ContentLayout from '@/features/administration/layouts/content.layout.vue'

import { tableColumns, sort, badges } from '../config/users-table.config'
import { useUserTable } from '../composables/user-table.composable'

const { getPaginatedData, options, loading, response, handler, t } = useUserTable()

await getPaginatedData(options.value)
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
            <small class="fw-semibold text-truncate text-primary" :class="`text-light-alt`">
              {{ $t(badges[row.role].label).toLowerCase() }}
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
