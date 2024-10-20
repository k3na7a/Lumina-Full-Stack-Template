<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { useFormUtil } from '@/library/utilities/helpers/forms.util'
import { genre as validationSchema } from '../schema/validation.schema'

import TextInput from '@/library/components/inputs/text.input.vue'
import ModalTitleComponent from '@/library/components/modal/base/modal-title.component.vue'
import { GenreDto, igenre } from '@/library/data/dto/games/genre.dto'

const props = defineProps<{
  genre?: GenreDto
  title: string
  action: string
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: igenre) => {
  loading.value = true
  await props.callback(values).then(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" :initial-values="genre" v-slot="{ meta, values }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t(title)" />

      <div class="d-flex flex-column gap-1">
        <TextInput name="name" label="forms.name" type="text" />
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
          <div v-if="true" class="containter">{{ $t(action) }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
