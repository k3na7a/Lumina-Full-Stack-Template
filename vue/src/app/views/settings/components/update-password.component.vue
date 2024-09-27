<script setup lang="ts">
import { computed, ComputedRef, reactive } from 'vue'
import { Form } from 'vee-validate'

import TextInput from '@/app/components/inputs/input.text.component.vue'
import PasswordValidationList from '@/app/components/labels/password-validation-list.component.vue'

import { useFormUtil } from '@/library/helpers/forms.util'
import { UserDto, UpdatePassword } from '@/library/dto/user.dto'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { SettingsService } from '../services/settings.service'
import { updatePassword as validationSchema } from '../schema/validation.schema'

const { getSubmitFn } = useFormUtil()
const { updatePassword } = SettingsService

const authStore: AuthStore = useAuthStore()

const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
const state = reactive<{ loading: boolean; open: boolean }>({ loading: false, open: false })

const onSubmit = getSubmitFn(validationSchema, async (values: UpdatePassword) => {
  state.loading = true
  updatePassword(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form v-on:submit="onSubmit" :validation-schema v-slot="{ meta }" :key="JSON.stringify(user?.updatedAt)">
    <div class="d-flex flex-column flex-sm-row p-3">
      <div class="row-header pe-3 mb-2 mb-sm-0">
        <h6 class="fw-bold">{{ $t('forms.password') }}</h6>
      </div>

      <template v-if="!state.open">
        <div class="d-flex flex-grow-1 text-light-alt">
          <i18n-t
            keypath="administration.settings.security-privacy.security.password.improve-security"
            tag="p"
            scope="global"
          >
            <a
              href="javascript:void(0)"
              v-on:click="state.open = !state.open"
              class="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              {{ $t('administration.settings.security-privacy.security.password.change-password') }}
            </a>
          </i18n-t>
        </div>
      </template>

      <template v-else>
        <div class="d-flex flex-column flex-grow-1">
          <div class="row align-items-start flex-grow-1 mb-2">
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" autocomplete="current-password" name="current_password" type="password" />
              <small>{{ $t('forms.current-password') }}</small>
            </div>
          </div>
          <div class="row gy-2 align-items-start flex-grow-1 mb-2">
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" autocomplete="new-password" name="password" type="password" />
              <small>{{ $t('forms.new-password') }}</small>
              <PasswordValidationList />
            </div>
            <div class="col-12 col-md-6">
              <TextInput class="mb-1" autocomplete="new-password" name="confirm_password" type="password" />
              <small>{{ $t('actions.confirm-new-password') }}</small>
            </div>
          </div>

          <div class="d-flex flex-row justify-content-end">
            <button class="btn btn-secondary px-2" type="button" v-on:click="state.open = !state.open">
              {{ $t('actions.cancel') }}
            </button>
            <button
              :disabled="!meta.valid || state.loading || !meta.dirty"
              class="btn btn-primary px-2 ms-2"
              type="submit"
            >
              {{ $t('actions.save-changes') }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </Form>
</template>
