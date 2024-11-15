<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import { ROUTE_NAMES } from '@/app/router/routes'
import { useFormUtil } from '@/library/utilities/helpers/forms.util'

import TextInput from '@/app/components/inputs/text.input.vue'
import ModalTitleComponent from '@/app/components/modal/base/modal-title.component.vue'

import { signIn as validationSchema } from '../schema/validation.schema'
import { credentials } from '@/library/data/dto/authentication/JWT.dto'

const props = defineProps<{
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
  <Form @submit="onSubmit" :validation-schema v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t('authentication.log-in.modal-title')" />
      <div class="d-flex flex-column gap-3">
        <TextInput autocomplete="email" name="email" type="email" label="forms.email" />
        <div class="d-flex flex-column gap-1">
          <TextInput autocomplete="current-password" name="password" type="password" label="forms.password" />
          <div class="d-flex justify-content-start">
            <RouterLink target="_blank" :to="{ name: ROUTE_NAMES.ACCOUNT_RECOVERY }" class="btn btn-link fw-normal">
              {{ $t('authentication.log-in.trouble') }}
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="d-grid">
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
    </div>
  </Form>
</template>
