<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { useFormUtil } from '@/library/utilities/helpers/forms.util'
import { game as validationSchema } from '../schema/validation.schema'

import TextInput from '@/library/components/inputs/text.input.vue'
import ModalTitleComponent from '@/library/components/modal/base/modal-title.component.vue'
import MultiSelectInput from '@/library/components/inputs/multi-select.input.vue'
import FileInput from '@/library/components/inputs/file.input.vue'

import { GameLibraryService } from '../service/game-library.service'
import DateInput from '@/library/components/inputs/date.input.vue'
import { igame } from '@/library/data/dto/games/game.dto'
import { GenreDto } from '@/library/data/dto/games/genre.dto'
import { PlatformDto } from '@/library/data/dto/games/platform.dto'
import { SeriesDto } from '@/library/data/dto/games/series.dto'
import { DeveloperDto } from '@/library/data/dto/games/developer.dto'
import { PublisherDto } from '@/library/data/dto/games/publisher.dto'
import { GametypeDto } from '@/library/data/dto/games/gametype.dto'

const props = defineProps<{
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)

const platforms = ref<Array<PlatformDto>>([])
const genres = ref<Array<GenreDto>>([])
const series = ref<Array<SeriesDto>>([])
const developers = ref<Array<DeveloperDto>>([])
const publishers = ref<Array<PublisherDto>>([])
const gametypes = ref<Array<GametypeDto>>([])

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: igame) => {
  loading.value = true
  await props.callback(values).finally(() => {
    loading.value = false
  })
})

async function getFormData(): Promise<void> {
  await Promise.all([
    GameLibraryService.platforms.getAll(),
    GameLibraryService.genres.getAll(),
    GameLibraryService.series.getAll(),
    GameLibraryService.developers.getAll(),
    GameLibraryService.publishers.getAll(),
    GameLibraryService.gametypes.getAll()
  ]).then(
    ([platform_list, genre_list, series_list, developer_list, publisher_list, gametype_list]: [
      Array<PlatformDto>,
      Array<GenreDto>,
      Array<SeriesDto>,
      Array<DeveloperDto>,
      Array<PublisherDto>,
      Array<GametypeDto>
    ]) => {
      platforms.value = platform_list.sort(function (a, b) {
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
      })
      genres.value = genre_list.sort(function (a: GenreDto, b: GenreDto) {
        return a.name.localeCompare(b.name)
      })
      series.value = series_list.sort(function (a: SeriesDto, b: SeriesDto) {
        return a.name.localeCompare(b.name)
      })
      developers.value = developer_list.sort(function (a: DeveloperDto, b: DeveloperDto) {
        return a.name.localeCompare(b.name)
      })
      publishers.value = publisher_list.sort(function (a: PublisherDto, b: PublisherDto) {
        return a.name.localeCompare(b.name)
      })
      gametypes.value = gametype_list.sort(function (a: GametypeDto, b: GametypeDto) {
        return a.name.localeCompare(b.name)
      })
    }
  )
}

await getFormData()
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta, values }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t('Create new game')" />

      <div class="d-flex flex-column gap-1">
        <TextInput name="name" label="Name" type="text" />
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="d-block fw-semibold">{{ $t('Cover') }}</h6>
        <FileInput name="cover" />
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('Release Date') }}</h6>
        <DateInput name="release_date" />
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('Platforms') }}</h6>
        <MultiSelectInput filter-key="name" name="platforms" :options="platforms">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </MultiSelectInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('Genres') }}</h6>
        <MultiSelectInput filter-key="name" name="genres" :options="genres">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </MultiSelectInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('Series') }}</h6>
        <MultiSelectInput filter-key="name" name="series" :options="series">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </MultiSelectInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('Developers') }}</h6>
        <MultiSelectInput filter-key="name" name="developers" :options="developers">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </MultiSelectInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('Publishers') }}</h6>
        <MultiSelectInput filter-key="name" name="publishers" :options="publishers">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </MultiSelectInput>
      </div>

      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('Gametypes') }}</h6>
        <MultiSelectInput filter-key="name" name="gametypes" :options="gametypes">
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </MultiSelectInput>
      </div>

      <div class="d-flex flex-column gap-1" :key="values.name">
        <TextInput
          disabled
          :value="
            values.name
              ?.replace(/[^a-zA-Z0-9 ]/g, ' ')
              .trim()
              .replace(/\W+/g, '-')
              .toLowerCase()
          "
          name="slug"
          label="URL Slug"
          type="text"
        />
        <small class="text-light-alt">{{ $t('SEO-friendly text used in the URLs of your content items.') }}</small>
      </div>

      <div class="d-grid">
        <button :disabled="!meta.valid || loading" class="btn btn-primary px-0" type="submit">
          <div v-if="true" class="containter">{{ $t('Create Game') }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
