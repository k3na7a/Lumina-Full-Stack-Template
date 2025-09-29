<script setup lang="ts">
import { Form } from 'vee-validate'

import { ROUTE_NAMES } from '@lib/enums/route-names.enum'

import ModalTitleComponent from '@/shared/components/modal/base/modal-title.component.vue'
import TextInput from '@/shared/components/inputs/text.input.vue'

import { proptype, useSignInModal } from './composables/signin.composable'

const { callback } = defineProps<proptype>()
const { validationSchema, onSubmit, loading } = useSignInModal(callback)
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t('authentication.log-in.modal-title')" />
      <div class="d-flex flex-column gap-3">
        <TextInput
          autocomplete="email"
          name="email"
          type="email"
          label="forms.email"
          :placeholder="$t('actions.enter-email')"
        />
        <div class="d-flex flex-column gap-1">
          <TextInput
            autocomplete="current-password"
            name="password"
            type="password"
            label="forms.password"
            :placeholder="$t('actions.enter-password')"
          />
          <div class="d-flex justify-content-start">
            <RouterLink target="_blank" :to="{ name: ROUTE_NAMES.ACCOUNT_RECOVERY }" class="btn btn-link fw-normal">
              {{ $t('authentication.log-in.trouble') }}
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="d-grid">
        <button :disabled="!meta.valid || loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
          <div v-if="!loading" class="containter">{{ $t('actions.log-in') }}</div>
          <div v-else class="containter">{{ $t('actions.loading') }}</div>
        </button>
      </div>
    </div>
  </Form>
</template>
