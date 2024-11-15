<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { useFormUtil } from '@/library/utilities/helpers/forms.util'

import TextInput from '@/app/components/inputs/text.input.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'
import FileInput from '@/app/components/inputs/file.input.vue'

import SearchPaginatedInput from '@/app/components/inputs/search-paginated-input.input.vue'

import { GameLibraryService } from '../../service/game-library.service'
import DateInput from '@/app/components/inputs/date.input.vue'
import { GameDto, igame } from '@/library/data/dto/games/game.dto'
import { GametypeDto } from '@/library/data/dto/games/gametype.dto'
import SelectInput from '@/app/components/inputs/select.input.vue'

import { DeveloperDto } from '@/library/data/dto/games/developer.dto'
import { GenreDto } from '@/library/data/dto/games/genre.dto'
import { PlatformDto } from '@/library/data/dto/games/platform.dto'
import { PublisherDto } from '@/library/data/dto/games/publisher.dto'
import { SeriesDto } from '@/library/data/dto/games/series.dto'

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  cover: Yup.mixed<File>().required(),
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

const props = defineProps<{
  game?: GameDto
  action: string
  title: string
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)
const gametypes = ref<Array<GametypeDto>>([])

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: igame) => {
  loading.value = true
  await props.callback(values).finally(() => {
    loading.value = false
  })
})

async function getFormData(): Promise<void> {
  await Promise.all([GameLibraryService.gametypes.getAll()]).then(([gametype_list]: [Array<GametypeDto>]) => {
    gametypes.value = gametype_list.sort(function (a: GametypeDto, b: GametypeDto) {
      return a.name.localeCompare(b.name)
    })
  })
}

await getFormData()
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="validationSchema"
    :initial-values="{
      ...game,
      children: game?.children || [],
      platforms: game?.platforms || [],
      genres: game?.genres || [],
      series: game?.series || [],
      developers: game?.developers || [],
      publishers: game?.publishers || [],
      cover: undefined
    }"
    v-slot="{ meta, values }"
  >
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t(title)" />

      <div class="d-flex flex-column gap-1">
        <TextInput name="name" label="forms.name" type="text" />
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="d-block fw-semibold">{{ $t('forms.cover') }}</h6>
        <FileInput name="cover" />
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.release-date') }}</h6>
        <DateInput name="release_date" />
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="d-block fw-semibold">{{ $t('forms.gametype') }}</h6>
        <SelectInput name="gametype" :options="gametypes">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </SelectInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.related-content') }}</h6>
        <SearchPaginatedInput name="children" :callback="GameLibraryService.games.getPaginated">
          <template #option="{ option }">
            <span>{{ option.release_date.getFullYear() }} - {{ option.name }}</span>
          </template>
        </SearchPaginatedInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.platforms') }}</h6>
        <SearchPaginatedInput name="platforms" :callback="GameLibraryService.platforms.getPaginated">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </SearchPaginatedInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.genres') }}</h6>
        <SearchPaginatedInput name="genres" :callback="GameLibraryService.genres.getPaginated">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </SearchPaginatedInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.series') }}</h6>
        <SearchPaginatedInput name="series" :callback="GameLibraryService.series.getPaginated">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </SearchPaginatedInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.developers') }}</h6>
        <SearchPaginatedInput name="developers" :callback="GameLibraryService.developers.getPaginated">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </SearchPaginatedInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.publishers') }}</h6>
        <SearchPaginatedInput name="publishers" :callback="GameLibraryService.publishers.getPaginated">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </SearchPaginatedInput>
      </div>

      <div class="d-flex flex-column gap-1" :key="values.name">
        <TextInput
          :value="
            values.name
              ?.replace(/[^a-zA-Z0-9 ]/g, ' ')
              .trim()
              .replace(/\W+/g, '-')
              .toLowerCase()
          "
          name="slug"
          label="forms.slug"
          type="text"
        />
        <small class="text-light-alt">{{ $t('forms.seo-item') }}</small>
      </div>

      <div class="d-grid">
        <button :disabled="!meta.valid || loading" class="btn btn-primary px-0" type="submit">
          <div v-if="true" class="containter">{{ $t(props.action) }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
