<script setup lang="ts">
import moment from 'moment'

import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ContentLayout from '@/features/administration/layouts/content.layout.vue'
import { useUserTable } from '../composables/user-table.composable'

const { promise, update, remove, options, loading, response, tableColumns, t } = useUserTable()
await promise()
</script>

<template>
  <ContentLayout
    title="administration.user-management.users.title"
    subtitle="administration.user-management.users.subtitle"
  >
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :caption="
          t(
            'administration.user-management.users.caption',
            {
              start: (response.meta.page - 1) * response.meta.take + (response.data.length ? 1 : 0),
              end: (response.meta.page - 1) * response.meta.take + response.data.length
            },
            response.meta.itemCount
          )
        "
      >
        <template v-slot>
          <div class="d-flex gap-2">
            <ActionsComponent disabled size="lg" :payload="[]" />
          </div>
        </template>

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

        <template #roles="{ row }">
          <div class="d-flex align-items-center">
            <template v-if="row.roles.length">
              <div class="d-flex flex-column gap-1">
                <template v-for="role in row.roles">
                  <small
                    v-if="role.description"
                    class="fw-semibold text-info"
                    style="cursor: help"
                    v-tooltip="{ text: role.description, position: 'bottom', trigger: 'hover' }"
                  >
                    {{ role.name }}
                  </small>
                  <small v-else class="fw-semibold text-muted">
                    {{ role.name }}
                  </small>
                </template>
              </div>
            </template>
            <template v-else>
              <small class="text-muted">...</small>
            </template>
          </div>
        </template>

        <template #created="{ row }">
          <small class="fw-semibold text-muted">
            {{ moment(row.createdAt).format('L') }}
          </small>
        </template>

        <template #actions="{ row }">
          <ActionsComponent
            :payload="[
              {
                title: 'actions.update',
                icon: ['fas', 'pen-to-square'],
                callback: () => update(row),
                theme: 'warning'
              },
              { title: 'actions.delete', icon: ['fas', 'trash-can'], callback: () => remove(row), theme: 'danger' }
            ]"
          >
            <small class="text-primary fst-italic text-nowrap">
              {{ $t('administration.user-management.users.item') }}:
              <span class="text-light-alt">{{ row.id }}</span>
            </small>
          </ActionsComponent>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
