<script lang="ts" setup>
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import { reactive, ref } from 'vue'

import SearchPaginatedInput from '@/app/components/inputs/search-paginated-input.input.vue'
import SelectInput from '@/app/components/inputs/select.input.vue'
import TextInput from '@/app/components/inputs/text.input.vue'
import DateInput from '@/app/components/inputs/date.input.vue'

import { GameDto, igame } from '@/library/data/dto/games/game.dto'
import { GametypeDto } from '@/library/data/dto/games/gametype.dto'
import { GameLibraryService } from '../../service/game-library.service'
import { DeveloperDto } from '@/library/data/dto/games/developer.dto'
import { GenreDto } from '@/library/data/dto/games/genre.dto'
import { PlatformDto } from '@/library/data/dto/games/platform.dto'
import { PublisherDto } from '@/library/data/dto/games/publisher.dto'
import { SeriesDto } from '@/library/data/dto/games/series.dto'
import { useFormUtil } from '@/library/utilities/helpers/forms.util'
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/app/router/routes'

const gametypes = ref<Array<GametypeDto>>([])

const props = defineProps<{ game: GameDto }>()

const router = useRouter()

const _game = reactive<GameDto>(props.game)

const loading = ref<boolean>(true)
const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  platforms: Yup.array<PlatformDto>().optional(),
  genres: Yup.array<GenreDto>().optional(),
  release_date: Yup.date().required(),
  series: Yup.array<SeriesDto>().optional(),
  children: Yup.array<GameDto>().optional(),
  developers: Yup.array<DeveloperDto>().optional(),
  publishers: Yup.array<PublisherDto>().optional(),
  gametype: Yup.mixed<GametypeDto>().required(),
  slug: Yup.string().required()
})

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: igame) => {
  loading.value = true
  await GameLibraryService.games
    .update(_game.id, values, (result) => {
      Object.assign(_game, result)
      router.push({ name: ROUTE_NAMES.ADMIN_GAMES_SINGLE, params: { slug: result.slug } })
    })
    .finally(() => {
      loading.value = false
    })
})

async function getFormData(): Promise<void> {
  loading.value = true
  await Promise.all([GameLibraryService.gametypes.getAll()])
    .then(([gametype_list]: [Array<GametypeDto>]) => {
      gametypes.value = gametype_list.sort(function (a: GametypeDto, b: GametypeDto) {
        return a.name.localeCompare(b.name)
      })
    })
    .finally(() => {
      loading.value = false
    })
}

await getFormData()
</script>

<template>
  <div>
    <Form
      @submit="onSubmit"
      v-slot="{ meta, values }"
      :validation-schema="validationSchema"
      :initial-values="{
        ..._game,
        children: _game.children
      }"
      :key="JSON.stringify(_game)"
    >
      <div class="section d-flex flex-column gap-3 flex-sm-row p-3">
        <div class="row-header">
          <h6 class="fw-bold">
            {{ $t('administration.game-library.games.single.information.info-header') }}
          </h6>
        </div>
        <div class="d-flex flex-column flex-grow-1">
          <div class="row gy-2">
            <div class="col-12 d-flex flex-column gap-1">
              <TextInput name="name" type="text" />
              <small class="text-light-alt">{{ $t('forms.name') }}</small>
            </div>

            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <DateInput name="release_date" />
              <small class="text-light-alt">{{ $t('forms.release-date') }}</small>
            </div>
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <SelectInput name="gametype" :options="gametypes">
                <template #option="{ option }">
                  {{ option.name }}
                </template>
              </SelectInput>
              <small class="text-light-alt">{{ $t('forms.gametype') }}</small>
            </div>
          </div>
        </div>
      </div>
      <div class="section d-flex flex-column gap-3 flex-sm-row p-3">
        <div class="row-header">
          <h6 class="fw-bold">{{ $t('forms.related-content') }}</h6>
        </div>
        <div class="d-flex flex-column flex-grow-1">
          <div class="row">
            <div class="col-12 d-flex flex-column gap-1">
              <SearchPaginatedInput name="children" :callback="GameLibraryService.games.getPaginated">
                <template #option="{ option }">
                  <span>{{ option.release_date.getFullYear() }} - {{ option.name }}</span>
                </template>
              </SearchPaginatedInput>
              <small class="text-light-alt">{{ $t('forms.related-content-subheader') }}</small>
            </div>
          </div>
        </div>
      </div>
      <div class="section d-flex flex-column gap-3 flex-sm-row p-3">
        <div class="row-header">
          <h6 class="fw-bold">{{ $t('forms.tags') }}</h6>
        </div>
        <div class="row gy-2">
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <SearchPaginatedInput name="platforms" :callback="GameLibraryService.platforms.getPaginated">
              <template #option="{ option }">
                <span>{{ option.name }}</span>
              </template>
            </SearchPaginatedInput>
            <small class="text-light-alt">{{ $t('forms.platforms') }}</small>
          </div>

          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <SearchPaginatedInput name="genres" :callback="GameLibraryService.genres.getPaginated">
              <template #option="{ option }">
                <span>{{ option.name }}</span>
              </template>
            </SearchPaginatedInput>
            <small class="text-light-alt">{{ $t('forms.genres') }}</small>
          </div>

          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <SearchPaginatedInput name="series" :callback="GameLibraryService.series.getPaginated">
              <template #option="{ option }">
                <span>{{ option.name }}</span>
              </template>
            </SearchPaginatedInput>
            <small class="text-light-alt">{{ $t('forms.series') }}</small>
          </div>
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <SearchPaginatedInput name="developers" :callback="GameLibraryService.developers.getPaginated">
              <template #option="{ option }">
                <span>{{ option.name }}</span>
              </template>
            </SearchPaginatedInput>
            <small class="text-light-alt">{{ $t('forms.developers') }}</small>
          </div>

          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <SearchPaginatedInput name="publishers" :callback="GameLibraryService.publishers.getPaginated">
              <template #option="{ option }">
                <span>{{ option.name }}</span>
              </template>
            </SearchPaginatedInput>
            <small class="text-light-alt">{{ $t('forms.publishers') }}</small>
          </div>
        </div>
      </div>

      <div class="section d-flex flex-column gap-3 flex-sm-row p-3">
        <div class="row-header">
          <h6 class="fw-bold">{{ $t('forms.slug') }}</h6>
        </div>
        <div class="d-flex flex-column gap-1 flex-grow-1" :key="values.name">
          <TextInput
            :value="
              values.name
                ?.replace(/[^a-zA-Z0-9 ]/g, ' ')
                .trim()
                .replace(/\W+/g, '-')
                .toLowerCase()
            "
            name="slug"
            type="text"
          />
          <small class="text-light-alt">{{ $t('forms.seo-item') }}</small>
        </div>
      </div>
      <div class="section bg-alt d-flex flex-row p-3 justify-content-end">
        <button :disabled="!meta.valid || !meta.dirty || loading" class="btn btn-primary px-2" type="submit">
          <span v-if="!loading">{{ $t('actions.save-changes') }}</span>
          <span v-else>{{ $t('actions.loading') }}</span>
        </button>
      </div>
    </Form>
  </div>
</template>
