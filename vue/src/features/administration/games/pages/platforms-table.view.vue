<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocationQuery, useRoute } from 'vue-router'
import moment from 'moment'

import { defaultOptions, sort, tableColumns } from '../schema/platforms.schema.ts'
import { parseQuery } from '@/core/utilities/parse-query.util.ts'
import { usePlatformAdminHandler } from '../handlers/platforms.handler.ts'
import { PaginationOptions, PaginationMeta, PaginationDto } from '@/core/apis/dto/pagination.dto.ts'
import { PlatformDto } from '@/core/apis/dto/platform.dto.ts'

import ContentLayout from '@/layouts/admin/components/admin-layout.component.vue'
import TablePaginatedComponent from '@/shared/components/table/paginated.component.vue'
import ActionsComponent from '@/layouts/admin/components/actions.component.vue'

const $route = useRoute()

const { t } = useI18n()
const handler = usePlatformAdminHandler(t)

const loading = ref<boolean>(false)
const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))
const response = reactive<{ data: Array<PlatformDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await handler
    .getPaginated(payload)
    .then((res: PaginationDto<PlatformDto>) => {
      response.data = res.data
      response.meta = res.meta
    })
    .finally(() => (loading.value = false))
}

function createPlatform(): void {
  handler.create((_: PlatformDto) => getPaginatedData(options.value))
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
          <small class="fw-semibold text-muted">
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

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

.cover-icon {
  height: 5rem;
  width: 3.8rem;
  object-fit: cover;
  border: 0.1rem $secondary dashed;
}
</style>
