<script setup lang="ts">
import { computed, ComputedRef, reactive } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import TextInput from '@/app/components/inputs/text.input.vue'

import { useFormUtil } from '@/library/utils/forms.util'
import { UpdateEmail, UserDto } from '@/library/data/dto/user.dto'
import { SettingsController } from '../controllers/settings.controller'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'

const { updateEmail } = SettingsController
const { getSubmitFn } = useFormUtil()

const authStore: AuthStore = useAuthStore()

const state = reactive<{ loading: boolean; open: boolean }>({ loading: false, open: false })
const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)

const validationSchema = Yup.object().shape({
  password: Yup.string().required(),
  email: Yup.string().email().required(),
  confirm_email: Yup.string()
    .required()
    .oneOf([Yup.ref('email')])
})

const onSubmit = getSubmitFn(validationSchema, async (values: UpdateEmail): Promise<void> => {
  state.loading = true
  updateEmail(values).finally(() => (state.loading = false))
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
        <h6 class="fw-bold">{{ $t('forms.email') }}</h6>
      </div>

      <template v-if="!state.open">
        <div class="d-flex flex-grow-1 flex-nowrap gap-2">
          <div class="d-flex flex-column flex-grow-1 gap-1 overflow-hidden">
            <h4 style="max-width: 240px" class="fw-semibold text-truncate">{{ user?.email }}</h4>
            <p class="fw-normal text-light-alt">
              {{ $t('settings.security-privacy.contact.email-linked') }}
            </p>
          </div>
          <div class="flex-shrink-1">
            <button class="btn btn-dark btn-icon-sm px-0" type="button" @click="state.open = !state.open">
              <font-awesome-icon size="sm" :icon="['fas', 'pen']" />
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="d-flex flex-column flex-grow-1 gap-2">
          <div class="row gy-2 align-items-start flex-grow-1">
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <TextInput autocomplete="email" name="email" type="email" />
              <small>{{ $t('forms.new-email') }}</small>
            </div>
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <TextInput name="confirm_email" type="text" />
              <small>{{ $t('actions.confirm-new-email') }}</small>
            </div>
          </div>

          <div class="row align-items-start flex-grow-1">
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <TextInput autocomplete="current-password" name="password" type="password" />
              <small>{{ $t('forms.current-password') }}</small>
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
