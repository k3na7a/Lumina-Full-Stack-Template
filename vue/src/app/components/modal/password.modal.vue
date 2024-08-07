<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { useFormUtil } from '@/helpers/utils/vee-validate.util'

import TextInput from '@/app/components/inputs/text.input.component.vue'

type FormValues = { password: string }
type LocalState = { loading: boolean }
type PropType = {
  close: () => void
  callback: (values: FormValues) => Promise<void>
  title: string
  body: string
  action: string
}

const props = defineProps<PropType>()
const state = reactive<LocalState>({ loading: false })

const validateUtil = useFormUtil()

const validationSchema = Yup.object().shape({
  password: Yup.string().required()
})

const onSubmit = validateUtil.getSubmitFn(validationSchema, (values: FormValues) => {
  state.loading = true
  props.callback(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }">
    <div class="d-flex flex-column">
      <h4 class="text-light fw-bold display-font mb-1">{{ props.title }}</h4>
      <h6 class="fw-normal mb-3 text-muted">{{ props.body }}</h6>
    </div>
    <div class="d-flex flex-column mb-3">
      <TextInput autocomplete="current-password" class="mb-1" name="password" type="password" />
      <small>For security, please enter your password to continue.</small>
    </div>
    <div class="d-grid">
      <button :disabled="!meta.valid || state.loading" class="btn btn-primary px-0" type="submit">
        <div v-if="!state.loading" class="containter">{{ props.action }}</div>
        <div v-else class="containter">{{ $t('actions.loading') }}</div>
      </button>
    </div>
  </Form>
</template>
