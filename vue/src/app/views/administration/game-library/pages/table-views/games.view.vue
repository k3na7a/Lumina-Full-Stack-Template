<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import moment from 'moment'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'

import { Order, PaginationDto, PaginationMeta, PaginationOptions } from '@/library/data/dto/pagination.dto'
import { GameLibraryService } from '../../service/game-library.service'
import { useI18n } from 'vue-i18n'
import { GameDto, GamePagineationOptions } from '@/library/data/dto/games/game.dto'
import { SeriesDto } from '@/library/data/dto/games/series.dto'

import SearchPaginatedInput from '@/app/components/inputs/search-paginated-input.input.vue'

import { PlatformDto } from '@/library/data/dto/games/platform.dto'
import { GenreDto } from '@/library/data/dto/games/genre.dto'
import { GametypeDto } from '@/library/data/dto/games/gametype.dto'
import { PublisherDto } from '@/library/data/dto/games/publisher.dto'
import { DeveloperDto } from '@/library/data/dto/games/developer.dto'

const { getPaginated, create } = GameLibraryService.games
const { t } = useI18n()

import { ROUTE_NAMES } from '@/app/router/routes'
import ContentLayout from '../../../layouts/content.layout.vue'

const loading = ref<boolean>(true)
const options = reactive<GamePagineationOptions>({
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'game.release_date',
  search: undefined,
  expanded: true,
  platforms: [],
  genres: [],
  series: [],
  developers: [],
  publishers: [],
  gametypes: []
})

const response = reactive<{ data: Array<any>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: options, itemCount: 0 })
})

const selectedPlatforms = ref<PlatformDto[]>([])
const selectedGenres = ref<Array<GenreDto>>([])
const selectedSeries = ref<Array<SeriesDto>>([])
const selectedDevelopers = ref<Array<DeveloperDto>>([])
const selectedPublishers = ref<Array<PublisherDto>>([])
const selectedGametypes = ref<Array<GametypeDto>>([])

const filters: {
  label: string
  name: string
  value: Array<any>
  callback: (params: PaginationOptions) => Promise<PaginationDto<any>>
  onUpdate: (value: any[] | undefined) => void
}[] = [
  {
    label: 'administration.game-library.platforms.label',
    name: 'platforms',
    value: selectedPlatforms.value,
    callback: GameLibraryService.platforms.getPaginated,
    onUpdate: (value: PlatformDto[] | undefined) => {
      options.platforms = value?.map((e) => e.slug) || []
      options.page = 1
    }
  },
  {
    label: 'administration.game-library.genres.label',
    name: 'genres',
    value: selectedGenres.value,
    callback: GameLibraryService.genres.getPaginated,
    onUpdate: (value: GenreDto[] | undefined) => {
      options.genres = value?.map((e) => e.slug) || []
      options.page = 1
    }
  },
  {
    label: 'administration.game-library.series.label',
    name: 'series',
    value: selectedSeries.value,
    callback: GameLibraryService.series.getPaginated,
    onUpdate: (value: SeriesDto[] | undefined) => {
      options.series = value?.map((e) => e.slug) || []
      options.page = 1
    }
  },
  {
    label: 'administration.game-library.developers.label',
    name: 'developers',
    value: selectedDevelopers.value,
    callback: GameLibraryService.developers.getPaginated,
    onUpdate: (value: DeveloperDto[] | undefined) => {
      options.developers = value?.map((e) => e.slug) || []
      options.page = 1
    }
  },
  {
    label: 'administration.game-library.publishers.label',
    name: 'publishers',
    value: selectedPublishers.value,
    callback: GameLibraryService.publishers.getPaginated,
    onUpdate: (value: PublisherDto[] | undefined) => {
      options.publishers = value?.map((e) => e.slug) || []
      options.page = 1
    }
  },
  {
    label: 'administration.game-library.gametypes.label',
    name: 'gametypes',
    value: selectedGametypes.value,
    callback: GameLibraryService.gametypes.getPaginated,
    onUpdate: (value: GametypeDto[] | undefined) => {
      options.gametypes = value?.map((e) => e.slug) || []
      options.page = 1
    }
  }
]

const columns = [
  { name: 'name', label: 'forms.game' },
  { name: 'platforms', label: 'administration.game-library.platforms.label' },
  { name: 'status', label: 'forms.status' }
]

