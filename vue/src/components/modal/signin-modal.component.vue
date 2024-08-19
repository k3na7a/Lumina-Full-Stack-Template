<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { ROUTE_NAMES } from '@/router/routes'
import { credentials } from '@/library/dto/JWT.dto'
import { useFormUtil } from '@/helpers/vee-validate.util'

import TextInput from '@/components/inputs/text.input.component.vue'
import ModalTitleComponent from './base/modal-title.component.vue'

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

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: credentials) => {
  state.loading = true
  props.callback(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }">
    <ModalTitleComponent title="authentication.log-in.modal-title" />
    <div class="d-flex flex-column">
      <TextInput autocomplete="email" class="pb-3" name="email" type="email" label="forms.email" />
      <TextInput autocomplete="current-password" class="mb-1" name="password" type="password" label="forms.password" />
      <div>
        <RouterLink target="_blank" :to="{ name: ROUTE_NAMES.ACCOUNT_RECOVERY }" class="btn btn-link fw-normal">
          {{ $t('authentication.log-in.trouble') }}
        </RouterLink>
      </div>
    </div>
    <div class="d-grid mt-3">
      <button
        target="_blank"
        :to="{ name: 'home' }"
        :disabled="!meta.valid || state.loading || !meta.dirty"
        class="btn btn-primary px-0"
        type="submit"
      >
        <div v-if="!state.loading" class="containter">{{ $t('actions.log-in') }}</div>
        <div v-else class="containter">{{ $t('actions.loading') }}</div>
      </button>
    </div>
  </Form>
</template>
