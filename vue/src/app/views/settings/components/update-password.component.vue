<script setup lang="ts">
import { computed, ComputedRef, reactive } from 'vue'
import { Form } from 'vee-validate'
import TextInput from '@/app/components/inputs/text.input.vue'
import PasswordValidationList from '@/app/components/labels/password-validation-list.component.vue'
import { useFormUtil } from '@/library/utils/forms.util'
import { UserDto, UpdatePassword } from '@/library/apis/localhost/dto/user.dto'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { SettingsController } from '../controllers/settings.controller'
import { validationSchema } from '../schema/update-password-validation.schema'

const { getSubmitFn } = useFormUtil()
const { updatePassword } = SettingsController

const authStore: AuthStore = useAuthStore()

const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
const state = reactive<{ loading: boolean; open: boolean }>({ loading: false, open: false })

const onSubmit = getSubmitFn(validationSchema, async (values: UpdatePassword) => {
  state.loading = true
  updatePassword(values).finally(() => (state.loading = false))
})
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="validationSchema"
    v-slot="{ meta }"
    :key="JSON.stringify(user?.updatedAt)"
  >
    <div class="d-flex flex-column flex-sm-row gap-3 p-3">
      <div class="row-header">
        <h6 class="fw-bold">{{ $t('forms.password') }}</h6>
      </div>

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
              <TextInput autocomplete="current-password" name="current_password" type="password" />
              <small>{{ $t('forms.current-password') }}</small>
            </div>
          </div>
          <div class="row gy-2 align-items-start flex-grow-1">
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <TextInput autocomplete="new-password" name="password" type="password" />
              <div class="d-flex flex-column">
                <small>{{ $t('forms.new-password') }}</small>
                <PasswordValidationList />
              </div>
            </div>
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <TextInput autocomplete="new-password" name="confirm_password" type="password" />
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
    </div>
  </Form>
</template>
