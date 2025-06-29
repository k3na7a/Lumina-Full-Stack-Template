<script setup lang="ts">
import moment from 'moment'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ActionsComponent from '@/shared/components/dropdown/actions-dropdown.component.vue'
import ContentLayout from '@/views/administration/layouts/content.layout.vue'
import { usePlatformTable } from '../composables/platform-table.composable.ts'

const { t, response, options, loading, tableColumns, sort, createPlatform, getPaginatedData } = usePlatformTable()

await getPaginatedData(options.value)
</script>

<template>
  <ContentLayout
    title="administration.games-and-software.games.title"
    subtitle="administration.games-and-software.games.subtitle"
  >
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :sort-options="sort"
        :caption="
          t(
            'administration.games-and-software.games.caption',
            { showing: response.data.length },
            response.meta.itemCount
          )
        "
      >
        <template v-slot>
          <div class="d-flex gap-2">
            <button class="btn btn-dark btn-icon" type="button" @click="createPlatform">
              <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
            </button>
          </div>
        </template>

        <template #platform="{ row }">
          <div class="d-flex flex-column">
            <small class="text-muted fst-italic">
              {{ row.id }}
            </small>
            <p class="fw-semibold text-light">
              {{ row.name }}
            </p>
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
          <ActionsComponent :id="row.id" type="platform" />
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
