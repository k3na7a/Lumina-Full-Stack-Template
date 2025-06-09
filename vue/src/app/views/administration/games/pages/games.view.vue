<script setup lang="ts">
import { PaginationMeta, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { defaultOptions, sort, tableColumns } from '../schema/games.schema'
import ContentLayout from '@/app/layouts/admin/components/admin-layout.component.vue'
import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'

const { t } = useI18n()

const loading = ref<boolean>(false)
const options = reactive<PaginationOptions>(defaultOptions)
const response = reactive<{ data: Array<{}>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
})
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
        :caption="t('administration.users.caption', { showing: response.data.length }, response.meta.itemCount)"
      >
        <template v-slot>
          <div class="d-flex gap-2">
            <button class="btn btn-dark btn-icon" disabled type="button">
              <font-awesome-icon size="lg" :icon="['fas', 'ellipsis-vertical']" />
            </button>
          </div>
        </template>
        <template #user="{ row }">Hello</template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
