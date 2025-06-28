<script setup lang="ts">
import { Form } from 'vee-validate'

import TextInput from '@/shared/components/inputs/text.input.vue'
import PasswordValidationList from '@/shared/components/labels/password-validation-list.component.vue'

import { useUpdatePassword, proptype } from '../composables/update-password.composable'

const { user, callback } = defineProps<proptype>()
const { validationSchema, onSubmit, state } = useUpdatePassword(callback)
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="validationSchema"
    v-slot="{ meta }"
    :key="JSON.stringify(user?.updatedAt)"
    class="w-100"
  >
    <template v-if="!state.open">
      <div class="d-flex flex-grow-1 text-light-alt">
        <i18n-t keypath="settings.security-privacy.security.password.improve-security" tag="p" scope="global">
          <a
            href="javascript:void(0)"
            @click="state.open = !state.open"
            class="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
          >
            {{ $t('settings.security-privacy.security.password.change-password') }}
          </a>
        </i18n-t>
      </div>
    </template>

    <template v-else>
      <div class="d-flex flex-column flex-grow-1 gap-2">
        <div class="row align-items-start flex-grow-1">
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput
              autocomplete="current-password"
              name="current_password"
              type="password"
              :placeholder="$t('actions.enter-password')"
            />
            <small>{{ $t('forms.current-password') }}</small>
          </div>
        </div>
        <div class="row gy-2 align-items-start flex-grow-1">
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput
              autocomplete="new-password"
              name="password"
              type="password"
              :placeholder="$t('actions.enter-new-password')"
            />
            <div class="d-flex flex-column">
              <small>{{ $t('forms.new-password') }}</small>
              <PasswordValidationList />
            </div>
          </div>
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <TextInput
              autocomplete="new-password"
              name="confirm_password"
              type="password"
              :placeholder="$t('actions.enter-new-password-confirm')"
            />
            <small>{{ $t('actions.confirm-new-password') }}</small>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-end gap-2">
          <button class="btn btn-secondary px-2" type="button" @click="state.open = !state.open">
            {{ $t('actions.cancel') }}
          </button>
          <button :disabled="!meta.valid || state.loading || !meta.dirty" class="btn btn-primary px-2" type="submit">
            {{ $t('actions.save-changes') }}
          </button>
        </div>
      </div>
    </template>
  </Form>
</template>
