<script setup lang="ts">
import ContentLayout from '@/features/administration/layouts/content.layout.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'

import { usePermissionsTable } from '../composables/permissions-table.composable.ts'

const { promise, create, update, remove, options, loading, response, tableColumns, t } = usePermissionsTable()
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
        :caption="
          t(
            'administration.user-management.permissions.caption',
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
            <ActionsComponent
              size="lg"
              :payload="[
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
            <small class="fst-italic text-muted">{{ row.id }}</small>
            <p class="fw-semibold text-light text-wrap">
              {{ row.label }}
              <small class="fw-normal text-muted">:: {{ row.description }}</small>
            </p>
          </div>
        </template>

        <template #domain="{ row }">
          <small class="fw-semibold text-light-alt">{{ row.domain }}</small>
        </template>

        <template #key="{ row }">
          <small class="fst-italic text-warning">
            {{ row.name.toUpperCase() }}
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
              {{ $t('administration.user-management.permissions.item') }}:
              <span class="text-light-alt">{{ row.id }}</span>
            </small>
          </ActionsComponent>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
