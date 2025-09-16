<script setup lang="ts">
import ContentLayout from '@/features/administration/layouts/content.layout.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'

import { useRoleTable } from '../composables/role-table.composable'
import { PermissionDto } from '@lib/dto/permission.dto'

const max_permissions = 5

const { promise, create, update, remove, options, loading, response, tableColumns, t } = useRoleTable()
await promise()
</script>

<template>
  <ContentLayout
    title="administration.user-management.roles.title"
    subtitle="administration.user-management.roles.subtitle"
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
            'administration.user-management.roles.caption',
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

        <template #role="{ row }">
          <div class="d-flex flex-column flex-grow-1 overflow-hidden" style="max-width: 30rem">
            <small class="fst-italic text-muted">{{ row.id }}</small>
            <p class="fw-semibold text-light text-wrap">
              {{ row.label }}
            </p>
          </div>
        </template>

        <template #key="{ row }">
          <small class="text-warning">
            {{ row.name }}
          </small>
        </template>

        <template #permissions="{ row }">
          <div class="d-flex flex-column gap-1">
            <small v-for="permission in row.permissions.slice(0, max_permissions)" class="text-primary fw-semibold">
              {{ permission.name.toUpperCase() }}
            </small>
            <template v-if="row.permissions.length > max_permissions">
              <div class="d-flex align-items-center">
                <small
                  class="fw-semibold text-info"
                  style="cursor: help"
                  v-tooltip="{ text: row.permissions.slice(max_permissions).map((value: PermissionDto) => value.name).join(', '), position: 'bottom', trigger: 'hover' }"
                >
                  {{ $t('forms.plus-more', { more: row.permissions.slice(max_permissions).length }) }}
                </small>
              </div>
            </template>
          </div>
        </template>

        <template #actions="{ row }">
          <ActionsComponent
            :disabled="row.isSystemRole"
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
              {{ $t('administration.user-management.roles.item') }}:
              <span class="text-light-alt">{{ row.id }}</span>
            </small>
          </ActionsComponent>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
