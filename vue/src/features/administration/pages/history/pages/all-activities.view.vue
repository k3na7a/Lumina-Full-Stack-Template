<script setup lang="ts">
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'
import ContentLayout from '@/features/administration/layouts/content.layout.vue'
import { useActivitiesTable } from '../composables/all-activities-table.composable.ts'
import moment from 'moment'
import { Action } from '@lib/dto/audit.dto.ts'

const { t, response, options, loading, tableColumns, getPaginatedData } = useActivitiesTable()

await getPaginatedData(options.value)
</script>

<template>
  <ContentLayout
    title="administration.activity-logs.all-activities.title"
    subtitle="administration.activity-logs.all-activities.subtitle"
  >
    <template #table>
      <TablePaginatedComponent
        nocheck
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :caption="
          t(
            'administration.activity-logs.all-activities.caption',
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

        <template #time="{ row }">
          <div class="d-flex flex-column">
            <small
              class="text-info"
              style="cursor: help"
              v-tooltip="{ text: moment(row.createdAt).format('llll'), position: 'bottom', trigger: 'hover' }"
              >{{ moment(row.createdAt).fromNow() }}</small
            >
          </div>
        </template>

        <template #actor="{ row }">
          <div class="d-flex flex-column overflow-hidden" style="max-width: 20rem">
            <small class="text-light-alt text-truncate">
              <span class="text-primary">{{ String(row.actorType).toUpperCase() }}</span
              >:<span>{{ row.actorDisplay ?? row.actorId }}</span>
            </small>
          </div>
        </template>

        <template #action="{ row }">
          <div class="d-flex flex-column">
            <small class="fw-semibold">
              <span
                :class="{
                  'text-danger': row.action === Action.DELETE,
                  'text-warning': row.action === Action.UPDATE,
                  'text-success': row.action === Action.CREATE
                }"
              >
                {{ String(row.action).toUpperCase() }}
              </span>
            </small>
          </div>
        </template>

        <template #entity="{ row }">
          <div class="d-flex flex-column overflow-hidden" style="max-width: 30rem">
            <small class="text-light-alt text-truncate">
              <span class="text-primary">{{ String(row.subDomain).toUpperCase() }}</span
              >:<span>{{ row.entityDisplay }}</span>
            </small>
          </div>
        </template>

        <template #reason="{ row }">
          <div class="d-flex flex-column overflow-hidden" style="max-width: 25rem">
            <small class="text-light-alt text-truncate">{{ row.reason }}</small>
          </div>
        </template>

        <template #actions>
          <ActionsComponent disabled :payload="[]" />
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
