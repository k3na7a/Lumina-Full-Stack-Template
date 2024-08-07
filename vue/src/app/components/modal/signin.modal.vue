<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { credentials } from '@/library/dto/JWT.dto'
import { useFormUtil } from '@/helpers/utils/vee-validate.util'

import TextInput from '@/app/components/inputs/text.input.component.vue'

type LocalState = { loading: boolean }
type PropType = {
  close: () => void
  callback: (values: credentials) => Promise<void>
}

const props = defineProps<PropType>()
const state = reactive<LocalState>({ loading: false })

const validateUtil = useFormUtil()

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required()
})

const onSubmit = validateUtil.getSubmitFn(validationSchema, (values: credentials) => {
  state.loading = true
  props.callback(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }">
    <div class="d-flex justify-content-center pb-3">
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
          <img id="logo" src="/media/logo.svg" style="width: 30px" />
        </div>
        <div class="flex-grow-1 ms-2">
          <h4 class="text-light fw-bold display-font">{{ $t('authentication.log-in-title') }}</h4>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column">
      <TextInput autocomplete="email" class="pb-3" name="email" type="email" label="general.email" />
      <TextInput
        autocomplete="current-password"
        class="pb-2"
        name="password"
        type="password"
        label="general.password"
      />
      <div>
        <p class="text-primary d-inline fw-semibold hover-cursor-pointer hover-underline">
          {{ $t('authentication.trouble') }}
        </p>
      </div>
    </div>
    <div class="d-grid mt-3">
      <button :disabled="!meta.valid || state.loading" class="btn btn-primary px-0" type="submit">
        <div v-if="!state.loading" class="containter">{{ $t('actions.log-in') }}</div>
        <div v-else class="containter">{{ $t('actions.loading') }}</div>
      </button>
    </div>
  </Form>
</template>
