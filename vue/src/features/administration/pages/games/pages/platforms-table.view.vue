<script setup lang="ts">
import moment from 'moment'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ActionsComponent from '@/shared/components/dropdown/table-actions.dropdown.component.vue'
import ContentLayout from '@/features/administration/layouts/content.layout.vue'
import { usePlatformTable } from '../composables/platform-table.composable.ts'

const {
  t,
  response,
  options,
  loading,
  tableColumns,
  createPlatform,
  getPaginatedData,
  removePlatform,
  updatePlatform
} = usePlatformTable()

await getPaginatedData(options.value)
</script>

<template>
  <ContentLayout
    title="administration.games-and-software.platforms.title"
    subtitle="administration.games-and-software.platforms.subtitle"
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
            'administration.games-and-software.platforms.caption',
            {
              start: (response.meta.page - 1) * response.meta.take + 1,
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
                  callback: createPlatform,
                  theme: 'success'
                }
              ]"
            />
          </div>
        </template>

        <template #platform="{ row }">
          <div class="d-flex flex-column">
            <small class="text-muted fst-italic">{{ row.id }}</small>
            <p class="fw-semibold text-light">{{ row.name }}</p>
          </div>
        </template>
        <template #count="{ row }">
          <small class="fw-semibold" :class="row.gameCount ? 'text-light' : 'text-muted'">
            {{ row.gameCount }}
          </small>
        </template>
        <template #release="{ row }">
          <small class="fw-semibold text-muted">
            {{ moment(row.release_date).format('L') }}
          </small>
        </template>
        <template #actions="{ row }">
          <ActionsComponent
            :payload="[
              {
                title: 'actions.update',
                icon: ['fas', 'pen-to-square'],
                callback: () => updatePlatform(row),
                theme: 'warning'
              },
              {
                title: 'actions.delete',
                icon: ['fas', 'trash-can'],
                callback: () => removePlatform(row),
                theme: 'danger'
              }
            ]"
          >
            <small class="text-primary fst-italic text-nowrap">
              {{ $t('administration.games-and-software.platforms.item') }}:
              <span class="text-light-alt">{{ row.id }}</span>
            </small>
          </ActionsComponent>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
