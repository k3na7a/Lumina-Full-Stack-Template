<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import moment from 'moment'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'
import { defaultOptions, sort, header } from '../config/games.config'

import { PaginationDto, PaginationMeta, PaginationOptions } from '@/apis/localhost/dto/pagination.dto'
import { GameLibraryService } from '../service/game-library.service'
import { GameDto } from '@/apis/localhost/dto/game-library.dto'
import { useI18n } from 'vue-i18n'

const { getPaginated, create, remove } = GameLibraryService.games
const { t } = useI18n()

const loading = ref<boolean>(true)
const options = reactive<PaginationOptions>(defaultOptions)
const response = reactive<{ data: Array<any>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await getPaginated(payload)
    .then((res: PaginationDto<GameDto>) => {
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
  <div class="d-flex flex-column gap-2">
    <TablePaginatedComponent
      v-model:options="options"
      :columns="header"
      :sort-options="sort"
      :rows="response.data"
      :pages="response.meta?.pageCount"
      :caption="t('administration.games.games.caption', { showing: response.data.length }, response.meta.itemCount)"
    >
      <template v-slot>
        <button
          class="btn btn-dark btn-icon d-flex justify-content-center align-items-center gap-1"
          type="button"
          @click="(_: MouseEvent) => create((_: GameDto) => { getPaginatedData(options) })"
          v-tooltip="{ text: $t('actions.create'), position: 'bottom', trigger: 'hover' }"
        >
          <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
        </button>
      </template>

      <template #cover="{ row }">
        <img v-if="row.cover" class="cover-icon" :src="row.cover" />
        <small class="fw-semibold" v-else>N/A</small>
      </template>

      <template #name="{ row }">
        <span class="fw-semibold">{{ row.name }}</span>
      </template>

      <template #platforms="{ row }">
        <div class="d-flex flex-column m-0 gap-1">
          <template v-for="platform of row.platforms">
            <span>{{ platform.name }}</span>
          </template>
        </div>
      </template>

      <template #genres="{ row }">
        <div class="d-flex flex-column m-0 gap-1">
          <template v-for="genre of row.genres">
            <span>{{ genre.name }}</span>
          </template>
        </div>
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
            disabled
          >
            <div class="d-flex flex-column align-items-center text-warning">
              <font-awesome-icon size="sm" :icon="['fas', 'pencil']" />
            </div>
          </button>
          <button
            v-tooltip="{ text: $t('actions.delete'), position: 'bottom', trigger: 'hover' }"
            class="btn btn-dark btn-icon-sm px-0"
            type="button"
            @click="() => remove(row, (_: GameDto) => { getPaginatedData(options) })"
          >
            <div class="d-flex flex-column align-items-center text-danger">
              <font-awesome-icon size="sm" :icon="['fas', 'trash-can']" />
            </div>
          </button>
        </div>
      </template>
    </TablePaginatedComponent>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.cover-icon {
  height: 5rem;
  object-fit: cover;
  border: 0.1rem $secondary dashed;
}
</style>
