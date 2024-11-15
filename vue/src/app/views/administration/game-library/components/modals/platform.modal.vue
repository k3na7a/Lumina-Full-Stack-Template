<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import { useI18n } from 'vue-i18n'

import { useFormUtil } from '@/library/utilities/helpers/forms.util'

import TextInput from '@/app/components/inputs/text.input.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'
import InputDateComponent from '@/app/components/inputs/date.input.vue'
import { PlatformDto, iplatform } from '@/library/data/dto/games/platform.dto'

const { t } = useI18n()

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  release_date: Yup.date().required(),
  abbreviation: Yup.string().required(),
  slug: Yup.string().required()
})

const props = defineProps<{
  title: string
  action: string
  platform?: PlatformDto
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: iplatform) => {
  loading.value = true
  await props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" :initial-values="platform" v-slot="{ meta, values }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="t(title, { item: props.platform?.name })" />

      <div class="d-flex flex-column gap-1">
        <TextInput name="name" label="forms.name" type="text" />
      </div>

      <div class="d-flex flex-column gap-1">
        <div class="row gy-3 align-items-start flex-grow-1">
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <h6 class="fw-semibold">{{ $t('forms.release-date') }}</h6>
            <InputDateComponent name="release_date" :value="platform?.release_date" />
          </div>
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <TextInput label="forms.abbreviation" name="abbreviation" type="text" />
          </div>
        </div>
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
          label="forms.slug"
          type="text"
        />
        <small class="text-light-alt">{{ $t('forms.seo-item') }}</small>
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
