<script setup lang="ts">
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'
import ContentLayout from '@/features/administration/layouts/content.layout.vue'
import { useActivitiesTable } from '../composables/all-activities-table.composable.ts'
import moment from 'moment'
import { Action } from '@lib/dto/audit.dto.ts'
import { computed } from 'vue'
import { useActivityRoute } from '@/core/plugins/vuerouter.plugin.ts'

const route = useActivityRoute()
const params = computed(() => {
  return route.meta.activityLog
})

const { response, options, loading, tableColumns, getPaginatedData, view } = useActivitiesTable(params.value.domain)
await getPaginatedData(options.value)
</script>

<template>
  <ContentLayout :title="params.title" :subtitle="params.subtitle">
    <template #table>
      <TablePaginatedComponent
        nocheck
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :response="response"
        :caption="['administration.activity-logs.all-activities.caption', response.meta.itemCount]"
      >
        <template v-slot>
          <div class="d-flex gap-2">
            <ActionsComponent
              size="lg"
              :payload="[
                {
                  title: 'actions.refresh',
                  icon: ['fas', 'refresh'],
                  callback: () => getPaginatedData(options),
                  theme: 'light'
                }
              ]"
            />
          </div>
        </template>

        <template #time="{ row }">
          <div class="d-flex flex-column">
            <small
              class="fst-italic text-info underline help"
              v-tooltip="{ text: moment(row.createdAt).format('llll'), position: 'bottom', trigger: 'hover' }"
            >
              {{ moment(row.createdAt).fromNow() }}
            </small>
          </div>
        </template>

        <template #actor="{ row }">
          <div class="d-flex flex-column overflow-hidden" style="max-width: 20rem">
            <small class="text-light-alt text-truncate">
              <span
                class="text-primary"
                :style="{
                  'text-decoration': 'underline',
                  'text-underline-offset': '0.25em !important'
                }"
                >{{ String(row.actorType).toUpperCase() }}:</span
              >&#32;<span>
                {{ row.actorDisplay ?? row.actorIp }}
              </span>
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
          <div class="d-flex flex-column overflow-hidden" style="max-width: 25rem">
            <small class="text-light-alt text-truncate">
              <span class="text-primary underline">{{ String(row.subDomain).toUpperCase() }}:</span>&#32;<span>
                {{ row.entityDisplay }}
              </span>
            </small>
          </div>
        </template>

        <template #reason="{ row }">
          <div class="d-flex flex-column overflow-hidden" style="max-width: 30rem">
            <small class="text-light-alt text-truncate">{{ row.reason }}</small>
          </div>
        </template>

        <template #actions="{ row }">
          <ActionsComponent
            :payload="[
              {
                title: 'actions.view',
                icon: ['fas', 'eye'],
                callback: () => view(row),
                theme: 'info'
              }
            ]"
          >
            <small class="text-primary fst-italic text-nowrap">
              <span class="underline">{{ $t('administration.activity-logs.item') }}:</span>&#32;<span
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
