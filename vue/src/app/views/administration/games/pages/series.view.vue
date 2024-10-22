<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/data/dto/pagination.dto'
import { defaultOptions, sort, header } from '../config/series.config'

import TablePaginatedComponent from '@/library/components/table/paginated.component.vue'
import { GameLibraryService } from '../service/game-library.service'
import { SeriesDto } from '@/library/data/dto/games/series.dto'

const { t } = useI18n()

const { create, getPaginated, update, remove } = GameLibraryService.series

const loading = ref<boolean>(true)
const options = reactive<PaginationOptions>(defaultOptions)

const response = reactive<{ data: Array<SeriesDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
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

await getPaginatedData(defaultOptions)
watch(options, async (newVal: PaginationOptions): Promise<void> => {
  await getPaginatedData(newVal)
})
</script>

<template>
  <TablePaginatedComponent
    v-model:options="options"
    :columns="header"
    :rows="response.data"
    :loading
    :pages="response.meta?.pageCount"
    :sort-options="sort"
    :caption="t('administration.games.series.caption', { showing: response.data.length }, response.meta.itemCount)"
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

    <template #created="{ row }">
      <small class="text-muted">{{ moment(row.createdAt).startOf('second').format('L') }}</small>
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
