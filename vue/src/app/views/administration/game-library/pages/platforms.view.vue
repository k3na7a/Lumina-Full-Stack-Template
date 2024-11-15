<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import moment from 'moment'

import { Order, PaginationDto, PaginationMeta, PaginationOptions, SortOptions } from '@/library/data/dto/pagination.dto'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'

import { useI18n } from 'vue-i18n'

import { GameLibraryService } from '../service/game-library.service'
import { PlatformDto } from '@/library/data/dto/games/platform.dto'

const { create, getPaginated, remove, update } = GameLibraryService.platforms

const { t } = useI18n()
const loading = ref<boolean>(true)
const options = reactive<PaginationOptions>({
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'platform.release_date',
  search: undefined
})

const header = [
  { name: 'name', label: 'forms.platform' },
  { name: 'created', label: 'forms.created' },
  { name: 'actions', label: 'forms.actions' }
]

const sort: Array<SortOptions> = [
  { sort: 'platform.createdAt', order: Order.ASC, label: 'forms.oldest' },
  { sort: 'platform.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'platform.release_date', order: Order.ASC, label: 'forms.release-date' }
]

const response = reactive<{ data: Array<PlatformDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: options, itemCount: 0 })
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

await getPaginatedData(options)
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
    :caption="
      t('administration.game-library.platforms.caption', { showing: response.data.length }, response.meta.itemCount)
    "
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
      <div class="d-flex flex-column overflow-hidden" style="max-width: 25rem">
        <span class="fw-semibold text-truncate">{{ row.name }}</span>
        <small class="text-primary fw-semibold">
          {{ row.abbreviation }}
        </small>
        <small class="text-muted">{{ moment(row.release_date).format('L') }}</small>
      </div>
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
