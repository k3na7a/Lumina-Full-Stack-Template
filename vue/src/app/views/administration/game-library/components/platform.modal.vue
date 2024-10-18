<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { useFormUtil } from '@/utilities/forms.util'
import { platform as validationSchema } from '../schema/validation.schema'

import TextInput from '@/app/components/inputs/text.input.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'
import InputDateComponent from '@/app/components/inputs/date.input.vue'

import { iplatform, PlatformDto } from '@/apis/localhost/dto/game-library.dto'

const props = defineProps<{
  platform?: PlatformDto
  callback: (values: any) => Promise<void>
}>()

const loading = ref<boolean>(false)

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: iplatform) => {
  loading.value = true
  props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" :initial-values="platform" v-slot="{ meta, values }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t('Create new platform')" />

      <div class="d-flex flex-column gap-1">
        <TextInput name="name" label="Platform Name" type="text" />
      </div>

      <div class="d-flex flex-column gap-1">
        <div class="row gy-3 align-items-start flex-grow-1">
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <h6 class="fw-semibold">{{ $t('Release Date') }}</h6>
            <InputDateComponent name="release_date" :value="platform?.release_date" />
          </div>
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <TextInput label="Abbreviation" name="abbreviation" type="text" />
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
          label="URL Slug"
          type="text"
        />
        <small class="text-light-alt">{{ $t('SEO-friendly text used in the URLs of your content items.') }}</small>
      </div>

      <div class="d-grid">
        <button :disabled="!meta.valid" class="btn btn-primary px-0" type="submit">
          <div v-if="true" class="containter">{{ $t('Create Platform') }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
