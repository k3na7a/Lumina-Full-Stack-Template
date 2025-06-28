<script setup lang="ts">
import { Form } from 'vee-validate'

import TextInput from '@/shared/components/inputs/text.input.vue'
import ModalTitleComponent from '@/shared/components/modal/base/modal-title.component.vue'

import { proptype, usePasswordModal } from './composables/password.composable'

const { callback, title, body, action } = defineProps<proptype>()
const { onSubmit, loading, validationSchema } = usePasswordModal(callback)
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="title" />
      <div class="d-flex flex-column gap-2">
        <div class="d-flex flex-column">
          <h6 class="fw-normal text-light-alt">{{ body }}</h6>
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
          <div v-if="!loading" class="containter">{{ action }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