const sortOptions = [
  { sort: 'game.createdAt', order: Order.ASC, label: 'forms.oldest' },
  { sort: 'game.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'game.release_date', order: Order.ASC, label: 'forms.release-date' },
  { sort: 'game.name', order: Order.ASC, label: 'forms.name' }
]

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await Promise.all([getPaginated(payload)])
    .then(([res]: [PaginationDto<GameDto>]) => {
      response.data = res.data
      response.meta = res.meta
    })
    .finally(() => (loading.value = false))
}

await getPaginatedData(options)

watch(
  options,
  async (newVal: PaginationOptions): Promise<void> => {
    await getPaginatedData(newVal)
  },
  { deep: true }
)
</script>

<template>
  <ContentLayout title="administration.users.title" subtitle="administration.users.subtitle">
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :columns
        :sort-options
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :loading
        :caption="
          t('administration.game-library.games.caption', { showing: response.data.length }, response.meta.itemCount)
        "
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

        <template #filters>
          <div class="d-flex flex-column gap-1 flex-grow-1">
            <p class="fw-semibold text-light-alt">{{ $t('actions.filter-by') }}</p>
            <div class="d-flex flex-column gap-2">
              <template v-for="item of filters">
                <div class="d-flex align-items-md-center flex-column flex-md-row gap-2 row-gap-1">
                  <div class="overflow-hidden" style="min-width: 12.5rem">
                    <span class="text-muted fw-semibold text-truncate">{{ $t(item.label) }}:</span>
                  </div>
                  <SearchPaginatedInput
                    :name="item.name"
                    :value="item.value"
                    :callback="item.callback"
                    @update="item.onUpdate"
                  >
                    <template #option="{ option }">
                      {{ option.name }}
                    </template>
                  </SearchPaginatedInput>
                </div>
              </template>
            </div>
          </div>
        </template>

        <template #name="{ row }">
          <div class="d-flex flex-row gap-1 game-cell align-items-center" style="max-width: 30rem">
            <div v-if="row.cover">
              <img class="cover-icon" :src="row.cover" />
            </div>
            <div class="d-flex flex-column overflow-hidden">
              <RouterLink
                :to="{ name: ROUTE_NAMES.ADMIN_GAMES_SINGLE, params: { slug: row.slug } }"
                class="link-light link-opacity-75-hover text-truncate fw-semibold link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
              >
                {{ row.name }}
              </RouterLink>
              <small class="text-muted"> {{ moment(row.release_date).format('LL') }}</small>
              <div class="d-flex column-gap-1 flex-wrap align-items-center">
                <template v-for="(series, index) in row.series">
                  <small v-if="index" class="text-muted">/</small>
                  <button
                    class="btn btn-link fw-semibold"
                    type="button"
                    @click="!selectedSeries.some((e) => e.id == series.id) && selectedSeries.push(series)"
                  >
                    {{ series.name }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </template>

        <template #platforms="{ row }">
          <div class="d-flex flex-column m-0 gap-1" style="max-width: 20rem">
            <template v-for="platform of row.platforms.slice(0, 2)">
              <button
                class="btn btn-link fw-semibold d-flex justify-content-start w-100"
                type="button"
                @click="!selectedPlatforms.some((e) => e.id == platform.id) && selectedPlatforms.push(platform)"
              >
                <span class="text-truncate">{{ platform.name }}</span>
              </button>
            </template>
            <template v-if="row.platforms.length > 2">
              <div class="d-flex align-items-center">
                <small
                  class="fw-semibold text-info"
                  style="cursor: help"
                  v-tooltip="{ text: row.platforms.slice(2).map((value: PlatformDto) => value.name).join(', '), position: 'bottom', trigger: 'hover' }"
                  >+ {{ row.platforms.slice(2).length }} more</small
                >
              </div>
            </template>
          </div>
        </template>

        <template #status>
          <div class="d-flex flex-column m-0 gap-1" style="max-width: 20rem"></div>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>

<style lang="scss" scoped>
@import '@/library/sass/variables/index';

.cover-icon {
  height: 5rem;
  object-fit: cover;
  border: 0.1rem $secondary dashed;
}

.btn-link {
  font-size: $font-size-8;

  &.btn-header {
    font-size: $font-size-7;
  }
}

ul {
  padding-left: 1rem;
}
</style>
