<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { useFormUtil } from '@/core/utils/forms.util'

import TextInput from '@/shared/components/inputs/text.input.vue'
import ModalTitleComponent from '@/shared/components/modal/base/modal-title.component.vue'

import { FormValues, validationSchema } from './composables/password-validation.schema'

const props = defineProps<{
  close: () => void
  callback: (values: FormValues) => Promise<void>
  title: string
  body: string
  action: string
}>()

const loading = ref<boolean>(false)
const { getSubmitFn } = useFormUtil()

const onSubmit = getSubmitFn(validationSchema, (values: FormValues) => {
  loading.value = true
  props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="props.title" />
      <div class="d-flex flex-column gap-2">
        <div class="d-flex flex-column">
          <h6 class="fw-normal text-light-alt">{{ props.body }}</h6>
        </div>
        <div class="d-flex flex-column">
          <TextInput
            autocomplete="current-password"
            class="mb-1"
            name="password"
            type="password"
            :placeholder="$t('actions.enter-password')"
          />
          <small class="text-light-alt">{{ $t('authentication.password-security') }}</small>
        </div>
      </div>
      <div class="d-grid">
        <button :disabled="!meta.valid || loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
          <div v-if="!loading" class="containter">{{ props.action }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
