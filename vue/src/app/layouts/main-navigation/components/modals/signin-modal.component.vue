<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { ROUTE_NAMES } from '@/app/router/routes.enum'
import { credentials } from '@/library/dto/JWT.dto'
import { useFormUtil } from '@/library/helpers/forms.util'

import TextInput from '@/app/components/inputs/input.text.component.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'

import { signIn as validationSchema } from '../../schema/validation.schema'

const props = defineProps<{
  close: () => void
  callback: (values: credentials) => Promise<void>
}>()

const loading = ref<boolean>(false)
const validateUtil = useFormUtil()

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: credentials) => {
  loading.value = true
  props.callback(values).finally(() => {
    loading.value = false
  })
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
        :disabled="!meta.valid || loading || !meta.dirty"
        class="btn btn-primary px-0"
        type="submit"
      >
        <div v-if="!loading" class="containter">{{ $t('actions.log-in') }}</div>
        <div v-else class="containter">{{ $t('actions.loading') }}</div>
      </button>
    </div>
  </Form>
</template>
