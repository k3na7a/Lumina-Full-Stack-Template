<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import moment from 'moment'

import { PaginationDto, PaginationMeta, PaginationOptions } from '@/apis/localhost/dto/pagination.dto'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'

import { defaultOptions, sort, header } from '../config/platforms.config'
import { useI18n } from 'vue-i18n'

import { GameLibraryService } from '../service/game-library.service'
import { PlatformDto } from '@/apis/localhost/dto/game-library.dto'

const { create, getPaginated, remove, update } = GameLibraryService.platforms

const { t } = useI18n()
const loading = ref<boolean>(true)
const options = reactive<PaginationOptions>(defaultOptions)

const response = reactive<{ data: Array<PlatformDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await getPaginated(payload)
    .then((res: PaginationDto<PlatformDto>) => {
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
    :loading
    :rows="response.data"
    :pages="response.meta?.pageCount"
    :sort-options="sort"
    :caption="t('administration.games.platforms.caption', { showing: response.data.length }, response.meta.itemCount)"
  >
    <template v-slot>
      <button
        class="btn btn-dark btn-icon d-flex justify-content-center align-items-center"
        type="button"
        v-tooltip="{ text: $t('actions.create'), position: 'bottom', trigger: 'hover' }"
        @click="(_: MouseEvent) => create((_: PlatformDto) => { getPaginatedData(options) })"
      >
        <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
      </button>
    </template>

    <template #name="{ row }">
      <span class="fw-semibold">{{ row.name }}</span>
    </template>

    <template #abbreviation="{ row }">
      <small class="fw-semibold">{{ row.abbreviation }}</small>
    </template>

    <template #released="{ row }">
      {{ moment(row.release_date).format('L') }}
    </template>

    <template #created="{ row }">
      <small class="fw-semibold">{{ moment(row.createdAt).fromNow() }}</small>
    </template>

    <template #actions="{ row }">
      <div class="d-flex gap-1 flex-nowrap">
        <button
          v-tooltip="{ text: $t('actions.update'), position: 'bottom', trigger: 'hover' }"
          class="btn btn-dark btn-icon-sm px-0"
          type="button"
          @click="(_: MouseEvent) => update(row, (_: PlatformDto) => { getPaginatedData(options) })"
        >
          <div class="d-flex flex-column align-items-center text-warning">
            <font-awesome-icon size="sm" :icon="['fas', 'pencil']" />
          </div>
        </button>
        <button
          v-tooltip="{ text: $t('actions.delete'), position: 'bottom', trigger: 'hover' }"
          class="btn btn-dark btn-icon-sm px-0"
          type="button"
          @click="(_: MouseEvent) => remove(row, (_: PlatformDto) => { getPaginatedData(options) })"
        >
          <div class="d-flex flex-column align-items-center text-danger">
            <font-awesome-icon size="sm" :icon="['fas', 'trash-can']" />
          </div>
        </button>
      </div>
    </template>
  </TablePaginatedComponent>
</template>
