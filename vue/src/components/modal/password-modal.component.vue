<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { useFormUtil } from '@/helpers/vee-validate.util'

import TextInput from '@/components/inputs/text.input.component.vue'

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
    <div class="d-flex justify-content-center">
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0 me-2">
          <img id="logo" src="/media/logo.svg" style="width: 30px" />
        </div>
        <div class="flex-grow-1">
          <h4 class="text-light fw-bold display-font">{{ $t(props.title) }}</h4>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column mt-3">
      <h6 class="fw-normal text-muted">{{ props.body }}</h6>
    </div>
    <div class="d-flex flex-column mt-3">
      <TextInput autocomplete="current-password" class="mb-1" name="password" type="password" />
      <small>{{ $t('authentication.password-security') }}</small>
    </div>
    <div class="d-grid mt-3">
      <button :disabled="!meta.valid || state.loading" class="btn btn-primary px-0" type="submit">
        <div v-if="!state.loading" class="containter">{{ props.action }}</div>
        <div v-else class="containter">{{ $t('actions.loading') }}</div>
      </button>
    </div>
  </Form>
</template>
