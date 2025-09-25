<script setup lang="ts">
import moment from 'moment'

import ContentLayout from '@/features/administration/layouts/content.layout.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'

import { usePermissionsTable } from '../composables/permissions-table.composable.ts'
import { iPermissionDomain } from '@lib/constants/permissions.constants.ts'

const { promise, create, update, remove, options, loading, response, tableColumns } = usePermissionsTable()
await promise()
</script>

<template>
  <ContentLayout
    title="administration.user-management.permissions.title"
    subtitle="administration.user-management.permissions.subtitle"
  >
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :caption="['administration.user-management.permissions.caption', response.meta.itemCount]"
      >
        <template v-slot>
          <div class="d-flex gap-2">
            <ActionsComponent
              size="lg"
              :payload="[
                {
                  title: 'actions.refresh',
                  icon: ['fas', 'refresh'],
                  callback: promise,
                  theme: 'light'
                },
                {
                  title: 'actions.create',
                  icon: ['fas', 'plus'],
                  callback: create,
                  theme: 'success'
                }
              ]"
            />
          </div>
        </template>

        <template #permission="{ row }">
          <div class="d-flex flex-column flex-grow-1 overflow-hidden" style="max-width: 30rem">
            <small class="fst-italic text-muted">{{ String(row.name).toUpperCase() }}</small>
            <p class="fw-semibold text-light text-wrap">
              {{ row.label }}
            </p>
          </div>
        </template>

        <template #domain="{ row }">
          <small
            class="fw-semibold text-info underline help"
            v-tooltip="{ text: iPermissionDomain[row.domain].description, position: 'bottom', trigger: 'hover' }"
          >
            {{ iPermissionDomain[row.domain].name }}
          </small>
        </template>

        <template #created="{ row }">
          <small class="fw-semibold text-muted">
            {{ moment(row.createdAt).format('L') }}
          </small>
        </template>

        <template #actions="{ row }">
          <ActionsComponent
            :disabled="row.isSystemPermission"
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
              <span class="underline">{{ $t('administration.user-management.permissions.item') }}:</span>&#32;<span
                class="text-light-alt"
              >
                {{ row.id }}
              </span>
            </small>
          </ActionsComponent>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
