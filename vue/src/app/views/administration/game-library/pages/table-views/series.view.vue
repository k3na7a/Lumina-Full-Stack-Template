<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { Order, PaginationDto, PaginationMeta, PaginationOptions } from '@/library/data/dto/pagination.dto'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'
import { GameLibraryService } from '../../service/game-library.service'
import { SeriesDto } from '@/library/data/dto/games/series.dto'

import ContentLayout from '../../../layouts/content.layout.vue'

const { t } = useI18n()

const { create, getPaginated, update, remove } = GameLibraryService.series

const loading = ref<boolean>(true)
const options = reactive<PaginationOptions>({
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'series.name',
  search: undefined
})

const columns = [
  { name: 'name', label: 'forms.name' },
  { name: 'actions', label: 'forms.actions' }
]

const sortOptions = [
  { sort: 'series.createdAt', order: Order.ASC, label: 'forms.oldest' },
  { sort: 'series.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'series.name', order: Order.ASC, label: 'forms.name' }
]

const response = reactive<{ data: Array<SeriesDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: options, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await getPaginated(payload)
    .then((res: PaginationDto<SeriesDto>) => {
      response.data = res.data
      response.meta = res.meta
    })
    .finally(() => (loading.value = false))
}

await getPaginatedData(options)
watch(options, async (newVal: PaginationOptions): Promise<void> => {
  await getPaginatedData(newVal)
})
</script>

<template>
  <ContentLayout title="administration.users.title" subtitle="administration.users.subtitle">
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :columns
        :rows="response.data"
        :loading
        :pages="response.meta?.pageCount"
        :sort-options
        :caption="
          t('administration.game-library.series.caption', { showing: response.data.length }, response.meta.itemCount)
        "
      >
        <template v-slot>
          <button
            class="btn btn-dark btn-icon d-flex justify-content-center align-items-center"
            type="button"
            v-tooltip="{ text: $t('actions.create'), position: 'bottom', trigger: 'hover' }"
            @click="(_: MouseEvent) => create((_: SeriesDto) => { getPaginatedData(options) })"
          >
            <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
          </button>
        </template>

        <template #name="{ row }">
          <span class="fw-semibold">{{ row.name }}</span>
        </template>

        <template #actions="{ row }">
          <div class="d-flex gap-1 flex-nowrap">
            <button
              v-tooltip="{ text: $t('actions.update'), position: 'bottom', trigger: 'hover' }"
              class="btn btn-dark btn-icon-sm px-0"
              type="button"
              @click="(_: MouseEvent) => update(row, (_: SeriesDto) => { getPaginatedData(options) })"
            >
              <div class="d-flex flex-column align-items-center text-warning">
                <font-awesome-icon size="sm" :icon="['fas', 'pencil']" />
              </div>
            </button>
            <button
              v-tooltip="{ text: $t('actions.delete'), position: 'bottom', trigger: 'hover' }"
              class="btn btn-dark btn-icon-sm px-0"
              type="button"
              @click="(_: MouseEvent) => remove(row, (_: SeriesDto) => { getPaginatedData(options) })"
            >
              <div class="d-flex flex-column align-items-center text-danger">
                <font-awesome-icon size="sm" :icon="['fas', 'trash-can']" />
              </div>
            </button>
          </div>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
