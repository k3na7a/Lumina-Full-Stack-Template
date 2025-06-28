<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocationQuery, useRoute } from 'vue-router'
import moment from 'moment'

import { parseQuery } from '@/core/utils/parse-query.util'
import { GameDto } from '@/core/apis/dto/game.dto'
import { PaginationOptions, PaginationMeta, PaginationDto } from '@/core/apis/dto/pagination.dto'

import TablePaginatedComponent from '@/shared/components/table/paginated.component.vue'
import ActionsComponent from '@/shared/components/dropdown/actions-dropdown.component.vue'

import ContentLayout from '@/views/administration/layouts/content-view-admin.component.vue'

import { defaultOptions, sort, tableColumns } from '../schema/games.schema'
import { useGameAdminHandler } from '../composables/games.handler'

const $route = useRoute()

const { t } = useI18n()
const handler = useGameAdminHandler(t)

const loading = ref<boolean>(false)
const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))
const response = reactive<{ data: Array<GameDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await handler
    .getPaginated(payload)
    .then((res: PaginationDto<GameDto>) => {
      response.data = res.data
      response.meta = res.meta
    })
    .finally(() => (loading.value = false))
}

await getPaginatedData(options.value)

watch(
  () => $route.query,
  async (newQuery: LocationQuery): Promise<void> => {
    const parsed = parseQuery<PaginationOptions>(newQuery, defaultOptions)
    await getPaginatedData(parsed)
  }
)
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
            <button
              class="btn btn-dark btn-icon"
              type="button"
              @click="() => handler.create((_: GameDto) => getPaginatedData(options))"
            >
              <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
            </button>
          </div>
        </template>
        <template #user="{ row }">
          <div class="d-flex flex-row align-items-center gap-2">
            <img class="cover-icon" :src="row.cover" />
            <div class="d-flex flex-column">
              <small class="text-muted fst-italic">
                {{ row.id }}
              </small>
              <p class="fw-semibold text-light">
                {{ row.name }}
              </p>
            </div>
          </div>
        </template>
        <template #platforms="{ row }">
          <small class="fw-semibold text-muted">
            <template v-if="row.platforms.length"></template>
            <template v-else>-</template>
          </small>
        </template>
        <template #release="{ row }">
          <small class="fw-semibold text-muted">
            {{ moment(row.release_date).format('L') }}
          </small>
        </template>
        <template #actions="{ row }">
          <ActionsComponent
            :id="row.id"
            type="game"
            :updateCallback="() => handler.update(row, (_: GameDto) => getPaginatedData(options))"
            :deleteCallback="() => handler.remove(row, (_: GameDto) => getPaginatedData(options))"
          />
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

.cover-icon {
  height: 3rem;
  width: 2.3rem;
  object-fit: cover;
  border: 0.1rem $secondary dashed;
}
</style>
