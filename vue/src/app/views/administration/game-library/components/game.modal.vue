<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { useFormUtil } from '@/utilities/forms.util'
import { game as validationSchema } from '../schema/validation.schema'

import TextInput from '@/app/components/inputs/text.input.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'
import MultiSelectInput from '@/app/components/inputs/multi-select.input.vue'
import FileInput from '@/app/components/inputs/file.input.vue'

import { GameLibraryService } from '../service/game-library.service'
import { GenreDto, igame, PlatformDto } from '@/apis/localhost/dto/game-library.dto'
import DateInput from '@/app/components/inputs/date.input.vue'

const props = defineProps<{
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)
const platforms = ref<Array<PlatformDto>>([])
const genres = ref<Array<GenreDto>>([])

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: igame) => {
  loading.value = true
  props.callback(values).finally(() => {
    loading.value = false
  })
})

async function getFormData(): Promise<void> {
  loading.value = true

  await Promise.all([GameLibraryService.platforms.getAll(), GameLibraryService.genres.getAll()])
    .then(([platform_list, genre_list]: [Array<PlatformDto>, Array<GenreDto>]) => {
      platforms.value = platform_list.sort(function (a, b) {
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
      })
      genres.value = genre_list
    })
    .finally(() => (loading.value = false))
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
        <button :disabled="!meta.valid" class="btn btn-primary px-0" type="submit">
          <div v-if="true" class="containter">{{ $t('Create Game') }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
